import UntiltNavBar from "../components/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";

export default function AIChat() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
<<<<<<< Updated upstream
    <>
      <title>Untilt - AI Chat</title>
      <UntiltNavBar />

      <div
        className={`min-h-screen px-4 pt-24 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
=======
    <div
      className={`min-h-screen pt-28 px-4 transition-colors duration-300 ${
        isEarthy
          ? "bg-[#f4efe9] text-stone-800"
          : isDark
          ? "bg-[#1e1e1e] text-gray-100"
          : "bg-[#373E4F] text-white"
      }`}
    >
      <div
        className={`max-w-3xl mx-auto rounded-3xl shadow-lg p-6 transition-colors duration-300 ${
          isEarthy
            ? "bg-[#fdfbf7]"
            : isDark
            ? "bg-[#2a2a2a]"
            : "bg-[#DFD2D5] backdrop-blur-sm"
>>>>>>> Stashed changes
        }`}
        style={{
          backgroundColor: isEarthy ? undefined : "var(--pale-lavender)",
        }}
      >
<<<<<<< Updated upstream
        <div className="max-w-4xl mx-auto">
          <h1
            className={`mb-6 text-3xl font-bold text-center ${
              isEarthy ? "text-brown-800" : "text-charcoal-grey"
=======
        <Link
          to="/dashboard"
          className={`inline-block mb-6 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors duration-300 ${
            isEarthy
              ? "bg-[#e3a765] hover:bg-[#d3934d] text-stone-800"
              : isDark
              ? "bg-[#444] hover:bg-[#555] text-gray-100"
              : "bg-[#c7b4e2] hover:bg-[#b49fd3] text-gray-900"
          }`}
        >
          ← Back to Dashboard
        </Link>



        <h1 className={`text-3xl font-bold text-center mb-1 ${
          isEarthy ? "text-brown-800" : isDark ? "text-white" : "text-gray-900"
        }`}>AI Self-Care Chat</h1>
        <p
          className={`text-center mb-6 ${
            isEarthy
              ? "text-gray-600"
              : isDark
              ? "text-gray-400"
              : "text-gray-600"
          }`}
        >
          Welcome, <span className="font-semibold">{displayName}</span>
        </p>

        {/* Chat window */}
        <div
          className={`h-[480px] overflow-y-auto rounded-2xl p-4 shadow-inner transition-colors duration-300 ${
            isEarthy
              ? "bg-[#f8f6f1]"
              : isDark
              ? "bg-[#333333]"
              : "bg-white"
          }`}
        >
          {messages.length === 0 ? (
            <p
              className={`text-center italic mt-32 ${
                isEarthy
                  ? "text-gray-400"
                  : isDark
                  ? "text-gray-500"
                  : "text-gray-400"
              }`}
            >
              Start your self-care conversation
            </p>
          ) : (
            messages.map(renderMessage)
          )}
          {loading && (
            <p
              className={`text-center italic mt-2 ${
                isEarthy
                  ? "text-gray-400"
                  : isDark
                  ? "text-gray-500"
                  : "text-gray-400"
              }`}
            >
              Thinking...
            </p>
          )}
        </div>

        {/* Input area */}
        <div className="flex mt-4 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className={`flex-1 p-3 rounded-l-2xl border text-sm focus:outline-none transition-colors duration-300 ${
              isEarthy
                ? "border-[#d4c7b8] bg-[#f9f8f6] focus:border-[#a1866f]"
                : isDark
                ? "border-gray-600 bg-[#222222] text-gray-100 focus:border-[#7b6ca8]"
                : "border-[#c7b4e2] bg-white text-gray-900 focus:border-[#c7b4e2]"
            }`}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`px-6 py-3 rounded-r-2xl font-semibold text-sm shadow-sm transition-colors duration-300 ${
              isEarthy
                ? "bg-[#e3a765] hover:bg-[#d3934d] text-white"
                : isDark
                ? "bg-[#7b6ca8] hover:bg-[#675799] text-white"
                : "bg-[#c7b4e2] hover:bg-[#b49fd3] text-gray-900"
>>>>>>> Stashed changes
            }`}
            style={{ color: isEarthy ? undefined : "var(--charcoal-grey)" }}
          >
            AI Therapy Assistant
          </h1>

          <div
            className={`p-4 mb-4 overflow-y-auto bg-white rounded-lg shadow-lg h-96 ${
              isEarthy ? "border-tan-200" : "border-cool-grey"
            } border`}
            style={{ borderColor: isEarthy ? undefined : "var(--cool-grey)" }}
          >
            <div className="space-y-4">
              {/* AI bubble */}
              <div className="flex items-start space-x-3">
                <div
                  className={`flex items-center justify-center w-8 h-8 text-sm text-white rounded-full ${
                    isEarthy ? "bg-rust-500" : "bg-slate-blue"
                  }`}
                  style={{
                    backgroundColor: isEarthy ? undefined : "var(--slate-blue)",
                  }}
                >
                  🤖
                </div>
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    isEarthy
                      ? "bg-cream-100 border-tan-200"
                      : "bg-pale-lavender border-cool-grey"
                  } border`}
                  style={{
                    backgroundColor: isEarthy
                      ? undefined
                      : "var(--pale-lavender)",
                    borderColor: isEarthy ? undefined : "var(--cool-grey)",
                  }}
                >
                  <p
                    className={`text-sm ${
                      isEarthy ? "text-brown-800" : "text-charcoal-grey"
                    }`}
                    style={{
                      color: isEarthy ? undefined : "var(--charcoal-grey)",
                    }}
                  >
                    Hello! I'm your AI therapy assistant. How can I help you
                    today?
                  </p>
                  <span
                    className={`text-xs ${
                      isEarthy ? "text-brown-600" : "text-slate-blue"
                    }`}
                    style={{
                      color: isEarthy ? undefined : "var(--slate-blue)",
                    }}
                  >
                    AI Assistant - Just now
                  </span>
                </div>
              </div>

              {/* User bubble */}
              <div className="flex items-start justify-end space-x-3">
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    isEarthy
                      ? "bg-cream-100 border-tan-200"
                      : "bg-pale-lavender border-cool-grey"
                  } border`}
                  style={{
                    backgroundColor: isEarthy
                      ? undefined
                      : "var(--pale-lavender)",
                    borderColor: isEarthy ? undefined : "var(--cool-grey)",
                  }}
                >
                  <p
                    className={`text-sm ${
                      isEarthy ? "text-brown-800" : "text-charcoal-grey"
                    }`}
                    style={{
                      color: isEarthy ? undefined : "var(--charcoal-grey)",
                    }}
                  >
                    I've been feeling anxious lately about work.
                  </p>
                  <span
                    className={`text-xs ${
                      isEarthy ? "text-brown-600" : "text-slate-blue"
                    }`}
                    style={{
                      color: isEarthy ? undefined : "var(--slate-blue)",
                    }}
                  >
                    You - Just now
                  </span>
                </div>
                <div
                  className={`flex items-center justify-center w-8 h-8 text-sm text-white rounded-full ${
                    isEarthy ? "bg-terracotta-400" : "bg-blue-grey"
                  }`}
                  style={{
                    backgroundColor: isEarthy ? undefined : "var(--blue-grey)",
                  }}
                >
                  You
                </div>
              </div>

              {/* AI bubble */}
              <div className="flex items-start space-x-3">
                <div
                  className={`flex items-center justify-center w-8 h-8 text-sm text-white rounded-full ${
                    isEarthy ? "bg-rust-500" : "bg-slate-blue"
                  }`}
                  style={{
                    backgroundColor: isEarthy ? undefined : "var(--slate-blue)",
                  }}
                >
                  🤖
                </div>
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    isEarthy
                      ? "bg-cream-100 border-tan-200"
                      : "bg-pale-lavender border-cool-grey"
                  } border`}
                  style={{
                    backgroundColor: isEarthy
                      ? undefined
                      : "var(--pale-lavender)",
                    borderColor: isEarthy ? undefined : "var(--cool-grey)",
                  }}
                >
                  <p
                    className={`text-sm ${
                      isEarthy ? "text-brown-800" : "text-charcoal-grey"
                    }`}
                    style={{
                      color: isEarthy ? undefined : "var(--charcoal-grey)",
                    }}
                  >
                    I understand work anxiety can be overwhelming. Would you
                    like to try a breathing exercise or talk about what
                    specifically is causing you stress?
                  </p>
                  <span
                    className={`text-xs ${
                      isEarthy ? "text-brown-600" : "text-slate-blue"
                    }`}
                    style={{
                      color: isEarthy ? undefined : "var(--slate-blue)",
                    }}
                  >
                    AI Assistant - Just now
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 bg-white rounded-lg shadow-lg ${
              isEarthy ? "border-tan-200" : "border-cool-grey"
            } border`}
            style={{ borderColor: isEarthy ? undefined : "var(--cool-grey)" }}
          >
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Type your message to the AI assistant..."
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEarthy
                    ? "border-tan-300 focus:ring-rust-500"
                    : "border-cool-grey focus:ring-slate-blue"
                }`}
                style={{
                  borderColor: isEarthy ? undefined : "var(--cool-grey)",
                }}
              />
              <button
                className={`px-6 py-2 text-white transition rounded-lg ${
                  isEarthy
                    ? "bg-rust-500 hover:bg-rust-600"
                    : "bg-slate-blue hover:bg-charcoal-grey"
                }`}
                style={{
                  backgroundColor: isEarthy ? undefined : "var(--slate-blue)",
                }}
                onMouseEnter={(e) =>
                  !isEarthy &&
                  (e.currentTarget.style.backgroundColor =
                    "var(--charcoal-grey)")
                }
                onMouseLeave={(e) =>
                  !isEarthy &&
                  (e.currentTarget.style.backgroundColor = "var(--slate-blue)")
                }
              >
                Send
              </button>
            </div>
            <p
              className={`mt-2 text-xs ${
                isEarthy ? "text-brown-600" : "text-slate-blue"
              }`}
              style={{ color: isEarthy ? undefined : "var(--slate-blue)" }}
            >
              Note: This AI assistant provides general support and is not a
              replacement for professional therapy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
