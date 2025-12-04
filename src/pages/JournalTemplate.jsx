import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import NavBar from "../components/navigation/NavBar";
import { useState, useEffect } from "react";

export default function JournalTemplate() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { user } = UserAuth();
  const isEarthy = currentTheme === "earthy";
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const templateSections = [
    {
      title: "Daily Mindfulness Journal Template",
      prompts: [
        "Date & Time:",
        "How am I feeling right now? (Rate 1-10 and describe)",
        "What am I grateful for today? (List 3 things)",
        "What thoughts are occupying my mind?",
        "What emotions am I experiencing?",
        "What physical sensations do I notice in my body?"
      ]
    },
    {
      title: "Evening Reflection",
      prompts: [
        "What went well today?",
        "What challenged me today?",
        "What did I learn about myself?",
        "How did I take care of myself today?",
        "What would I like to do differently tomorrow?"
      ]
    },
    {
      title: "Weekly Check-In",
      prompts: [
        "Overall mood this week (Rate 1-10):",
        "Biggest accomplishment:",
        "Biggest challenge:",
        "Self-care activities completed:",
        "Goals for next week:",
        "Affirmation for the week ahead:"
      ]
    }
  ];

  const benefits = [
    {
      title: "Emotional Awareness",
      description: "Regular journaling helps you identify and understand your emotions, leading to better emotional regulation.",
      icon: "🎭"
    },
    {
      title: "Stress Reduction",
      description: "Writing down your thoughts and feelings can help reduce stress and anxiety by providing an outlet for processing emotions.",
      icon: "✨"
    },
    {
      title: "Pattern Recognition",
      description: "Over time, you'll notice patterns in your thoughts, behaviors, and triggers, empowering you to make positive changes.",
      icon: "📈"
    },
    {
      title: "Personal Growth",
      description: "Journaling promotes self-reflection and insight, supporting your journey toward personal development and mental wellness.",
      icon: "🌿"
    }
  ];

  const tips = [
    "Set aside 10-15 minutes daily for journaling",
    "Find a quiet, comfortable space free from distractions",
    "Write freely without worrying about grammar or structure",
    "Be honest and authentic with yourself",
    "Don't judge your thoughts or feelings—just observe them",
    "Review your entries weekly to track patterns and progress"
  ];

  return (
    <>
      <title>Mindfulness Journal Template - Tilted | Mental Wellness</title>
      <NavBar />
      
      <div className={`min-h-screen pt-24 pb-12 ${isEarthy ? "bg-cream-100" : "bg-charcoal-grey"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm transition ${
              isEarthy
                ? "bg-tan-300 hover:bg-tan-400 text-brown-900"
                : "bg-cool-grey hover:bg-slate-blue text-white"
            }`}
          >
            ← Back to Home
          </button>

          {/* Header */}
          <div className="mb-12">
            <div className={`inline-block px-4 py-2 mb-4 rounded-full ${
              isEarthy ? "bg-tan-200 text-brown-800" : "bg-cool-grey/20 text-cool-grey"
            } text-sm font-semibold tracking-wider`}>
              TEMPLATE
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isEarthy ? "text-brown-800" : "text-white"
            }`}>
              Mindfulness Journal Template
            </h1>
            <p className={`text-xl ${
              isEarthy ? "text-brown-700" : "text-gray-300"
            }`}>
              Track your thoughts and emotions with our free journal template
            </p>
          </div>

          {/* Introduction */}
          <div className={`rounded-2xl shadow-lg p-8 mb-8 ${
            isEarthy 
              ? "bg-cream-200 text-brown-800 border-2 border-tan-300" 
              : "bg-pale-lavender text-gray-900 border-2 border-blue-grey"
          }`}>
            <p className="text-lg leading-relaxed mb-4">
              Mindfulness journaling is a powerful practice that combines the benefits of mindfulness meditation with 
              reflective writing. This template provides structured prompts to help you explore your thoughts, emotions, 
              and experiences in a meaningful way.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you're new to journaling or an experienced practitioner, this template will guide you through 
              daily reflections, helping you build greater self-awareness and emotional well-being.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className={`text-3xl font-bold mb-6 ${
              isEarthy ? "text-brown-800" : "text-white"
            }`}>
              Benefits of Journaling
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${
                    isEarthy
                      ? "bg-white border-2 border-tan-200 hover:border-tan-400"
                      : "bg-pale-lavender border-2 border-blue-grey hover:border-light-lavender"
                  }`}
                >
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    isEarthy ? "text-brown-800" : "text-gray-900"
                  }`}>
                    {benefit.title}
                  </h3>
                  <p className={`text-base leading-relaxed ${
                    isEarthy ? "text-brown-700" : "text-slate-blue"
                  }`}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-3xl font-bold ${
                isEarthy ? "text-brown-800" : "text-white"
              }`}>
                Journal Template
              </h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isEarthy
                    ? "bg-rust-500 hover:bg-rust-600 text-white"
                    : "bg-slate-blue hover:bg-charcoal-grey text-white"
                }`}
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            </div>

            {showPreview && (
              <div className="space-y-6">
                {templateSections.map((section, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl shadow-lg p-6 ${
                      isEarthy
                        ? "bg-white border-2 border-tan-200"
                        : "bg-pale-lavender border-2 border-blue-grey"
                    }`}
                  >
                    <h3 className={`text-2xl font-bold mb-4 ${
                      isEarthy ? "text-brown-800" : "text-gray-900"
                    }`}>
                      {section.title}
                    </h3>
                    <div className="space-y-4">
                      {section.prompts.map((prompt, pIndex) => (
                        <div key={pIndex}>
                          <p className={`font-semibold mb-2 ${
                            isEarthy ? "text-brown-700" : "text-slate-blue"
                          }`}>
                            {prompt}
                          </p>
                          <div className={`border-b-2 pb-4 ${
                            isEarthy ? "border-tan-200" : "border-cool-grey"
                          }`}>
                            <span className={`text-sm italic ${
                              isEarthy ? "text-brown-600" : "text-gray-600"
                            }`}>
                              [Your response here...]
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className={`rounded-2xl shadow-lg p-8 mb-8 ${
            isEarthy
              ? "bg-cream-200 text-brown-800 border-2 border-tan-300"
              : "bg-pale-lavender text-gray-900 border-2 border-blue-grey"
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              isEarthy ? "text-brown-800" : "text-gray-900"
            }`}>
              Tips for Effective Journaling
            </h2>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`text-xl flex-shrink-0 ${
                    isEarthy ? "text-rust-500" : "text-slate-blue"
                  }`}>
                    ✓
                  </span>
                  <span className={`text-base ${
                    isEarthy ? "text-brown-700" : "text-slate-blue"
                  }`}>
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className={`text-lg mb-6 ${
              isEarthy ? "text-brown-700" : "text-gray-300"
            }`}>
              {user 
                ? "Access our interactive digital journal in your dashboard" 
                : "Sign up to access our interactive digital journal tool"}
            </p>
            <button
              onClick={() => navigate(user ? "/journal" : "/signup")}
              className={`px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all hover:shadow-xl ${
                isEarthy
                  ? "bg-rust-500 hover:bg-rust-600 text-white"
                  : "bg-slate-blue hover:bg-charcoal-grey text-white"
              }`}
            >
              {user ? "Start Journaling" : "Get Started Free"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
