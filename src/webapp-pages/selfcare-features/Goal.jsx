import { useState, useEffect } from "react";
import UntiltNavBar from "../../components/UntiltNavBar";
import { useTheme } from "../../contexts/ThemeContext";
import { goalStyles, getRelativeFontSize, getTextScaleLabel } from "../app-styles/Goal.styles";
import { db, auth } from "../../src/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const PRESET_GOALS = [
  "Reduce anxiety levels",
  "Build healthy coping mechanisms",
  "Improve communication skills",
  "Develop self-compassion",
  "Manage stress effectively",
  "Process past trauma",
  "Establish boundaries",
  "Enhance emotional regulation",
  "Build self-esteem",
  "Practice gratitude daily",
  "Improve relationships",
  "Overcome depression",
  "Reduce negative self-talk",
  "Develop mindfulness practice",
  "Work through grief",
];

const TEXT_SCALES = [0.8, 1.0, 1.2, 1.5];

const INITIAL_GOALS = [
  { id: 1, text: "Practice mindfulness daily", position: { x: 50, y: 50 }, stickyType: "pin", isPinned: true, width: 200, height: 150, textScale: 1.0 },
  { id: 2, text: "Improve sleep schedule", position: { x: 300, y: 100 }, stickyType: "tape", isPinned: true, width: 200, height: 150, textScale: 1.0 },
];

