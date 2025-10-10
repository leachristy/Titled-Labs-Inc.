import UntiltNavBar from "../components/UntiltNavBar";

export default function AIChat() {
  return (
    <>
      <title>Untilt - AI Chat</title>
      <UntiltNavBar />
      <div className="min-h-screen px-4 pt-24 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-3xl font-bold text-center text-gray-900">
            AI Therapy Assistant
          </h1>

          <div className="p-4 mb-4 overflow-y-auto bg-white rounded-lg shadow-lg h-96">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 text-sm text-white bg-blue-500 rounded-full">
                  🤖
                </div>
                <div className="max-w-xs p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm">
                    Hello! I'm your AI therapy assistant. How can I help you
                    today?
                  </p>
                  <span className="text-xs text-gray-500">
                    AI Assistant - Just now
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-end space-x-3">
                <div className="max-w-xs p-3 bg-gray-200 rounded-lg">
                  <p className="text-sm">
                    I've been feeling anxious lately about work.
                  </p>
                  <span className="text-xs text-gray-500">You - Just now</span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 text-sm text-white bg-gray-400 rounded-full">
                  You
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 text-sm text-white bg-blue-500 rounded-full">
                  🤖
                </div>
                <div className="max-w-xs p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm">
                    I understand work anxiety can be overwhelming. Would you
                    like to try a breathing exercise or talk about what
                    specifically is causing you stress?
                  </p>
                  <span className="text-xs text-gray-500">
                    AI Assistant - Just now
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-lg">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Type your message to the AI assistant..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600">
                Send
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Note: This AI assistant provides general support and is not a
              replacement for professional therapy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
