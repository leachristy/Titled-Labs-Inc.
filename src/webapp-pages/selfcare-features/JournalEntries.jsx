import React from "react";
import UntiltNavBar from "../../components/UntiltNavBar";
import { useTheme } from "../../contexts/ThemeContext";

export default function JournalEntries() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen px-4 pt-24 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
        style={{ backgroundColor: isEarthy ? undefined : "var(--pale-lavender)" }}
      >
        <h1 className={`text-3xl font-bold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
          Journal Entries
        </h1>
        {/* Add your journal content here */}
        <p className="mt-4">Here is where users can view and add journal entries.</p>
      </div>
    </>
  );
};
