export default function VoteButton({
  onClick,
  isVoted,
  isUpvote,
  isAnimating,
  isEarthy,
}) {
  return (
    <button
      onClick={onClick}
      className={`transition transform ${
        isAnimating ? "scale-125" : "scale-100"
      } ${
        isVoted
          ? isEarthy
            ? "text-rust-600"
            : "text-light-lavender"
          : isEarthy
          ? "text-brown-400 hover:text-rust-500"
          : "text-white hover:text-light-lavender"
      }`}
    >
      <svg
        className={isUpvote ? "w-6 h-6" : "w-6 h-6"}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {isUpvote ? (
          <path d="M10 3l6 7h-5v7H9v-7H4l6-7z" />
        ) : (
          <path d="M10 17l-6-7h5V3h2v7h5l-6 7z" />
        )}
      </svg>
    </button>
  );
}
