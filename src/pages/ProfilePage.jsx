import React, { useState, useEffect } from "react";
import { auth, db } from "../src/firebase";
import { doc, getDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import EditProfile from "../components/EditProfile";
import BadgeGallery from "../components/BadgeGallery";
import Confirmation from "../components/Confirmation";
import defaultPic from "../assets/default-profile.jpg";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");

  // Define color palette constants
  const BACKGROUND_LIGHT = "#ECDAC8";
  const TEXT_DARK = "#955749";
  const PRIMARY_BUTTON = "#BF5B3C";
  const HOVER_BUTTON = "#D8966F";

  // NEW: Navigation handler
  const handleBack = () => {
    // Navigate to the specified dashboard path
    window.location.href = "/dashboard"; 
  };

  // Load user and profile data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profileRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(profileRef);

        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          const defaultProfile = {
            firstName: firebaseUser.displayName?.split(" ")[0] || "",
            lastName: firebaseUser.displayName?.split(" ")[1] || "",
            email: firebaseUser.email,
            profilePic: firebaseUser.photoURL || "",
            badges: [],
          };
          await setDoc(profileRef, defaultProfile);
          setProfile(defaultProfile);
        }
      } else {
        window.location.href = "/login";
      }
    });

    return unsubscribe;
  }, []);

  const handleSave = async (updatedProfile) => {
    try {
      await updateDoc(doc(db, "users", user.uid), updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating profile");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      await signOut(auth);
      setMessage("Account successfully deleted");
      setTimeout(() => (window.location.href = "/signup"), 2000);
    } catch (err) {
      setMessage("Error deleting account. Try again.");
    }
  };

  if (!profile) return <p style={{ backgroundColor: BACKGROUND_LIGHT, color: TEXT_DARK, minHeight: '100vh', padding: '20px' }}>Loading profile...</p>;

  // Inline styles for the theme
  const styles = {
    container: {
      backgroundColor: BACKGROUND_LIGHT, // #ECDAC8
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      color: TEXT_DARK, // #955749
      position: 'relative', // Necessary for absolute positioning of the back button
    },
    profileBox: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '600px', 
      textAlign: 'center',
    },
    header: {
      color: TEXT_DARK,
      marginBottom: '20px',
    },
    messageBanner: {
      backgroundColor: '#D1A693', // #D1A693
      color: 'white',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
      width: '100%',
      maxWidth: '600px', 
      textAlign: 'center',
    },
    profilePic: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `4px solid ${TEXT_DARK}`,
      // Centering styles
      display: 'block', 
      margin: '0 auto 15px auto', 
    },
    button: {
      backgroundColor: PRIMARY_BUTTON, // #BF5B3C
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '0 5px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    deleteButton: {
      backgroundColor: TEXT_DARK, // #955749 for contrast and danger
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '0 5px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    buttonGroup: {
      marginTop: '30px',
      display: 'flex',
      justifyContent: 'center',
    },
    // NEW: Style for the Back button
    backButton: {
      backgroundColor: 'transparent', 
      color: TEXT_DARK,
      border: 'none',
      cursor: 'pointer',
      position: 'absolute', 
      top: '40px', // Adjusted to match the container padding
      left: '40px', // Adjusted to match the container padding
      fontWeight: 'bold',
      fontSize: '1em',
      zIndex: 10,
      textDecoration: 'none',
      padding: '0',
    },
  };

  return (
    <div className="profile-container" style={styles.container}>
      
      {/* NEW: Back Button */}
      <button 
        onClick={handleBack} 
        style={styles.backButton}
        onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
      >
        &larr; Back to Dashboard
      </button>

      {message && <div style={styles.messageBanner}>{message}</div>}

      <div style={styles.profileBox}>
        <h2 style={styles.header}>Your Wellness Profile</h2>
        {!isEditing ? (
          <>
            <img
              src={profile.profilePic || defaultPic}
              alt="Profile"
              style={styles.profilePic}
            />
            <h3 style={{ margin: '10px 0 5px' }}>
              {profile.firstName} {profile.lastName}
            </h3>
            <p style={{ color: '#D1A693' }}>{profile.email}</p>

            <BadgeGallery
              badges={Array.isArray(profile.badges) ? profile.badges : []}
            />

            <div style={styles.buttonGroup}>
              <button
                onClick={() => setIsEditing(true)}
                style={styles.button}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = HOVER_BUTTON)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_BUTTON)}
              >
                Edit Profile
              </button>
              <button
                className="delete"
                onClick={() => setConfirmDelete(true)}
                style={styles.deleteButton}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_BUTTON)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = TEXT_DARK)}
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
          message="Are you sure you want to permanently delete your account and all associated data? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}