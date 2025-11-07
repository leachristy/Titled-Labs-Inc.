import { Link } from "react-router-dom";

export default function CommentItem({
  comment,
  postId,
  user,
  handleCommentUpvote,
  handleCommentDownvote,
  getVoteCount,
  timeAgo,
  isEarthy,
}) {
  return (
    <div
      className={`rounded-lg ${isEarthy ? "bg-cream-50" : "bg-cool-grey"}`}
    >
      <div className="flex">
        {/* Comment Vote Section */}
        <div className="flex flex-col items-center p-2 pr-3">
          <button
            onClick={() =>
              handleCommentUpvote(
                postId,
                comment.id,
                comment.upvotes || [],
                comment.downvotes || []
              )
            }
            className={`transition ${
              comment.upvotes?.includes(user.uid)
                ? isEarthy
                  ? "text-rust-600"
                  : "text-light-lavender"
                : isEarthy
                ? "text-brown-400 hover:text-rust-500"
                : "text-white hover:text-light-lavender"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3l6 7h-5v7H9v-7H4l6-7z" />
            </svg>
          </button>
          <span
            className={`text-sm font-semibold my-0.5 ${
              isEarthy ? "text-brown-800" : "text-charcoal-grey"
            }`}
          >
            {getVoteCount(comment.upvotes || [], comment.downvotes || [])}
          </span>
          <button
            onClick={() =>
              handleCommentDownvote(
                postId,
                comment.id,
                comment.upvotes || [],
                comment.downvotes || []
              )
            }
            className={`transition ${
              comment.downvotes?.includes(user.uid)
                ? isEarthy
                  ? "text-rust-600"
                  : "text-light-lavender"
                : isEarthy
                ? "text-brown-400 hover:text-rust-500"
                : "text-white hover:text-light-lavender"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 17l-6-7h5V3h2v7h5l-6 7z" />
            </svg>
          </button>
        </div>

        {/* Comment Content */}
        <div className="flex-1 p-3">
          <div className="flex items-center space-x-3">
            {/* Avatar clickable */}
            <Link
              to={
                user && user.uid === comment.authorId
                  ? "/profile"
                  : `/profile/${comment.authorId}`
              }
              className="shrink-0"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  isEarthy ? "bg-rust-500" : "bg-slate-blue"
                }`}
              >
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
            </Link>

            <div className="flex-1">
              <div className="flex items-center mb-1 space-x-2">
                {/* Name clickable */}
                <Link
                  to={
                    user && user.uid === comment.authorId
                      ? "/profile"
                      : `/profile/${comment.authorId}`
                  }
                  className={`text-sm font-semibold hover:underline ${
                    isEarthy ? "text-brown-800" : "text-gray-900"
                  }`}
                >
                  {comment.authorName}
                </Link>
                <span
                  className={`text-xs ${
                    isEarthy ? "text-brown-600" : "text-gray-600"
                  }`}
                >
                  {timeAgo(comment.createdAt)}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isEarthy ? "text-brown-700" : "text-gray-700"
                }`}
              >
                {comment.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
