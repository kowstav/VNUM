import React, { useState, useRef, useEffect } from "react";
import styles from "./Widget.module.css";
import Transcription from "./Transcription";
import WidgetButtons from "./WidgetButtons";
import RadialSpread from "./RadialSpread"; // Updated path

const Widget = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const widgetRef = useRef(null);
  const [initialSize, setInitialSize] = useState(null);

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
        height: '60vh',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000
      };
    }
    return initialSize ? {
      width: `${initialSize.width}px`,
      height: `${initialSize.height}px`,
      position: 'relative',
      transform: 'none'
    } : {};
  };

  return (
    <div
      ref={widgetRef}
      className={`${styles.widget} ${isMaximized ? styles.maximized : ''}`}
      style={getWidgetStyle()}
      id="mainWidget"
    >
      <Transcription />
      <WidgetButtons
        onFullscreen={handleMaximizeToggle}
        isFullscreen={isMaximized}
      />
      <RadialSpread targetContainerId="mainWidget" />
    </div>
  );
};

export default Widget;