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

  if (!profile) return <p>Loading profile...</p>;

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
          {/* Profile Header */}
          <div className="flex items-center mb-6 space-x-4">
            <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-white bg-gray-400 rounded-full">
              {profile.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-gray-500">
                {profile.bio || "No bio yet"}
              </p>
            </div>
          </div>

          {/* Error message for friend actions */}
          {friendError && (
            <p className="mb-4 text-sm text-red-600">{friendError}</p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Chat button */}
            <button
              onClick={() => navigate(`/chat/${uid}`)}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Send Message
            </button>

            {/* Friend logic according to your rules */}
            {friendStatus === "loading" && (
              <button
                className="px-4 py-2 text-gray-700 bg-gray-300 rounded cursor-default"
                disabled
              >
                Checking...
              </button>
            )}

            {/* Viewing yourself -> go back to /profile */}
            {friendStatus === "self" && (
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Go to your profile
              </button>
            )}

            {/* Already friends */}
            {friendStatus === "friends" && (
              <button
                onClick={handleUnfriend}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Unfriend
              </button>
            )}

            {/* You sent a request */}
            {friendStatus === "pendingSent" && (
              <button
                className="px-4 py-2 text-white bg-yellow-500 rounded cursor-default"
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
                  className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Accept Friend Request
                </button>
                <button
                  onClick={handleDeclineFriend}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Decline
                </button>
              </>
            )}

            {/* No relationship yet */}
            {friendStatus === "none" && (
              <button
                onClick={handleAddFriend}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Add Friend
              </button>
            )}
          </div>

          {/* User Posts */}
          <h2 className="mb-4 text-xl font-bold">
            Posts by {profile.firstName}
          </h2>
          <div className="space-y-4">
            {userPosts.length === 0 && <p>No posts yet.</p>}
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-white border rounded-lg shadow"
              >
                <h3 className="mb-2 text-lg font-bold">{post.title}</h3>
                <p className="text-sm text-gray-700">{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
