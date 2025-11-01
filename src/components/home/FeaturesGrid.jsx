import { useTheme } from "../../contexts/ThemeContext";
import FeatureCard from "./FeatureCard";

export default function FeaturesGrid() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Self-Care Tools",
      description: "Access breathing exercises, guided meditation videos, journal entries, and goal tracking to support your daily wellness routine.",
      color: "primary"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: "Community Forums",
      description: "Join supportive communities, share experiences, and connect with others on similar wellness journeys through our forum platform.",
      color: "secondary"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered Support",
      description: "Get instant emotional support, coping strategies, and mindfulness guidance available 24/7 through our AI chat assistant.",
      color: "tertiary"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Secure & Private",
      description: "Your data is protected with advanced encryption. Track your progress privately with complete confidence and security.",
      color: "accent"
    }
  ];

  const securityBadges = isEarthy ? [
    { title: "HIPAA", subtitle: "Compliant", color: "rust" },
    { title: "HITRUST", subtitle: "Certified", color: "terracotta" },
    { title: "256-bit", subtitle: "Encryption", color: "brown" }
  ] : [
    { title: "HIPAA", subtitle: "Compliant", color: "slate" },
    { title: "HITRUST", subtitle: "Certified", color: "blue" },
    { title: "256-bit", subtitle: "Encryption", color: "charcoal" }
  ];

  return (
    <section className={`py-20 ${isEarthy ? "bg-cream-100" : "bg-[#ABAAC0]"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isEarthy ? "text-brown-800" : "text-charcoal-grey"
          }`}>
            Simplify every part of your wellness journey
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${
            isEarthy ? "text-brown-700" : "text-charcoal-grey"
          }`}>
            Our platform streamlines everything you need, saving you time so you can focus on what truly matters—your mental health and personal growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap justify-center gap-8">
          {securityBadges.map((badge, index) => (
            <SecurityBadge key={index} {...badge} isEarthy={isEarthy} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SecurityBadge({ title, subtitle, color, isEarthy }) {
  const colorMap = isEarthy ? {
    rust: "text-rust-500",
    terracotta: "text-terracotta-400",
    brown: "text-brown-600"
  } : {
    slate: "text-slate-blue",
    blue: "text-blue-grey",
    charcoal: "text-charcoal-grey"
  };

  return (
    <div className={`flex items-center gap-3 bg-white px-6 py-4 rounded-lg border shadow-sm ${
      isEarthy ? "border-tan-200" : "border-cool-grey"
    }`}>
      <div className={`${colorMap[color]}`}>
        {title === "HITRUST" ? <CertificationIcon /> : <ShieldCheckIcon />}
      </div>
      <div>
        <div className={`font-semibold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
          {title}
        </div>
        <div className={`text-sm ${isEarthy ? "text-brown-600" : "text-slate-blue"}`}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function CertificationIcon() {
  return (
    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
