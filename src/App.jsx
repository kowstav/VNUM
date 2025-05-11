import React from "react";
import Widget from "./components/Widget";
import BlobContainer from "./components/BlobContainer";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}></header>
      <div className={styles.blobSection}>
        <BlobContainer />
      </div>
      <div className={styles.widgetSection}>
        <Widget />
      </div>
      <footer className={styles.footer}></footer>
    </div>
  );
}