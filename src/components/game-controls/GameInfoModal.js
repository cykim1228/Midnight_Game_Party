import React from 'react';
import '../../styles/styles.css';

function GameInfoModal({ isOpen, onClose, gameInfo }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>

        <h2 className="modal-title">{gameInfo.title}</h2>

        <div className="modal-section">
          <h3 className="modal-section-title">게임 설명</h3>
          <p className="modal-description">{gameInfo.description}</p>
        </div>

        <div className="modal-section">
          <h3 className="modal-section-title">게임 규칙</h3>
          <ul className="modal-list">
            {gameInfo.rules.map((rule, index) => (
              <li key={index} className="modal-list-item">{rule}</li>
            ))}
          </ul>
        </div>

        <div className="modal-section">
          <h3 className="modal-section-title">조작 방법</h3>
          <ul className="modal-list">
            {gameInfo.controls.map((control, index) => (
              <li key={index} className="modal-list-item">{control}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GameInfoModal;