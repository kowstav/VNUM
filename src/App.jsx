import React from "react";
import Widget from "./components/Widget";
import BlobContainer from "./components/BlobContainer";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.appContainer}>
      <div className={styles.topSection}>
        <BlobContainer />
      </div>
      <div className={styles.bottomSection}>
        <Widget />
      </div>
    </div>
  );
}