import { Link } from "react-router-dom";
import { useState } from "react";

/**
 * CommentItem Component
 * 
 * Displays a single comment on a post with:
 * - Author information and avatar
 * - Comment text
 * - Upvote/downvote buttons
 * - Edit/delete functionality (for comment author only)
 * - Timestamp with "edited" indicator
 * 
 * Provides inline editing with save/cancel actions.
 */
export default function CommentItem({
  comment,
  postId,
  user,
  handleCommentUpvote,
  handleCommentDownvote,
  handleEditComment,
  handleDeleteComment,
  editingComment,
  setEditingComment,
  getVoteCount,
  timeAgo,
  isEarthy,
}) {
  // Local state for editing comment text
  const [editText, setEditText] = useState(comment.text);

  // Check if this comment is currently being edited
  // Using composite key: postId-commentId to allow editing different comments on different posts
  const isEditing = editingComment === `${postId}-${comment.id}`;

  /**
   * Saves the edited comment text
   * Calls the parent handler with updated text
   */
  const handleSaveEdit = () => {
    handleEditComment(postId, comment.id, editText);
  };

  /**
   * Cancels editing mode
   * Resets local state to original comment text
   */
  const handleCancelEdit = () => {
    setEditText(comment.text);
    setEditingComment(null);
  };

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
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
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
                    {comment.editedAt && <span> (edited)</span>}
                  </span>
                </div>

                {/* Edit/Delete buttons for comment author */}
                {user.uid === comment.authorId && (
                  <div className="flex gap-2">
                    {!isEditing && (
                      <button
                        onClick={() => setEditingComment(`${postId}-${comment.id}`)}
                        className={`text-xs font-medium transition ${
                          isEarthy
                            ? "text-brown-600 hover:text-rust-500"
                            : "text-gray-600 hover:text-light-lavender"
                        }`}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteComment(postId, comment.id)}
                      className="text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Edit mode */}
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="2"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none ${
                      isEarthy
                        ? "border-tan-300 focus:ring-rust-500"
                        : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
                    }`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className={`px-3 py-1 rounded text-xs font-medium text-white transition ${
                        isEarthy
                          ? "bg-rust-500 hover:bg-rust-600"
                          : "bg-light-lavender hover:bg-medium-lavender"
                      }`}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        isEarthy
                          ? "bg-tan-200 hover:bg-tan-300 text-brown-800"
                          : "bg-gray-200 hover:bg-gray-300 text-charcoal-grey"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    isEarthy ? "text-brown-700" : "text-gray-700"
                  }`}
                >
                  {comment.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
