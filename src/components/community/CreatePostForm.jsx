export default function CreatePostForm({
  isCreatingPost,
  handleCreatePost,
  newPostTitle,
  setNewPostTitle,
  newPostContent,
  setNewPostContent,
  selectedCategory,
  setSelectedCategory,
  categories,
  isSubmitting,
  setIsCreatingPost,
  isEarthy,
}) {
  if (!isCreatingPost) return null;

  return (
    <div
      className={`rounded-lg shadow-lg p-6 mb-6 ${
        isEarthy
          ? "bg-white border-tan-200"
          : "bg-pale-lavender border-blue-grey"
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
                : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
            }`}
          >
            {categories
              .filter((c) => c !== "All")
              .map((category) => (
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
                : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
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
                : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
            }`}
            required
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-2 rounded-lg font-bold text-white transition ${
              isEarthy
                ? "bg-rust-500 hover:bg-rust-600 disabled:bg-rust-300"
                : "bg-light-lavender hover:bg-medium-lavender disabled:bg-gray-300"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
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
                Posting...
              </span>
            ) : (
              "Post"
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingPost(false)}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
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
  );
}
