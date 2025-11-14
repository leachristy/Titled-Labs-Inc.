import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { currentTheme } = useTheme();
  const { user } = UserAuth();

  const isEarthy = currentTheme === "earthy";

  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  // friend state
  const [friendStatus, setFriendStatus] = useState("loading");
  // 'loading' | 'self' | 'friends' | 'pendingSent' | 'pendingReceived' | 'none'
  const [friendRequestId, setFriendRequestId] = useState(null);
  const [friendError, setFriendError] = useState("");

  // block + report state
  const [isBlocked, setIsBlocked] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");

  // load profile + posts
  useEffect(() => {
    if (!uid) return;

    const fetchProfileAndPosts = async () => {
      try {
        // profile
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile(userSnap.data());
        }

        // posts (same collection / filtering as original)
        const postsQ = query(
          collection(db, "communityPosts"),
          where("authorId", "==", uid)
        );
        const postsSnap = await getDocs(postsQ);
        const posts = postsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setUserPosts(posts);
      } catch (err) {
        console.error("Error loading profile/posts:", err);
      }
    };

    fetchProfileAndPosts();
  }, [uid]);

  // friend + block status
  useEffect(() => {
    if (!uid || !user) {
      setFriendStatus("loading");
      return;
    }

    const checkStatus = async () => {
      if (!user || !user.uid) {
        setFriendStatus("loading");
        return;
      }

      if (user.uid === uid) {
        setFriendStatus("self");
        setIsBlocked(false);
        return;
      }

      try {
        setFriendError("");
        setReportError("");
        setReportSuccess("");

        // 0. check block
        const blockRef = doc(db, `users/${user.uid}/blocked/${uid}`);
        const blockSnap = await getDoc(blockRef);
        if (blockSnap.exists()) {
          setIsBlocked(true);
          setFriendStatus("none");
          setFriendRequestId(null);
          return;
        } else {
          setIsBlocked(false);
        }

        // 1. friends?
        const myFriendRef = doc(db, `users/${user.uid}/friends/${uid}`);
        const myFriendSnap = await getDoc(myFriendRef);
        if (myFriendSnap.exists()) {
          setFriendStatus("friends");
          setFriendRequestId(null);
          return;
        }

        // 2. pending I sent
        const frRef = collection(db, "friendRequests");
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

        // 3. pending they sent
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

        // 4. nothing
        setFriendStatus("none");
        setFriendRequestId(null);
      } catch (err) {
        console.error("Error checking friend status:", err);
        setFriendError("Could not load friend status.");
        setFriendStatus("none");
      }
    };

    setFriendStatus("loading");
    checkStatus();
  }, [uid, user]);

  // friend actions
  const handleAddFriend = async () => {
    if (!user || !user.uid || user.uid === uid || isBlocked) return;

    try {
      setFriendError("");

      await addDoc(collection(db, "friendRequests"), {
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
    if (!user || !user.uid || !friendRequestId || isBlocked) return;

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

      batch.set(myFriendRef, { createdAt: serverTimestamp() });
      batch.set(theirFriendRef, { createdAt: serverTimestamp() });

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

      await Promise.all([
        deleteDoc(doc(db, `users/${user.uid}/friends/${uid}`)),
        deleteDoc(doc(db, `users/${uid}/friends/${user.uid}`)),
      ]);

      setFriendStatus("none");
    } catch (err) {
      console.error("Error unfriending:", err);
      setFriendError("Failed to unfriend. Please try again.");
    }
  };

  // block / unblock
  const handleBlock = async () => {
    if (!user || !user.uid || user.uid === uid) return;

    try {
      setFriendError("");

      const batch = writeBatch(db);

      const myBlockRef = doc(db, `users/${user.uid}/blocked/${uid}`);
      const theirBlockRef = doc(db, `users/${uid}/blocked/${user.uid}`);

      batch.set(myBlockRef, { createdAt: serverTimestamp() });
      batch.set(theirBlockRef, { createdAt: serverTimestamp() });

      const myFriendRef = doc(db, `users/${user.uid}/friends/${uid}`);
      const theirFriendRef = doc(db, `users/${uid}/friends/${user.uid}`);

      batch.delete(myFriendRef);
      batch.delete(theirFriendRef);

      const frRef = collection(db, "friendRequests");

      const sentQ = query(
        frRef,
        where("fromUid", "==", user.uid),
        where("toUid", "==", uid),
        where("status", "==", "pending")
      );
      const sentSnap = await getDocs(sentQ);
      sentSnap.forEach((d) => {
        batch.update(d.ref, {
          status: "blocked",
          respondedAt: serverTimestamp(),
        });
      });

      const receivedQ = query(
        frRef,
        where("fromUid", "==", uid),
        where("toUid", "==", user.uid),
        where("status", "==", "pending")
      );
      const receivedSnap = await getDocs(receivedQ);
      receivedSnap.forEach((d) => {
        batch.update(d.ref, {
          status: "blocked",
          respondedAt: serverTimestamp(),
        });
      });

      await batch.commit();

      setIsBlocked(true);
      setFriendStatus("none");
      setFriendRequestId(null);
    } catch (err) {
      console.error("Error blocking user:", err);
      setFriendError("Failed to block this user. Please try again.");
    }
  };

  const handleUnblock = async () => {
    if (!user || !user.uid || user.uid === uid) return;

    try {
      setFriendError("");

      await Promise.all([
        deleteDoc(doc(db, `users/${user.uid}/blocked/${uid}`)),
        deleteDoc(doc(db, `users/${uid}/blocked/${user.uid}`)),
      ]);

      setIsBlocked(false);
    } catch (err) {
      console.error("Error unblocking user:", err);
      setFriendError("Failed to unblock this user. Please try again.");
    }
  };

  // report
  const handleSubmitReport = async (e) => {
    e.preventDefault();

    if (!user || !user.uid) {
      setReportError("You need to be signed in to report a user.");
      return;
    }

    if (!reportReason) {
      setReportError("Please choose a reason for your report.");
      return;
    }

    try {
      setReportSubmitting(true);
      setReportError("");
      setReportSuccess("");

      await addDoc(collection(db, "userReports"), {
        reportedUid: uid,
        reporterUid: user.uid,
        reason: reportReason,
        details: reportDetails || "",
        createdAt: serverTimestamp(),
        status: "open",
      });

      // reporting also blocks
      await handleBlock();

      setReportSuccess(
        "Thank you for your report. This user has been blocked and will no longer be able to contact you. Our team will review your report as soon as possible."
      );
      setIsReportOpen(false);
      setReportReason("");
      setReportDetails("");
    } catch (err) {
      console.error("Error submitting report:", err);
      setReportError(
        "We couldn't submit your report right now. Please try again."
      );
    } finally {
      setReportSubmitting(false);
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
            className={`max-w-4xl mx-auto p-6 mt-8 rounded-lg shadow-lg text-center ${
              isEarthy
                ? "bg-white border border-tan-200"
                : "bg-pale-lavender border border-blue-grey"
            }`}
          >
            <p
              className={`text-lg ${
                isEarthy ? "text-brown-700" : "text-gray-100"
              }`}
            >
              Loading profile...
            </p>
          </div>
        </div>
      </>
    );
  }

  const isOwnProfile = user && user.uid === uid;

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen pt-20 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
        }`}
      >
        <div className="max-w-4xl px-4 mx-auto">
          {/* banners */}
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

          {reportSuccess && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                isEarthy
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-green-900/20 text-green-200 border border-green-700"
              }`}
            >
              {reportSuccess}
            </div>
          )}

          {reportError && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                isEarthy
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-red-900/20 text-red-200 border border-red-700"
              }`}
            >
              {reportError}
            </div>
          )}

          {/* profile header */}
          <div
            className={`rounded-2xl shadow-xl p-6 mb-6 ${
              isEarthy
                ? "bg-white border border-tan-200"
                : "bg-pale-lavender border border-blue-grey"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 ${
                  isEarthy
                    ? "bg-rust-200 text-rust-700"
                    : "bg-light-lavender text-white"
                }`}
              >
                {profile.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <h1
                  className={`text-2xl font-bold mb-1 ${
                    isEarthy ? "text-brown-900" : "text-white"
                  }`}
                >
                  {profile.firstName} {profile.lastName}
                </h1>
                {profile.username && (
                  <p
                    className={`text-sm mb-2 ${
                      isEarthy ? "text-brown-500" : "text-purple-200"
                    }`}
                  >
                    @{profile.username}
                  </p>
                )}
                {profile.bio && (
                  <p
                    className={`text-sm ${
                      isEarthy ? "text-brown-700" : "text-gray-100"
                    }`}
                  >
                    {profile.bio}
                  </p>
                )}

                {/* action buttons */}
                {!isOwnProfile && (
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* chat */}
                      {!isBlocked && (
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
                      )}

                      {isBlocked && (
                        <button
                          disabled
                          className={`px-6 py-2.5 rounded-lg font-medium cursor-default ${
                            isEarthy
                              ? "bg-tan-200 text-brown-600"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          Messaging blocked
                        </button>
                      )}

                      {/* friend buttons */}
                      {friendStatus === "self" && (
                        <span
                          className={`text-sm ${
                            isEarthy ? "text-brown-500" : "text-purple-200"
                          }`}
                        >
                          This is you 👀
                        </span>
                      )}

                      {friendStatus === "loading" && (
                        <span
                          className={`text-sm ${
                            isEarthy ? "text-brown-500" : "text-purple-200"
                          }`}
                        >
                          Checking connection…
                        </span>
                      )}

                      {friendStatus === "friends" && !isBlocked && (
                        <button
                          onClick={handleUnfriend}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg ${
                            isEarthy
                              ? "bg-tan-200 hover:bg-tan-300 text-brown-900"
                              : "bg-gray-200 hover:bg-gray-300 text-charcoal-grey"
                          }`}
                        >
                          Unfriend
                        </button>
                      )}

                      {friendStatus === "none" && !isBlocked && (
                        <button
                          onClick={handleAddFriend}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg ${
                            isEarthy
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          Add Friend
                        </button>
                      )}

                      {friendStatus === "pendingSent" && !isBlocked && (
                        <button
                          disabled
                          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-default ${
                            isEarthy
                              ? "bg-tan-200 text-brown-700"
                              : "bg-gray-700 text-gray-200"
                          }`}
                        >
                          Friend request sent
                        </button>
                      )}

                      {friendStatus === "pendingReceived" && !isBlocked && (
                        <>
                          <button
                            onClick={handleAcceptFriend}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg ${
                              isEarthy
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            Accept request
                          </button>
                          <button
                            onClick={handleDeclineFriend}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg ${
                              isEarthy
                                ? "bg-tan-200 hover:bg-tan-300 text-brown-900"
                                : "bg-gray-200 hover:bg-gray-300 text-charcoal-grey"
                            }`}
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>

                    {/* block + report row */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isBlocked ? (
                        <button
                          onClick={handleUnblock}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg ${
                            isEarthy
                              ? "bg-gray-200 hover:bg-gray-300 text-brown-900"
                              : "bg-gray-700 hover:bg-gray-600 text-white"
                          }`}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={handleBlock}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg ${
                            isEarthy
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          Block
                        </button>
                      )}

                      <button
                        onClick={() => setIsReportOpen((prev) => !prev)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg ${
                          isEarthy
                            ? "bg-orange-100 hover:bg-orange-200 text-brown-900 border border-orange-300"
                            : "bg-orange-900/20 hover:bg-orange-900/40 text-orange-100 border border-orange-600"
                        }`}
                      >
                        {isReportOpen ? "Cancel Report" : "Report"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* report form */}
            {!isOwnProfile && isReportOpen && (
              <div
                className={`mt-4 rounded-lg shadow-lg p-5 ${
                  isEarthy
                    ? "bg-cream-100 border border-tan-200"
                    : "bg-charcoal-grey/80 border border-blue-grey"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-3 ${
                    isEarthy ? "text-brown-900" : "text-white"
                  }`}
                >
                  Report this user
                </h3>
                <form onSubmit={handleSubmitReport} className="space-y-3">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isEarthy ? "text-brown-700" : "text-gray-200"
                      }`}
                    >
                      Reason
                    </label>
                    <select
                      className={`w-full rounded-lg px-3 py-2 text-sm outline-none border ${
                        isEarthy
                          ? "border-tan-300 bg-white text-brown-900"
                          : "border-blue-grey bg-charcoal-grey text-white"
                      }`}
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                    >
                      <option value="">Select a reason</option>
                      <option value="harassment">Harassment or bullying</option>
                      <option value="spam">Spam or unwanted contact</option>
                      <option value="inappropriate_content">
                        Inappropriate or harmful content
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isEarthy ? "text-brown-700" : "text-gray-200"
                      }`}
                    >
                      Additional details (optional)
                    </label>
                    <textarea
                      className={`w-full rounded-lg px-3 py-2 text-sm resize-y min-h-[80px] outline-none border ${
                        isEarthy
                          ? "border-tan-300 bg-white text-brown-900"
                          : "border-blue-grey bg-charcoal-grey text-white"
                      }`}
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Describe what happened…"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg ${
                      reportSubmitting
                        ? isEarthy
                          ? "bg-gray-300 text-gray-600 cursor-wait"
                          : "bg-gray-700 text-gray-400 cursor-wait"
                        : isEarthy
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {reportSubmitting
                      ? "Submitting..."
                      : "Submit report & block user"}
                  </button>

                  <p
                    className={`text-xs mt-1 ${
                      isEarthy ? "text-brown-600" : "text-gray-200"
                    }`}
                  >
                    Reporting will also block this user so they can&apos;t send
                    you messages or new friend requests.
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* POSTS SECTION – original style, clickable to community post */}
          <div className="mt-6">
            <h2
              className={`text-xl font-semibold mb-4 ${
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
                      {post.category || "Post"}
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
                    {post.title || "Untitled"}
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

export default FriendProfilePage;
