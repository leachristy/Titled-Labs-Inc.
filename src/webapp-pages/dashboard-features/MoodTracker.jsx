import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { UserAuth } from "../../contexts/AuthContext";

export default function MoodTracker() {
  const { user } = UserAuth();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const presetEmotions = ["very sad", "sad", "neutral", "happy", "very happy"];

  const [selectedMood, setSelectedMood] = useState("");
  const [customMood, setCustomMood] = useState("");
  const [description, setDescription] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);

  const bgPage = isEarthy ? "bg-cream-100" : "bg-charcoal-grey";
  const cardBase = isEarthy
    ? "bg-linear-to-br from-cream-100 to-tan-50 border-tan-300 text-brown-800"
    : "bg-pale-lavender border-blue-grey text-gray-900";

  const inputBase = isEarthy
    ? "border-brown-300 bg-cream-50 focus:border-rust-500"
    : "border-gray-400 bg-white focus:border-medium-lavender";

  // Self-care tips
  function getSelfCareTips(mood) {
    const tips = {
      "very sad": ["Talk to someone you trust", "Guided meditation", "Warm blanket + calming music"],
      sad: ["Go for a short walk", "Write down your thoughts"],
      neutral: ["Do a small creative activity", "Stretch for 5 minutes"],
      happy: ["Celebrate a small win", "Share positivity with a friend"],
      "very happy": ["Document what made you happy", "Do something kind for someone else"],
    };
    return tips[mood] || ["Take a deep breath", "Practice self-compassion"];
  }

  // Handle submit
  function handleSubmit(e) {
    e.preventDefault();
    const moodToSave = customMood || selectedMood;
    if (!moodToSave) return;

    const newEntry = {
      id: Date.now(),
      mood: moodToSave,
      description: description || "",
      timestamp: new Date(),
    };

    setMoodHistory((prev) => [newEntry, ...prev]);
    setSelectedMood("");
    setCustomMood("");
    setDescription("");
  }

  return (
    <div className={`min-h-screen px-4  pb-12 ${bgPage}`}>
      <div className="max-w-3xl mx-auto">
        {/* Mood Check-in Card */}
        <div
          className={`
            group relative overflow-hidden rounded-2xl shadow-lg p-6 mb-10 border-2 transition-all duration-300
            ${cardBase}
          `}
        >
          <h2 className="text-3xl font-bold mb-4 text-center">
            Daily Mood Check-In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <p className="mb-2 font-semibold">How are you feeling today?</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {presetEmotions.map((emotion) => (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => {
                      setSelectedMood(emotion);
                      setCustomMood("");
                    }}
                    className={`
                      p-3 rounded-xl border text-sm capitalize font-medium transition-all
                      ${
                        selectedMood === emotion
                          ? isEarthy
                            ? "bg-rust-500 text-white border-rust-600 shadow-md"
                            : "bg-medium-lavender text-gray-900 border-light-lavender shadow-md"
                          : "border-gray-300 opacity-80 hover:opacity-100 hover:shadow"
                      }
                    `}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Custom Mood (optional)
              </label>
              <input
                type="text"
                value={customMood}
                onChange={(e) => {
                  setCustomMood(e.target.value);
                  setSelectedMood("");
                }}
                className={`w-full p-3 rounded-lg border ${inputBase}`}
                placeholder="e.g., anxious, excited, stressed..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Brief description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-3 rounded-lg border ${inputBase}`}
                rows={3}
                placeholder="Describe your mood..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`
                w-full py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg hover:scale-[1.02]
                ${
                  isEarthy
                    ? "bg-rust-500 hover:bg-rust-600 text-white"
                    : "bg-light-lavender hover:bg-medium-lavender text-gray-900"
                }
              `}
            >
              Check In
            </button>
          </form>
          <div
            className={`
              absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition
              ${isEarthy ? "bg-rust-400" : "bg-light-lavender"}
            `}
            style={{ transform: "translate(50%, -50%)" }}
          ></div>
        </div>

        {/* Mood History Card */}
        <div
          className={`
            rounded-2xl shadow-lg p-6 border-2 mb-6 ${cardBase}
          `}
        >
          <h3 className="text-2xl font-bold mb-4">Your Recent Check-Ins</h3>

          {moodHistory.length === 0 ? (
            <p className="opacity-70">No entries yet. Start by checking in!</p>
          ) : (
            <ul className="space-y-5">
              {moodHistory.map((entry) => (
                <li key={entry.id} className="pb-3 border-b border-opacity-40">
                  <p className="capitalize font-bold text-lg">{entry.mood}</p>
                  {entry.description && (
                    <p className="opacity-80">{entry.description}</p>
                  )}
                  <p className="text-sm opacity-60 mt-1">
                    {entry.timestamp.toLocaleString()}
                  </p>
                  <div className="mt-3 pl-4 border-l-2 border-opacity-40">
                    <p className="font-semibold text-sm mb-1">
                      Recommended Self-Care:
                    </p>
                    <ul className="list-disc pl-5 text-sm opacity-90">
                      {getSelfCareTips(entry.mood).map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
