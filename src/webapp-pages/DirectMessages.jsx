import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../src/firebase";
import { Link } from "react-router-dom";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";

export default function DirectMessages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "messages"),
        where("participants", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeMessages = onSnapshot(q, async (snapshot) => {
        const convoMap = {};

        const otherIdsSet = new Set();
        snapshot.docs.forEach((docSnap) => {
          const participants = docSnap.data().participants || [];
          const otherId = participants.find((id) => id !== user.uid);
          if (otherId) otherIdsSet.add(otherId);
        });

        const otherIds = Array.from(otherIdsSet);

        const userDocs = await Promise.all(
          otherIds.map((id) => getDoc(doc(db, "users", id)))
        );

        const userMap = {};
        userDocs.forEach((docSnap, idx) => {
          const id = otherIds[idx];
          userMap[id] = docSnap.exists()
            ? `${docSnap.data().firstName} ${docSnap.data().lastName}`
            : id;
        });

        snapshot.docs.forEach((docSnap) => {
          const msg = docSnap.data();
          const otherId = msg.participants.find((id) => id !== user.uid);
          if (!otherId) return;

          const createdAt = msg.createdAt?.toDate?.() || new Date(0);

          if (!convoMap[otherId] || createdAt > convoMap[otherId].createdAt) {
            convoMap[otherId] = {
              lastMessage: msg.content,
              createdAt,
              otherId,
              otherName: userMap[otherId],
            };
          }
        });

        setConversations(
          Object.values(convoMap).sort((a, b) => b.createdAt - a.createdAt)
        );
        setLoading(false);
      });

      return () => unsubscribeMessages();
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <>
      <UntiltNavBar />

      <div
        className={`min-h-screen px-4 pt-24 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
        }`}
      >
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isEarthy ? "text-brown-800" : "text-white"
            }`}
          >
            Direct Messages
          </h1>

          <p
            className={`text-md ${
              isEarthy ? "text-brown-600" : "text-purple-200"
            }`}
          >
            Your conversations appear below. Click to continue chatting.
          </p>
        </div>

        {/* Conversation List */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6">
          {loading ? (
            <p
              className={`text-center ${
                isEarthy ? "text-brown-600" : "text-purple-200"
              }`}
            >
              Loading conversations...
            </p>
          ) : conversations.length === 0 ? (
            <p
              className={`text-center ${
                isEarthy ? "text-brown-600" : "text-purple-200"
              }`}
            >
              No conversations yet.
            </p>
          ) : (
            conversations.map((convo) => (
              <Link
                key={convo.otherId}
                to={`/chat/${convo.otherId}`}
                className={`
                  group relative overflow-hidden rounded-lg shadow-lg 
                  transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                  p-6 cursor-pointer
                  ${
                    isEarthy
                      ? "bg-linear-to-br from-cream-100 to-tan-50 border-2 border-tan-300"
                      : "bg-pale-lavender border-2 border-blue-grey"
                  }
                `}
              >
                {/* Decorative background like SelfCareCard */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZhMSAxIDAgMCAxIDAtMmg2YTEgMSAwIDAgMSAwIDJ6bS0xMiAwSDhhMSAxIDAgMCAxIDAtMmgxNmExIDEgMCAwIDEgMCAyek0zNiAxOGgtNmExIDEgMCAwIDEgMC0yaDZhMSAxIDAgMCAxIDAgem0tMTIgMEg4YTEgMSAwIDAgMSAwLTJoMTZhMSAxIDAgMCAxIDAgem0xMiAyNGg2YTEgMSAwIDAgMSAwIDJoLTZhMSAxIDAgMCAxIDAtMnptLTEyIDBoMTZhMSAxIDAgMCAxIDAgMkg4YTEgMSAwIDAgMSAwLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
                </div>

                <div className="relative">
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      isEarthy
                        ? "text-brown-800 group-hover:text-rust-600"
                        : "text-gray-900 group-hover:text-light-lavender"
                    }`}
                  >
                    {convo.otherName}
                  </h3>

                  <p
                    className={`text-md ${
                      isEarthy ? "text-brown-600" : "text-gray-700"
                    }`}
                  >
                    {convo.lastMessage}
                  </p>
                </div>

                {/* Hover overlay glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 rounded-lg blur-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-20 ${
                    isEarthy ? "bg-rust-400" : "bg-light-lavender"
                  }`}
                  style={{ transform: "translate(50%, -50%)" }}
                ></div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
