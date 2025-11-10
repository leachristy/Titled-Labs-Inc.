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
import Pagination from "../components/community/Pagination";

export default function Community() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const { user, profile } = UserAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]); // All posts from Firebase
  
  // New post creation state
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImageUrl, setNewPostImageUrl] = useState(""); // Image URL from upload or direct URL
  const [newPostVideoUrl, setNewPostVideoUrl] = useState(""); // YouTube/Vimeo/direct video URL
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreatingPost, setIsCreatingPost] = useState(false); // Show/hide create post form
  const [expandedPost, setExpandedPost] = useState(null); // Which post's comments are expanded
  const [commentText, setCommentText] = useState({}); // Comment input text by post ID
  
  // Edit mode state
  const [editingPost, setEditingPost] = useState(null); // ID of post being edited
  const [editingComment, setEditingComment] = useState(null); // Composite ID of comment being edited (postId-commentId)
  
  // Mobile menu state
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  
  // Loading and sorting state
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest"); // Options: newest, oldest, popular
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // For post creation
  
  // Scroll state
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [votingAnimation, setVotingAnimation] = useState({}); // Track voting button animations
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // Current page number (1-indexed)
  const POSTS_PER_PAGE = 5; // Number of posts to display per page

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

  /**
   * Fetches all posts from Firebase Firestore
   * Sets up real-time listener that updates whenever posts collection changes
   */
  useEffect(() => {
    // Query posts collection ordered by creation date (newest first)
    const q = query(
      collection(db, "communityPosts"),
      orderBy("createdAt", "desc")
    );
    
    // Set up real-time listener
    // This will automatically update the posts array whenever data changes in Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setIsLoading(false); // Stop loading spinner once data is fetched
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  /**
   * Handle navigation to specific post via URL parameter
   * Expands and scrolls to a post when ?postId=xyz is in the URL
   * This allows direct linking to specific posts
   */
  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId && posts.length > 0 && !isLoading) {
      const postExists = posts.find(p => p.id === postId);
      if (postExists) {
        // Expand the target post to show comments
        setExpandedPost(postId);
        
        // Scroll to the post after a short delay to ensure rendering is complete
        setTimeout(() => {
          const element = document.getElementById(`post-${postId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          // Clear URL parameter after navigation to prevent re-scrolling
          setSearchParams({});
        }, 300);
      }
    }
  }, [searchParams, posts, isLoading, setSearchParams]);

  /**
   * Creates a new post and adds it to Firebase Firestore
   * Validates that title and content are not empty
   * 
   * @param {Event} e - Form submit event
   */
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    setIsSubmitting(true);
    try {
      // Add new post to Firestore
      await addDoc(collection(db, "communityPosts"), {
        title: newPostTitle,
        content: newPostContent,
        imageUrl: newPostImageUrl.trim() || null, // Optional image URL
        videoUrl: newPostVideoUrl.trim() || null, // Optional video URL
        category: selectedCategory === "All" ? "General" : selectedCategory,
        authorId: user.uid,
        authorName: profile?.firstName
          ? `${profile.firstName} ${profile.lastName || ""}`
          : "Anonymous",
        authorAvatar: profile?.photoUrl || null,
        upvotes: [], // Initialize empty vote arrays
        downvotes: [],
        comments: [],
        createdAt: serverTimestamp(), // Firebase server timestamp
      });

      // Reset form fields
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImageUrl("");
      setNewPostVideoUrl("");
      setIsCreatingPost(false);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles upvote action on a post
   * Toggles upvote and removes downvote if present
   * Shows animation feedback on vote button
   * 
   * @param {string} postId - ID of the post to upvote
   * @param {Array<string>} upvotes - Array of user IDs who upvoted
   * @param {Array<string>} downvotes - Array of user IDs who downvoted
   */
  const handleUpvote = async (postId, upvotes, downvotes) => {
    const postRef = doc(db, "communityPosts", postId);
    const hasUpvoted = upvotes?.includes(user.uid);
    const hasDownvoted = downvotes?.includes(user.uid);

    // Trigger animation feedback (300ms pulse effect)
    setVotingAnimation((prev) => ({ ...prev, [`${postId}-up`]: true }));
    setTimeout(() => {
      setVotingAnimation((prev) => ({ ...prev, [`${postId}-up`]: false }));
    }, 300);

    try {
      if (hasUpvoted) {
        // User already upvoted, so remove the upvote (un-upvote)
        await updateDoc(postRef, { upvotes: arrayRemove(user.uid) });
      } else {
        // Add upvote
        if (hasDownvoted) {
          // Remove existing downvote first
          await updateDoc(postRef, { downvotes: arrayRemove(user.uid) });
        }
        await updateDoc(postRef, { upvotes: arrayUnion(user.uid) });
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  /**
   * Handles downvote action on a post
   * Toggles downvote and removes upvote if present
   * Shows animation feedback on vote button
   * 
   * @param {string} postId - ID of the post to downvote
   * @param {Array<string>} upvotes - Array of user IDs who upvoted
   * @param {Array<string>} downvotes - Array of user IDs who downvoted
   */
  const handleDownvote = async (postId, upvotes, downvotes) => {
    const postRef = doc(db, "communityPosts", postId);
    const hasUpvoted = upvotes?.includes(user.uid);
    const hasDownvoted = downvotes?.includes(user.uid);

    // Trigger animation feedback (300ms pulse effect)
    setVotingAnimation((prev) => ({ ...prev, [`${postId}-down`]: true }));
    setTimeout(() => {
      setVotingAnimation((prev) => ({ ...prev, [`${postId}-down`]: false }));
    }, 300);

    try {
      if (hasDownvoted) {
        // User already downvoted, so remove the downvote (un-downvote)
        await updateDoc(postRef, { downvotes: arrayRemove(user.uid) });
      } else {
        // Add downvote
        if (hasUpvoted) {
          // Remove existing upvote first
          await updateDoc(postRef, { upvotes: arrayRemove(user.uid) });
        }
        await updateDoc(postRef, { downvotes: arrayUnion(user.uid) });
      }
    } catch (error) {
      console.error("Error downvoting:", error);
    }
  };

  /**
   * Adds a new comment to a post
   * Creates comment object with author info and timestamps
   * 
   * @param {string} postId - ID of the post to comment on
   */
  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return; // Don't add empty comments

    const postRef = doc(db, "communityPosts", postId);
    
    // Create new comment object
    const newComment = {
      id: Date.now().toString(), // Simple unique ID based on timestamp
      text,
      authorId: user.uid,
      authorName: profile?.firstName
        ? `${profile.firstName} ${profile.lastName || ""}`
        : "Anonymous",
      authorAvatar: profile?.photoUrl || null,
      upvotes: [], // Initialize empty vote arrays
      downvotes: [],
      createdAt: new Date().toISOString(), // ISO string for timestamp
    };

    try {
      // First, get the current document to ensure it exists
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        console.error("Post does not exist!");
        alert("Post not found. Please refresh the page.");
        return;
      }

      // Add new comment to existing comments array
      const currentComments = postDoc.data().comments || [];
      const updatedComments = [...currentComments, newComment];

      // Update Firestore with the new comments array
      await updateDoc(postRef, {
        comments: updatedComments,
      });

      // Clear the comment input field for this post
      setCommentText({ ...commentText, [postId]: "" });
      console.log("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      alert(`Failed to add comment: ${error.message}`);
    }
  };

  /**
   * Handles upvote action on a comment
   * Toggles upvote and removes downvote if present
   * Updates the entire comments array in Firestore
   * 
   * @param {string} postId - ID of the post containing the comment
   * @param {string} commentId - ID of the comment to upvote
   * @param {Array<string>} upvotes - Array of user IDs who upvoted this comment
   * @param {Array<string>} downvotes - Array of user IDs who downvoted this comment
   */
  const handleCommentUpvote = async (postId, commentId, upvotes, downvotes) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const hasUpvoted = upvotes?.includes(user.uid);
    const hasDownvoted = downvotes?.includes(user.uid);

    // Map through comments to find and update the target comment
    const updatedComments = post.comments.map((comment) => {
      if (comment.id === commentId) {
        let newUpvotes = [...(comment.upvotes || [])];
        let newDownvotes = [...(comment.downvotes || [])];

        if (hasUpvoted) {
          // Remove upvote (un-upvote)
          newUpvotes = newUpvotes.filter((id) => id !== user.uid);
        } else {
          // Add upvote
          if (hasDownvoted) {
            // Remove existing downvote first
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
      // Update post with modified comments array
      await updateDoc(postRef, {
        comments: updatedComments,
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  /**
   * Handles downvote action on a comment
   * Toggles downvote and removes upvote if present
   * Updates the entire comments array in Firestore
   * 
   * @param {string} postId - ID of the post containing the comment
   * @param {string} commentId - ID of the comment to downvote
   * @param {Array<string>} upvotes - Array of user IDs who upvoted this comment
   * @param {Array<string>} downvotes - Array of user IDs who downvoted this comment
   */
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

    // Map through comments to find and update the target comment
    const updatedComments = post.comments.map((comment) => {
      if (comment.id === commentId) {
        let newUpvotes = [...(comment.upvotes || [])];
        let newDownvotes = [...(comment.downvotes || [])];

        if (hasDownvoted) {
          // Remove downvote (un-downvote)
          newDownvotes = newDownvotes.filter((id) => id !== user.uid);
        } else {
          // Add downvote
          if (hasUpvoted) {
            // Remove existing upvote first
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

  /**
   * Deletes a post from Firestore
   * Only allows deletion if current user is the post author
   */
  const handleDeletePost = async (postId, authorId) => {
    if (user.uid !== authorId) return; // Security check

    try {
      await deleteDoc(doc(db, "communityPosts", postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  /**
   * Updates a post in Firestore with edited content
   * Updates title, content, image URL, video URL, and adds editedAt timestamp
   */
  const handleEditPost = async (postId, updatedTitle, updatedContent, updatedImageUrl, updatedVideoUrl) => {
    try {
      const postRef = doc(db, "communityPosts", postId);
      await updateDoc(postRef, {
        title: updatedTitle,
        content: updatedContent,
        imageUrl: updatedImageUrl?.trim() || null, // Store null if empty
        videoUrl: updatedVideoUrl?.trim() || null, // Store null if empty
        editedAt: serverTimestamp(), // Add timestamp to show post was edited
      });
      setEditingPost(null); // Exit edit mode
    } catch (error) {
      console.error("Error editing post:", error);
      alert("Failed to edit post. Please try again.");
    }
  };

  /**
   * Updates a comment in a post
   * Finds the comment in the post's comments array and updates its text
   * Also adds editedAt timestamp to the comment
   */
  const handleEditComment = async (postId, commentId, updatedText) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return; // Post not found

    // Map through comments array and update the target comment
    const updatedComments = post.comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          text: updatedText,
          editedAt: new Date().toISOString(), // Add edited timestamp
        };
      }
      return comment;
    });

    try {
      const postRef = doc(db, "communityPosts", postId);
      await updateDoc(postRef, {
        comments: updatedComments, // Update entire comments array
      });
      setEditingComment(null); // Exit edit mode
    } catch (error) {
      console.error("Error editing comment:", error);
      alert("Failed to edit comment. Please try again.");
    }
  };

  /**
   * Deletes a comment from a post
   * Filters out the comment from the post's comments array
   */
  const handleDeleteComment = async (postId, commentId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return; // Post not found

    // Filter out the comment to delete
    const updatedComments = post.comments.filter((comment) => comment.id !== commentId);

    try {
      const postRef = doc(db, "communityPosts", postId);
      await updateDoc(postRef, {
        comments: updatedComments,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  // Filter posts by category
  // "All" shows all posts, otherwise filter by matching category
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  // Filter by search query
  // Searches in post title, content, and author name (case-insensitive)
  const searchedPosts = searchQuery.trim()
    ? filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : filteredPosts;

  // Sort posts based on selected sort option
  const sortedPosts = [...searchedPosts].sort((a, b) => {
    if (sortBy === "popular") {
      // Sort by vote score (upvotes - downvotes)
      const aScore = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
      const bScore = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
      return bScore - aScore; // Highest score first
    } else if (sortBy === "oldest") {
      // Sort by creation date (oldest first)
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return aTime - bTime;
    } else {
      // Default: Sort by newest first
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return bTime - aTime;
    }
  });

  // Pagination logic
  // Calculate total number of pages needed
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  
  // Calculate which posts to show on current page
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE; // First post index
  const endIndex = startIndex + POSTS_PER_PAGE; // Last post index + 1
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex); // Extract posts for current page

  // Reset to page 1 when filters change
  // This ensures users don't end up on an empty page after filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  // Scroll to top when page changes
  // Provides better UX by showing the start of the new page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);  // Get vote count
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

  /**
   * Get the count of posts in a specific category
   * Returns total posts for "All" category
   * 
   * @param {string} category - Category name to count
   * @returns {number} Number of posts in the category
   */
  const getCategoryCount = (category) => {
    if (category === "All") return posts.length;
    return posts.filter((post) => post.category === category).length;
  };

  /**
   * Smoothly scrolls the page to the top
   * Used in "Back to Top" button
   */
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
          {/* Header Section - Title and description */}
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

            {/* Live Stats - Shows real-time community statistics */}
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

            {/* Mobile/Tablet Category Dropdown - Shows on smaller screens */}
            <div className="col-span-1 lg:hidden">
              <div className="flex gap-2 mb-4">
                {/* Category selector button */}
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition shadow-md flex items-center justify-between ${
                    isEarthy
                      ? "bg-white border-2 border-tan-200 text-brown-800 hover:bg-cream-50"
                      : "bg-pale-lavender border-2 border-blue-grey text-gray-900 hover:bg-cool-grey"
                  }`}
                >
                  <span>Category: {selectedCategory}</span>
                  {/* Dropdown arrow icon - rotates when open */}
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
                {/* Create post button */}
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

              {/* Category Dropdown Menu - Appears when button is clicked */}
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

            {/* Main Content Area - Contains posts, search, and pagination */}
            <div className="lg:col-span-3">
              {/* Search and Sort Bar - Filters and sorts posts */}
              <SearchAndSort
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                resultsCount={sortedPosts.length}
                isEarthy={isEarthy}
              />

              {/* Create Post Form - Shows when user clicks "Create Post" button */}
              <CreatePostForm
                isCreatingPost={isCreatingPost}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                newPostTitle={newPostTitle}
                setNewPostTitle={setNewPostTitle}
                newPostContent={newPostContent}
                setNewPostContent={setNewPostContent}
                newPostImageUrl={newPostImageUrl}
                setNewPostImageUrl={setNewPostImageUrl}
                newPostVideoUrl={newPostVideoUrl}
                setNewPostVideoUrl={setNewPostVideoUrl}
                handleCreatePost={handleCreatePost}
                setIsCreatingPost={setIsCreatingPost}
                isSubmitting={isSubmitting}
                isEarthy={isEarthy}
              />

              {/* Posts List - Displays paginated posts with all interaction handlers */}
              <PostsList
                isLoading={isLoading}
                sortedPosts={paginatedPosts} // Only shows current page's posts
                searchQuery={searchQuery}
                user={user}
                handleUpvote={handleUpvote}
                handleDownvote={handleDownvote}
                handleDeletePost={handleDeletePost}
                handleEditPost={handleEditPost}
                handleEditComment={handleEditComment}
                handleDeleteComment={handleDeleteComment}
                setExpandedPost={setExpandedPost}
                expandedPost={expandedPost}
                commentText={commentText}
                setCommentText={setCommentText}
                handleAddComment={handleAddComment}
                handleCommentUpvote={handleCommentUpvote}
                handleCommentDownvote={handleCommentDownvote}
                editingPost={editingPost}
                setEditingPost={setEditingPost}
                editingComment={editingComment}
                setEditingComment={setEditingComment}
                votingAnimation={votingAnimation}
                getVoteCount={getVoteCount}
                timeAgo={timeAgo}
                isEarthy={isEarthy}
              />

              {/* Pagination Controls - Shows page navigation (Previous, 1,2,3..., Next) */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isEarthy={isEarthy}
              />
            </div>
          </div>
        </div>

        {/* Scroll to Top Button - Appears when user scrolls down */}
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
            {/* Up arrow icon */}
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
