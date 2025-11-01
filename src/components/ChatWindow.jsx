import { useState, useEffect, useRef } from "react";
import { useMessenger } from "../contexts/MessengerContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";

export default function ChatWindow({ userId, userName, userAvatar, index }) {
  const { closeChat, minimizeChat, conversations, sendMessage } = useMessenger();
  const { currentTheme } = useTheme();
  const { user } = UserAuth();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const messages = conversations[userId] || [];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(userId, message);
      setMessage("");
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/${userId}`);
  };

  // Position calculation (stacked to the left, starting from right of screen minus messenger width)
  // Messenger popup is 320px wide (w-80 = 320px) + 24px right margin = 344px from right
  // Each chat window is 320px wide + 20px gap
  const rightPosition = 350 + (index * 340); // Start 350px from right (left of messenger), then stack left

  return (
    <div
      className={`fixed bottom-6 w-80 rounded-lg shadow-2xl z-40 transition-all ${
        isEarthy ? "bg-amber-50" : "bg-purple-50"
      }`}
      style={{ right: `${rightPosition}px`, height: isMinimized ? "56px" : "400px" }}
    >
      {/* Header */}
      <div
        className={`p-3 rounded-t-lg flex items-center justify-between cursor-pointer ${
          isEarthy
            ? "bg-amber-700"
            : "bg-[#c7b4e2]"
        }`}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleProfileClick();
            }}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {userName?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>

          {/* Name */}
          <span className="text-white font-medium text-sm">{userName}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Minimize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="text-white hover:bg-white/20 rounded p-1 transition"
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
                d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeChat(userId);
            }}
            className="text-white hover:bg-white/20 rounded p-1 transition"
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
          </button>
        </div>
      </div>

      {/* Chat Content (Hidden when minimized) */}
      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div
            className={`overflow-y-auto p-3 space-y-2 ${
              isEarthy ? "bg-amber-50" : "bg-purple-50"
            }`}
            style={{ height: "290px" }}
          >
            {messages.length === 0 ? (
              <div className={`flex items-center justify-center h-full text-sm ${
                isEarthy ? "text-amber-600" : "text-purple-600"
              }`}>
                Start a conversation!
              </div>
            ) : (
              messages.map((msg) => {
                const isSender = msg.senderId === user?.uid;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-lg ${
                        isSender
                          ? isEarthy
                            ? "bg-amber-700 text-white"
                            : "bg-[#c7b4e2] text-gray-900"
                          : isEarthy
                          ? "bg-amber-200 text-amber-900"
                          : "bg-purple-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.createdAt?.toDate?.()?.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className={`p-3 border-t ${
            isEarthy ? "border-amber-300 bg-white" : "border-purple-300 bg-white"
          }`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className={`flex-1 px-3 py-2 border rounded-lg outline-none text-sm ${
                  isEarthy
                    ? "border-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    : "border-purple-300 focus:border-[#c7b4e2] focus:ring-1 focus:ring-[#c7b4e2]"
                }`}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  isEarthy
                    ? "bg-amber-700 hover:bg-amber-800 disabled:hover:bg-amber-700 text-white"
                    : "bg-[#c7b4e2] hover:bg-[#b49fd3] disabled:hover:bg-[#c7b4e2] text-gray-900"
                }`}
              >
                Send
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
