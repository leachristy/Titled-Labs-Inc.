import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useRef } from "react";
import landingImage from "../../assets/landing.jpg";
import landingImage2 from "../../assets/landing2.png";

export default function HeroSection({ onNavigate }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const headerRef = useRef(null);

  // Predefine animation configurations
  const animationConfigs = {
    earthy: {
      count: 5,
      size: { min: 1000, max: 1400, pulse: 0.1 },
      speed: { x: { min: 0.1, max: 0.25 }, y: { min: 0.1, max: 0.25 } },
      colors: {
        background: "#ECDAC8",
        particles: ["#D1A693", "#D8966F", "#BF5B3C", "#955749"],
      },
      blending: "lighten",
      opacity: { center: 0.8, edge: 0.2 },
      skew: 0,
      shapes: ["c"],
    },
    cool: {
      count: 14,
      size: { min: 2, max: 251, pulse: 0 },
      speed: { x: { min: 0, max: 0.8 }, y: { min: 0, max: 0.2 } },
      colors: {
        background: "#373e4f",
        particles: ["#ff926b", "#87ddfe", "#acaaff", "#1bffc2", "#f9a5fe"],
      },
      blending: "screen",
      opacity: { center: 1, edge: 1 },
      skew: -1,
      shapes: ["c", "s", "t"],
    },
  };

  useEffect(() => {
    if (!window.FinisherHeader || !headerRef.current) return;

    const initAnimation = () => {
      // Remove existing canvas
      const existingCanvas = document.querySelector("#finisher-canvas");
      if (existingCanvas) existingCanvas.remove();

      try {
        const config = isEarthy ? animationConfigs.earthy : animationConfigs.cool;
        console.log(`Creating ${isEarthy ? "EARTHY" : "COOL"} theme animation`);
        new window.FinisherHeader(config);

        setTimeout(() => {
          const canvas = document.querySelector("#finisher-canvas");
          if (canvas) {
            canvas.style.position = "absolute";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.zIndex = "1";
            canvas.style.pointerEvents = "none";
            console.log("Canvas created successfully", canvas.width, "x", canvas.height);
          } else {
            console.warn("Canvas not found");
          }
        }, 100);
      } catch (error) {
        console.error("Animation initialization failed:", error);
      }
    };

    // Initial animation creation
    const timer = setTimeout(initAnimation, 100);

    // Recreate animation on window resize
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        console.log("Window resized, recreating animation");
        initAnimation();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      const canvas = document.querySelector("#finisher-canvas");
      if (canvas) canvas.remove();
    };
  }, [isEarthy]);

  // Styling helpers
  const themeStyles = {
    sectionBg: isEarthy ? "bg-cream-200" : "bg-charcoal-grey",
    heading: isEarthy ? "text-brown-800" : "text-white",
    headingAccent: isEarthy ? "text-rust-600" : "text-light-lavender",
    subheading: isEarthy ? "text-brown-700" : "text-gray-300",
    btnPrimary: isEarthy ? "btn-primary" : "btn-primary-new",
    btnSecondary: isEarthy ? "btn-secondary" : "btn-secondary-new",
    trustText: isEarthy ? "text-brown-700" : "text-gray-300",
    trustDot: isEarthy ? "bg-rust-500" : "bg-light-lavender",
  };

  const trustIndicators = [
    "Secure & Private",
    "30-day free trial",
    "No credit card required",
  ];

  return (
    <section
      key={currentTheme}
      ref={headerRef}
      className={`finisher-header relative py-20 ${themeStyles.sectionBg}`}
      style={{ minHeight: "600px", position: "relative", overflow: "hidden" }}
    >
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          {/* Landing Image */}
          <div className="flex justify-center mb-8">
            <img
              src={isEarthy ? landingImage : landingImage2}
              alt="Tilted Mental Wellness"
              className="object-cover w-full max-w-2xl h-80 mt-5 rounded-lg shadow-2xl"
            />
          </div>

          {/* Main Heading */}
          <h1
            className={`mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl ${themeStyles.heading}`}
          >
            Everything you need to manage
            <br />
            <span className={themeStyles.headingAccent}>
              your mental wellness journey
            </span>
          </h1>

          {/* Subheading */}
          <p className={`max-w-3xl mx-auto mb-10 text-lg leading-relaxed sm:text-xl ${themeStyles.subheading}`}>
            Access self-care tools, join supportive communities, get AI-powered guidance, and track your progress—all in one secure, easy-to-use platform designed for your mental wellness.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 mb-12 sm:flex-row">
            <button onClick={() => onNavigate("/signup")} className={`px-8 py-3 ${themeStyles.btnPrimary}`}>
              Get started free
            </button>
            <button onClick={() => onNavigate("/about")} className={`px-8 py-3 ${themeStyles.btnSecondary}`}>
              Learn more
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={`flex flex-wrap items-center justify-center gap-6 text-sm ${themeStyles.trustText}`}>
            {trustIndicators.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${themeStyles.trustDot}`}></div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