export default function Goals() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  
  const [goals, setGoals] = useState([]);
  const [archivedGoals, setArchivedGoals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");
  const [draggedGoal, setDraggedGoal] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingGoal, setEditingGoal] = useState(null);
  const [editText, setEditText] = useState("");
  const [resizingGoal, setResizingGoal] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const navigate = useNavigate();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setGoals([]); // Clear goals if user logs out
        setArchivedGoals([]); // Clear archived goals
      }
    });

    return () => unsubscribe();
  }, []);

  // Load active goals from Firestore
  useEffect(() => {
    if (!userId) return;

    const goalsRef = collection(db, "goals");
    const q = query(goalsRef, where("userId", "==", userId), where("isArchived", "==", false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGoals(goalsData);
    });

    return () => unsubscribe();
  }, [userId]);

  // Load archived goals from Firestore
  useEffect(() => {
    if (!userId) return;

    const goalsRef = collection(db, "goals");
    const q = query(goalsRef, where("userId", "==", userId), where("isArchived", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const archivedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArchivedGoals(archivedData);
    });

    return () => unsubscribe();
  }, [userId]);

  // Goal management functions
  const addGoal = async (text) => {
    if (!userId) {
      alert("Please log in to add goals");
      return;
    }

    const newGoal = {
      userId,
      text,
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 150 },
      stickyType: "pin",
      isPinned: true,
      width: 200,
      height: 150,
      textScale: 1.0,
      isCompleted: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "goals"), newGoal);
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Failed to add goal. Please try again.");
    }
  };

  const deleteGoal = async (id) => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, "goals", id));
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("Failed to delete goal. Please try again.");
    }
  };

  const updateGoalInDB = async (id, updates) => {
    if (!userId) return;

    try {
      await updateDoc(doc(db, "goals", id), updates);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const toggleComplete = async (id) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newCompletedState = !goal.isCompleted;
    await updateGoalInDB(id, { isCompleted: newCompletedState });
  };

  const archiveGoal = async (id) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    await updateGoalInDB(id, { 
      isArchived: true,
      archivedAt: new Date().toISOString()
    });
  };

  const restoreGoal = async (id) => {
    const goal = archivedGoals.find(g => g.id === id);
    if (!goal) return;

    await updateGoalInDB(id, { 
      isArchived: false,
      isCompleted: false,
      archivedAt: null
    });
  };

  const deleteArchivedGoal = async (id) => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, "goals", id));
    } catch (error) {
      console.error("Error deleting archived goal:", error);
      alert("Failed to delete archived goal. Please try again.");
    }
  };

  const toggleStickyType = async (id) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newStickyType = goal.stickyType === "pin" ? "tape" : "pin";
    await updateGoalInDB(id, { stickyType: newStickyType });
  };

  const changeTextScale = async (id) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const currentIndex = TEXT_SCALES.indexOf(goal.textScale || 1.0);
    const nextIndex = (currentIndex + 1) % TEXT_SCALES.length;
    const newScale = TEXT_SCALES[nextIndex];
    
    await updateGoalInDB(id, { textScale: newScale });
  };

  // Modal handlers
  const addCustomGoal = () => {
    if (newGoalText.trim()) {
      addGoal(newGoalText);
      setNewGoalText("");
      setShowAddModal(false);
    }
  };

  const addPresetGoal = (preset) => {
    addGoal(preset);
    setShowPresetModal(false);
  };

  // Drag and resize handlers
  const handleMouseDown = (e, goal) => {
    if (editingGoal || resizingGoal) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggedGoal(goal);
  };

  const handleMouseMove = (e) => {
    if (draggedGoal && !resizingGoal) {
      const container = document.getElementById('goals-container');
      const containerRect = container.getBoundingClientRect();
      
      const newX = e.clientX - containerRect.left - dragOffset.x;
      const newY = e.clientY - containerRect.top - dragOffset.y;

      // Calculate boundaries to keep goal within board
      const maxX = containerRect.width - draggedGoal.width - 8; // 8px for padding
      const maxY = containerRect.height - draggedGoal.height - 8;

      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));

      const newPosition = { x: boundedX, y: boundedY };
      
      // Update local state immediately for smooth dragging
      setGoals(goals.map(goal =>
        goal.id === draggedGoal.id
          ? { ...goal, position: newPosition }
          : goal
      ));
    }
    
    if (resizingGoal) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(180, resizeStart.width + deltaX);
      const newHeight = Math.max(100, resizeStart.height + deltaY);

      // Calculate max size to keep within board
      const container = document.getElementById('goals-container');
      const containerRect = container.getBoundingClientRect();
      const goal = goals.find(g => g.id === resizingGoal.id);
      
      if (goal) {
        const maxWidth = containerRect.width - goal.position.x - 8;
        const maxHeight = containerRect.height - goal.position.y - 8;
        
        const boundedWidth = Math.min(newWidth, maxWidth);
        const boundedHeight = Math.min(newHeight, maxHeight);
        
        // Update local state immediately for smooth resizing
        setGoals(goals.map(g =>
          g.id === resizingGoal.id
            ? { ...g, width: boundedWidth, height: boundedHeight }
            : g
        ));
      }
    }
  };

  const handleMouseUp = async () => {
    // Save position to database when drag ends
    if (draggedGoal) {
      const goal = goals.find(g => g.id === draggedGoal.id);
      if (goal) {
        await updateGoalInDB(draggedGoal.id, { position: goal.position });
      }
    }
    
    // Save size to database when resize ends
    if (resizingGoal) {
      const goal = goals.find(g => g.id === resizingGoal.id);
      if (goal) {
        await updateGoalInDB(resizingGoal.id, { 
          width: goal.width, 
          height: goal.height 
        });
      }
    }
    
    setDraggedGoal(null);
    setResizingGoal(null);
  };

  // Edit handlers
  const handleDoubleClick = (e, goal) => {
    e.stopPropagation();
    setEditingGoal(goal.id);
    setEditText(goal.text);
  };

  const handleEditSave = async (goalId) => {
    if (editText.trim()) {
      await updateGoalInDB(goalId, { text: editText });
    }
    setEditingGoal(null);
    setEditText("");
  };

  const handleEditCancel = () => {
    setEditingGoal(null);
    setEditText("");
  };

  const handleResizeStart = (e, goal) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingGoal(goal);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: goal.width,
      height: goal.height,
    });
  };

  return (
    <>
      <UntiltNavBar />
      <div {...goalStyles.container(isEarthy)}>
        <div className="max-w-7xl mx-auto">
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
          <div className="mb-8">
            <h1 className={goalStyles.header.title(isEarthy)}>
              My Therapy Goals
            </h1>
            <p className={goalStyles.header.subtitle(isEarthy)}>
              Set, track, and organize your therapy goals. Drag them around, double-click to edit, resize from the corner, and adjust text size!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setShowPresetModal(true)}
              className={goalStyles.buttons.preset(isEarthy)}
            >
              + Choose from Presets
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className={goalStyles.buttons.custom(isEarthy)}
            >
              + Create Custom Goal
            </button>
            <button
              onClick={() => setShowArchiveModal(true)}
              className={goalStyles.buttons.archive(isEarthy)}
            >
              📦 View Archive ({archivedGoals.length})
            </button>
          </div>

          {/* Goals Board */}
          <div
            id="goals-container"
            className={goalStyles.board(isEarthy)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {goals.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className={goalStyles.emptyState(isEarthy)}>
                  No goals yet. Add some goals to get started!
                </p>
              </div>
            ) : (
              goals.map(goal => (
                <div
                  key={goal.id}
                  className={`${goalStyles.card.container(
                    editingGoal === goal.id,
                    draggedGoal?.id === goal.id,
                    resizingGoal?.id === goal.id
                  )} ${goal.isCompleted ? 'opacity-50' : ''}`}
                  style={{
                    left: `${goal.position.x}px`,
                    top: `${goal.position.y}px`,
                    width: `${goal.width}px`,
                    height: `${goal.height}px`,
                    transition: 'opacity 0.3s ease',
                  }}
                  onMouseDown={(e) => editingGoal !== goal.id && handleMouseDown(e, goal)}
                  onDoubleClick={(e) => handleDoubleClick(e, goal)}
                >
                  {/* Sticky Note Card */}
                  <div
                    className={goalStyles.card.inner(isEarthy)}
                    style={{ height: `${goal.height}px` }}
                  >
                    {/* Pin/Tape Icon */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      {goal.stickyType === "pin" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStickyType(goal.id);
                          }}
                          className={goalStyles.card.pin(isEarthy)}
                          title="Click to switch to tape"
                        >
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-2"></div>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStickyType(goal.id);
                          }}
                          className={goalStyles.card.tape(isEarthy)}
                          title="Click to switch to pin"
                        >
                          <div className={goalStyles.card.tapeInner(isEarthy)}></div>
                        </button>
                      )}
                    </div>

                    {/* Completion Checkbox - Top Left */}
                    {editingGoal !== goal.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComplete(goal.id);
                        }}
                        className={goalStyles.buttons.complete(isEarthy, goal.isCompleted)}
                        title={goal.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {goal.isCompleted ? "✓" : ""}
                      </button>
                    )}

                    {/* Delete Button - Top Right */}
                    {editingGoal !== goal.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGoal(goal.id);
                        }}
                        className={goalStyles.buttons.delete(isEarthy)}
                        title="Delete goal"
                      >
                        ×
                      </button>
                    )}

                    {/* Goal Text */}
                    {editingGoal === goal.id ? (
                      <div className="flex-1 flex flex-col overflow-hidden min-h-[60px]">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className={goalStyles.textarea(isEarthy)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              handleEditSave(goal.id);
                            } else if (e.key === 'Escape') {
                              handleEditCancel();
                            }
                          }}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              changeTextScale(goal.id);
                            }}
                            className={goalStyles.buttons.textSize(isEarthy)}
                            title="Click to change text size relative to box"
                          >
                            Size: {getTextScaleLabel(goal.textScale)}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSave(goal.id);
                            }}
                            className={goalStyles.buttons.save(isEarthy)}
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCancel();
                            }}
                            className={goalStyles.buttons.cancel(isEarthy)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={goalStyles.card.text(isEarthy)}
                        style={{ 
                          fontSize: getRelativeFontSize(goal)
                        }}
                      >
                        {goal.text}
                      </div>
                    )}

                    {/* Archive Button - Bottom Center (Green Tick) */}
                    {editingGoal !== goal.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveGoal(goal.id);
                        }}
                        className={goalStyles.buttons.archiveBottomTick(isEarthy)}
                        title="Archive goal"
                      >
                        ✓
                      </button>
                    )}

                    {/* Resize Handle */}
                    {editingGoal !== goal.id && (
                      <div
                        onMouseDown={(e) => handleResizeStart(e, goal)}
                        className={goalStyles.card.resizeHandle(isEarthy)}
                        style={{
                          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                        }}
                        title="Drag to resize"
                      >
                        <div className="absolute bottom-0.5 right-0.5 text-white text-xs">⋰</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Custom Goal Modal */}
        {showAddModal && (
          <div className={goalStyles.modal.overlay}>
            <div
              className={goalStyles.modal.container(isEarthy)}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={goalStyles.modal.title(isEarthy)}>
                Create Custom Goal
              </h2>
              <textarea
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Enter your therapy goal..."
                className={goalStyles.modal.textarea(isEarthy)}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={addCustomGoal}
                  disabled={!newGoalText.trim()}
                  className={goalStyles.modal.submitButton(isEarthy, !newGoalText.trim())}
                >
                  Add Goal
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewGoalText("");
                  }}
                  className={goalStyles.modal.cancelButton(isEarthy)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preset Goals Modal */}
        {showPresetModal && (
          <div className={goalStyles.modal.overlay}>
            <div
              className={goalStyles.modal.containerLarge(isEarthy)}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={goalStyles.modal.title(isEarthy)}>
                Choose a Preset Goal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {PRESET_GOALS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => addPresetGoal(preset)}
                    className={goalStyles.modal.presetButton(isEarthy)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPresetModal(false)}
                className={goalStyles.modal.closeButton(isEarthy)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Archive Modal */}
        {showArchiveModal && (
          <div className={goalStyles.modal.overlay}>
            <div
              className={goalStyles.modal.containerLarge(isEarthy)}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={goalStyles.modal.title(isEarthy)}>
                Archived Goals ({archivedGoals.length})
              </h2>
              {archivedGoals.length === 0 ? (
                <p className={`text-center py-8 ${isEarthy ? "text-brown-600" : "text-slate-blue"}`}>
                  No archived goals yet.
                </p>
              ) : (
                <div className="space-y-3 mb-4 max-h-[60vh] overflow-y-auto">
                  {archivedGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className={`p-4 rounded-lg border-2 ${
                        isEarthy
                          ? "border-tan-300 bg-cream-50"
                          : "border-cool-grey bg-pale-lavender"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className={`font-medium mb-1 ${
                            isEarthy ? "text-brown-800" : "text-charcoal-grey"
                          }`}>
                            {goal.text}
                          </p>
                          <p className={`text-xs ${
                            isEarthy ? "text-brown-600" : "text-slate-blue"
                          }`}>
                            Archived: {new Date(goal.archivedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => restoreGoal(goal.id)}
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              isEarthy
                                ? "bg-rust-500 hover:bg-rust-600"
                                : "bg-slate-blue hover:bg-charcoal-grey"
                            } text-white transition-colors`}
                            title="Restore to board"
                          >
                            ↩ Restore
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Permanently delete this archived goal?')) {
                                deleteArchivedGoal(goal.id);
                              }
                            }}
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              isEarthy
                                ? "bg-tan-300 hover:bg-tan-400 text-brown-800"
                                : "bg-cool-grey hover:bg-slate-blue text-white"
                            } transition-colors`}
                            title="Delete permanently"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowArchiveModal(false)}
                className={goalStyles.modal.closeButton(isEarthy)}
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
