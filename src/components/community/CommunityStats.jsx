export default function CommunityStats({ posts, isEarthy }) {
  const totalComments = posts.reduce(
    (sum, post) => sum + (post.comments?.length || 0),
    0
  );
  const totalContributors = new Set(posts.map((post) => post.authorId)).size;
  const totalVotes = posts.reduce(
    (sum, post) =>
      sum + (post.upvotes?.length || 0) + (post.downvotes?.length || 0),
    0
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
      <div
        className={`rounded-lg p-4 ${
          isEarthy
            ? "bg-white border-tan-200"
            : "bg-pale-lavender border-blue-grey"
        } border shadow-md`}
      >
        <div
          className={`text-2xl font-bold ${
            isEarthy ? "text-rust-500" : "text-light-lavender"
          }`}
        >
          {posts.length}
        </div>
        <div
          className={`text-sm ${
            isEarthy ? "text-brown-600" : "text-gray-600"
          }`}
        >
          Total Posts
        </div>
      </div>
      <div
        className={`rounded-lg p-4 ${
          isEarthy
            ? "bg-white border-tan-200"
            : "bg-pale-lavender border-blue-grey"
        } border shadow-md`}
      >
        <div
          className={`text-2xl font-bold ${
            isEarthy ? "text-rust-500" : "text-light-lavender"
          }`}
        >
          {totalComments}
        </div>
        <div
          className={`text-sm ${
            isEarthy ? "text-brown-600" : "text-gray-600"
          }`}
        >
          Comments
        </div>
      </div>
      <div
        className={`rounded-lg p-4 ${
          isEarthy
            ? "bg-white border-tan-200"
            : "bg-pale-lavender border-blue-grey"
        } border shadow-md`}
      >
        <div
          className={`text-2xl font-bold ${
            isEarthy ? "text-rust-500" : "text-light-lavender"
          }`}
        >
          {totalContributors}
        </div>
        <div
          className={`text-sm ${
            isEarthy ? "text-brown-600" : "text-gray-600"
          }`}
        >
          Contributors
        </div>
      </div>
      <div
        className={`rounded-lg p-4 ${
          isEarthy
            ? "bg-white border-tan-200"
            : "bg-pale-lavender border-blue-grey"
        } border shadow-md`}
      >
        <div
          className={`text-2xl font-bold ${
            isEarthy ? "text-rust-500" : "text-light-lavender"
          }`}
        >
          {totalVotes}
        </div>
        <div
          className={`text-sm ${
            isEarthy ? "text-brown-600" : "text-gray-600"
          }`}
        >
          Total Votes
        </div>
      </div>
    </div>
  );
}
