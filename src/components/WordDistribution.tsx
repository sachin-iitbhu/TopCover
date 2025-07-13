import React, { useState } from "react";
import type { Player } from "../types/game";

interface WordDistributionProps {
  players: Player[];
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  civilianWord: string;
  undercoverWord: string;
  onFinishDistribution: () => void;
}

const WordDistribution: React.FC<WordDistributionProps> = ({
  players,
  currentPlayerIndex,
  setCurrentPlayerIndex,
  onFinishDistribution,
}) => {
  const [isWordVisible, setIsWordVisible] = useState(false);
  const currentPlayer = players[currentPlayerIndex];

  const showWord = () => {
    setIsWordVisible(true);
  };

  const nextPlayer = () => {
    setIsWordVisible(false);
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      onFinishDistribution();
    }
  };

  const getWordToShow = () => {
    if (currentPlayer.role === "mr-white") {
      return "You are Mr. White - You have no word!";
    }
    return currentPlayer.word || "";
  };

  const getRoleDescription = () => {
    switch (currentPlayer.role) {
      case "civilian":
        return "👥 You are a Civilian";
      case "undercover":
        return "🕵️ You are an Undercover";
      case "mr-white":
        return "⚪ You are Mr. White";
      default:
        return "";
    }
  };

  return (
    <div className="word-distribution">
      <h2>� Intelligence Brief</h2>

      <div className="agent-progress">
        Agent {currentPlayerIndex + 1} of {players.length}
      </div>

      <div className="current-agent-card">
        <h3>👋 Agent {currentPlayer.name}</h3>
        <p className="instruction">
          Secure the device for <strong>Agent {currentPlayer.name}</strong>
        </p>

        {!isWordVisible ? (
          <div className="intelligence-reveal">
            <p className="security-warning">
              🔒 Classified: Only <strong>Agent {currentPlayer.name}</strong>{" "}
              should view this intel!
            </p>
            <button className="btn-primary btn-lg" onClick={showWord}>
              👁️ Access Intelligence
            </button>
          </div>
        ) : (
          <div className="word-display">
            <div className="role-badge">{getRoleDescription()}</div>

            <div className="word-card">
              {currentPlayer.role === "mr-white" ? (
                <div className="mr-white-message">
                  <h3>🎭 You are Mr. White!</h3>
                  <p>
                    You don't have a word. Listen carefully to others and try to
                    blend in!
                  </p>
                </div>
              ) : (
                <div className="word-content">
                  <h3>Your word is:</h3>
                  <div className="word">{getWordToShow()}</div>
                </div>
              )}
            </div>

            <div className="mission-instructions">
              <p>
                📚 <strong>Memorize your assignment!</strong>
              </p>
              <p>🤫 Maintain operational security</p>
            </div>

            <button className="btn-primary btn-lg" onClick={nextPlayer}>
              {currentPlayerIndex < players.length - 1
                ? "➡️ Next Player"
                : "🎯 Begin Discussion"}
            </button>
          </div>
        )}
      </div>

      <div className="mission-progress">
        <div
          className="progress-fill"
          style={{
            width: `${((currentPlayerIndex + 1) / players.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default WordDistribution;
