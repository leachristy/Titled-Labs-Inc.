export default function SearchAndSort({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  resultsCount,
  isEarthy,
}) {
  return (
    <div
      className={`rounded-lg shadow-lg p-4 mb-6 ${
        isEarthy
          ? "bg-white border-tan-200"
          : "bg-pale-lavender border-blue-grey"
      } border`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isEarthy ? "text-brown-400" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, content, or authors..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              isEarthy
                ? "border-tan-300 focus:ring-rust-500"
                : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isEarthy
                  ? "text-brown-400 hover:text-brown-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              isEarthy ? "text-brown-700" : "text-gray-700"
            }`}
          >
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              isEarthy
                ? "border-tan-300 focus:ring-rust-500"
                : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
            }`}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="mt-2">
          <span
            className={`text-sm ${
              isEarthy ? "text-brown-600" : "text-gray-600"
            }`}
          >
            Found {resultsCount} post{resultsCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
