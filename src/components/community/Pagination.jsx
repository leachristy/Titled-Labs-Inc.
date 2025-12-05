/**
 * Pagination Component
 * 
 * Displays page navigation controls for the Community page.
 * Shows Previous/Next buttons, page numbers, and current page indicator.
 * Intelligently displays page numbers with ellipsis for large page counts.
 * 
 * @param {number} currentPage - The currently active page number
 * @param {number} totalPages - Total number of pages available
 * @param {function} onPageChange - Callback function when page changes
 * @param {boolean} isEarthy - Theme flag (true = earthy theme, false = cool theme)
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isEarthy,
}) {
  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) return null;

  /**
   * Generates an array of page numbers to display
   * Uses ellipsis (...) for large page counts to save space
   * Always shows first page, last page, current page, and surrounding pages
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and surrounding pages with ellipsis
      if (currentPage <= 3) {
        // Near beginning: Show first 4 pages, ellipsis, then last page
        // Example: [1] [2] [3] [4] [...] [10]
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: Show first page, ellipsis, then last 4 pages
        // Example: [1] [...] [7] [8] [9] [10]
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // In middle: Show first, ellipsis, current +/- 1, ellipsis, last
        // Example: [1] [...] [4] [5] [6] [...] [10]
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      {/* Previous Button - Disabled on first page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
          isEarthy
            ? "bg-white border-2 border-tan-200 text-brown-800 hover:bg-cream-50 disabled:hover:bg-white"
            : "bg-pale-lavender border-2 border-blue-grey text-gray-900 hover:bg-cool-grey disabled:hover:bg-pale-lavender"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {pageNumbers.map((page, index) => {
          // Render ellipsis as non-clickable text
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className={`px-3 py-2 ${
                  isEarthy ? "text-brown-600" : "text-gray-600"
                }`}
              >
                ...
              </span>
            );
          }

          // Render page number button
          // Active page gets special highlighting
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg font-medium transition min-w-10 ${
                currentPage === page
                  ? isEarthy
                    ? "bg-rust-500 text-white" // Active page - earthy theme
                    : "bg-light-lavender text-white" // Active page - cool theme
                  : isEarthy
                  ? "bg-white border-2 border-tan-200 text-brown-800 hover:bg-cream-50" // Inactive - earthy
                  : "bg-pale-lavender border-2 border-blue-grey text-gray-900 hover:bg-cool-grey" // Inactive - cool
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button - Disabled on last page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
          isEarthy
            ? "bg-white border-2 border-tan-200 text-brown-800 hover:bg-cream-50 disabled:hover:bg-white"
            : "bg-pale-lavender border-2 border-blue-grey text-gray-900 hover:bg-cool-grey disabled:hover:bg-pale-lavender"
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Page Info Display - Shows "Page X of Y" */}
      <div
        className={`ml-4 text-sm font-medium ${
          isEarthy ? "text-brown-600" : "text-gray-600"
        }`}
      >
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
