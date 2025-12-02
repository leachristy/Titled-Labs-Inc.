/**
 * ========================================
 * DASHBOARD PAGE
 * ========================================
 * 
 * Purpose:
 * Main user dashboard displaying personalized wellness overview and tools.
 * Shows welcome message, mood tracking interface, statistics, and quick actions.
 * 
 * Features:
 * - Personalized greeting with user's name and current date
 * - MoodTracker: Interactive mood logging and visualization
 * - StatTracker: Dashboard analytics and mood history charts
 * - QuickActions: Fast access to key wellness tools
 * - WellnessTip: Daily motivational tips
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
 * - Each entry: { id, mood, timestamp, description }
 * - Passed down to both MoodTracker and StatTracker
 * 
 * User Data:
 * - user: Firebase auth user object
 * - profile: User profile from Firestore (firstName, lastName)
 * - loading: Loading state for user data
 * 
 * Layout:
 * - Fixed navbar with pt-24 to account for navbar height
 * - Organized sections: Header, Quick Actions, Mood Tracking, Stats, Tips
 * - Max width container for content (max-w-7xl)
 * 
 * Theme Support:
 * - Earthy: Cream backgrounds, brown text, tan accents
 * - Cool: Charcoal grey background, lavender card backgrounds
 */

import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import MoodTracker from "./dashboard-features/MoodTracker";
import StatTracker from "./dashboard-features/StatTracker";

