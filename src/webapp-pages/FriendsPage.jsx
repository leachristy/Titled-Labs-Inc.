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
        className={`min-h-screen pt-20 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
        }`}
      >
        <div className="max-w-4xl p-6 mx-auto">
          <h1
            className={`text-3xl font-bold mb-6 ${
              isEarthy ? "text-brown-800" : "text-white"
            }`}
          >
            Friends
          </h1>

          {error && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                isEarthy
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-red-900/20 text-red-200 border border-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div
              className={`rounded-lg shadow-lg p-12 text-center ${
                isEarthy
                  ? "bg-white border-tan-200"
                  : "bg-pale-lavender border-blue-grey"
              } border`}
            >
              <div className="flex flex-col items-center justify-center">
                <svg
                  className={`animate-spin h-12 w-12 mb-4 ${
                    isEarthy ? "text-rust-500" : "text-light-lavender"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p
                  className={`text-lg ${
                    isEarthy ? "text-brown-600" : "text-gray-300"
                  }`}
                >
                  Loading friends...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Incoming requests */}
              <section className="mb-8">
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    isEarthy ? "text-brown-800" : "text-white"
                  }`}
                >
                  Friend Requests
                </h2>
                {requests.length === 0 ? (
                  <div
                    className={`rounded-lg p-6 text-center ${
                      isEarthy
                        ? "bg-white border-tan-200 text-brown-600"
                        : "bg-pale-lavender border-blue-grey text-blue-gray"
                    } border shadow-md`}
                  >
                    <p>No pending requests.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className={`flex items-center justify-between p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${
                          isEarthy
                            ? "bg-white border-tan-200"
                            : "bg-pale-lavender border-blue-grey"
                        } border`}
                      >
                        <div
                          className="flex items-center cursor-pointer flex-1"
                          onClick={() => navigate(`/profile/${req.fromUid}`)}
                        >
                          <div
                            className={`flex items-center justify-center w-12 h-12 mr-4 font-bold rounded-full ${
                              isEarthy
                                ? "bg-rust-200 text-rust-700"
                                : "bg-light-lavender text-white"
                            }`}
                          >
                            {req.fromProfile?.firstName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${
                                isEarthy ? "text-brown-800" : "text-gray-900"
                              }`}
                            >
                              {req.fromProfile
                                ? `${req.fromProfile.firstName || ""} ${
                                    req.fromProfile.lastName || ""
                                  }`
                                : "Unknown User"}
                            </p>
                            <p
                              className={`text-sm ${
                                isEarthy ? "text-brown-500" : "text-gray-600"
                              }`}
                            >
                              wants to be your friend
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(req)}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition shadow-md hover:shadow-lg ${
                              isEarthy
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(req)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition shadow-md hover:shadow-lg ${
                              isEarthy
                                ? "bg-tan-200 hover:bg-tan-300 text-brown-800"
                                : "bg-gray-200 hover:bg-gray-300 text-charcoal-grey"
                            }`}
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
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    isEarthy ? "text-brown-800" : "text-white"
                  }`}
                >
                  Your Friends ({friends.length})
                </h2>
                {friends.length === 0 ? (
                  <div
                    className={`rounded-lg p-6 text-center ${
                      isEarthy
                        ? "bg-white border-tan-200 text-brown-600"
                        : "bg-pale-lavender border-blue-grey text-blue-gray"
                    } border shadow-md`}
                  >
                    <p>You don't have any friends yet.</p>
                    <p className="text-sm mt-2 opacity-75">
                      Start connecting with others in the community!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friends.map((friend) => (
                      <div
                        key={friend.uid}
                        className={`flex items-center p-4 rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                          isEarthy
                            ? "bg-white border-tan-200"
                            : "bg-pale-lavender border-blue-grey"
                        } border`}
                        onClick={() => navigate(`/profile/${friend.uid}`)}
                      >
                        <div
                          className={`flex items-center justify-center w-12 h-12 mr-4 font-bold rounded-full shrink-0 ${
                            isEarthy
                              ? "bg-rust-200 text-rust-700"
                              : "bg-light-lavender text-white"
                          }`}
                        >
                          {friend.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`flex items-center font-semibold ${
                              isEarthy ? "text-brown-800" : "text-gray-900"
                            }`}
                          >
                            {renderStatusDot(friend)}
                            <span className="truncate">
                              {friend.firstName} {friend.lastName}
                            </span>
                          </p>
                          {friend.bio && (
                            <p
                              className={`text-sm mt-1 truncate ${
                                isEarthy ? "text-brown-500" : "text-gray-600"
                              }`}
                            >
                              {friend.bio}
                            </p>
                          )}
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
