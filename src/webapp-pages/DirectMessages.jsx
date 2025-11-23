/**
 * ========================================
 * DIRECT MESSAGES PAGE
 * ========================================
 * 
 * Purpose:
 * Lists all direct message conversations for the current user.
 * Provides navigation to individual chat pages for each conversation.
 * Shows conversation previews with last message and timestamp.
 * 
 * Features:
 * - Real-time conversation list from Firebase Firestore
 * - Displays other participant's name and last message
 * - Sorted by most recent activity (newest first)
 * - Clickable cards navigate to full chat page
 * - Handles deduplication of multiple conversation docs
 * - Lazy loading of message previews
 * - Theme-aware styling with hover effects
 * 
 * Firebase Structure:
 * Collection: "conversations"
 * Document: {
 *   participants: [userId1, userId2],
 *   participantDetails: {
 *     userId: { name: string }
 *   },
 *   lastMessage: string,
 *   lastMessageTime: timestamp,
 *   createdAt: timestamp
 * }
 * 
 * Subcollection: "conversations/{id}/messages"
 * - Used for preview when parent doc has no lastMessage
 * 
 * Data Processing:
 * 1. Query conversations where current user is participant
 * 2. Resolve participant names from user profiles
 * 3. Deduplicate by other user (keeps most recent)
 * 4. Fetch latest message from subcollection if needed
 * 5. Sort by timestamp (newest first)
 * 
 * Name Resolution:
 * - First checks participantDetails in conversation doc
 * - Falls back to fetching from users collection
 * - Caches names in nameMap to avoid duplicate fetches
 * 
 * Deduplication Logic:
 * - Some legacy code created multiple docs per user pair
 * - Groups by other participant ID
 * - Keeps conversation with most recent activity
 * - Uses bestByOther Map to track newest per user
 * 
 * Preview Loading:
 * - If conversation doc has lastMessage: use it
 * - If no lastMessage: fetch from messages subcollection
 * - Limits to 1 message with orderBy createdAt desc
 * - Falls back to "No messages yet" on error
 * 
 * Navigation:
 * - Links to: /chat/{otherUserId}
 * - Uses React Router Link component
 * - Preserves conversation context
 * 
 * State Management:
 * - rows: Array of conversation data
 * - loading: Initial data load state
 * - Each row: { id, otherId, otherName, lastMessage, lastMessageTime }
 * 
 * Real-Time Updates:
 * - onSnapshot listener on conversations collection
 * - Auto-updates when new messages arrive
 * - Re-resolves names on participant changes
 * 
 * Theme Support:
 * - Earthy: Cream backgrounds, tan borders, brown text
 * - Cool: Charcoal grey background, lavender cards, purple text
 * - Hover effects with glow animations
 */

import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  collection as subCollection,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, auth } from "../src/firebase"; // ✅ correct relative path from /webapp-pages
import { Link } from "react-router-dom";
import UntiltNavBar from "../components/navigation/UntiltNavBar";
import { useTheme } from "../contexts/ThemeContext";

