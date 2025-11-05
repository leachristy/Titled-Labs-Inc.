import { useTheme } from "../../contexts/ThemeContext";

export default function AIChatMockup({ messages }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const getAvatarColor = (isUser) => {
    if (isUser) {
      return isEarthy ? "bg-rust-500" : "bg-slate-blue";
    }
    return isEarthy ? "bg-terracotta-400" : "bg-blue-grey";
  };

  const getBubbleColor = (isUser) => {
    if (isUser) {
      return isEarthy
        ? "border-rust-400 bg-white"
        : "rounded-2xl px-4 py-3 border-2 border-slate-blue bg-white";
    }
    return isEarthy
      ? "border-terracotta-400 bg-cream-50"
      : "rounded-2xl px-4 py-3 border-2 border-blue-grey bg-pale-lavender";
  };

  return (
    <div className={isEarthy ? "visual-frame" : "visual-frame-new"}>
      <div
        className={`${
          isEarthy ? "visual-card" : "visual-card-new"
        } space-y-4`}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={isEarthy ? "mock-chat-message" : "flex items-start gap-3"}
          >
            <div
              className={`mock-chat-avatar ${
                isEarthy
                  ? getAvatarColor(msg.isUser)
                  : `w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${getAvatarColor(msg.isUser)}`
              }`}
            >
              {msg.avatar}
            </div>
            <div className={`mock-chat-bubble ${getBubbleColor(msg.isUser)}`}>
              <p className={isEarthy ? "" : "text-charcoal-grey"}>
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
