/**
 * ========================================
 * ABOUT PAGE
 * ========================================
 * 
 * Purpose:
 * Displays information about Tilted Lab Inc. and introduces the team members.
 * Showcases the company's mission to make mental health care accessible,
 * affordable, and effective through licensed professionals.
 * 
 * Features:
 * - Company mission statement and description
 * - Grid display of team members with photos and roles
 * - Theme-aware styling (Earthy vs Cool themes)
 * - Responsive layout for all screen sizes
 * 
 * Components Used:
 * - NavBar: Navigation header
 * - TeamCard: Individual team member card with photo, name, role, and bio
 * 
 * Data Sources:
 * - team.js: Array of team member information
 * 
 * Theme Support:
 * - Earthy: Cream background, brown text
 * - Cool: Pale lavender background, charcoal/slate text
 */

import { useTheme } from "../contexts/ThemeContext";
import TeamCard from "../components/cards/TeamCard";
import { team } from "../data/team";
import NavBar from "../components/navigation/NavBar";

export default function About() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <>
      <title>About - Tilted | Mental Wellness</title>
      <NavBar />
      <div
        className={`min-h-screen pt-30 px-20 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
      >
        <div className="max-w-6xl mx-auto">
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
