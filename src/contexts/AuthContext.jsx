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
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Create a React Context object that will hold the global authentication data: user info, login/logout functions
const AuthContext = createContext();

// degines a component that will wrap the entire app and give all children  access to the authentication state
// {children}: or (prop.children) represents any components inside <AuthContextProvider>...</AuthContextProvider>
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState(null); // Firestore user document
  const [loading, setLoading] = useState(true); // Add loading state

  // sign in function
  const googleSignIn = async () => {
    // create new instance of google provider
    const provider = new GoogleAuthProvider();
    // call signinwithpopup function -> open Google Login Popup -> update to onStateChanged in Firebase via Google
    const { user } = await signInWithPopup(auth, provider);
    // call signinwithRedirect -> facing some bugs right now,
    // I will try to solve this later - Thong
    // signInWithRedirect(auth, provider);

    // extract firstName and lastName from user google full name (user.displayName)
    const [firstName = "", ...rest] = (user.displayName || "").split(" ");
    const lastName = rest.join(" ");

    // create a block inside users table with collected info
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      email: user.email,
      photoUrl: user.photoURL | null,
      loginType: "google-signin",
      createdAt: new Date(),
    });

    // in-case user changed their name and photo in their google account
    await updateProfile(user, {
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  };

  // sign up with email and password
  const doCreateUserWithEmailAndPassword = async (
    firstName,
    lastName,
    email,
    password
  ) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // create a block inside users table with collected info
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      email,
      photoUrl: null,
      loginType: "email-password",
      createdAt: new Date(),
    });
  };

  // sign in with email and password
  const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ------------------------------------------------
  // Extra functions for future implementation
  // const doPasswordReset = (email) => {
  //   return sendPasswordResetEmail(auth, email);
  // };

  // const doPasswordChange = (password) => {
  //   return updatePassword(auth.user, password);
  // };

  // const doEmailVerification = () => {
  //   return sendEmailVerification(auth.user, {
  //     url: `${window.location.origin}/dashboard`,
  //   });
  // };
  // update picture profile
  //   await updateProfile(auth.currentUser, { photoURL: url });
  // await updateDoc(doc(db, "users", auth.currentUser.uid), {
  //   photoURL: url, updatedAt: serverTimestamp()
  // });
  // ------------------------------------------------

  // logout function
  const logOut = () => {
    signOut(auth);
  };

  // --- Old ones -> simple auto set state for user/setUser
  // useEffect(() => {
  //   // get the currentUser from onAuthStateChanged
  //   const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     // For debugging purpose ...
  //     // console.log("User", currentUser);
  //   });
  //   return () => {
  //     unsubcribe();
  //   };
  // }, []);

  // Updated => auto set state for user/setUser & access user profile in users table
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const unsubProfile = onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
        setProfile(snap.data() || null);
        setLoading(false);
      });
      return unsubProfile;
    });
    return () => unsubAuth();
  }, []);

  return (
    // Return a Context Provider component
    // Give value to the rest of the app
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
      {/* ensures all child components render normally, but now have access to these values via the context. */}
      {children}
    </AuthContext.Provider>
  );
};

// create a custom Hook
export const UserAuth = () => {
  return useContext(AuthContext);
};
// Example use: const { user, googleSignIn, logOut } = UserAuth();
