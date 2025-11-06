import { useMessenger } from "../../contexts/MessengerContext";
import { useTheme } from "../../contexts/ThemeContext";
import { UserAuth } from "../../contexts/AuthContext";

export default function MessengerButton() {
  const { isMessengerOpen, setIsMessengerOpen } = useMessenger();
  const { currentTheme } = useTheme();
  const { user } = UserAuth();
  const isEarthy = currentTheme === "earthy";

  // Don't show messenger button if user is not logged in
  if (!user) return null;

  return (
    <button
      onClick={() => setIsMessengerOpen(!isMessengerOpen)}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110 ${
        isEarthy
          ? "bg-amber-700 hover:bg-amber-800"
          : "bg-[#c7b4e2] hover:bg-[#b49fd3]"
      }`}
      aria-label="Open Messenger"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>
  );
}
