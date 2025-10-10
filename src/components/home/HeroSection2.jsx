import landingImage from "../../assets/landing2.png";
import "../../Home2.css";

export default function HeroSection2({ onNavigate }) {
  return (
    <section className="relative py-20 bg-pale-lavender overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZhMSAxIDAgMCAxIDAtMmg2YTEgMSAwIDAgMSAwIDJ6bS0xMiAwSDhhMSAxIDAgMCAxIDAtMmgxNmExIDEgMCAwIDEgMCAyek0zNiAxOGgtNmExIDEgMCAwIDEgMC0yaDZhMSAxIDAgMCAxIDAgem0tMTIgMEg4YTEgMSAwIDAgMSAwLTJoMTZhMSAxIDAgMCAxIDAgek0zNiA0Mmg2YTEgMSAwIDAgMSAwIDJoLTZhMSAxIDAgMCAxIDAtMnptLTEyIDBoMTZhMSAxIDAgMCAxIDAgMkg4YTEgMSAwIDAgMSAwLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Landing Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src={landingImage} 
                alt="Tilted Mental Wellness" 
                className="mt-5 w-md h-auto object-contain rounded-lg shadow-2xl" 
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-grey mb-6 leading-tight">
            Everything you need to manage<br />
            <span className="text-slate-blue">
              your mental wellness journey
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-charcoal-grey max-w-3xl mx-auto mb-10 leading-relaxed">
            Our platform helps you save time and focus on what matters most—your well-being. 
            Connect with licensed therapists, join supportive communities, and access AI-powered resources.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => onNavigate("/contact")}
              className="btn-primary-new px-8 py-3"
            >
              Start free trial
            </button>
            <button
              onClick={() => onNavigate("/about")}
              className="btn-secondary-new px-8 py-3"
            >
              Learn more
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-charcoal-grey">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-blue rounded-full"></div>
              <span>HIPAA-compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-blue rounded-full"></div>
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-blue rounded-full"></div>
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}