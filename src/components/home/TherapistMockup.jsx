import { useTheme } from "../../contexts/ThemeContext";

export default function TherapistMockup({ data }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <div className={isEarthy ? "visual-frame" : "visual-frame-new"}>
      <div className={isEarthy ? "visual-card" : "visual-card-new"}>
        <div
          className={`mock-portal-header ${
            isEarthy ? "" : "flex items-center gap-4 pb-4 border-b border-cool-grey"
          }`}
        >
          <div
            className={`mock-portal-avatar ${
              isEarthy
                ? "bg-rust-500"
                : "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl bg-slate-blue"
            }`}
          >
            <span>{data.avatar}</span>
          </div>
          <div>
            <div
              className={`mock-portal-title ${
                isEarthy ? "" : "font-semibold text-charcoal-grey"
              }`}
            >
              {data.name}
            </div>
            <div
              className={`mock-portal-subtitle ${
                isEarthy ? "" : "text-sm text-slate-blue"
              }`}
            >
              {data.specialty}
            </div>
          </div>
        </div>
        <div
          className={`mock-portal-items ${isEarthy ? "" : "space-y-3 pt-4"}`}
        >
          {data.sessions.map((session, index) => (
            <div
              key={index}
              className={`mock-portal-item ${
                isEarthy
                  ? ""
                  : "flex justify-between items-center py-2 border-b border-cool-grey"
              }`}
            >
              <span
                className={`text-sm ${
                  isEarthy ? "text-brown-800" : "text-charcoal-grey"
                }`}
              >
                {session.label}
              </span>
              <span
                className={`font-semibold ${
                  session.highlight
                    ? isEarthy
                      ? "text-rust-500"
                      : "text-slate-blue"
                    : isEarthy
                    ? "text-brown-800"
                    : "text-charcoal-grey"
                }`}
              >
                {session.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