export default function Dashboard() {
  // Get user authentication state and profile data
  const { user, profile, loading } = UserAuth();
  
  // Get current theme state
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();

  const [moodHistory, setMoodHistory] = useState([
    { id: 1, mood: "neutral", timestamp: new Date(Date.now() - 86400000 * 2) },
    { id: 2, mood: "very happy", timestamp: new Date(Date.now() - 86400000 * 1) },
  ]);

  // Get current date info
  const today = new Date();
  const dateString = today.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Wellness tips that rotate
  const wellnessTips = [
    "Take a 5-minute break to breathe deeply and center yourself.",
    "Drink a glass of water - hydration supports mental clarity.",
    "Reach out to someone you care about today.",
    "Practice gratitude - write down three things you're thankful for.",
    "Take a short walk outside to reset your mind.",
    "Remember: progress, not perfection.",
    "Your feelings are valid. It's okay to not be okay sometimes."
  ];

  const tipOfTheDay = wellnessTips[today.getDate() % wellnessTips.length];

  // Quick action cards with SVG icons
  const quickActions = [
    {
      title: "Journal",
      description: "Express your thoughts",
      iconSvg: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      path: "/journal",
      color: isEarthy ? "bg-amber-100 hover:bg-amber-200 text-amber-800" : "bg-purple-100 hover:bg-purple-200 text-purple-800"
    },
    {
      title: "Goals",
      description: "Track your progress",
      iconSvg: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      path: "/goals",
      color: isEarthy ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800" : "bg-blue-100 hover:bg-blue-200 text-blue-800"
    },
    {
      title: "Breathe",
      description: "Calm your mind",
      iconSvg: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: "/breathing",
      color: isEarthy ? "bg-sky-100 hover:bg-sky-200 text-sky-800" : "bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
    },
    {
      title: "Community",
      description: "Connect with others",
      iconSvg: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: "/community",
      color: isEarthy ? "bg-rose-100 hover:bg-rose-200 text-rose-800" : "bg-pink-100 hover:bg-pink-200 text-pink-800"
    }
  ];

  // Calculate mood stats
  const moodStats = {
    totalEntries: moodHistory.length,
    thisWeek: moodHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 86400000);
      return entryDate >= weekAgo;
    }).length,
    mostCommonMood: moodHistory.length > 0 
      ? moodHistory.reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {})
      : {}
  };

  const dominantMood = Object.keys(moodStats.mostCommonMood).length > 0
    ? Object.entries(moodStats.mostCommonMood).sort((a, b) => b[1] - a[1])[0][0]
    : "neutral";

  return (
    <>
      {/* Page title for browser tab */}
      <title>Dashboard - Tilted | Mental Wellness</title>
      
      {/* Application navigation bar */}
      <UntiltNavBar />

      {/* Main Container */}
      <div
        className={`min-h-screen pt-24 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-[#373E4F]"
        }`}
      >
        <div className="max-w-7xl px-4 mx-auto">
          
          {/* Header Section */}
          <div className="mb-8">
            {/* Welcome Card with personalized greeting */}
            <div
              className={`rounded-2xl shadow-lg p-6 ${
                isEarthy
                  ? "bg-cream-200 text-brown-800 border-2 border-tan-300"
                  : "bg-[#DFD2D5] text-gray-900 border-2 border-blue-grey"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-3xl font-bold mb-2">
                    Welcome back, {profile?.firstName || user?.displayName || "there"}!
                  </p>
                  <p className="text-lg opacity-80">
                    {dateString}
                  </p>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-4 md:mt-0 flex gap-4">
                  <div className={`px-4 py-2 rounded-lg ${isEarthy ? "bg-cream-100" : "bg-white/50"}`}>
                    <p className="text-xs opacity-70">Check-ins</p>
                    <p className="text-2xl font-bold">{moodStats.totalEntries}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${isEarthy ? "bg-cream-100" : "bg-white/50"}`}>
                    <p className="text-xs opacity-70">This Week</p>
                    <p className="text-2xl font-bold">{moodStats.thisWeek}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wellness Tip Banner */}
          <div className="mb-8">
            <div
              className={`rounded-xl shadow-md p-4 border-l-4 ${
                isEarthy
                  ? "bg-amber-50 border-rust-500 text-brown-800"
                  : "bg-light-lavender/30 border-medium-lavender text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-sm opacity-80">Wellness Tip of the Day</p>
                  <p className="text-base">{tipOfTheDay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isEarthy ? "text-brown-800" : "text-white"}`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${action.color}`}
                >
                  <div className="mb-3 flex justify-center">{action.iconSvg}</div>
                  <p className="font-bold text-base mb-1">{action.title}</p>
                  <p className="text-xs opacity-80">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Grid - Mood Tracker & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <MoodTracker 
                moodHistory={moodHistory}
                setMoodHistory={setMoodHistory}
              />
            </div>
            <div className="flex flex-col gap-8">
              <StatTracker moodHistory={moodHistory} />
              
              {/* Wellness Insights Card */}
              <div
                className={`rounded-2xl shadow-lg p-6 border-2 ${
                  isEarthy
                    ? "bg-linear-to-br from-cream-100 to-tan-50 border-tan-300 text-brown-800"
                    : "bg-pale-lavender border-blue-grey text-gray-900"
                }`}
              >
                <h3 className="text-xl font-bold mb-4">Wellness Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isEarthy ? "bg-emerald-100" : "bg-green-100"}`}>
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Consistency is key</p>
                      <p className="text-xs opacity-70">Track your mood daily for better insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isEarthy ? "bg-sky-100" : "bg-blue-100"}`}>
                      <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">You're doing great!</p>
                      <p className="text-xs opacity-70">{moodStats.thisWeek} check-ins this week</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isEarthy ? "bg-purple-100" : "bg-indigo-100"}`}>
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Self-care matters</p>
                      <p className="text-xs opacity-70">Take time for yourself today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div
            className={`rounded-2xl shadow-lg p-6 border-2 ${
              isEarthy
                ? "bg-cream-200 text-brown-800 border-tan-300"
                : "bg-pale-lavender text-gray-900 border-blue-grey"
            }`}
          >
            <h3 className="text-xl font-bold mb-4">Your Wellness Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isEarthy ? "bg-cream-100" : "bg-white/50"}`}>
                <p className="text-sm opacity-70 mb-1">Most Common Mood</p>
                <p className="text-xl font-bold capitalize">{dominantMood}</p>
              </div>
              <div className={`p-4 rounded-lg ${isEarthy ? "bg-cream-100" : "bg-white/50"}`}>
                <p className="text-sm opacity-70 mb-1">Total Check-ins</p>
                <p className="text-xl font-bold">{moodStats.totalEntries} entries</p>
              </div>
              <div className={`p-4 rounded-lg ${isEarthy ? "bg-cream-100" : "bg-white/50"}`}>
                <p className="text-sm opacity-70 mb-1">Weekly Activity</p>
                <p className="text-xl font-bold">{moodStats.thisWeek} this week</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
