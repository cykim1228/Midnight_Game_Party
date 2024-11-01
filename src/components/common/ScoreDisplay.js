import React from 'react';
import '../../styles/styles.css';

function ScoreDisplay({ showAnimation = false }) {
  if (!showAnimation) return null;

  return (
    <div className="score-animation">
      +1
    </div>
  );
}

export default ScoreDisplay;