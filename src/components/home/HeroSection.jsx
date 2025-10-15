import { useTheme } from "../../contexts/ThemeContext";
import landingImage from "../../assets/landing.jpg";
import landingImage2 from "../../assets/landing2.png";

export default function HeroSection({ onNavigate }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <section className={`relative py-20 overflow-hidden ${isEarthy ? "bg-terracotta-200" : "bg-pale-lavender"}`}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZhMSAxIDAgMCAxIDAtMmg2YTEgMSAwIDAgMSAwIDJ6bS0xMiAwSDhhMSAxIDAgMCAxIDAtMmgxNmExIDEgMCAwIDEgMCAyek0zNiAxOGgtNmExIDEgMCAwIDEgMC0yaDZhMSAxIDAgMCAxIDAgem0tMTIgMEg4YTEgMSAwIDAgMSAwLTJoMTZhMSAxIDAgMCAxIDAgek0zNiA0Mmg2YTEgMSAwIDAgMSAwIDJoLTZhMSAxIDAgMCAxIDAtMnptLTEyIDBoMTZhMSAxIDAgMCAxIDAgMkg4YTEgMSAwIDAgMSAwLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Landing Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={isEarthy ? landingImage : landingImage2}
                alt="Tilted Mental Wellness"
                className="object-cover w-full max-w-2xl h-80 mt-5 rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className={`mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl ${
            isEarthy ? "text-brown-800" : "text-charcoal-grey"
          }`}>
            Everything you need to manage
            <br />
            <span className={isEarthy ? "text-rust-600" : "text-slate-blue"}>
              your mental wellness journey
            </span>
          </h1>

          {/* Subheading */}
          <p className={`max-w-3xl mx-auto mb-10 text-lg leading-relaxed sm:text-xl ${
            isEarthy ? "text-brown-700" : "text-charcoal-grey"
          }`}>
            Our platform helps you save time and focus on what matters most—your
            well-being. Connect with licensed therapists, join supportive
            communities, and access AI-powered resources.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 mb-12 sm:flex-row">
            <button
              onClick={() => onNavigate("/signup")}
              className={`px-8 py-3 ${isEarthy ? "btn-primary" : "btn-primary-new"}`}
            >
              Start free trial
            </button>
            <button
              onClick={() => onNavigate("/contact")}
              className={`px-8 py-3 ${isEarthy ? "btn-secondary" : "btn-secondary-new"}`}
            >
              Learn more
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={`flex flex-wrap items-center justify-center gap-6 text-sm ${
            isEarthy ? "text-brown-700" : "text-charcoal-grey"
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isEarthy ? "bg-rust-500" : "bg-slate-blue"}`}></div>
              <span>HIPAA-compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isEarthy ? "bg-rust-500" : "bg-slate-blue"}`}></div>
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isEarthy ? "bg-rust-500" : "bg-slate-blue"}`}></div>
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
