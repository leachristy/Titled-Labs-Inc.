export default function Community() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Community Chat</h1>

        <div className="bg-white rounded-lg shadow-lg h-96 mb-4 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">A</div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">Welcome everyone! How is everyone feeling today?</p>
                <span className="text-xs text-gray-500">Alex - 2:30 PM</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">M</div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">Having a better day today, thanks for asking!</p>
                <span className="text-xs text-gray-500">Maria - 2:32 PM</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">J</div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">The breathing exercises really helped me this week.</p>
                <span className="text-xs text-gray-500">Jordan - 2:35 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
