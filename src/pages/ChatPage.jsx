import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../src/firebase";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";

const convIdFor = (a, b) => [a, b].sort().join("_");

export const ChatPage = () => {
  const { uid } = useParams(); // recipient ID
  const [currentUser, setCurrentUser] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const [isBlocked, setIsBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");

  // auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) =>
      setCurrentUser(user || null)
    );
    return () => unsub();
  }, []);

  // recipient profile (for header)
  useEffect(() => {
    if (!uid) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setRecipient(snap.data());
    })();
  }, [uid]);

  // ensure/fetch conversation doc id (deterministic)
  useEffect(() => {
    if (!currentUser || !uid) return;
    (async () => {
      const convId = convIdFor(currentUser.uid, uid);
      const convRef = doc(db, "conversations", convId);

      // Create/backfill the parent doc so DirectMessages can list it
      await setDoc(
        convRef,
        {
          participants: [currentUser.uid, uid],
          participantDetails: {},
          lastMessage: "",
          lastMessageTime: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      setConversationId(convId);
    })();
  }, [currentUser, uid]);

  // check block status (either direction)
  useEffect(() => {
    if (!currentUser || !uid) return;

    const checkBlocked = async () => {
      try {
        const [iBlockedSnap, blockedMeSnap] = await Promise.all([
          getDoc(doc(db, "users", currentUser.uid, "blocked", uid)),
          getDoc(doc(db, "users", uid, "blocked", currentUser.uid)),
        ]);

        const iBlocked = iBlockedSnap.exists();
        const blockedMe = blockedMeSnap.exists();

        if (iBlocked && blockedMe) {
          setBlockMessage(
            "You can't reply to this conversation. You may have blocked this user or been blocked by them."
          );
        } else if (iBlocked) {
          setBlockMessage(
            "You have blocked this user. You can't reply to this conversation."
          );
        } else if (blockedMe) {
          setBlockMessage(
            "You can't reply to this conversation because this user has blocked you."
          );
        } else {
          setBlockMessage("");
        }

        setIsBlocked(iBlocked || blockedMe);
      } catch (err) {
        console.error("Error checking block status:", err);
        setIsBlocked(false);
        setBlockMessage("");
      }
    };

    checkBlocked();
  }, [currentUser, uid]);

  // live message listener in conversations/{conversationId}/messages
  useEffect(() => {
    if (!conversationId) return;

    const qMsgs = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(qMsgs, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(list);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsub();
  }, [conversationId]);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!currentUser || !conversationId || !text) return;

    // Don't allow sending if blocked
    if (isBlocked) return;

    await addDoc(collection(db, "conversations", conversationId, "messages"), {
      text,
      senderId: currentUser.uid,
      senderName: `${currentUser.displayName || ""}`.trim() || "Anonymous",
      recipientId: uid,
      createdAt: serverTimestamp(),
      read: false,
    });

    await updateDoc(doc(db, "conversations", conversationId), {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
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
            className={`flex items-center gap-4 p-4 rounded-lg shadow-md ${
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
            <h3 className="text-lg font-bold">
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
                className={`p-3 rounded-lg inline-block max-w-[70%] wrap-break-word shadow-md transition-all duration-300 ${
                  msg.senderId === currentUser.uid
                    ? isEarthy
                      ? "bg-rust-500 text-white self-end hover:bg-rust-600"
                      : "bg-light-lavender text-gray-900 self-end hover:bg-medium-lavender"
                    : isEarthy
                    ? "bg-cream-200 text-brown-800 self-start hover:bg-cream-300"
                    : "bg-white text-gray-900 self-start hover:bg-pale-lavender"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input / Blocked message */}
          <div className="flex items-center gap-2">
            {isBlocked ? (
              <div
                className={`w-full rounded-lg px-4 py-3 text-sm border shadow-sm ${
                  isEarthy
                    ? "bg-cream-100 border-rust-300 text-brown-800"
                    : "bg-pale-lavender border-blue-grey text-gray-900"
                }`}
              >
                {blockMessage ||
                  "You can't reply to this conversation. You may have blocked this user or been blocked by them."}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
