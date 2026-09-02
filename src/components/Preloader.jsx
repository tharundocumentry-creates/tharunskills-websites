import React, { useEffect, useState } from 'react';
import './Preloader.css';

const FRAME_COUNT = 95;

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const images = new Array(FRAME_COUNT);

    const updateProgress = () => {
      loadedCount++;
      const currentProgress = Math.floor((loadedCount / FRAME_COUNT) * 100);
      setProgress(currentProgress);

      if (loadedCount >= FRAME_COUNT) {
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete(images);
          }, 600);
        }, 200);
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = (i + 1).toString().padStart(4, '0');
      img.src = `/robot-frames/${frameNum}.png`;

      img.onload = updateProgress;
      img.onerror = updateProgress; // Continue even if a frame fails
      images[i] = img;
    }
  }, [onComplete]);

  return (
    <div className={`preloader-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-title text-gradient cursive-text">Tharun</div>
        <div className="preloader-subtitle text-accent">CREATIVE ANIMATOR & VIDEO EDITOR</div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="progress-percentage">
          <span>Loading Experience</span>
          <span className="percent-number">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
