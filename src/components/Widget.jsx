import React, { useState } from "react";
import styles from "./Widget.module.css";
import Transcription from "./Transcription";
import WidgetButtons from "./WidgetButtons";

const Widget = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => setIsFullscreen(f => !f);

  return (
    <div
      className={`${styles.widget} ${isFullscreen ? styles.fullscreen : ""}`}
    >
      <Transcription />
      <WidgetButtons
        onFullscreen={handleFullscreen}
        isFullscreen={isFullscreen}
      />
    </div>
  );
};

export default Widget;