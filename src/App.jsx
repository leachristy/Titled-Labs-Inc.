import "./App.css";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Community from "./pages/Community";
import AIChat from "./pages/AIChat";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/community" element={<Community />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
