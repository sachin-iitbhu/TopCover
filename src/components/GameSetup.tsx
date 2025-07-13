import React, { useState, useEffect, useCallback } from "react";
import type { Player, Role } from "../types/game";
import {
  getRandomWordPair,
  getRandomWordPairFromCategory,
  getAllCategories,
  type WordPair,
} from "../utils/wordPairs";

interface GameSetupProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  numUndercovers: number;
  setNumUndercovers: (num: number) => void;
  numMrWhite: number;
  setNumMrWhite: (num: number) => void;
  civilianWord: string;
  setCivilianWord: (word: string) => void;
  undercoverWord: string;
  setUndercoverWord: (word: string) => void;
  onStartGame: () => void;
}

const GameSetup: React.FC<GameSetupProps> = ({
  players,
  setPlayers,
  numUndercovers,
  setNumUndercovers,
  numMrWhite,
  setNumMrWhite,
  civilianWord,
  setCivilianWord,
  undercoverWord,
  setUndercoverWord,
  onStartGame,
}) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Random");
  const [isManualWords, setIsManualWords] = useState(false);
  const [currentWordPair, setCurrentWordPair] = useState<WordPair | null>(null);
  const [areWordsRevealed, setAreWordsRevealed] = useState(false);

  const categories = ["Random", ...getAllCategories()];

  // Generate initial word pair
  const generateNewWordPair = useCallback(() => {
    const wordPair =
      selectedCategory === "Random"
        ? getRandomWordPair()
        : getRandomWordPairFromCategory(selectedCategory);

    if (wordPair) {
      setCurrentWordPair(wordPair);
      if (!isManualWords) {
        setCivilianWord(wordPair.civilian);
        setUndercoverWord(wordPair.undercover);
      }
    }
  }, [selectedCategory, isManualWords, setCivilianWord, setUndercoverWord]);

  useEffect(() => {
    generateNewWordPair();
  }, [generateNewWordPair]);

  const handleGenerateWords = () => {
    generateNewWordPair();
    setAreWordsRevealed(false); // Hide words when generating new ones
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setAreWordsRevealed(false); // Hide words when changing category
  };

  const handleManualToggle = () => {
    setIsManualWords(!isManualWords);
    setAreWordsRevealed(false); // Hide words when switching modes
    if (!isManualWords && currentWordPair) {
      // Switching to manual mode, clear the auto-generated words
      setCivilianWord("");
      setUndercoverWord("");
    } else if (isManualWords && currentWordPair) {
      // Switching to auto mode, use current word pair
      setCivilianWord(currentWordPair.civilian);
      setUndercoverWord(currentWordPair.undercover);
    }
  };

  const handleRevealWords = () => {
    setAreWordsRevealed(true);
  };

  const addPlayer = () => {
    if (
      newPlayerName.trim() &&
      !players.find((p) => p.name === newPlayerName.trim())
    ) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        role: "civilian", // Will be assigned randomly later
        isEliminated: false,
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const assignRoles = () => {
    if (players.length < numUndercovers + numMrWhite + 1) {
      alert("Not enough players for the selected configuration!");
      return;
    }

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const updatedPlayers = shuffled.map((player, index) => {
      let role: Role = "civilian";
      let word = civilianWord;

      if (index < numUndercovers) {
        role = "undercover";
        word = undercoverWord;
      } else if (index < numUndercovers + numMrWhite) {
        role = "mr-white";
        word = "";
      }

      return { ...player, role, word };
    });

    setPlayers(updatedPlayers);
    onStartGame();
  };

  const canStartGame =
    players.length >= 3 &&
    civilianWord.trim() &&
    undercoverWord.trim() &&
    players.length >= numUndercovers + numMrWhite + 1 &&
    (!isManualWords ? currentWordPair !== null : true);

  return (
    <div className="game-setup">
      <h2 className="component-title">🎮 Mission Setup</h2>

      <div className="setup-section">
        <h3 className="section-title">🕵️ Agent Registration</h3>
        <div className="add-player">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter agent codename..."
            onKeyPress={(e) => e.key === "Enter" && addPlayer()}
            className="agent-input"
          />
          <button
            className="btn-primary"
            onClick={addPlayer}
            disabled={!newPlayerName.trim()}
          >
            + Add Player
          </button>
        </div>

        <div className="players-list">
          {players.map((player) => (
            <div key={player.id} className="player-item">
              <span>{player.name}</span>
              <button
                onClick={() => removePlayer(player.id)}
                className="remove-btn"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <p className="player-count">Players: {players.length}</p>
      </div>

      <div className="setup-section">
        <h3>Game Configuration</h3>
        <div className="config-item">
          <label>Number of Undercovers:</label>
          <select
            value={numUndercovers}
            onChange={(e) => setNumUndercovers(Number(e.target.value))}
          >
            {[1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="config-item">
          <label>Number of Mr. White:</label>
          <select
            value={numMrWhite}
            onChange={(e) => setNumMrWhite(Number(e.target.value))}
          >
            {[0, 1].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="setup-section">
        <h3>Game Words</h3>
        <div className="word-mode-toggle">
          <label className="toggle-container">
            <input
              type="checkbox"
              checked={isManualWords}
              onChange={handleManualToggle}
            />
            <span className="toggle-text">
              {isManualWords
                ? "✏️ Manual Word Entry"
                : "🎲 Auto Generate Words"}
            </span>
          </label>
        </div>
        {!isManualWords && (
          <div className="auto-words-section">
            <div className="config-item">
              <label>Word Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="current-word-pair">
              {currentWordPair && (
                <div className="word-pair-display">
                  <div className="word-category">
                    <span className="category-label">
                      Category:{" "}
                      {selectedCategory === "Random"
                        ? "Random"
                        : currentWordPair.category}
                    </span>
                  </div>

                  {!areWordsRevealed ? (
                    <div className="words-hidden">
                      <div className="reveal-message">
                        <h4>� Words Generated!</h4>
                        <p>
                          Click below to reveal the words. Make sure only the
                          game master can see them!
                        </p>
                      </div>
                      <button
                        onClick={handleRevealWords}
                        className="reveal-words-btn"
                        type="button"
                      >
                        👁️ Reveal Words
                      </button>
                    </div>
                  ) : (
                    <div className="word-preview">
                      <div className="word-item">
                        <span className="word-label">� Civilian Word:</span>
                        <span className="word-value">
                          {currentWordPair.civilian}
                        </span>
                      </div>
                      <div className="word-item">
                        <span className="word-label">🕵️ Undercover Word:</span>
                        <span className="word-value">
                          {currentWordPair.undercover}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateWords}
                    className="generate-btn"
                    type="button"
                  >
                    🎲 Generate New Words
                  </button>
                </div>
              )}
            </div>
          </div>
        )}{" "}
        {isManualWords && (
          <div className="manual-words-section">
            <div className="security-warning">
              <p>
                ⚠️ <strong>Game Master Only:</strong> Make sure players can't
                see these words!
              </p>
            </div>
            <div className="config-item">
              <label>Civilian Word:</label>
              <input
                type="text"
                value={civilianWord}
                onChange={(e) => setCivilianWord(e.target.value)}
                placeholder="e.g., Apple"
              />
            </div>

            <div className="config-item">
              <label>Undercover Word:</label>
              <input
                type="text"
                value={undercoverWord}
                onChange={(e) => setUndercoverWord(e.target.value)}
                placeholder="e.g., Orange"
              />
            </div>
          </div>
        )}
      </div>

      <button
        className="btn-primary btn-lg start-game-btn"
        onClick={assignRoles}
        disabled={!canStartGame}
      >
        🚀 Begin Mission
      </button>

      {!canStartGame && (
        <p className="warning">
          {players.length < 3
            ? "Need at least 3 players to start!"
            : players.length < numUndercovers + numMrWhite + 1
            ? "Not enough players for the selected configuration!"
            : !isManualWords && !currentWordPair
            ? "Generate words first!"
            : !civilianWord.trim() || !undercoverWord.trim()
            ? "Both civilian and undercover words are required!"
            : "Check all requirements to start!"}
        </p>
      )}
    </div>
  );
};

export default GameSetup;
