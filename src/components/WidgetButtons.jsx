import React, { useState } from "react";
import styles from "./Widget.module.css";

const MaximizeIcon = ({ isMaximized }) => (
  <svg 
    className={styles.maximizeIconSvg}
    viewBox="0 0 24 24" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {isMaximized ? (
      // Minimize icon - arrow pointing bottom-left
      <path 
        d="M19 5L5 19M5 19V9M5 19H15" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ) : (
      // Maximize icon - arrow pointing top-right
      <path 
        d="M5 19L19 5M19 5V15M19 5H9" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    )}
  </svg>
);

const WidgetButtons = ({ onFullscreen, isFullscreen }) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };

  return (
    <>
      <div className={styles.leftControls}>
        <button className={styles.addButton} aria-label="Add">
          +
        </button>
        <button 
          className={styles.recordToggle} 
          onClick={handleRecordToggle} 
          aria-label={isRecording ? "Pause" : "Record"}
        >
          {isRecording ? (
            <>
              <span className={styles.recordIcon} />
              <span>Pause</span>
            </>
          ) : (
            <>
              <svg className={styles.micIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="currentColor"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="currentColor"/>
              </svg>
              <span>Record</span>
            </>
          )}
        </button>
      </div>

      <button
        className={styles.maximizeIcon}
        onClick={onFullscreen}
        aria-label={isFullscreen ? "Minimize" : "Maximize"}
      >
        <MaximizeIcon isMaximized={isFullscreen} />
      </button>

      <div className={styles.rightControls}>
        <button className={styles.playButton} aria-label="Play">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </>
  );
};

export default WidgetButtons;