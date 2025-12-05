import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect } from "react";
import NavBar from "../components/navigation/NavBar";

export default function TherapyGuide() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "What is Therapy?",
      content: "Therapy, also known as psychotherapy or counseling, is a collaborative process between you and a trained mental health professional. It provides a safe, confidential space to explore your thoughts, feelings, and behaviors, helping you develop coping strategies and work towards personal growth.",
      icon: "💡"
    },
    {
      title: "Types of Therapy",
      content: "There are many therapeutic approaches including Cognitive Behavioral Therapy (CBT), which focuses on thought patterns; Psychodynamic Therapy, exploring past experiences; and Humanistic Therapy, emphasizing personal growth. Your therapist will help determine the best approach for your needs.",
      icon: "🎯"
    },
    {
      title: "Finding the Right Therapist",
      content: "Look for licensed professionals with experience in your specific concerns. Consider factors like therapeutic approach, availability, location, and whether you feel comfortable with them. It's okay to try a few therapists before finding the right fit—your comfort is essential.",
      icon: "🔎"
    },
    {
      title: "What to Expect in Your First Session",
      content: "Your first session is typically an assessment where your therapist will ask about your history, current concerns, and goals. They'll explain their approach and answer your questions. It's normal to feel nervous—your therapist understands and will help you feel comfortable.",
      icon: "📝"
    },
    {
      title: "How Often Should You Attend?",
      content: "Most people start with weekly sessions, though frequency can vary based on your needs and goals. As you progress, you might reduce to bi-weekly or monthly sessions. Your therapist will work with you to determine the best schedule for your situation.",
      icon: "⏰"
    },
    {
      title: "Making the Most of Therapy",
      content: "Be open and honest with your therapist, even when it's difficult. Complete any homework assignments, practice techniques between sessions, and give yourself time—meaningful change takes patience. Remember, progress isn't always linear, and that's okay.",
      icon: "🌟"
    }
  ];

  const faqs = [
    {
      question: "How long does therapy take?",
      answer: "The duration varies greatly depending on individual needs and goals. Some people benefit from short-term therapy (6-12 sessions), while others engage in longer-term work. Your therapist will discuss expectations and regularly review progress with you."
    },
    {
      question: "Is therapy confidential?",
      answer: "Yes, with few exceptions. Therapists are bound by confidentiality laws and ethics. They can only break confidentiality if there's an immediate risk of harm to yourself or others, or if required by law (such as suspected child abuse)."
    },
    {
      question: "How much does therapy cost?",
      answer: "Costs vary widely based on location, therapist credentials, and whether you use insurance. Many therapists offer sliding scale fees based on income. Check if your insurance covers mental health services, and don't hesitate to discuss costs upfront."
    }
  ];

  return (
    <>
      <title>Getting Started with Therapy - Tilted | Mental Wellness</title>
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
              isEarthy ? "bg-terracotta-200 text-brown-800" : "bg-blue-grey/20 text-blue-grey"
            } text-sm font-semibold tracking-wider`}>
              GUIDE
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isEarthy ? "text-brown-800" : "text-white"
            }`}>
              Getting Started with Therapy
            </h1>
            <p className={`text-xl ${
              isEarthy ? "text-brown-700" : "text-gray-300"
            }`}>
              Your complete guide to beginning therapy and what to expect
            </p>
          </div>

          {/* Introduction */}
          <div className={`rounded-2xl shadow-lg p-8 mb-8 ${
            isEarthy 
              ? "bg-cream-200 text-brown-800 border-2 border-tan-300" 
              : "bg-pale-lavender text-gray-900 border-2 border-blue-grey"
          }`}>
            <p className="text-lg leading-relaxed mb-4">
              Taking the first step toward therapy is a courageous decision that shows strength and self-awareness. 
              Whether you're dealing with anxiety, depression, relationship issues, or simply want to grow as a person, 
              therapy can be an invaluable tool for healing and personal development.
            </p>
            <p className="text-lg leading-relaxed">
              This guide will walk you through everything you need to know about starting therapy, from understanding 
              what therapy is to making the most of your sessions.
            </p>
          </div>

          {/* Main Sections */}
          <div className="space-y-6 mb-12">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl ${
                  isEarthy
                    ? "bg-white border-2 border-tan-200 hover:border-terracotta-400"
                    : "bg-pale-lavender border-2 border-blue-grey hover:border-light-lavender"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-5xl flex-shrink-0 ${
                    isEarthy ? "opacity-80" : "opacity-90"
                  }`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-3 ${
                      isEarthy ? "text-brown-800" : "text-gray-900"
                    }`}>
                      {section.title}
                    </h3>
                    <p className={`text-base leading-relaxed ${
                      isEarthy ? "text-brown-700" : "text-slate-blue"
                    }`}>
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className={`rounded-2xl shadow-lg p-8 mb-8 ${
            isEarthy
              ? "bg-cream-200 text-brown-800 border-2 border-tan-300"
              : "bg-pale-lavender text-gray-900 border-2 border-blue-grey"
          }`}>
            <h2 className={`text-3xl font-bold mb-6 ${
              isEarthy ? "text-brown-800" : "text-gray-900"
            }`}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h4 className={`text-xl font-semibold mb-2 ${
                    isEarthy ? "text-brown-800" : "text-gray-900"
                  }`}>
                    {faq.question}
                  </h4>
                  <p className={`text-base leading-relaxed ${
                    isEarthy ? "text-brown-700" : "text-slate-blue"
                  }`}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
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
              Connect with Support Today
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
