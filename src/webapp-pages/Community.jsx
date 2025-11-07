import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
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
  getDoc,
} from "firebase/firestore";
import { db } from "../src/firebase";

// Import new components
import CommunityStats from "../components/community/CommunityStats";
import CategorySidebar from "../components/community/CategorySidebar";
import SearchAndSort from "../components/community/SearchAndSort";
import CreatePostForm from "../components/community/CreatePostForm";
import PostsList from "../components/community/PostsList";

export default function Community() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const { user, profile } = UserAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, popular
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [votingAnimation, setVotingAnimation] = useState({}); // Track voting animations

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    const q = query(
      collection(db, "communityPosts"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle navigation to specific post via URL parameter
  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId && posts.length > 0 && !isLoading) {
      const postExists = posts.find(p => p.id === postId);
      if (postExists) {
        // Expand the target post
        setExpandedPost(postId);
        
        // Scroll to the post after a short delay to ensure rendering
        setTimeout(() => {
          const element = document.getElementById(`post-${postId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          // Clear URL parameter after navigation
          setSearchParams({});
        }, 300);
      }
    }
  }, [searchParams, posts, isLoading, setSearchParams]);

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    setIsSubmitting(true);
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
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle upvote
  const handleUpvote = async (postId, upvotes, downvotes) => {
    const postRef = doc(db, "communityPosts", postId);
    const hasUpvoted = upvotes?.includes(user.uid);
    const hasDownvoted = downvotes?.includes(user.uid);

    // Trigger animation
    setVotingAnimation((prev) => ({ ...prev, [`${postId}-up`]: true }));
    setTimeout(() => {
      setVotingAnimation((prev) => ({ ...prev, [`${postId}-up`]: false }));
    }, 300);

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

    // Trigger animation
    setVotingAnimation((prev) => ({ ...prev, [`${postId}-down`]: true }));
    setTimeout(() => {
      setVotingAnimation((prev) => ({ ...prev, [`${postId}-down`]: false }));
    }, 300);

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
  const handleCommentDownvote = async (
    postId,
    commentId,
    upvotes,
    downvotes
  ) => {
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

  // Filter by search query
  const searchedPosts = searchQuery.trim()
    ? filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPosts;

  // Sort posts
  const sortedPosts = [...searchedPosts].sort((a, b) => {
    if (sortBy === "popular") {
      const aScore = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
      const bScore = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
      return bScore - aScore;
    } else if (sortBy === "oldest") {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return aTime - bTime;
    } else {
      // newest (default)
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return bTime - aTime;
    }
  });

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

  // Get category count
  const getCategoryCount = (category) => {
    if (category === "All") return posts.length;
    return posts.filter((post) => post.category === category).length;
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <title>Untilt - Community</title>
      <style>{`

      `}</style>
      <UntiltNavBar />
      <div
        className={`min-h-screen pt-20 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
        }`}
      >
        <div className="px-4 mx-auto max-w-7xl">
          {/* Header */}
          <div className="mt-4 mb-8">
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
              Share your experiences, ask questions, and support others in their
              wellness journey.
            </p>

            {/* Live Stats */}
            <CommunityStats posts={posts} isEarthy={isEarthy} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Sidebar - Desktop */}
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              getCategoryCount={getCategoryCount}
              setIsCreatingPost={setIsCreatingPost}
              isEarthy={isEarthy}
            />

            {/* Mobile/Tablet Category Dropdown */}
            <div className="col-span-1 lg:hidden">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition shadow-md flex items-center justify-between ${
                    isEarthy
                      ? "bg-white border-2 border-tan-200 text-brown-800 hover:bg-cream-50"
                      : "bg-pale-lavender border-2 border-blue-grey text-gray-900 hover:bg-cool-grey"
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
                      : "bg-light-lavender hover:bg-medium-lavender"
                  }`}
                >
                  + Create
                </button>
              </div>

              {/* Category Dropdown Menu */}
              {isCategoryMenuOpen && (
                <div
                  className={`rounded-lg shadow-lg p-3 mb-4 ${
                    isEarthy
                      ? "bg-white border-tan-200"
                      : "bg-pale-lavender border-blue-grey"
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
                              : "bg-light-lavender text-white"
                            : isEarthy
                            ? "text-brown-700 hover:bg-cream-100"
                            : "text-gray-900 hover:bg-cool-grey"
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
              {/* Search and Sort Bar */}
              <SearchAndSort
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                resultsCount={sortedPosts.length}
                isEarthy={isEarthy}
              />

              {/* Create Post Form */}
              <CreatePostForm
                isCreatingPost={isCreatingPost}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                newPostTitle={newPostTitle}
                setNewPostTitle={setNewPostTitle}
                newPostContent={newPostContent}
                setNewPostContent={setNewPostContent}
                handleCreatePost={handleCreatePost}
                setIsCreatingPost={setIsCreatingPost}
                isSubmitting={isSubmitting}
                isEarthy={isEarthy}
              />

              {/* Posts List */}
              <PostsList
                isLoading={isLoading}
                sortedPosts={sortedPosts}
                searchQuery={searchQuery}
                user={user}
                handleUpvote={handleUpvote}
                handleDownvote={handleDownvote}
                handleDeletePost={handleDeletePost}
                setExpandedPost={setExpandedPost}
                expandedPost={expandedPost}
                commentText={commentText}
                setCommentText={setCommentText}
                handleAddComment={handleAddComment}
                handleCommentUpvote={handleCommentUpvote}
                handleCommentDownvote={handleCommentDownvote}
                votingAnimation={votingAnimation}
                getVoteCount={getVoteCount}
                timeAgo={timeAgo}
                isEarthy={isEarthy}
              />
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
              isEarthy
                ? "bg-rust-500 hover:bg-rust-600 text-white"
                : "bg-light-lavender hover:bg-medium-lavender text-white"
            }`}
            style={{
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
