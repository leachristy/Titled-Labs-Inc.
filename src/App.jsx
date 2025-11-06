/**
 * App Component - Main Application Entry Point
 * 
 * Root component that sets up the application structure:
 * - Theme management (ThemeProvider wrapper)
 * - Authentication state (AuthContextProvider)
 * - Real-time messaging (MessengerProvider)
 * - Global UI elements (ThemeToggle, MessengerWidget)
 * - Route configuration for all pages
 * 
 * Route Structure:
 * - Public routes: Home, About, Contact, Login, SignUp
 * - Protected routes: Dashboard, Self-Care features, AI Chat, Community, Profile
 * - Self-Care sub-routes: Breathing, Videos, Journal, Goals
 * 
 * Context Hierarchy:
 * ThemeProvider → AuthContextProvider → MessengerProvider → Routes
 * This ensures theme is available everywhere, auth is needed for messaging,
 * and messaging is available for authenticated users
 */

import "./App.css";
import "./ThemeStyles.css";
import NavBar from "./components/navigation/NavBar";
import ThemeToggle from "./components/ui/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/firebase";

// Public Pages
import UnifiedHome from "./pages/UnifiedHome";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Users from "./pages/Users";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

// Protected Pages - Main App
import Dashboard from "./webapp-pages/Dashboard";
import AIChat from "./webapp-pages/AIChat";
import Community from "./webapp-pages/Community";
import DirectMessages from "./webapp-pages/DirectMessages";

// Protected Pages - Self-Care Features
import { SelfCare } from "./webapp-pages/SelfCare";
import JournalEntries from "./webapp-pages/selfcare-features/JournalEntries";
import Goals from "./webapp-pages/selfcare-features/Goal";
import BreathingExercises from "./webapp-pages/selfcare-features/BreathingExercises";
import GuidedVideos from "./webapp-pages/selfcare-features/GuideVideos/GuideVideos";
import VideoWatch from "./webapp-pages/selfcare-features/GuideVideos/VideoWatch";

// Profile Pages
import ProfilePage from "./pages/ProfilePage"
import { FriendProfilePage } from "./pages/FriendProfilePage";
import { ChatPage } from "./pages/ChatPage";

// Context Providers and Components
import { AuthContextProvider } from "./contexts/AuthContext";
import { MessengerProvider } from "./contexts/MessengerContext";
import Protected from "./components/ui/Protected";
import MessengerWidget from "./components/messaging/MessengerWidget";

/**
 * Main App Component
 * 
 * Sets up the application with necessary providers and routing
 * Renders global UI elements that persist across all pages
 */
export default function App() {
  return (
    // Theme provider enables theme switching throughout the app
    <ThemeProvider>
      <div className="min-h-screen">
        {/* Global theme toggle button - visible on all pages */}
        <ThemeToggle />
        
        {/* Authentication provider manages user login state */}
        <AuthContextProvider>
          {/* Messenger provider enables real-time chat features */}
          <MessengerProvider>
            {/* Floating messenger widget - only visible when logged in */}
            <MessengerWidget />
            
            {/* Application Routes */}
            <Routes>
            {/* Public Routes - Accessible without login */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<UnifiedHome />} />
            <Route path="/home" element={<UnifiedHome />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/users" element={<Users />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected Routes - Require authentication */}
            {/* Main Dashboard */}
            <Route
              path="/dashboard"
              element={
                <Protected>
                  <Dashboard />
                </Protected>
              }
            />
            <Route
              path="/breathing"
              element={
                <Protected>
                  <BreathingExercises />
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
              path="/guide-videos"
              element={
                <Protected>
                  <GuidedVideos />
                </Protected>
              }
            />
            <Route
              path="/guide-videos/:id"
              element={
                <Protected>
                  <VideoWatch />
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
            <Route
              path="/messages"
              element={
                <Protected>
                  <DirectMessages />
                </Protected>
              }
            />
            
            {/* Profile Routes */}
            {/* Other users' public profiles - Dynamic route with user ID */}
            <Route 
              path="/profile/:uid" 
              element={<FriendProfilePage />} 
            />
            {/* Direct chat with specific user - Dynamic route with user ID */}
            <Route 
              path="/chat/:uid" 
              element={<ChatPage />}
            />
            {/* Current user's profile - Protected */}
            <Route
              path="/profile"
              element={
                <Protected>
                  <ProfilePage />
                </Protected>
              }
            />
          </Routes>
          </MessengerProvider>
        </AuthContextProvider>
      </div>
    </ThemeProvider>
  );
}
