import PostCard from "./PostCard";

export default function PostsList({
  isLoading,
  sortedPosts,
  searchQuery,
  user,
  handleUpvote,
  handleDownvote,
  handleDeletePost,
  setExpandedPost,
  expandedPost,
  commentText,
  setCommentText,
  handleAddComment,
  handleCommentUpvote,
  handleCommentDownvote,
  votingAnimation,
  getVoteCount,
  timeAgo,
  isEarthy,
}) {
  if (isLoading) {
    return (
      <div
        className={`rounded-lg shadow-lg p-12 text-center ${
          isEarthy
            ? "bg-white border-tan-200"
            : "bg-pale-lavender border-blue-grey"
        } border`}
      >
        <div className="flex flex-col items-center justify-center">
          <svg
            className={`animate-spin h-12 w-12 mb-4 ${
              isEarthy ? "text-rust-500" : "text-light-lavender"
            }`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p
            className={`text-lg ${
              isEarthy ? "text-brown-600" : "text-gray-700"
            }`}
          >
            Loading posts...
          </p>
        </div>
      </div>
    );
  }

  if (sortedPosts.length === 0) {
    return (
      <div
        className={`rounded-lg shadow-lg p-12 text-center ${
          isEarthy
            ? "bg-white border-tan-200"
            : "bg-pale-lavender border-blue-grey"
        } border`}
      >
        <p
          className={`text-lg ${
            isEarthy ? "text-brown-600" : "text-gray-700"
          }`}
        >
          {searchQuery
            ? "No posts found matching your search."
            : "No posts yet. Be the first to start a conversation!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedPosts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
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
      ))}
    </div>
  );
}
