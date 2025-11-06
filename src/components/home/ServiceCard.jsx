import { useTheme } from "../../contexts/ThemeContext";

export default function ServiceCard({ service, onNavigate }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const getIconColor = (colorType) => {
    const colorMap = {
      earthy: {
        primary: "bg-rust-500",
        secondary: "bg-terracotta-400"
      },
      cool: {
        primary: "bg-slate-blue",
        secondary: "bg-blue-grey"
      }
    };
    return colorMap[isEarthy ? "earthy" : "cool"][colorType];
  };

  const getIcon = () => {
    if (service.icon === "user") {
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      );
    }
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    );
  };

  return (
    <div
      className={`${isEarthy ? "card" : "card-new"} p-8 ${
        isEarthy ? "hover:border-rust-400" : "hover:border-blue-grey"
      } transition-colors duration-200`}
    >
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`w-12 h-12 ${getIconColor(service.color)} flex items-center justify-center shrink-0`}
        >
          <svg
            className="text-white w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {getIcon()}
          </svg>
        </div>
        <div>
          <h3
            className={`text-xl font-semibold ${
              isEarthy ? "text-brown-800" : "text-charcoal-grey"
            } mb-2`}
          >
            {service.title}
          </h3>
          <p
            className={`${
              isEarthy ? "text-brown-700" : "text-slate-blue"
            } text-sm leading-relaxed`}
          >
            {service.description}
          </p>
        </div>
      </div>
      <ul className="pl-1 mb-6 space-y-3">
        {service.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={`w-1.5 h-1.5 ${
                getIconColor(service.color)
              } rounded-full mt-2`}
            ></div>
            <span
              className={`${
                isEarthy ? "text-brown-700" : "text-slate-blue"
              } text-sm`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onNavigate(service.ctaLink)}
        className={`${
          service.color === "primary"
            ? isEarthy
              ? "text-rust-500 hover:text-rust-600"
              : "text-slate-blue hover:text-charcoal-grey"
            : isEarthy
            ? "text-terracotta-400 hover:text-terracotta-500"
            : "text-blue-grey hover:text-charcoal-grey"
        } font-medium inline-flex items-center gap-2 group`}
      >
        {service.ctaText}
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
