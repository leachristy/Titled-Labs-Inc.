import { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../src/firebase";

export default function DirectChat({ isOpen, onClose }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const { user, profile } = UserAuth();

  const [view, setView] = useState("list");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [startingConversationWith, setStartingConversationWith] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const messagesEndRef = useRef(null);

  // Sync with parent's isOpen prop
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  // Fetch conversations
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(convos);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch messages for active tab
  useEffect(() => {
    if (!activeTabId) {
      setMessages([]);
      return;
    }

    const activeChat = openTabs.find(tab => tab.id === activeTabId);
    if (!activeChat) {
      setMessages([]);
      return;
    }

    if (activeChat.isTemporary || !activeChat.id || activeChat.id.startsWith('temp-')) {
      setMessages([]);
      return;
    }

    console.log("Setting up message listener for:", activeChat.id);

    const q = query(
      collection(db, "conversations", activeChat.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Messages received:", msgs.length);
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [activeTabId, openTabs]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Search users
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }))
        .filter(
          (u) =>
            u.uid !== user.uid &&
            (u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      setSearchResults(users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setIsSearching(false);
  };

  // Start new conversation
  const startConversation = async (otherUser) => {
    console.log("Opening chat with:", otherUser);
    
    if (!user || !otherUser) {
      console.error("Missing user data:", { user, otherUser });
      return;
    }

    setStartingConversationWith(otherUser.uid);

    try {
      const existingConvo = conversations.find((c) =>
        c.participants.includes(otherUser.uid)
      );

      let chatToOpen;

      if (existingConvo) {
        console.log("Found existing conversation:", existingConvo);
        chatToOpen = existingConvo;
      } else {
        console.log("Creating temporary chat window...");
        chatToOpen = {
          id: `temp-${otherUser.uid}`,
          participants: [user.uid, otherUser.uid],
          participantDetails: {
            [user.uid]: {
              name: `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "Unknown",
              avatar: profile?.photoUrl || null,
            },
            [otherUser.uid]: {
              name: `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() || "Unknown",
              avatar: otherUser.photoUrl || null,
            },
          },
          lastMessage: "",
          lastMessageTime: new Date(),
          createdAt: new Date(),
          isTemporary: true,
        };
      }

      const existingTab = openTabs.find(tab => 
        tab.id === chatToOpen.id || 
        (tab.isTemporary && tab.participants.includes(otherUser.uid))
      );

      if (existingTab) {
        setActiveTabId(existingTab.id);
      } else {
        setOpenTabs(prev => [...prev, chatToOpen]);
        setActiveTabId(chatToOpen.id);
      }

      // Don't auto-minimize - let user keep the Messages window open
      console.log("Opened chat tab");
    } catch (error) {
      console.error("Error opening chat:", error);
      alert("Failed to open chat. Please try again.");
    } finally {
      setStartingConversationWith(null);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log("Send message triggered. newMessage:", newMessage, "activeTabId:", activeTabId);
    
    if (!newMessage.trim() || !activeTabId) {
      console.log("Message empty or no active tab");
      return;
    }

    const activeTab = openTabs.find(tab => tab.id === activeTabId);
    if (!activeTab) {
      console.log("Active tab not found in openTabs");
      return;
    }

    console.log("Active tab:", activeTab);

    try {
      let conversationId = activeTab.id;
      let updatedChat = { ...activeTab };

      if (activeTab.isTemporary || !activeTab.id || activeTab.id.startsWith('temp-')) {
        console.log("Creating conversation in Firestore...");
        const convoRef = await addDoc(collection(db, "conversations"), {
          participants: activeTab.participants,
          participantDetails: activeTab.participantDetails,
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
        conversationId = convoRef.id;
        console.log("Conversation created with ID:", conversationId);

        updatedChat = {
          ...activeTab,
          id: conversationId,
          isTemporary: false,
        };

        setOpenTabs(prev => prev.map(tab => 
          tab.id === activeTab.id ? updatedChat : tab
        ));
        setActiveTabId(conversationId);
      }

      console.log("Adding message to conversation:", conversationId);
      await addDoc(
        collection(db, "conversations", conversationId, "messages"),
        {
          text: newMessage,
          senderId: user.uid,
          senderName: `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "Unknown",
          createdAt: serverTimestamp(),
        }
      );

      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp(),
      });

      setNewMessage("");
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const closeTab = (tabId) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTabId === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[0].id : null);
    }
  };

  const getOtherParticipant = (conversation) => {
    const otherUserId = conversation.participants.find((p) => p !== user.uid);
    return conversation.participantDetails?.[otherUserId];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Chat Button */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className={`fixed bottom-4 right-4 sm:right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 ${
            isEarthy ? "bg-rust-500 hover:bg-rust-600" : "bg-slate-blue hover:bg-opacity-90"
          } text-white z-[9999]`}
          title="Open Messages"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {conversations.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
              {conversations.length}
            </span>
          )}
        </button>
      )}

      {/* Full Chat Window */}
      {!isMinimized && (
        <div
          className={`fixed bottom-0 right-4 sm:right-8 w-full sm:w-96 h-[600px] max-h-[90vh] shadow-2xl rounded-t-2xl border-2 ${
            isEarthy ? "bg-cream-50 border-tan-300" : "bg-white border-gray-300"
          } z-[9999] flex flex-col`}
        >
          <div
            className={`flex items-center justify-between p-4 rounded-t-2xl ${
              isEarthy ? "bg-rust-500" : "bg-slate-blue"
            } text-white`}
          >
            <h3 className="font-bold text-lg">
              {view === "search" ? "Find People" : "Messages"}
            </h3>
            <div className="flex items-center space-x-2">
              {view === "list" && (
                <button
                  onClick={() => setView("search")}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
              {view === "search" && (
                <button
                  onClick={() => setView("list")}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsMinimized(true)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {view === "list" && (
              <div className="p-2">
                {conversations.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className={`w-16 h-16 mx-auto mb-4 ${
                        isEarthy ? "text-brown-300" : "text-gray-300"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className={isEarthy ? "text-brown-600" : "text-gray-600"}>
                      No messages yet
                    </p>
                    <button
                      onClick={() => setView("search")}
                      className={`mt-4 px-4 py-2 rounded-lg font-medium ${
                        isEarthy
                          ? "bg-rust-500 hover:bg-rust-600"
                          : "bg-slate-blue hover:bg-opacity-90"
                      } text-white`}
                    >
                      Start a conversation
                    </button>
                  </div>
                ) : (
                  conversations.map((convo) => {
                    const otherUser = getOtherParticipant(convo);
                    return (
                      <button
                        key={convo.id}
                        onClick={() => {
                          const existingTab = openTabs.find(tab => tab.id === convo.id);
                          if (!existingTab) {
                            setOpenTabs(prev => [...prev, convo]);
                          }
                          setActiveTabId(convo.id);
                          // Don't auto-minimize - let user keep Messages window open
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
                          isEarthy
                            ? "hover:bg-cream-100"
                            : "hover:bg-pale-lavender"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            isEarthy ? "bg-rust-500" : "bg-slate-blue"
                          }`}
                        >
                          {otherUser?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 text-left">
                          <p
                            className={`font-semibold ${
                              isEarthy ? "text-brown-800" : "text-charcoal-grey"
                            }`}
                          >
                            {otherUser?.name || "Unknown"}
                          </p>
                          <p
                            className={`text-sm truncate ${
                              isEarthy ? "text-brown-600" : "text-gray-600"
                            }`}
                          >
                            {convo.lastMessage || "No messages yet"}
                          </p>
                        </div>
                        <span
                          className={`text-xs ${
                            isEarthy ? "text-brown-500" : "text-gray-500"
                          }`}
                        >
                          {formatTime(convo.lastMessageTime)}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {view === "search" && (
              <div className="p-4">
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email..."
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        isEarthy
                          ? "border-tan-300 focus:ring-rust-500"
                          : "border-cool-grey focus:ring-slate-blue"
                      }`}
                    />
                    <svg
                      className={`absolute left-3 top-2.5 w-5 h-5 ${
                        isEarthy ? "text-brown-400" : "text-gray-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className={`w-full mt-2 px-4 py-2 rounded-lg font-medium text-white ${
                      isEarthy
                        ? "bg-rust-500 hover:bg-rust-600"
                        : "bg-slate-blue hover:bg-opacity-90"
                    } disabled:opacity-50`}
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                </form>

                <div className="space-y-2">
                  {searchResults.map((searchUser) => (
                    <div
                      key={searchUser.uid}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isEarthy ? "bg-cream-100" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            isEarthy ? "bg-rust-500" : "bg-slate-blue"
                          }`}
                        >
                          {searchUser.firstName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p
                            className={`font-semibold ${
                              isEarthy ? "text-brown-800" : "text-charcoal-grey"
                            }`}
                          >
                            {searchUser.firstName} {searchUser.lastName}
                          </p>
                          <p
                            className={`text-xs ${
                              isEarthy ? "text-brown-600" : "text-gray-600"
                            }`}
                          >
                            {searchUser.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          startConversation(searchUser);
                        }}
                        disabled={startingConversationWith === searchUser.uid}
                        className={`px-3 py-1 rounded-lg text-sm font-medium text-white transition ${
                          isEarthy
                            ? "bg-rust-500 hover:bg-rust-600 disabled:bg-rust-300"
                            : "bg-slate-blue hover:bg-opacity-90 disabled:bg-gray-400"
                        } disabled:cursor-not-allowed`}
                      >
                        {startingConversationWith === searchUser.uid ? "..." : "Message"}
                      </button>
                    </div>
                  ))}
                  {searchResults.length === 0 && searchQuery && !isSearching && (
                    <p
                      className={`text-center py-8 ${
                        isEarthy ? "text-brown-600" : "text-gray-600"
                      }`}
                    >
                      No users found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Tabs - Always visible */}
      {openTabs.map((tab, index) => {
        const isActiveTab = tab.id === activeTabId;
        
        return (
          <div
            key={tab.id}
            className={`fixed bottom-0 shadow-2xl rounded-t-2xl border-2 ${
              isEarthy ? "bg-cream-50 border-tan-300" : "bg-white border-gray-300"
            } z-[9998] w-80 flex flex-col`}
            style={{ 
              right: `${(index * 320) + 96}px`,
              zIndex: 9998 - index,
              height: isActiveTab ? '450px' : '48px'
            }}
          >
            <div
              className={`flex items-center justify-between p-3 rounded-t-2xl ${
                isEarthy ? "bg-rust-500" : "bg-slate-blue"
              } text-white cursor-pointer`}
              onClick={() => {
                if (!isActiveTab) {
                  setActiveTabId(tab.id);
                }
              }}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isEarthy ? "bg-rust-600" : "bg-slate-600"
                  }`}
                >
                  {getOtherParticipant(tab)?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <span className="font-semibold text-sm truncate">
                  {getOtherParticipant(tab)?.name || "Chat"}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="hover:bg-white hover:bg-opacity-20 p-1 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isActiveTab && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-6">
                      <p
                        className={`text-sm ${
                          isEarthy ? "text-brown-600" : "text-gray-600"
                        }`}
                      >
                        Start your conversation
                      </p>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === user.uid;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                            isOwn
                              ? isEarthy
                                ? "bg-rust-500 text-white"
                                : "bg-slate-blue text-white"
                              : isEarthy
                              ? "bg-cream-100 text-brown-800"
                              : "bg-gray-100 text-charcoal-grey"
                          }`}
                        >
                          <p className="break-words">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className={`p-2 border-t ${
                    isEarthy ? "border-tan-200" : "border-gray-200"
                  }`}
                >
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className={`flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 ${
                        isEarthy
                          ? "border-tan-300 focus:ring-rust-500"
                          : "border-cool-grey focus:ring-slate-blue"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className={`p-2 rounded-full text-white ${
                        isEarthy
                          ? "bg-rust-500 hover:bg-rust-600"
                          : "bg-slate-blue hover:bg-opacity-90"
                      } disabled:opacity-50`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
