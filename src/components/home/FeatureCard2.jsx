import "../../Home2.css";

export default function FeatureCard2({ icon, title, description, color = "primary" }) {
  const colorMap = {
    primary: "bg-slate-blue",
    secondary: "bg-blue-grey",
    tertiary: "bg-cool-grey",
    accent: "bg-charcoal-grey"
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-cool-grey hover:border-blue-grey hover:shadow-lg transition-all duration-200">
      <div className={`w-12 h-12 ${colorMap[color]} text-white rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-charcoal-grey mb-3">{title}</h3>
      <p className="text-slate-blue leading-relaxed">{description}</p>
    </div>
  );
}