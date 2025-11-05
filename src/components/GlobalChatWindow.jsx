import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMessenger } from "../contexts/MessengerContext";
import { useTheme } from "../contexts/ThemeContext";

export default function GlobalChatWindow({ onClose }) {
  const { globalMessages, sendGlobalMessage, user, clearGlobalMessages } = useMessenger();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendGlobalMessage(message.trim());
      setMessage("");
    }
  };

  const handleClearGlobal = () => {
    if (window.confirm("Are you sure you want to clear ALL global messages? This cannot be undone.")) {
      clearGlobalMessages();
      setShowMenu(false);
    }
  };

  // Don't show if user is not logged in
  if (!user) return null;

  return (
    <div className={`fixed ${isMobile ? "inset-0" : "inset-0"} bg-black/50 flex items-center justify-center z-100`}>
      <div
        className={`bg-white flex flex-col ${
          isMobile
            ? "w-full h-full"
            : "w-[600px] h-[700px] rounded-lg shadow-2xl"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 flex items-center justify-between ${
            isMobile ? "" : "rounded-t-lg"
          } ${isEarthy ? "bg-amber-700" : "bg-[#c7b4e2]"}`}
        >
          <div className="flex items-center gap-3">
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
            <h3 className="text-white font-semibold text-lg">Global Chat</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">
              {globalMessages.length} messages
            </div>
            
            {/* Clear Messages Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                title="Options"
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
                    onClick={handleClearGlobal}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Clear All Messages
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {globalMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="text-4xl mb-3">👋</div>
                <p className="text-gray-500">No messages yet.</p>
                <p className="text-gray-400 text-sm">Be the first to say hi!</p>
              </div>
            </div>
          ) : (
            <>
              {globalMessages.map((msg) => {
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
                          className="text-xs font-semibold text-gray-700 hover:text-blue-600 hover:underline transition"
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
                              ? "bg-amber-700 text-white"
                              : "bg-linear-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-white text-gray-900 border border-gray-200"
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
          className={`p-4 border-t border-gray-200 bg-white ${
            isMobile ? "" : "rounded-b-lg"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className={`p-3 rounded-full transition-all ${
                message.trim()
                  ? isEarthy
                    ? "bg-amber-700 text-white hover:bg-amber-800"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
