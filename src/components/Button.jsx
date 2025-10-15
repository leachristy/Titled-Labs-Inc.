import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const CustomButton = ({ isEarthy = false, onClick, children, className = "" }) => {
    const baseClasses = "px-6 py-2 text-white transition rounded-lg";
    const earthyClasses = "bg-rust-500 hover:bg-rust-600";
    const slateClasses = "bg-slate-blue";
  
    const handleMouseEnter = (e) => {
      if (!isEarthy) e.currentTarget.style.backgroundColor = "var(--charcoal-grey)";
    };
  
    const handleMouseLeave = (e) => {
      if (!isEarthy) e.currentTarget.style.backgroundColor = "var(--slate-blue)";
    };
  
    return (
      <button
        className={`${baseClasses} ${isEarthy ? earthyClasses : slateClasses} ${className}`}
        style={{ backgroundColor: isEarthy ? undefined : "var(--slate-blue)" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
  
export default CustomButton;
