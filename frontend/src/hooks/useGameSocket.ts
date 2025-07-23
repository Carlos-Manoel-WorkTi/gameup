import { useState, useEffect, useCallback, useRef, useMemo, SetStateAction } from "react";
import { io, Socket } from "socket.io-client";
import {
  IGame,
  IPlayer,
  SocketClientResponse,
  IRoomState,
} from "@/types/global";
import {socket} from "@/utils/socket"; // importa seu socket singleton


// Simulação do Socket.io para desenvolvimento
interface UseGameSocketProps {
  roomId: string;
  player: IPlayer;
  isSolo: boolean;
}
interface GameState {
  gameStarted: boolean;
  currentPlayer: number;
  words: string[];
  revealedLetters: string[];
  usedLetters: string[];
  winner: number | null;
  isSoloMode: boolean;
}

interface RoomState {
  allReady: SetStateAction<boolean>;
  code: string;
  players: string[];
  host: number;
  gameState: GameState | null;
  isSoloMode: boolean;
  totalPlayers: number | null;
  readyStatus?: Record<string, boolean>;
}

export function useGameSocket({ roomId, player, isSolo }: UseGameSocketProps) {
  const socketRef = useRef<Socket | null>(null);
  const [roomState, setRoomState] = useState<IRoomState | null>(null);
  const [playerIndex, setPlayerIndex] = useState<number>(0);

  const allReady = useMemo(() => {
  return roomState ? Object.values(roomState.readyStatus || {}).every(Boolean) : false;
}, [roomState]);


  // ========== CONEXÃO ==========
  useEffect(() => {
    if (!socket.connected) {
      console.error("SOCKET_URL não está definido");
      return;
    }
    

    socketRef.current = socket;
   
    
    socket.on("connect_error", (err) => {
      console.log("Mensagem do erro:", err.message);
    });
    socket.on("connect", () => {
      socket.emit("join_room", { roomId, player });
    });

  // se já estiver conectado, chama manualmente
    if (socket.connected) {
      handleConnect();
    } 

    socket.on("player_ready_update", ({ readyStatus, allReady }) => {
      setRoomState((prev) =>
        prev
          ? {
              ...prev,
              readyStatus,
              allReady
            }
          : null
      );
     
      if (allReady) {
        console.log("🎯 Todos os jogadores estão prontos!");
        // opcional: chamar startGame aqui, ou esperar um botão
      }
    });

    socket.on("room_state", (data: RoomState) => {
      setRoomState(data);
      const index = data.players.findIndex((p) => p.id === player.id);
      setPlayerIndex(index);
      console.log("🎯 DADOS", data)
    });

    socket.on("player_joined", (response: SocketClientResponse<IPlayer>) => {
      console.log("👤 Novo jogador entrou:", response.data);
    });

    socket.on("player_left", (response: SocketClientResponse<IPlayer>) => {
      console.log("👋 Jogador saiu:", response.data);


    });

    socket.on("game_updated", (response) => {
        setRoomState(prev => {
          if (!prev) return prev;       // se ainda não tem sala, ignora
          return {
            ...prev,
            gameState: response.data,   // só atualiza a parte de gameState
          };
        });
      });


    socket.on("player_kicked", (response: SocketClientResponse<string>) => {
      console.log("🚫 Jogador expulso:", response.data);
    });

    return () => {
      // 1) avisa ao servidor que saiu da sala
      // socket.emit("leave_room", { roomId, player });

      // // 2) remove TODOS os listeners que você adicionou:
      // socket.off("connect", handleConnect);
      // socket.off("connect_error");
      // socket.off("player_ready_update");
      // socket.off("room_state");
      // socket.off("player_joined");
      // socket.off("player_left");
      // socket.off("game_updated");
      // socket.off("player_kicked");
    };
  }, []); // ← ESSENCIAL: roda só na montagem

  // ========== AÇÕES ==========

  function handleConnect() {
  console.log("✅ Conectado! Socket ID:", socket.id);
  if (roomId && player.id) {
    socket.emit("join_room", { roomId, player });
  }
}

  const setPlayerReady = (ready: boolean) => {
    socketRef.current?.emit("player_ready", {
      roomId,
      playerId: player.id,
      ready,
    });
  };

  const makeGuess = (letter: string) => {
    socketRef.current?.emit("guess_letter", {
      roomId,
      playerId: player.id,
      letter,
    });
  };

  const solveGame = (guessedWords: string[]) => {
    if (!roomState?.gameState) return false;

    const correct =
      JSON.stringify(guessedWords.map((w) => w.toUpperCase())) ===
      JSON.stringify(roomState.gameState.words);
    if (correct) {
      socketRef.current?.emit("player_won", {
        roomId,
        playerId: player.id,
      });
    } else {
      socketRef.current?.emit("player_failed", {
        roomId,
        playerId: player.id,
      });
    }

    return correct;
  };

  const resetGame = () => {
    socketRef.current?.emit("reset_game", { roomId });
  };

  const leaveRoom = () => {
    console.log("👋 Saindo da sala:", roomId);
    socketRef.current?.emit("leave_room", { roomId, player });
  };

  const startGame = () => {
    socketRef.current?.emit("start_game", { roomId });
  };

  // ========== DEFINIÇÃO DE INFORMAÇÂO DO JOGADOR ==========
  const isCurrentHost = useMemo(() => {
    return (
      roomState?.players[playerIndex]?.id ===
      roomState?.players[roomState.host]?.id
    );
  }, [roomState, playerIndex]);

  // ========== IDENTIFICADOR DO JOGADOR ==========
  useEffect(() => {
    if (!roomState?.players) return;
    const index = roomState.players.findIndex((p) => p.id === player.id);
    setPlayerIndex(index);
  }, [roomState?.players, player.id]);

  return {
    roomState,
    playerIndex,
    makeGuess,
    solveGame,
    resetGame,
    leaveRoom,
    startGame,
    setPlayerReady,
    isCurrentHost,
    allReady,
  };
}

