import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Community from "./pages/Community";
import AIChat from "./pages/AIChat";
import Contact from "./pages/Contact";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <Home onNavigate={setCurrentPage} />;
      case "about": return <About />;
      case "community": return <Community />;
      case "ai-chat": return <AIChat />;
      case "contact": return <Contact />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}
