import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import MoodTracker from "./dashboard-features/moodtracker";

export default function Dashboard() {
  const { user, profile, loading } = UserAuth();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

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
          <MoodTracker />
        </div>
      </div>
    </>
  );
}
