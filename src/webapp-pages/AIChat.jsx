/**
 * ========================================
 * AI CHAT PAGE
 * ========================================
 * 
 * Purpose:
 * AI-powered self-care assistant providing empathetic support and guidance.
 * Uses OpenRouter API with Mistral-7B-Instruct model for mental wellness conversations.
 * Includes safety features for crisis detection and scope filtering.
 * 
 * Features:
 * - Real-time AI chat with Mistral-7B-Instruct model
 * - Crisis keyword detection with emergency resources
 * - Scope filtering (only self-care topics allowed)
 * - Resource link suggestions based on keywords
 * - Message history with visual chat bubbles
 * - Theme-aware styling with smooth transitions
 * - Clickable navigation links in bot responses
 * 
 * Safety Features:
 * 1. Crisis Detection:
 *    - Scans for keywords: suicide, self-harm, etc.
 *    - Provides 988 Suicide & Crisis Lifeline
 *    - Blocks AI response, shows emergency resources
 * 
 * 2. Scope Filtering:
 *    - Blocks non-self-care topics (coding, recipes, etc.)
 *    - Only allows mental health conversations
 *    - Keywords: stress, anxiety, mindfulness, etc.
 * 
 * 3. Resource Matching:
 *    - Pre-AI keyword checking for quick responses
 *    - Suggests relevant app pages (/breathing, /journal, etc.)
 *    - Includes selfCareResources from data/resource.js
 * 
 * AI Integration:
 * - API: OpenRouter (https://openrouter.ai/api/v1/chat/completions)
 * - Model: mistralai/mistral-7b-instruct
 * - System Prompt: "Kind and empathetic self-care assistant"
 * - Response: 2-4 sentences, concise and warm
 * - No conversation history (stateless, current message only)
 * 
 * Message Flow:
 * 1. User types message → input state
 * 2. Check crisis keywords → emergency response if match
 * 3. Check scope filter → rejection if off-topic
 * 4. Check resource keywords → direct link if match
 * 5. Send to OpenRouter API → AI response
 * 6. Clean AI text (remove model artifacts)
 * 7. Display in chat with clickable links
 * 
 * State Management:
 * - messages: Array of { sender: "user"|"bot", text: string }
 * - input: Current user input text
 * - loading: API request in progress
 * 
 * Text Processing:
 * - cleanAIText: Removes [INST], <s>, [OUT] tags
 * - escapeRegex: Safely escapes special regex characters
 * - Link detection: Parses /path patterns for navigation
 * 
 * Navigation Links:
 * - Valid paths: /selfcare, /breathing, /goals, /journal, etc.
 * - Rendered as clickable <Link> components
 * - Custom styling per theme
 * 
 * Theme Support:
 * - Earthy: Cream/tan backgrounds, brown text, orange accents
 * - Dark: Charcoal backgrounds, gray text, purple accents
 * - Cool: Lavender backgrounds, gray text, purple accents
 */

import { useState} from "react";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { selfCareResources } from "../data/resource";
import UntiltNavBar from "../components/navigation/UntiltNavBar";

export default function AIChat() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const isDark = currentTheme === "dark";
  const { user, profile } = UserAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanAIText = (text = "") =>
    text
      .replace(/<s>\s*\[OUT\]\s*/gi, "")
      .replace(/\[\/OUT\]\s*<\/s>/gi, "")
      .replace(/<\/?s>/gi, "")
      .replace(/\[INST\]|\[\/INST\]/gi, "")
      .trim();


const escapeRegex = (text = "") =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isSelfCareMessage = (text = "") => {
  const lower = text.toLowerCase().trim();

  const disallow = [
    "sandwich", "recipe", "cook", "cooking", "homework", "assignment",
    "algorithm", "code", "coding", "programming", "java", "javascript",
    "python", "firebase", "deploy", "website bug", "git", "github", "merge"
  ];

  for (const word of disallow) {
    const re = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
    if (re.test(lower)) return false;
  }

  const allow = [
    "self care", "self-care", "mental health", "stress", "anxiety",
    "overthinking", "mindfulness", "sleep", "burnout", "motivation",
    "sad", "lonely", "angry", "depressed", "panic", "breathing",
    "journaling", "journal", "goal", "relax", "calm", "relationship",
    "boyfriend", "girlfriend", "friendship", "boundaries", "confident",
    "confidence", "support", "cope", "coping", "grief", "healing",
    "therapy", "therapist", "mood", "hungry", "upset", "friends", "friend",
  ];

  for (const word of allow) {
    const re = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
    if (re.test(lower)) return true;
  }
};

