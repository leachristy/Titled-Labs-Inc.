import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../src/firebase";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";

export const ChatPage = () => {
  const { uid } = useParams(); // recipient ID
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRecipient = async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setRecipient(docSnap.data());
    };
    fetchRecipient();
  }, [uid]);

  useEffect(() => {
    if (!currentUser) return;
    const participants = [currentUser.uid, uid].sort();

    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((msg) => msg.participants.sort().join() === participants.join());

      setMessages(msgs);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsubscribe();
  }, [uid, currentUser]);

  const handleSend = async () => {
    if (!currentUser || newMessage.trim() === "") return;

    const participants = [currentUser.uid, uid].sort();
    const tempTimestamp = new Date();

    setMessages((prev) => [
      ...prev,
      {
        id: "temp-" + Math.random(),
        senderId: currentUser.uid,
        receiverId: uid,
        participants,
        content: newMessage,
        createdAt: tempTimestamp,
      },
    ]);

    await addDoc(collection(db, "messages"), {
      senderId: currentUser.uid,
      receiverId: uid,
      participants,
      content: newMessage,
      createdAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  if (currentUser === null) {
    return (
      <p
        className={`text-center mt-20 ${
          isEarthy ? "text-brown-600" : "text-purple-200"
        }`}
      >
        Loading chat...
      </p>
    );
  }

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen px-4 pt-24 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
        }`}
      >
        <div className="max-w-3xl mx-auto flex flex-col h-[80vh] gap-4">
          {/* Recipient Info */}
          <div
            className={`flex items-center gap-4 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl ${
              isEarthy
                ? "bg-linear-to-br from-cream-100 to-tan-50 border-2 border-tan-300 text-brown-800"
                : "bg-pale-lavender border-2 border-blue-grey text-gray-900"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${
                isEarthy ? "bg-brown-400 text-white" : "bg-gray-400 text-white"
              }`}
            >
              {recipient?.firstName?.charAt(0)}
            </div>
            <h3 className="font-bold text-lg">
              {recipient?.firstName} {recipient?.lastName}
            </h3>
          </div>

          {/* Messages */}
          <div
            className={`flex-1 overflow-y-auto p-4 rounded-lg ${
              isEarthy
                ? "bg-cream-50 border border-tan-200"
                : "bg-cool-grey border border-blue-grey"
            } flex flex-col space-y-3`}
          >
            {messages.length === 0 && (
              <p
                className={`text-center ${
                  isEarthy ? "text-brown-600" : "text-purple-200"
                }`}
              >
                No messages yet.
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg inline-block max-w-[70%] break-words shadow-md transition-all duration-300 ${
                  msg.senderId === currentUser.uid
                    ? isEarthy
                      ? "bg-rust-500 text-white self-end hover:bg-rust-600"
                      : "bg-light-lavender text-gray-900 self-end hover:bg-medium-lavender"
                    : isEarthy
                    ? "bg-cream-200 text-brown-800 self-start hover:bg-cream-300"
                    : "bg-white text-gray-900 self-start hover:bg-pale-lavender"
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className={`flex-1 rounded-lg px-4 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                isEarthy
                  ? "border-tan-300 bg-cream-50 focus:ring-rust-400 text-brown-800"
                  : "border-blue-grey bg-white focus:ring-light-lavender text-gray-900"
              }`}
            />
            <button
              onClick={handleSend}
              className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 hover:scale-105 ${
                isEarthy
                  ? "bg-rust-500 hover:bg-rust-600 text-white"
                  : "bg-light-lavender hover:bg-medium-lavender text-gray-900"
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
