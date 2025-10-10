import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { useTheme } from "../contexts/ThemeContext";
import { db } from "../src/firebase";

export default function Users() {
  const [visible, setVisible] = useState(false);
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === 'earthy';

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

  return (
    <>
      <title>Users - Tilted | Mental Wellness</title>

      {/* push content down from fixed navbar */}
      <div className={`min-h-screen pt-32 ${isEarthy ? 'bg-cream-100' : 'bg-pale-lavender'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)'}}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <button
              onClick={() => setVisible((v) => !v)}
              className={`${isEarthy ? 'btn-primary' : 'font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white'}`}
              style={{backgroundColor: isEarthy ? undefined : 'var(--slate-blue)', color: 'white'}}
              onMouseEnter={(e) => !isEarthy && (e.target.style.backgroundColor = 'var(--charcoal-grey)')}
              onMouseLeave={(e) => !isEarthy && (e.target.style.backgroundColor = 'var(--slate-blue)')}
            >
              {visible ? "Hide Users" : "Show Users"}
            </button>
          </div>

          {usersLoading && <p className={`${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>Loading…</p>}
          {usersError ? (
            <p className={`font-medium ${isEarthy ? 'text-rust-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>{usersError.message}</p>
          ) : (
            visible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="card text-left"
                    style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}
                  >
                    <h3 className={`text-lg font-bold ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className={`text-sm ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
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
