/**
 * Messenger Context for Real-Time Chat Functionality
 *
 * Provides comprehensive messaging features throughout the app:
 * - Direct messages: 1-on-1 conversations with friends
 * - Global chat: Public chat room for all users
 * - Chat rooms: User-created topic-based chat rooms
 *
 * Features:
 * - Real-time message synchronization via Firestore
 * - Support for up to 3 concurrent chat windows
 * - Message persistence across sessions
 * - User presence and profile integration
 * - Room creation, joining, and management
 * - Only shows friends in the chat list (users must be friends to message)
 *
 * Available functions:
 * Direct Messages:
 * - openChat(): Open a chat window with a user
 * - closeChat(): Close a chat window
 * - sendMessage(): Send a direct message
 *
 * Global Chat:
 * - sendGlobalMessage(): Send a message to global chat
 * - clearGlobalMessages(): Clear all global messages (admin)
 *
 * Chat Rooms:
 * - createChatRoom(): Create a new chat room
 * - joinChatRoom(): Join an existing room
 * - leaveChatRoom(): Leave a room
 * - deleteChatRoom(): Delete a room (creator only)
 * - sendRoomMessage(): Send a message in a room
 * - loadRoomMessages(): Load messages for a room
 * - clearRoomMessages(): Clear room messages (creator only)
 *
 * Available state:
 * - isMessengerOpen: Boolean for messenger popup visibility
 * - openChats: Array of currently open chat windows
 * - conversations: Object mapping userId to their messages
 * - allUsers: Array of user's friends (only friends shown for messaging)
 * - globalMessages: Array of global chat messages
 * - chatRooms: Array of available chat rooms
 * - roomMessages: Object mapping roomId to their messages
 * - activeView: Current messenger view ('chats', 'global', or 'rooms')
 */

import { createContext, useContext, useState, useEffect, useRef } from "react";
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
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../src/firebase";

// Create Messenger Context
const MessengerContext = createContext();

/**
 * Custom Hook: useMessenger
 *
 * Provides easy access to messenger context in any component
 * Throws error if used outside MessengerProvider
 *
 * Usage example:
 * const { openChat, sendMessage, conversations, isMessengerOpen } = useMessenger();
 *
 * @returns {Object} Messenger context value with all messaging state and functions
 */
export const useMessenger = () => {
  const context = useContext(MessengerContext);
  if (!context) {
    throw new Error("useMessenger must be used within MessengerProvider");
  }
  return context;
};

/**
 * MessengerProvider Component
 *
 * Wraps the app to provide messaging functionality to all child components
 * Manages real-time Firestore listeners for messages, users, and rooms
 * Automatically cleans up listeners when user logs out
 *
 * @param {ReactNode} children - All components wrapped by this provider
 */
