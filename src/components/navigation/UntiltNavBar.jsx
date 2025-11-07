import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { UserAuth } from "../../contexts/AuthContext";
import logoImage from "../../assets/logoName.png";

export default function UntiltNavBar() {
  const { user, logOut, profile } = UserAuth();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelfCareOpen, setIsSelfCareOpen] = useState(false);
  const [isSelfCareOpenMobile, setIsSelfCareOpenMobile] = useState(false);
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
      ],
    },
    { name: "AI Chat", path: "/aichat" },
    { name: "Community", path: "/community" },
    { name: "Direct Messages", path: "/messages" },
    { name: "Friends", path: "/friends" },
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
          : "bg-[#646F89] border-[#8090B0]"
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
                  isEarthy ? "text-brown-800" : "text-white"
                }`}
              >
                Untilt
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-6 lg:flex">
            {links.map((link) =>
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
                              isEarthy ? "bg-rust-500" : "bg-[#c7b4e2]"
                            } text-white`
                          : `${
                              isEarthy
                                ? "text-brown-700 hover:text-rust-500"
                                : "text-purple-200 hover:text-[#c7b4e2]"
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
                        : "bg-[#8090B0] border-2 border-[#ABAAC0]"
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
                                  isEarthy ? "bg-rust-500" : "bg-[#c7b4e2]"
                                } text-white`
                                : `${
                                    isEarthy
                                      ? "text-brown-700 hover:bg-tan-100 hover:text-rust-500"
                                      : "text-white hover:bg-[#646F89] hover:text-[#DFD2D5]"
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
                            isEarthy ? "bg-rust-500" : "bg-[#c7b4e2]"
                          } text-white`
                          : `${
                            isEarthy
                              ? "text-brown-700 hover:text-rust-500"
                              : "text-purple-200 hover:text-[#c7b4e2]"
                          }`
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )
            )}
          </div>

          {/* Desktop User Display */}
          <div className="items-center hidden ml-6 space-x-3 lg:flex">
            <NavLink
              to={"/profile"}
              className={`${
                isEarthy ? "text-brown-700" : "text-purple-200"
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              {profile?.firstName || "Unknown"}
            </NavLink>
            <button
              onClick={handleSignOut}
              className={`${
                isEarthy
                  ? "bg-rust-500 hover:bg-rust-600"
                  : "bg-[#c7b4e2] hover:bg-[#b49fd3]"
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
                  : "text-purple-200 hover:text-[#c7b4e2]"
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
              isEarthy ? "bg-cream-50" : "bg-[#8090B0]"
            } rounded-lg mx-2 mb-2`}
          >
            {links.map((link) =>
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
                                isEarthy ? "bg-rust-500" : "bg-[#c7b4e2]"
                              } text-white`
                            : `${
                                isEarthy
                                  ? "text-brown-700 hover:text-rust-500 hover:bg-cream-200"
                                  : "text-purple-200 hover:text-[#c7b4e2] hover:bg-[#2d1b4e]"
                              }`
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                    <button
                      onClick={() =>
                        setIsSelfCareOpenMobile(!isSelfCareOpenMobile)
                      }
                      className={`px-3 py-3 ${
                        isEarthy
                          ? "text-brown-700 hover:text-rust-500"
                          : "text-purple-200 hover:text-[#c7b4e2]"
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
                    <div className="pl-6 mt-1 space-y-1">
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
                                    isEarthy ? "bg-rust-400" : "bg-[#c7b4e2]"
                                  } text-white`
                                : `${
                                    isEarthy
                                      ? "text-brown-600 hover:text-rust-500 hover:bg-cream-200"
                                      : "text-white hover:text-[#DFD2D5] hover:bg-[#646F89]"
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
                            isEarthy ? "bg-rust-500" : "bg-[#c7b4e2]"
                          } text-white`
                        : `${
                            isEarthy
                              ? "text-brown-700 hover:text-rust-500 hover:bg-cream-200"
                              : "text-white hover:text-[#DFD2D5] hover:bg-[#646F89]"
                          }`
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )
            )}

            {/* Mobile User Display */}
            <NavLink
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block w-full text-center px-4 py-3 rounded-md text-base font-medium transition ${
                  isActive
<<<<<<< HEAD:src/components/UntiltNavBar.jsx
                    ? `${isEarthy ? "bg-rust-500" : "bg-slate-blue"} text-white`
=======
                    ? `${
                        isEarthy ? "bg-rust-500" : "bg-[#c7b4e2]"
                      } text-white`
>>>>>>> 54c4048046e2e7a3653c22edaa8d5b1d3f92f638:src/components/navigation/UntiltNavBar.jsx
                    : `${
                        isEarthy
                          ? "text-brown-700 hover:text-rust-500 hover:bg-cream-200"
                          : "text-white hover:text-[#DFD2D5] hover:bg-[#646F89]"
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
                  : "bg-[#c7b4e2] hover:bg-[#b49fd3]"
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
