import React from 'react';
import Button from '../common/Button';
import { gameSettings } from '../../config/gameConfig';
import '../../styles/styles.css';

function TimeSettings({ timeLimit, onTimeChange }) {
  const { minTimeLimit, maxTimeLimit, timeLimitStep } = gameSettings.common;

  return (
    <div className="settings time-settings">
      <h3 className="settings-title">시간 제한 설정</h3>
      <div className="settings-controls">
        <Button 
          variant="primary"
          onClick={() => onTimeChange(Math.max(minTimeLimit, timeLimit - timeLimitStep))}
          disabled={timeLimit <= minTimeLimit}
        >
          -30초
        </Button>

        <div className="settings-value">
          {Math.floor(timeLimit / 60)}분 {timeLimit % 60}초
        </div>

        <Button 
          variant="primary"
          onClick={() => onTimeChange(Math.min(maxTimeLimit, timeLimit + timeLimitStep))}
          disabled={timeLimit >= maxTimeLimit}
        >
          +30초
        </Button>
      </div>
    </div>
  );
}

export default TimeSettings;