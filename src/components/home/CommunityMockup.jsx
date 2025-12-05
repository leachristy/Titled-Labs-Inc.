import { useTheme } from "../../contexts/ThemeContext";

export default function CommunityMockup({ data }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const getColorClass = (color) => {
    const colors = {
      primary: isEarthy ? "bg-rust-500" : "bg-light-lavender",
      secondary: isEarthy ? "bg-terracotta-500" : "bg-medium-lavender",
      tertiary: isEarthy ? "bg-brown-600" : "bg-slate-blue",
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className={`rounded-xl shadow-2xl overflow-hidden ${
      isEarthy ? "bg-white border border-tan-200" : "bg-slate-blue border border-blue-grey"
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        isEarthy ? "bg-cream-50 border-tan-200" : "bg-charcoal-grey border-blue-grey"
      }`}>
        <h3 className={`font-semibold text-lg ${isEarthy ? "text-brown-800" : "text-white"}`}>
          Support Groups
        </h3>
        <p className={`text-sm ${isEarthy ? "text-brown-600" : "text-gray-300"}`}>
          Connect with others on similar journeys
        </p>
      </div>

      {/* Community Groups List */}
      <div className={`p-6 space-y-4 ${
        isEarthy ? "bg-white" : "bg-charcoal-grey"
      }`}>
        {data.map((group) => (
          <div
            key={group.id}
            className={`p-4 rounded-lg border transition cursor-pointer hover:shadow-md ${
              isEarthy
                ? "bg-cream-50 border-tan-200 hover:bg-cream-100"
                : "bg-slate-blue border-blue-grey hover:bg-cool-grey"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Group Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                getColorClass(group.color)
              }`}>
                {group.avatar}
              </div>

              {/* Group Info */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold mb-1 ${
                  isEarthy ? "text-brown-800" : "text-white"
                }`}>
                  {group.name}
                </h4>
                <div className="flex items-center gap-4 text-xs">
                  <span className={`flex items-center gap-1 ${
                    isEarthy ? "text-brown-600" : "text-gray-300"
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {group.members.toLocaleString()} members
                  </span>
                  <span className={`flex items-center gap-1 ${
                    isEarthy ? "text-rust-600" : "text-light-lavender"
                  }`}>
                    <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                    {group.activeNow} active now
                  </span>
                </div>
              </div>

              {/* Join Button */}
              <button className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                isEarthy
                  ? "bg-rust-500 text-white hover:bg-rust-600"
                  : "bg-light-lavender text-charcoal-grey hover:bg-medium-lavender"
              }`}>
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={`px-6 py-4 border-t ${
        isEarthy ? "bg-cream-50 border-tan-200" : "bg-charcoal-grey border-blue-grey"
      }`}>
        <button className={`text-sm font-medium ${
          isEarthy ? "text-rust-600 hover:text-rust-700" : "text-light-lavender hover:text-medium-lavender"
        }`}>
          View all groups →
        </button>
      </div>
    </div>
  );
}
