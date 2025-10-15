import { useTheme } from "../../contexts/ThemeContext";

export default function FeatureCard({ icon, title, description, color = "primary" }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const colorMap = isEarthy ? {
    primary: "bg-rust-500",
    secondary: "bg-terracotta-400",
    tertiary: "bg-tan-300",
    accent: "bg-brown-600"
  } : {
    primary: "bg-slate-blue",
    secondary: "bg-blue-grey",
    tertiary: "bg-cool-grey",
    accent: "bg-charcoal-grey"
  };

  return (
    <div className={`bg-white p-6 rounded-lg border ${
      isEarthy 
        ? "border-tan-200 hover:border-rust-400" 
        : "border-cool-grey hover:border-blue-grey"
    } hover:shadow-lg transition-all duration-200`}>
      <div className={`w-12 h-12 ${colorMap[color]} text-white rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className={`text-xl font-semibold mb-3 ${
        isEarthy ? "text-brown-800" : "text-charcoal-grey"
      }`}>
        {title}
      </h3>
      <p className={`leading-relaxed ${
        isEarthy ? "text-brown-600" : "text-slate-blue"
      }`}>
        {description}
      </p>
    </div>
  );
}
