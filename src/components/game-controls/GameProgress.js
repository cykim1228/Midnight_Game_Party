import React from 'react';
import Timer from '../common/Timer';
import ScoreDisplay from '../common/ScoreDisplay';
import '../../styles/styles.css';

function GameProgress({ 
  mode,
  score, 
  timer, 
  targetScore, 
  elapsedTime,
  totalQuestions = null,
  currentQuestion = null
}) {
  return (
    <div className="game-status">
      {mode === 'time' ? (
        <>
          <Timer time={timer} isWarning={timer <= 10} />
          <ScoreDisplay score={score} />
        </>
      ) : (
        <>
          <div className="target-progress">
            목표까지: {targetScore - score}개
          </div>
          <div className="elapsed-time">
            경과 시간: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
          </div>
        </>
      )}

      {totalQuestions && (
        <div className="question-progress">
          {currentQuestion} / {totalQuestions}
        </div>
      )}
    </div>
  );
}

export default GameProgress;