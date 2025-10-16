import "./App.css";
import "./ThemeStyles.css";
import NavBar from "./components/NavBar";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import UnifiedHome from "./pages/UnifiedHome";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Users from "./pages/Users";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./webapp-pages/Dashboard";
import AIChat from "./webapp-pages/AIChat";
import Community from "./webapp-pages/Community";
import { AuthContextProvider } from "./contexts/AuthContext";
import Protected from "./components/Protected";
import { SelfCare } from "./webapp-pages/SelfCare";
import JournalEntries from "./webapp-pages/selfcare-features/JournalEntries";
import Goals from "./webapp-pages/selfcare-features/Goal";


export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <ThemeToggle />
        <AuthContextProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<UnifiedHome />} />
            <Route path="/home" element={<UnifiedHome />} />
            <Route path="/home-earthy" element={<Home />} />
            <Route path="/home-cool" element={<Home2 />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/users" element={<Users />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/dashboard"
              element={
                <Protected>
                  <Dashboard />
                </Protected>
              }
            />
            <Route
              path="/selfcare"
              element={
                <Protected>
                  <SelfCare />
                </Protected>
              }
            />
            <Route
              path="/journal"
              element={
                <Protected>
                  <JournalEntries />
                </Protected>
              }
            />
            <Route
              path="/goals"
              element={
                <Protected>
                  <Goals />
                </Protected>
              }
            />
            <Route
              path="/aichat"
              element={
                <Protected>
                  <AIChat />
                </Protected>
              }
            />
            <Route
              path="/community"
              element={
                <Protected>
                  <Community />
                </Protected>
              }
            />
          </Routes>
        </AuthContextProvider>
      </div>
    </ThemeProvider>
  );
}
