// src/pages/.../VideoWatch.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../../../src/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  setDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import UntiltNavBar from "../../../components/navigation/UntiltNavBar";
import { useTheme } from "../../../contexts/ThemeContext";
import { UserAuth } from "../../../contexts/AuthContext";

export default function VideoWatch() {
  const { id } = useParams();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  // from your AuthContext
  const { user, profile } = UserAuth?.() || {};
  const [video, setVideo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // keep a plain uid for quick checks
  useEffect(
    () => onAuthStateChanged(auth, (u) => setUserId(u?.uid || null)),
    []
  );

  // load video + comments
  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "guideVideos", id));
      if (snap.exists()) setVideo({ id: snap.id, ...snap.data() });
    })();

    const q = query(
      collection(db, "videoComments"),
      where("videoId", "==", id),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [id]);

  const addComment = async () => {
    if (!userId || !text.trim()) return;

    const authorName =
      profile?.firstName || profile?.lastName
        ? `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()
        : user?.displayName || "Anonymous";

    await addDoc(collection(db, "videoComments"), {
      videoId: id,
      userId,
      authorName,
      authorPhoto: user?.photoURL || null,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      parentId: null,
    });

    setText("");
  };

  if (!video) return null;

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen mt-20 px-6 py-10 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="aspect-video rounded-xl overflow-hidden shadow">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <h1
            className={`text-2xl font-bold ${
              isEarthy ? "text-brown-800" : "text-indigo-900"
            }`}
          >
            {video.title}
          </h1>
          <p className={`${isEarthy ? "text-brown-700" : "text-slate-700"}`}>
            {video.description}
          </p>

          {/* comments */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Comments</h2>

            {userId && (
              <div className="flex gap-2 mb-4">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a comment…"
                />
                <button
                  onClick={addComment}
                  className="px-3 py-2 rounded bg-indigo-600 text-white"
                >
                  Post
                </button>
              </div>
            )}

            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 rounded border ${
                    isEarthy
                      ? "border-tan-300 bg-cream-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {c.authorPhoto ? (
                      <img
                        src={c.authorPhoto}
                        alt={c.authorName || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-gray-700 text-sm">
                        {(c.authorName || "A").slice(0, 1).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {c.authorName || "Anonymous"}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1">{c.text}</p>

                      <CommentReactions
                        commentId={c.id}
                        currentUserId={userId}
                        isEarthy={isEarthy}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** --- Emoji reactions for comments ------------------------------------- */

const EMOJIS = ["👍", "❤️", "😊", "🙌", "😢", "🧘"];

function CommentReactions({ commentId, currentUserId, isEarthy }) {
  const [counts, setCounts] = useState({}); // { "👍": 3, ... }
  const [mine, setMine] = useState(null); // emoji I selected

  // subscribe to reactions for this comment
  useEffect(() => {
    const q = query(
      collection(db, "videoCommentReactions"),
      where("commentId", "==", commentId)
    );
    return onSnapshot(q, (snap) => {
      const cts = {};
      let myEmoji = null;
      snap.forEach((d) => {
        const { emoji, userId } = d.data();
        cts[emoji] = (cts[emoji] || 0) + 1;
        if (userId === currentUserId) myEmoji = emoji;
      });
      setCounts(cts);
      setMine(myEmoji);
    });
  }, [commentId, currentUserId]);

  const toggle = async (emoji) => {
    if (!currentUserId) return alert("Please sign in to react.");

    const rid = `${commentId}_${currentUserId}`; // deterministic id
    const ref = doc(db, "videoCommentReactions", rid);

    // --- One-time cleanup of legacy duplicates for this (comment,user) ---
    const dupQ = query(
      collection(db, "videoCommentReactions"),
      where("commentId", "==", commentId),
      where("userId", "==", currentUserId)
    );
    const dupSnap = await getDocs(dupQ);
    await Promise.all(
      dupSnap.docs
        .filter((d) => d.id !== rid) // keep only the canonical doc id
        .map((d) => deleteDoc(doc(db, "videoCommentReactions", d.id)))
    );

    if (mine === emoji) {
      // clicking the same emoji removes the reaction
      await deleteDoc(ref);
    } else {
      // overwrite/create my single reaction doc
      await setDoc(ref, {
        commentId,
        userId: currentUserId,
        emoji,
        createdAt: serverTimestamp(),
      });
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      {EMOJIS.map((e) => (
        <button
          key={e}
          onClick={() => toggle(e)}
          className={`text-sm px-2 py-1 rounded-full border ${
            isEarthy ? "border-tan-400" : "border-slate-300"
          } ${mine === e ? "" : "opacity-60 hover:opacity-90"}`}
          title={mine === e ? "Remove reaction" : "React"}
        >
          {e} {counts[e] ? <span className="ml-1">{counts[e]}</span> : null}
        </button>
      ))}
    </div>
  );
}
