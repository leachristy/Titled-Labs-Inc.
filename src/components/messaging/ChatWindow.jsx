import { useState, useEffect, useRef } from "react";
import { useMessenger } from "../../contexts/MessengerContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";

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

  // Group consecutive messages from same sender
  const groupMessages = (messages) => {
    const grouped = [];
    let currentGroup = null;

    messages.forEach((msg) => {
      if (!currentGroup || currentGroup.senderId !== msg.senderId) {
        if (currentGroup) grouped.push(currentGroup);
        currentGroup = {
          senderId: msg.senderId,
          senderName: msg.senderName,
          senderAvatar: msg.senderAvatar,
          messages: [msg],
        };
      } else {
        currentGroup.messages.push(msg);
      }
    });

    if (currentGroup) grouped.push(currentGroup);
    return grouped;
  };

  const groupedMessages = groupMessages(messages);

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

  // Don't show chat window if user is not logged in
  if (!user) return null;

  return (
    <div
      className="fixed bottom-6 w-80 rounded-lg shadow-2xl z-40 transition-all bg-white"
      style={{ right: `${rightPosition}px`, height: isMinimized ? "56px" : "400px" }}
    >
      {/* Header */}
      <div
        className={`p-3 rounded-t-lg flex items-center justify-between cursor-pointer ${
          isEarthy ? "bg-amber-700" : "bg-light-lavender"
        }`}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-white"
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
          <span className="text-white font-semibold text-sm">{userName}</span>
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
            className="overflow-y-auto p-3 space-y-3 bg-white dark:bg-gray-50"
            style={{ height: "290px" }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Start a conversation!
              </div>
            ) : (
              groupedMessages.map((group, groupIndex) => {
                const isCurrentUser = group.senderId === user?.uid;
                
                return (
                  <div
                    key={groupIndex}
                    className={`flex gap-2 ${
                      isCurrentUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar (only for other user) */}
                    {!isCurrentUser && (
                      <div className="shrink-0 self-end">
                        <img
                          src={
                            group.senderAvatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              group.senderName || "User"
                            )}&background=random`
                          }
                          alt={group.senderName}
                          className="w-7 h-7 rounded-full"
                        />
                      </div>
                    )}

                    {/* Message Group */}
                    <div
                      className={`flex flex-col ${
                        isCurrentUser ? "items-end" : "items-start"
                      } max-w-[75%]`}
                    >
                      {/* Messages */}
                      {group.messages.map((msg, msgIndex) => {
                        const isFirst = msgIndex === 0;
                        const isLast = msgIndex === group.messages.length - 1;

                        return (
                          <div
                            key={msg.id}
                            className={`px-3 py-2 ${
                              msgIndex > 0 ? "mt-0.5" : ""
                            } ${
                              isCurrentUser
                                ? isEarthy
                                  ? "bg-amber-700 text-white"
                                  : "bg-linear-to-r from-blue-500 to-blue-600 text-white"
                                : "bg-gray-200 text-gray-900"
                            } ${
                              isCurrentUser
                                ? isFirst && isLast
                                  ? "rounded-2xl"
                                  : isFirst
                                  ? "rounded-2xl rounded-br-md"
                                  : isLast
                                  ? "rounded-2xl rounded-tr-md"
                                  : "rounded-l-2xl rounded-r-md"
                                : isFirst && isLast
                                ? "rounded-2xl"
                                : isFirst
                                ? "rounded-2xl rounded-bl-md"
                                : isLast
                                ? "rounded-2xl rounded-tl-md"
                                : "rounded-r-2xl rounded-l-md"
                            } shadow-sm`}
                          >
                            <p className="text-sm wrap-break-word">{msg.text}</p>
                          </div>
                        );
                      })}

                      {/* Timestamp (only on last message of group) */}
                      {group.messages[group.messages.length - 1].createdAt && (
                        <span className="text-xs text-gray-500 mt-1 px-2">
                          {group.messages[group.messages.length - 1].createdAt
                            .toDate()
                            .toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </span>
                      )}
                    </div>

                    {/* Spacer for current user messages */}
                    {isCurrentUser && (
                      <div className="w-7 shrink-0"></div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              {/* Message Input */}
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Aa"
                  className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!message.trim()}
                className={`p-2 rounded-full transition-all ${
                  message.trim()
                    ? isEarthy
                      ? "bg-amber-700 text-white hover:bg-amber-800"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
