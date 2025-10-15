import { useTheme } from "../../contexts/ThemeContext";

export default function CTASection({ onNavigate }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  return (
    <section className={`py-20 ${isEarthy ? "bg-rust-500" : "bg-slate-blue"}`}>
      <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
        <div className="p-12 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`w-2 h-2 ${
                isEarthy ? "bg-cream-100" : "bg-pale-lavender"
              } rounded-full animate-pulse`}
            ></div>
            <span
              className={`text-xs font-semibold ${
                isEarthy ? "text-cream-100" : "text-pale-lavender"
              } tracking-wider`}
            >
              NO CREDIT CARD REQUIRED
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white">Start for free</h2>
          <p
            className={`max-w-2xl mx-auto mb-8 text-lg ${
              isEarthy ? "text-cream-100" : "text-pale-lavender"
            }`}
          >
            Try Tilted free for 30 days. Experience the complete platform and
            see how we can support your mental wellness journey.
          </p>
          <div className="flex flex-col justify-center gap-4 mb-8 sm:flex-row">
            <button
              onClick={() => onNavigate("/signup")}
              className={`px-8 py-3 bg-white ${
                isEarthy
                  ? "text-rust-500 hover:bg-cream-50"
                  : "text-slate-blue hover:bg-pale-lavender"
              } font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
            >
              Start free trial
            </button>
            <button
              onClick={() => onNavigate("/contact")}
              className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Schedule demo
            </button>
          </div>
          <p
            className={`text-sm ${
              isEarthy ? "text-cream-200" : "text-pale-lavender"
            }`}
          >
            Join 225,000+ users who trust Tilted for their mental wellness
          </p>
        </div>
      </div>
    </section>
  );
}
