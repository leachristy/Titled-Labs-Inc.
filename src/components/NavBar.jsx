import { NavLink } from "react-router-dom";
import logoImage from "../assets/logo.png";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={logoImage}
              alt="Untilted Logo"
              className="w-15 h-10 object-contain"
            />
            <span className="text-xl font-bold text-gray-800">
              Untilted Lab Inc.
            </span>
          </div>

          {/* Navigation links */}
          <div className="flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-700"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-700"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-700"
              }
            >
              Community
            </NavLink>
            <NavLink
              to="/ai-chat"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-700"
              }
            >
              AI Chat
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-700"
              }
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
