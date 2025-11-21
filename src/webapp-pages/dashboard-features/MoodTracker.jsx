import { useState, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { UserAuth } from "../../contexts/AuthContext";

function getTodayKey() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function dayDiff(aStr, bStr) {
  const a = new Date(aStr);
  const b = new Date(bStr);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((a - b) / msPerDay);
}

function getLastNDays(n) {
  const days = [];
  const today = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const key = `${yyyy}-${mm}-${dd}`;

    const shortWeekday = d
      .toLocaleDateString(undefined, { weekday: "short" })
      .slice(0, 2);

    days.push({
      key,
      label: shortWeekday,
      dayNumber: d.getDate(),
      isToday: i === 0,
    });
  }

  return days;
}

export default function MoodDailyCheckIn() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const presetEmotions = ["very sad", "sad", "neutral", "happy", "very happy"];

  const [selectedMood, setSelectedMood] = useState("");
  const [customMood, setCustomMood] = useState("");
  const [description, setDescription] = useState("");

  const [moodHistory, setMoodHistory] = useState([]);

  const [streak, setStreak] = useState(0);
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  const [checkedDates, setCheckedDates] = useState([]);

  const todayKey = getTodayKey();
  const hasCheckedToday = checkedDates.includes(todayKey);

  const displayStreak = useMemo(() => {
    if (!lastCheckInDate) return 0;
    const diff = dayDiff(todayKey, lastCheckInDate);
    if (diff > 1) return 0;
    return streak;
  }, [streak, lastCheckInDate, todayKey]);

  function handleSubmit() {
    const moodToSave = customMood || selectedMood;
    if (!moodToSave) return alert("Please select a mood for today!");

    let newStreak = 1;

    if (lastCheckInDate) {
      const diff = dayDiff(todayKey, lastCheckInDate);
      if (diff === 1) newStreak = displayStreak + 1;
      else if (diff > 1) newStreak = 1;
    }

    setStreak(newStreak);
    setLastCheckInDate(todayKey);

    setCheckedDates((prev) =>
      prev.includes(todayKey) ? prev : [...prev, todayKey]
    );

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

  // ---- UI styling ----
  const cardBase = isEarthy
    ? "bg-linear-to-br from-cream-100 to-tan-50 border-tan-300 text-brown-800"
    : "bg-pale-lavender border-blue-grey text-gray-900";

  const inputBase = isEarthy
    ? "border-brown-300 bg-cream-50 focus:border-rust-500"
    : "border-gray-400 bg-white focus:border-medium-lavender";

  const checkInButtonClasses = isEarthy
    ? "bg-rust-500 hover:bg-rust-600 text-white"
    : "bg-light-lavender hover:bg-medium-lavender text-gray-900";

  const calendarDotFilled = isEarthy
    ? "bg-emerald-600 border-emerald-700"
    : "bg-medium-lavender border-light-lavender";

  const calendarDotEmpty = isEarthy
    ? "bg-cream-100 border-brown-200"
    : "bg-white border-blue-grey";

  const days = getLastNDays(7);

  // ---- self-care tips ----
  const getSelfCareTips = (mood) => {
    const tips = {
      "very sad": ["Talk to someone you trust", "Guided meditation"],
      sad: ["Go for a short walk", "Write down your thoughts"],
      neutral: ["Do something creative", "Stretch for 5 minutes"],
      happy: ["Celebrate a small win", "Share positivity"],
      "very happy": ["Document what made you happy", "Do something kind"],
    };
    return tips[mood] || ["Take a deep breath", "Practice self-compassion"];
  };

  return (
    <div className="pb-12">
      {/* Unified Daily Check-in + Mood Tracker */}
      <div className={`rounded-2xl shadow-lg p-6 border-2 ${cardBase}`}>
        <h2 className="text-3xl font-bold mb-4 text-center">
          Today's Check-In
        </h2>

        {/* Mood selection */}
        <p className="font-semibold mb-2">What mood are you in today?</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {presetEmotions.map((emotion) => (
            <button
              key={emotion}
              type="button"
              onClick={() => {
                setSelectedMood(emotion);
                setCustomMood("");
              }}
              className={`
                p-3 rounded-xl border text-sm capitalize font-medium 
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

        <input
          className={`w-full p-3 rounded-lg border mb-4 ${inputBase}`}
          placeholder="Custom mood (optional)"
          value={customMood}
          onChange={(e) => {
            setCustomMood(e.target.value);
            setSelectedMood("");
          }}
        />

        <textarea
          className={`w-full p-3 rounded-lg border mb-4 ${inputBase}`}
          rows={3}
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={hasCheckedToday}
          className={`
            w-full py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg 
            disabled:opacity-60 
            ${checkInButtonClasses}
          `}
        >
          {hasCheckedToday ? "You've checked in today!" : "Submit Today's Check-In"}
        </button>

        {/* Mini calendar */}
        <div className="mt-6">
          <p className="text-xs font-semibold mb-2 opacity-80">
            Last 7 Days
          </p>
          <div className="flex justify-between">
            {days.map((d) => (
              <div key={d.key} className="flex flex-col items-center text-[10px]">
                <span className="opacity-70">{d.label}</span>
                <div
                  className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center text-[10px]
                    ${
                      checkedDates.includes(d.key)
                        ? calendarDotFilled
                        : calendarDotEmpty
                    }
                  `}
                >
                  {d.dayNumber}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood History */}
      <div className={`rounded-2xl shadow-lg p-6 border-2 mt-8 ${cardBase}`}>
        <h3 className="text-2xl font-bold mb-4">Recent Mood Entries</h3>

        {moodHistory.length === 0 ? (
          <p className="opacity-70">No entries yet.</p>
        ) : (
          <ul className="space-y-5">
            {moodHistory.map((entry) => (
              <li key={entry.id} className="pb-4 border-b">
                <p className="font-bold capitalize">{entry.mood}</p>
                {entry.description && <p>{entry.description}</p>}
                <p className="text-sm opacity-60">
                  {entry.timestamp.toLocaleString()}
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  {getSelfCareTips(entry.mood).map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
