import { useState } from "react";
import { useMessenger } from "../contexts/MessengerContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function MessengerPopup() {
  const { isMessengerOpen, setIsMessengerOpen, openChat, allUsers } =
    useMessenger();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isMessengerOpen) return null;

  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleUserClick = (user) => {
    navigate(`/profile/${user.id}`);
  };

  const handleMessageClick = (user) => {
    openChat(
      user.id,
      `${user.firstName || "User"} ${user.lastName || ""}`,
      user.photoUrl || null
    );
    // Don't close the messenger popup so user can open multiple chats
  };

  return (
    <>
      {/* Messenger Popup */}
      <div
        className={`fixed bottom-24 right-6 w-80 rounded-lg shadow-2xl z-50 ${
          isEarthy ? "bg-amber-50" : "bg-purple-50"
        }`}
        style={{ maxHeight: "500px" }}
      >
        {/* Header */}
        <div
          className={`p-4 rounded-t-lg ${
            isEarthy
              ? "bg-amber-700"
              : "bg-[#c7b4e2]"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg">Messages</h3>
            <button
              onClick={() => setIsMessengerOpen(false)}
              className="text-white hover:bg-white/20 rounded p-1 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full mt-3 px-3 py-2 rounded-lg border-none outline-none ${
              isEarthy ? "bg-amber-100" : "bg-purple-100"
            }`}
          />
        </div>

        {/* Users List */}
        <div className="overflow-y-auto" style={{ maxHeight: "380px" }}>
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? "No users found" : "No users available"}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-3 border-b flex items-center justify-between transition ${
                  isEarthy
                    ? "border-amber-200 hover:bg-amber-100"
                    : "border-purple-200 hover:bg-purple-100"
                }`}
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-semibold">
                        {user.firstName?.[0]?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <p className={`font-medium ${
                      isEarthy ? "text-amber-900" : "text-gray-900"
                    }`}>
                      {user.firstName || "User"} {user.lastName || ""}
                    </p>
                    <p className="text-xs text-gray-500">Click to view profile</p>
                  </div>
                </div>

                {/* Message Button */}
                <button
                  onClick={() => handleMessageClick(user)}
                  className={`text-xs px-3 py-1.5 rounded transition flex items-center gap-1 ${
                    isEarthy
                      ? "bg-amber-700 hover:bg-amber-800 text-white"
                      : "bg-[#c7b4e2] hover:bg-[#b49fd3] text-gray-900"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Message
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
