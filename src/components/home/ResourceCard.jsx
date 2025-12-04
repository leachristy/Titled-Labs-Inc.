import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";

export default function ResourceCard({ resource }) {
  const { currentTheme } = useTheme();
  const { user } = UserAuth();
  const navigate = useNavigate();
  const isEarthy = currentTheme === "earthy";

  const getResourceColor = (colorType) => {
    const colorMap = {
      earthy: {
        primary: "bg-rust-400",
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

  const getHoverColor = (colorType) => {
    const colorMap = {
      earthy: {
        primary: "group-hover:text-rust-500",
        secondary: "group-hover:text-terracotta-400",
        tertiary: "group-hover:text-tan-400"
      },
      cool: {
        primary: "group-hover:text-slate-blue",
        secondary: "group-hover:text-blue-grey",
        tertiary: "group-hover:text-cool-grey"
      }
    };
    return colorMap[isEarthy ? "earthy" : "cool"][colorType];
  };

  const handleClick = () => {
    if (resource.requiresAuth && !user) {
      navigate("/login");
    } else if (resource.link) {
      navigate(resource.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${isEarthy ? "card" : "card-new"} overflow-hidden ${
        isEarthy ? "hover:border-rust-400" : "hover:border-blue-grey"
      } transition-colors duration-200 cursor-pointer group`}
    >
      <div className={`h-48 ${getResourceColor(resource.color)}`}></div>
      <div className="p-6">
        <div
          className={`inline-block px-3 py-1 ${
            isEarthy
              ? "bg-cream-200 text-brown-800"
              : "bg-pale-lavender text-charcoal-grey"
          } text-xs font-semibold tracking-wider mb-3`}
        >
          {resource.type}
        </div>
        <h3
          className={`text-lg font-semibold ${
            isEarthy
              ? `text-brown-800 ${getHoverColor(resource.color)}`
              : `text-charcoal-grey ${getHoverColor(resource.color)}`
          } mb-2 transition-colors`}
        >
          {resource.title}
        </h3>
        <p
          className={`${
            isEarthy ? "text-brown-600" : "text-slate-blue"
          } text-sm leading-relaxed`}
        >
          {resource.description}
        </p>
      </div>
    </div>
  );
}
