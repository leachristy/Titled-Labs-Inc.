import { createContext, useContext, useState, useEffect } from "react";
import { UserAuth } from "./AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../src/firebase";

const MessengerContext = createContext();

export const useMessenger = () => {
  const context = useContext(MessengerContext);
  if (!context) {
    throw new Error("useMessenger must be used within MessengerProvider");
  }
  return context;
};

export const MessengerProvider = ({ children }) => {
  const { user, profile } = UserAuth();
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [openChats, setOpenChats] = useState([]); // Array of { userId, userName, userAvatar }
  const [conversations, setConversations] = useState({}); // { userId: messages[] }
  const [allUsers, setAllUsers] = useState([]);

  // Fetch all users for search
  useEffect(() => {
    if (!user) return;

    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((u) => u.id !== user.uid); // Exclude current user

      setAllUsers(users);
    });

    return () => unsubscribe();
  }, [user]);

  // Clear all messenger state when user signs out
  useEffect(() => {
    if (!user) {
      setIsMessengerOpen(false);
      setOpenChats([]);
      setConversations({});
      setAllUsers([]);
    }
  }, [user]);

  // Open a chat window
  const openChat = (userId, userName, userAvatar) => {
    setOpenChats((prev) => {
      // Check if chat already open
      if (prev.find((chat) => chat.userId === userId)) {
        return prev;
      }

      // If 3 chats open, remove the oldest one
      if (prev.length >= 3) {
        return [...prev.slice(1), { userId, userName, userAvatar }];
      }

      return [...prev, { userId, userName, userAvatar }];
    });

    // Start listening to messages if not already
    if (!conversations[userId]) {
      loadMessages(userId);
    }
  };

  // Close a chat window
  const closeChat = (userId) => {
    setOpenChats((prev) => prev.filter((chat) => chat.userId !== userId));
  };

  // Minimize a chat (just close it for now, can be enhanced later)
  const minimizeChat = (userId) => {
    closeChat(userId);
  };

  // Load messages for a conversation
  const loadMessages = (otherUserId) => {
    if (!user) return;

    // Create a conversation ID (sorted user IDs)
    const conversationId = [user.uid, otherUserId].sort().join("_");

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setConversations((prev) => ({
        ...prev,
        [otherUserId]: messages,
      }));
    });

    return unsubscribe;
  };

  // Send a message
  const sendMessage = async (recipientId, text) => {
    if (!user || !text.trim()) return;

    const conversationId = [user.uid, recipientId].sort().join("_");
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );

    try {
      await addDoc(messagesRef, {
        text: text.trim(),
        senderId: user.uid,
        senderName: profile?.firstName
          ? `${profile.firstName} ${profile.lastName || ""}`
          : "Anonymous",
        senderAvatar: profile?.photoUrl || null,
        recipientId,
        createdAt: serverTimestamp(),
        read: false,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const value = {
    isMessengerOpen,
    setIsMessengerOpen,
    openChats,
    openChat,
    closeChat,
    minimizeChat,
    conversations,
    sendMessage,
    allUsers,
  };

  return (
    <MessengerContext.Provider value={value}>
      {children}
    </MessengerContext.Provider>
  );
};
