import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Voice Transcription. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;