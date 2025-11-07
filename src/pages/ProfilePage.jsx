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
  const { user, profile } = UserAuth();  
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");

  const handleBack = () => {
    navigate("/dashboard");
  };

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

  if (!profile) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
        }`}
      >
        <div
          className={`rounded-lg shadow-lg p-12 text-center ${
            isEarthy
              ? "bg-white border-tan-200"
              : "bg-pale-lavender border-blue-grey"
          } border`}
        >
          <svg
            className={`animate-spin h-12 w-12 mb-4 mx-auto ${
              isEarthy ? "text-rust-500" : "text-light-lavender"
            }`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p
            className={`text-lg ${
              isEarthy ? "text-brown-600" : "text-gray-300"
            }`}
          >
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

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
        isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
      }`}
    >
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Back to Dashboard */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleBack}
          className={`px-4 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg ${
            isEarthy
              ? "bg-rust-500 hover:bg-rust-600 text-white"
              : "bg-light-lavender hover:bg-medium-lavender text-white"
          }`}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Message banner */}
      {message && (
        <div
          className={`w-full max-w-lg text-center py-3 px-4 rounded-lg mb-6 shadow-lg ${
            isEarthy
              ? "bg-rust-500 text-white"
              : "bg-light-lavender text-white"
          }`}
        >
          {message}
        </div>
      )}

      {/* Profile card */}
      <div
        className={`w-full max-w-lg rounded-lg shadow-xl p-8 text-center border ${
          isEarthy
            ? "bg-white text-brown-800 border-tan-200"
            : "bg-pale-lavender text-gray-900 border-blue-grey"
        }`}
      >
        {!isEditing ? (
          <>
            {/* Profile image with safe fallback */}
            <img
              src={displayPhoto}
              onError={(e) => (e.currentTarget.src = defaultPic)}
              alt="Profile"
              className={`w-32 h-32 rounded-full object-cover border-4 mx-auto mb-4 ${
                isEarthy
                  ? "border-rust-200"
                  : "border-light-lavender"
              }`}
            />

            {/* Name */}
            <h2
              className={`text-3xl font-bold mb-2 ${
                isEarthy ? "text-brown-800" : "text-gray-900"
              }`}
            >
              {profile.firstName} {profile.lastName}
            </h2>

            {/* Email */}
            <p
              className={`text-sm mb-4 ${
                isEarthy ? "text-brown-600" : "text-gray-600"
              }`}
            >
              {profile.email}
            </p>

            {/* Badges */}
            <div className="mb-6">
              <BadgeGallery badges={Array.isArray(profile.badges) ? profile.badges : []} />
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition shadow-md hover:shadow-lg ${
                  isEarthy
                    ? "bg-rust-500 hover:bg-rust-600 text-white"
                    : "bg-light-lavender hover:bg-medium-lavender text-white"
                }`}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition shadow-md hover:shadow-lg ${
                  isEarthy
                    ? "bg-brown-700 hover:bg-rust-500 text-white"
                    : "bg-charcoal-grey hover:bg-gray-700 text-white"
                }`}
              >
                Delete Account
              </button>
            </div>
          </>
        ) : (
          <EditProfile
            userId={user.uid}
            profile={profile}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </div>

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
