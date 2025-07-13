import React, { useState, useEffect } from "react";
import type { Player } from "../types/game";

interface DiscussionRoundProps {
  players: Player[];
  onDiscussionComplete: () => void;
  onSkipDiscussion: () => void;
}

const DiscussionRound: React.FC<DiscussionRoundProps> = ({
  players,
  onDiscussionComplete,
  onSkipDiscussion,
}) => {
  const [discussionOrder, setDiscussionOrder] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const timePerPlayer = 30; // 30 seconds per player

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate random order ensuring Mr. White is not first
  useEffect(() => {
    const alivePlayers = players.filter((p) => !p.isEliminated);
    const mrWhitePlayers = alivePlayers.filter((p) => p.role === "mr-white");
    const otherPlayers = alivePlayers.filter((p) => p.role !== "mr-white");

    // Shuffle other players
    const shuffledOthers = [...otherPlayers].sort(() => Math.random() - 0.5);

    // Shuffle Mr. White players
    const shuffledMrWhite = [...mrWhitePlayers].sort(() => Math.random() - 0.5);

    // Combine: ensure Mr. White is not first (if there are other players)
    let finalOrder: Player[] = [];
    if (shuffledOthers.length > 0) {
      // Insert Mr. White players randomly but not in first position
      const insertPositions = Array.from(
        { length: shuffledMrWhite.length },
        () => Math.floor(Math.random() * (shuffledOthers.length - 1)) + 1
      ).sort((a, b) => b - a); // Sort descending to maintain indices

      finalOrder = [...shuffledOthers];
      insertPositions.forEach((pos, index) => {
        finalOrder.splice(pos, 0, shuffledMrWhite[index]);
      });
    } else {
      // If only Mr. White players exist, just use them
      finalOrder = shuffledMrWhite;
    }

    setDiscussionOrder(finalOrder);
  }, [players]);

  // Timer effect
  useEffect(() => {
    let interval: number;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            // Time's up for current player, move to next
            if (currentPlayerIndex < discussionOrder.length - 1) {
              setCurrentPlayerIndex((prev) => prev + 1);
              return timePerPlayer;
            } else {
              // Discussion complete
              setIsActive(false);
              onDiscussionComplete();
              return 0;
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    timeLeft,
    currentPlayerIndex,
    discussionOrder.length,
    onDiscussionComplete,
  ]);

  const startDiscussion = () => {
    if (discussionOrder.length > 0) {
      setHasStarted(true);
      setIsActive(true);
      setTimeLeft(timePerPlayer);
      setCurrentPlayerIndex(0);
    }
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < discussionOrder.length - 1) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setTimeLeft(timePerPlayer);
    } else {
      setIsActive(false);
      onDiscussionComplete();
    }
  };

  const skipPlayer = () => {
    nextPlayer();
  };

  if (discussionOrder.length === 0) {
    return (
      <div className="discussion-round">
        <div className="loading-discussion">
          <div className="loading-spinner">
            <div className="spinner spinner--lg spinner--accent"></div>
          </div>
          <p>🎲 Preparing discussion order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discussion-round">
      <div className="discussion-header">
        <h2 className="component-title">💬 Intelligence Briefing</h2>
        <p>Each agent provides their intel on the target</p>
      </div>

      {!hasStarted ? (
        <div className="discussion-setup">
          <div className="discussion-rules">
            <h3>📋 Discussion Rules</h3>
            <ul>
              <li>🕐 Each player has {timePerPlayer} seconds to give a hint</li>
              <li>💭 Give a one-word hint about your word</li>
              <li>🚫 Don't use your exact word or obvious derivatives</li>
              <li>🤔 Listen carefully to identify undercovers and Mr. White</li>
            </ul>
          </div>

          <div className="discussion-order">
            <h3>🎯 Speaking Order</h3>
            <div className="order-list">
              {discussionOrder.map((player, index) => (
                <div key={player.id} className="order-item">
                  <span className="order-number">{index + 1}</span>
                  <span className="player-name">{player.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="discussion-actions">
            <button onClick={startDiscussion} className="start-discussion-btn">
              🚀 Begin Briefing
            </button>
            <button onClick={onSkipDiscussion} className="skip-discussion-btn">
              ⏩ Skip Briefing
            </button>
          </div>
        </div>
      ) : (
        <div className="discussion-active">
          <div className="current-player-section">
            <div className="current-player">
              <h3>🎤 Current Speaker</h3>
              <div className="player-card">
                <span className="player-name">
                  {discussionOrder[currentPlayerIndex]?.name}
                </span>
                <span className="player-position">
                  ({currentPlayerIndex + 1} of {discussionOrder.length})
                </span>
              </div>
            </div>

            <div className="timer">
              <div
                className={`timer-circle ${timeLeft <= 10 ? "warning" : ""} ${
                  timeLeft <= 5 ? "danger" : ""
                }`}
              >
                <span className="time-left">{formatTime(timeLeft)}</span>
              </div>
              <p className="timer-label">Time Remaining</p>
            </div>
          </div>

          <div className="discussion-controls">
            <button className="btn-primary btn-lg" onClick={nextPlayer}>
              {currentPlayerIndex < discussionOrder.length - 1
                ? "⏭️ Next Player"
                : "✅ Complete Discussion"}
            </button>
            <button className="btn-secondary btn-md" onClick={skipPlayer}>
              ⏩ Skip Turn
            </button>
          </div>

          <div className="briefing-progress">
            <div className="progress-label">
              Player {currentPlayerIndex + 1} of {discussionOrder.length}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    ((currentPlayerIndex + 1) / discussionOrder.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="remaining-players">
            <h4>📝 Speaking Queue</h4>
            <div className="queue-list">
              {discussionOrder
                .slice(currentPlayerIndex + 1)
                .map((player, index) => (
                  <div key={player.id} className="queue-item">
                    <span className="queue-number">
                      {currentPlayerIndex + index + 2}
                    </span>
                    <span className="queue-name">{player.name}</span>
                  </div>
                ))}
              {discussionOrder.slice(currentPlayerIndex + 1).length === 0 && (
                <p className="no-remaining">All players have spoken!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionRound;
