import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAchievements } from "../../contexts/AchievementContext";
import { ACHIEVEMENTS } from "../../data/achievements";

const formatDate = (dateInput) => {
  if (!dateInput) return "Date Unknown";
  
  if (dateInput.toDate) return dateInput.toDate().toLocaleDateString();
  return new Date(dateInput).toLocaleDateString();
};

const BadgeGallery = () => {
  const { currentTheme } = useTheme();
  const { unlockedAchievements, achievementStats } = useAchievements();
  const [selectedBadge, setSelectedBadge] = useState(null);

  const isEarthy = currentTheme === "earthy";

  // --- Theme Classes ---
  const modalBg = isEarthy ? "bg-white" : "bg-pale-lavender";
  const textColor = isEarthy ? "text-brown-800" : "text-gray-900";
  const subTextColor = isEarthy ? "text-brown-600" : "text-gray-700";
  const buttonColor = isEarthy 
    ? "bg-rust-500 hover:bg-rust-600 text-white" 
    : "bg-light-lavender hover:bg-medium-lavender text-white";
  const borderColor = isEarthy ? "border-tan-200" : "border-blue-grey";
  
  const cardBgUnlocked = isEarthy ? "bg-white" : "bg-white/80";
  const cardBgLocked = isEarthy ? "bg-tan-50 opacity-60" : "bg-cool-grey opacity-50";

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 justify-items-center">
        {Object.values(ACHIEVEMENTS).map((badge) => {
          const isUnlocked = unlockedAchievements.includes(badge.id);
          const stats = achievementStats[badge.id] || {}; 

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge({ ...badge, ...stats, isUnlocked })}
              className={`
                relative cursor-pointer transform transition p-3 rounded-xl border flex flex-col items-center justify-center w-full aspect-square
                ${borderColor}
                ${isUnlocked ? `${cardBgUnlocked} hover:scale-105 hover:shadow-md` : `${cardBgLocked} grayscale`}
              `}
              title={isUnlocked ? badge.title : "Locked Achievement"}
            >
              <div className="text-4xl sm:text-5xl mb-2 drop-shadow-sm">
                {badge.badge}
              </div>

              <span className={`text-[10px] sm:text-xs font-semibold truncate w-full text-center ${textColor}`}>
                {badge.title}
              </span>
              
              {!isUnlocked && (
                <span className="text-[9px] mt-1 uppercase tracking-widest opacity-60">Locked</span>
              )}
            </div>
          );
        })}
      </div>

      {selectedBadge && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm rounded-xl shadow-2xl p-6 flex flex-col items-center text-center animate-fadeIn ${modalBg}`}
          >
            {!selectedBadge.isUnlocked && (
              <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider text-gray-400 border border-gray-300 px-2 py-1 rounded">
                Locked
              </div>
            )}

            <div className={`text-7xl mb-4 ${!selectedBadge.isUnlocked ? "grayscale opacity-50" : "animate-bounce-slow"}`}>
              {selectedBadge.badge}
            </div>
            
            <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>
              {selectedBadge.title}
            </h3>
            
            <p className={`text-base mb-4 px-4 ${subTextColor}`}>
              {selectedBadge.description}
            </p>

            {/* UPDATED DATE LOGIC */}
            {selectedBadge.isUnlocked && (
              <p className={`text-sm font-medium uppercase tracking-wider mb-6 opacity-80 ${textColor}`}>
                {/* Check if we actually have a date. If not, show generic 'Earned' message */}
                {(selectedBadge.lastUnlocked || selectedBadge.dateEarned) 
                  ? `Earned on: ${formatDate(selectedBadge.lastUnlocked || selectedBadge.dateEarned)}`
                  : "Status: Unlocked"} 
              </p>
            )}

            <button
              onClick={() => setSelectedBadge(null)}
              className={`px-8 py-2.5 rounded-full font-bold shadow-md transition transform hover:scale-105 active:scale-95 ${buttonColor}`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BadgeGallery;