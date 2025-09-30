import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../src/firebase";

export default function Users() {
  const [visible, setVisible] = useState(false);

  const usersQuery = query(collection(db, "users"), orderBy("first_name"));

  const [usersQuerySnapshot, usersLoading, usersError] = useCollection(
    visible ? usersQuery : null,
    {
      snapshotListenOptions: { includeMetadataChanges: false },
    }
  );

  const users =
    usersQuerySnapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() })) ??
    [];
  //  users contains:
  // {
  //   id: "user1",   // d.id
  //   ID: 201,   // ... d.data()
  //   first_name: "Emma",
  //   last_name: "Brown"
  // }
  // ,{},{}

  return (
    <>
      <title>Users</title>

      {/* push content down from fixed navbar */}
      <div className="min-h-screen pt-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <button
              onClick={() => setVisible((v) => !v)}
              className="inline-block px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              {visible ? "Hide Users" : "Show Users"}
            </button>
          </div>

          {usersLoading && <p className="text-gray-500">Loading…</p>}
          {usersError ? (
            <p className="text-red-500 font-medium">{usersError.message}</p>
          ) : (
            visible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white shadow-md rounded-lg p-4 text-left border border-gray-200"
                  >
                    <h3 className="text-lg font-bold text-gray-800">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {user.ID ?? user.id}
                    </p>
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
