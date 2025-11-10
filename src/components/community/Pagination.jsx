export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isEarthy,
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and surrounding pages
      if (currentPage <= 3) {
        // Near beginning
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle
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
      {/* Previous Button */}
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

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg font-medium transition min-w-10 ${
                currentPage === page
                  ? isEarthy
                    ? "bg-rust-500 text-white"
                    : "bg-light-lavender text-white"
                  : isEarthy
                  ? "bg-white border-2 border-tan-200 text-brown-800 hover:bg-cream-50"
                  : "bg-pale-lavender border-2 border-blue-grey text-gray-900 hover:bg-cool-grey"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
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

      {/* Page Info */}
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
