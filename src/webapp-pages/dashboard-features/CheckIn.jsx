import { useState, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ACHIEVEMENTS } from "../../data/achievements";

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

export default function DailyCheckIn() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const [streak, setStreak] = useState(0);
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  const [checkedDates, setCheckedDates] = useState([]); // array of YYYY-MM-DD

  const todayKey = getTodayKey();
  const today = new Date();
  const weekdayName = today.toLocaleDateString(undefined, {
    weekday: "long",
  });

  const hasCheckedToday = checkedDates.includes(todayKey);

  // Display streak: 0 if user missed a day since last check-in
  const displayStreak = useMemo(() => {
    if (!lastCheckInDate) return 0;
    const diff = dayDiff(todayKey, lastCheckInDate);
    if (diff > 1) return 0;
    return streak;
  }, [streak, lastCheckInDate, todayKey]);

  function handleCheckIn() {
    if (hasCheckedToday) 
      return;

    unlockAchievement(ACHIEVEMENTS.CHECKIN_ROOKIE.id);

    let newStreak = 1;

    if (lastCheckInDate) {
      const diff = dayDiff(todayKey, lastCheckInDate);

      if (diff === 1) {
        newStreak = displayStreak + 1;
      } else if (diff === 0) {
        return;
      } else {
        // missed at least one day -> reset to 1
        newStreak = 1;
      }
    }

    setStreak(newStreak);
    setLastCheckInDate(todayKey);

    setCheckedDates((prev) => {
      if (prev.includes(todayKey)) return prev;
      const updated = [...prev, todayKey];
      return updated;
    });
  }

  const days = getLastNDays(7);

  const cardBase = isEarthy
    ? "bg-linear-to-br from-cream-100 to-tan-50 border-tan-300 text-brown-800"
    : "bg-pale-lavender border-blue-grey text-gray-900";

  const streakBadgeClasses = isEarthy
    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
    : "bg-light-lavender text-[#373E4F] border-[#B290A4]";

  const checkInButtonClasses = isEarthy
    ? "bg-rust-500 hover:bg-rust-600 text-white"
    : "bg-light-lavender hover:bg-medium-lavender text-gray-900";

  const calendarDotFilled = isEarthy
    ? "bg-emerald-600 border-emerald-700"
    : "bg-medium-lavender border-light-lavender";

  const calendarDotEmpty = isEarthy
    ? "bg-cream-100 border-brown-200"
    : "bg-white border-blue-grey";

  return (
    <div
      className={`
        rounded-2xl shadow-lg p-5 border-2 ${cardBase}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm opacity-80">Daily Check-In</p>
          <h4 className="text-xl font-bold">
            Happy {weekdayName}!
          </h4>
        </div>

        <div
          className={`
            px-3 py-1 rounded-full text-xs font-semibold border ${streakBadgeClasses}
          `}
        >
          Streak: {displayStreak} day{displayStreak === 1 ? "" : "s"}
        </div>
      </div>

      <p className="text-sm mb-4 opacity-85">
        Tap the button below to mark today and keep your streak going. If you
        miss a day, your streak resets to 0.
      </p>

      <button
        type="button"
        onClick={handleCheckIn}
        disabled={hasCheckedToday}
        className={`
          w-full py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.02]
          disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-md
          ${checkInButtonClasses}
        `}
      >
        {hasCheckedToday ? "You’ve checked in today" : "Check In for Today"}
      </button>

      {/* Mini calendar strip */}
      <div className="mt-5">
        <p className="text-xs font-semibold mb-2 opacity-80">
          Last 7 days
        </p>
        <div className="flex justify-between gap-2">
          {days.map((d) => {
            const checked = checkedDates.includes(d.key);
            const isToday = d.isToday;
            return (
              <div
                key={d.key}
                className="flex flex-col items-center text-[10px] sm:text-xs"
              >
                <span className="opacity-70">{d.label}</span>
                <div
                  className={`
                    mt-1 w-6 h-6 rounded-full border flex items-center justify-center text-[10px]
                    ${
                      checked ? calendarDotFilled : calendarDotEmpty
                    }
                    ${isToday ? "ring-2 ring-offset-2 ring-emerald-400" : ""}
                  `}
                >
                  {d.dayNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
