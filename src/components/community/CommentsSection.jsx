import CommentItem from "./CommentItem";

export default function CommentsSection({
  post,
  expandedPost,
  commentText,
  setCommentText,
  handleAddComment,
  handleCommentUpvote,
  handleCommentDownvote,
  user,
  getVoteCount,
  timeAgo,
  isEarthy,
}) {
  if (expandedPost !== post.id) return null;

  return (
    <div
      className="pt-4 mt-4 border-t"
      style={{
        animation: "slideIn 0.3s ease-out",
      }}
    >
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
              : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
          }`}
        />
        <button
          onClick={() => handleAddComment(post.id)}
          className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
            isEarthy
              ? "bg-rust-500 hover:bg-rust-600"
              : "bg-light-lavender hover:bg-medium-lavender"
          }`}
        >
          Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {post.comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={post.id}
            user={user}
            handleCommentUpvote={handleCommentUpvote}
            handleCommentDownvote={handleCommentDownvote}
            getVoteCount={getVoteCount}
            timeAgo={timeAgo}
            isEarthy={isEarthy}
          />
        ))}
      </div>
    </div>
  );
}
