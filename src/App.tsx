import { useState } from "react";
import "./App.css";
import GameSetup from "./components/GameSetup";
import WordDistribution from "./components/WordDistribution";
import DiscussionRound from "./components/DiscussionRound";
import EliminationRound from "./components/EliminationRound";
import GameResult from "./components/GameResult";
import Leaderboard from "./components/Leaderboard";
import type { GameState, Player, Role } from "./types/game";

function App() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [numUndercovers, setNumUndercovers] = useState(1);
  const [numMrWhite, setNumMrWhite] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [civilianWord, setCivilianWord] = useState("");
  const [undercoverWord, setUndercoverWord] = useState("");
  const [eliminatedPlayers, setEliminatedPlayers] = useState<Player[]>([]);
  const [winner, setWinner] = useState<Role | null>(null);
  const [mrWhiteGuess, setMrWhiteGuess] = useState("");
  const [mrWhiteWinType, setMrWhiteWinType] = useState<
    "guess" | "survival" | null
  >(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const resetGame = () => {
    setGameState("setup");
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setCivilianWord("");
    setUndercoverWord("");
    setEliminatedPlayers([]);
    setWinner(null);
    setMrWhiteGuess("");
    setMrWhiteWinType(null);
  };

  const playAgainWithSamePlayers = () => {
    // Keep the same players but reset their roles and elimination status
    const resetPlayers = players.map((player) => ({
      ...player,
      role: "civilian" as Role,
      word: "",
      isEliminated: false,
    }));
    setPlayers(resetPlayers);
    setGameState("setup");
    setCurrentPlayerIndex(0);
    setCivilianWord("");
    setUndercoverWord("");
    setEliminatedPlayers([]);
    setWinner(null);
    setMrWhiteGuess("");
    setMrWhiteWinType(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 TopCover</h1>
        <p>Social Deduction Game</p>
        <button
          onClick={() => setShowLeaderboard(true)}
          className="leaderboard-btn"
          type="button"
        >
          🏆 Leaderboard
        </button>
      </header>

      <main className="game-container">
        {gameState === "setup" && (
          <GameSetup
            players={players}
            setPlayers={setPlayers}
            numUndercovers={numUndercovers}
            setNumUndercovers={setNumUndercovers}
            numMrWhite={numMrWhite}
            setNumMrWhite={setNumMrWhite}
            civilianWord={civilianWord}
            setCivilianWord={setCivilianWord}
            undercoverWord={undercoverWord}
            setUndercoverWord={setUndercoverWord}
            onStartGame={() => setGameState("word-distribution")}
          />
        )}

        {gameState === "word-distribution" && (
          <WordDistribution
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            setCurrentPlayerIndex={setCurrentPlayerIndex}
            civilianWord={civilianWord}
            undercoverWord={undercoverWord}
            onFinishDistribution={() => setGameState("discussion")}
          />
        )}

        {gameState === "discussion" && (
          <DiscussionRound
            players={players}
            onDiscussionComplete={() => setGameState("elimination")}
            onSkipDiscussion={() => setGameState("elimination")}
          />
        )}

        {gameState === "elimination" && (
          <EliminationRound
            players={players.filter((p) => !eliminatedPlayers.includes(p))}
            eliminatedPlayers={eliminatedPlayers}
            setEliminatedPlayers={setEliminatedPlayers}
            setWinner={setWinner}
            setGameState={setGameState}
            civilianWord={civilianWord}
            mrWhiteGuess={mrWhiteGuess}
            setMrWhiteGuess={setMrWhiteGuess}
            setMrWhiteWinType={setMrWhiteWinType}
          />
        )}

        {gameState === "result" && (
          <GameResult
            winner={winner}
            players={players}
            eliminatedPlayers={eliminatedPlayers}
            civilianWord={civilianWord}
            undercoverWord={undercoverWord}
            mrWhiteWinType={mrWhiteWinType}
            onPlayAgain={playAgainWithSamePlayers}
            onNewGame={resetGame}
          />
        )}
      </main>

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}

export default App;
