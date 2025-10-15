import { useState } from "react";
import UntiltNavBar from "../../components/UntiltNavBar";
import { useTheme } from "../../contexts/ThemeContext";
import { goalStyles, getRelativeFontSize, getTextScaleLabel } from "../app-styles/Goal.styles";

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
  
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");
  const [draggedGoal, setDraggedGoal] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingGoal, setEditingGoal] = useState(null);
  const [editText, setEditText] = useState("");
  const [resizingGoal, setResizingGoal] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Goal management functions
  const addGoal = (text) => {
    const newGoal = {
      id: Date.now(),
      text,
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 150 },
      stickyType: "pin",
      isPinned: true,
      width: 200,
      height: 150,
      textScale: 1.0,
    };
    setGoals([...goals, newGoal]);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const toggleStickyType = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, stickyType: goal.stickyType === "pin" ? "tape" : "pin" }
        : goal
    ));
  };

  const changeTextScale = (id) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const currentIndex = TEXT_SCALES.indexOf(goal.textScale || 1.0);
        const nextIndex = (currentIndex + 1) % TEXT_SCALES.length;
        return { ...goal, textScale: TEXT_SCALES[nextIndex] };
      }
      return goal;
    }));
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

      setGoals(goals.map(goal =>
        goal.id === draggedGoal.id
          ? { ...goal, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : goal
      ));
    }
    
    if (resizingGoal) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(180, resizeStart.width + deltaX);
      const newHeight = Math.max(100, resizeStart.height + deltaY);
      
      setGoals(goals.map(goal =>
        goal.id === resizingGoal.id
          ? { ...goal, width: newWidth, height: newHeight }
          : goal
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedGoal(null);
    setResizingGoal(null);
  };

  // Edit handlers
  const handleDoubleClick = (e, goal) => {
    e.stopPropagation();
    setEditingGoal(goal.id);
    setEditText(goal.text);
  };

  const handleEditSave = (goalId) => {
    if (editText.trim()) {
      setGoals(goals.map(goal =>
        goal.id === goalId
          ? { ...goal, text: editText }
          : goal
      ));
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
          <div className="flex gap-4 mb-8">
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
                  className={goalStyles.card.container(
                    editingGoal === goal.id,
                    draggedGoal?.id === goal.id,
                    resizingGoal?.id === goal.id
                  )}
                  style={{
                    left: `${goal.position.x}px`,
                    top: `${goal.position.y}px`,
                    width: `${goal.width}px`,
                    height: `${goal.height}px`,
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
      </div>
    </>
  );
}
