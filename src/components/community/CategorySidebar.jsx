export default function CategorySidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  getCategoryCount,
  setIsCreatingPost,
  isEarthy,
}) {
  return (
    <div className="hidden lg:block lg:col-span-1">
      <div
        className={`rounded-lg shadow-lg p-4 ${
          isEarthy
            ? "bg-white border-tan-200"
            : "bg-pale-lavender border-blue-grey"
        } border sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto`}
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
              className={`w-full text-left px-4 py-2 rounded-lg transition font-medium flex items-center justify-between ${
                selectedCategory === category
                  ? isEarthy
                    ? "bg-rust-500 text-white"
                    : "bg-light-lavender text-white"
                  : isEarthy
                  ? "text-brown-700 hover:bg-cream-100"
                  : "text-gray-900 hover:bg-cool-grey"
              }`}
            >
              <span>{category}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === category
                    ? isEarthy
                      ? "bg-rust-600"
                      : "bg-medium-lavender"
                    : isEarthy
                    ? "bg-tan-200 text-brown-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {getCategoryCount(category)}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsCreatingPost((prev) => !prev)}
          className={`w-full mt-6 px-4 py-3 rounded-lg font-bold text-white transition shadow-md hover:shadow-lg ${
            isEarthy
              ? "bg-rust-500 hover:bg-rust-600"
              : "bg-light-lavender hover:bg-medium-lavender"
          }`}
        >
          + Create Post
        </button>
      </div>
    </div>
  );
}