export default function DirectMessages() {
  const [rows, setRows] = useState([]); // [{ id, otherId, otherName, lastMessage, lastMessageTime }]
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (me) => {
      if (!me) {
        setRows([]);
        setLoading(false);
        return;
      }

      // Conversations where I'm a participant
      const qConvos = query(
        collection(db, "conversations"),
        where("participants", "array-contains", me.uid)
      );

      const unsubConvos = onSnapshot(qConvos, async (snap) => {
        const convos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // --- Resolve names ----------------------------------------------------
        const nameMap = {};
        const needName = new Set();

        for (const c of convos) {
          const otherId = (c.participants || []).find((p) => p !== me.uid);
          if (!otherId) continue;

          const fromDetails = c.participantDetails?.[otherId]?.name;
          if (fromDetails) {
            nameMap[otherId] = fromDetails;
          } else {
            needName.add(otherId);
          }
        }

        if (needName.size) {
          const lookups = await Promise.all(
            [...needName].map(async (uid) => {
              try {
                const s = await getDoc(doc(db, "users", uid));
                if (s.exists()) {
                  const u = s.data();
                  const name =
                    `${u.firstName || ""} ${u.lastName || ""}`.trim() || uid;
                  return [uid, name];
                }
              } catch {}
              return [uid, uid];
            })
          );
          lookups.forEach(([uid, name]) => (nameMap[uid] = name));
        }

        // --- Deduplicate by other user & pick most recent --------------------
        // Some old code created multiple conversation docs per pair.
        const bestByOther = new Map(); // otherId -> { convo, ts }
        for (const c of convos) {
          const otherId = (c.participants || []).find((p) => p !== me.uid);
          if (!otherId) continue;

          const ts =
            (c.lastMessageTime?.toDate?.() && c.lastMessageTime.toDate()) ||
            (c.createdAt?.toDate?.() && c.createdAt.toDate()) ||
            new Date(0);

          const cur = bestByOther.get(otherId);
          if (!cur || ts > cur.ts) bestByOther.set(otherId, { convo: c, ts });
        }

        // --- Build rows; lazy-fill preview if parent has no lastMessage -------
        const rowsTmp = [];
        for (const [otherId, { convo, ts }] of bestByOther) {
          let lastText = convo.lastMessage || "";
          let lastTime = ts;

          if (!lastText) {
            // Fetch latest message from subcollection for preview only
            try {
              const latestSnap = await getDocs(
                query(
                  subCollection(db, "conversations", convo.id, "messages"),
                  orderBy("createdAt", "desc"),
                  limit(1)
                )
              );
              const m = latestSnap.docs[0]?.data();
              if (m) {
                lastText = m.text || m.content || "";
                const mt =
                  (m.createdAt?.toDate?.() && m.createdAt.toDate()) || lastTime;
                lastTime = mt;
              }
            } catch {
              // ignore preview failure; keep "No messages yet"
            }
          }

          rowsTmp.push({
            id: convo.id,
            otherId,
            otherName: nameMap[otherId] || otherId || "Unknown",
            lastMessage: lastText,
            lastMessageTime: lastTime,
          });
        }

        // --- Sort newest-first & set state -----------------------------------
        rowsTmp.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        setRows(rowsTmp);
        setLoading(false);
      });

      return () => unsubConvos();
    });

    return () => unsubAuth();
  }, []);

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen px-4 pt-24 pb-12 ${
          isEarthy ? "bg-cream-100" : "bg-charcoal-grey"
        }`}
      >
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isEarthy ? "text-brown-800" : "text-white"
            }`}
          >
            Direct Messages
          </h1>
          <p
            className={`text-md ${
              isEarthy ? "text-brown-600" : "text-purple-200"
            }`}
          >
            Your conversations appear below. Click to continue chatting.
          </p>
        </div>

        <div className="grid max-w-3xl grid-cols-1 gap-6 mx-auto">
          {loading ? (
            <p
              className={
                isEarthy
                  ? "text-brown-600 text-center"
                  : "text-purple-200 text-center"
              }
            >
              Loading conversations...
            </p>
          ) : rows.length === 0 ? (
            <p
              className={
                isEarthy
                  ? "text-brown-600 text-center"
                  : "text-purple-200 text-center"
              }
            >
              No conversations yet.
            </p>
          ) : (
            rows.map((convo) => (
              <Link
                key={convo.id}
                to={`/chat/${convo.otherId}`}
                className={`
                  group relative overflow-hidden rounded-lg shadow-lg 
                  transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                  p-6 cursor-pointer
                  ${
                    isEarthy
                      ? "bg-linear-to-br from-cream-100 to-tan-50 border-2 border-tan-300"
                      : "bg-pale-lavender border-2 border-blue-grey"
                  }
                `}
              >
                <div className="relative">
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      isEarthy
                        ? "text-brown-800 group-hover:text-rust-600"
                        : "text-gray-900 group-hover:text-light-lavender"
                    }`}
                  >
                    {convo.otherName}
                  </h3>
                  <p
                    className={`text-md ${
                      isEarthy ? "text-brown-600" : "text-gray-700"
                    }`}
                  >
                    {convo.lastMessage || "No messages yet"}
                  </p>
                </div>

                <div
                  className={`absolute top-0 right-0 w-32 h-32 rounded-lg blur-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-20 ${
                    isEarthy ? "bg-rust-400" : "bg-light-lavender"
                  }`}
                  style={{ transform: "translate(50%, -50%)" }}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
