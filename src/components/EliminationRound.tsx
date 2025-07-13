import React, { useState, useEffect } from "react";
import type { Player, Role, GameState } from "../types/game";

interface EliminationRoundProps {
  players: Player[];
  eliminatedPlayers: Player[];
  setEliminatedPlayers: (players: Player[]) => void;
  setWinner: (winner: Role | null) => void;
  setGameState: (state: GameState) => void;
  civilianWord: string;
  mrWhiteGuess: string;
  setMrWhiteGuess: (guess: string) => void;
  setMrWhiteWinType: (winType: "guess" | "survival" | null) => void;
}

const EliminationRound: React.FC<EliminationRoundProps> = ({
  players,
  eliminatedPlayers,
  setEliminatedPlayers,
  setWinner,
  setGameState,
  civilianWord,
  mrWhiteGuess,
  setMrWhiteGuess,
  setMrWhiteWinType,
}) => {
  const alivePlayers = players.filter((p) => !eliminatedPlayers.includes(p));

  // Initialize votes state with proper default values
  const [votes, setVotes] = useState<{ [playerName: string]: number }>(() => {
    const initialVotes: { [playerName: string]: number } = {};
    alivePlayers.forEach((player) => {
      initialVotes[player.name] = 0;
    });
    return initialVotes;
  });

  const [showVotingResult, setShowVotingResult] = useState(false);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null);
  const [showMrWhiteGuess, setShowMrWhiteGuess] = useState(false);

  // Create a stable key for player names to avoid unnecessary re-renders
  const playerNamesKey = alivePlayers.map((p) => p.name).join(",");

  // Update votes when players change
  useEffect(() => {
    setVotes((prevVotes) => {
      const newVotes: { [playerName: string]: number } = {};
      alivePlayers.forEach((player) => {
        newVotes[player.name] = prevVotes[player.name] || 0;
      });
      return newVotes;
    });
  }, [playerNamesKey, alivePlayers]);

  const addVote = (playerName: string) => {
    setVotes((prev) => {
      const newVotes = {
        ...prev,
        [playerName]: (prev[playerName] || 0) + 1,
      };
      return newVotes;
    });
  };

  const removeVote = (playerName: string) => {
    setVotes((prev) => {
      const newVotes = {
        ...prev,
        [playerName]: Math.max(0, (prev[playerName] || 0) - 1),
      };
      return newVotes;
    });
  };

  const finishVoting = () => {
    const maxVotes = Math.max(...Object.values(votes));
    const playersWithMaxVotes = Object.entries(votes)
      .filter(([, voteCount]) => voteCount === maxVotes)
      .map(([playerName]) => playerName);

    if (playersWithMaxVotes.length > 1) {
      alert("Tie vote! Please revote.");
      return;
    }

    const eliminatedPlayerName = playersWithMaxVotes[0];
    const playerToEliminate = alivePlayers.find(
      (p) => p.name === eliminatedPlayerName
    );

    if (playerToEliminate) {
      setEliminatedPlayer(playerToEliminate);
      setShowVotingResult(true);
    }
  };

  const confirmElimination = () => {
    if (!eliminatedPlayer) return;

    const newEliminatedPlayers = [...eliminatedPlayers, eliminatedPlayer];
    setEliminatedPlayers(newEliminatedPlayers);

    // Check if eliminated player is Mr. White
    if (eliminatedPlayer.role === "mr-white") {
      setShowMrWhiteGuess(true);
      return;
    }

    checkWinConditions(newEliminatedPlayers);
  };

  const submitMrWhiteGuess = () => {
    if (
      mrWhiteGuess.toLowerCase().trim() === civilianWord.toLowerCase().trim()
    ) {
      setMrWhiteWinType("guess");
      setWinner("mr-white");
      setGameState("result");
    } else {
      // Mr. White guessed wrong, so they are just eliminated.
      // The game continues if other win conditions aren't met.
      checkWinConditions([...eliminatedPlayers, eliminatedPlayer!]);
    }
  };

  const checkWinConditions = (currentEliminatedPlayers: Player[]) => {
    const remainingPlayers = players.filter(
      (p) => !currentEliminatedPlayers.includes(p)
    );
    const remainingUndercovers = remainingPlayers.filter(
      (p) => p.role === "undercover"
    );
    const remainingMrWhite = remainingPlayers.filter(
      (p) => p.role === "mr-white"
    );
    const remainingCivilians = remainingPlayers.filter(
      (p) => p.role === "civilian"
    );

    // Undercovers win if they are equal to or outnumber civilians, and Mr. White is not the sole non-undercover.
    if (
      remainingUndercovers.length > 0 &&
      remainingUndercovers.length >= remainingCivilians.length &&
      (remainingMrWhite.length === 0 || remainingPlayers.length > 2)
    ) {
      setWinner("undercover");
      setGameState("result");
      return;
    }

    // Civilians win if all Undercovers and Mr. White are eliminated.
    if (remainingUndercovers.length === 0 && remainingMrWhite.length === 0) {
      setWinner("civilian");
      setGameState("result");
      return;
    }

    // Mr. White wins by survival if they are one of the last two players.
    if (
      remainingPlayers.length === 2 &&
      remainingMrWhite.length === 1 &&
      remainingUndercovers.length === 0
    ) {
      setMrWhiteWinType("survival");
      setWinner("mr-white");
      setGameState("result");
      return;
    }

    // If no win condition is met, the game continues.
    setShowVotingResult(false);
    setEliminatedPlayer(null);
    // Reset votes for the next round
    const newVotes: { [playerName: string]: number } = {};
    players
      .filter((p) => !currentEliminatedPlayers.includes(p))
      .forEach((player) => {
        newVotes[player.name] = 0;
      });
    setVotes(newVotes);
    setGameState("discussion");
  };

  const resetVoting = () => {
    setShowVotingResult(false);
    setEliminatedPlayer(null);
    const resetVotes: { [playerName: string]: number } = {};
    alivePlayers.forEach((player) => {
      resetVotes[player.name] = 0;
    });
    setVotes(resetVotes);
  };

  if (showMrWhiteGuess) {
    return (
      <div className="mr-white-guess">
        <h2>🎭 Mr. White's Final Chance!</h2>
        <p>
          <strong>{eliminatedPlayer?.name}</strong> was Mr. White!
        </p>
        <p>Mr. White can now guess the civilian word to win the game.</p>

        <div className="guess-input">
          <label>Guess the civilian word:</label>
          <input
            type="text"
            value={mrWhiteGuess}
            onChange={(e) => setMrWhiteGuess(e.target.value)}
            placeholder="Enter your guess..."
          />
        </div>

        <button
          className="btn-primary btn-lg"
          onClick={submitMrWhiteGuess}
          disabled={!mrWhiteGuess.trim()}
        >
          🎯 Submit Final Guess
        </button>
      </div>
    );
  }

  if (showVotingResult) {
    return (
      <div className="voting-result">
        <h2>📊 Voting Result</h2>
        <p>
          <strong>{eliminatedPlayer?.name}</strong> has been eliminated!
        </p>
        <p>
          Role:{" "}
          {eliminatedPlayer?.role === "mr-white"
            ? "⚪ Mr. White"
            : eliminatedPlayer?.role === "undercover"
            ? "🕵️ Undercover"
            : "👥 Civilian"}
        </p>

        <div className="action-buttons">
          <button className="btn-danger btn-lg" onClick={confirmElimination}>
            ✅ Confirm Elimination
          </button>
          <button className="btn-secondary btn-lg" onClick={resetVoting}>
            🔄 Restart Vote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="elimination-round">
      <h2>🎯 Elimination Protocol</h2>
      <p className="instruction">
        Cast your votes to eliminate a suspected infiltrator. The agent with the
        most votes will be terminated.
      </p>

      <div className="agents-remaining">
        <h3>🕵️ Active Agents: {alivePlayers.length}</h3>
      </div>

      <div className="voting-area">
        {alivePlayers.map((player) => (
          <div key={player.id} className="player-vote-card">
            <div className="player-info">
              <h4>{player.name}</h4>
              <div className="vote-count">
                Votes: <span className="count">{votes[player.name] || 0}</span>
              </div>
            </div>

            <div className="vote-buttons">
              <button
                className="btn-danger btn-sm"
                onClick={() => removeVote(player.name)}
                disabled={votes[player.name] === 0}
              >
                ➖ Remove Vote
              </button>
              <button
                className="btn-secondary btn-sm"
                onClick={() => addVote(player.name)}
              >
                ➕ Vote
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="voting-summary">
        <h3>Current Votes:</h3>
        {Object.entries(votes).map(([playerName, voteCount]) => (
          <div key={playerName} className="vote-summary-item">
            {playerName}: {voteCount} votes
          </div>
        ))}
      </div>

      <button
        className="btn-primary btn-lg"
        onClick={finishVoting}
        disabled={Object.values(votes).every((count) => count === 0)}
      >
        🎯 Execute Elimination Protocol
      </button>

      {eliminatedPlayers.length > 0 && (
        <div className="eliminated-players">
          <h3>Eliminated Players:</h3>
          {eliminatedPlayers.map((player) => (
            <div key={player.id} className="eliminated-player">
              {player.name} ({player.role})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EliminationRound;
