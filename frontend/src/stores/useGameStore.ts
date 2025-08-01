import { create } from "zustand";
import { IRoomState, IPlayer } from "@/types/global";

interface GameStore {
  player: IPlayer | null;
  roomState: IRoomState | null;
  setPlayer: (p: IPlayer) => void;
  setRoomState: (state: IRoomState) => void;
  clear: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  player: null,
  roomState: null,
  setPlayer: (p) => set({ player: p }),
  setRoomState: (state) => set({ roomState: state }),
  clear: () => set({ player: null, roomState: null }),
}));
