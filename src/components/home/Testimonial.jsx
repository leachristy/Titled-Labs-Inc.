export default function Testimonial() {
  return (
    <section className="py-20 bg-gradient-to-br from-rust-500 to-terracotta-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why people choose Tilted
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 mb-12">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-rust-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JD</span>
              </div>
            </div>
            <div className="flex-1">
              <blockquote className="text-lg text-brown-700 mb-6 leading-relaxed italic">
                "Tilted has completely transformed how I manage my mental health. The AI support is there whenever I need it, and the community groups have connected me with people who truly understand what I'm going through. I've saved so much time and stress—it's been life-changing."
              </blockquote>
              <div>
                <div className="font-semibold text-brown-800">Jordan Davis</div>
                <div className="text-sm text-brown-600">Platform User Since 2024</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="text-center">
          <p className="text-xs font-semibold text-cream-100 tracking-wider mb-6">TRUSTED BY THOUSANDS OF USERS NATIONWIDE</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">225k+</div>
              <div className="text-sm text-cream-200">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-sm text-cream-200">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-sm text-cream-200">Would Recommend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
