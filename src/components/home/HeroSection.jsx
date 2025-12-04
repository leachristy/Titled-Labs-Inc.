import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useRef } from "react";
import landingImage from "../../assets/landing.jpg";
import landingImage2 from "../../assets/landing2.png";

export default function HeroSection({ onNavigate }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const headerRef = useRef(null);

  useEffect(() => {
    if (!window.FinisherHeader) return;

    // --- FIX: Patch the library to prevent crashes on resize ---
    // The library tries to resize even after the component is unmounted.
    // We overwrite the resize function to silently fail if the element is missing.
    if (!window.FinisherHeader.prototype.isPatched) {
      const originalResize = window.FinisherHeader.prototype.resize;
      window.FinisherHeader.prototype.resize = function() {
        try {
          // If the element is gone, stop immediately (don't throw error)
          const className = (this.o && this.o.className) || "finisher-header";
          if (!document.getElementsByClassName(className).length) return;
          
          // Otherwise, run the original resize logic
          return originalResize.apply(this, arguments);
        } catch (e) {
          // Ignore any other errors from the library
        }
      };
      window.FinisherHeader.prototype.isPatched = true;
    }
    // -----------------------------------------------------------

    const initAnimation = () => {
      const targetElement = document.querySelector('.finisher-header');
      if (!targetElement) return;

      const existingCanvas = document.querySelector('#finisher-canvas');
      if (existingCanvas) existingCanvas.remove();

      try {
        const config = isEarthy ? {
          className: "finisher-header",
          count: 5,
          size: { min: 1000, max: 1400, pulse: 0.1 },
          speed: { x: { min: 0.1, max: 0.25 }, y: { min: 0.1, max: 0.25 } },
          colors: {
            background: "#ECDAC8",
            particles: ["#D1A693", "#D8966F", "#BF5B3C", "#955749"]
          },
          blending: "lighten",
          opacity: { center: 0.8, edge: 0.2 },
          skew: 0,
          shapes: ["c"]
        } : {
          // Cool theme animation - Using cool theme color palette
          count: 12,
          size: {
            min: 1300,
            max: 1500,
            pulse: 0
          },
          speed: {
            x: {
              min: 0.6,
              max: 3
            },
            y: {
              min: 0.6,
              max: 3
            }
          },
          colors: {
            background: "#373E4F", // charcoal-grey
            particles: [
              "#c7b4e2", // light-lavender
              "#DFD2D5", // pale-lavender
              "#646F89", // slate-blue
              "#8090B0"  // blue-grey
            ]
          },
          blending: "lighten",
          opacity: {
            center: 0.6,
            edge: 0
          },
          skew: -2,
          shapes: [
            "c"
          ]
        };

        new window.FinisherHeader(config);
      } catch (error) {
        console.error("Animation initialization failed:", error);
      }
    };

    const timer = setTimeout(initAnimation, 100);

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initAnimation();
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      const canvas = document.querySelector('#finisher-canvas');
      if (canvas) canvas.remove();
    };
  }, [isEarthy]);

  return (
    <section 
      key={currentTheme}
      ref={headerRef}
      className={`finisher-header relative py-20 ${isEarthy ? "bg-cream-200" : "bg-charcoal-grey"}`}
      style={{ minHeight: "600px", position: "relative", overflow: "hidden" }}
    >
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 z-10" style={{ zIndex: 10 }}>
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={isEarthy ? landingImage : landingImage2}
                alt="Tilted Mental Wellness"
                className="object-cover w-full max-w-2xl h-80 mt-5 rounded-lg shadow-2xl"
              />
            </div>
          </div>

          <h1 className={`mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl ${
            isEarthy ? "text-brown-800" : "text-white"
          }`}>
            Everything you need to manage
            <br />
            <span className={isEarthy ? "text-rust-600" : "text-charcoal-grey"}>
              your mental wellness journey
            </span>
          </h1>

          <p className={`max-w-3xl mx-auto mb-10 text-lg leading-relaxed sm:text-xl ${
            isEarthy ? "text-brown-700" : "text-white"
          }`}>
            Access self-care tools, join supportive communities, get AI-powered guidance, and track your progress—all in one secure, easy-to-use platform designed for your mental wellness.
          </p>

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