import { useState, useEffect } from "react";
import UntiltNavBar from "../../components/UntiltNavBar";
import { useTheme } from "../../contexts/ThemeContext";
import { db, auth } from "../../src/firebase";
import { useNavigate } from "react-router-dom";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const JOURNAL_PROMPTS = [
  "What are three things you’re grateful for today?",
  "What emotions did you experience most today?",
  "What is something you’re proud of yourself for recently?",
  "Describe a challenge you faced today and how you handled it.",
  "What would you say to your younger self right now?",
  "What’s something that made you smile today?",
  "What’s been on your mind lately?",
  "What do you want to let go of?",
  "What does self-care look like for you today?",
  "What’s a small goal you can set for tomorrow?",
];


export default function JournalEntries() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [newEntryText, setNewEntryText] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [editText, setEditText] = useState("");

  // Listen to auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      if (!user) setEntries([]);
    });
    return () => unsub();
  }, []);

  // Load entries from Firestore
  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "journalEntries"), where("userId", "==", userId));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });

    return () => unsub();
  }, [userId]);

  const addEntry = async (text) => {
    if (!userId || !text.trim()) return;
    const newEntry = {
      userId,
      text,
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, "journalEntries"), newEntry);
  };

  const deleteEntry = async (id) => {
    await deleteDoc(doc(db, "journalEntries", id));
  };

  const updateEntry = async (id, updates) => {
    await updateDoc(doc(db, "journalEntries", id), updates);
  };

  const handleEditSave = async (id) => {
    if (editText.trim()) {
      await updateEntry(id, { text: editText });
      setEditingEntry(null);
      setEditText("");
    }
  };

  return (
    <>
      <UntiltNavBar />
      <div className={`min-h-screen mt-15 px-6 py-10 ${isEarthy ? "bg-cream-100" : "bg-pale-lavender"}`}>
        <div className="max-w-5xl mx-auto">
          {/* 👇 Back Button */}
          <button
            onClick={() => navigate("/selfcare")}
            className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm ${
              isEarthy
                ? "bg-tan-300 hover:bg-tan-400 text-brown-900"
                : "bg-indigo-200 hover:bg-indigo-300 text-indigo-900"
            } transition`}
          >
            ← Back to Self-Care
          </button>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className={`text-4xl font-bold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
              My Journal
            </h1>
            <p className={`mt-2 ${isEarthy ? "text-brown-600" : "text-slate-600"}`}>
              Reflect, release, and write freely. Choose a prompt or start your own entry.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setShowPromptModal(true)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isEarthy
                  ? "bg-rust-500 hover:bg-rust-600"
                  : "bg-slate-blue hover:bg-charcoal-grey"
              } text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
            >
              ✏️ Choose a Prompt
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isEarthy
                  ? "bg-terracotta-400 hover:bg-terracotta-500"
                  : "bg-blue-grey hover:bg-slate-blue"
              } text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
            >
              ➕ New Entry
            </button>
          </div>

          {/* Journal Entries List */}
          {entries.length === 0 ? (
            <p className="text-center text-gray-500 italic">No journal entries yet. Start writing!</p>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-5 rounded-xl shadow-md ${
                    isEarthy ? "bg-cream-50" : "bg-white"
                  } border ${isEarthy ? "border-tan-300" : "border-slate-200"}`}
                >
                  <div className="flex justify-between items-start">
                    {editingEntry === entry.id ? (
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className={`w-full border rounded-lg p-2 ${
                          isEarthy ? "border-tan-400 bg-cream-100" : "border-slate-300"
                        }`}
                        rows={4}
                      />
                    ) : (
                      <p className={`${isEarthy ? "text-brown-800" : "text-slate-800"}`}>
                        {entry.text}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                    <div className="flex gap-3">
                      {editingEntry === entry.id ? (
                        <>
                          <button
                            onClick={() => handleEditSave(entry.id)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingEntry(null);
                              setEditText("");
                            }}
                            className="text-gray-500 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingEntry(entry.id);
                              setEditText(entry.text);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Entry Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-xl shadow-lg max-w-lg w-full ${
                isEarthy ? "bg-cream-50 border-tan-300" : "bg-white border-slate-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-3">New Journal Entry</h2>
              <textarea
                value={newEntryText}
                onChange={(e) => setNewEntryText(e.target.value)}
                placeholder="Write what’s on your mind..."
                className="w-full border rounded-lg p-2 h-40"
                autoFocus
              />
              <div className="flex gap-3 mt-3 justify-end">
                <button
                  onClick={() => {
                    addEntry(newEntryText);
                    setShowAddModal(false);
                    setNewEntryText("");
                  }}
                  disabled={!newEntryText.trim()}
                  className={`px-4 py-2 rounded-lg ${
                    isEarthy
                    ? "bg-rust-500 hover:bg-rust-600"
                    : "bg-slate-blue hover:bg-charcoal-grey"
                } text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform`}
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prompt Modal */}
        {showPromptModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-xl shadow-lg max-w-2xl w-full overflow-y-auto max-h-[80vh] ${
                isEarthy ? "bg-cream-50 border-tan-300" : "bg-white border-slate-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-3">Choose a Journal Prompt</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {JOURNAL_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addEntry(prompt);
                      setShowPromptModal(false);
                    }}
                    className={`p-3 rounded-lg text-left ${
                      isEarthy
                      ? "bg-tan-500 hover:bg-tan-600"
                      : "bg-cool-grey hover:bg-slate-blue"
                  } text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="mt-5 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}