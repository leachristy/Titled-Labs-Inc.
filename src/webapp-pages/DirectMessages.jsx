import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../src/firebase";
import { Link } from "react-router-dom";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";

export default function DirectMessages() {
  const currentUser = auth.currentUser;
  const [conversations, setConversations] = useState([]);
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setConversations([]);
        return;
      }
  
      const q = query(
        collection(db, "messages"),
        where("participants", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );
  
      const unsubscribeMessages = onSnapshot(q, async (snapshot) => {
        const convoMap = {};
        for (let docSnap of snapshot.docs) {
          const msg = docSnap.data();
          const otherId = msg.participants.find((id) => id !== user.uid);
  
          const userDoc = await getDoc(doc(db, "users", otherId));
          const otherName = userDoc.exists()
            ? userDoc.data().firstName + " " + userDoc.data().lastName
            : otherId;
  
          convoMap[otherId] = {
            lastMessage: msg.content,
            createdAt: msg.createdAt?.toDate(),
            otherId,
            otherName,
          };
        }
  
        setConversations(
          Object.values(convoMap).sort((a, b) => b.createdAt - a.createdAt)
        );
      });
  
      return () => unsubscribeMessages();
    });
  
    return () => unsubscribeAuth();
  }, []);
  

  return (
    <>
    <UntiltNavBar />
    <div className={`min-h-screen  ${
            isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
          }`}>
    <div className="max-w-2xl mx-auto p-6 mt-20">
      <h2 className={`text-xl font-bold mb-4 ${
        isEarthy ? "text-brown-800" : "text-white"
      }`}>Direct Messages</h2>
      <div className="flex flex-col gap-2">
        {conversations.length === 0 && <p className={`${
          isEarthy ? "text-gray-400" : "text-purple-200"
        }`}>No conversations yet.</p>}
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
            <span className={`text-sm ${
              isEarthy ? "text-gray-500" : "text-gray-600"
            }`}>{convo.lastMessage}</span>
          </Link>
        ))}
      </div>
    </div>
    </div>
    </>
  );
}
