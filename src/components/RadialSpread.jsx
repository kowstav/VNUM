import React, { useEffect } from 'react';
import styles from './RadialSpread.module.css';

const RadialSpread = ({ targetContainerId }) => {
  useEffect(() => {
    const handleDrip = () => {
      console.log('Drip event received'); // Debug log
      
      // Create and position the drop
      const drop = document.createElement('div');
      drop.classList.add(styles.drop);
      document.body.appendChild(drop);

      // Get blob position for drop positioning
      const blob = document.querySelector('[data-blob-container]');
      console.log('Blob element found:', blob); // Debug log
      
      if (blob) {
        const blobRect = blob.getBoundingClientRect();
        console.log('Blob position:', blobRect); // Debug log
        drop.style.left = `${blobRect.left + blobRect.width / 2}px`;
        drop.style.top = `${blobRect.top + blobRect.height}px`;
      }

      // Handle the drop animation completion
      setTimeout(() => {
        drop.remove();
        const container = document.getElementById(targetContainerId);
        console.log('Target container found:', container); // Debug log
        
        if (container) {
          const wave = document.createElement('div');
          wave.classList.add(styles.radialWave);
          container.appendChild(wave);

          // Add darkening effect
          setTimeout(() => {
            container.style.background = 'rgba(0, 0, 0, 0.6)';
          }, 500);

          // Clean up wave after animation
          setTimeout(() => {
            wave.remove();
          }, 2000);
        }
      }, 600);
    };

    console.log('RadialSpread mounted, adding event listener'); // Debug log
    document.addEventListener('triggerDrip', handleDrip);
    return () => {
      console.log('RadialSpread unmounted, removing event listener'); // Debug log
      document.removeEventListener('triggerDrip', handleDrip);
    };
  }, [targetContainerId]);

  return null;
};

export default RadialSpread;