import { useState, useEffect, useRef, useCallback } from 'react';
import { playSound, stopAllSounds } from '../utils/soundUtils';
import { gameSettings } from '../config/gameConfig';

export function useGameLogic({ gameType, selectedTeam, onGameEnd }) {
  const [gameState, setGameState] = useState('ready');
  const [gameMode, setGameMode] = useState(null);
  const [timeLimit, setTimeLimit] = useState(gameSettings[gameType]?.timeLimit || 120);
  const [targetScore, setTargetScore] = useState(gameSettings[gameType]?.targetScore || 9);
  const [timer, setTimer] = useState(timeLimit);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answers, setAnswers] = useState([]);

  const elapsedTimeInterval = useRef(null);
  const answersListRef = useRef(null);

  const handleGameEnd = useCallback((finalScore) => {
    if (gameState !== 'finished') {
      setGameState('finished');
      if (gameMode === 'time') {
        playSound('timeUp');
      }
      if (elapsedTimeInterval.current) {
        clearInterval(elapsedTimeInterval.current);
      }
      onGameEnd(finalScore);
    }
  }, [gameState, gameMode, onGameEnd]);

  useEffect(() => {
    return () => {
      stopAllSounds();
      if (elapsedTimeInterval.current) {
        clearInterval(elapsedTimeInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && gameMode === 'time' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            handleGameEnd(score);
            return 0;
          }
          if (prev <= 10) {
            playSound('tick');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, gameMode, timer, score, handleGameEnd]);

  const startElapsedTimeCounter = () => {
    setElapsedTime(0);
    elapsedTimeInterval.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    if (mode === 'target') {
      setTimeLimit(null);
    }
  };

  const handleTimeChange = (newTime) => {
    setTimeLimit(newTime);
    setTimer(newTime);
  };

  const handleTargetScoreChange = (change) => {
    setTargetScore(prev => {
      const newScore = prev + change;
      return Math.min(Math.max(newScore, 3), 15); // 최소 3점, 최대 15점
    });
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setAnswers([]);
    
    if (gameMode === 'time') {
      setTimer(timeLimit);
    } else {
      startElapsedTimeCounter();
    }
    playSound('gameStart');
  };

  const handleAnswer = (answerItem, correct) => {
    if (correct) {
      playSound('correct');
      const newScore = score + 1;
      setScore(newScore);
      setShowScore(true);
      setTimeout(() => setShowScore(false), 500);

      if (gameMode === 'target' && newScore >= targetScore) {
        handleGameEnd(newScore);
        return true;
      }
    } else {
      playSound('wrong');
    }

    setAnswers(prev => [...prev, { ...answerItem, correct }]);
    return false;
  };

  return {
    gameState,
    setGameState,
    gameMode,
    setGameMode,
    timeLimit,
    timer,
    elapsedTime,
    score,
    targetScore,
    showScore,
    answers,
    answersListRef,
    handleModeSelect,
    handleTimeChange,
    handleTargetScoreChange,
    startGame,
    handleAnswer,
    handleGameEnd
};
}