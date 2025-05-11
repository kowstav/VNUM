import React from "react";
import styles from "./Widget.module.css";

const WidgetButtons = ({ onFullscreen, isFullscreen }) => (
  <div className={styles.buttons}>
    <button onClick={onFullscreen} aria-label="Fullscreen">
      {isFullscreen ? "🗗" : "⛶"}
    </button>
    <button aria-label="Mic">🎤</button>
    <button aria-label="Settings">⚙️</button>
    <button aria-label="Help">❔</button>
    <button aria-label="Menu">⋮</button>
  </div>
);

export default WidgetButtons;