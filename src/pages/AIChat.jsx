export default function AIChat() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">AI Therapy Assistant</h1>

        <div className="bg-white rounded-lg shadow-lg h-96 mb-4 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">🤖</div>
              <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">Hello! I'm your AI therapy assistant. How can I help you today?</p>
                <span className="text-xs text-gray-500">AI Assistant - Just now</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
                <p className="text-sm">I've been feeling anxious lately about work.</p>
                <span className="text-xs text-gray-500">You - Just now</span>
              </div>
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">You</div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">🤖</div>
              <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">
                  I understand work anxiety can be overwhelming. Would you like to try a breathing
                  exercise or talk about what specifically is causing you stress?
                </p>
                <span className="text-xs text-gray-500">AI Assistant - Just now</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Type your message to the AI assistant..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: This AI assistant provides general support and is not a replacement for professional therapy.
          </p>
        </div>
      </div>
    </div>
  );
}
