import React from 'react';
import { TEAM_COLORS } from '../../data/gameData';
import '../../styles/styles.css';

function TeamSelection({ selectedTeam, onTeamSelect, disabled }) {
  return (
    <div className="team-selection">
      <div className="team-buttons">
        <button 
          className={`team-button ${selectedTeam === 'sprout' ? 'selected' : ''}`}
          onClick={() => !disabled && onTeamSelect('sprout')}
          disabled={disabled}
          style={{
            backgroundColor: selectedTeam === 'sprout' ? 
              TEAM_COLORS.sproutDark : TEAM_COLORS.sprout,
            borderColor: selectedTeam === 'sprout' ? '#333' : 'transparent'
          }}
        >
          새싹 팀 🌱
        </button>
        <button 
          className={`team-button ${selectedTeam === 'mushroom' ? 'selected' : ''}`}
          onClick={() => !disabled && onTeamSelect('mushroom')}
          disabled={disabled}
          style={{
            backgroundColor: selectedTeam === 'mushroom' ? 
              TEAM_COLORS.mushroomDark : TEAM_COLORS.mushroom,
            borderColor: selectedTeam === 'mushroom' ? '#333' : 'transparent'
          }}
        >
          버섯 팀 🍄
        </button>
      </div>
    </div>
  );
}

export default TeamSelection;