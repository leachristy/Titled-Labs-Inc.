import { useTheme } from "../../contexts/ThemeContext";

export default function StatsBar() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const stats = [
    { 
      value: "96%", 
      label: "agree Tilted is intuitive to set up", 
      earthyColor: "text-rust-600",
      coolColor: "text-slate-blue"
    },
    { 
      value: "6+", 
      label: "hours saved per week on admin tasks", 
      earthyColor: "text-terracotta-500",
      coolColor: "text-blue-grey"
    },
    { 
      value: "14+", 
      label: "hours saved per month on billing", 
      earthyColor: "text-tan-400",
      coolColor: "text-cool-grey"
    },
    { 
      value: "50M+", 
      label: "sessions completed", 
      earthyColor: "text-brown-600",
      coolColor: "text-charcoal-grey"
    }
  ];

  return (
    <section className={`py-16 bg-white border-y ${isEarthy ? "border-tan-200" : "border-cool-grey"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl sm:text-5xl font-bold ${isEarthy ? stat.earthyColor : stat.coolColor} mb-2`}>
                {stat.value}
              </div>
              <div className={`text-sm ${isEarthy ? "text-brown-700" : "text-charcoal-grey"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
