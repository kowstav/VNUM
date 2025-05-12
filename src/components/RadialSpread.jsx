import React from 'react';
import styles from './RadialSpread.module.css';

const RadialSpread = ({ targetContainerId }) => {
  const createDrip = () => {
    const drop = document.createElement('div');
    drop.classList.add(styles.drop);
    document.body.appendChild(drop);

    // Position the drop relative to the existing blob
    const blob = document.querySelector('[data-blob-container]');
    if (blob) {
      const blobRect = blob.getBoundingClientRect();
      drop.style.left = `${blobRect.left + blobRect.width / 2}px`;
      drop.style.top = `${blobRect.bottom}px`;
    }

    setTimeout(() => {
      drop.remove();
      const wave = document.createElement('div');
      wave.classList.add(styles.radialWave);
      const container = document.getElementById(targetContainerId);
      if (container) {
        container.appendChild(wave);
        
        setTimeout(() => {
          container.style.background = 'rgba(0, 0, 0, 0.6)';
        }, 500);
      }
    }, 600);
  };

  return null; // This component doesn't render anything
};

export default RadialSpread;