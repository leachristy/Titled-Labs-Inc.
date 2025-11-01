import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import UntiltNavBar from "../components/UntiltNavBar";

export default function Dashboard() {
  const { user, profile } = UserAuth();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

<<<<<<< Updated upstream
=======
  // Show loading state while checking authentication
  if (loading) {
    return (
      <>
        <title>Dashboard - Tilted | Mental Wellness</title>
        <UntiltNavBar />
        <div
          className={`min-h-screen pt-32 flex items-center justify-center ${
            isEarthy ? "bg-cream-100" : "bg-[#373E4F]"
          }`}
        >
          <div className="text-center">
            <div
              className={`inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${
                isEarthy ? "border-rust-500" : "border-[#c7b4e2]"
              }`}
            ></div>
            <p
              className={`mt-4 text-lg font-medium ${
                isEarthy ? "text-brown-800" : "text-white"
              }`}
            >
              Loading...
            </p>
          </div>
        </div>
      </>
    );
  }

>>>>>>> Stashed changes
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
                {[profile?.firstName, profile?.lastName]
                  .filter(Boolean)
                  .join(" ") || "Guest"}
                {"!"}
              </p>
              <p className="text-lg opacity-80">New features on the way!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
