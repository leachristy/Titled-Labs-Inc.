import "./App.css";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Community from "./pages/Community";
import AIChat from "./pages/AIChat";
import Contact from "./pages/Contact";
import Users from "./pages/Users";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Routes>
      <Route path ="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/community" element={<Community />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/users" element={<Users />}></Route>
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}