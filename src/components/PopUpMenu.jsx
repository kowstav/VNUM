import React, { useEffect, useRef } from 'react';
import styles from './PopUpMenu.module.css';

const PopUpMenu = ({ content, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.popupOverlay}>
      <div 
        ref={popupRef}
        className={styles.popup}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default PopUpMenu;