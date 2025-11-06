/**
 * About Page Component
 * 
 * Displays information about Tilted Lab Inc. and the team members
 * Shows mission statement and team grid with individual profiles
 * 
 * Features:
 * - Company mission and description
 * - Team member cards with photos and bios
 * - Theme-aware styling (earthy/cool)
 * - Responsive grid layout
 */

import { useTheme } from "../contexts/ThemeContext";
import TeamCard from "../components/cards/TeamCard";
import { team } from "../data/team";
import NavBar from "../components/navigation/NavBar";

export default function About() {
  // Get current theme state
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <>
      {/* Page title for browser tab */}
      <title>About - Tilted | Mental Wellness</title>
      
      {/* Navigation bar */}
      <NavBar />
      
      {/* Main content area with theme-aware background */}
      <div
        className={`min-h-screen pt-30 px-20 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Page Header Section */}
          <div className="mb-12 text-center">
            <h1
              className={`text-heading mb-5 ${
                isEarthy ? "text-brown-800" : "text-charcoal-grey"
              }`}
            >
              About Tilted Lab Inc.
            </h1>
            <p
              className={`text-subheading ${
                isEarthy ? "text-brown-700" : "text-slate-blue"
              }`}
            >
              We're dedicated to making mental health care accessible,
              affordable, and effective. Our team of licensed professionals is
              here to support you on your wellness journey.
            </p>
          </div>

          {/* Team Members Grid */}
          {/* Maps through team data array and renders a TeamCard for each member */}
          <div className="grid-team">
            {team.map((m, i) => (
              <TeamCard key={i} {...m} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
