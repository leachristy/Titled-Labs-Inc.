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
      <title>Users - Untilted | Mental Wellness</title>

      {/* push content down from fixed navbar */}
      <div className="min-h-screen pt-32 bg-cream-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <button
              onClick={() => setVisible((v) => !v)}
              className="btn-primary"
            >
              {visible ? "Hide Users" : "Show Users"}
            </button>
          </div>

          {usersLoading && <p className="text-brown-600">Loading…</p>}
          {usersError ? (
            <p className="text-rust-600 font-medium">{usersError.message}</p>
          ) : (
            visible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="card text-left"
                  >
                    <h3 className="text-lg font-bold text-brown-800">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-brown-600">
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
