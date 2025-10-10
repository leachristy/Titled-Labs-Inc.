import "../../Home2.css";

export default function StatsBar2() {
  const stats = [
    { value: "96%", label: "agree Tilted is intuitive to set up", color: "text-slate-blue" },
    { value: "6+", label: "hours saved per week on admin tasks", color: "text-blue-grey" },
    { value: "14+", label: "hours saved per month on billing", color: "text-cool-grey" },
    { value: "50M+", label: "sessions completed", color: "text-charcoal-grey" }
  ];

  return (
    <section className="py-16 bg-white border-y border-cool-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl sm:text-5xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-sm text-charcoal-grey">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}