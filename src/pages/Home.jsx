import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import HeroSection from "../components/home/HeroSection";
import StatsBar from "../components/home/StatsBar";
import FeaturesGrid from "../components/home/FeaturesGrid";
import DetailedFeature from "../components/home/DetailedFeature";
import Testimonial from "../components/home/Testimonial";
import CTASection from "../components/home/CTASection";

export default function Home() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === 'earthy';

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <title>Home - Tilted | Mental Wellness App</title>

      {/* Hero Section */}
      <HeroSection onNavigate={handleNavigation} />

      {/* Stats Bar */}
      <StatsBar />

      {/* Main Features Grid */}
      <FeaturesGrid />

      {/* Detailed Feature 1 - Therapy & Community */}
      <section className="py-20 bg-rust-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DetailedFeature
            badge="PROFESSIONAL SUPPORT"
            title="Connect with licensed therapists and supportive communities"
            description="Join specialized groups, attend sessions, and access evidence-based therapy tools—all in one secure platform."
            linkText="Learn more about our team"
            onNavigate={() => handleNavigation("/about")}
          >
            {/* Therapy Portal Mockup */}
            <div className="visual-frame">
              <div className="visual-card">
                <div className="mock-portal-header">
                  <div className="mock-portal-avatar bg-rust-500">
                    <span>DR</span>
                  </div>
                  <div>
                    <div className="mock-portal-title">Dr. Sarah Mitchell</div>
                    <div className="mock-portal-subtitle">
                      Licensed Therapist • CBT Specialist
                    </div>
                  </div>
                </div>
                <div className="mock-portal-items">
                  <div className="mock-portal-item">
                    <span className="text-sm text-brown-800">Next Session</span>
                    <span className="font-semibold text-rust-500">
                      Tomorrow, 3:00 PM
                    </span>
                  </div>
                  <div className="mock-portal-item">
                    <span className="text-sm text-brown-800">
                      Total Sessions
                    </span>
                    <span className="font-semibold text-brown-800">
                      12 completed
                    </span>
                  </div>
                  <div className="mock-portal-item">
                    <span className="text-sm text-brown-800">
                      Progress Notes
                    </span>
                    <span className="font-semibold text-terracotta-400">
                      8 entries
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DetailedFeature>

          {/* Detailed Feature 2 - Contact & Support */}
          <DetailedFeature
            badge="WELLNESS SUPPORT"
            title="Get personalized support for your mental wellness journey"
            description="Available support to provide coping strategies, mindfulness exercises, and emotional support for your journey."
            linkText="Contact us today"
            onNavigate={() => handleNavigation("/contact")}
            reverse
          >
            {/* AI Chat Mockup */}
            <div className="visual-frame">
              <div className="visual-card space-y-4">
                <div className="mock-chat-message">
                  <div className="mock-chat-avatar bg-terracotta-400">AI</div>
                  <div className="mock-chat-bubble border-terracotta-400 bg-cream-50">
                    <p>
                      I understand you're feeling anxious about tomorrow. Let's
                      try a grounding exercise together.
                    </p>
                  </div>
                </div>
                <div className="mock-chat-message">
                  <div className="mock-chat-avatar bg-rust-500">ME</div>
                  <div className="mock-chat-bubble border-rust-400 bg-white">
                    <p>That would be helpful, thank you.</p>
                  </div>
                </div>
                <div className="mock-chat-message">
                  <div className="mock-chat-avatar bg-terracotta-400">AI</div>
                  <div className="mock-chat-bubble border-terracotta-400 bg-cream-50">
                    <p>
                      Great. Let's start by naming 5 things you can see right
                      now...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DetailedFeature>

          {/* Detailed Feature 3 - Community */}
          <DetailedFeature
            badge="PEER SUPPORT"
            title="Find your community and share your journey"
            description="Join support groups tailored to your needs. Connect with others who understand what you're going through."
            linkText="Meet our team"
            onNavigate={() => handleNavigation("/about")}
          >
            {/* Community Groups Mockup */}
            <div className="visual-frame">
              <div className="space-y-3">
                <div className="mock-group-item">
                  <div className="mock-group-avatar bg-rust-500">AA</div>
                  <div className="flex-1">
                    <div className="mock-group-title">
                      Anxiety & Stress Management
                    </div>
                    <div className="mock-group-members">
                      2,453 members • 15 active now
                    </div>
                  </div>
                </div>
                <div className="mock-group-item">
                  <div className="mock-group-avatar bg-terracotta-400">DM</div>
                  <div className="flex-1">
                    <div className="mock-group-title">
                      Depression & Mood Support
                    </div>
                    <div className="mock-group-members">
                      1,847 members • 8 active now
                    </div>
                  </div>
                </div>
                <div className="mock-group-item">
                  <div className="mock-group-avatar bg-tan-300">CR</div>
                  <div className="flex-1">
                    <div className="mock-group-title">Coping & Resilience</div>
                    <div className="mock-group-members">
                      3,102 members • 22 active now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DetailedFeature>
        </div>
      </section>

      {/* Testimonial Section */}
      <Testimonial />

      {/* Who We Serve Section */}
      <div className={`py-20 ${isEarthy ? 'bg-cream-100' : 'bg-pale-lavender'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-semibold mb-4 ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
              Who we're for
            </h2>
            <p className={`text-base max-w-2xl mx-auto ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
              Tilted supports individuals at every stage of their mental
              wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Individual Users */}
            <div className={`card p-8 transition-colors duration-200 ${isEarthy ? 'hover:border-rust-400' : 'hover:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${isEarthy ? 'bg-rust-500' : 'bg-slate-blue'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--slate-blue)'}}>
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
                  <h3 className={`text-xl font-semibold mb-2 ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                    Individual Users
                  </h3>
                  <p className={`text-sm leading-relaxed ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                    Start your personal mental wellness journey with
                    comprehensive tools and support designed for you.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 pl-1">
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 ${isEarthy ? 'bg-rust-500' : 'bg-slate-blue'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--slate-blue)'}}></div>
                  <span className={`text-sm ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                    24/7 AI support and resources
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 ${isEarthy ? 'bg-rust-500' : 'bg-slate-blue'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--slate-blue)'}}></div>
                  <span className={`text-sm ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                    Access to supportive communities
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 ${isEarthy ? 'bg-rust-500' : 'bg-slate-blue'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--slate-blue)'}}></div>
                  <span className={`text-sm ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                    Progress tracking and insights
                  </span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/contact")}
                className={`font-medium inline-flex items-center gap-2 group ${isEarthy ? 'text-rust-500 hover:text-rust-600' : 'text-slate-blue hover:text-charcoal-grey'}`}
                style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}
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
            <div className={`card p-8 transition-colors duration-200 ${isEarthy ? 'hover:border-rust-400' : 'hover:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${isEarthy ? 'bg-terracotta-400' : 'bg-blue-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--blue-grey)'}}>
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
                  <h3 className={`text-xl font-semibold mb-2 ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                    Therapists & Practices
                  </h3>
                  <p className={`text-sm leading-relaxed ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                    Streamline your practice management and provide better care
                    with our comprehensive platform.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 pl-1">
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 ${isEarthy ? 'bg-terracotta-400' : 'bg-blue-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--blue-grey)'}}></div>
                  <span className={`text-sm ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                    Automated scheduling and billing
                  </span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/about")}
                className={`font-medium inline-flex items-center gap-2 group ${isEarthy ? 'text-terracotta-400 hover:text-terracotta-500' : 'text-blue-grey hover:text-charcoal-grey'}`}
                style={{color: isEarthy ? undefined : 'var(--blue-grey)'}}
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
      <CTASection onNavigate={handleNavigation} />

      {/* Resources Section */}
      <div className={`py-20 border-t ${isEarthy ? 'bg-cream-100 border-tan-200' : 'bg-pale-lavender border-cool-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)', borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-semibold mb-4 ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
              More from Tilted
            </h2>
            <p className={`text-base ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
              Explore resources designed to support your mental wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resource 1 */}
            <div className={`card overflow-hidden transition-colors duration-200 cursor-pointer group ${isEarthy ? 'hover:border-rust-400' : 'hover:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
              <div className={`h-48 ${isEarthy ? 'bg-rust-400' : 'bg-slate-blue'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--slate-blue)'}}></div>
              <div className="p-6">
                <div className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider mb-3 ${isEarthy ? 'bg-cream-200 text-brown-800' : 'bg-pale-lavender text-charcoal-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)', color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                  ARTICLE
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors ${isEarthy ? 'text-brown-800 group-hover:text-rust-500' : 'text-charcoal-grey group-hover:text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                  5 ways to manage daily stress
                </h3>
                <p className={`text-sm leading-relaxed ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                  Discover practical techniques to reduce stress and improve
                  your daily well-being.
                </p>
              </div>
            </div>

            {/* Resource 2 */}
            <div className={`card overflow-hidden transition-colors duration-200 cursor-pointer group ${isEarthy ? 'hover:border-rust-400' : 'hover:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
              <div className={`h-48 ${isEarthy ? 'bg-terracotta-400' : 'bg-blue-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--blue-grey)'}}></div>
              <div className="p-6">
                <div className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider mb-3 ${isEarthy ? 'bg-cream-200 text-brown-800' : 'bg-pale-lavender text-charcoal-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)', color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                  GUIDE
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors ${isEarthy ? 'text-brown-800 group-hover:text-terracotta-400' : 'text-charcoal-grey group-hover:text-blue-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                  Getting started with therapy
                </h3>
                <p className={`text-sm leading-relaxed ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                  Your complete guide to beginning therapy and what to expect.
                </p>
              </div>
            </div>

            {/* Resource 3 */}
            <div className={`card overflow-hidden transition-colors duration-200 cursor-pointer group ${isEarthy ? 'hover:border-rust-400' : 'hover:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
              <div className={`h-48 ${isEarthy ? 'bg-tan-300' : 'bg-cool-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--cool-grey)'}}></div>
              <div className="p-6">
                <div className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider mb-3 ${isEarthy ? 'bg-cream-200 text-brown-800' : 'bg-pale-lavender text-charcoal-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)', color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                  TEMPLATE
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors ${isEarthy ? 'text-brown-800 group-hover:text-tan-400' : 'text-charcoal-grey group-hover:text-cool-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                  Mindfulness journal template
                </h3>
                <p className={`text-sm leading-relaxed ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                  Track your thoughts and emotions with our free journal
                  template.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className={`font-medium inline-flex items-center gap-2 group ${isEarthy ? 'text-rust-500 hover:text-rust-600' : 'text-slate-blue hover:text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
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
