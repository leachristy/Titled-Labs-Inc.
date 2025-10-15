export const goalStyles = {
  // Container styles
  container: (isEarthy) => ({
    className: `min-h-screen px-4 pt-24 pb-12 ${
      isEarthy ? "bg-cream-100" : "bg-pale-lavender"
    }`,
    style: { backgroundColor: isEarthy ? undefined : "var(--pale-lavender)" }
  }),

  // Header styles
  header: {
    title: (isEarthy) => `text-4xl font-bold mb-2 ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`,
    subtitle: (isEarthy) => `text-lg ${isEarthy ? "text-brown-600" : "text-slate-blue"}`
  },

  // Button styles
  buttons: {
    preset: (isEarthy) => `${
      isEarthy
        ? "bg-rust-500 hover:bg-rust-600"
        : "bg-slate-blue hover:bg-charcoal-grey"
    } text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`,
    
    custom: (isEarthy) => `${
      isEarthy
        ? "bg-terracotta-400 hover:bg-terracotta-500"
        : "bg-blue-grey hover:bg-slate-blue"
    } text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`,

    archive: (isEarthy) => `${
      isEarthy
        ? "bg-tan-500 hover:bg-tan-600"
        : "bg-cool-grey hover:bg-slate-blue"
    } text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`,

    complete: (isEarthy, isCompleted) => `absolute -top-2 -left-2 w-6 h-6 rounded border-2 ${
      isCompleted
        ? isEarthy
          ? "bg-rust-500 border-rust-600"
          : "bg-slate-blue border-charcoal-grey"
        : isEarthy
        ? "bg-white border-tan-400 hover:border-rust-500"
        : "bg-white border-cool-grey hover:border-slate-blue"
    } text-white flex items-center justify-center text-xs font-bold shadow-md transition-all z-10 cursor-pointer`,

    archiveSmall: (isEarthy) => `w-6 h-6 rounded-full ${
      isEarthy
        ? "bg-tan-500 hover:bg-tan-600"
        : "bg-cool-grey hover:bg-slate-blue"
    } text-white flex items-center justify-center text-xs shadow-md transition-colors`,

    archiveBottomTick: (isEarthy) => `absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center text-lg font-bold shadow-lg transition-all z-10 cursor-pointer hover:scale-110`,

    delete: (isEarthy) => `absolute -top-2 -right-2 w-6 h-6 rounded-full ${
      isEarthy
        ? "bg-rust-400 hover:bg-rust-500"
        : "bg-slate-blue hover:bg-charcoal-grey"
    } text-white flex items-center justify-center text-xs font-bold shadow-md transition-colors z-10`,

    textSize: (isEarthy) => `px-3 py-1 rounded text-xs font-semibold ${
      isEarthy
        ? "bg-terracotta-400 hover:bg-terracotta-500"
        : "bg-blue-grey hover:bg-slate-blue"
    } text-white transition-colors`,

    save: (isEarthy) => `flex-1 text-xs py-1 px-2 rounded ${
      isEarthy
        ? "bg-rust-500 hover:bg-rust-600"
        : "bg-slate-blue hover:bg-charcoal-grey"
    } text-white font-semibold transition-colors`,

    cancel: (isEarthy) => `flex-1 text-xs py-1 px-2 rounded ${
      isEarthy
        ? "bg-tan-300 hover:bg-tan-400 text-brown-800"
        : "bg-cool-grey hover:bg-slate-blue text-white"
    } font-semibold transition-colors`
  },

  // Goals board styles
  board: (isEarthy) => `relative min-h-[800px] w-full overflow-hidden ${
    isEarthy ? "bg-tan-50 border-tan-300" : "bg-white border-cool-grey"
  } border-2 rounded-lg shadow-inner p-4`,

  emptyState: (isEarthy) => `text-lg ${isEarthy ? "text-brown-500" : "text-slate-blue"} opacity-50`,

  // Goal card styles
  card: {
    container: (isEditing, isDragged, isResizing) => `absolute ${
      isEditing ? 'cursor-default' : 'cursor-move'
    } select-none transition-shadow ${
      isDragged || isResizing ? "shadow-2xl scale-105 z-10" : "shadow-lg hover:shadow-xl"
    }`,

    inner: (isEarthy) => `relative p-4 rounded-lg flex flex-col ${
      isEarthy ? "bg-cream-200" : "bg-pale-lavender"
    } border-2 ${
      isEarthy ? "border-tan-400" : "border-cool-grey"
    }`,

    pin: (isEarthy) => `w-6 h-6 rounded-full ${
      isEarthy ? "bg-rust-500" : "bg-slate-blue"
    } shadow-md hover:scale-110 transition-transform`,

    tape: (isEarthy) => `w-16 h-4 ${
      isEarthy ? "bg-tan-400" : "bg-cool-grey"
    } opacity-60 rounded-sm shadow-md hover:opacity-80 transition-opacity`,

    tapeInner: (isEarthy) => `h-0.5 ${isEarthy ? "bg-tan-600" : "bg-charcoal-grey"} mx-2 mt-1.5`,

    text: (isEarthy) => `font-medium flex-1 overflow-y-auto break-words whitespace-pre-wrap flex items-center justify-center text-center leading-relaxed ${
      isEarthy ? "text-brown-800" : "text-charcoal-grey"
    }`,

    resizeHandle: (isEarthy) => `absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize ${
      isEarthy ? "bg-rust-500" : "bg-slate-blue"
    } opacity-30 hover:opacity-70 transition-opacity rounded-tl-lg z-10`
  },

  // Textarea styles
  textarea: (isEarthy) => `flex-1 w-full p-2 border rounded resize-none ${
    isEarthy
      ? "border-tan-300 focus:border-rust-500 bg-white text-brown-800"
      : "border-cool-grey focus:border-slate-blue bg-white text-charcoal-grey"
  } focus:outline-none focus:ring-2 ${
    isEarthy ? "focus:ring-rust-500" : "focus:ring-slate-blue"
  } focus:ring-opacity-50`,

  // Modal styles
  modal: {
    overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
    
    container: (isEarthy) => `${
      isEarthy ? "bg-cream-100" : "bg-white"
    } rounded-lg shadow-2xl max-w-md w-full p-6`,

    containerLarge: (isEarthy) => `${
      isEarthy ? "bg-cream-100" : "bg-white"
    } rounded-lg shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto`,

    title: (isEarthy) => `text-2xl font-bold mb-4 ${
      isEarthy ? "text-brown-800" : "text-charcoal-grey"
    }`,

    textarea: (isEarthy) => `w-full h-32 p-3 border-2 rounded-lg mb-4 resize-none ${
      isEarthy
        ? "border-tan-300 focus:border-rust-500 bg-white text-brown-800"
        : "border-cool-grey focus:border-slate-blue bg-pale-lavender text-charcoal-grey"
    } focus:outline-none focus:ring-2 ${
      isEarthy ? "focus:ring-rust-500" : "focus:ring-slate-blue"
    } focus:ring-opacity-50`,

    submitButton: (isEarthy, disabled) => `flex-1 ${
      isEarthy
        ? "bg-rust-500 hover:bg-rust-600"
        : "bg-slate-blue hover:bg-charcoal-grey"
    } text-white px-4 py-2 rounded-lg font-semibold ${
      disabled ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""
    } transition-colors`,

    cancelButton: (isEarthy) => `flex-1 ${
      isEarthy
        ? "bg-tan-300 hover:bg-tan-400 text-brown-800"
        : "bg-cool-grey hover:bg-slate-blue text-white"
    } px-4 py-2 rounded-lg font-semibold transition-colors`,

    closeButton: (isEarthy) => `w-full ${
      isEarthy
        ? "bg-tan-300 hover:bg-tan-400 text-brown-800"
        : "bg-cool-grey hover:bg-slate-blue text-white"
    } px-4 py-2 rounded-lg font-semibold transition-colors`,

    presetButton: (isEarthy) => `text-left p-3 rounded-lg border-2 ${
      isEarthy
        ? "border-tan-300 hover:border-rust-500 bg-white hover:bg-cream-50 text-brown-800"
        : "border-cool-grey hover:border-slate-blue bg-pale-lavender hover:bg-white text-charcoal-grey"
    } transition-all duration-200 hover:shadow-md`
  }
};

// Helper functions for dynamic font sizing
export const getRelativeFontSize = (goal) => {
  const baseSize = Math.min(goal.width, goal.height) * 0.14; // 14% of smaller dimension
  const scale = goal.textScale || 1.0;
  return `${baseSize * scale}px`;
};

export const getTextScaleLabel = (scale) => {
  if (scale === 0.8) return "XS";
  if (scale === 1.0) return "S";
  if (scale === 1.2) return "M";
  if (scale === 1.5) return "L";
  return "S";
};
