import React from 'react';
import { gameSettings } from '../../config/gameConfig';
import '../../styles/styles.css';

function ModeSelection({ onSelectMode }) {
  return (
    <div className="mode-selection">
      <h2 className="mode-selection-title">게임 모드 선택</h2>
      <div className="mode-buttons">
        <button 
          className="mode-button"
          onClick={() => onSelectMode('time')}
        >
          <div className="mode-icon">⏱️</div>
          <div className="mode-name">{gameSettings.modes.time.name}</div>
          <div className="mode-description">
            {gameSettings.modes.time.description}
          </div>
        </button>

        <button 
          className="mode-button"
          onClick={() => onSelectMode('target')}
        >
          <div className="mode-icon">🎯</div>
          <div className="mode-name">{gameSettings.modes.target.name}</div>
          <div className="mode-description">
            {gameSettings.modes.target.description}
          </div>
        </button>
      </div>
    </div>
  );
}

export default ModeSelection;