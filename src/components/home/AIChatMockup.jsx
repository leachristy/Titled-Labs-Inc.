import { useTheme } from "../../contexts/ThemeContext";

export default function AIChatMockup({ data }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <div className={`rounded-xl shadow-2xl overflow-hidden ${
      isEarthy ? "bg-white border border-tan-200" : "bg-slate-blue border border-blue-grey"
    }`}>
      {/* Chat Header */}
      <div className={`px-6 py-4 border-b ${
        isEarthy ? "bg-cream-50 border-tan-200" : "bg-charcoal-grey border-blue-grey"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            isEarthy ? "bg-rust-500 text-white" : "bg-light-lavender text-charcoal-grey"
          }`}>
            AI
          </div>
          <div>
            <h3 className={`font-semibold ${isEarthy ? "text-brown-800" : "text-white"}`}>
              AI Wellness Support
            </h3>
            <p className={`text-xs ${isEarthy ? "text-brown-600" : "text-gray-300"}`}>
              Always here to help
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`p-6 space-y-4 ${
        isEarthy ? "bg-white" : "bg-charcoal-grey"
      }`} style={{ minHeight: "300px" }}>
        {data.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] ${message.isUser ? "order-2" : "order-1"}`}>
              {!message.isUser && (
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isEarthy ? "bg-rust-500 text-white" : "bg-light-lavender text-charcoal-grey"
                  }`}>
                    AI
                  </div>
                  <span className={`text-xs font-medium ${
                    isEarthy ? "text-brown-700" : "text-gray-300"
                  }`}>
                    AI Support
                  </span>
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 ${
                message.isUser
                  ? isEarthy
                    ? "bg-rust-500 text-white"
                    : "bg-light-lavender text-charcoal-grey"
                  : isEarthy
                  ? "bg-cream-100 text-brown-800"
                  : "bg-slate-blue text-white"
              }`}>
                <p className="text-sm leading-relaxed">{message.message}</p>
              </div>
              {message.isUser && (
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className={`text-xs font-medium ${
                    isEarthy ? "text-brown-700" : "text-gray-300"
                  }`}>
                    You
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isEarthy ? "bg-brown-800 text-white" : "bg-cool-grey text-white"
                  }`}>
                    ME
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className={`px-6 py-4 border-t ${
        isEarthy ? "bg-cream-50 border-tan-200" : "bg-charcoal-grey border-blue-grey"
      }`}>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            disabled
            className={`flex-1 px-4 py-2 rounded-full border outline-none ${
              isEarthy
                ? "bg-white border-tan-300 text-brown-800 placeholder-brown-400"
                : "bg-slate-blue border-blue-grey text-white placeholder-gray-400"
            }`}
          />
          <button
            disabled
            className={`p-2 rounded-full transition ${
              isEarthy
                ? "bg-rust-500 text-white hover:bg-rust-600"
                : "bg-light-lavender text-charcoal-grey hover:bg-medium-lavender"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
