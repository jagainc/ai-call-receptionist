import React from "react";
import "./ThemeToggle.css";

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      className={`theme-toggle${isDark ? " dark" : ""}`}
      onClick={onToggle}
      aria-label="Toggle dark mode"
      type="button"
    >
      <span className="toggle-thumb" />
      <span className="toggle-icon sun">☀️</span>
      <span className="toggle-icon moon">🌙</span>
    </button>
  );
}

export default ThemeToggle;