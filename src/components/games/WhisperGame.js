import React, { useState } from 'react';
import { getTeamData } from '../../data/gameData';
import { GAME_INFO } from '../../data/gameInfo';
import GameInfoModal from '../game-controls/GameInfoModal';
import GameProgress from '../game-controls/GameProgress';
import ModeSelection from '../game-controls/ModeSelection';
import TimeSettings from '../game-controls/TimeSettings';
import Button from '../common/Button';
import ScoreDisplay from '../common/ScoreDisplay';
import AnswerList from '../common/AnswerList';
import { useGameLogic } from '../../hooks/useGameLogic';
import '../../styles/styles.css';

function WhisperGame({ selectedTeam, onGameEnd }) {
  const {
    gameState,
    gameMode,
    timeLimit,
    timer,
    score,
    targetScore,
    elapsedTime,
    showScore,
    answers,
    handleModeSelect,
    handleTimeChange,
    handleTargetScoreChange,
    startGame,
    handleAnswer
  } = useGameLogic({
    gameType: 'whisper',
    selectedTeam,
    onGameEnd
  });

  const [currentWord, setCurrentWord] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usedWords, setUsedWords] = useState([]);

  const getNewWord = () => {
    const teamData = getTeamData(selectedTeam).whisper;
    const availableWords = teamData.filter(word => !usedWords.includes(word));

    if (availableWords.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const newWord = availableWords[randomIndex];
    setUsedWords(prev => [...prev, newWord]);
    return newWord;
  };

  const handleGameStart = () => {
    startGame();
    const newWord = getNewWord();
    setCurrentWord(newWord);
  };

  const handleWordAnswer = (correct) => {
    if (!currentWord) return;

    handleAnswer({ word: currentWord }, correct);
    const newWord = getNewWord();
    if (!newWord) {
      return true; // 게임 종료
    }
    setCurrentWord(newWord);
    return false;
  };

  return (
    <div className="game-container">
      <Button 
        className="help-button"
        onClick={() => setShowModal(true)}
      >
        ?
      </Button>

      <GameInfoModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        gameInfo={GAME_INFO.whisper}
      />

      {gameState === 'ready' && !gameMode && (
        <ModeSelection onSelectMode={handleModeSelect} />
      )}

      {gameState === 'ready' && gameMode && (
        <div className="game-settings">
          {gameMode === 'time' && (
            <TimeSettings 
              timeLimit={timeLimit}
              onTimeChange={handleTimeChange}
            />
          )}
          {gameMode === 'target' && (
            <div className="settings">
              <h3 className="settings-title">목표 점수 설정</h3>
              <div className="settings-controls">
                <Button 
                  variant="primary"
                  onClick={() => handleTargetScoreChange(-3)}
                  disabled={targetScore <= 3}
                >
                  -3점
                </Button>
                <div className="settings-value">{targetScore}점</div>
                <Button 
                  variant="primary"
                  onClick={() => handleTargetScoreChange(3)}
                  disabled={targetScore >= 15}
                >
                  +3점
                </Button>
              </div>
            </div>
          )}
          <Button
            variant="primary"
            size="large"
            onClick={handleGameStart}
            className="start-button"
          >
            게임 시작
          </Button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-play">
          <GameProgress 
            mode={gameMode}
            score={score}
            timer={timer}
            targetScore={targetScore}
            elapsedTime={elapsedTime}
          />

          {showScore && <ScoreDisplay showAnimation />}

          <div className="word-display">
            {currentWord}
          </div>

          <div className="game-controls">
            <Button
              className="answer-button correct"
              onClick={() => handleWordAnswer(true)}
            >
              정답
            </Button>
            <Button
              className="answer-button wrong"
              onClick={() => handleWordAnswer(false)}
            >
              오답
            </Button>
          </div>

          <AnswerList answers={answers} />
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-end">
          <h2 className="game-end-title">게임 종료!</h2>
          {gameMode === 'time' ? (
            <p className="game-end-score">최종 점수: {score}점</p>
          ) : (
            <p className="game-end-time">
              달성 시간: {Math.floor(elapsedTime / 60)}분 {elapsedTime % 60}초
            </p>
          )}
          <Button
            variant="primary"
            onClick={() => {
              setUsedWords([]);
              startGame();
            }}
          >
            다시 하기
          </Button>
        </div>
      )}
    </div>
  );
}

export default WhisperGame;