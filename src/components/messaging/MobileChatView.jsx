import React, { useState, useEffect, useRef } from "react";
import { useMessenger } from "../../contexts/MessengerContext";
import { useTheme } from "../../contexts/ThemeContext";
import { UserAuth } from "../../contexts/AuthContext";

const MobileChatView = ({ userId, userName, userAvatar, onClose }) => {
  const { conversations, sendMessage } = useMessenger();
  const { currentTheme } = useTheme();
  const { user } = UserAuth();
  const isEarthy = currentTheme === "earthy";
  const [message, setMessage] = useState("");
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessage(userId, message);
      setMessage("");
    }
  };

  // Don't show if user is not logged in
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-100 flex flex-col">
      {/* Header */}
      <div className={`text-white p-4 flex items-center gap-3 shadow-lg ${
        isEarthy ? "bg-amber-700" : "bg-light-lavender"
      }`}>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <img
              src={
                userAvatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userName || "User"
                )}&background=random`
              }
              alt={userName}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{userName}</h3>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
        {groupedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <p>Start a conversation!</p>
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
                {/* Avatar (only for others) */}
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
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}

                {/* Message Group */}
                <div
                  className={`flex flex-col ${
                    isCurrentUser ? "items-end" : "items-start"
                  } max-w-[80%] md:max-w-[70%]`}
                >
                  {/* Messages */}
                  {group.messages.map((msg, msgIndex) => {
                    const isFirst = msgIndex === 0;
                    const isLast = msgIndex === group.messages.length - 1;

                    return (
                      <div
                        key={msg.id}
                        className={`px-4 py-2 ${
                          msgIndex > 0 ? "mt-1" : ""
                        } wrap-break-word ${
                          isCurrentUser
                            ? isEarthy
                              ? "bg-amber-700 text-white"
                              : "bg-linear-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    );
                  })}

                  {/* Timestamp (only on last message of group) */}
                  {group.messages[group.messages.length - 1].createdAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                      {group.messages[group.messages.length - 1].createdAt
                        .toDate()
                        .toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  )}
                </div>

                {/* Spacer for current user messages (replaces avatar space) */}
                {isCurrentUser && <div className="w-8 shrink-0"></div>}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Message Input */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Aa"
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all ${
              message.trim()
                ? isEarthy
                  ? "bg-amber-700 text-white hover:bg-amber-800"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
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
        </form>
      </div>
    </div>
  );
};

export default MobileChatView;
