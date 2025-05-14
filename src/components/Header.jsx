import React, { useState } from 'react';
import styles from './Header.module.css';
import PopUpMenu from './PopUpMenu';

const Header = () => {
  const [activePopup, setActivePopup] = useState(null);

  const menuItems = [
    {
      id: 1,
      title: 'About',
      content: `
        <h2>About Us</h2>
        <p>Welcome to our innovative transcription platform!</p>
        <p>Our system combines cutting-edge audio processing with 
        visual feedback to create an intuitive transcription experience.</p>
      `
    },
    {
      id: 2,
      title: 'Help',
      content: `
        <h2>How to Use</h2>
        <ul>
          <li>Click on the blob to start audio input</li>
          <li>Speak clearly into your microphone</li>
          <li>Watch as the blob responds to your voice</li>
          <li>View your transcription in the widget below</li>
        </ul>
      `
    },
    {
      id: 3,
      title: 'Contact',
      content: `
        <h2>Get in Touch</h2>
        <p>We'd love to hear from you!</p>
        <p>Email: contact@example.com</p>
        <p>Twitter: @example</p>
        <p>GitHub: github.com/example</p>
      `
    }
  ];

  const handleMenuClick = (id) => {
    setActivePopup(activePopup === id ? null : id);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/path-to-your-logo.png" alt="Logo" />
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <div key={item.id} className={styles.menuItem}>
            <button 
              onClick={() => handleMenuClick(item.id)}
              className={activePopup === item.id ? styles.active : ''}
            >
              {item.title}
            </button>
            {activePopup === item.id && (
              <PopUpMenu 
                content={item.content}
                onClose={() => setActivePopup(null)}
              />
            )}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Header;