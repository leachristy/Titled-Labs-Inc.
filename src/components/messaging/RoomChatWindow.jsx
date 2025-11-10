import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMessenger } from "../../contexts/MessengerContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function RoomChatWindow({ room, onClose }) {
  const { roomMessages, sendRoomMessage, loadRoomMessages, user, leaveChatRoom, deleteChatRoom, clearRoomMessages } = useMessenger();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth <= 1024
  );
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const messages = roomMessages[room.id] || [];

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width <= 1024);
    };
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    // Load room messages when component mounts
    if (room.id) {
      loadRoomMessages(room.id);
    }
  }, [room.id, loadRoomMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && room.id) {
      sendRoomMessage(room.id, message.trim());
      setMessage("");
    }
  };

  const handleLeaveRoom = () => {
    if (window.confirm(`Are you sure you want to leave "${room.name}"?`)) {
      leaveChatRoom(room.id);
      onClose();
    }
  };

  const handleDeleteRoom = () => {
    if (window.confirm(`Are you sure you want to DELETE "${room.name}"? This will delete all messages and cannot be undone.`)) {
      deleteChatRoom(room.id);
      onClose();
    }
  };

  const handleClearMessages = () => {
    if (window.confirm(`Are you sure you want to clear all messages in "${room.name}"? This cannot be undone.`)) {
      clearRoomMessages(room.id);
    }
  };

  // Don't show if user is not logged in
  if (!user) return null;

  const isCreator = room.createdBy === user?.uid;

  return (
    <div className={`fixed ${isMobile ? "inset-0" : "inset-0"} bg-black/50 flex items-center justify-center z-100`}>
      <div
        className={`bg-white flex flex-col ${
          isMobile
            ? "w-full h-full"
            : isTablet
            ? "w-[700px] h-[750px] rounded-lg shadow-2xl"
            : "w-[600px] h-[700px] rounded-lg shadow-2xl"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 flex items-center justify-between ${
            isMobile ? "" : "rounded-t-lg"
          } ${isEarthy ? "bg-amber-700" : "bg-charcoal-grey"}`}
        >
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">{room.name}</h3>
              {room.description && (
                <p className="text-white/80 text-xs">{room.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">
              {room.members?.length || 0} members
            </div>
            
            {/* Creator Menu */}
            {isCreator && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                  title="Room options"
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
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleClearMessages();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-2 text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear Messages
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDeleteRoom();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-2 text-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                      Delete Room
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Leave Room Button (for non-creators) */}
            {!isCreator && (
              <button
                onClick={handleLeaveRoom}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                title="Leave room"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${
          isEarthy ? "bg-cream-50" : "bg-cool-grey/10"
        }`}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="text-4xl mb-3">💬</div>
                <p className={isEarthy ? "text-brown-600" : "text-slate-blue"}>No messages yet.</p>
                <p className={`text-sm ${isEarthy ? "text-brown-600/70" : "text-slate-blue/70"}`}>Start the conversation!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isOwnMessage = msg.senderId === user?.uid;
                return (
                  <div key={msg.id} className="flex flex-col gap-1">
                    {/* Username (clickable) */}
                    {!isOwnMessage && (
                      <div className="flex items-center gap-2 px-2">
                        <button
                          onClick={() => {
                            if (msg.senderId) {
                              navigate(`/profile/${msg.senderId}`);
                              onClose();
                            }
                          }}
                          className={`text-xs font-semibold transition ${
                            isEarthy 
                              ? "text-brown-700 hover:text-rust-500" 
                              : "text-slate-blue hover:text-light-lavender"
                          } hover:underline`}
                        >
                          {msg.senderName || "Anonymous"}
                        </button>
                      </div>
                    )}
                    
                    <div
                      className={`flex ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                          isOwnMessage
                            ? isEarthy
                              ? "bg-rust-500 text-white"
                              : "bg-light-lavender text-charcoal-grey"
                            : isEarthy
                            ? "bg-tan-100 text-brown-800 border border-tan-200"
                            : "bg-pale-lavender text-charcoal-grey border border-blue-grey"
                        }`}
                      >
                        <p className="text-sm wrap-break-word">{msg.text}</p>
                        {msg.createdAt && (
                          <p className="text-xs mt-1 opacity-60">
                            {msg.createdAt.toDate().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSend}
          className={`p-4 border-t bg-white ${
            isMobile ? "" : "rounded-b-lg"
          } ${isEarthy ? "border-tan-200" : "border-blue-grey"}`}
        >
          <div className="flex items-center gap-2">
            <div className={`flex-1 rounded-full px-4 py-3 flex items-center ${
              isEarthy ? "bg-cream-100" : "bg-pale-lavender"
            }`}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className={`flex-1 bg-transparent border-none outline-none ${
                  isEarthy 
                    ? "text-brown-800 placeholder-brown-600/50" 
                    : "text-charcoal-grey placeholder-slate-blue/50"
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className={`p-3 rounded-full transition-all ${
                message.trim()
                  ? isEarthy
                    ? "bg-rust-500 text-white hover:bg-rust-600"
                    : "bg-light-lavender text-charcoal-grey hover:bg-medium-lavender"
                  : isEarthy
                  ? "bg-tan-200 text-brown-600/50 cursor-not-allowed"
                  : "bg-cool-grey text-slate-blue/50 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
