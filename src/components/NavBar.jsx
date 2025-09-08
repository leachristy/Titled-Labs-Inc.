import logoImage from "../assets/logo.png";

export default function NavBar({ currentPage, onNavigate }) {
  const Item = ({ id, children }) => (
    <button
      onClick={() => onNavigate(id)}
      className={`nav-button ${currentPage === id ? "active" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <nav className="bg-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img src={logoImage} alt="Untilted Logo" className="w-15 h-10 object-contain" />
            <span className="text-xl font-bold text-gray-800">Untilted Lab Inc.</span>
          </div>
          <div className="flex space-x-6">
            <Item id="home">Home</Item>
            <Item id="about">About Us</Item>
            <Item id="community">Community</Item>
            <Item id="ai-chat">AI Chat</Item>
            <Item id="contact">Contact</Item>
          </div>
        </div>
      </div>
    </nav>
  );
}
