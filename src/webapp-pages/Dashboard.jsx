/**
 * Dashboard Page Component
 * 
 * Main landing page after user authentication
 * Displays personalized welcome message and access to wellness tools
 * 
 * Features:
 * - Personalized greeting using user's name from profile or Firebase auth
 * - Theme-aware styling (earthy/cool)
 * - Responsive layout with fixed navbar
 * - Gateway to all wellness features and resources
 */

import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import UntiltNavBar from "../components/navigation/UntiltNavBar";

export default function Dashboard() {
  // Get user authentication state and profile data
  const { user, profile, loading } = UserAuth();
  
  // Get current theme state
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <>
      {/* Page title for browser tab */}
      <title>Dashboard - Tilted | Mental Wellness</title>
      
      {/* Application navigation bar */}
      <UntiltNavBar />

      {/* Main dashboard content with padding to clear fixed navbar */}
      <div
        className={`min-h-screen pt-32 ${
          isEarthy ? "bg-cream-100" : "bg-[#373E4F]"
        }`}
      >
        <div className="max-w-4xl px-4 mx-auto text-center">
          <div className="mb-8">
            {/* Welcome Card with personalized greeting */}
            <div
              className={`rounded-lg shadow-md p-6 ${
                isEarthy
                  ? "bg-cream-200 text-brown-800"
                  : "bg-[#DFD2D5] text-gray-900"
              }`}
            >
              {/* Personalized greeting - prioritizes Firestore profile name, falls back to Firebase displayName */}
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
        </div>
      </div>
    </>
  );
}
