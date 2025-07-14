import React from "react";
import type { PlayerStats } from "../types/game";
import { getLeaderboard, clearAllData } from "../utils/gameStats";

interface LeaderboardProps {
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const leaderboard = getLeaderboard();

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all game records and statistics? This action cannot be undone."
      )
    ) {
      clearAllData();
      window.location.reload();
    }
  };

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}.`;
    }
  };

  const getWinRate = (stats: PlayerStats) => {
    return stats.gamesPlayed > 0
      ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)
      : "0.0";
  };

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h2>🏆 Agent Rankings</h2>
          <button className="btn-ghost btn-sm" onClick={onClose}>
            ✕ Close
          </button>
        </div>

        <div className="leaderboard-content">
          {leaderboard.length === 0 ? (
            <div className="empty-leaderboard">
              <p>🎮 No games played yet!</p>
              <p>Start playing to see statistics here.</p>
            </div>
          ) : (
            <>
              <div className="point-system">
                <h4>🎯 Point System</h4>
                <div className="point-rules">
                  <span>👑 Mr. White Win: 7 pts</span>
                  <span>🕵️ Undercover Win: 5 pts</span>
                  <span>👥 Civilian Win: 3 pts</span>
                  <span>🎲 Participation: 1 pt</span>
                </div>
              </div>

              <div className="leaderboard-table">
                <div className="table-header">
                  <div className="rank-col">Rank</div>
                  <div className="name-col">Player</div>
                  <div className="points-col">Points</div>
                  <div className="games-col">Games</div>
                  <div className="wins-col">Wins</div>
                  <div className="rate-col">Win %</div>
                </div>

                {leaderboard.map((player, index) => (
                  <div
                    key={player.name}
                    className={`table-row ${index < 3 ? "top-player" : ""}`}
                  >
                    <div className="rank-col">
                      <span className="rank">{getRankEmoji(index)}</span>
                    </div>
                    <div className="name-col">
                      <span className="player-name">{player.name}</span>
                      <div className="role-wins">
                        {player.winsAsCivilian > 0 && (
                          <span className="role-badge civilian">
                            👥 {player.winsAsCivilian}
                          </span>
                        )}
                        {player.winsAsUndercover > 0 && (
                          <span className="role-badge undercover">
                            🕵️ {player.winsAsUndercover}
                          </span>
                        )}
                        {player.winsAsMrWhite > 0 && (
                          <span className="role-badge mr-white">
                            👑 {player.winsAsMrWhite}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="points-col">
                      <span className="points">{player.totalPoints}</span>
                    </div>
                    <div className="games-col">{player.gamesPlayed}</div>
                    <div className="wins-col">{player.wins}</div>
                    <div className="rate-col">{getWinRate(player)}%</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="leaderboard-actions">
          <button className="clear-data-btn" onClick={handleClearData}>
            🗑️ Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
