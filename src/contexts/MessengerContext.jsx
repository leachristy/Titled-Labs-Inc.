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
  deleteDoc,
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
  const [globalMessages, setGlobalMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [roomMessages, setRoomMessages] = useState({}); // { roomId: messages[] }
  const [activeView, setActiveView] = useState("chats"); // "chats", "global", or "rooms"
  useEffect(() => {
    if (!user) {
      // Clear all messenger state when user signs out
      setIsMessengerOpen(false);
      setOpenChats([]);
      setConversations({});
      setAllUsers([]);
      setGlobalMessages([]);
      setChatRooms([]);
      setRoomMessages({});
      return;
    }

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

  // Load global chat messages
  useEffect(() => {
    if (!user) return;

    const globalRef = collection(db, "globalChat");
    const q = query(globalRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGlobalMessages(messages);
    });

    return () => unsubscribe();
  }, [user]);

  // Load chat rooms
  useEffect(() => {
    if (!user) return;

    const roomsRef = collection(db, "chatRooms");
    const unsubscribe = onSnapshot(roomsRef, (snapshot) => {
      const rooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatRooms(rooms);
    });

    return () => unsubscribe();
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

  // Send a global message
  const sendGlobalMessage = async (text) => {
    if (!user || !text.trim()) return;

    const globalRef = collection(db, "globalChat");

    try {
      await addDoc(globalRef, {
        text: text.trim(),
        senderId: user.uid,
        senderName: profile?.firstName
          ? `${profile.firstName} ${profile.lastName || ""}`
          : "Anonymous",
        senderAvatar: profile?.photoUrl || null,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending global message:", error);
    }
  };

  // Create a chat room
  const createChatRoom = async (roomName, roomDescription) => {
    if (!user || !roomName.trim()) return;

    const roomsRef = collection(db, "chatRooms");

    try {
      const roomDoc = await addDoc(roomsRef, {
        name: roomName.trim(),
        description: roomDescription?.trim() || "",
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        members: [user.uid],
      });
      return roomDoc.id;
    } catch (error) {
      console.error("Error creating chat room:", error);
      return null;
    }
  };

  // Join a chat room
  const joinChatRoom = async (roomId) => {
    if (!user) return;

    const roomRef = doc(db, "chatRooms", roomId);

    try {
      await updateDoc(roomRef, {
        members: arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Error joining chat room:", error);
    }
  };

  // Leave a chat room
  const leaveChatRoom = async (roomId) => {
    if (!user) return;

    const roomRef = doc(db, "chatRooms", roomId);

    try {
      const room = chatRooms.find((r) => r.id === roomId);
      if (room && room.members) {
        const updatedMembers = room.members.filter((id) => id !== user.uid);
        await updateDoc(roomRef, {
          members: updatedMembers,
        });
      }
    } catch (error) {
      console.error("Error leaving chat room:", error);
    }
  };

  // Send room message
  const sendRoomMessage = async (roomId, text) => {
    if (!user || !text.trim()) return;

    const messagesRef = collection(db, "chatRooms", roomId, "messages");

    try {
      await addDoc(messagesRef, {
        text: text.trim(),
        senderId: user.uid,
        senderName: profile?.firstName
          ? `${profile.firstName} ${profile.lastName || ""}`
          : "Anonymous",
        senderAvatar: profile?.photoUrl || null,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending room message:", error);
    }
  };

  // Load room messages
  const loadRoomMessages = (roomId) => {
    if (!user) return;

    const messagesRef = collection(db, "chatRooms", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRoomMessages((prev) => ({
        ...prev,
        [roomId]: messages,
      }));
    });

    return unsubscribe;
  };

  // Delete chat room (only by creator)
  const deleteChatRoom = async (roomId) => {
    if (!user) return;

    const roomRef = doc(db, "chatRooms", roomId);

    try {
      // First, delete all messages in the room
      const messagesRef = collection(db, "chatRooms", roomId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);
      
      const deletePromises = messagesSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Then delete the room itself
      await deleteDoc(roomRef);

      // Clear room messages from state
      setRoomMessages((prev) => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
    } catch (error) {
      console.error("Error deleting chat room:", error);
    }
  };

  // Clear all global messages
  const clearGlobalMessages = async () => {
    if (!user) return;

    const globalRef = collection(db, "globalChat");

    try {
      const snapshot = await getDocs(globalRef);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing global messages:", error);
    }
  };

  // Clear all room messages (by room creator)
  const clearRoomMessages = async (roomId) => {
    if (!user) return;

    const messagesRef = collection(db, "chatRooms", roomId, "messages");

    try {
      const snapshot = await getDocs(messagesRef);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing room messages:", error);
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
    globalMessages,
    sendGlobalMessage,
    clearGlobalMessages,
    chatRooms,
    createChatRoom,
    joinChatRoom,
    leaveChatRoom,
    deleteChatRoom,
    roomMessages,
    sendRoomMessage,
    loadRoomMessages,
    clearRoomMessages,
    activeView,
    setActiveView,
    user,
    profile,
  };

  return (
    <MessengerContext.Provider value={value}>
      {children}
    </MessengerContext.Provider>
  );
};
