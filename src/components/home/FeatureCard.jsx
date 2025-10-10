export default function FeatureCard({ icon, title, description, color = "primary" }) {
  const colorMap = {
    primary: "bg-rust-500",
    secondary: "bg-terracotta-400",
    tertiary: "bg-tan-300",
    accent: "bg-brown-600"
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-tan-200 hover:border-rust-400 hover:shadow-lg transition-all duration-200">
      <div className={`w-12 h-12 ${colorMap[color]} text-white rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-brown-800 mb-3">{title}</h3>
      <p className="text-brown-600 leading-relaxed">{description}</p>
    </div>
  );
}
