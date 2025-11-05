import { useTheme } from "../../contexts/ThemeContext";

export default function CommunityGroupsMockup({ groups }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const getGroupColor = (colorType) => {
    const colorMap = {
      earthy: {
        primary: "bg-rust-500",
        secondary: "bg-terracotta-400",
        tertiary: "bg-tan-300"
      },
      cool: {
        primary: "bg-slate-blue",
        secondary: "bg-blue-grey",
        tertiary: "bg-cool-grey"
      }
    };
    return colorMap[isEarthy ? "earthy" : "cool"][colorType];
  };

  return (
    <div className={isEarthy ? "visual-frame" : "visual-frame-new"}>
      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className={`mock-group-item ${
              isEarthy
                ? ""
                : "flex items-center gap-4 p-4 bg-white rounded-lg border border-cool-grey hover:border-blue-grey transition-colors"
            }`}
          >
            <div
              className={`mock-group-avatar ${
                isEarthy
                  ? getGroupColor(group.color)
                  : `w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${getGroupColor(group.color)}`
              }`}
            >
              {group.avatar}
            </div>
            <div className="flex-1">
              <div
                className={`mock-group-title ${
                  isEarthy ? "" : "font-semibold text-charcoal-grey"
                }`}
              >
                {group.name}
              </div>
              <div
                className={`mock-group-members ${
                  isEarthy ? "" : "text-sm text-slate-blue"
                }`}
              >
                {group.members.toLocaleString()} members • {group.activeNow} active now
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
