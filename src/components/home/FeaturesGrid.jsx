import { useTheme } from "../../contexts/ThemeContext";
import FeatureCard from "./FeatureCard";

export default function FeaturesGrid() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Easy Scheduling",
      description: "Book sessions instantly with our intuitive calendar system. Set reminders and never miss an appointment.",
      color: "primary"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "Telehealth Sessions",
      description: "Connect from anywhere with secure, HIPAA-compliant video sessions. Convenient care on your schedule.",
      color: "secondary"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Progress Tracking",
      description: "Monitor your journey with customizable tools and measurement-based assessments.",
      color: "tertiary"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure & Private",
      description: "Your data is protected with advanced encryption. We're HIPAA-compliant and HITRUST certified.",
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
    <section className={`py-20 ${isEarthy ? "bg-cream-100" : "bg-pale-lavender"}`}>
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
