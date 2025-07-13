export type Role = "civilian" | "undercover" | "mr-white";

export type GameState =
  | "setup"
  | "word-distribution"
  | "discussion"
  | "elimination"
  | "mr-white-guess"
  | "result";

export interface Player {
  id: string;
  name: string;
  role: Role;
  word?: string;
  isEliminated: boolean;
}

export interface GameConfig {
  totalPlayers: number;
  numUndercovers: number;
  numMrWhite: number;
  civilianWord: string;
  undercoverWord: string;
}

export interface EliminationVote {
  playerName: string;
  votes: number;
}

export interface GameRecord {
  id: string;
  date: Date;
  players: Player[];
  winner: Role | null;
  rounds: number;
  civilianWord: string;
  undercoverWord: string;
}

export interface PlayerStats {
  name: string;
  gamesPlayed: number;
  wins: number;
  winsAsCivilian: number;
  winsAsUndercover: number;
  winsAsMrWhite: number;
  totalPoints: number;
}
