import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import logoImage from "../assets/Thong.png";

export default function UntiltNavBar() {
  const { user, logOut } = UserAuth();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Self Care", path: "/selfcare" },
    { name: "AI Chat", path: "/aichat" },
    { name: "Community", path: "/community" },
  ];

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav
      className={`${
        isEarthy ? "bg-cream-100 border-tan-200" : "bg-pale-lavender border-cool-grey"
      } shadow-md fixed top-0 w-full z-50 border-b opacity-90`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <NavLink to="/">
            <div className="flex items-center space-x-3">
              <img src={logoImage} alt="Tilted Logo" className="object-contain w-12 h-10" />
              <span
                className={`text-xl font-bold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}
              >
                Untilt
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {links.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? `${isEarthy ? "bg-rust-500" : "bg-slate-blue"} text-white`
                      : `${
                          isEarthy
                            ? "text-brown-700 hover:text-rust-500"
                            : "text-charcoal-grey hover:text-slate-blue"
                        }`
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Display */}
          <div className="hidden lg:flex items-center ml-6 space-x-3">
            <div
              className={`${
                isEarthy ? "text-brown-700" : "text-charcoal-grey"
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              {user?.displayName?.split(" ")[0] || "Unknown"}
            </div>
            <button
              onClick={handleSignOut}
              className={`${
                isEarthy 
                  ? "bg-rust-500 hover:bg-rust-600" 
                  : "bg-slate-blue hover:bg-charcoal-grey"
              } text-white px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md ${
                isEarthy ? "text-brown-700 hover:text-rust-500" : "text-charcoal-grey hover:text-slate-blue"
              } focus:outline-none`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className={`py-2 space-y-1 ${isEarthy ? "bg-cream-50" : "bg-white"} rounded-lg mx-2 mb-2`}>
            {links.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md text-base font-medium transition ${
                    isActive
                      ? `${isEarthy ? "bg-rust-500" : "bg-slate-blue"} text-white`
                      : `${
                          isEarthy
                            ? "text-brown-700 hover:text-rust-500 hover:bg-cream-200"
                            : "text-charcoal-grey hover:text-slate-blue hover:bg-pale-lavender"
                        }`
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile User Display */}
            <div
              className={`block w-full text-center px-4 py-2 rounded-md text-base font-medium ${
                isEarthy ? "text-brown-700" : "text-charcoal-grey"
              }`}
            >
              {user?.displayName || "Unknown"}
            </div>

            {/* Mobile Sign Out Button */}
            <button
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className={`block w-full text-center px-4 py-2 rounded-md text-base font-medium ${
                isEarthy 
                  ? "bg-rust-500 hover:bg-rust-600" 
                  : "bg-slate-blue hover:bg-charcoal-grey"
              } text-white mt-2`}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
