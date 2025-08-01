export interface IPlayer {
  id: string;
  name: string;
}

export interface IGame {
  gameStarted: boolean;
  currentPlayer: number;
  words: string[];
  revealedLetters: string[];
  usedLetters: string[];
  winner: number | null;
  isSoloMode: boolean;
}

export interface IRoomState {
  code: string;
  players: IPlayer[];
  host: number;
  gameState: IGame | null;
  isSoloMode: boolean;
  totalPlayers: number | null;
  readyStatus?: Record<string, boolean>;
}

export interface SocketClientResponse<T> {
  data: T;
  status: "success" | "error";
}