export const MessengerProvider = ({ children }) => {
  // Get current authenticated user and their profile from AuthContext
  const { user, profile } = UserAuth();

  // UI State
  const [isMessengerOpen, setIsMessengerOpen] = useState(false); // Messenger popup visibility
  const [activeView, setActiveView] = useState("chats"); // Active tab: "chats", "global", or "rooms"

  // Direct Messages State
  const [openChats, setOpenChats] = useState([]); // Currently open chat windows: [{ userId, userName, userAvatar }]
  const [conversations, setConversations] = useState({}); // All conversations: { userId: messages[] }

  // Users State
  const [allUsers, setAllUsers] = useState([]); // All registered users (except current user)

  // Global Chat State
  const [globalMessages, setGlobalMessages] = useState([]); // All global chat messages

  // Chat Rooms State
  const [chatRooms, setChatRooms] = useState([]); // All available chat rooms
  const [roomMessages, setRoomMessages] = useState({}); // Room messages: { roomId: messages[] }
  
  // Track active message listeners to prevent duplicates
  const activeListenersRef = useRef(new Map()); // Map of userId -> unsubscribe function

  /**
   * Auto-close Chat Windows on Mobile/Tablet
   *
   * Monitors window size and automatically closes all open chat windows
   * when the screen becomes mobile or tablet sized
   */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Close all chat windows when switching to mobile or tablet
      if (width < 1024 && openChats.length > 0) {
        setOpenChats([]);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openChats.length]);

  /**
   * Load Friends (Users to Chat With) Effect
   *
   * Listens for changes to the current user's friends collection
   * Loads full user profiles for each friend
   * Clears state when user logs out
   */
  useEffect(() => {
    if (!user) {
      // Clear all messenger state when user signs out for security and privacy
      setIsMessengerOpen(false);
      setOpenChats([]);
      setConversations({});
      setAllUsers([]);
      setGlobalMessages([]);
      setChatRooms([]);
      setRoomMessages({});
      
      // Clean up all active listeners
      activeListenersRef.current.forEach((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
      activeListenersRef.current.clear();
      return;
    }

    // Subscribe to the current user's friends collection
    const friendsRef = collection(db, `users/${user.uid}/friends`);
    const unsubscribe = onSnapshot(friendsRef, async (snapshot) => {
      const friendUids = snapshot.docs.map((doc) => doc.id);

      if (friendUids.length === 0) {
        setAllUsers([]);
        return;
      }

      // Load full user profiles for all friends
      const friendProfiles = await Promise.all(
        friendUids.map(async (friendUid) => {
          const userRef = doc(db, "users", friendUid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) return null;
          return {
            id: friendUid,
            ...userSnap.data(),
          };
        })
      );

      // Filter out any null values and set the friends list
      setAllUsers(friendProfiles.filter(Boolean));
    });

    // Cleanup: Unsubscribe from friends listener when component unmounts or user changes
    return () => unsubscribe();
  }, [user]);

  /**
   * Load Global Chat Messages Effect
   *
   * Listens for changes to the global chat collection
   * Orders messages chronologically by creation time
   */
  useEffect(() => {
    if (!user) return;

    // Query global chat messages ordered by creation time
    const globalRef = collection(db, "globalChat");
    const q = query(globalRef, orderBy("createdAt", "asc"));

    // Subscribe to global chat for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGlobalMessages(messages);
    });

    // Cleanup: Unsubscribe when component unmounts or user changes
    return () => unsubscribe();
  }, [user]);

  /**
   * Load Chat Rooms Effect
   *
   * Listens for changes to the chatRooms collection
   * Loads all available chat rooms that users can join
   */
  useEffect(() => {
    if (!user) return;

    // Subscribe to chat rooms collection for real-time updates
    const roomsRef = collection(db, "chatRooms");
    const unsubscribe = onSnapshot(roomsRef, (snapshot) => {
      const rooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatRooms(rooms);
    });

    // Cleanup: Unsubscribe when component unmounts or user changes
    return () => unsubscribe();
  }, [user]);

  /**
   * Open Chat Window Function
   *
   * Opens a floating chat window for direct messaging with another user
   * Limits to 3 concurrent chat windows - removes oldest if limit reached
   * Prevents duplicate windows for the same user
   * Automatically starts loading messages for the conversation
   *
   * @param {string} userId - ID of the user to chat with
   * @param {string} userName - Display name of the user
   * @param {string} userAvatar - Avatar URL of the user (can be null)
   */
  const openChat = (userId, userName, userAvatar) => {
    setOpenChats((prev) => {
      // Check if chat is already open - don't open duplicate
      if (prev.find((chat) => chat.userId === userId)) {
        return prev;
      }

      // If 3 chats are already open, remove the oldest one (first in array)
      if (prev.length >= 3) {
        return [...prev.slice(1), { userId, userName, userAvatar }];
      }

      // Add new chat to the end of the array
      return [...prev, { userId, userName, userAvatar }];
    });

    // Always ensure messages are loading for this conversation
    // The loadMessages function now prevents duplicates internally
    loadMessages(userId);
  };

  /**
   * Close Chat Window Function
   *
   * Closes a specific chat window
   * Does NOT delete the conversation history - only closes the UI window
   *
   * @param {string} userId - ID of the user whose chat window to close
   */
  const closeChat = (userId) => {
    setOpenChats((prev) => prev.filter((chat) => chat.userId !== userId));
  };

  /**
   * Minimize Chat Window Function
   *
   * Currently just closes the chat (same as closeChat)
   * Can be enhanced in the future to minimize rather than close
   *
   * @param {string} userId - ID of the user whose chat window to minimize
   */
  const minimizeChat = (userId) => {
    closeChat(userId);
  };

  /**
   * Load Conversation Messages Function
   *
   * Sets up a real-time listener for messages in a specific conversation
   * Creates a unique conversation ID by sorting both user IDs alphabetically
   * This ensures both users access the same conversation regardless of who initiated it
   *
   * @param {string} otherUserId - ID of the other user in the conversation
   * @returns {function} Unsubscribe function to stop listening
   */
  const loadMessages = (otherUserId) => {
    if (!user) return;

    // Check if we already have an active listener for this user
    if (activeListenersRef.current.has(otherUserId)) {
      return activeListenersRef.current.get(otherUserId);
    }

    // Create a unique conversation ID by sorting user IDs
    // Example: user1="abc", user2="xyz" → conversationId="abc_xyz"
    // This ensures both users see the same conversation
    const conversationId = [user.uid, otherUserId].sort().join("_");

    // Query messages in this conversation, ordered chronologically
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    // Subscribe to message updates in real-time
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Store messages indexed by the other user's ID for easy access
      setConversations((prev) => ({
        ...prev,
        [otherUserId]: messages,
      }));
    }, (error) => {
      console.error("Error loading messages:", error);
      // Even on error, ensure we can retry
      activeListenersRef.current.delete(otherUserId);
    });

    // Store the unsubscribe function
    activeListenersRef.current.set(otherUserId, unsubscribe);

    return unsubscribe;
  };

  /**
   * Send Direct Message Function
   *
   * Sends a message to a specific user in a 1-on-1 conversation
   * Includes sender information and timestamp
   *
   * @param {string} recipientId - ID of the user receiving the message
   * @param {string} text - Message content
   */
  const sendMessage = async (recipientId, text) => {
    if (!user || !text.trim()) return;

    // Create conversation ID (same logic as loadMessages)
    const conversationId = [user.uid, recipientId].sort().join("_");
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );

    try {
      // Add new message document to Firestore
      await addDoc(messagesRef, {
        text: text.trim(),
        senderId: user.uid,
        senderName: profile?.firstName
          ? `${profile.firstName} ${profile.lastName || ""}`
          : "Anonymous",
        senderAvatar: profile?.photoUrl || null,
        recipientId,
        createdAt: serverTimestamp(), // Server timestamp ensures accurate ordering
        read: false, // Can be used for unread message indicators
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  /**
   * Send Global Message Function
   *
   * Sends a message to the global chat visible to all users
   *
   * @param {string} text - Message content
   */
  const sendGlobalMessage = async (text) => {
    if (!user || !text.trim()) return;

    const globalRef = collection(db, "globalChat");

    try {
      // Add new message to global chat collection
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

  /**
   * Create Chat Room Function
   *
   * Creates a new public chat room that other users can join
   * The creator is automatically added as the first member
   *
   * @param {string} roomName - Name of the chat room
   * @param {string} roomDescription - Optional description of the room's purpose
   * @returns {string|null} The new room's ID if successful, null if failed
   */
  const createChatRoom = async (roomName, roomDescription) => {
    if (!user || !roomName.trim()) return;

    const roomsRef = collection(db, "chatRooms");

    try {
      // Create new room document
      const roomDoc = await addDoc(roomsRef, {
        name: roomName.trim(),
        description: roomDescription?.trim() || "",
        createdBy: user.uid, // Track room creator for permissions
        createdAt: serverTimestamp(),
        members: [user.uid], // Creator is first member
      });
      return roomDoc.id;
    } catch (error) {
      console.error("Error creating chat room:", error);
      return null;
    }
  };

  /**
   * Join Chat Room Function
   *
   * Adds the current user to a chat room's member list
   * Users must join a room to send messages in it
   *
   * @param {string} roomId - ID of the room to join
   */
  const joinChatRoom = async (roomId) => {
    if (!user) return;

    const roomRef = doc(db, "chatRooms", roomId);

    try {
      // Add user to room's members array (arrayUnion prevents duplicates)
      await updateDoc(roomRef, {
        members: arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Error joining chat room:", error);
    }
  };

  /**
   * Leave Chat Room Function
   *
   * Removes the current user from a chat room's member list
   * User can no longer send messages until they rejoin
   *
   * @param {string} roomId - ID of the room to leave
   */
  const leaveChatRoom = async (roomId) => {
    if (!user) return;

    const roomRef = doc(db, "chatRooms", roomId);

    try {
      // Find the room in local state
      const room = chatRooms.find((r) => r.id === roomId);
      if (room && room.members) {
        // Filter out current user from members array
        const updatedMembers = room.members.filter((id) => id !== user.uid);
        await updateDoc(roomRef, {
          members: updatedMembers,
        });
      }
    } catch (error) {
      console.error("Error leaving chat room:", error);
    }
  };

  /**
   * Send Room Message Function
   *
   * Sends a message to a specific chat room
   * Only members of the room should be able to send messages
   *
   * @param {string} roomId - ID of the room
   * @param {string} text - Message content
   */
  const sendRoomMessage = async (roomId, text) => {
    if (!user || !text.trim()) return;

    // Reference to messages subcollection within the room document
    const messagesRef = collection(db, "chatRooms", roomId, "messages");

    try {
      // Add new message to room's messages subcollection
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

  /**
   * Load Room Messages Function
   *
   * Sets up a real-time listener for messages in a specific chat room
   * Messages are ordered chronologically
   *
   * @param {string} roomId - ID of the room to load messages from
   * @returns {function} Unsubscribe function to stop listening
   */
  const loadRoomMessages = (roomId) => {
    if (!user) return;

    // Query messages in room, ordered chronologically
    const messagesRef = collection(db, "chatRooms", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    // Subscribe to room messages for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Store messages indexed by room ID
      setRoomMessages((prev) => ({
        ...prev,
        [roomId]: messages,
      }));
    });

    return unsubscribe;
  };

  /**
   * Delete Chat Room Function
   *
   * Deletes a chat room and all its messages
   * Only the room creator should be able to delete the room
   * This is a permanent action that cannot be undone
   *
   * @param {string} roomId - ID of the room to delete
   */
  const deleteChatRoom = async (roomId) => {
    if (!user) return;

    const roomRef = doc(db, "chatRooms", roomId);

    try {
      // Step 1: Delete all messages in the room first
      const messagesRef = collection(db, "chatRooms", roomId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);

      // Create array of delete promises for all messages
      const deletePromises = messagesSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Step 2: Delete the room document itself
      await deleteDoc(roomRef);

      // Step 3: Clear room messages from local state
      setRoomMessages((prev) => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
    } catch (error) {
      console.error("Error deleting chat room:", error);
    }
  };

  /**
   * Clear Global Messages Function
   *
   * Deletes all messages from the global chat
   * This is a permanent action that cannot be undone
   * Should typically be restricted to admin users
   */
  const clearGlobalMessages = async () => {
    if (!user) return;

    const globalRef = collection(db, "globalChat");

    try {
      // Get all global messages
      const snapshot = await getDocs(globalRef);

      // Delete all messages concurrently
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing global messages:", error);
    }
  };

  /**
   * Clear Room Messages Function
   *
   * Deletes all messages in a specific chat room
   * The room itself remains, only messages are deleted
   * Only the room creator should be able to clear messages
   * This is a permanent action that cannot be undone
   *
   * @param {string} roomId - ID of the room whose messages to clear
   */
  const clearRoomMessages = async (roomId) => {
    if (!user) return;

    const messagesRef = collection(db, "chatRooms", roomId, "messages");

    try {
      // Get all messages in the room
      const snapshot = await getDocs(messagesRef);

      // Delete all messages concurrently
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing room messages:", error);
    }
  };

  // Context value object containing all state and functions
  // This is what components will access via useMessenger()
  const value = {
    // UI State
    isMessengerOpen,
    setIsMessengerOpen,
    activeView,
    setActiveView,

    // Direct Messages
    openChats,
    openChat,
    closeChat,
    minimizeChat,
    conversations,
    sendMessage,
    loadMessages,

    // Users
    allUsers,

    // Global Chat
    globalMessages,
    sendGlobalMessage,
    clearGlobalMessages,

    // Chat Rooms
    chatRooms,
    createChatRoom,
    joinChatRoom,
    leaveChatRoom,
    deleteChatRoom,
    roomMessages,
    sendRoomMessage,
    loadRoomMessages,
    clearRoomMessages,

    // Auth (for convenience - duplicated from AuthContext)
    user,
    profile,
  };

  return (
    <MessengerContext.Provider value={value}>
      {children}
    </MessengerContext.Provider>
  );
};
