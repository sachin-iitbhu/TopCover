import type { GameRecord, PlayerStats } from "../types/game";

const GAME_RECORDS_KEY = "topcover-game-records";
const PLAYER_STATS_KEY = "topcover-player-stats";

// Point system
const POINTS = {
  WIN_AS_CIVILIAN: 3,
  WIN_AS_UNDERCOVER: 5,
  WIN_AS_MR_WHITE: 7,
  PARTICIPATION: 1,
};

export const saveGameRecord = (record: GameRecord): void => {
  const existingRecords = getGameRecords();
  const updatedRecords = [record, ...existingRecords];
  localStorage.setItem(GAME_RECORDS_KEY, JSON.stringify(updatedRecords));
  updatePlayerStats(record);
};

export const getGameRecords = (): GameRecord[] => {
  const stored = localStorage.getItem(GAME_RECORDS_KEY);
  if (!stored) return [];

  try {
    const records: GameRecord[] = JSON.parse(stored);
    return records.map((record) => ({
      ...record,
      date: new Date(record.date),
    }));
  } catch {
    return [];
  }
};

export const getPlayerStats = (): PlayerStats[] => {
  const stored = localStorage.getItem(PLAYER_STATS_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const updatePlayerStats = (record: GameRecord): void => {
  const currentStats = getPlayerStats();
  const statsMap = new Map(currentStats.map((stat) => [stat.name, stat]));

  // Update stats for each player in the game
  record.players.forEach((player) => {
    const existingStat = statsMap.get(player.name) || {
      name: player.name,
      gamesPlayed: 0,
      wins: 0,
      winsAsCivilian: 0,
      winsAsUndercover: 0,
      winsAsMrWhite: 0,
      totalPoints: 0,
    };

    existingStat.gamesPlayed += 1;
    existingStat.totalPoints += POINTS.PARTICIPATION;

    // Check if this player won
    const isWinner = record.winner === player.role;
    if (isWinner) {
      existingStat.wins += 1;

      switch (player.role) {
        case "civilian":
          existingStat.winsAsCivilian += 1;
          existingStat.totalPoints += POINTS.WIN_AS_CIVILIAN;
          break;
        case "undercover":
          existingStat.winsAsUndercover += 1;
          existingStat.totalPoints += POINTS.WIN_AS_UNDERCOVER;
          break;
        case "mr-white":
          existingStat.winsAsMrWhite += 1;
          existingStat.totalPoints += POINTS.WIN_AS_MR_WHITE;
          break;
      }
    }

    statsMap.set(player.name, existingStat);
  });

  const updatedStats = Array.from(statsMap.values()).sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(updatedStats));
};

export const clearAllData = (): void => {
  localStorage.removeItem(GAME_RECORDS_KEY);
  localStorage.removeItem(PLAYER_STATS_KEY);
};

export const getLeaderboard = (): PlayerStats[] => {
  return getPlayerStats().slice(0, 10); // Top 10 players
};
