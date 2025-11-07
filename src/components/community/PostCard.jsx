import { Link } from "react-router-dom";
import VoteButton from "./VoteButton";
import CommentsSection from "./CommentsSection";

export default function PostCard({
  post,
  index,
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
  return (
    <div
      id={`post-${post.id}`}
      className={`rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
        isEarthy
          ? "bg-white border-tan-200"
          : "bg-pale-lavender border-blue-grey"
      } border overflow-hidden`}
      style={{
        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      <div className="flex">
        {/* Vote Section */}
        <div
          className={`flex flex-col items-center p-4 ${
            isEarthy ? "bg-cream-50" : "bg-cool-grey"
          }`}
        >
          <VoteButton
            onClick={() =>
              handleUpvote(post.id, post.upvotes, post.downvotes)
            }
            isVoted={post.upvotes?.includes(user.uid)}
            isUpvote={true}
            isAnimating={votingAnimation[`${post.id}-up`]}
            isEarthy={isEarthy}
          />
          <span
            className={`text-lg font-bold my-1 ${
              isEarthy ? "text-brown-800" : "text-gray-900"
            }`}
          >
            {getVoteCount(post.upvotes, post.downvotes)}
          </span>
          <VoteButton
            onClick={() =>
              handleDownvote(post.id, post.upvotes, post.downvotes)
            }
            isVoted={post.downvotes?.includes(user.uid)}
            isUpvote={false}
            isAnimating={votingAnimation[`${post.id}-down`]}
            isEarthy={isEarthy}
          />
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
                    : "bg-light-lavender text-gray-900"
                }`}
              >
                {post.category}
              </span>
              <span
                className={`text-sm ${
                  isEarthy ? "text-brown-600" : "text-gray-600"
                }`}
              >
                Posted by{" "}
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
                className="text-sm font-medium text-red-500 hover:text-red-700"
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
                setExpandedPost(expandedPost === post.id ? null : post.id)
              }
              className={`flex items-center space-x-1 text-sm font-medium transition ${
                isEarthy
                  ? "text-brown-600 hover:text-rust-500"
                  : "text-gray-600 hover:text-light-lavender"
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
              <span>{post.comments?.length || 0} Comments</span>
            </button>
          </div>

          {/* Comments Section */}
          <CommentsSection
            post={post}
            expandedPost={expandedPost}
            commentText={commentText}
            setCommentText={setCommentText}
            handleAddComment={handleAddComment}
            handleCommentUpvote={handleCommentUpvote}
            handleCommentDownvote={handleCommentDownvote}
            user={user}
            getVoteCount={getVoteCount}
            timeAgo={timeAgo}
            isEarthy={isEarthy}
          />
        </div>
      </div>
    </div>
  );
}
