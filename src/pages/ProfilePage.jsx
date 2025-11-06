/**
 * Profile Page Component
 * 
 * User profile management page with full CRUD operations
 * Displays user information, badges, and account management options
 * 
 * Features:
 * - View profile information (name, email, photo)
 * - Display earned badges gallery
 * - Edit profile (firstName, lastName via EditProfile component)
 * - Delete account with confirmation modal
 * - Google profile photo integration with fallback
 * - Theme toggle in fixed position
 * - Back to dashboard navigation
 * - Success/error message banner
 * - Theme-aware styling
 * - Loading state handling
 * 
 * Account Deletion Flow:
 * 1. User clicks "Delete Account"
 * 2. Confirmation modal appears
 * 3. On confirm: Delete Firestore document → Delete Firebase auth user → Sign out
 * 4. Redirect to sign-up page
 */

// src/pages/ProfilePage.jsx (or wherever yours lives)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import { db, auth } from "../src/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser, signOut } from "firebase/auth";
import EditProfile from "../components/forms/EditProfile";
import BadgeGallery from "../components/cards/BadgeGallery";
import Confirmation from "../components/ui/Confirmation";
import defaultPic from "../assets/default-profile.jpg";

export default function ProfilePage() {
  // Get user authentication state and profile data
  const { user, profile } = UserAuth();
  
  // Get current theme state
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();

  // Component state management
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [confirmDelete, setConfirmDelete] = useState(false); // Show delete confirmation modal
  const [message, setMessage] = useState(""); // Success/error message banner

  /**
   * Navigate back to dashboard
   */
  const handleBack = () => {
    navigate("/dashboard");
  };

  /**
   * Save updated profile data to Firestore
   * 
   * @param {Object} updatedProfile - Profile fields to update (firstName, lastName)
   * 
   * Process:
   * 1. Update Firestore document with new profile data
   * 2. Show success message
   * 3. Exit edit mode
   * 4. Clear message after 3 seconds
   * 5. On error: Display error message
   */
  const handleSave = async (updatedProfile) => {
    try {
      await updateDoc(doc(db, "users", user.uid), updatedProfile);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile. Please try again.");
    }
  };

  /**
   * Delete user account permanently
   * 
   * Process:
   * 1. Delete user document from Firestore (users collection)
   * 2. Delete user from Firebase Authentication
   * 3. Sign out user session
   * 4. Show success message
   * 5. Redirect to sign-up page after 1.2 seconds
   * 6. On error: Display error message
   * 
   * Note: This is a destructive operation - all user data is permanently deleted
   */
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      await signOut(auth);
      setMessage("Account successfully deleted");
      setTimeout(() => navigate("/signup"), 1200);
    } catch (err) {
      console.error(err);
      setMessage("Error deleting account. Try again.");
    }
  };

  // Loading state - show spinner while profile data loads from Firestore
  if (!profile) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isEarthy ? "bg-cream-100 text-brown-800" : "bg-pale-lavender text-charcoal-grey"
        }`}
      >
        Loading profile...
      </div>
    );
  }

  // Determine profile photo source
  // Google users: Use Google profile photo
  // Email/password users: Use default placeholder
  const isGoogleUser = user?.providerData?.[0]?.providerId === "google.com";
  const googlePhoto =
    user?.photoURL ||
    user?.providerData?.[0]?.photoURL ||
    profile?.photoUrl ||
    null;

  const displayPhoto = isGoogleUser ? googlePhoto || defaultPic : defaultPic;

  return (
    <div
      className={`relative min-h-screen pt-20 px-6 flex flex-col items-center ${
        isEarthy ? "bg-cream-100 text-brown-800" : "bg-pale-lavender text-charcoal-grey"
      }`}
    >
      {/* Fixed theme toggle button - top right */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Fixed back button - top left */}
      <div className="fixed top-4 left-4">
        <button
          onClick={handleBack}
          className={`px-4 py-2 rounded font-semibold transition ${
            isEarthy
              ? "bg-rust-500 hover:bg-rust-600 text-white"
              : "bg-light-lavender hover:bg-medium-lavender text-white"
          }`}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Success/Error message banner */}
      {message && (
        <div
          className={`w-full max-w-lg text-center py-3 px-4 rounded mb-6 ${
            isEarthy ? "bg-tan-400 text-white" : "bg-light-lavender text-white"
          }`}
        >
          {message}
        </div>
      )}

      {/* Main profile card */}
      <div
        className={`w-full max-w-lg rounded-lg shadow-md p-8 text-center ${
          isEarthy ? "bg-white text-brown-800" : "bg-white text-charcoal-grey"
        }`}
      >
        {!isEditing ? (
          <>
            {/* View Mode: Display profile information */}
            
            {/* Profile image with error fallback */}
            <img
              src={displayPhoto}
              onError={(e) => (e.currentTarget.src = defaultPic)}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-opacity-40 border-brown-700 mx-auto mb-4"
            />

            {/* User's full name */}
            <h2 className="text-2xl font-semibold mb-1">
              {profile.firstName} {profile.lastName}
            </h2>

            {/* User's email address */}
            <p
              className={`text-sm mb-3 ${
                isEarthy ? "text-brown-600" : "text-light-lavender"
              }`}
            >
              {profile.email}
            </p>

            {/* Badges earned by user */}
            <BadgeGallery badges={Array.isArray(profile.badges) ? profile.badges : []} />

            {/* Action buttons: Edit and Delete */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className={`px-5 py-2 rounded font-semibold transition ${
                  isEarthy
                    ? "bg-rust-500 hover:bg-rust-600 text-white"
                    : "bg-light-lavender hover:bg-medium-lavender text-white"
                }`}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className={`px-5 py-2 rounded font-semibold transition ${
                  isEarthy
                    ? "bg-brown-700 hover:bg-rust-500 text-white"
                    : "bg-charcoal-grey hover:bg-light-lavender text-white"
                }`}
              >
                Delete Account
              </button>
            </div>
          </>
        ) : (
          /* Edit Mode: Show EditProfile form component */
          <EditProfile
            userId={user.uid}
            profile={profile}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </div>

      {/* Delete Confirmation Modal - only shown when confirmDelete is true */}
      {confirmDelete && (
        <Confirmation
          message="Are you sure you want to permanently delete your account and all data?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
