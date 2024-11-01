import React, { useState, useEffect, useCallback } from 'react';  // useCallback 추가
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

function CharadesGame({ selectedTeam, onGameEnd }) {
  const {
    gameState,
    gameMode,
    setGameMode,
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
    startGame: initGame,
    handleAnswer,
    handleGameEnd
  } = useGameLogic({
    gameType: 'charades',
    selectedTeam,
    onGameEnd
  });

  const [currentWord, setCurrentWord] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usedWords, setUsedWords] = useState([]);

  // getNewWord를 useCallback으로 감싸서 메모이제이션
  const getNewWord = useCallback(() => {
    try {
      const teamData = getTeamData(selectedTeam)?.charades;
      if (!teamData) return;

      const availableWords = teamData.filter(
        word => !usedWords.includes(word)
      );

      if (availableWords.length === 0) {
        if (gameState === 'playing') {
          setTimeout(() => handleGameEnd(score), 0);
        }
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const newWord = availableWords[randomIndex];
      setCurrentWord(newWord);
      setUsedWords(prev => [...prev, newWord]);
    } catch (error) {
      console.error('새 단어 가져오기 실패:', error);
    }
  }, [selectedTeam, usedWords, gameState, score, handleGameEnd]);

  // 게임 시작 시 첫 단어 설정
  useEffect(() => {
    if (gameState === 'playing' && !currentWord) {
      getNewWord();
    }
  }, [gameState, currentWord, getNewWord]);

  const startGame = () => {
    setUsedWords([]);
    setCurrentWord('');
    initGame();
  };

  const handleWordAnswer = (correct) => {
    if (!currentWord) return;
    handleAnswer({ word: currentWord, correct }, correct);
    getNewWord();
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
        gameInfo={GAME_INFO.charades}
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
            <div className="target-settings">
              <h3>목표 점수 설정</h3>
              <div className="target-controls">
                <Button 
                  variant="primary"
                  onClick={() => handleTargetScoreChange(-3)}
                  disabled={targetScore <= 3}
                >
                  -3점
                </Button>
                <div className="target-value">{targetScore}점</div>
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
            onClick={startGame}
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
          {gameMode === 'target' ? (
            <p className="game-end-time">
              달성 시간: {Math.floor(elapsedTime / 60)}분 {elapsedTime % 60}초
            </p>
          ) : (
            <p className="game-end-score">
              최종 점수: {score}점
            </p>
          )}
          <Button
            variant="primary"
            onClick={() => {
              setGameMode(null);
              setUsedWords([]);
            }}
          >
            다시 하기
          </Button>
        </div>
      )}
    </div>
  );
}

export default CharadesGame;