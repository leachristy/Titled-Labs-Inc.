import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import HeroSection from "../components/home/HeroSection";
import HeroSection2 from "../components/home/HeroSection2";
import StatsBar from "../components/home/StatsBar";
import StatsBar2 from "../components/home/StatsBar2";
import FeaturesGrid from "../components/home/FeaturesGrid";
import FeaturesGrid2 from "../components/home/FeaturesGrid2";
import DetailedFeatureThemed from "../components/home/DetailedFeatureThemed";
import TestimonialThemed from "../components/home/TestimonialThemed";
import CTASectionThemed from "../components/home/CTASectionThemed";

export default function UnifiedHome() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isEarthy = currentTheme === 'earthy';

  return (
    <>
      <title>Home - Tilted | Mental Wellness App</title>

      {/* Hero Section */}
      {isEarthy ? (
        <HeroSection onNavigate={handleNavigation} />
      ) : (
        <HeroSection2 onNavigate={handleNavigation} />
      )}

      {/* Stats Bar */}
      {isEarthy ? (
        <StatsBar />
      ) : (
        <StatsBar2 />
      )}

      {/* Main Features Grid */}
      {isEarthy ? (
        <FeaturesGrid />
      ) : (
        <FeaturesGrid2 />
      )}

      {/* Detailed Feature 1 - Therapy & Community */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DetailedFeatureThemed
            badge="PROFESSIONAL SUPPORT"
            title="Connect with licensed therapists and supportive communities"
            description="Join specialized groups, attend sessions, and access evidence-based therapy tools—all in one secure platform."
            linkText="Learn more about our team"
            onNavigate={() => handleNavigation("/about")}
          >
            {/* Therapy Portal Mockup */}
            <div className={isEarthy ? "visual-frame" : "visual-frame-new"}>
              <div className={isEarthy ? "visual-card" : "visual-card-new"}>
                <div className={`mock-portal-header ${isEarthy ? "" : "flex items-center gap-4 pb-4 border-b border-cool-grey"}`}>
                  <div className={`mock-portal-avatar ${isEarthy ? "bg-rust-500" : "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl bg-slate-blue"}`}>
                    <span>DR</span>
                  </div>
                  <div>
                    <div className={`mock-portal-title ${isEarthy ? "" : "font-semibold text-charcoal-grey"}`}>Dr. Sarah Mitchell</div>
                    <div className={`mock-portal-subtitle ${isEarthy ? "" : "text-sm text-slate-blue"}`}>
                      Licensed Therapist • CBT Specialist
                    </div>
                  </div>
                </div>
                <div className={`mock-portal-items ${isEarthy ? "" : "space-y-3 pt-4"}`}>
                  <div className={`mock-portal-item ${isEarthy ? "" : "flex justify-between items-center py-2 border-b border-cool-grey"}`}>
                    <span className={`text-sm ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>Next Session</span>
                    <span className={`font-semibold ${isEarthy ? "text-rust-500" : "text-slate-blue"}`}>
                      Tomorrow, 3:00 PM
                    </span>
                  </div>
                  <div className={`mock-portal-item ${isEarthy ? "" : "flex justify-between items-center py-2 border-b border-cool-grey"}`}>
                    <span className={`text-sm ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                      Total Sessions
                    </span>
                    <span className={`font-semibold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                      12 completed
                    </span>
                  </div>
                  <div className={`mock-portal-item ${isEarthy ? "" : "flex justify-between items-center py-2 border-b border-cool-grey"}`}>
                    <span className={`text-sm ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                      Progress Notes
                    </span>
                    <span className={`font-semibold ${isEarthy ? "text-terracotta-400" : "text-blue-grey"}`}>
                      8 entries
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DetailedFeatureThemed>

          {/* Detailed Feature 2 - Contact & Support */}
          <DetailedFeatureThemed
            badge="WELLNESS SUPPORT"
            title="Get personalized support for your mental wellness journey"
            description="Available support to provide coping strategies, mindfulness exercises, and emotional support for your journey."
            linkText="Contact us today"
            onNavigate={() => handleNavigation("/contact")}
            reverse
          >
            {/* AI Chat Mockup */}
            <div className={isEarthy ? "visual-frame" : "visual-frame-new"}>
              <div className={`${isEarthy ? "visual-card" : "visual-card-new"} space-y-4`}>
                <div className={isEarthy ? "mock-chat-message" : "flex items-start gap-3"}>
                  <div className={`mock-chat-avatar ${isEarthy ? "bg-terracotta-400" : "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 bg-blue-grey"}`}>AI</div>
                  <div className={`mock-chat-bubble ${isEarthy ? "border-terracotta-400 bg-cream-50" : "rounded-2xl px-4 py-3 border-2 border-blue-grey bg-pale-lavender"}`}>
                    <p className={isEarthy ? "" : "text-charcoal-grey"}>
                      I understand you're feeling anxious about tomorrow. Let's
                      try a grounding exercise together.
                    </p>
                  </div>
                </div>
                <div className={isEarthy ? "mock-chat-message" : "flex items-start gap-3"}>
                  <div className={`mock-chat-avatar ${isEarthy ? "bg-rust-500" : "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 bg-slate-blue"}`}>ME</div>
                  <div className={`mock-chat-bubble ${isEarthy ? "border-rust-400 bg-white" : "rounded-2xl px-4 py-3 border-2 border-slate-blue bg-white"}`}>
                    <p className={isEarthy ? "" : "text-charcoal-grey"}>That would be helpful, thank you.</p>
                  </div>
                </div>
                <div className={isEarthy ? "mock-chat-message" : "flex items-start gap-3"}>
                  <div className={`mock-chat-avatar ${isEarthy ? "bg-terracotta-400" : "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 bg-blue-grey"}`}>AI</div>
                  <div className={`mock-chat-bubble ${isEarthy ? "border-terracotta-400 bg-cream-50" : "rounded-2xl px-4 py-3 border-2 border-blue-grey bg-pale-lavender"}`}>
                    <p className={isEarthy ? "" : "text-charcoal-grey"}>
                      Great. Let's start by naming 5 things you can see right
                      now...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DetailedFeatureThemed>

          {/* Detailed Feature 3 - Community */}
          <DetailedFeatureThemed
            badge="PEER SUPPORT"
            title="Find your community and share your journey"
            description="Join support groups tailored to your needs. Connect with others who understand what you're going through."
            linkText="Meet our team"
            onNavigate={() => handleNavigation("/about")}
          >
            {/* Community Groups Mockup */}
            <div className={isEarthy ? "visual-frame" : "visual-frame-new"}>
              <div className="space-y-3">
                <div className={`mock-group-item ${isEarthy ? "" : "flex items-center gap-4 p-4 bg-white rounded-lg border border-cool-grey hover:border-blue-grey transition-colors"}`}>
                  <div className={`mock-group-avatar ${isEarthy ? "bg-rust-500" : "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 bg-slate-blue"}`}>AA</div>
                  <div className="flex-1">
                    <div className={`mock-group-title ${isEarthy ? "" : "font-semibold text-charcoal-grey"}`}>
                      Anxiety & Stress Management
                    </div>
                    <div className={`mock-group-members ${isEarthy ? "" : "text-sm text-slate-blue"}`}>
                      2,453 members • 15 active now
                    </div>
                  </div>
                </div>
                <div className={`mock-group-item ${isEarthy ? "" : "flex items-center gap-4 p-4 bg-white rounded-lg border border-cool-grey hover:border-blue-grey transition-colors"}`}>
                  <div className={`mock-group-avatar ${isEarthy ? "bg-terracotta-400" : "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 bg-blue-grey"}`}>DM</div>
                  <div className="flex-1">
                    <div className={`mock-group-title ${isEarthy ? "" : "font-semibold text-charcoal-grey"}`}>
                      Depression & Mood Support
                    </div>
                    <div className={`mock-group-members ${isEarthy ? "" : "text-sm text-slate-blue"}`}>
                      1,847 members • 8 active now
                    </div>
                  </div>
                </div>
                <div className={`mock-group-item ${isEarthy ? "" : "flex items-center gap-4 p-4 bg-white rounded-lg border border-cool-grey hover:border-blue-grey transition-colors"}`}>
                  <div className={`mock-group-avatar ${isEarthy ? "bg-tan-300" : "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 bg-cool-grey"}`}>CR</div>
                  <div className="flex-1">
                    <div className={`mock-group-title ${isEarthy ? "" : "font-semibold text-charcoal-grey"}`}>Coping & Resilience</div>
                    <div className={`mock-group-members ${isEarthy ? "" : "text-sm text-slate-blue"}`}>
                      3,102 members • 22 active now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DetailedFeatureThemed>
        </div>
      </section>

      {/* Testimonial Section */}
      <TestimonialThemed />

      {/* Who We Serve Section */}
      <div className={`py-20 ${isEarthy ? "bg-cream-100" : "bg-pale-lavender"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-semibold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"} mb-4`}>
              Who we're for
            </h2>
            <p className={`text-base ${isEarthy ? "text-brown-700" : "text-charcoal-grey"} max-w-2xl mx-auto`}>
              Tilted supports individuals at every stage of their mental
              wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Individual Users */}
            <div className={`${isEarthy ? "card" : "card-new"} p-8 ${isEarthy ? "hover:border-rust-400" : "hover:border-blue-grey"} transition-colors duration-200`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 ${isEarthy ? "bg-rust-500" : "bg-slate-blue"} flex items-center justify-center flex-shrink-0`}>
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"} mb-2`}>
                    Individual Users
                  </h3>
                  <p className={`${isEarthy ? "text-brown-700" : "text-slate-blue"} text-sm leading-relaxed`}>
                    Start your personal mental wellness journey with
                    comprehensive tools and support designed for you.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 pl-1">
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 ${isEarthy ? "bg-rust-500" : "bg-slate-blue"} rounded-full mt-2`}></div>
                  <span className={`${isEarthy ? "text-brown-700" : "text-slate-blue"} text-sm`}>
                    24/7 AI support and resources
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 ${isEarthy ? "bg-rust-500" : "bg-slate-blue"} rounded-full mt-2`}></div>
                  <span className={`${isEarthy ? "text-brown-700" : "text-slate-blue"} text-sm`}>
                    Access to supportive communities
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 ${isEarthy ? "bg-rust-500" : "bg-slate-blue"} rounded-full mt-2`}></div>
                  <span className={`${isEarthy ? "text-brown-700" : "text-slate-blue"} text-sm`}>
                    Progress tracking and insights
                  </span>
                </li>
              </ul>
              <button
                onClick={() => handleNavigation("/contact")}
                className={`${isEarthy ? "text-rust-500 hover:text-rust-600" : "text-slate-blue hover:text-charcoal-grey"} font-medium inline-flex items-center gap-2 group`}
              >
                Get started
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Therapists & Practices */}
            <div className={`${isEarthy ? "card" : "card-new"} p-8 ${isEarthy ? "hover:border-rust-400" : "hover:border-blue-grey"} transition-colors duration-200`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 ${isEarthy ? "bg-terracotta-400" : "bg-blue-grey"} flex items-center justify-center flex-shrink-0`}>
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"} mb-2`}>
                    Therapists & Practices
                  </h3>
                  <p className={`${isEarthy ? "text-brown-700" : "text-slate-blue"} text-sm leading-relaxed`}>
                    Streamline your practice management and provide better care
                    with our comprehensive platform.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 pl-1">
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 ${isEarthy ? "bg-terracotta-400" : "bg-blue-grey"} rounded-full mt-2`}></div>
                  <span className={`${isEarthy ? "text-brown-700" : "text-slate-blue"} text-sm`}>
                    Automated scheduling and billing
                  </span>
                </li>
              </ul>
              <button
                onClick={() => handleNavigation("/about")}
                className={`${isEarthy ? "text-terracotta-400 hover:text-terracotta-500" : "text-blue-grey hover:text-charcoal-grey"} font-medium inline-flex items-center gap-2 group`}
              >
                Learn more
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <CTASectionThemed onNavigate={handleNavigation} />

      {/* Resources Section */}
      <div className={`py-20 ${isEarthy ? "bg-cream-100 border-t border-tan-200" : "bg-pale-lavender border-t border-cool-grey"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-semibold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"} mb-4`}>
              More from Tilted
            </h2>
            <p className={`text-base ${isEarthy ? "text-brown-700" : "text-charcoal-grey"}`}>
              Explore resources designed to support your mental wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resource 1 */}
            <div className={`${isEarthy ? "card" : "card-new"} overflow-hidden ${isEarthy ? "hover:border-rust-400" : "hover:border-blue-grey"} transition-colors duration-200 cursor-pointer group`}>
              <div className={`h-48 ${isEarthy ? "bg-rust-400" : "bg-slate-blue"}`}></div>
              <div className="p-6">
                <div className={`inline-block px-3 py-1 ${isEarthy ? "bg-cream-200 text-brown-800" : "bg-pale-lavender text-charcoal-grey"} text-xs font-semibold tracking-wider mb-3`}>
                  ARTICLE
                </div>
                <h3 className={`text-lg font-semibold ${isEarthy ? "text-brown-800 group-hover:text-rust-500" : "text-charcoal-grey group-hover:text-slate-blue"} mb-2 transition-colors`}>
                  5 ways to manage daily stress
                </h3>
                <p className={`${isEarthy ? "text-brown-600" : "text-slate-blue"} text-sm leading-relaxed`}>
                  Discover practical techniques to reduce stress and improve
                  your daily well-being.
                </p>
              </div>
            </div>

            {/* Resource 2 */}
            <div className={`${isEarthy ? "card" : "card-new"} overflow-hidden ${isEarthy ? "hover:border-rust-400" : "hover:border-blue-grey"} transition-colors duration-200 cursor-pointer group`}>
              <div className={`h-48 ${isEarthy ? "bg-terracotta-400" : "bg-blue-grey"}`}></div>
              <div className="p-6">
                <div className={`inline-block px-3 py-1 ${isEarthy ? "bg-cream-200 text-brown-800" : "bg-pale-lavender text-charcoal-grey"} text-xs font-semibold tracking-wider mb-3`}>
                  GUIDE
                </div>
                <h3 className={`text-lg font-semibold ${isEarthy ? "text-brown-800 group-hover:text-terracotta-400" : "text-charcoal-grey group-hover:text-blue-grey"} mb-2 transition-colors`}>
                  Getting started with therapy
                </h3>
                <p className={`${isEarthy ? "text-brown-600" : "text-slate-blue"} text-sm leading-relaxed`}>
                  Your complete guide to beginning therapy and what to expect.
                </p>
              </div>
            </div>

            {/* Resource 3 */}
            <div className={`${isEarthy ? "card" : "card-new"} overflow-hidden ${isEarthy ? "hover:border-rust-400" : "hover:border-blue-grey"} transition-colors duration-200 cursor-pointer group`}>
              <div className={`h-48 ${isEarthy ? "bg-tan-300" : "bg-cool-grey"}`}></div>
              <div className="p-6">
                <div className={`inline-block px-3 py-1 ${isEarthy ? "bg-cream-200 text-brown-800" : "bg-pale-lavender text-charcoal-grey"} text-xs font-semibold tracking-wider mb-3`}>
                  TEMPLATE
                </div>
                <h3 className={`text-lg font-semibold ${isEarthy ? "text-brown-800 group-hover:text-tan-400" : "text-charcoal-grey group-hover:text-cool-grey"} mb-2 transition-colors`}>
                  Mindfulness journal template
                </h3>
                <p className={`${isEarthy ? "text-brown-600" : "text-slate-blue"} text-sm leading-relaxed`}>
                  Track your thoughts and emotions with our free journal
                  template.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className={`${isEarthy ? "text-rust-500 hover:text-rust-600" : "text-slate-blue hover:text-charcoal-grey"} font-medium inline-flex items-center gap-2 group`}>
              View all resources
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}