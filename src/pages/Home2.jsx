import { useNavigate } from "react-router";
import HeroSection from "../components/home/HeroSection";
import StatsBar from "../components/home/StatsBar";
import FeaturesGrid from "../components/home/FeaturesGrid";
import "../Home2.css";
import NavBar from "../components/NavBar";

export default function Home2() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <title>Home2 - Tilted | Mental Wellness App</title>
      <NavBar />
      {/* Hero Section */}
      <HeroSection onNavigate={handleNavigation} />

      {/* Stats Bar */}
      <StatsBar />

      {/* Main Features Grid */}
      <FeaturesGrid />

      {/* Detailed Feature 1 - Therapy & Community */}
      <section className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 mb-20 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider bg-pale-lavender text-slate-blue">
                PROFESSIONAL SUPPORT
              </div>
              <h2 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl text-charcoal-grey">
                Connect with licensed therapists and supportive communities
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-blue">
                Join specialized groups, attend sessions, and access
                evidence-based therapy tools—all in one secure platform.
              </p>
              <button
                onClick={() => handleNavigation("/about")}
                className="inline-flex items-center gap-2 px-6 py-3 btn-primary-new group"
              >
                Learn more about our team
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
                    <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-white rounded-full bg-slate-blue">
                      <span>DR</span>
                    </div>
                    <div>
                      <div className="font-semibold text-charcoal-grey">
                        Dr. Sarah Mitchell
                      </div>
                      <div className="text-sm text-slate-blue">
                        Licensed Therapist • CBT Specialist
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-cool-grey">
                      <span className="text-sm text-charcoal-grey">
                        Next Session
                      </span>
                      <span className="font-semibold text-slate-blue">
                        Tomorrow, 3:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-cool-grey">
                      <span className="text-sm text-charcoal-grey">
                        Total Sessions
                      </span>
                      <span className="font-semibold text-charcoal-grey">
                        12 completed
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-cool-grey">
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
          <div className="grid items-center gap-12 mb-20 lg:grid-cols-2">
            <div className="order-1">
              {/* AI Chat Mockup */}
              <div className="visual-frame-new">
                <div className="space-y-4 visual-card-new">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-semibold text-white rounded-full bg-blue-grey">
                      AI
                    </div>
                    <div className="px-4 py-3 border-2 rounded-2xl border-blue-grey bg-pale-lavender">
                      <p className="text-charcoal-grey">
                        I understand you're feeling anxious about tomorrow.
                        Let's try a grounding exercise together.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-semibold text-white rounded-full bg-slate-blue">
                      ME
                    </div>
                    <div className="px-4 py-3 bg-white border-2 rounded-2xl border-slate-blue">
                      <p className="text-charcoal-grey">
                        That would be helpful, thank you.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-semibold text-white rounded-full bg-blue-grey">
                      AI
                    </div>
                    <div className="px-4 py-3 border-2 rounded-2xl border-blue-grey bg-pale-lavender">
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
              <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider bg-pale-lavender text-slate-blue">
                WELLNESS SUPPORT
              </div>
              <h2 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl text-charcoal-grey">
                Get personalized support for your mental wellness journey
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-blue">
                Available support to provide coping strategies, mindfulness
                exercises, and emotional support for your journey.
              </p>
              <button
                onClick={() => handleNavigation("/contact")}
                className="inline-flex items-center gap-2 px-6 py-3 btn-primary-new group"
              >
                Contact us today
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider bg-pale-lavender text-slate-blue">
                PEER SUPPORT
              </div>
              <h2 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl text-charcoal-grey">
                Find your community and share your journey
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-blue">
                Join support groups tailored to your needs. Connect with others
                who understand what you're going through.
              </p>
              <button
                onClick={() => handleNavigation("/about")}
                className="inline-flex items-center gap-2 px-6 py-3 btn-primary-new group"
              >
                Meet our team
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
                  <div className="flex items-center gap-4 p-4 transition-colors bg-white border rounded-lg border-cool-grey hover:border-blue-grey">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 font-bold text-white rounded-lg bg-slate-blue">
                      AA
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-charcoal-grey">
                        Anxiety & Stress Management
                      </div>
                      <div className="text-sm text-slate-blue">
                        2,453 members • 15 active now
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 transition-colors bg-white border rounded-lg border-cool-grey hover:border-blue-grey">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 font-bold text-white rounded-lg bg-blue-grey">
                      DM
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-charcoal-grey">
                        Depression & Mood Support
                      </div>
                      <div className="text-sm text-slate-blue">
                        1,847 members • 8 active now
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 transition-colors bg-white border rounded-lg border-cool-grey hover:border-blue-grey">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 font-bold text-white rounded-lg bg-cool-grey">
                      CR
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-charcoal-grey">
                        Coping & Resilience
                      </div>
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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-semibold sm:text-4xl text-charcoal-grey">
              Who we're for
            </h2>
            <p className="max-w-2xl mx-auto text-base text-charcoal-grey">
              Tilted supports individuals at every stage of their mental
              wellness journey.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Individual Users */}
            <div className="transition-colors duration-200 card-new hover:border-blue-grey">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-slate-blue">
                  <svg
                    className="text-white w-7 h-7"
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
                  <h3 className="mb-2 text-xl font-semibold text-charcoal-grey">
                    Individual Users
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-blue">
                    Start your personal mental wellness journey with
                    comprehensive tools and support designed for you.
                  </p>
                </div>
              </div>
              <ul className="pl-1 mb-6 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-blue rounded-full mt-2"></div>
                  <span className="text-sm text-slate-blue">
                    24/7 AI support and resources
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-blue rounded-full mt-2"></div>
                  <span className="text-sm text-slate-blue">
                    Access to supportive communities
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-blue rounded-full mt-2"></div>
                  <span className="text-sm text-slate-blue">
                    Progress tracking and insights
                  </span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2 font-medium text-slate-blue hover:text-charcoal-grey group"
              >
                Get started
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
            <div className="transition-colors duration-200 card-new hover:border-blue-grey">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-grey">
                  <svg
                    className="text-white w-7 h-7"
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
                  <h3 className="mb-2 text-xl font-semibold text-charcoal-grey">
                    Therapists & Practices
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-blue">
                    Streamline your practice management and provide better care
                    with our comprehensive platform.
                  </p>
                </div>
              </div>
              <ul className="pl-1 mb-6 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-grey rounded-full mt-2"></div>
                  <span className="text-sm text-slate-blue">
                    Automated scheduling and billing
                  </span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/about")}
                className="inline-flex items-center gap-2 font-medium text-blue-grey hover:text-charcoal-grey group"
              >
                Learn more
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Ready to start your wellness journey?
          </h2>
          <p className="max-w-2xl mx-auto mb-10 text-lg text-pale-lavender">
            Try Tilted free for 30 days. Experience the complete platform and
            see how we can support your mental wellness journey.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => handleNavigation("/signup")}
              className="px-8 py-3 font-semibold transition-colors bg-white rounded-lg text-slate-blue hover:bg-pale-lavender"
            >
              Start free trial
            </button>
            <button
              onClick={() => handleNavigation("/contact")}
              className="px-8 py-3 font-semibold text-white transition-colors border-2 border-white rounded-lg hover:bg-white hover:text-slate-blue"
            >
              Learn more
            </button>
          </div>
          <p className="mt-8 text-sm text-pale-lavender">
            Join 225,000+ users who trust Tilted for their mental wellness
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <div className="py-20 border-t bg-pale-lavender border-cool-grey">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-charcoal-grey">
              More from Tilted
            </h2>
            <p className="text-base text-charcoal-grey">
              Explore resources designed to support your mental wellness journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Resource 1 */}
            <div className="overflow-hidden transition-colors duration-200 cursor-pointer card-new hover:border-blue-grey group">
              <div className="h-48 bg-slate-blue"></div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider bg-pale-lavender text-charcoal-grey">
                  ARTICLE
                </div>
                <h3 className="mb-2 text-lg font-semibold transition-colors text-charcoal-grey group-hover:text-slate-blue">
                  5 ways to manage daily stress
                </h3>
                <p className="text-sm leading-relaxed text-slate-blue">
                  Discover practical techniques to reduce stress and improve
                  your daily well-being.
                </p>
              </div>
            </div>

            {/* Resource 2 */}
            <div className="overflow-hidden transition-colors duration-200 cursor-pointer card-new hover:border-blue-grey group">
              <div className="h-48 bg-blue-grey"></div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider bg-pale-lavender text-charcoal-grey">
                  GUIDE
                </div>
                <h3 className="mb-2 text-lg font-semibold transition-colors text-charcoal-grey group-hover:text-blue-grey">
                  Getting started with therapy
                </h3>
                <p className="text-sm leading-relaxed text-slate-blue">
                  Your complete guide to beginning therapy and what to expect.
                </p>
              </div>
            </div>

            {/* Resource 3 */}
            <div className="overflow-hidden transition-colors duration-200 cursor-pointer card-new hover:border-blue-grey group">
              <div className="h-48 bg-cool-grey"></div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider bg-pale-lavender text-charcoal-grey">
                  TEMPLATE
                </div>
                <h3 className="mb-2 text-lg font-semibold transition-colors text-charcoal-grey group-hover:text-cool-grey">
                  Mindfulness journal template
                </h3>
                <p className="text-sm leading-relaxed text-slate-blue">
                  Track your thoughts and emotions with our free journal
                  template.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button className="inline-flex items-center gap-2 font-medium text-slate-blue hover:text-charcoal-grey group">
              View all resources
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
