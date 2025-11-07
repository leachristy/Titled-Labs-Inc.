import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../src/firebase";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const FriendsPage = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!user || !user.uid) return;

      setLoading(true);
      setError("");

      try {
        // 1. Load friends (users/{uid}/friends)
        const friendsRef = collection(db, `users/${user.uid}/friends`);
        const friendsSnap = await getDocs(friendsRef);
        const friendUids = friendsSnap.docs.map((d) => d.id);

        const friendProfiles = await Promise.all(
          friendUids.map(async (friendUid) => {
            const profileRef = doc(db, "users", friendUid);
            const profileSnap = await getDoc(profileRef);
            if (!profileSnap.exists()) return null;
            return { uid: friendUid, ...profileSnap.data() };
          })
        );

        setFriends(friendProfiles.filter(Boolean));

        // 2. Load incoming friend requests
        const frRef = collection(db, "friendRequests");
        const reqQ = query(
          frRef,
          where("toUid", "==", user.uid),
          where("status", "==", "pending")
        );
        const reqSnap = await getDocs(reqQ);

        const requestsWithProfiles = await Promise.all(
          reqSnap.docs.map(async (reqDoc) => {
            const data = reqDoc.data();
            const fromRef = doc(db, "users", data.fromUid);
            const fromSnap = await getDoc(fromRef);
            return {
              id: reqDoc.id,
              ...data,
              fromProfile: fromSnap.exists()
                ? { uid: data.fromUid, ...fromSnap.data() }
                : { uid: data.fromUid },
            };
          })
        );

        setRequests(requestsWithProfiles);
      } catch (err) {
        console.error("Error loading friends/requests:", err);
        setError("Failed to load friends. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleAccept = async (request) => {
    if (!user || !user.uid) return;

    try {
      setError("");

      const batch = writeBatch(db);

      const requestRef = doc(db, "friendRequests", request.id);
      batch.update(requestRef, {
        status: "accepted",
        respondedAt: serverTimestamp(),
      });

      const myFriendRef = doc(
        db,
        `users/${user.uid}/friends/${request.fromUid}`
      );
      const theirFriendRef = doc(
        db,
        `users/${request.fromUid}/friends/${user.uid}`
      );

      batch.set(myFriendRef, {
        createdAt: serverTimestamp(),
      });
      batch.set(theirFriendRef, {
        createdAt: serverTimestamp(),
      });

      await batch.commit();

      // Update UI
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      setFriends((prev) => [
        ...prev,
        request.fromProfile || { uid: request.fromUid },
      ]);
    } catch (err) {
      console.error("Error accepting request:", err);
      setError("Failed to accept friend request. Please try again.");
    }
  };

  const handleDecline = async (request) => {
    try {
      setError("");
      const requestRef = doc(db, "friendRequests", request.id);
      await updateDoc(requestRef, {
        status: "declined",
        respondedAt: serverTimestamp(),
      });

      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (err) {
      console.error("Error declining request:", err);
      setError("Failed to decline friend request. Please try again.");
    }
  };

  // Online indicator: expects `online` boolean on user docs
  const renderStatusDot = (friend) => {
    const isOnline = friend.online === true;
    const colorClass = isOnline ? "bg-green-500" : "bg-gray-400";
    const title = isOnline ? "Online" : "Offline";

    return (
      <span
        className={`inline-block w-3 h-3 rounded-full ${colorClass} mr-2`}
        title={title}
      />
    );
  };

  if (!user || !user.uid) {
    // In Untilt they shouldn't hit this because of auth gating
    return <p className="mt-20 text-center">Loading...</p>;
  }

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
        style={{
          backgroundColor: isEarthy ? undefined : "var(--pale-lavender)",
        }}
      >
        <div className="max-w-4xl p-6 mx-auto mt-20">
          <h1 className="mb-4 text-2xl font-bold">Friends</h1>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {loading ? (
            <p>Loading friends...</p>
          ) : (
            <>
              {/* Incoming requests */}
              <section className="mb-8">
                <h2 className="mb-2 text-lg font-semibold">Friend Requests</h2>
                {requests.length === 0 ? (
                  <p className="text-sm text-gray-600">No pending requests.</p>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
                      >
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => navigate(`/profile/${req.fromUid}`)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 mr-3 font-bold text-white bg-gray-400 rounded-full">
                            {req.fromProfile?.firstName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium">
                              {req.fromProfile
                                ? `${req.fromProfile.firstName || ""} ${
                                    req.fromProfile.lastName || ""
                                  }`
                                : "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              wants to be your friend
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(req)}
                            className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(req)}
                            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Friends list */}
              <section>
                <h2 className="mb-2 text-lg font-semibold">Your Friends</h2>
                {friends.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    You don't have any friends yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {friends.map((friend) => (
                      <div
                        key={friend.uid}
                        className="flex items-center justify-between p-3 bg-white rounded-lg shadow cursor-pointer"
                        onClick={() => navigate(`/profile/${friend.uid}`)}
                      >
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 mr-3 font-bold text-white bg-gray-400 rounded-full">
                            {friend.firstName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="flex items-center font-medium">
                              {renderStatusDot(friend)}
                              <span>
                                {friend.firstName} {friend.lastName}
                              </span>
                            </p>
                            {friend.bio && (
                              <p className="text-xs text-gray-500">
                                {friend.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
};
