import React from 'react'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../src/firebase";
import { useNavigate } from "react-router-dom";
import UntiltNavBar from '../components/navigation/UntiltNavBar';
import { useTheme } from "../contexts/ThemeContext";

export const FriendProfilePage = () => {
    const { uid } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const { currentTheme } = useTheme();
    const isEarthy = currentTheme === "earthy";
  
    // Fetch profile info
    useEffect(() => {
      const fetchProfile = async () => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      };
  
      const fetchPosts = async () => {
        const q = query(collection(db, "communityPosts"), where("authorId", "==", uid));
        const snapshot = await getDocs(q);
        const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserPosts(postsData);
      };
  
      fetchProfile();
      fetchPosts();
    }, [uid]);
  
    if (!profile) return <p>Loading profile...</p>;
  
    return (
    <>
    <UntiltNavBar />
    <div className={`min-h-screen  ${
        isEarthy ? "bg-cream-100" : "bg-pale-lavender"
      }`}
      style={{
        backgroundColor: isEarthy ? undefined : "var(--pale-lavender)",
      }}>
      <div className="max-w-4xl mx-auto p-6 mt-20">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold">
            {profile.firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-sm text-gray-500">{profile.bio || "No bio yet"}</p>
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate(`/chat/${uid}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Message
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add Friend
        </button>
        </div>
  
        {/* User Posts */}
        <h2 className="text-xl font-bold mb-4">Posts by {profile.firstName}</h2>
        <div className="space-y-4">
          {userPosts.length === 0 && <p>No posts yet.</p>}
          {userPosts.map((post) => (
            <div key={post.id} className="border p-4 rounded-lg bg-white shadow">
              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
              <p className="text-sm text-gray-700">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
    );
}
