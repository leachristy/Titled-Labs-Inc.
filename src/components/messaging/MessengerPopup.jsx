import { useState, useEffect } from "react";
import { useMessenger } from "../../contexts/MessengerContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../src/firebase";
import MobileChatView from "./MobileChatView";
import GlobalChatWindow from "./GlobalChatWindow";
import RoomChatWindow from "./RoomChatWindow";

export default function MessengerPopup() {
  const {
    isMessengerOpen,
    setIsMessengerOpen,
    openChat,
    allUsers,
    activeView,
    setActiveView,
    globalMessages,
    sendGlobalMessage,
    chatRooms,
    createChatRoom,
    joinChatRoom,
    leaveChatRoom,
    roomMessages,
    sendRoomMessage,
    loadRoomMessages,
    user,
  } = useMessenger();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth <= 1024
  );
  const [mobileChat, setMobileChat] = useState(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [showGlobalChat, setShowGlobalChat] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width <= 1024);
    };
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Search all users when search query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        
        const searchLower = searchQuery.toLowerCase();
        const results = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((u) => {
            if (u.id === user.uid) return false; // Exclude current user
            const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
            return fullName.includes(searchLower);
          });

        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, user]);

  // Don't show messenger if user is not logged in
  if (!user) return null;

  if (!isMessengerOpen) return null;

  // Show mobile chat view if a chat is active on mobile
  if (isMobile && mobileChat) {
    return (
      <MobileChatView
        userId={mobileChat.userId}
        userName={mobileChat.userName}
        userAvatar={mobileChat.userAvatar}
        onClose={() => setMobileChat(null)}
      />
    );
  }

  // Use search results when searching, otherwise show friends
  const displayUsers = searchQuery.trim() 
    ? searchResults 
    : allUsers;

  const handleMessageClick = (user) => {
    if (isMobile) {
      // Open mobile single-chat view
      setMobileChat({
        userId: user.id,
        userName: `${user.firstName || "User"} ${user.lastName || ""}`,
        userAvatar: user.photoUrl || null,
      });
    } else {
      // Open desktop floating chat window
      openChat(
        user.id,
        `${user.firstName || "User"} ${user.lastName || ""}`,
        user.photoUrl || null
      );
    }
  };

  const handleOpenChatFromMessage = (userId, userName, userAvatar) => {
    if (isMobile) {
      // Open mobile single-chat view
      setMobileChat({
        userId,
        userName,
        userAvatar,
      });
    } else {
      // Open desktop floating chat window
      openChat(userId, userName, userAvatar);
    }
  };

  return (
    <>
      {/* Messenger Popup */}
      <div
        className={`fixed bottom-24 right-6 ${
          isTablet ? "w-96" : "w-80"
        } rounded-lg shadow-2xl ${
          isMobile ? "z-50" : "z-40"
        } bg-white`}
        style={{ maxHeight: isTablet ? "600px" : "550px" }}
      >
        {/* Header */}
        <div className={`p-4 rounded-t-lg ${
          isEarthy ? "bg-amber-700" : "bg-light-lavender"
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg">Messages</h3>
            <button
              onClick={() => setIsMessengerOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1.5 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3">
            <button
              onClick={() => setActiveView("chats")}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition ${
                activeView === "chats"
                  ? "bg-white text-gray-900"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveView("rooms")}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition ${
                activeView === "rooms"
                  ? "bg-white text-gray-900"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => setShowGlobalChat(true)}
              className="flex-1 py-2 px-2 rounded-lg text-xs font-medium transition bg-white/20 text-white hover:bg-white/30"
            >
              Global
            </button>
          </div>

          {/* Search Bar (only for chats) */}
          {activeView === "chats" && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mt-3 px-4 py-2 rounded-full border-none outline-none bg-white/20 text-white placeholder-white/70"
            />
          )}
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto bg-white" style={{ maxHeight: isTablet ? "430px" : "380px" }}>
          {/* Chats View */}
          {activeView === "chats" && (
            <>
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </div>
                </div>
              ) : displayUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery ? "No users found" : "No friends yet. Add friends to start chatting!"}
                </div>
              ) : (
                displayUsers.map((user) => {
                  const isOnline = user.online === true;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleMessageClick(user)}
                      className={`w-full p-3 border-b border-gray-100 flex items-center justify-between transition-all duration-200 text-left group ${
                        isEarthy
                          ? "hover:bg-cream-100 hover:border-tan-200"
                          : "hover:bg-purple-50 hover:border-light-lavender/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Avatar with Online Status */}
                        <div className="relative shrink-0 transition-transform duration-200 group-hover:scale-105">
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                            {user.photoUrl ? (
                              <img
                                src={user.photoUrl}
                                alt={user.firstName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 font-semibold text-lg">
                                {user.firstName?.[0]?.toUpperCase() || "?"}
                              </span>
                            )}
                          </div>
                          {/* Online Status Indicator */}
                          <div
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white transition-transform duration-200 group-hover:scale-110 ${
                              isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                            title={isOnline ? "Online" : "Offline"}
                          />
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold truncate transition-colors duration-200 ${
                            isEarthy 
                              ? "text-gray-900 group-hover:text-rust-500" 
                              : "text-gray-900 group-hover:text-light-lavender"
                          }`}>
                            {user.firstName || "User"} {user.lastName || ""}
                          </p>
                          <p className={`text-xs transition-colors duration-200 ${
                            isEarthy
                              ? "text-gray-500 group-hover:text-brown-600"
                              : "text-gray-500 group-hover:text-slate-blue"
                          }`}>
                            {isOnline ? "Active now" : "Offline"}
                          </p>
                        </div>
                      </div>

                      {/* Message Icon */}
                      <div className={`shrink-0 transition-all duration-200 group-hover:translate-x-1 ${
                        isEarthy 
                          ? "text-amber-700 group-hover:text-rust-500" 
                          : "text-light-lavender group-hover:text-purple-500"
                      }`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                    </button>
                  );
                })
              )}
            </>
          )}

          {/* Rooms View */}
          {activeView === "rooms" && (
            <div className="p-3">
              {/* Create Room Button */}
              <button
                onClick={() => setShowCreateRoom(true)}
                className={`w-full py-3 rounded-lg font-medium transition mb-3 ${
                  isEarthy
                    ? "bg-amber-700 hover:bg-amber-800 text-white"
                    : "bg-light-lavender hover:bg-purple-400 text-white"
                }`}
              >
                + Create Room
              </button>

              {/* Room List */}
              {chatRooms.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  No rooms available yet
                </div>
              ) : (
                <div className="space-y-2">
                  {chatRooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => {
                        if (room.members?.includes(user?.uid)) {
                          setActiveRoom(room);
                        } else {
                          joinChatRoom(room.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{room.name}</h4>
                          {room.description && (
                            <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {room.members?.length || 0} members
                          </p>
                        </div>
                        {room.members?.includes(user?.uid) ? (
                          <span className={`text-xs px-2 py-1 rounded ${
                            isEarthy ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            Joined
                          </span>
                        ) : (
                          <button
                            className={`text-xs px-3 py-1 rounded font-medium ${
                              isEarthy
                                ? "bg-amber-700 hover:bg-amber-800 text-white"
                                : "bg-light-lavender hover:bg-purple-400 text-white"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              joinChatRoom(room.id);
                            }}
                          >
                            Join
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Global Chat Window */}
      {showGlobalChat && (
        <GlobalChatWindow 
          onClose={() => setShowGlobalChat(false)} 
          onOpenChat={handleOpenChatFromMessage}
        />
      )}

      {/* Room Chat Window */}
      {activeRoom && (
        <RoomChatWindow 
          room={activeRoom} 
          onClose={() => setActiveRoom(null)} 
          onOpenChat={handleOpenChatFromMessage}
        />
      )}

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999">
          <div className="bg-white rounded-lg p-6 w-80 mx-4 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">Create Chat Room</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-lavender-500"
                  placeholder="Enter room name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-lavender-500 resize-none"
                  placeholder="Enter room description"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowCreateRoom(false);
                  setRoomName("");
                  setRoomDescription("");
                }}
                className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (roomName.trim()) {
                    const newRoomId = await createChatRoom(roomName.trim(), roomDescription.trim());
                    setShowCreateRoom(false);
                    setRoomName("");
                    setRoomDescription("");
                    
                    // Open the newly created room
                    if (newRoomId) {
                      // Find the room in chatRooms list and open it
                      setTimeout(() => {
                        const newRoom = chatRooms.find(r => r.id === newRoomId);
                        if (newRoom) {
                          setActiveRoom(newRoom);
                        }
                      }, 500); // Small delay to allow Firebase to update
                    }
                  }
                }}
                className={`flex-1 py-2 rounded-lg text-white transition ${
                  isEarthy
                    ? "bg-amber-700 hover:bg-amber-800"
                    : "bg-light-lavender hover:bg-purple-400"
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
