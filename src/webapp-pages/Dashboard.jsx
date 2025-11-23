/**
 * ========================================
 * DASHBOARD PAGE
 * ========================================
 * 
 * Purpose:
 * Main user dashboard displaying personalized wellness overview and tools.
 * Shows welcome message, mood tracking interface, and usage statistics.
 * 
 * Features:
 * - Personalized greeting with user's name
 * - MoodTracker: Interactive mood logging and visualization
 * - StatTracker: Dashboard analytics and mood history charts
 * - Responsive grid layout (1 column mobile, 2 columns desktop)
 * - Theme-aware styling (Earthy vs Cool themes)
 * 
 * Components Used:
 * - UntiltNavBar: Navigation bar with user menu
 * - MoodTracker: Mood selection and history component
 * - StatTracker: Statistics visualization component
 * 
 * State Management:
 * - moodHistory: Array of mood entries with timestamp
 * - Each entry: { id, mood, timestamp }
 * - Passed down to both MoodTracker and StatTracker
 * 
 * User Data:
 * - user: Firebase auth user object
 * - profile: User profile from Firestore (firstName, lastName)
 * - loading: Loading state for user data
 * 
 * Layout:
 * - Fixed navbar with pt-32 to account for navbar height
 * - 2-column grid on large screens (lg:grid-cols-2)
 * - Full width on mobile (grid-cols-1)
 * - Max width container for content (max-w-4xl)
 * 
 * Theme Support:
 * - Earthy: Cream backgrounds, brown text, tan accents
 * - Cool: Charcoal grey background, lavender card backgrounds
 */

import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import MoodTracker from "./dashboard-features/moodtracker";
import StatTracker from "./dashboard-features/StatTracker";

export default function Dashboard() {
  const { user, profile, loading } = UserAuth();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const [moodHistory, setMoodHistory] = useState([
    { id: 1, mood: "neutral", timestamp: new Date(Date.now() - 86400000 * 2) },
    { id: 2, mood: "very happy", timestamp: new Date(Date.now() - 86400000 * 1) },
  ]);

  return (
    <>
      <title>Dashboard - Tilted | Mental Wellness</title>
      <UntiltNavBar />

      {/* push content down from fixed navbar */}
      <div
        className={`min-h-screen pt-32 ${
          isEarthy ? "bg-cream-100" : "bg-[#373E4F]"
        }`}
      >
        <div className="max-w-4xl px-4 mx-auto text-center">
          <div className="mb-8">
            <div
              className={`rounded-lg shadow-md p-6 ${
                isEarthy
                  ? "bg-cream-200 text-brown-800"
                  : "bg-[#DFD2D5] text-gray-900"
              }`}
            >
              <p className="mb-2 text-2xl font-semibold">
                Welcome{", "}
                {profile?.firstName
                  ? `${profile.firstName}${profile.lastName ? " " + profile.lastName : ""}`
                  : user?.displayName || "there"}
                {"!"}
              </p>
              <p className="text-lg opacity-80">
                Explore your wellness tools and resources
              </p>
            </div>
          </div>
          <div className = "grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
            <div>
          <MoodTracker 
            moodHistory={moodHistory}
            setMoodHistory={setMoodHistory}
          />
        </div>
        <div className = "h-full">
          <StatTracker moodHistory={moodHistory} />
        </div>
      </div>
    </div>
  </div>
    </>
  );
}
