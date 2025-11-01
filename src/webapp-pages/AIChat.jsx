import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { selfCareResources } from "../data/resource";
import UntiltNavBar from "../components/UntiltNavBar";

export default function AIChat() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const isDark = false; // or get from theme context if needed

  const sendMessage = () => {
    if (!input.trim()) return;
    // Add your message sending logic here
    setInput("");
  };

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
                : "border-gray-300 bg-white focus:border-[#9b8fc0]"
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
                : "bg-[#9b8fc0] hover:bg-[#8576b8] text-white"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
        </div>
      </div>
    </>
  );
}
