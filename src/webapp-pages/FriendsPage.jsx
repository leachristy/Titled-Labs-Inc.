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
  deleteDoc,
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
  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!user || !user.uid) return;

      setLoading(true);
      setError("");

      try {
        // friends list
        const friendsRef = collection(db, `users/${user.uid}/friends`);
        const friendsSnap = await getDocs(friendsRef);
        const friendUids = friendsSnap.docs.map((d) => d.id);

        const friendProfiles = await Promise.all(
          friendUids.map(async (friendUid) => {
            const profRef = doc(db, "users", friendUid);
            const profSnap = await getDoc(profRef);
            if (!profSnap.exists()) return null;
            return { uid: friendUid, ...profSnap.data() };
          })
        );
        setFriends(friendProfiles.filter(Boolean));

        // incoming friend requests
        const frRef = collection(db, "friendRequests");
        const reqQ = query(
          frRef,
          where("toUid", "==", user.uid),
          where("status", "==", "pending")
        );
        const reqSnap = await getDocs(reqQ);

        const reqWithProfiles = await Promise.all(
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

        setRequests(reqWithProfiles);

        // blocked users
        const blockedRef = collection(db, `users/${user.uid}/blocked`);
        const blockedSnap = await getDocs(blockedRef);
        const blockedUids = blockedSnap.docs.map((d) => d.id);

        const blockedProfiles = await Promise.all(
          blockedUids.map(async (blockedUid) => {
            const profRef = doc(db, "users", blockedUid);
            const profSnap = await getDoc(profRef);
            if (!profSnap.exists()) return null;
            return { uid: blockedUid, ...profSnap.data() };
          })
        );

        setBlocked(blockedProfiles.filter(Boolean));
      } catch (err) {
        console.error("Error loading friends/requests/blocked:", err);
        setError("Failed to load friends and blocked users. Please try again.");
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

      batch.set(myFriendRef, { createdAt: serverTimestamp() });
      batch.set(theirFriendRef, { createdAt: serverTimestamp() });

      await batch.commit();

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

  // block from requests + friends list
  const handleBlockUser = async (targetUid, options = {}) => {
    if (!user || !user.uid || !targetUid) return;

    try {
      setError("");
      const batch = writeBatch(db);

      const myBlockRef = doc(db, `users/${user.uid}/blocked/${targetUid}`);
      const theirBlockRef = doc(db, `users/${targetUid}/blocked/${user.uid}`);

      batch.set(myBlockRef, { createdAt: serverTimestamp() });
      batch.set(theirBlockRef, { createdAt: serverTimestamp() });

      const myFriendRef = doc(db, `users/${user.uid}/friends/${targetUid}`);
      const theirFriendRef = doc(db, `users/${targetUid}/friends/${user.uid}`);

      batch.delete(myFriendRef);
      batch.delete(theirFriendRef);

      if (options.requestId) {
        const requestRef = doc(db, "friendRequests", options.requestId);
        batch.update(requestRef, {
          status: "blocked",
          respondedAt: serverTimestamp(),
        });
      }

      await batch.commit();

      setFriends((prev) => prev.filter((f) => f.uid !== targetUid));

      if (options.requestId) {
        setRequests((prev) => prev.filter((r) => r.id !== options.requestId));
      } else {
        setRequests((prev) => prev.filter((r) => r.fromUid !== targetUid));
      }

      // add to blocked list locally if we have their profile
      setBlocked((prev) => {
        const already = prev.some((b) => b.uid === targetUid);
        if (already) return prev;
        const fromFriends = friends.find((f) => f.uid === targetUid);
        const fromRequests = requests.find((r) => r.fromUid === targetUid);
        const profile = fromFriends ||
          fromRequests?.fromProfile || {
            uid: targetUid,
            firstName: "",
            lastName: "",
          };
        return [...prev, profile];
      });
    } catch (err) {
      console.error("Error blocking user:", err);
      setError("Failed to block user. Please try again.");
    }
  };

  const handleUnblockUser = async (targetUid) => {
    if (!user || !user.uid || !targetUid) return;

    try {
      setError("");

      await Promise.all([
        deleteDoc(doc(db, `users/${user.uid}/blocked/${targetUid}`)),
        deleteDoc(doc(db, `users/${targetUid}/blocked/${user.uid}`)),
      ]);

      setBlocked((prev) => prev.filter((b) => b.uid !== targetUid));
    } catch (err) {
      console.error("Error unblocking user:", err);
      setError("Failed to unblock user. Please try again.");
    }
  };

  const renderStatusDot = (friend) => {
    const isOnline = friend.online === true;
    const colorClass = isOnline ? "bg-green-500" : "bg-gray-400";
    const title = isOnline ? "Online" : "Offline";

    return (
      <span
        className={`inline-block w-3 h-3 rounded-full mr-2 ${colorClass}`}
        title={title}
      />
    );
  };

  if (!user || !user.uid) {
    return (
      <>
        <UntiltNavBar />
        <div
          className={`min-h-screen pt-20 pb-12 ${
            isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
          }`}
        >
          <p
            className={`mt-20 text-center ${
              isEarthy ? "text-brown-700" : "text-gray-100"
            }`}
          >
            Loading…
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen pt-20 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
        }`}
      >
        <div className="max-w-4xl px-4 mx-auto">
          <h1
            className={`text-3xl font-bold mb-6 ${
              isEarthy ? "text-brown-900" : "text-white"
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
                  ? "bg-white border border-tan-200"
                  : "bg-pale-lavender border border-blue-grey"
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <svg
                  className={`animate-spin h-10 w-10 mb-3 ${
                    isEarthy ? "text-rust-500" : "text-light-lavender"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <p
                  className={`text-lg ${
                    isEarthy ? "text-brown-700" : "text-gray-900"
                  }`}
                >
                  Loading friends…
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* friend requests */}
              <section className="mb-8">
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    isEarthy ? "text-brown-900" : "text-white"
                  }`}
                >
                  Friend Requests
                </h2>
                {requests.length === 0 ? (
                  <div
                    className={`rounded-lg p-6 text-center shadow-md ${
                      isEarthy
                        ? "bg-white border border-tan-200 text-brown-600"
                        : "bg-pale-lavender border border-blue-grey text-gray-900"
                    }`}
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
                            ? "bg-white border border-tan-200"
                            : "bg-pale-lavender border border-blue-grey"
                        }`}
                      >
                        <div
                          className="flex items-center flex-1 min-w-0 cursor-pointer"
                          onClick={() => navigate(`/profile/${req.fromUid}`)}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4 shrink-0 ${
                              isEarthy
                                ? "bg-rust-200 text-rust-700"
                                : "bg-light-lavender text-white"
                            }`}
                          >
                            {req.fromProfile?.firstName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`font-semibold truncate ${
                                isEarthy ? "text-brown-900" : "text-gray-900"
                              }`}
                            >
                              {req.fromProfile
                                ? `${req.fromProfile.firstName || ""} ${
                                    req.fromProfile.lastName || ""
                                  }`
                                : "Unknown user"}
                            </p>
                            <p
                              className={`text-sm ${
                                isEarthy ? "text-brown-600" : "text-gray-700"
                              }`}
                            >
                              wants to connect with you
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(req)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md hover:shadow-lg ${
                              isEarthy
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(req)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md hover:shadow-lg ${
                              isEarthy
                                ? "bg-tan-200 hover:bg-tan-300 text-brown-900"
                                : "bg-gray-200 hover:bg-gray-300 text-charcoal-grey"
                            }`}
                          >
                            Decline
                          </button>
                          <button
                            onClick={() =>
                              handleBlockUser(req.fromUid, {
                                requestId: req.id,
                              })
                            }
                            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md hover:shadow-lg ${
                              isEarthy
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                          >
                            Block
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* friends list */}
              <section className="mb-8">
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    isEarthy ? "text-brown-900" : "text-white"
                  }`}
                >
                  Your Friends ({friends.length})
                </h2>

                {friends.length === 0 ? (
                  <div
                    className={`rounded-lg p-6 text-center shadow-md ${
                      isEarthy
                        ? "bg-white border border-tan-200 text-brown-600"
                        : "bg-pale-lavender border border-blue-grey text-gray-900"
                    }`}
                  >
                    <p>You don&apos;t have any friends yet.</p>
                    <p className="mt-1 text-sm opacity-75">
                      Start connecting with others in the community!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {friends.map((friend) => (
                      <div
                        key={friend.uid}
                        className={`flex items-center justify-between p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                          isEarthy
                            ? "bg-white border border-tan-200"
                            : "bg-pale-lavender border border-blue-grey"
                        }`}
                      >
                        <div
                          className="flex items-center flex-1 min-w-0 cursor-pointer"
                          onClick={() => navigate(`/profile/${friend.uid}`)}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4 shrink-0 ${
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
                                isEarthy ? "text-brown-900" : "text-gray-900"
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
                                  isEarthy ? "text-brown-600" : "text-gray-700"
                                }`}
                              >
                                {friend.bio}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockUser(friend.uid);
                          }}
                          className={`ml-3 px-4 py-2 text-sm font-medium rounded-lg shadow-md hover:shadow-lg ${
                            isEarthy
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          Block
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* blocked list */}
              <section>
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    isEarthy ? "text-brown-900" : "text-white"
                  }`}
                >
                  Blocked Users ({blocked.length})
                </h2>

                {blocked.length === 0 ? (
                  <div
                    className={`rounded-lg p-6 text-center shadow-md ${
                      isEarthy
                        ? "bg-white border border-tan-200 text-brown-600"
                        : "bg-pale-lavender border border-blue-grey text-gray-900"
                    }`}
                  >
                    <p>You haven&apos;t blocked anyone.</p>
                    <p className="mt-1 text-sm opacity-75">
                      If someone makes you feel unsafe or uncomfortable, you can
                      block them from their profile or from here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blocked.map((b) => (
                      <div
                        key={b.uid}
                        className={`flex items-center justify-between p-4 rounded-lg shadow-lg ${
                          isEarthy
                            ? "bg-white border border-tan-200"
                            : "bg-charcoal-grey/80 border border-blue-grey"
                        }`}
                      >
                        <div
                          className="flex items-center min-w-0 cursor-pointer"
                          onClick={() => navigate(`/profile/${b.uid}`)}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 shrink-0 ${
                              isEarthy
                                ? "bg-gray-200 text-brown-800"
                                : "bg-gray-600 text-white"
                            }`}
                          >
                            {b.firstName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`font-semibold truncate ${
                                isEarthy ? "text-brown-900" : "text-gray-100"
                              }`}
                            >
                              {b.firstName} {b.lastName}
                            </p>
                            {b.username && (
                              <p
                                className={`text-xs truncate ${
                                  isEarthy ? "text-brown-500" : "text-gray-400"
                                }`}
                              >
                                @{b.username}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnblockUser(b.uid);
                          }}
                          className={`ml-3 px-4 py-2 text-sm font-medium rounded-lg shadow-md hover:shadow-lg ${
                            isEarthy
                              ? "bg-gray-200 hover:bg-gray-300 text-brown-900"
                              : "bg-gray-700 hover:bg-gray-600 text-white"
                          }`}
                        >
                          Unblock
                        </button>
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

export default FriendsPage;
