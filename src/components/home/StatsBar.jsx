import { useTheme } from "../../contexts/ThemeContext";

export default function StatsBar() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const stats = [
    { 
      value: "24/7", 
      label: "AI support available anytime", 
      earthyColor: "text-rust-600",
      coolColor: "text-[#646F89]"
    },
    { 
      value: "4+", 
      label: "self-care tools to explore", 
      earthyColor: "text-terracotta-500",
      coolColor: "text-blue-grey"
    },
    { 
      value: "100%", 
      label: "private and secure platform", 
      earthyColor: "text-tan-400",
      coolColor: "text-cool-grey"
    },
    { 
      value: "1000+", 
      label: "community members connected", 
      earthyColor: "text-brown-600",
      coolColor: "text-[#373E4F]"
    }
  ];

  return (
    <section className={`py-16 bg-white border-y ${isEarthy ? "border-tan-200" : "border-[#8090B0]"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl sm:text-5xl font-bold ${isEarthy ? stat.earthyColor : stat.coolColor} mb-2`}>
                {stat.value}
              </div>
              <div className={`text-sm ${isEarthy ? "text-brown-700" : "text-[#373E4F]"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
