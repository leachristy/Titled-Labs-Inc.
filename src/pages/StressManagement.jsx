import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect } from "react";
import NavBar from "../components/navigation/NavBar";

export default function StressManagement() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const strategies = [
    {
      title: "Practice Deep Breathing",
      description: "Take 5 minutes to focus on your breath. Inhale deeply through your nose for 4 counts, hold for 4, and exhale slowly through your mouth for 6 counts.",
      icon: "💨"
    },
    {
      title: "Regular Physical Activity",
      description: "Engage in at least 30 minutes of moderate exercise daily. Walking, yoga, or dancing can significantly reduce stress hormones and boost endorphins.",
      icon: "🚴"
    },
    {
      title: "Maintain a Consistent Sleep Schedule",
      description: "Aim for 7-9 hours of quality sleep each night. Create a relaxing bedtime routine and keep your bedroom cool, dark, and quiet.",
      icon: "🌙"
    },
    {
      title: "Connect with Others",
      description: "Spend quality time with friends and family. Social support is crucial for managing stress and maintaining mental wellness.",
      icon: "💬"
    },
    {
      title: "Practice Mindfulness & Meditation",
      description: "Dedicate 10-15 minutes daily to mindfulness meditation. Apps like our guided sessions can help you build this beneficial habit.",
      icon: "🪷"
    }
  ];

  return (
    <>
      <title>5 Ways to Manage Daily Stress - Tilted | Mental Wellness</title>
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
              isEarthy ? "bg-rust-100 text-rust-700" : "bg-slate-blue/20 text-light-lavender"
            } text-sm font-semibold tracking-wider`}>
              ARTICLE
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isEarthy ? "text-brown-800" : "text-white"
            }`}>
              5 Ways to Manage Daily Stress
            </h1>
            <p className={`text-xl ${
              isEarthy ? "text-brown-700" : "text-gray-300"
            }`}>
              Discover practical techniques to reduce stress and improve your daily well-being
            </p>
          </div>

          {/* Introduction */}
          <div className={`rounded-2xl shadow-lg p-8 mb-8 ${
            isEarthy 
              ? "bg-cream-200 text-brown-800 border-2 border-tan-300" 
              : "bg-pale-lavender text-gray-900 border-2 border-blue-grey"
          }`}>
            <p className="text-lg leading-relaxed mb-4">
              In today's fast-paced world, stress has become an unavoidable part of daily life. However, how we manage 
              that stress can make all the difference in our mental and physical well-being. This guide presents five 
              evidence-based strategies that can help you navigate daily stressors more effectively.
            </p>
            <p className="text-lg leading-relaxed">
              By incorporating these techniques into your routine, you can build resilience, improve your mood, and 
              enhance your overall quality of life.
            </p>
          </div>

          {/* Strategies */}
          <div className="space-y-6">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className={`rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl ${
                  isEarthy
                    ? "bg-white border-2 border-tan-200 hover:border-rust-400"
                    : "bg-pale-lavender border-2 border-blue-grey hover:border-light-lavender"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-5xl flex-shrink-0 ${
                    isEarthy ? "opacity-80" : "opacity-90"
                  }`}>
                    {strategy.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-3 ${
                      isEarthy ? "text-brown-800" : "text-gray-900"
                    }`}>
                      {index + 1}. {strategy.title}
                    </h3>
                    <p className={`text-base leading-relaxed ${
                      isEarthy ? "text-brown-700" : "text-slate-blue"
                    }`}>
                      {strategy.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className={`rounded-2xl shadow-lg p-8 mt-8 ${
            isEarthy
              ? "bg-rust-50 border-2 border-rust-200"
              : "bg-light-lavender/30 border-2 border-medium-lavender"
          }`}>
            <h3 className={`text-2xl font-bold mb-4 ${
              isEarthy ? "text-brown-800" : "text-gray-900"
            }`}>
              Take Action Today
            </h3>
            <p className={`text-lg leading-relaxed mb-4 ${
              isEarthy ? "text-brown-700" : "text-slate-blue"
            }`}>
              Remember, managing stress is a journey, not a destination. Start with one technique that resonates 
              with you and gradually incorporate others. Be patient with yourself and celebrate small victories.
            </p>
            <p className={`text-lg leading-relaxed ${
              isEarthy ? "text-brown-700" : "text-slate-blue"
            }`}>
              If you're struggling with chronic stress or anxiety, consider reaching out to a mental health 
              professional. Our platform offers various tools and resources to support your mental wellness journey.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/signup")}
              className={`px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all hover:shadow-xl ${
                isEarthy
                  ? "bg-rust-500 hover:bg-rust-600 text-white"
                  : "bg-slate-blue hover:bg-charcoal-grey text-white"
              }`}
            >
              Start Your Wellness Journey
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
