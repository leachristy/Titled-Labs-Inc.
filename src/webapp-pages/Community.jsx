import { useState, useEffect } from "react";
import UntiltNavBar from "../components/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";
import { UserAuth } from "../contexts/AuthContext";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  runTransaction,
  getDoc,
} from "firebase/firestore";
import { db } from "../src/firebase";
import { Link } from "react-router-dom";

export default function Community() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const { user, profile } = UserAuth();

  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const categories = [
    "All",
    "Mental Health",
    "Self Care",
    "Success Stories",
    "Questions",
    "Resources",
    "General",
  ];

  // Fetch posts from Firebase
  useEffect(() => {
    const q = query(collection(db, "communityPosts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      await addDoc(collection(db, "communityPosts"), {
        title: newPostTitle,
        content: newPostContent,
        category: selectedCategory === "All" ? "General" : selectedCategory,
        authorId: user.uid,
        authorName: profile?.firstName
          ? `${profile.firstName} ${profile.lastName || ""}`
          : "Anonymous",
        authorAvatar: profile?.photoUrl || null,
        upvotes: [],
        downvotes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });

      setNewPostTitle("");
      setNewPostContent("");
      setIsCreatingPost(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Handle upvote
  const handleUpvote = async (postId, upvotes, downvotes) => {
    const postRef = doc(db, "communityPosts", postId);
    const hasUpvoted = upvotes?.includes(user.uid);
    const hasDownvoted = downvotes?.includes(user.uid);

    try {
      if (hasUpvoted) {
        await updateDoc(postRef, { upvotes: arrayRemove(user.uid) });
      } else {
        if (hasDownvoted) {
          await updateDoc(postRef, { downvotes: arrayRemove(user.uid) });
        }
        await updateDoc(postRef, { upvotes: arrayUnion(user.uid) });
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  // Handle downvote
  const handleDownvote = async (postId, upvotes, downvotes) => {
    const postRef = doc(db, "communityPosts", postId);
    const hasUpvoted = upvotes?.includes(user.uid);
    const hasDownvoted = downvotes?.includes(user.uid);

    try {
      if (hasDownvoted) {
        await updateDoc(postRef, { downvotes: arrayRemove(user.uid) });
      } else {
        if (hasUpvoted) {
          await updateDoc(postRef, { upvotes: arrayRemove(user.uid) });
        }
        await updateDoc(postRef, { downvotes: arrayUnion(user.uid) });
      }
    } catch (error) {
      console.error("Error downvoting:", error);
    }
  };

  // Add comment
  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    const postRef = doc(db, "communityPosts", postId);
    const newComment = {
      id: Date.now().toString(),
      text,
      authorId: user.uid,
      authorName: profile?.firstName
        ? `${profile.firstName} ${profile.lastName || ""}`
        : "Anonymous",
      authorAvatar: profile?.photoUrl || null,
      upvotes: [],
      downvotes: [],
      createdAt: new Date().toISOString(),
    };

    try {
      // First, get the current document
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        console.error("Post does not exist!");
        alert("Post not found. Please refresh the page.");
        return;
      }

      const currentComments = postDoc.data().comments || [];
      const updatedComments = [...currentComments, newComment];
      
      // Update with the new comments array
      await updateDoc(postRef, {
        comments: updatedComments,
      });
      
      setCommentText({ ...commentText, [postId]: "" });
      console.log("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      alert(`Failed to add comment: ${error.message}`);
    }
  };

  // Handle comment upvote
  const handleCommentUpvote = async (postId, commentId, upvotes, downvotes) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const hasUpvoted = upvotes?.includes(user.uid);
    const hasDownvoted = downvotes?.includes(user.uid);

    const updatedComments = post.comments.map((comment) => {
      if (comment.id === commentId) {
        let newUpvotes = [...(comment.upvotes || [])];
        let newDownvotes = [...(comment.downvotes || [])];

        if (hasUpvoted) {
          newUpvotes = newUpvotes.filter((id) => id !== user.uid);
        } else {
          if (hasDownvoted) {
            newDownvotes = newDownvotes.filter((id) => id !== user.uid);
          }
          newUpvotes.push(user.uid);
        }

        return { ...comment, upvotes: newUpvotes, downvotes: newDownvotes };
      }
      return comment;
    });

    try {
      const postRef = doc(db, "communityPosts", postId);
      await updateDoc(postRef, {
        comments: updatedComments,
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  // Handle comment downvote
  const handleCommentDownvote = async (postId, commentId, upvotes, downvotes) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const hasUpvoted = upvotes?.includes(user.uid);
    const hasDownvoted = downvotes?.includes(user.uid);

    const updatedComments = post.comments.map((comment) => {
      if (comment.id === commentId) {
        let newUpvotes = [...(comment.upvotes || [])];
        let newDownvotes = [...(comment.downvotes || [])];

        if (hasDownvoted) {
          newDownvotes = newDownvotes.filter((id) => id !== user.uid);
        } else {
          if (hasUpvoted) {
            newUpvotes = newUpvotes.filter((id) => id !== user.uid);
          }
          newDownvotes.push(user.uid);
        }

        return { ...comment, upvotes: newUpvotes, downvotes: newDownvotes };
      }
      return comment;
    });

    try {
      const postRef = doc(db, "communityPosts", postId);
      await updateDoc(postRef, {
        comments: updatedComments,
      });
    } catch (error) {
      console.error("Error downvoting comment:", error);
    }
  };

  // Delete post
  const handleDeletePost = async (postId, authorId) => {
    if (user.uid !== authorId) return;

    try {
      await deleteDoc(doc(db, "communityPosts", postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Filter posts by category
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  // Get vote count
  const getVoteCount = (upvotes = [], downvotes = []) => {
    return upvotes.length - downvotes.length;
  };

  // Format time ago
  const timeAgo = (timestamp) => {
    if (!timestamp) return "just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return "1 year ago";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return "1 month ago";

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return "1 day ago";

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return "1 hour ago";

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return "1 minute ago";

    return "just now";
  };

  return (
    <>
      <title>Untilt - Community</title>
      <UntiltNavBar />
      <div
        className={`min-h-screen pt-20 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-[#373E4F]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 mt-4">
            <h1
              className={`text-4xl font-bold mb-2 ${
                isEarthy ? "text-brown-800" : "text-white"
              }`}
            >
              Community Forum
            </h1>
            <p
              className={`text-lg ${
                isEarthy ? "text-brown-600" : "text-purple-200"
              }`}
            >
              Share your experiences, ask questions, and support others in their wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div
                className={`rounded-lg shadow-lg p-4 ${
                  isEarthy ? "bg-white border-tan-200" : "bg-[#DFD2D5] border-[#8090B0]"
                } border sticky top-24`}
              >
                <h2
                  className={`text-lg font-bold mb-4 ${
                    isEarthy ? "text-brown-800" : "text-gray-900"
                  }`}
                >
                  Categories
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
                        selectedCategory === category
                          ? isEarthy
                            ? "bg-rust-500 text-white"
                            : "bg-[#c7b4e2] text-white"
                          : isEarthy
                          ? "text-brown-700 hover:bg-cream-100"
                          : "text-gray-900 hover:bg-[#ABAAC0]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsCreatingPost(!isCreatingPost)}
                  className={`w-full mt-6 px-4 py-3 rounded-lg font-bold text-white transition shadow-md hover:shadow-lg ${
                    isEarthy
                      ? "bg-rust-500 hover:bg-rust-600"
                      : "bg-[#c7b4e2] hover:bg-[#b49fd3]"
                  }`}
                >
                  + Create Post
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Category Dropdown */}
            <div className="lg:hidden col-span-1">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition shadow-md flex items-center justify-between ${
                    isEarthy
                      ? "bg-white border-2 border-tan-200 text-brown-800 hover:bg-cream-50"
                      : "bg-[#DFD2D5] border-2 border-[#8090B0] text-gray-900 hover:bg-[#ABAAC0]"
                  }`}
                >
                  <span>Category: {selectedCategory}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isCategoryMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setIsCreatingPost(!isCreatingPost)}
                  className={`px-4 py-3 rounded-lg font-bold text-white transition shadow-md ${
                    isEarthy
                      ? "bg-rust-500 hover:bg-rust-600"
                      : "bg-[#c7b4e2] hover:bg-[#b49fd3]"
                  }`}
                >
                  + Create
                </button>
              </div>

              {/* Category Dropdown Menu */}
              {isCategoryMenuOpen && (
                <div
                  className={`rounded-lg shadow-lg p-3 mb-4 ${
                    isEarthy ? "bg-white border-tan-200" : "bg-[#DFD2D5] border-[#8090B0]"
                  } border`}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg transition font-medium text-sm ${
                          selectedCategory === category
                            ? isEarthy
                              ? "bg-rust-500 text-white"
                              : "bg-[#c7b4e2] text-white"
                            : isEarthy
                            ? "text-brown-700 hover:bg-cream-100"
                            : "text-gray-900 hover:bg-[#ABAAC0]"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Create Post Form */}
              {isCreatingPost && (
                <div
                  className={`rounded-lg shadow-lg p-6 mb-6 ${
                    isEarthy ? "bg-white border-tan-200" : "bg-[#DFD2D5] border-[#8090B0]"
                  } border`}
                >
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      isEarthy ? "text-brown-800" : "text-gray-900"
                    }`}
                  >
                    Create a New Post
                  </h2>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isEarthy ? "text-brown-700" : "text-gray-700"
                        }`}
                      >
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                          isEarthy
                            ? "border-tan-300 focus:ring-rust-500"
                            : "bg-white text-gray-900 border-[#8090B0] focus:ring-[#c7b4e2]"
                        }`}
                      >
                        {categories.filter((c) => c !== "All").map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isEarthy ? "text-brown-700" : "text-gray-700"
                        }`}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="What's on your mind?"
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                          isEarthy
                            ? "border-tan-300 focus:ring-rust-500"
                            : "bg-white text-gray-900 border-[#8090B0] focus:ring-[#c7b4e2]"
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isEarthy ? "text-brown-700" : "text-gray-700"
                        }`}
                      >
                        Content
                      </label>
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share your thoughts, experiences, or questions..."
                        rows="6"
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 resize-none ${
                          isEarthy
                            ? "border-tan-300 focus:ring-rust-500"
                            : "bg-white text-gray-900 border-[#8090B0] focus:ring-[#c7b4e2]"
                        }`}
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className={`flex-1 px-6 py-2 rounded-lg font-bold text-white transition ${
                          isEarthy
                            ? "bg-rust-500 hover:bg-rust-600"
                            : "bg-[#c7b4e2] hover:bg-[#b49fd3]"
                        }`}
                      >
                        Post
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingPost(false)}
                        className={`px-6 py-2 rounded-lg font-medium transition ${
                          isEarthy
                            ? "bg-tan-200 hover:bg-tan-300 text-brown-800"
                            : "bg-gray-200 hover:bg-gray-300 text-charcoal-grey"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Posts List */}
              {filteredPosts.length === 0 ? (
                <div
                  className={`rounded-lg shadow-lg p-12 text-center ${
                    isEarthy ? "bg-white border-tan-200" : "bg-[#DFD2D5] border-[#8090B0]"
                  } border`}
                >
                  <p
                    className={`text-lg ${
                      isEarthy ? "text-brown-600" : "text-gray-700"
                    }`}
                  >
                    No posts yet. Be the first to start a conversation!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`rounded-lg shadow-lg ${
                        isEarthy ? "bg-white border-tan-200" : "bg-[#DFD2D5] border-[#8090B0]"
                      } border overflow-hidden`}
                    >
                      <div className="flex">
                        {/* Vote Section */}
                        <div
                          className={`flex flex-col items-center p-4 ${
                            isEarthy ? "bg-cream-50" : "bg-[#ABAAC0]"
                          }`}
                        >
                          <button
                            onClick={() =>
                              handleUpvote(post.id, post.upvotes, post.downvotes)
                            }
                            className={`transition ${
                              post.upvotes?.includes(user.uid)
                                ? isEarthy
                                  ? "text-rust-600"
                                  : "text-[#c7b4e2]"
                                : isEarthy
                                ? "text-brown-400 hover:text-rust-500"
                                : "text-white hover:text-[#c7b4e2]"
                            }`}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 3l6 7h-5v7H9v-7H4l6-7z" />
                            </svg>
                          </button>
                          <span
                            className={`text-lg font-bold my-1 ${
                              isEarthy ? "text-brown-800" : "text-gray-900"
                            }`}
                          >
                            {getVoteCount(post.upvotes, post.downvotes)}
                          </span>
                          <button
                            onClick={() =>
                              handleDownvote(post.id, post.upvotes, post.downvotes)
                            }
                            className={`transition ${
                              post.downvotes?.includes(user.uid)
                                ? isEarthy
                                  ? "text-rust-600"
                                  : "text-[#c7b4e2]"
                                : isEarthy
                                ? "text-brown-400 hover:text-rust-500"
                                : "text-white hover:text-[#c7b4e2]"
                            }`}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 17l-6-7h5V3h2v7h5l-6 7z" />
                            </svg>
                          </button>
                        </div>

                        {/* Post Content */}
                        <div className="flex-1 p-4">
                          {/* Post Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded ${
                                  isEarthy
                                    ? "bg-tan-200 text-brown-800"
                                    : "bg-[#c7b4e2] text-gray-900"
                                }`}
                              >
                                {post.category}
                              </span>
                              <span
                                className={`text-sm ${
                                  isEarthy ? "text-brown-600" : "text-gray-600"
                                }`}
                              >
                                Posted by {" "}
                                <Link
                                  to={`/profile/${post.authorId}`}
                                  className="font-semibold hover:underline"
                                  >
                                    {post.authorName}
                                </Link>{" "} 
                                • {timeAgo(post.createdAt)}
                              </span>
                            </div>
                            {user.uid === post.authorId && (
                              <button
                                onClick={() => handleDeletePost(post.id, post.authorId)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </div>

                          {/* Post Title & Content */}
                          <h3
                            className={`text-xl font-bold mb-2 ${
                              isEarthy ? "text-brown-800" : "text-gray-900"
                            }`}
                          >
                            {post.title}
                          </h3>
                          <p
                            className={`text-sm mb-4 whitespace-pre-wrap ${
                              isEarthy ? "text-brown-700" : "text-gray-700"
                            }`}
                          >
                            {post.content}
                          </p>

                          {/* Post Actions */}
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() =>
                                setExpandedPost(
                                  expandedPost === post.id ? null : post.id
                                )
                              }
                              className={`flex items-center space-x-1 text-sm font-medium transition ${
                                isEarthy
                                  ? "text-brown-600 hover:text-rust-500"
                                  : "text-gray-600 hover:text-[#c7b4e2]"
                              }`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span>
                                {post.comments?.length || 0} Comments
                              </span>
                            </button>
                          </div>

                          {/* Comments Section */}
                          {expandedPost === post.id && (
                            <div className="mt-4 pt-4 border-t">
                              {/* Add Comment */}
                              <div className="mb-4">
                                <textarea
                                  value={commentText[post.id] || ""}
                                  onChange={(e) =>
                                    setCommentText({
                                      ...commentText,
                                      [post.id]: e.target.value,
                                    })
                                  }
                                  placeholder="Write a comment..."
                                  rows="2"
                                  className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 resize-none ${
                                    isEarthy
                                      ? "border-tan-300 focus:ring-rust-500"
                                      : "bg-white text-gray-900 border-[#8090B0] focus:ring-[#c7b4e2]"
                                  }`}
                                />
                                <button
                                  onClick={() => handleAddComment(post.id)}
                                  className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
                                    isEarthy
                                      ? "bg-rust-500 hover:bg-rust-600"
                                      : "bg-[#c7b4e2] hover:bg-[#b49fd3]"
                                  }`}
                                >
                                  Comment
                                </button>
                              </div>

                              {/* Comments List */}
                              <div className="space-y-3">
                                {post.comments?.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className={`rounded-lg ${
                                      isEarthy ? "bg-cream-50" : "bg-[#ABAAC0]"
                                    }`}
                                  >
                                    <div className="flex">
                                      {/* Comment Vote Section */}
                                      <div className="flex flex-col items-center p-2 pr-3">
                                        <button
                                          onClick={() =>
                                            handleCommentUpvote(
                                              post.id,
                                              comment.id,
                                              comment.upvotes || [],
                                              comment.downvotes || []
                                            )
                                          }
                                          className={`transition ${
                                            comment.upvotes?.includes(user.uid)
                                              ? isEarthy
                                                ? "text-rust-600"
                                                : "text-[#c7b4e2]"
                                              : isEarthy
                                              ? "text-brown-400 hover:text-rust-500"
                                              : "text-white hover:text-[#c7b4e2]"
                                          }`}
                                        >
                                          <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="M10 3l6 7h-5v7H9v-7H4l6-7z" />
                                          </svg>
                                        </button>
                                        <span
                                          className={`text-sm font-semibold my-0.5 ${
                                            isEarthy ? "text-brown-800" : "text-gray-900"
                                          }`}
                                        >
                                          {getVoteCount(
                                            comment.upvotes || [],
                                            comment.downvotes || []
                                          )}
                                        </span>
                                        <button
                                          onClick={() =>
                                            handleCommentDownvote(
                                              post.id,
                                              comment.id,
                                              comment.upvotes || [],
                                              comment.downvotes || []
                                            )
                                          }
                                          className={`transition ${
                                            comment.downvotes?.includes(user.uid)
                                              ? isEarthy
                                                ? "text-rust-600"
                                                : "text-[#c7b4e2]"
                                              : isEarthy
                                              ? "text-brown-400 hover:text-rust-500"
                                              : "text-white hover:text-[#c7b4e2]"
                                          }`}
                                        >
                                          <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="M10 17l-6-7h5V3h2v7h5l-6 7z" />
                                          </svg>
                                        </button>
                                      </div>

                                      {/* Comment Content */}
                                      <div className="flex-1 p-3">
                                        <div className="flex items-start space-x-3">
                                          <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                                              isEarthy ? "bg-rust-500" : "bg-[#c7b4e2]"
                                            }`}
                                          >
                                            {comment.authorName.charAt(0).toUpperCase()}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                              <span
                                                className={`text-sm font-semibold ${
                                                  isEarthy
                                                    ? "text-brown-800"
                                                    : "text-gray-900"
                                                }`}
                                              >
                                                {comment.authorName}
                                              </span>
                                              <span
                                                className={`text-xs ${
                                                  isEarthy
                                                    ? "text-brown-600"
                                                    : "text-gray-600"
                                                }`}
                                              >
                                                {timeAgo(comment.createdAt)}
                                              </span>
                                            </div>
                                            <p
                                              className={`text-sm ${
                                                isEarthy
                                                  ? "text-brown-700"
                                                  : "text-gray-700"
                                              }`}
                                            >
                                              {comment.text}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
