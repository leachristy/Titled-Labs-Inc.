import React, { createContext, useState, useContext, useEffect } from "react";
import { ACHIEVEMENTS } from "../data/achievements";
import { db, auth } from "../src/firebase";
import { doc, updateDoc, arrayUnion, onSnapshot, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AchievementContext = createContext();

export const AchievementProvider = ({ children }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [achievementStats, setAchievementStats] = useState({});
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
      setAchievementStats({});
      return;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);

    const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const existing = userData.unlockedAchievements || [];
        const stats = userData.achievementStats || {}; 

        if (existing.length > unlockedAchievements.length && unlockedAchievements.length > 0) {
             const newBadgeId = existing.find(id => !unlockedAchievements.includes(id));
             const badgeDetails = Object.values(ACHIEVEMENTS).find(a => a.id === newBadgeId);
             if (badgeDetails && !badgeDetails.repeatable) setCurrentNotification(badgeDetails);
        }
        
        setUnlockedAchievements(existing);
        setAchievementStats(stats);
      }
    });

    return () => unsubscribeSnapshot();
  }, [currentUser, unlockedAchievements.length]);

  // --- UNLOCK LOGIC ---
  const unlockAchievement = async (achievementId) => {
    if (!currentUser) return;

    const userDocRef = doc(db, 'users', currentUser.uid);
    const badgeDetails = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
    if (!badgeDetails) return;

    const todayISO = new Date().toISOString(); 

    try {
      if (badgeDetails.repeatable) {
        const currentStat = achievementStats[achievementId] || { count: 0, lastUnlocked: null };
        const todayDateString = new Date().toDateString(); // For daily comparison

        const lastDateString = currentStat.lastUnlocked ? new Date(currentStat.lastUnlocked).toDateString() : null;

        if (lastDateString === todayDateString) {
          console.log("Already earned this daily badge today.");
          return; 
        }

        const newCount = (currentStat.count || 0) + 1;
        
        setCurrentNotification({
          ...badgeDetails,
          customTitle: `${badgeDetails.title} (${newCount}x)`
        });

        await setDoc(userDocRef, {
          unlockedAchievements: arrayUnion(achievementId),
          achievementStats: {
            [achievementId]: {
              count: newCount,
              lastUnlocked: todayISO
            }
          }
        }, { merge: true });

      } else {
        if (unlockedAchievements.includes(achievementId)) return;

        setCurrentNotification(badgeDetails);

        await setDoc(userDocRef, {
          unlockedAchievements: arrayUnion(achievementId),
          achievementStats: {
            [achievementId]: {
              count: 1,
              lastUnlocked: todayISO
            }
          }
        }, { merge: true });
      }
      
    } catch (error) {
      console.error("Error unlocking achievement:", error);
    }
  };

  const closeNotification = () => {
    setCurrentNotification(null);
  };

  return (
    <AchievementContext.Provider value={{ 
      unlockedAchievements, 
      achievementStats, 
      unlockAchievement, 
      currentNotification, 
      closeNotification 
    }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => useContext(AchievementContext);