import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import logoImage from "../assets/Thong.png";
import DirectChat from "./DirectChat";

export default function UntiltNavBar() {
  const { user, logOut, profile } = UserAuth();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelfCareOpen, setIsSelfCareOpen] = useState(false);
  const [isSelfCareOpenMobile, setIsSelfCareOpenMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { 
      name: "Self Care", 
      path: "/selfcare",
      hasDropdown: true,
      subLinks: [
        { name: "Breathing Exercises", path: "/breathing" },
        { name: "Guided Videos", path: "/guide-videos" },
        { name: "Journal Entries", path: "/journal" },
        { name: "Goals", path: "/goals" },
      ]
    },
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
        isEarthy
          ? "bg-cream-100 border-tan-200"
          : "bg-pale-lavender border-cool-grey"
      } shadow-md fixed top-0 w-full z-50 border-b opacity-90 hover:opacity-100 transition-opacity duration-200`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <NavLink to={user ? "/dashboard" : "/"}>
            <div className="flex items-center space-x-3">
              <img
                src={logoImage}
                alt="Tilted Logo"
                className="object-contain w-12 h-10"
              />
              <span
                className={`text-xl font-bold ${
                  isEarthy ? "text-brown-800" : "text-charcoal-grey"
                }`}
              >
                Untilt
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {links.map((link) => (
              link.hasDropdown ? (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setIsSelfCareOpen(true)}
                  onMouseLeave={() => setIsSelfCareOpen(false)}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                        isActive
                          ? `${
                              isEarthy ? "bg-rust-500" : "bg-slate-blue"
                            } text-white`
                          : `${
                              isEarthy
                                ? "text-brown-700 hover:text-rust-500"
                                : "text-charcoal-grey hover:text-slate-blue"
                            }`
                      }`
                    }
                  >
                    {link.name}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isSelfCareOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </NavLink>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 -mt-0 w-56 rounded-lg shadow-lg overflow-hidden transition-all duration-100 ${
                      isSelfCareOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    } ${
                      isEarthy
                        ? "bg-cream-50 border-2 border-tan-300"
                        : "bg-white border-2 border-cool-grey"
                    }`}
                  >
                    {link.subLinks.map((subLink) => (
                      <NavLink
                        key={subLink.path}
                        to={subLink.path}
                        className={({ isActive }) =>
                          `block px-4 py-3 text-sm font-medium transition ${
                            isActive
                              ? `${
                                  isEarthy ? "bg-rust-500" : "bg-slate-blue"
                                } text-white`
                              : `${
                                  isEarthy
                                    ? "text-brown-700 hover:bg-tan-100 hover:text-rust-500"
                                    : "text-charcoal-grey hover:bg-pale-lavender hover:text-slate-blue"
                                }`
                          }`
                        }
                      >
                        {subLink.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? `${
                            isEarthy ? "bg-rust-500" : "bg-slate-blue"
                          } text-white`
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
              )
            ))}
          </div>

          {/* Desktop User Display */}
          <div className="hidden lg:flex items-center ml-6 space-x-3">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`relative p-2 rounded-full transition ${
                isEarthy
                  ? "hover:bg-rust-100 text-brown-700 hover:text-rust-500"
                  : "hover:bg-pale-lavender text-charcoal-grey hover:text-slate-blue"
              }`}
              title="Messages"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <NavLink
            to={"/profile"}
              className={`${
                isEarthy ? "text-brown-700" : "text-charcoal-grey"
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              {profile?.firstName || "Unknown"}
            </NavLink>
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
                isEarthy
                  ? "text-brown-700 hover:text-rust-500"
                  : "text-charcoal-grey hover:text-slate-blue"
              } focus:outline-none`}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`py-2 space-y-1 ${
              isEarthy ? "bg-cream-50" : "bg-white"
            } rounded-lg mx-2 mb-2`}
          >
            {links.map((link) => (
              link.hasDropdown ? (
                <div key={link.path}>
                  {/* Main Self Care Link with Toggle */}
                  <div className="flex items-center">
                    <NavLink
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex-1 px-4 py-3 rounded-md text-base font-medium transition ${
                          isActive
                            ? `${
                                isEarthy ? "bg-rust-500" : "bg-slate-blue"
                              } text-white`
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
                    <button
                      onClick={() => setIsSelfCareOpenMobile(!isSelfCareOpenMobile)}
                      className={`px-3 py-3 ${
                        isEarthy
                          ? "text-brown-700 hover:text-rust-500"
                          : "text-charcoal-grey hover:text-slate-blue"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          isSelfCareOpenMobile ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Sub Links */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isSelfCareOpenMobile ? "max-h-64" : "max-h-0"
                    }`}
                  >
                    <div className="pl-6 space-y-1 mt-1">
                      {link.subLinks.map((subLink) => (
                        <NavLink
                          key={subLink.path}
                          to={subLink.path}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsSelfCareOpenMobile(false);
                          }}
                          className={({ isActive }) =>
                            `block px-4 py-2 rounded-md text-sm font-medium transition ${
                              isActive
                                ? `${
                                    isEarthy ? "bg-rust-400" : "bg-slate-blue"
                                  } text-white`
                                : `${
                                    isEarthy
                                      ? "text-brown-600 hover:text-rust-500 hover:bg-cream-200"
                                      : "text-slate-blue hover:text-charcoal-grey hover:bg-pale-lavender"
                                  }`
                            }`
                          }
                        >
                          • {subLink.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-md text-base font-medium transition ${
                      isActive
                        ? `${
                            isEarthy ? "bg-rust-500" : "bg-slate-blue"
                          } text-white`
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
              )
            ))}

            {/* Mobile Messages Button */}
            <button
              onClick={() => {
                setIsChatOpen(!isChatOpen);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-center px-4 py-3 rounded-md text-base font-medium transition ${
                isEarthy
                  ? "text-brown-700 hover:text-rust-500 hover:bg-cream-200"
                  : "text-charcoal-grey hover:text-slate-blue hover:bg-pale-lavender"
              }`}
            >
              💬 Messages
            </button>

            {/* Mobile User Display */}
            <NavLink
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block w-full text-center px-4 py-3 rounded-md text-base font-medium transition ${
                  isActive
                    ? `${
                        isEarthy ? "bg-rust-500" : "bg-slate-blue"
                      } text-white`
                    : `${
                        isEarthy
                          ? "text-brown-700 hover:text-rust-500 hover:bg-cream-200"
                          : "text-charcoal-grey hover:text-slate-blue hover:bg-pale-lavender"
                      }`
                }`
              }
            >
              {[profile?.firstName, profile?.lastName]
                .filter(Boolean)
                .join(" ") || "Unknown"}
            </NavLink>

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

      {/* Direct Chat Component - Always render when user is logged in */}
      {user && <DirectChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </nav>
  );
}
