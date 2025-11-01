import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../../src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import UntiltNavBar from "../../../components/UntiltNavBar";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "all",
  "meditation",
  "sleep",
  "stretches",
  "relaxation",
  "therapy-tips",
];

export default function GuidedVideos() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const [userId, setUserId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  // auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUserId(u?.uid || null));
    return () => unsub();
  }, []);

  // videos
  useEffect(() => {
    const base = collection(db, "guideVideos");
    const q =
      category === "all"
        ? base
        : query(base, where("category", "==", category));
    const unsub = onSnapshot(q, (snap) => {
      setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [category]);

  // favorites for current user
  useEffect(() => {
    if (!userId) {
      setFavorites(new Set());
      return;
    }
    const q = query(
      collection(db, "videoFavorites"),
      where("userId", "==", userId)
    );
    const unsub = onSnapshot(q, (snap) => {
      setFavorites(new Set(snap.docs.map((d) => d.data().videoId)));
    });
    return () => unsub();
  }, [userId]);

  const toggleFavorite = async (videoId) => {
    if (!userId) {
      alert("Please sign in to favorite videos");
      return;
    }
    if (favorites.has(videoId)) {
      // find and delete favorite
      const q = query(
        collection(db, "videoFavorites"),
        where("userId", "==", userId),
        where("videoId", "==", videoId)
      );
      const unsub = onSnapshot(q, async (snap) => {
        const batchDelete = snap.docs.map((d) =>
          deleteDoc(doc(db, "videoFavorites", d.id))
        );
        await Promise.all(batchDelete);
        unsub(); // one-shot
      });
    } else {
      await addDoc(collection(db, "videoFavorites"), {
        userId,
        videoId,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const toWatch = (v) => navigate(`/guide-videos/${v.id}`);

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen mt-20 px-6 py-10 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
      >
        {/* Back Button */}
        <button
            onClick={() => navigate("/selfcare")}
            className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm ${
              isEarthy
                ? "bg-tan-300 hover:bg-tan-400 text-brown-900"
                : "bg-indigo-200 hover:bg-indigo-300 text-indigo-900"
            } transition`}
          >
            ← Back to Self-Care
          </button>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1
              className={`${
                isEarthy ? "text-brown-800" : "text-slate-blue"
              } text-3xl font-bold`}
            >
              Guided Videos
            </h1>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`px-3 py-2 rounded border ${
                isEarthy ? "border-tan-400" : "border-slate-300"
              }`}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <div
                key={v.id}
                className={`rounded-xl shadow-md overflow-hidden border cursor-pointer ${
                  isEarthy
                    ? "bg-cream-50 border-tan-300"
                    : "bg-white border-slate-200"
                }`}
              >
                <div onClick={() => toWatch(v)}>
                  <img
                    alt={v.title}
                    className="w-full h-44 object-cover"
                    src={
                      v.thumbnailUrl ||
                      `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`
                    }
                  />
                  <div className="p-4">
                    <p className="text-sm opacity-70 uppercase">{v.category}</p>
                    <h3
                      className={`text-lg font-semibold ${
                        isEarthy ? "text-brown-800" : "text-indigo-900"
                      }`}
                    >
                      {v.title}
                    </h3>
                    <p className="text-sm opacity-80 line-clamp-2">
                      {v.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 pb-4">
                  <button
                    onClick={() => toggleFavorite(v.id)}
                    className={`text-xl ${
                      favorites.has(v.id) ? "text-red-500" : "text-gray-400"
                    }`}
                    title={favorites.has(v.id) ? "Unfavorite" : "Favorite"}
                  >
                    {favorites.has(v.id) ? "♥" : "♡"}
                  </button>

                  {/* quick reaction */}
                  <QuickReaction videoId={v.id} userId={userId} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function QuickReaction({ videoId, userId }) {
  const [mine, setMine] = useState(null);
  useEffect(() => {
    if (!userId) {
      setMine(null);
      return;
    }
    const q = query(
      collection(db, "videoReactions"),
      where("userId", "==", userId),
      where("videoId", "==", videoId)
    );
    return onSnapshot(q, (snap) =>
      setMine(snap.docs[0]?.data()?.emoji || null)
    );
  }, [userId, videoId]);

  const setEmoji = async (emoji) => {
    if (!userId) return alert("Sign in to react");
    // clear old; then add new
    const q = query(
      collection(db, "videoReactions"),
      where("userId", "==", userId),
      where("videoId", "==", videoId)
    );
    const unsub = onSnapshot(q, async (snap) => {
      await Promise.all(
        snap.docs.map((d) => deleteDoc(doc(db, "videoReactions", d.id)))
      );
      unsub();
      await addDoc(collection(db, "videoReactions"), {
        userId,
        videoId,
        emoji,
        createdAt: new Date().toISOString(),
      });
    });
  };

  const EMOJIS = ["👍", "❤️", "😊", "🙌", "😢", "🧘"];
  return (
    <div className="flex gap-2">
      {EMOJIS.map((e) => (
        <button
          key={e}
          onClick={() => setEmoji(e)}
          className={`text-lg ${
            mine === e ? "opacity-100" : "opacity-50 hover:opacity-80"
          }`}
          title="React"
        >
          {e}
        </button>
      ))}
    </div>
  );
}
