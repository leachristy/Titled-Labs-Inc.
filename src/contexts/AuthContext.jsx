/**
 * Authentication Context for Firebase Authentication
 * 
 * Provides global authentication state and functions throughout the app
 * Handles Google OAuth, email/password authentication, and user profile management
 * Syncs with Firestore to maintain user profile data
 * 
 * Available functions:
 * - googleSignIn(): Sign in with Google OAuth popup
 * - doCreateUserWithEmailAndPassword(): Create new account with email/password
 * - doSignInWithEmailAndPassword(): Sign in with existing email/password
 * - logOut(): Sign out current user
 * 
 * Available state:
 * - user: Firebase Auth user object
 * - profile: Firestore user document (firstName, lastName, photoUrl, etc.)
 * - loading: Boolean indicating if auth state is being loaded
 */

import { useContext, createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../src/firebase.js";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

// Create a React Context object that will hold the global authentication data: user info, login/logout functions
const AuthContext = createContext();

/**
 * AuthContextProvider Component
 * 
 * Wraps the entire app to provide authentication state and functions to all child components
 * Listens for Firebase auth state changes and syncs with Firestore user profiles
 * 
 * @param {ReactNode} children - All components wrapped by this provider
 */
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({}); // Firebase Auth user object
  const [profile, setProfile] = useState(null); // Firestore user document
  const [loading, setLoading] = useState(true); // Loading state for initial auth check

<<<<<<< HEAD
  // Detect user online, offline logic:
  useEffect(() => {
    // only run when we know which user is logged in
    if (!user || !user.uid) return;

    const userRef = doc(db, "users", user.uid);

    // mark online + update lastActive
    const markOnline = () => {
      setDoc(
        userRef,
        {
          online: true,
          lastActive: serverTimestamp(),
        },
        { merge: true }
      ).catch(() => {});
    };

    // mark offline (fire-and-forget, no await)
    const markOffline = () => {
      setDoc(
        userRef,
        {
          online: false,
          lastActive: serverTimestamp(),
        },
        { merge: true }
      ).catch(() => {});
    };

    // immediately mark online when this effect runs
    markOnline();

    // refresh presence every 60 seconds while the tab is open
    const intervalId = setInterval(markOnline, 60_000);

    // when user closes or reloads the tab
    const handleBeforeUnload = () => {
      markOffline();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // cleanup when user logs out or component unmounts
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      markOffline();
    };
  }, [user, user?.uid]);

  // sign in function
=======
  /**
   * Google Sign-In Function
   * 
   * Opens Google OAuth popup, authenticates user, and creates/updates their Firestore profile
   * Extracts first and last name from Google display name
   * Stores user data in 'users' collection with Google profile information
   */
>>>>>>> 54c4048046e2e7a3653c22edaa8d5b1d3f92f638
  const googleSignIn = async () => {
    // create new instance of google provider
    const provider = new GoogleAuthProvider();
    
    // Open Google Login Popup and authenticate user
    const { user } = await signInWithPopup(auth, provider);
    
    // Alternative: Redirect method (currently not used due to bugs)
    // signInWithRedirect(auth, provider);

    // Extract firstName and lastName from Google display name
    // Splits "John Doe" into firstName="John", lastName="Doe"
    const [firstName = "", ...rest] = (user.displayName || "").split(" ");
    const lastName = rest.join(" ");

    // Create or update user document in Firestore 'users' collection
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      email: user.email,
      photoUrl: user.photoURL | null,
      loginType: "google-signin",
      createdAt: new Date(),
    });

    // Update Firebase Auth profile with Google display name and photo
    // Ensures consistency if user changes their Google profile
    await updateProfile(user, {
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  };

  /**
   * Email/Password Sign-Up Function
   * 
   * Creates a new Firebase Auth account and Firestore user profile
   * 
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @param {string} email - User's email address
   * @param {string} password - User's password (min 6 characters)
   */
  const doCreateUserWithEmailAndPassword = async (
    firstName,
    lastName,
    email,
    password
  ) => {
    // Create Firebase Auth account
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create user profile document in Firestore 'users' collection
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      email,
      photoUrl: null, // No photo for email signups initially
      loginType: "email-password",
      createdAt: new Date(),
    });
  };

  /**
   * Email/Password Sign-In Function
   * 
   * Signs in existing user with email and password credentials
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise} Firebase auth promise
   */
  const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ------------------------------------------------
  // Additional functions for future implementation:
  // 
  // Password Reset:
  // const doPasswordReset = (email) => {
  //   return sendPasswordResetEmail(auth, email);
  // };
  //
  // Password Change:
  // const doPasswordChange = (password) => {
  //   return updatePassword(auth.user, password);
  // };
  //
  // Email Verification:
  // const doEmailVerification = () => {
  //   return sendEmailVerification(auth.user, {
  //     url: `${window.location.origin}/dashboard`,
  //   });
  // };
  //
  // Update Profile Picture:
  // await updateProfile(auth.currentUser, { photoURL: url });
  // await updateDoc(doc(db, "users", auth.currentUser.uid), {
  //   photoURL: url, updatedAt: serverTimestamp()
  // });
  // ------------------------------------------------

  /**
   * Logout Function
   * 
   * Signs out the current user from Firebase Auth
   * Auth state listener will automatically update user/profile to null
   */
  const logOut = () => {
    signOut(auth);
  };

  /**
   * Authentication State Listener
   * 
   * Monitors Firebase Auth state changes (login/logout)
   * When user logs in, subscribes to their Firestore profile document
   * Automatically updates user and profile state in real-time
   * Cleans up listeners on component unmount or user logout
   */
  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // If no user logged in, clear profile and stop loading
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      
      // Subscribe to user's Firestore profile document for real-time updates
      const unsubProfile = onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
        setProfile(snap.data() || null);
        setLoading(false);
      });
      
      return unsubProfile;
    });
    
    // Cleanup: Unsubscribe from auth listener when component unmounts
    return () => unsubAuth();
  }, []);

  return (
    // Provide auth state and functions to all child components via Context
    <AuthContext.Provider
      value={{
        googleSignIn,
        doCreateUserWithEmailAndPassword,
        doSignInWithEmailAndPassword,
        logOut,
        user,
        profile,
        loading,
      }}
    >
      {/* All child components can now access auth state and functions */}
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook: useAuth (exported as UserAuth for backward compatibility)
 * 
 * Provides easy access to authentication context in any component
 * 
 * Usage example:
 * const { user, profile, googleSignIn, logOut, loading } = UserAuth();
 * 
 * @returns {Object} Auth context value with user, profile, functions, and loading state
 */
export const UserAuth = () => {
  return useContext(AuthContext);
};
