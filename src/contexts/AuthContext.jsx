import { useContext, createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../src/firebase.js";

// Create a React Context object that will hold the global authentication data: user info, login/logout functions
const AuthContext = createContext();

// degines a component that will wrap the entire app and give all children  access to the authentication state
// {children}: or (prop.children) represents any components inside <AuthContextProvider>...</AuthContextProvider>
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  // sign in function
  const googleSignIn = () => {
    // create new instance of google provider
    const provider = new GoogleAuthProvider();
    // call signinwithpopup function -> open Google Login Popup -> update to onStateChanged in Firebase via Google
    signInWithPopup(auth, provider);
    // call signinwithRedirect -> facing some bugs right now,
    // I will try to solve this later - Thong
    // signInWithRedirect(auth, provider);
  };

  // logout function
  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    // get the currentUser from onAuthStateChanged
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // For debugging purpose ...
      // console.log("User", currentUser);
    });
    return () => {
      unsubcribe();
    };
  }, []);

  return (
    // Return a Context Provider component
    // Give value to the rest of the app
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
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
