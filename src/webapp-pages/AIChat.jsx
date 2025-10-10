import UntiltNavBar from "../components/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";

export default function AIChat() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <>
      <title>Untilt - AI Chat</title>
      <UntiltNavBar />

      <div
        className={`min-h-screen px-4 pt-24 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
        style={{
          backgroundColor: isEarthy ? undefined : "var(--pale-lavender)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className={`mb-6 text-3xl font-bold text-center ${
              isEarthy ? "text-brown-800" : "text-charcoal-grey"
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
