import React, { createContext, useState, useContext, useEffect } from "react";
import { ACHIEVEMENTS } from "../data/achievements";
import { db, auth } from "../src/firebase";
import { doc, updateDoc, arrayUnion, onSnapshot, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AchievementContext = createContext();

export const AchievementProvider = ({ children }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setUnlockedAchievements([]);
      return;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);

    const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const existing = userData.unlockedAchievements || [];
        
        if (existing.length > unlockedAchievements.length && unlockedAchievements.length > 0) {
             const newBadgeId = existing.find(id => !unlockedAchievements.includes(id));
             const badgeDetails = Object.values(ACHIEVEMENTS).find(a => a.id === newBadgeId);
             if (badgeDetails) setCurrentNotification(badgeDetails);
        }
        
        setUnlockedAchievements(existing);
      }
    });

    return () => unsubscribeSnapshot();
  }, [currentUser, unlockedAchievements.length]); // Depend on length to detect changes

  const unlockAchievement = async (achievementId) => {
    if (!currentUser) return;

    if (unlockedAchievements.includes(achievementId)) return;

    const userDocRef = doc(db, 'users', currentUser.uid);

    try {
      const badgeDetails = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
      if (badgeDetails) setCurrentNotification(badgeDetails);

      await updateDoc(userDocRef, {
        unlockedAchievements: arrayUnion(achievementId)
      });
      
    } catch (error) {
      console.error("Error unlocking achievement:", error);
      if (error.code === 'not-found' || error.message.includes("No document to update")) {
          await setDoc(userDocRef, { unlockedAchievements: [achievementId] }, { merge: true });
      }
    }
  };

  const closeNotification = () => {
    setCurrentNotification(null);
  };

  return (
    <AchievementContext.Provider value={{ unlockedAchievements, unlockAchievement, currentNotification, closeNotification }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => useContext(AchievementContext);