import React, { useEffect } from "react";
import type { Player, Role, GameRecord } from "../types/game";
import { saveGameRecord } from "../utils/gameStats";

interface GameResultProps {
  winner: Role | null;
  players: Player[];
  eliminatedPlayers: Player[];
  civilianWord: string;
  undercoverWord: string;
  mrWhiteWinType: "guess" | "survival" | null;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  winner,
  players,
  eliminatedPlayers,
  civilianWord,
  undercoverWord,
  mrWhiteWinType,
  onPlayAgain,
  onNewGame,
}) => {
  // Save game record when component mounts
  useEffect(() => {
    const gameRecord: GameRecord = {
      id: Date.now().toString(),
      date: new Date(),
      players,
      winner,
      rounds: eliminatedPlayers.length,
      civilianWord,
      undercoverWord,
    };

    saveGameRecord(gameRecord);
  }, [players, winner, eliminatedPlayers.length, civilianWord, undercoverWord]);
  const getWinnerMessage = () => {
    switch (winner) {
      case "civilian":
        return {
          title: "👥 Civilians Win!",
          message: "All undercovers and Mr. White have been eliminated!",
          emoji: "🎉",
        };
      case "undercover":
        return {
          title: "🕵️ Undercovers Win!",
          message:
            "Undercovers successfully eliminated civilians while Mr. White was out!",
          emoji: "🎭",
        };
      case "mr-white":
        return {
          title: "⚪ Mr. White Wins!",
          message:
            mrWhiteWinType === "guess"
              ? "Mr. White successfully guessed the civilian word!"
              : "Mr. White survived until the final two players!",
          emoji: "🎯",
        };
      default:
        return {
          title: "🎮 Game Over",
          message: "Game completed!",
          emoji: "🏁",
        };
    }
  };

  const getPlayersByRole = (role: Role) => {
    return players.filter((p) => p.role === role);
  };

  const winnerInfo = getWinnerMessage();

  return (
    <div className="game-result">
      <div className="mission-complete">
        <h1>{winnerInfo.emoji}</h1>
        <h2>{winnerInfo.title}</h2>
        <p className="mission-message">{winnerInfo.message}</p>
      </div>

      <div className="mission-summary">
        <h3>📊 Mission Report</h3>

        <div className="words-revealed">
          <div className="word-item">
            <span className="word-label">Civilian Word:</span>
            <span className="word-value">{civilianWord}</span>
          </div>
          <div className="word-item">
            <span className="word-label">Undercover Word:</span>
            <span className="word-value">{undercoverWord}</span>
          </div>
        </div>

        <div className="players-breakdown">
          <div className="role-group">
            <h4>👥 Civilians</h4>
            {getPlayersByRole("civilian").map((player) => (
              <div
                key={player.id}
                className={`player-result ${
                  eliminatedPlayers.includes(player) ? "eliminated" : "survived"
                }`}
              >
                {player.name} {eliminatedPlayers.includes(player) ? "❌" : "✅"}
              </div>
            ))}
          </div>

          <div className="role-group">
            <h4>🕵️ Undercovers</h4>
            {getPlayersByRole("undercover").map((player) => (
              <div
                key={player.id}
                className={`player-result ${
                  eliminatedPlayers.includes(player) ? "eliminated" : "survived"
                }`}
              >
                {player.name} {eliminatedPlayers.includes(player) ? "❌" : "✅"}
              </div>
            ))}
          </div>

          {getPlayersByRole("mr-white").length > 0 && (
            <div className="role-group">
              <h4>⚪ Mr. White</h4>
              {getPlayersByRole("mr-white").map((player) => (
                <div
                  key={player.id}
                  className={`player-result ${
                    eliminatedPlayers.includes(player)
                      ? "eliminated"
                      : "survived"
                  }`}
                >
                  {player.name}{" "}
                  {eliminatedPlayers.includes(player) ? "❌" : "✅"}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="elimination-order">
          <h4>🗳️ Elimination Order</h4>
          {eliminatedPlayers.length > 0 ? (
            <ol>
              {eliminatedPlayers.map((player, index) => (
                <li key={player.id}>
                  {player.name} ({player.role}) - Round {index + 1}
                </li>
              ))}
            </ol>
          ) : (
            <p>No players were eliminated!</p>
          )}
        </div>
      </div>

      <div className="mission-actions">
        <button className="btn-primary btn-lg" onClick={onPlayAgain}>
          🔄 Play Again
        </button>
        <button className="btn-secondary btn-lg" onClick={onNewGame}>
          🆕 New Game
        </button>
      </div>

      <div className="game-rules-reminder">
        <h4>📋 Game Rules Reminder</h4>
        <ul>
          <li>
            👥 Civilians win if all undercovers and Mr. White are eliminated
          </li>
          <li>
            🕵️ Undercovers win if they eliminate civilians while Mr. White is
            already out
          </li>
          <li>
            ⚪ Mr. White wins by correctly guessing the civilian word when
            eliminated OR by surviving until only 2 players remain
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GameResult;
