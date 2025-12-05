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
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Dashboard from "./webapp-pages/Dashboard";
import AIChat from "./webapp-pages/AIChat";
import Community from "./webapp-pages/Community";
import { AuthContextProvider } from "./contexts/AuthContext";
import { MessengerProvider } from "./contexts/MessengerContext";
import { AchievementProvider } from "./contexts/AchievementContext";
import AchievementModal from "./components/ui/AchievementModal";
import Protected from "./components/ui/Protected";
import MessengerWidget from "./components/messaging/MessengerWidget";
import { SelfCare } from "./webapp-pages/SelfCare";
import JournalEntries from "./webapp-pages/selfcare-features/JournalEntries";
import Goals from "./webapp-pages/selfcare-features/Goal";
import BreathingExercises from "./webapp-pages/selfcare-features/BreathingExercises";
import GuidedVideos from "./webapp-pages/selfcare-features/GuideVideos/GuideVideos";
import VideoWatch from "./webapp-pages/selfcare-features/GuideVideos/VideoWatch";
import ProfilePage from "./pages/ProfilePage";
import { FriendProfilePage } from "./pages/FriendProfilePage";
import { ChatPage } from "./pages/ChatPage";
import DirectMessages from "./webapp-pages/DirectMessages";
import { FriendsPage } from "./webapp-pages/FriendsPage";
import StressManagement from "./pages/StressManagement";
import TherapyGuide from "./pages/TherapyGuide";
import JournalTemplate from "./pages/JournalTemplate";import Resources from "./webapp-pages/selfcare-features/Resources";
import Resources from "./webapp-pages/selfcare-features/Resources";


export default function App() {
  return (
    // Theme provider enables theme switching throughout the app
    <ThemeProvider>
      <div className="min-h-screen">
        <AuthContextProvider>
          {/* Messenger provider enables real-time chat features */}
          <MessengerProvider>
            <AchievementProvider>
              <AchievementModal /> 
              
              <MessengerWidget />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<UnifiedHome />} />
                <Route path="/home" element={<UnifiedHome />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/about" element={<About />} />
                <Route path="/users" element={<Users />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/resources/stress-management" element={<StressManagement />} />
                <Route path="/resources/therapy-guide" element={<TherapyGuide />} />
                <Route path="/resources/journal-template" element={<JournalTemplate />} />
                <Route path="/resources/stress-management" element={<StressManagement />} />
                <Route path="/resources/therapy-guide" element={<TherapyGuide />} />
                <Route path="/resources/journal-template" element={<JournalTemplate />} />
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
                <Route path="/profile/:uid" element={<FriendProfilePage />} />
                <Route path="/chat/:uid" element={<ChatPage />} />
                <Route
                  path="/profile"
                  element={
                    <Protected>
                      <ProfilePage />
                    </Protected>
                  }
                />
                <Route
                  path="/friends"
                  element={
                    <Protected>
                      <FriendsPage />
                    </Protected>
                  }

                   />
            <Route
              path="/resources"
              element={
                <Protected>
                  <Resources />
                </Protected>
              }
            />
                />
              </Routes>
            </AchievementProvider>
          </MessengerProvider>
        </AuthContextProvider>
      </div>
    </ThemeProvider>
  );
}