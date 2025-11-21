// DirectChat.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "././contexts/ThemeContext";
import { UserAuth } from "././contexts/AuthContext";
import {
  collection,
  collectionGroup,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../src/firebase";

// deterministic conversation id for a pair of users
const convIdFor = (a, b) => [a, b].sort().join("_");

export default function DirectChat({ isOpen, onClose }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const { user, profile } = UserAuth();

  // Popup state
  const [isMinimized, setIsMinimized] = useState(true);
  const [view, setView] = useState("list"); // list | chat
  const [conversations, setConversations] = useState([]); // list of conv docs
  const [openTabs, setOpenTabs] = useState([]); // [{ id, participants, participantDetails, isTemporary }]
  const [activeTabId, setActiveTabId] = useState(null);
  const [messages, setMessages] = useState([]); // messages for active tab
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) setIsMinimized(false);
  }, [isOpen]);

  const myDisplayName = useMemo(() => {
    const name = `${profile?.firstName || ""} ${
      profile?.lastName || ""
    }`.trim();
    return name || "Unknown";
  }, [profile]);

  // --- Conversations list (parents) ------------------------------------------------
  useEffect(() => {
    if (!user) return;
    const qConvos = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.uid)
    );
    const unsub = onSnapshot(qConvos, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setConversations(list);
    });
    return () => unsub();
  }, [user]);

  // --- People search (simple: list all users; local filter) ------------------------
  useEffect(() => {
    if (!user) return;
    setIsSearching(true);
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const people = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.id !== user.uid);
      setSearchResults(people);
      setIsSearching(false);
    });
    return () => unsub();
  }, [user]);

  const filteredResults = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return searchResults;
    return searchResults.filter((u) => {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      return name.includes(q);
    });
  }, [searchQuery, searchResults]);

  // --- Messages for active tab -----------------------------------------------------
  useEffect(() => {
    if (!activeTabId) {
      setMessages([]);
      return;
    }
    const activeTab = openTabs.find((t) => t.id === activeTabId);
    if (!activeTab || !activeTab.id || activeTab.isTemporary) {
      // we only listen to a concrete conversation id
      setMessages([]);
      return;
    }
    const qMsgs = query(
      collection(db, "conversations", activeTab.id, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(qMsgs, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsub();
  }, [activeTabId, openTabs]);

  // --- Open a chat tab with another user ------------------------------------------
  const openChat = async (otherUser) => {
    if (!user || !otherUser?.id) return;
    const cid = convIdFor(user.uid, otherUser.id);

    // Build a temporary tab using the deterministic id,
    // so our message listener points to the right subcollection path immediately.
    const tab = {
      id: cid,
      participants: [user.uid, otherUser.id],
      participantDetails: {
        [user.uid]: {
          name: myDisplayName,
          avatar: profile?.photoUrl || null,
        },
        [otherUser.id]: {
          name:
            `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() ||
            "Unknown",
          avatar: otherUser.photoUrl || null,
        },
      },
      lastMessage: "",
      lastMessageTime: new Date(),
      createdAt: new Date(),
      isTemporary: true,
    };

    setOpenTabs((prev) => {
      if (prev.some((t) => t.id === cid)) return prev;
      return [...prev, tab];
    });
    setActiveTabId(cid);
    setView("chat");
  };

  // --- Send a message in the active tab -------------------------------------------
  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    const text = newMessage.trim();
    if (!user || !activeTabId || !text) return;

    const activeTab = openTabs.find((t) => t.id === activeTabId);
    if (!activeTab) return;

    try {
      const conversationId = activeTab.id;
      const otherId = activeTab.participants.find((p) => p !== user.uid);

      // If this tab is the first time we talk here, ensure/merge the parent doc now
      if (activeTab.isTemporary) {
        await setDoc(
          doc(db, "conversations", conversationId),
          {
            participants: activeTab.participants,
            participantDetails: activeTab.participantDetails || {},
            lastMessage: text,
            lastMessageTime: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        // flip to permanent so the listener attaches and DM list can see it
        const updated = { ...activeTab, isTemporary: false };
        setOpenTabs((prev) =>
          prev.map((t) => (t.id === activeTabId ? updated : t))
        );
      }

      // Write the message to the subcollection
      await addDoc(
        collection(db, "conversations", conversationId, "messages"),
        {
          text,
          senderId: user.uid,
          senderName: myDisplayName,
          recipientId: otherId,
          createdAt: serverTimestamp(),
          read: false,
        }
      );

      // Update the parent doc (so DirectMessages.jsx updates instantly)
      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  // --- Close a tab ----------------------------------------------------------------
  const closeTab = (tabId) => {
    setOpenTabs((prev) => prev.filter((t) => t.id !== tabId));
    if (activeTabId === tabId) {
      const remaining = openTabs.filter((t) => t.id !== tabId);
      setActiveTabId(remaining.length ? remaining[0].id : null);
      setMessages([]);
    }
  };

  // --- Helpers --------------------------------------------------------------------
  const getOtherParticipant = (conversation) => {
    if (!user || !conversation?.participants) return { name: "Unknown" };
    const otherId = conversation.participants.find((p) => p !== user.uid);
    return (
      conversation.participantDetails?.[otherId] || {
        name: otherId || "Unknown",
      }
    );
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const hours = (now - d) / 36e5;
    if (hours < 24) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (!user) return null;

  // --- UI -------------------------------------------------------------------------
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-96 rounded-xl shadow-2xl overflow-hidden ${
        isMinimized ? "h-12" : "h-[520px]"
      } ${isEarthy ? "bg-cream-50" : "bg-white"}`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          isEarthy ? "bg-rust-600 text-white" : "bg-orange-700 text-white"
        }`}
      >
        <div className="font-semibold">Messages</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMinimized((v) => !v)}
            className="opacity-90 hover:opacity-100"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? "▢" : "—"}
          </button>
          <button
            onClick={onClose}
            className="opacity-90 hover:opacity-100"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex flex-col h-[calc(520px-48px)]">
          {/* Tabs */}
          <div className="flex gap-2 p-3">
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                view === "list"
                  ? isEarthy
                    ? "bg-cream-200 text-brown-800"
                    : "bg-orange-100 text-orange-900"
                  : isEarthy
                  ? "bg-cream-100"
                  : "bg-gray-100"
              }`}
              onClick={() => setView("list")}
            >
              Chats
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                view === "chat"
                  ? isEarthy
                    ? "bg-cream-200 text-brown-800"
                    : "bg-orange-100 text-orange-900"
                  : isEarthy
                  ? "bg-cream-100"
                  : "bg-gray-100"
              }`}
              onClick={() => setView("chat")}
            >
              Active
            </button>
          </div>

          {/* Lists / Active */}
          <div className="flex-1 px-3 pb-3 overflow-y-auto">
            {view === "list" ? (
              <>
                <div className="mb-3">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search people..."
                    className={`w-full rounded-md px-3 py-2 border ${
                      isEarthy
                        ? "border-tan-300 bg-cream-50 text-brown-800"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>

                {filteredResults.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => openChat(u)}
                    className={`w-full text-left px-3 py-2 rounded-md mb-2 hover:opacity-90 ${
                      isEarthy ? "bg-cream-100" : "bg-gray-100"
                    }`}
                  >
                    <div className="font-semibold">
                      {(u.firstName || "") + " " + (u.lastName || "")}
                    </div>
                    <div className="text-sm opacity-70">{u.email || ""}</div>
                  </button>
                ))}

                <div className="mt-4 mb-2 text-xs uppercase opacity-60">
                  Your conversations
                </div>
                {conversations.map((c) => {
                  const other = getOtherParticipant(c);
                  return (
                    <button
                      key={c.id}
                      onClick={() =>
                        openChat({
                          id: c.participants.find((p) => p !== user.uid),
                          firstName: (other.name || "").split(" ")[0],
                          lastName: (other.name || "")
                            .split(" ")
                            .slice(1)
                            .join(" "),
                          photoUrl: other.avatar || null,
                        })
                      }
                      className={`w-full text-left px-3 py-2 rounded-md mb-2 hover:opacity-90 ${
                        isEarthy ? "bg-cream-100" : "bg-gray-100"
                      }`}
                    >
                      <div className="font-semibold">
                        {other.name || "Unknown"}
                      </div>
                      <div className="text-sm opacity-70">
                        {c.lastMessage ? c.lastMessage : "No messages yet"}
                      </div>
                      <div className="text-xs opacity-50">
                        {formatTime(c.lastMessageTime)}
                      </div>
                    </button>
                  );
                })}
              </>
            ) : (
              // Active chat window
              <>
                {!activeTabId ? (
                  <div className="p-3 text-sm opacity-60">
                    Open a chat from the list.
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-2 py-1 mb-2">
                      {(() => {
                        const tab = openTabs.find((t) => t.id === activeTabId);
                        const other = tab
                          ? getOtherParticipant(tab)
                          : { name: "Unknown" };
                        return (
                          <div className="font-semibold">{other.name}</div>
                        );
                      })()}
                      <div className="flex gap-2 ml-auto">
                        <button
                          className="text-xs opacity-70 hover:opacity-100"
                          onClick={() => setIsMinimized(true)}
                        >
                          Minimize
                        </button>
                        <button
                          className="text-xs opacity-70 hover:opacity-100"
                          onClick={() => closeTab(activeTabId)}
                        >
                          Close tab
                        </button>
                      </div>
                    </div>

                    <div
                      className={`flex-1 overflow-y-auto p-2 rounded-md ${
                        isEarthy ? "bg-cream-100" : "bg-gray-50"
                      }`}
                    >
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`px-3 py-2 my-1 rounded-lg max-w-[75%] break-words shadow-sm ${
                            m.senderId === user.uid
                              ? isEarthy
                                ? "bg-rust-500 text-white ml-auto"
                                : "bg-orange-200 text-orange-900 ml-auto"
                              : isEarthy
                              ? "bg-white text-brown-800"
                              : "bg-white text-gray-900"
                          }`}
                        >
                          {m.text}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    <form
                      onSubmit={handleSendMessage}
                      className="flex gap-2 mt-2"
                    >
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Aa"
                        className={`flex-1 rounded-md px-3 py-2 border ${
                          isEarthy
                            ? "border-tan-300 bg-cream-50 text-brown-800"
                            : "border-gray-300 bg-white text-gray-900"
                        }`}
                      />
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-md font-semibold ${
                          isEarthy
                            ? "bg-rust-600 text-white hover:bg-rust-700"
                            : "bg-orange-600 text-white hover:bg-orange-700"
                        }`}
                      >
                        Send
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
