import { useTheme } from "../../contexts/ThemeContext";

export default function Testimonial() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === 'earthy';

  return (
    <section className={`py-20 ${isEarthy ? 'bg-gradient-to-br from-rust-500 to-terracotta-500' : 'bg-slate-blue'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why people choose Tilted
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 mb-12">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className={`w-16 h-16 ${isEarthy ? 'bg-rust-500' : 'bg-slate-blue'} rounded-full flex items-center justify-center`}>
                <span className="text-2xl font-bold text-white">JD</span>
              </div>
            </div>
            <div className="flex-1">
              <blockquote className={`text-lg ${isEarthy ? 'text-brown-700' : 'text-charcoal-grey'} mb-6 leading-relaxed italic`}>
                "Tilted has completely transformed how I manage my mental health. The AI support is there whenever I need it, and the community groups have connected me with people who truly understand what I'm going through. I've saved so much time and stress—it's been life-changing."
              </blockquote>
              <div>
                <div className={`font-semibold ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`}>Jordan Davis</div>
                <div className={`text-sm ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`}>Platform User Since 2024</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="text-center">
          <p className={`text-xs font-semibold ${isEarthy ? 'text-cream-100' : 'text-pale-lavender'} tracking-wider mb-6`}>TRUSTED BY THOUSANDS OF USERS NATIONWIDE</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">225k+</div>
              <div className={`text-sm ${isEarthy ? 'text-cream-200' : 'text-pale-lavender'}`}>Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className={`text-sm ${isEarthy ? 'text-cream-200' : 'text-pale-lavender'}`}>User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className={`text-sm ${isEarthy ? 'text-cream-200' : 'text-pale-lavender'}`}>Would Recommend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
