import { Link } from "react-router-dom";
import { useState } from "react";
import VoteButton from "./VoteButton";
import CommentsSection from "./CommentsSection";
import ImageUpload from "./ImageUpload";

export default function PostCard({
  post,
  index,
  user,
  handleUpvote,
  handleDownvote,
  handleDeletePost,
  handleEditPost,
  handleEditComment,
  handleDeleteComment,
  setExpandedPost,
  expandedPost,
  commentText,
  setCommentText,
  handleAddComment,
  handleCommentUpvote,
  handleCommentDownvote,
  editingPost,
  setEditingPost,
  editingComment,
  setEditingComment,
  votingAnimation,
  getVoteCount,
  timeAgo,
  isEarthy,
}) {
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editImageUrl, setEditImageUrl] = useState(post.imageUrl || "");
  const [editVideoUrl, setEditVideoUrl] = useState(post.videoUrl || "");

  const isEditing = editingPost === post.id;

  const handleSaveEdit = () => {
    handleEditPost(post.id, editTitle, editContent, editImageUrl, editVideoUrl);
  };

  const handleCancelEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImageUrl(post.imageUrl || "");
    setEditVideoUrl(post.videoUrl || "");
    setEditingPost(null);
  };

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  // Function to get Vimeo embed URL
  const getVimeoEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  };

  const videoEmbedUrl = post.videoUrl
    ? getYouTubeEmbedUrl(post.videoUrl) || getVimeoEmbedUrl(post.videoUrl)
    : null;

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
                {post.editedAt && <span className="text-xs"> (edited)</span>}
              </span>
            </div>
            {user.uid === post.authorId && (
              <div className="flex gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setEditingPost(post.id)}
                    className={`text-sm font-medium transition ${
                      isEarthy
                        ? "text-brown-600 hover:text-rust-500"
                        : "text-gray-600 hover:text-light-lavender"
                    }`}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeletePost(post.id, post.authorId)}
                  className="text-sm font-medium text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Edit Mode */}
          {isEditing ? (
            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 ${
                  isEarthy
                    ? "border-tan-300 focus:ring-rust-500"
                    : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
                }`}
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows="4"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none ${
                  isEarthy
                    ? "border-tan-300 focus:ring-rust-500"
                    : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
                }`}
              />
              
              {/* Image Upload Component in Edit Mode */}
              <ImageUpload
                onImageUploaded={setEditImageUrl}
                currentImageUrl={editImageUrl}
                isEarthy={isEarthy}
              />
              
              <input
                type="url"
                value={editVideoUrl}
                onChange={(e) => setEditVideoUrl(e.target.value)}
                placeholder="Video URL (optional)"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  isEarthy
                    ? "border-tan-300 focus:ring-rust-500"
                    : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
                }`}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
                    isEarthy
                      ? "bg-rust-500 hover:bg-rust-600"
                      : "bg-light-lavender hover:bg-medium-lavender"
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
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
            <>
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

              {/* Media Display */}
              {post.imageUrl && (
                <div className="mb-4">
                  <img
                    src={post.imageUrl}
                    alt="Post media"
                    className="max-w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              {post.videoUrl && videoEmbedUrl && (
                <div className="mb-4">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={videoEmbedUrl}
                      className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Embedded video"
                    />
                  </div>
                </div>
              )}

              {post.videoUrl && !videoEmbedUrl && (
                <div className="mb-4">
                  <video
                    src={post.videoUrl}
                    controls
                    className="max-w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </>
          )}

          {/* Post Actions */}
          {!isEditing && (
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
          )}

          {/* Comments Section */}
          {!isEditing && (
            <CommentsSection
              post={post}
              expandedPost={expandedPost}
              commentText={commentText}
              setCommentText={setCommentText}
              handleAddComment={handleAddComment}
              handleCommentUpvote={handleCommentUpvote}
              handleCommentDownvote={handleCommentDownvote}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              user={user}
              getVoteCount={getVoteCount}
              timeAgo={timeAgo}
              isEarthy={isEarthy}
            />
          )}
        </div>
      </div>
    </div>
  );
}
