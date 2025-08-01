import { useState, useEffect, useCallback, useRef, useMemo, SetStateAction } from "react";
import { io, Socket } from "socket.io-client";
import {
  IGame,
  IPlayer,
  SocketClientResponse,
  IRoomState,
} from "../types/global";
import {socket} from "../utils/socket"; // importa seu socket singleton
import { useGameStore } from "../stores/useGameStore";

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

// interface RoomState {
//   allReady: SetStateAction<boolean>;
//   code: string;
//   players: string[];
//   host: number;
//   gameState: GameState | null;
//   isSoloMode: boolean;
//   totalPlayers: number | null;
//   readyStatus?: Record<string, boolean>;
// }

export function useGameSocket({ roomId, player, isSolo }: UseGameSocketProps,onGameStart?: () => void) {
  const socketRef = useRef<Socket | null>(null);
  const [roomState, setRoomState] = useState<IRoomState | null>(null);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const gameStartedRef = useRef(false);
  const allReady = useMemo(() => {
  return roomState ? Object.values(roomState.readyStatus || {}).every(Boolean) : false;
}, [roomState]);

  useEffect(() => {
    useGameStore.getState().setPlayer(player);
  }, [player]);

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

    // filepath: /home/carlos/Área de trabalho/gameup/frontend/src/hooks/useGameSocket.ts
    socket.on("room_state", (data: IRoomState) => {
      setRoomState(prev => {
        const updated = {
          ...data,
              gameState:
        (data.gameState === undefined || data.gameState === null)
          ? prev?.gameState ?? null
          : data.gameState
        };
        useGameStore.getState().setRoomState(updated);
        const index = updated.players.findIndex((p) => p.id === player.id);
        setPlayerIndex(index);
        console.log("🎯 DADOS", updated);
        return updated;
      });
    });

    socket.on("player_joined", (response: SocketClientResponse<IPlayer>) => {
      console.log("👤 Novo jogador entrou:", response.data);
    });

    socket.on("player_left", (response: SocketClientResponse<IPlayer>) => {
      console.log("👋 Jogador saiu:", response.data);


    });

    // socket.off("game_updated");
    socket.on("game_updated", (response: { data: IGame; players: IPlayer[]; status: string } ) => {
      const game = response.data;
      const players = response.players;
      
      setRoomState(prev => {
        console.log("prev", prev);
        
           if (!prev) {
          // Crie um objeto padrão com os campos obrigatórios
          console.log("Entrando no if de prev");
          
          const updated: IRoomState = {
            code: roomId,
            players: players,
            host: 0,
            isSoloMode: isSolo,
            totalPlayers: players.length,
            readyStatus: {},
            gameState: game
          };
          useGameStore.getState().setRoomState(updated);
          return updated;
        }
        const updated = {
          ...(prev ?? {}), // mantém o que já existe, ou cria vazio
          gameState: game
        };  
        console.log("Atualizando gameState:", updated);
        
        
        useGameStore.getState().setRoomState(updated);
        
        if (game.gameStarted && !gameStartedRef.current) {
          gameStartedRef.current = true;
          if (onGameStart) {
            setTimeout(() => {
              onGameStart();  
            }, 0);
          }
        }


        return updated;
      });
    });


    socket.on("game_started", (payload) => {
      setRoomState((prev) => {
        if (!prev) return null;
        
        const updated = {
          ...prev,
          players: payload.players,
          gameState: payload.game,
        };

        useGameStore.getState().setRoomState(updated);
        gameStartedRef.current = true;

        if (onGameStart) {
          setTimeout(() => {
            onGameStart();
          }, 0);
        }
        console.log("🕹️ Jogo iniciado: gameS", payload.game);
        return updated;
      });
    });

    socket.on("player_kicked", (response: SocketClientResponse<string>) => {
      console.log("🚫 Jogador expulso:", response.data);
    });

    return () => {
      socket.emit("leave_room", { roomId, player });

      socket.off("connect", handleConnect);
      socket.off("connect_error");
      socket.off("player_ready_update");
      socket.off("room_state");
      socket.off("player_joined");
      socket.off("player_left");
      socket.off("game_updated");
      socket.off("game_started");
      socket.off("player_kicked");
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
    socket.emit("make_guess", {
      roomId,
      playerId: player.id,
      letter
    });

  };

  const solveGame = (guessedWords: string[]) => {
    socket.emit("solve_game", {
      roomId,
      playerId: player.id,
      guessedWords
    });
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
    allReady
  };
}

