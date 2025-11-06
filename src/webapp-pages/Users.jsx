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
                  : "font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white"
              }`}
              style={{
                backgroundColor: isEarthy ? undefined : "var(--slate-blue)",
                color: "white",
              }}
              onMouseEnter={(e) =>
                !isEarthy &&
                (e.target.style.backgroundColor = "var(--charcoal-grey)")
              }
              onMouseLeave={(e) =>
                !isEarthy &&
                (e.target.style.backgroundColor = "var(--slate-blue)")
              }
            >
              {visible ? "Hide Users" : "Show Users"}
            </button>
          </div>

          {usersLoading && (
            <p
              className={`${isEarthy ? "text-brown-600" : "text-slate-blue"}`}
              style={{ color: isEarthy ? undefined : "var(--slate-blue)" }}
            >
              Loading…
            </p>
          )}
          {usersError ? (
            <p
              className={`font-medium ${
                isEarthy ? "text-rust-600" : "text-slate-blue"
              }`}
              style={{ color: isEarthy ? undefined : "var(--slate-blue)" }}
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
