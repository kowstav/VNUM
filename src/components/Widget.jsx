import React, { useState, useRef, useEffect } from "react";
import styles from "./Widget.module.css";
import Transcription from "./Transcription";
import WidgetButtons from "./WidgetButtons";
import RadialSpread from "./RadialSpread"; // Add this import

const Widget = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const widgetRef = useRef(null);
  const [initialSize, setInitialSize] = useState(null);

  // Store initial size when component mounts
  useEffect(() => {
    if (widgetRef.current && !initialSize) {
      const { width, height } = widgetRef.current.getBoundingClientRect();
      setInitialSize({
        width: width,
        height: height
      });
    }
  }, []);

  // Add event listener for drip animation
  useEffect(() => {
    const handleDrip = () => {
      // Any additional widget-specific logic when drip occurs
      // This will be triggered when the blob is clicked
    };

    document.addEventListener('triggerDrip', handleDrip);
    return () => document.removeEventListener('triggerDrip', handleDrip);
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
        transform: 'translate(-50%, -50%)'
      };
    }
    
    // Return to initial size if it exists, otherwise use default CSS
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
      id="mainWidget" // Add this ID for RadialSpread targeting
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