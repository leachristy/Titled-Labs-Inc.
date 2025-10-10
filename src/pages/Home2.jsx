import { useNavigate } from "react-router";
import HeroSection2 from "../components/home/HeroSection2";
import StatsBar2 from "../components/home/StatsBar2";
import FeaturesGrid2 from "../components/home/FeaturesGrid2";
import "../Home2.css";

export default function Home2() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <title>Home2 - Tilted | Mental Wellness App</title>

      {/* Hero Section */}
      <HeroSection2 onNavigate={handleNavigation} />

      {/* Stats Bar */}
      <StatsBar2 />

      {/* Main Features Grid */}
      <FeaturesGrid2 />

      {/* Detailed Feature 1 - Therapy & Community */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-3 py-1 bg-pale-lavender text-slate-blue text-xs font-semibold tracking-wider mb-4">
                PROFESSIONAL SUPPORT
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal-grey mb-6 leading-tight">
                Connect with licensed therapists and supportive communities
              </h2>
              <p className="text-lg text-slate-blue mb-8 leading-relaxed">
                Join specialized groups, attend sessions, and access evidence-based therapy tools—all in one secure platform.
              </p>
              <button
                onClick={() => handleNavigation("/about")}
                className="btn-primary-new px-6 py-3 inline-flex items-center gap-2 group"
              >
                Learn more about our team
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
            <div className="order-1 lg:order-2">
              {/* Therapy Portal Mockup */}
              <div className="visual-frame-new">
                <div className="visual-card-new">
                  <div className="flex items-center gap-4 pb-4 border-b border-cool-grey">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl bg-slate-blue">
                      <span>DR</span>
                    </div>
                    <div>
                      <div className="font-semibold text-charcoal-grey">Dr. Sarah Mitchell</div>
                      <div className="text-sm text-slate-blue">
                        Licensed Therapist • CBT Specialist
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center py-2 border-b border-cool-grey">
                      <span className="text-sm text-charcoal-grey">Next Session</span>
                      <span className="font-semibold text-slate-blue">
                        Tomorrow, 3:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cool-grey">
                      <span className="text-sm text-charcoal-grey">
                        Total Sessions
                      </span>
                      <span className="font-semibold text-charcoal-grey">
                        12 completed
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cool-grey">
                      <span className="text-sm text-charcoal-grey">
                        Progress Notes
                      </span>
                      <span className="font-semibold text-blue-grey">
                        8 entries
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Feature 2 - Contact & Support */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-1">
              {/* AI Chat Mockup */}
              <div className="visual-frame-new">
                <div className="visual-card-new space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 bg-blue-grey">AI</div>
                    <div className="rounded-2xl px-4 py-3 border-2 border-blue-grey bg-pale-lavender">
                      <p className="text-charcoal-grey">
                        I understand you're feeling anxious about tomorrow. Let's
                        try a grounding exercise together.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 bg-slate-blue">ME</div>
                    <div className="rounded-2xl px-4 py-3 border-2 border-slate-blue bg-white">
                      <p className="text-charcoal-grey">That would be helpful, thank you.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 bg-blue-grey">AI</div>
                    <div className="rounded-2xl px-4 py-3 border-2 border-blue-grey bg-pale-lavender">
                      <p className="text-charcoal-grey">
                        Great. Let's start by naming 5 things you can see right
                        now...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2">
              <div className="inline-block px-3 py-1 bg-pale-lavender text-slate-blue text-xs font-semibold tracking-wider mb-4">
                WELLNESS SUPPORT
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal-grey mb-6 leading-tight">
                Get personalized support for your mental wellness journey
              </h2>
              <p className="text-lg text-slate-blue mb-8 leading-relaxed">
                Available support to provide coping strategies, mindfulness exercises, and emotional support for your journey.
              </p>
              <button
                onClick={() => handleNavigation("/contact")}
                className="btn-primary-new px-6 py-3 inline-flex items-center gap-2 group"
              >
                Contact us today
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

          {/* Detailed Feature 3 - Community */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-3 py-1 bg-pale-lavender text-slate-blue text-xs font-semibold tracking-wider mb-4">
                PEER SUPPORT
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal-grey mb-6 leading-tight">
                Find your community and share your journey
              </h2>
              <p className="text-lg text-slate-blue mb-8 leading-relaxed">
                Join support groups tailored to your needs. Connect with others who understand what you're going through.
              </p>
              <button
                onClick={() => handleNavigation("/about")}
                className="btn-primary-new px-6 py-3 inline-flex items-center gap-2 group"
              >
                Meet our team
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
            <div className="order-1 lg:order-2">
              {/* Community Groups Mockup */}
              <div className="visual-frame-new">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-cool-grey hover:border-blue-grey transition-colors">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 bg-slate-blue">AA</div>
                    <div className="flex-1">
                      <div className="font-semibold text-charcoal-grey">
                        Anxiety & Stress Management
                      </div>
                      <div className="text-sm text-slate-blue">
                        2,453 members • 15 active now
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-cool-grey hover:border-blue-grey transition-colors">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 bg-blue-grey">DM</div>
                    <div className="flex-1">
                      <div className="font-semibold text-charcoal-grey">
                        Depression & Mood Support
                      </div>
                      <div className="text-sm text-slate-blue">
                        1,847 members • 8 active now
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-cool-grey hover:border-blue-grey transition-colors">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 bg-cool-grey">CR</div>
                    <div className="flex-1">
                      <div className="font-semibold text-charcoal-grey">Coping & Resilience</div>
                      <div className="text-sm text-slate-blue">
                        3,102 members • 22 active now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <div className="py-20 bg-pale-lavender">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-charcoal-grey mb-4">
              Who we're for
            </h2>
            <p className="text-base text-charcoal-grey max-w-2xl mx-auto">
              Tilted supports individuals at every stage of their mental
              wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Individual Users */}
            <div className="card-new hover:border-blue-grey transition-colors duration-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-blue flex items-center justify-center flex-shrink-0">
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
                  <h3 className="text-xl font-semibold text-charcoal-grey mb-2">
                    Individual Users
                  </h3>
                  <p className="text-slate-blue text-sm leading-relaxed">
                    Start your personal mental wellness journey with
                    comprehensive tools and support designed for you.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 pl-1">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-blue rounded-full mt-2"></div>
                  <span className="text-slate-blue text-sm">
                    24/7 AI support and resources
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-blue rounded-full mt-2"></div>
                  <span className="text-slate-blue text-sm">
                    Access to supportive communities
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-blue rounded-full mt-2"></div>
                  <span className="text-slate-blue text-sm">
                    Progress tracking and insights
                  </span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/contact")}
                className="text-slate-blue font-medium hover:text-charcoal-grey inline-flex items-center gap-2 group"
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
            <div className="card-new hover:border-blue-grey transition-colors duration-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-grey flex items-center justify-center flex-shrink-0">
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
                  <h3 className="text-xl font-semibold text-charcoal-grey mb-2">
                    Therapists & Practices
                  </h3>
                  <p className="text-slate-blue text-sm leading-relaxed">
                    Streamline your practice management and provide better care
                    with our comprehensive platform.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 pl-1">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-grey rounded-full mt-2"></div>
                  <span className="text-slate-blue text-sm">
                    Automated scheduling and billing
                  </span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/about")}
                className="text-blue-grey font-medium hover:text-charcoal-grey inline-flex items-center gap-2 group"
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
      <section className="py-20 bg-slate-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to start your wellness journey?
          </h2>
          <p className="text-lg text-pale-lavender max-w-2xl mx-auto mb-10">
            Try Tilted free for 30 days. Experience the complete platform and see how we can support your mental wellness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNavigation("/contact")}
              className="bg-white text-slate-blue font-semibold py-3 px-8 rounded-lg hover:bg-pale-lavender transition-colors"
            >
              Start free trial
            </button>
            <button
              onClick={() => handleNavigation("/about")}
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-slate-blue transition-colors"
            >
              Learn more
            </button>
          </div>
          <p className="text-pale-lavender text-sm mt-8">
            Join 225,000+ users who trust Tilted for their mental wellness
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <div className="py-20 bg-pale-lavender border-t border-cool-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-charcoal-grey mb-4">
              More from Tilted
            </h2>
            <p className="text-base text-charcoal-grey">
              Explore resources designed to support your mental wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resource 1 */}
            <div className="card-new overflow-hidden hover:border-blue-grey transition-colors duration-200 cursor-pointer group">
              <div className="h-48 bg-slate-blue"></div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-pale-lavender text-charcoal-grey text-xs font-semibold tracking-wider mb-3">
                  ARTICLE
                </div>
                <h3 className="text-lg font-semibold text-charcoal-grey mb-2 group-hover:text-slate-blue transition-colors">
                  5 ways to manage daily stress
                </h3>
                <p className="text-slate-blue text-sm leading-relaxed">
                  Discover practical techniques to reduce stress and improve
                  your daily well-being.
                </p>
              </div>
            </div>

            {/* Resource 2 */}
            <div className="card-new overflow-hidden hover:border-blue-grey transition-colors duration-200 cursor-pointer group">
              <div className="h-48 bg-blue-grey"></div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-pale-lavender text-charcoal-grey text-xs font-semibold tracking-wider mb-3">
                  GUIDE
                </div>
                <h3 className="text-lg font-semibold text-charcoal-grey mb-2 group-hover:text-blue-grey transition-colors">
                  Getting started with therapy
                </h3>
                <p className="text-slate-blue text-sm leading-relaxed">
                  Your complete guide to beginning therapy and what to expect.
                </p>
              </div>
            </div>

            {/* Resource 3 */}
            <div className="card-new overflow-hidden hover:border-blue-grey transition-colors duration-200 cursor-pointer group">
              <div className="h-48 bg-cool-grey"></div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-pale-lavender text-charcoal-grey text-xs font-semibold tracking-wider mb-3">
                  TEMPLATE
                </div>
                <h3 className="text-lg font-semibold text-charcoal-grey mb-2 group-hover:text-cool-grey transition-colors">
                  Mindfulness journal template
                </h3>
                <p className="text-slate-blue text-sm leading-relaxed">
                  Track your thoughts and emotions with our free journal
                  template.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className="text-slate-blue font-medium hover:text-charcoal-grey inline-flex items-center gap-2 group">
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