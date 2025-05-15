import React from "react";
import styles from "./Widget.module.css";

const Transcription = ({ transcriptions = [] }) => {
  return (
    <div className={styles.transcriptionContainer}>
      {transcriptions.length === 0 ? (
        <p className={styles.waitingMessage}>Waiting for transcription...</p>
      ) : (
        <div className={styles.transcriptionContent}>
          {transcriptions.map((text, index) => (
            <div 
              key={index}
              className={styles.transcriptionEntry}
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transcription;