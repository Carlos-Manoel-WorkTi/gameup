
import { useState, useEffect, useCallback } from 'react';

// Simulação do Socket.io para desenvolvimento
interface GameState {
  gameStarted: boolean;
  currentPlayer: number;
  word: string;
  hiddenWord: string;
  guessedLetters: string[];
  wrongLetters: string[];
  winner: number | null;
}

interface RoomState {
  code: string;
  players: string[];
  host: number;
  gameState: GameState | null;
}

export function useGameSocket() {
  const [connected, setConnected] = useState(false);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [playerIndex, setPlayerIndex] = useState<number>(-1);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = useCallback((nickname: string) => {
    const code = generateRoomCode();
    const newRoom: RoomState = {
      code,
      players: [nickname],
      host: 0,
      gameState: null
    };
    setRoomState(newRoom);
    setPlayerIndex(0);
    setConnected(true);
    return code;
  }, []);

  const joinRoom = useCallback((code: string, nickname: string) => {
    // Simula entrada em sala existente
    const newRoom: RoomState = {
      code,
      players: ['Jogador1', nickname], // Simula que já existe um jogador
      host: 0,
      gameState: null
    };
    setRoomState(newRoom);
    setPlayerIndex(1);
    setConnected(true);
    return true;
  }, []);

  const startGame = useCallback(() => {
    if (!roomState) return;

    const words = ['BRASIL', 'FUTEBOL', 'PRAIA', 'CARNAVAL', 'SAMBA'];
    const word = words[Math.floor(Math.random() * words.length)];
    
    const gameState: GameState = {
      gameStarted: true,
      currentPlayer: 0,
      word,
      hiddenWord: word.replace(/[A-Z]/g, '_'),
      guessedLetters: [],
      wrongLetters: [],
      winner: null
    };

    setRoomState(prev => prev ? { ...prev, gameState } : null);
  }, [roomState]);

  const makeGuess = useCallback((guess: string) => {
    if (!roomState?.gameState) return;

    const { gameState } = roomState;
    const isLetter = guess.length === 1;
    
    if (isLetter) {
      const letter = guess.toUpperCase();
      if (gameState.word.includes(letter)) {
        // Acertou a letra
        const newHiddenWord = gameState.word
          .split('')
          .map(char => gameState.guessedLetters.includes(char) || char === letter ? char : '_')
          .join('');
        
        const newGuessedLetters = [...gameState.guessedLetters, letter];
        const isComplete = !newHiddenWord.includes('_');
        
        setRoomState(prev => prev ? {
          ...prev,
          gameState: {
            ...gameState,
            hiddenWord: newHiddenWord,
            guessedLetters: newGuessedLetters,
            winner: isComplete ? gameState.currentPlayer : null
          }
        } : null);
      } else {
        // Errou a letra
        setRoomState(prev => prev ? {
          ...prev,
          gameState: {
            ...gameState,
            wrongLetters: [...gameState.wrongLetters, letter],
            currentPlayer: gameState.currentPlayer === 0 ? 1 : 0
          }
        } : null);
      }
    } else {
      // Tentativa de palavra completa
      const isCorrect = guess.toUpperCase() === gameState.word;
      setRoomState(prev => prev ? {
        ...prev,
        gameState: {
          ...gameState,
          winner: isCorrect ? gameState.currentPlayer : null,
          currentPlayer: isCorrect ? gameState.currentPlayer : (gameState.currentPlayer === 0 ? 1 : 0)
        }
      } : null);
    }
  }, [roomState]);

  const resetGame = useCallback(() => {
    setRoomState(prev => prev ? { ...prev, gameState: null } : null);
  }, []);

  const leaveRoom = useCallback(() => {
    setRoomState(null);
    setPlayerIndex(-1);
    setConnected(false);
  }, []);

  return {
    connected,
    roomState,
    playerIndex,
    createRoom,
    joinRoom,
    startGame,
    makeGuess,
    resetGame,
    leaveRoom
  };
}
