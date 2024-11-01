import React, { useState, useEffect } from 'react';
import TeamSelection from './components/game-controls/TeamSelection';
import WordChainGame from './components/games/WordChainGame';
import MusicQuizGame from './components/games/MusicQuizGame';
import WhisperGame from './components/games/WhisperGame';
import CharadesGame from './components/games/CharadesGame';
import { TEAM_COLORS } from './data/gameData';
import './styles/common.css';
import './styles/game.css';

function App() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : {
      wordchain: { score: 0, team: '' },
      music: { score: 0, team: '' },
      whisper: { score: 0, team: '' },
      charades: { score: 0, team: '' }
    };
  });

  const [gameHistory, setGameHistory] = useState(() => {
    const saved = localStorage.getItem('gameHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }, [highScores]);

  useEffect(() => {
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
  }, [gameHistory]);

  const games = [
    { id: 'wordchain', title: '이어말하기', component: WordChainGame },
    { id: 'music', title: '음악 퀴즈', component: MusicQuizGame },
    { id: 'whisper', title: '고요 속의 외침', component: WhisperGame },
    { id: 'charades', title: '몸으로 말해요', component: CharadesGame }
  ];

  const handleGameEnd = (gameId, finalScore) => {
    // 게임 기록 추가
    const newRecord = {
      gameId,
      gameName: games.find(g => g.id === gameId).title,
      team: selectedTeam,
      score: finalScore,
      timestamp: new Date().toLocaleString()
    };
    setGameHistory(prev => [newRecord, ...prev].slice(0, 10));

    // 최고 점수 업데이트
    if (finalScore > (highScores[gameId]?.score || 0)) {
      setHighScores(prev => ({
        ...prev,
        [gameId]: {
          score: finalScore,
          team: selectedTeam
        }
      }));
    }
  };

  const handleTeamSelect = (team) => {
    if (selectedGame) return;
    setSelectedTeam(team);
  };

  const getTeamColor = (team, isBackground = false) => {
    if (!team) return '#fff';
    return team === 'sprout' ? 
      (isBackground ? TEAM_COLORS.sproutDark : TEAM_COLORS.sprout) : 
      (isBackground ? TEAM_COLORS.mushroomDark : TEAM_COLORS.mushroom);
  };

  return (
    <div className="app">
      <h1 className="header">심야게임파티</h1>

      {!selectedTeam && (
        <div className="team-selection-notice">
          게임을 시작하기 전에 팀을 선택해주세요! 👇
        </div>
      )}

      {!selectedGame && (
        <div className="games-container">
          {games.map(game => (
            <div
              key={game.id}
              className="game-card"
              style={{
                backgroundColor: getTeamColor(highScores[game.id]?.team),
                cursor: selectedTeam ? 'pointer' : 'not-allowed',
                opacity: selectedTeam ? 1 : 0.7
              }}
              onClick={() => {
                if (!selectedTeam) {
                  alert('게임을 시작하기 전에 팀을 선택해주세요!');
                  return;
                }
                setSelectedGame(game.id);
              }}
            >
              <h2>{game.title}</h2>
              <p className="high-score">
                최고 점수: {highScores[game.id].score}
                {highScores[game.id].team && 
                  ` (${highScores[game.id].team === 'sprout' ? '새싹팀' : '버섯팀'})`}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedGame && (
        <div className="game-content">
          <div className="game-header">
            <button
              className="back-button"
              onClick={() => setSelectedGame('')}
            >
              게임 선택으로 돌아가기
            </button>
            <div 
              className="current-team"
              style={{
                backgroundColor: getTeamColor(selectedTeam)
              }}
            >
              진행 중인 팀: {selectedTeam === 'sprout' ? '새싹팀 🌱' : '버섯팀 🍄'}
            </div>
          </div>

          {React.createElement(games.find(game => game.id === selectedGame).component, {
            selectedTeam,
            onGameEnd: (score) => handleGameEnd(selectedGame, score)
          })}
        </div>
      )}

      {gameHistory.length > 0 && !selectedGame && (
        <div className="game-history">
          <h2>최근 게임 기록</h2>
          <div className="history-grid">
            <div className="history-header">시간</div>
            <div className="history-header">게임</div>
            <div className="history-header">팀</div>
            <div className="history-header">점수</div>
            {gameHistory.map((record, index) => (
              <div key={index} className="history-row">
                <div className="history-cell">
                  {record.timestamp}
                </div>
                <div className="history-cell">
                  {record.gameName}
                </div>
                <div 
                  className="history-cell"
                  style={{
                    backgroundColor: getTeamColor(record.team, true),
                    color: getTeamColor(record.team)
                  }}
                >
                  {record.team === 'sprout' ? '새싹팀' : '버섯팀'}
                </div>
                <div className="history-cell">
                  {record.score}점
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <TeamSelection 
        selectedTeam={selectedTeam}
        onTeamSelect={handleTeamSelect}
        disabled={selectedGame !== ''}
      />
    </div>
  );
}

export default App;