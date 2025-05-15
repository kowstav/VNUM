import React, { useState, useRef, useEffect } from "react";
import styles from "./Widget.module.css";
import WidgetButtons from "./WidgetButtons";
import Transcription from "./Transcription";

const Widget = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const widgetRef = useRef(null);
  const [initialSize, setInitialSize] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);

  useEffect(() => {
    if (widgetRef.current && !initialSize) {
      const { width, height } = widgetRef.current.getBoundingClientRect();
      setInitialSize({
        width: width,
        height: height
      });
    }
  }, []);

  const handleMaximizeToggle = () => {
    setIsMaximized(prevState => !prevState);
  };

  const getWidgetStyle = () => {
    if (isMaximized) {
      return {
        width: '60vw',
        height: '60vh'
      };
    }
    return initialSize ? {
      width: `${initialSize.width}px`,
      height: `${initialSize.height}px`
    } : {};
  };

  return (
    <div
      ref={widgetRef}
      className={`${styles.widget} ${isMaximized ? styles.maximized : ''}`}
      style={getWidgetStyle()}
      id="mainWidget"
    >
      <div className={styles.widgetContent}>
        <Transcription transcriptions={transcriptions} />
      </div>
      <div className={styles.widgetControls}>
        <WidgetButtons
          onFullscreen={handleMaximizeToggle}
          isFullscreen={isMaximized}
        />
      </div>
    </div>
  );
};

export default Widget;