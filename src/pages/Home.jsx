import logoImage from "../assets/logo.png";

export default function Home({ onNavigate }) {
  return (
    <div className="page-container home-page">
      <div className="max-w-4xl mx-auto text-center">
        <img src={logoImage} alt="Untilted Logo" className="logo-image" />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to Untilted Lab Inc.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your journey to mental wellness starts here. Connect with licensed therapists,
          join supportive communities, and access AI-powered mental health resources.
        </p>
        <div className="button-group">
          <button onClick={() => onNavigate("ai-chat")} className="primary-button blue">
            Start AI Chat
          </button>
          <button onClick={() => onNavigate("community")} className="primary-button green">
            Join Community
          </button>
        </div>
      </div>
    </div>
  );
}
