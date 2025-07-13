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
    return currentPlayer.word || "";
  };

  const getRoleDescription = () => {
    switch (currentPlayer.role) {
      case "civilian":
        return "Civilian";
      case "undercover":
        return "Undercover";
      case "mr-white":
        return "Mr. White";
      default:
        return "";
    }
  };

  return (
    <div className="word-distribution">
      <h2>Intelligence Brief</h2>
      <div className="player-turn-indicator">
        Agent {currentPlayer.name}'s Turn ({currentPlayerIndex + 1}/
        {players.length})
      </div>

      <div className="intelligence-dossier">
        {!isWordVisible ? (
          <>
            <div className="dossier-header">
              <h3>Top Secret Dossier</h3>
            </div>
            <div className="dossier-content">
              <div className="classified-warning">
                <p>For Agent {currentPlayer.name}'s eyes only.</p>
              </div>
              <button className="access-button" onClick={showWord}>
                Access Intelligence
              </button>
            </div>
          </>
        ) : (
          <div className="intel-revealed">
            <div className="role-display">{getRoleDescription()}</div>

            {currentPlayer.role === "mr-white" ? (
              <div className="secret-word-container">
                <p className="mr-white-instructions">
                  You have no word. Your mission is to blend in, deduce the
                  Civilians' word, and survive.
                </p>
              </div>
            ) : (
              <div className="secret-word-container">
                <h3>Your Secret Word Is:</h3>
                <div className="secret-word">{getWordToShow()}</div>
              </div>
            )}

            <div className="next-agent-container">
              <button onClick={nextPlayer} className="next-agent-btn">
                {currentPlayerIndex < players.length - 1
                  ? "Pass to Next Agent"
                  : "Proceed to Elimination"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentPlayerIndex + 1) / players.length) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default WordDistribution;
