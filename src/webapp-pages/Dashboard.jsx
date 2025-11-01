import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import UntiltNavBar from "../components/UntiltNavBar";

export default function Dashboard() {
  const { user, profile, loading } = UserAuth();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  // Show loading state while checking authentication
  if (loading) {
    return (
      <>
        <title>Dashboard - Tilted | Mental Wellness</title>
        <UntiltNavBar />
        <div
          className={`min-h-screen pt-32 flex items-center justify-center ${
            isEarthy ? "bg-cream-100" : "bg-pale-lavender"
          }`}
          style={{
            backgroundColor: isEarthy ? undefined : "var(--pale-lavender)",
          }}
        >
          <div className="text-center">
            <div
              className={`inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${
                isEarthy ? "border-rust-500" : "border-slate-blue"
              }`}
            ></div>
            <p
              className={`mt-4 text-lg font-medium ${
                isEarthy ? "text-brown-800" : "text-charcoal-grey"
              }`}
            >
              Loading...
            </p>
          </div>
        </div>
      </>
    );
  }

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
