import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import UntiltNavBar from "../components/UntiltNavBar";

export default function Dashboard() {
  const { user } = UserAuth();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <>
      <title>Dashboard - Tilted | Mental Wellness</title>
      <UntiltNavBar />

      {/* push content down from fixed navbar */}
      <div
        className={`min-h-screen pt-32 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
        style={{
          backgroundColor: isEarthy ? undefined : "var(--pale-lavender)",
        }}
      >
        <div className="max-w-4xl px-4 mx-auto text-center">
          <div className="mb-8">
            <div
              className={`rounded-lg shadow-md p-6 ${
                isEarthy
                  ? "bg-cream-200 text-brown-800"
                  : "bg-white text-slate-blue"
              }`}
              style={{
                backgroundColor: isEarthy ? undefined : "var(--white)",
                color: isEarthy ? undefined : "var(--slate-blue)",
              }}
            >
              <p className="mb-2 text-2xl font-semibold">
                Welcome {user?.displayName || "Guest"},
              </p>
              <p className="text-lg opacity-80">new features on the way!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
