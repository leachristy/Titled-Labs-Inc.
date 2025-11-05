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
import UntiltNavBar from "../components/UntiltNavBar";
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

  // Wait for Firebase Auth to load the user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch recipient info
  useEffect(() => {
    const fetchRecipient = async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setRecipient(docSnap.data());
    };
    fetchRecipient();
  }, [uid]);

  // Fetch messages
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

  // Send message
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
    return <p>Loading chat...</p>;
  }

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen ${isEarthy ? "bg-cream-100" : "bg-pale-lavender"}`}
        style={{ backgroundColor: isEarthy ? undefined : "var(--pale-lavender)" }}
      >
        <div className="max-w-2xl mx-auto p-6 mt-20 flex flex-col h-[80vh]">
          {/* Recipient Info */}
          <div className="flex items-center gap-4 mb-4 border-b pb-2">
            <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold">
              {recipient?.firstName?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {recipient?.firstName} {recipient?.lastName}
              </h3>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 border p-4 rounded bg-gray-50 flex flex-col space-y-2">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm">No messages yet.</p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg break-words whitespace-pre-wrap inline-block max-w-[70%] ${
                  msg.senderId === currentUser.uid
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 text-black self-start"
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
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
