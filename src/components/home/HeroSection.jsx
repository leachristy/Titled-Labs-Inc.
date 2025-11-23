import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useRef } from "react";
import landingImage from "../../assets/landing.jpg";
import landingImage2 from "../../assets/landing2.png";

export default function HeroSection({ onNavigate }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current || !window.FinisherHeader) {
      console.log("⏳ Waiting for FinisherHeader library or DOM...");
      return;
    }

    // Remove any existing canvas before creating new one
    const existingCanvas = document.querySelector('#finisher-canvas');
    if (existingCanvas) {
      existingCanvas.remove();
      console.log("🗑️ Removed previous canvas");
    }

    try {
      const config = isEarthy ? {
        // Earthy theme animation
        count: 4,
        size: {
          min: 1200,
          max: 1500,
          pulse: 0.1
        },
        speed: {
          x: { min: 0, max: 0.2 },
          y: { min: 0, max: 0.2 }
        },
        colors: {
          background: "#ecdac8",
          particles: ["#d1a693", "#d8966f", "#bf5b3c", "#955749"]
        },
        blending: "lighten",
        opacity: {
          center: 0.8,
          edge: 0.2
        },
        skew: -2,
        shapes: ["c"]
      } : {
        // Cool theme animation - ULTRA visible
        count: 20,
        size: {
          min: 1200,
          max: 2000,
          pulse: 1
        },
        speed: {
          x: { min: 0.5, max: 1 },
          y: { min: 0.5, max: 1 }
        },
        colors: {
          background: "#373E4F",
          particles: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"]
        },
        blending: "lighter",
        opacity: {
          center: 1,
          edge: 0.9
        },
        skew: -2,
        shapes: ["c", "t"]
      };

      console.log(`🎨 Creating ${isEarthy ? 'EARTHY' : 'COOL'} animation`);
      new window.FinisherHeader(config);
      
      // Verify it was created
      setTimeout(() => {
        const canvas = document.querySelector('#finisher-canvas');
        console.log(canvas ? `✅ Canvas created for ${isEarthy ? 'EARTHY' : 'COOL'} theme` : `❌ NO CANVAS for ${isEarthy ? 'EARTHY' : 'COOL'} theme`);
      }, 100);
    } catch (error) {
      console.error("❌ Animation initialization failed:", error);
    }

    // Cleanup function
    return () => {
      const canvas = document.querySelector('#finisher-canvas');
      if (canvas) {
        canvas.remove();
        console.log("🧹 Cleanup: Canvas removed");
      }
    };
  }, [isEarthy]);

  return (
    <section 
      key={currentTheme}
      ref={headerRef}
      className={`finisher-header relative py-20 overflow-hidden ${isEarthy ? "bg-terracotta-200" : "bg-charcoal-grey"}`}
      style={{ minHeight: "600px", position: "relative" }}
    >
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 z-10">
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
            isEarthy ? "text-brown-800" : "text-white"
          }`}>
            Everything you need to manage
            <br />
            <span className={isEarthy ? "text-rust-600" : "text-light-lavender"}>
              your mental wellness journey
            </span>
          </h1>

          {/* Subheading */}
          <p className={`max-w-3xl mx-auto mb-10 text-lg leading-relaxed sm:text-xl ${
            isEarthy ? "text-brown-700" : "text-gray-300"
          }`}>
            Access self-care tools, join supportive communities, get AI-powered guidance, and track your progress—all in one secure, easy-to-use platform designed for your mental wellness.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 mb-12 sm:flex-row">
            <button
              onClick={() => onNavigate("/signup")}
              className={`px-8 py-3 ${isEarthy ? "btn-primary" : "btn-primary-new"}`}
            >
              Get started free
            </button>
            <button
              onClick={() => onNavigate("/about")}
              className={`px-8 py-3 ${isEarthy ? "btn-secondary" : "btn-secondary-new"}`}
            >
              Learn more
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={`flex flex-wrap items-center justify-center gap-6 text-sm ${
            isEarthy ? "text-brown-700" : "text-gray-300"
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isEarthy ? "bg-rust-500" : "bg-light-lavender"}`}></div>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isEarthy ? "bg-rust-500" : "bg-light-lavender"}`}></div>
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isEarthy ? "bg-rust-500" : "bg-light-lavender"}`}></div>
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
