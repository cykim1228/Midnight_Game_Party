import React, { useState, useRef } from 'react';
import { getTeamData } from '../../data/gameData';
import { GAME_INFO } from '../../data/gameInfo';
import GameInfoModal from '../game-controls/GameInfoModal';
import GameProgress from '../game-controls/GameProgress';
import ModeSelection from '../game-controls/ModeSelection';
import Button from '../common/Button';
import ScoreDisplay from '../common/ScoreDisplay';
import AnswerList from '../common/AnswerList';
import { useGameLogic } from '../../hooks/useGameLogic';
import { gameSettings } from '../../config/gameConfig';

function MusicQuizGame({ selectedTeam, onGameEnd }) {
  const {
    gameState,
    gameMode,
    setGameMode,
    score,
    targetScore,
    elapsedTime,
    showScore,
    answers,
    handleModeSelect,
    handleTargetScoreChange,
    startGame: initGame,
    handleAnswer,
    handleGameEnd
  } = useGameLogic({
    gameType: 'music',
    selectedTeam,
    onGameEnd
  });

  const [year, setYear] = useState('');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const audioRef = useRef(null);

  const getSongPath = (year, songTitle) => {
    // 파일 이름에서 특수문자 제거하고 소문자로 변환
    const fileName = songTitle
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/\s+/g, '_');
      // 연도에서 '년' 제거
      const yearFolder = year.replace('년', '');
      return `/assets/music/${yearFolder}/${fileName}.mp3`;
  };

  const handleYearSelect = (selectedYear) => {
    try {
      const musicData = getTeamData(selectedTeam);
      if (!musicData?.music?.[selectedYear]) {
        console.error('음악 데이터를 찾을 수 없습니다:', selectedYear);
        alert('해당 연도의 음악 데이터가 없습니다.');
        return;
      }

      const yearData = musicData.music[selectedYear];
      if (yearData.length === 0) {
        alert('선택한 연도의 음악이 없습니다.');
        return;
      }

      setYear(selectedYear);
      setCurrentSongIndex(0);
      initGame();
    } catch (error) {
      console.error('연도 선택 중 에러 발생:', error);
      alert('데이터를 불러오는데 문제가 발생했습니다.');
    }
  };

  const handleSongAnswer = (correct) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const songData = getTeamData(selectedTeam).music[year][currentSongIndex];
    const isLastSong = currentSongIndex + 1 >= getTeamData(selectedTeam).music[year].length;

    handleAnswer({ 
      song: songData,
      correct 
    }, correct);

    if (isLastSong) {
      handleGameEnd(score + (correct ? 1 : 0));
    } else {
      setCurrentSongIndex(prev => prev + 1);
    }
  };

  const getCurrentSong = () => {
    if (!year || !getTeamData(selectedTeam)?.music?.[year]) return null;
    return getTeamData(selectedTeam).music[year][currentSongIndex];
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
        gameInfo={GAME_INFO.music}
      />

      {gameState === 'ready' && !gameMode && (
        <ModeSelection onSelectMode={handleModeSelect} />
      )}

      {gameState === 'ready' && gameMode && !year && (
        <div className="year-selection">
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
          <div className="year-buttons">
            {gameSettings.music.categories.map((yearOption) => (
              <Button
                key={yearOption}
                variant="primary"
                className="year-button"
                onClick={() => handleYearSelect(yearOption)}
              >
                {yearOption}
              </Button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-play">
          <GameProgress 
            mode={gameMode}
            score={score}
            targetScore={targetScore}
            elapsedTime={elapsedTime}
            currentQuestion={currentSongIndex + 1}
            totalQuestions={getTeamData(selectedTeam).music[year].length}
          />

          {showScore && <ScoreDisplay showAnimation />}

          <div className="song-info">
            <div className="song-title">{getCurrentSong()?.title}</div>
            <div className="song-artist">{getCurrentSong()?.artist}</div>
          </div>

          <div className="music-controls">
            <audio 
              ref={audioRef}
              src={getCurrentSong() ? getSongPath(year, getCurrentSong().title) : ''}
              onEnded={() => audioRef.current.currentTime = 0}
            />
            <Button
              variant="primary"
              onClick={() => audioRef.current?.play()}
            >
              ▶️ 재생
            </Button>
            <Button
              variant="danger"
              onClick={() => audioRef.current?.pause()}
            >
              ⏸️ 일시정지
            </Button>
          </div>

          <div className="game-controls">
            <Button
              className="answer-button correct"
              onClick={() => handleSongAnswer(true)}
            >
              정답
            </Button>
            <Button
              className="answer-button wrong"
              onClick={() => handleSongAnswer(false)}
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
              최종 점수: {score} / {getTeamData(selectedTeam).music[year].length}
            </p>
          )}
          <Button
            variant="primary"
            onClick={() => {
              setGameMode(null);
              setYear('');
            }}
          >
            다시 하기
          </Button>
        </div>
      )}
    </div>
  );
}

export default MusicQuizGame;