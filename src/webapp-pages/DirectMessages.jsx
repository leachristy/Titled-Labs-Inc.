import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../src/firebase";
import { Link } from "react-router-dom";
import UntiltNavBar from "../components/UntiltNavBar";
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

        // Collect all unique other participant IDs
        const otherIdsSet = new Set();
        snapshot.docs.forEach(docSnap => {
          const participants = docSnap.data().participants || [];
          const otherId = participants.find(id => id !== user.uid);
          if (otherId) otherIdsSet.add(otherId);
        });

        const otherIds = Array.from(otherIdsSet);

        // Fetch all user data in parallel once
        const userDocs = await Promise.all(
          otherIds.map(id => getDoc(doc(db, "users", id)))
        );

        const userMap = {};
        userDocs.forEach((docSnap, idx) => {
          const id = otherIds[idx];
          userMap[id] = docSnap.exists()
            ? `${docSnap.data().firstName} ${docSnap.data().lastName}`
            : id;
        });

        // Build convoMap with latest message per conversation
        snapshot.docs.forEach(docSnap => {
          const msg = docSnap.data();
          const otherId = msg.participants.find(id => id !== user.uid);
          if (!otherId) return;

          const createdAt = msg.createdAt?.toDate?.() || new Date(0);

          // Keep the most recent message
          if (!convoMap[otherId] || createdAt > convoMap[otherId].createdAt) {
            convoMap[otherId] = {
              lastMessage: msg.content,
              createdAt,
              otherId,
              otherName: userMap[otherId],
            };
          }
        });

        // Convert to array and sort by latest message
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
      <div className={`min-h-screen ${isEarthy ? "bg-cream-100" : "bg-charcoal-grey"}`}>
        <div className="max-w-2xl mx-auto p-6 mt-20">
          <h2 className={`text-xl font-bold mb-4 ${isEarthy ? "text-brown-800" : "text-white"}`}>
            Direct Messages
          </h2>

          {loading ? (
            <p className={`${isEarthy ? "text-gray-400" : "text-purple-200"}`}>
              Loading conversations...
            </p>
          ) : conversations.length === 0 ? (
            <p className={`${isEarthy ? "text-gray-400" : "text-purple-200"}`}>
              No conversations yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {conversations.map((convo) => (
                <Link
                  key={convo.otherId}
                  to={`/chat/${convo.otherId}`}
                  className={`p-3 border rounded flex justify-between ${
                    isEarthy
                      ? "border-tan-300 hover:bg-cream-50 text-brown-800"
                      : "bg-pale-lavender border-blue-grey hover:bg-cool-grey text-gray-900"
                  }`}
                >
                  <span>{convo.otherName}</span>
                  <span className={`text-sm ${isEarthy ? "text-gray-500" : "text-gray-600"}`}>
                    {convo.lastMessage}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
