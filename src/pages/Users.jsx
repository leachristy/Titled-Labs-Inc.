/**
 * ========================================
 * USERS PAGE (PUBLIC)
 * ========================================
 * 
 * Purpose:
 * Displays a list of all registered users in the platform.
 * Provides a simple directory of users with first/last names.
 * 
 * Features:
 * - Toggle button to show/hide users list
 * - Real-time user data from Firebase Firestore
 * - Alphabetical sorting by first name
 * - Grid layout for user cards
 * - Loading and error states
 * - Filters out users without names
 * 
 * Firebase Integration:
 * - Uses react-firebase-hooks for real-time data
 * - Collection: "users"
 * - Only fetches when visibility is toggled on
 * - Metadata changes excluded for performance
 * 
 * State Management:
 * - visible: Controls whether users list is shown
 * - Lazy loading: Only queries Firestore when visible is true
 * 
 * User Display:
 * - Shows first name and last name
 * - Falls back to "Anonymous" if no name
 * - Grid: 1 column mobile, 2 tablet, 3 desktop
 * - Card-based layout with theme styling
 * 
 * Theme Support:
 * - Earthy: Cream background, tan borders, brown text
 * - Cool: Pale lavender background, blue-grey borders, charcoal text
 */

import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query } from "firebase/firestore";
import { useTheme } from "../contexts/ThemeContext";
import { db } from "../src/firebase";
import NavBar from "../components/navigation/NavBar";

export default function Users() {
  const [visible, setVisible] = useState(false);
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const usersQuery = query(collection(db, "users"));

  const [usersQuerySnapshot, usersLoading, usersError] = useCollection(
    visible ? usersQuery : null,
    {
      snapshotListenOptions: { includeMetadataChanges: false },
    }
  );

  const users =
    usersQuerySnapshot?.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.firstName || user.lastName) // Only show users with names
      .sort((a, b) => {
        const nameA = (a.firstName || "").toLowerCase();
        const nameB = (b.firstName || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }) ?? [];

  return (
    <>
      <title>Users - Tilted | Mental Wellness</title>
      <NavBar />
      {/* push content down from fixed navbar */}
      <div
        className={`min-h-screen pt-32 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
        style={{
          backgroundColor: isEarthy ? undefined : "var(--pale-lavender)",
        }}
      >
        <div className="max-w-4xl px-4 mx-auto text-center">
          <div className="mb-8">
            <button
              onClick={() => setVisible((v) => !v)}
              className={`${
                isEarthy
                  ? "btn-primary"
                  : "font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-900"
              }`}
              style={{
                backgroundColor: isEarthy ? undefined : "var(--light-lavender)",
                color: isEarthy ? undefined : "var(--charcoal-grey)",
              }}
              onMouseEnter={(e) =>
                !isEarthy &&
                (e.target.style.backgroundColor = "var(--medium-lavender)")
              }
              onMouseLeave={(e) =>
                !isEarthy &&
                (e.target.style.backgroundColor = "var(--light-lavender)")
              }
            >
              {visible ? "Hide Users" : "Show Users"}
            </button>
          </div>

          {usersLoading && (
            <p
              className={`${isEarthy ? "text-brown-600" : "text-light-lavender"}`}
              style={{ color: isEarthy ? undefined : "var(--light-lavender)" }}
            >
              Loading…
            </p>
          )}
          {usersError ? (
            <p
              className={`font-medium ${
                isEarthy ? "text-rust-600" : "text-light-lavender"
              }`}
              style={{ color: isEarthy ? undefined : "var(--light-lavender)" }}
            >
              {usersError.message}
            </p>
          ) : (
            visible && (
              <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`text-center card p-4 rounded-lg shadow-md border-2 ${
                      isEarthy ? "bg-white border-tan-300" : "bg-white border-blue-grey"
                    }`}
                  >
                    <h3
                      className={`text-lg font-bold ${
                        isEarthy ? "text-brown-800" : "text-gray-900"
                      }`}
                    >
                      {user.firstName || user.lastName || "Anonymous"}
                    </h3>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
