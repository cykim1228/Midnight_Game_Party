import React from 'react';
import '../../styles/styles.css';

function Timer({ time, isWarning = false }) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className={`timer ${isWarning ? 'timer-warning' : ''}`}>
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default Timer;