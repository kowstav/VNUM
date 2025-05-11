import React from "react";
import styles from "./Widget.module.css";
import Transcription from "./Transcription";
import WidgetButtons from "./WidgetButtons";

const Widget = () => {
  return (
    <div className={styles.widget}>
      <Transcription />
      <WidgetButtons />
    </div>
  );
};

export default Widget;