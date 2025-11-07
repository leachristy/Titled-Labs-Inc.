import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../src/firebase";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";

export const FriendProfilePage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [friendStatus, setFriendStatus] = useState("loading");
  // 'loading' | 'self' | 'friends' | 'pendingSent' | 'pendingReceived' | 'none'
  const [friendRequestId, setFriendRequestId] = useState(null);
  const [friendError, setFriendError] = useState("");
  const { currentTheme } = useTheme();
  const { user } = UserAuth(); // current logged-in Firebase user
  const isEarthy = currentTheme === "earthy";

  // Fetch profile + posts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, "communityPosts"),
          where("authorId", "==", uid)
        );
        const snapshot = await getDocs(q);
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    if (uid) {
      fetchProfile();
      fetchPosts();
    }
  }, [uid]);

  // Check friend status between current user and this profile
  useEffect(() => {
    const checkFriendStatus = async () => {
      // Auth is still loading
      if (!user || !user.uid) {
        setFriendStatus("loading");
        return;
      }

      // Viewing own profile
      if (user.uid === uid) {
        setFriendStatus("self");
        return;
      }

      try {
        setFriendError("");

        // 1. Are we already friends? Check users/{user.uid}/friends/{uid}
        const friendDocRef = doc(db, `users/${user.uid}/friends/${uid}`);
        const friendDocSnap = await getDoc(friendDocRef);

        if (friendDocSnap.exists()) {
          setFriendStatus("friends");
          setFriendRequestId(null);
          return;
        }

        const frRef = collection(db, "friendRequests");

        // 2. Did I send a pending request to them?
        const sentQ = query(
          frRef,
          where("fromUid", "==", user.uid),
          where("toUid", "==", uid),
          where("status", "==", "pending")
        );
        const sentSnap = await getDocs(sentQ);
        if (!sentSnap.empty) {
          setFriendStatus("pendingSent");
          setFriendRequestId(sentSnap.docs[0].id);
          return;
        }

        // 3. Did they send a pending request to me?
        const receivedQ = query(
          frRef,
          where("fromUid", "==", uid),
          where("toUid", "==", user.uid),
          where("status", "==", "pending")
        );
        const receivedSnap = await getDocs(receivedQ);
        if (!receivedSnap.empty) {
          setFriendStatus("pendingReceived");
          setFriendRequestId(receivedSnap.docs[0].id);
          return;
        }

        // 4. Nothing yet
        setFriendStatus("none");
        setFriendRequestId(null);
      } catch (err) {
        console.error("Error checking friend status:", err);
        setFriendError("Could not load friend status.");
        setFriendStatus("none");
      }
    };

    if (uid) {
      setFriendStatus("loading");
      checkFriendStatus();
    }
  }, [uid, user]);

  const handleAddFriend = async () => {
    if (!user || !user.uid) {
      // In your app they shouldn't reach here, but safe-guard anyway
      setFriendError("Something went wrong with your session.");
      return;
    }
    if (user.uid === uid) {
      return; // shouldn't happen because we handle 'self'
    }

    try {
      setFriendError("");

      const frRef = collection(db, "friendRequests");
      await addDoc(frRef, {
        fromUid: user.uid,
        toUid: uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setFriendStatus("pendingSent");
    } catch (err) {
      console.error("Error sending friend request:", err);
      setFriendError("Failed to send friend request. Please try again.");
    }
  };

  const handleAcceptFriend = async () => {
    if (!user || !user.uid || !friendRequestId) return;

    try {
      setFriendError("");

      const batch = writeBatch(db);

      const requestRef = doc(db, "friendRequests", friendRequestId);
      batch.update(requestRef, {
        status: "accepted",
        respondedAt: serverTimestamp(),
      });

      const myFriendRef = doc(db, `users/${user.uid}/friends/${uid}`);
      const theirFriendRef = doc(db, `users/${uid}/friends/${user.uid}`);

      batch.set(myFriendRef, {
        createdAt: serverTimestamp(),
      });
      batch.set(theirFriendRef, {
        createdAt: serverTimestamp(),
      });

      await batch.commit();

      setFriendStatus("friends");
    } catch (err) {
      console.error("Error accepting friend request:", err);
      setFriendError("Failed to accept friend request. Please try again.");
    }
  };

  const handleDeclineFriend = async () => {
    if (!user || !user.uid || !friendRequestId) return;

    try {
      setFriendError("");

      const requestRef = doc(db, "friendRequests", friendRequestId);
      await updateDoc(requestRef, {
        status: "declined",
        respondedAt: serverTimestamp(),
      });

      setFriendStatus("none");
      setFriendRequestId(null);
    } catch (err) {
      console.error("Error declining friend request:", err);
      setFriendError("Failed to decline friend request. Please try again.");
    }
  };

  const handleUnfriend = async () => {
    if (!user || !user.uid) return;

    try {
      setFriendError("");

      // Delete both friendship docs
      await Promise.all([
        deleteDoc(doc(db, `users/${user.uid}/friends/${uid}`)),
        deleteDoc(doc(db, `users/${uid}/friends/${user.uid}`)),
      ]);

      // Update UI
      setFriendStatus("none");
    } catch (err) {
      console.error("Error unfriending:", err);
      setFriendError("Failed to unfriend. Please try again.");
    }
  };

  if (!profile) {
    return (
      <>
        <UntiltNavBar />
        <div
          className={`min-h-screen pt-20 pb-12 ${
            isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
          }`}
        >
          <div
            className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg text-center ${
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
                Loading profile...
              </p>
            </div>
          </div>
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
        <div className="max-w-4xl p-6 mx-auto">
          {/* Profile Header */}
          <div
            className={`rounded-lg shadow-lg p-6 mb-6 ${
              isEarthy
                ? "bg-white border-tan-200"
                : "bg-pale-lavender border-blue-grey"
            } border`}
          >
            <div className="flex items-center space-x-6">
              <div
                className={`flex items-center justify-center w-20 h-20 text-2xl font-bold rounded-full shrink-0 ${
                  isEarthy
                    ? "bg-rust-200 text-rust-700"
                    : "bg-light-lavender text-white"
                }`}
              >
                {profile.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <h1
                  className={`text-3xl font-bold mb-2 ${
                    isEarthy ? "text-brown-800" : "text-gray-900"
                  }`}
                >
                  {profile.firstName} {profile.lastName}
                </h1>
                <p
                  className={`text-sm ${
                    isEarthy ? "text-brown-500" : "text-gray-600"
                  }`}
                >
                  {profile.bio || "No bio yet"}
                </p>
              </div>
            </div>
          </div>

          {/* Error message for friend actions */}
          {friendError && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                isEarthy
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-red-900/20 text-red-200 border border-red-700"
              }`}
            >
              {friendError}
            </div>
          )}

          {/* Action Buttons */}
          <div
            className={`rounded-lg shadow-lg p-6 mb-6 ${
              isEarthy
                ? "bg-white border-tan-200"
                : "bg-pale-lavender border-blue-grey"
            } border`}
          >
            <div className="flex flex-wrap items-center gap-3">
              {/* Chat button */}
              <button
                onClick={() => navigate(`/chat/${uid}`)}
                className={`px-6 py-2.5 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                  isEarthy
                    ? "bg-rust-500 hover:bg-rust-600 text-white"
                    : "bg-light-lavender hover:bg-medium-lavender text-white"
                }`}
              >
                Send Message
              </button>

              {/* Friend logic according to your rules */}
              {friendStatus === "loading" && (
                <button
                  className={`px-6 py-2.5 rounded-lg font-medium cursor-default ${
                    isEarthy
                      ? "bg-tan-200 text-brown-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  disabled
                >
                  Checking...
                </button>
              )}

              {/* Viewing yourself -> go back to /profile */}
              {friendStatus === "self" && (
                <button
                  onClick={() => navigate("/profile")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                    isEarthy
                      ? "bg-tan-200 hover:bg-tan-300 text-brown-800"
                      : "bg-gray-200 hover:bg-gray-300 text-charcoal-grey"
                  }`}
                >
                  Go to your profile
                </button>
              )}

              {/* Already friends */}
              {friendStatus === "friends" && (
                <button
                  onClick={handleUnfriend}
                  className={`px-6 py-2.5 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                    isEarthy
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  Unfriend
                </button>
              )}

              {/* You sent a request */}
              {friendStatus === "pendingSent" && (
                <button
                  className={`px-6 py-2.5 rounded-lg font-medium cursor-default ${
                    isEarthy
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      : "bg-yellow-900/20 text-yellow-200 border border-yellow-700"
                  }`}
                  disabled
                >
                  Friend Request Sent
                </button>
              )}

              {/* They sent a request to you */}
              {friendStatus === "pendingReceived" && (
                <>
                  <button
                    onClick={handleAcceptFriend}
                    className={`px-6 py-2.5 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                      isEarthy
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    Accept Friend Request
                  </button>
                  <button
                    onClick={handleDeclineFriend}
                    className={`px-6 py-2.5 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                      isEarthy
                        ? "bg-tan-200 hover:bg-tan-300 text-brown-800"
                        : "bg-gray-200 hover:bg-gray-300 text-charcoal-grey"
                    }`}
                  >
                    Decline
                  </button>
                </>
              )}

              {/* No relationship yet */}
              {friendStatus === "none" && (
                <button
                  onClick={handleAddFriend}
                  className={`px-6 py-2.5 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                    isEarthy
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>

          {/* User Posts */}
          <div
            className={`rounded-lg shadow-lg p-6 ${
              isEarthy
                ? "bg-white border-tan-200"
                : "bg-pale-lavender border-blue-grey"
            } border`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                isEarthy ? "text-brown-800" : "text-gray-900"
              }`}
            >
              Posts by {profile.firstName} ({userPosts.length})
            </h2>
            <div className="space-y-4">
              {userPosts.length === 0 && (
                <p
                  className={`text-center py-8 ${
                    isEarthy ? "text-brown-600" : "text-gray-600"
                  }`}
                >
                  No posts yet.
                </p>
              )}
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/community?postId=${post.id}`)}
                  className={`p-5 rounded-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                    isEarthy
                      ? "bg-cream-50 border-tan-200"
                      : "bg-cream-50 border-blue-grey"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        isEarthy
                          ? "bg-rust-100 text-rust-700"
                          : "bg-light-lavender text-white"
                      }`}
                    >
                      {post.category}
                    </span>
                    <span
                      className={`text-xs ${
                        isEarthy ? "text-brown-500" : "text-gray-500"
                      }`}
                    >
                      {post.createdAt?.toDate?.().toLocaleDateString() || ""}
                    </span>
                  </div>
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      isEarthy ? "text-brown-900" : "text-gray-900"
                    }`}
                  >
                    {post.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isEarthy ? "text-brown-700" : "text-gray-700"
                    }`}
                  >
                    {post.content}
                  </p>
                  {post.comments && post.comments.length > 0 && (
                    <div
                      className={`mt-3 text-sm ${
                        isEarthy ? "text-brown-500" : "text-gray-500"
                      }`}
                    >
                      💬 {post.comments.length} comment
                      {post.comments.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