const seemsCrisis = (text = "") => {
  const lower = text.toLowerCase();
  return /\b(suicide|kill myself|harm myself|self-harm|end it|can't go on)\b/i.test(lower);
};

const findResourceReply = (text = "") => {
  const lower = text.toLowerCase();

  const routes = [
    { path: "/breathing", kws: ["breathing", "panic", "anxiety attack"] },
    { path: "/journal", kws: ["journal", "journaling", "reflect"] },
    { path: "/goals", kws: ["goal", "goals", "motivation", "habit"] },
    { path: "/guide-videos", kws: ["video", "guided", "meditation", "grounding"] },
    { path: "/community", kws: ["community", "peer support", "talk to others"] },
    { path: "/selfcare", kws: ["self care", "self-care", "tips", "advice"] }
  ];

  for (const route of routes) {
    for (const kw of route.kws) {
      const re = new RegExp(`\\b${escapeRegex(kw)}\\b`, "i");
      if (re.test(lower)) {
        return `You might find this helpful: ${route.path}`;
      }
    }
  }
  
  for (const item of selfCareResources || []) {
    if (!item?.keywords) continue;
    for (const kw of item.keywords) {
      const re = new RegExp(`\\b${escapeRegex(kw)}\\b`, "i");
      if (re.test(lower)) return item.response;
    }
  }

  return null;
};

  // Send user message and handle AI reply
  const sendMessage = async () => {
    if (!input.trim() || loading) 
      return;

    const newUserMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);


    if (seemsCrisis(input)) {
      setMessages((prev) => [
        ...prev,
        {
          send: "bot",
          text: 
            "I am really sorry you are feeling this way. If you may be in danger or considerinf harming yourself, please contact your local emergency number. You can call or text 988 for the Suicide & Crisis Lifeline. You are not alone, and help is available.",
        },
      ]);
      setLoading(false);
      return;
    }

    if (!isSelfCareMessage(input)){
      setMessages((prev) =>[
        ...prev,
        {
          send: "bot",
          text: 
            "I can help with self-care, supportive reflection, and website navigation."
        },
      ]);
      setLoading(false);
      return;
    }

    // Resource link detection
    const resourceReply = findResourceReply(input);
    if (resourceReply) {
      setMessages((prev) => [...prev, { sender: "bot", text: resourceReply }]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: "You are a kind and empathetic self-care assistant for the Untitled Community. Respond in a calm, supportive tone. Give helpful, real-world self-care advice (mindfulness, reflection, breaks, positvity).Keep responses concise (2-4 sentences) and warm."
            },
            { role: "user", content: input },
          ],
        }),
      });

      const data = await response.json();
      let reply = cleanAIText(data?.choices?.[0]?.message?.content || "");

      if (reply && reply.trim() !== "") {
        setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              "I'm here for you. Sometimes it helps to pause, breathe deeply, and take one small comforting step.",
          },
        ]);
      }
    } catch (error) {
      console.error("OpenAI error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "I'm having a little trouble thinking right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Valid link paths
  const validPaths = [
    "/selfcare",
    "/breathing",
    "/goals",
    "/journal",
    "/guide-videos",
    "/community",
    "/profile",
  ];

  // Render chat message
  const renderMessage = (m, i) => (
    <div
      key={i}
      className={`my-2 flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm leading-relaxed ${
          m.sender === "user"
            ? isEarthy
              ? "bg-[#ffe9d6] text-stone-800"
              : isDark
              ? "bg-[#3a3a3a] text-gray-100"
              : "bg-[#e5d8f2] text-gray-900"
            : isEarthy
            ? "bg-[#f8f5f0] text-stone-700"
            : isDark
            ? "bg-[#2b2b2b] text-gray-200"
            : "bg-[#f8f5fb] text-gray-800"
        }`}
      >
        {m.sender === "bot" ? (
          <p>
            {m.text
              .split(
                /(\/selfcare|\/breathing|\/goals|\/journal|\/guide-videos|\/community|\/profile)/g
              )
              .map((part, j) =>
                validPaths.includes(part) ? (
                  <Link
                    key={j}
                    to={part}
                    className={`underline font-medium ${
                      isEarthy
                        ? "text-[#7b5e4a] hover:text-[#604735]"
                        : isDark
                        ? "text-[#b9a7f4] hover:text-[#d5c9ff]"
                        : "text-[#7b6ca8] hover:text-[#5c4b8a]"
                    }`}
                  >
                    {part}
                  </Link>
                ) : (
                  part
                )
              )}
          </p>
        ) : (
          <p>{m.text}</p>
        )}
      </div>
    </div>
  );

  const displayName = profile?.firstName || user?.displayName || "Friend";

  return (
    <div className={`${isEarthy ? "bg-cream-100" : "bg-[#646F89]"} min-h-screen`}>
      <UntiltNavBar />

      <div
        className={`pt-24 px-4 pb-8 transition-colors duration-300 ${
          isEarthy ? "bg-[#f4efe9] text-stone-800" : isDark ? "bg-[#1e1e1e] text-gray-100" : "bg-[#f5f3f7] text-gray-900"
        }`}
      >
        <div
          className={`max-w-3xl mx-auto rounded-3xl shadow-lg p-6 transition-colors duration-300 ${
            isEarthy ? "bg-[#fdfbf7]" : isDark ? "bg-[#2a2a2a]" : "bg-white/90 backdrop-blur-sm"
          }`}
        >
          <h1 className="text-3xl font-bold text-center mb-1">Self-Care AI Chat</h1>
          <p className="text-center text-gray-600 mb-6">
            Welcome, <span className="font-semibold">{displayName}</span>
          </p>

          {/* Chat window */}
          <div
            className={`h-[60vh] overflow-y-auto rounded-2xl p-4 shadow-inner transition-colors duration-300 ${
              isEarthy ? "bg-[#f8f6f1]" : isDark ? "bg-[#333333]" : "bg-[#faf9fb]"
            }`}
          >
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 italic mt-32">Start your self-care conversation</p>
            ) : (
              messages.map(renderMessage)
            )}
            {loading && <p className="text-center text-gray-400 italic mt-2">Thinking...</p>}
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
                isEarthy ? "bg-[#e3a765] hover:bg-[#d3934d] text-white" : isDark ? "bg-[#7b6ca8] hover:bg-[#675799] text-white" : "bg-[#9b8fc0] hover:bg-[#8576b8] text-white"
              }`}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
