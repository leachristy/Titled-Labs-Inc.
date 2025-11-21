import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../contexts/ThemeContext";

export default function StatTracker({ moodHistory = [] }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const [chartType, setChartType] = useState("line");

  const chartData = useMemo(() => {
    const sortedHistory = [...moodHistory].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    return sortedHistory.map((entry) => {
      let score = 3;
      switch (entry.mood) {
        case "very sad": score = 1; break;
        case "sad": score = 2; break;
        case "neutral": score = 3; break;
        case "happy": score = 4; break;
        case "very happy": score = 5; break;
        default: score = 3;
      }

      return {
        date: new Date(entry.timestamp).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        score: score,
        mood: entry.mood,
        description: entry.description,
      };
    });
  }, [moodHistory]);

  const cardBase = isEarthy
    ? "bg-linear-to-br from-cream-100 to-tan-50 border-tan-300 text-brown-800"
    : "bg-pale-lavender border-blue-grey text-gray-900";

  const chartColor = isEarthy ? "#C05621" : "#7C3AED";
  const gridColor = isEarthy ? "#E2E8F0" : "#CBD5E1";

  const toggleBtnClass = (isActive) =>
    `px-3 py-1 rounded text-sm transition-colors ${
      isActive
        ? isEarthy
          ? "bg-rust-500 text-white"
          : "bg-slate-blue text-white"
        : "bg-transparent border opacity-70 hover:opacity-100"
    }`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2 border rounded shadow-md text-sm ${
            isEarthy ? "bg-cream-50 border-tan-300" : "bg-white border-blue-grey"
          }`}
        >
          <p className="font-bold">{label}</p>
          <p className="capitalize">Mood: {payload[0].payload.mood}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 border-2 h-full ${cardBase}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Wellness Trends</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("line")}
            className={toggleBtnClass(chartType === "line")}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={toggleBtnClass(chartType === "bar")}
          >
            Bar
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center opacity-60">
          <p>Check in to see your stats!</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                <YAxis
                  domain={[0, 6]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(val) => {
                    if (val === 1) return "☹️";
                    if (val === 3) return "😐";
                    if (val === 5) return "😄";
                    return "";
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={chartColor}
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                <YAxis
                  domain={[0, 6]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(val) => {
                     if (val === 1) return "Vs";
                     if (val === 5) return "Vh";
                     return val;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill={chartColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}