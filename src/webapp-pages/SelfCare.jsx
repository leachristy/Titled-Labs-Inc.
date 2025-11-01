import React from "react";
import UntiltNavBar from "../components/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

// Import icon images
import breathingIcon from "../assets/breathing.png";
import videoIcon from "../assets/video.png";
import journalIcon from "../assets/journal.png";
import goals from "../assets/goals.png"; // Using logo as placeholder for goals until goals.png is added

const SelfCareCard = ({ title, description, iconSrc, iconAlt, onClick, isEarthy }) => (
  <div
    className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
      isEarthy
        ? "bg-gradient-to-br from-cream-100 to-tan-50 border-2 border-tan-300"
        : "bg-[#DFD2D5] border-2 border-[#8090B0]"
    }`}
    onClick={onClick}
  >
    {/* Decorative background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZhMSAxIDAgMCAxIDAtMmg2YTEgMSAwIDAgMSAwIDJ6bS0xMiAwSDhhMSAxIDAgMCAxIDAtMmgxNmExIDEgMCAwIDEgMCAyek0zNiAxOGgtNmExIDEgMCAwIDEgMC0yaDZhMSAxIDAgMCAxIDAgem0tMTIgMEg4YTEgMSAwIDAgMSAwLTJoMTZhMSAxIDAgMCAxIDAgem0xMiAyNGg2YTEgMSAwIDAgMSAwIDJoLTZhMSAxIDAgMCAxIDAtMnptLTEyIDBoMTZhMSAxIDAgMCAxIDAgMkg4YTEgMSAwIDAgMSAwLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    </div>

    <div className="relative p-6 flex flex-col h-full">
      {/* Icon Image */}
      <div className="mb-4 flex justify-center">
        <img
          src={iconSrc}
          alt={iconAlt}
          className="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h2
          className={`mb-3 text-2xl font-bold transition-colors text-center ${
            isEarthy
              ? "text-brown-800 group-hover:text-rust-600"
              : "text-gray-900 group-hover:text-[#c7b4e2]"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mb-4 text-sm leading-relaxed text-center ${
            isEarthy ? "text-brown-600" : "text-gray-700"
          }`}
        >
          {description}
        </p>
      </div>

      {/* Button */}
      <div className="mt-auto">
        <button
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            isEarthy
              ? "bg-rust-500 hover:bg-rust-600 text-white"
              : "bg-[#c7b4e2] hover:bg-[#b49fd3] text-gray-900"
          } shadow-md hover:shadow-lg transform hover:scale-105`}
        >
          Explore →
        </button>
      </div>

      {/* Hover effect overlay */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-20 ${
          isEarthy ? "bg-rust-400" : "bg-[#c7b4e2]"
        }`}
        style={{ transform: "translate(50%, -50%)" }}
      ></div>
    </div>
  </div>
);

export const SelfCare = () => {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();

  const selfCareFeatures = [
    {
      title: "Breathing Exercises",
      description: "Find your calm with guided breathing techniques designed to reduce stress and anxiety in moments.",
      iconSrc: breathingIcon,
      iconAlt: "Breathing exercises icon",
      path: "/breathing",
    },
    {
      title: "Guided Videos",
      description: "Access professionally curated meditation and mindfulness videos to support your mental wellness journey.",
      iconSrc: videoIcon,
      iconAlt: "Guided videos icon",
      path: "/guide-videos",
    },
    {
      title: "Journal Entries",
      description: "Express yourself freely in a private space. Track your thoughts, emotions, and personal growth over time.",
      iconSrc: journalIcon,
      iconAlt: "Journal entries icon",
      path: "/journal",
    },
    {
      title: "Goals",
      description: "Set, organize, and achieve your therapy goals. Visualize your progress with an interactive goal board.",
      iconSrc: goals,
      iconAlt: "Goals icon",
      path: "/goals",
    },
  ];

  return (
    <>
      <UntiltNavBar />

      <div
        className={`min-h-screen px-4 pt-24 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-[#373E4F]"
        }`}
      >
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <h1
            className={`text-5xl font-bold mb-4 ${
              isEarthy ? "text-brown-800" : "text-white"
            }`}
          >
            Your Self-Care Toolkit
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isEarthy ? "text-brown-600" : "text-purple-200"
            }`}
          >
            Discover personalized tools and resources to support your mental wellness journey. 
            Take the first step towards a healthier, happier you.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {selfCareFeatures.map((feature, index) => (
              <SelfCareCard
                key={index}
                title={feature.title}
                description={feature.description}
                iconSrc={feature.iconSrc}
                iconAlt={feature.iconAlt}
                onClick={() => navigate(feature.path)}
                isEarthy={isEarthy}
              />
            ))}
          </div>
        </div>
        

        {/* Bottom CTA Section
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div
            className={`p-8 rounded-2xl shadow-lg ${
              isEarthy
                ? "bg-gradient-to-r from-terracotta-200 to-tan-200 border-2 border-tan-400"
                : "bg-gradient-to-r from-pale-lavender to-white border-2 border-cool-grey"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-3 ${
                isEarthy ? "text-brown-800" : "text-charcoal-grey"
              }`}
            >
              Need Additional Support?
            </h3>
            <p
              className={`mb-6 ${
                isEarthy ? "text-brown-700" : "text-slate-blue"
              }`}
            >
              Connect with licensed therapists, join supportive communities, or explore AI-powered resources.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                isEarthy
                  ? "bg-rust-500 hover:bg-rust-600 text-white"
                  : "bg-slate-blue hover:bg-charcoal-grey text-white"
              }`}
            >
              Explore More Resources
            </button>
          </div>
        </div> 
        */}
            
      </div>
    </>
  );
};
