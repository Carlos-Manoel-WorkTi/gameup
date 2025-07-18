
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
  isSoloMode: boolean;
}

interface RoomState {
  code: string;
  players: string[];
  host: number;
  gameState: GameState | null;
  isSoloMode: boolean;
}

export function useGameSocket() {
  const [connected, setConnected] = useState(false);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [playerIndex, setPlayerIndex] = useState<number>(-1);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = useCallback((nickname: string, isSolo: boolean = false) => {
    const code = generateRoomCode();
    const newRoom: RoomState = {
      code,
      players: isSolo ? [nickname, 'Computador'] : [nickname],
      host: 0,
      gameState: null,
      isSoloMode: isSolo
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
      gameState: null,
      isSoloMode: false
    };
    setRoomState(newRoom);
    setPlayerIndex(1);
    setConnected(true);
    return true;
  }, []);

  const startGame = useCallback(() => {
    if (!roomState) return;

    const words = ['BRASIL', 'FUTEBOL', 'PRAIA', 'CARNAVAL', 'SAMBA', 'VIOLAO', 'FEIJOADA', 'CAPOEIRA'];
    const word = words[Math.floor(Math.random() * words.length)];
    
    const gameState: GameState = {
      gameStarted: true,
      currentPlayer: 0,
      word,
      hiddenWord: word.replace(/[A-Z]/g, '_'),
      guessedLetters: [],
      wrongLetters: [],
      winner: null,
      isSoloMode: roomState.isSoloMode
    };

    setRoomState(prev => prev ? { ...prev, gameState } : null);
  }, [roomState]);

  const makeComputerMove = useCallback(() => {
    if (!roomState?.gameState || !roomState.gameState.isSoloMode) return;

    const { gameState } = roomState;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const usedLetters = [...gameState.guessedLetters, ...gameState.wrongLetters];
    const availableLetters = alphabet.split('').filter(letter => !usedLetters.includes(letter));
    
    if (availableLetters.length === 0) return;

    // Estratégia simples: escolher letras mais comuns primeiro
    const commonLetters = ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N'];
    let computerGuess = availableLetters.find(letter => commonLetters.includes(letter));
    
    if (!computerGuess) {
      computerGuess = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    }

    setTimeout(() => {
      makeGuess(computerGuess!);
    }, 1500); // Delay para simular "pensamento" do computador
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
        const newCurrentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
        setRoomState(prev => prev ? {
          ...prev,
          gameState: {
            ...gameState,
            wrongLetters: [...gameState.wrongLetters, letter],
            currentPlayer: newCurrentPlayer
          }
        } : null);

        // Se é modo solo e agora é a vez do computador
        if (gameState.isSoloMode && newCurrentPlayer === 1) {
          setTimeout(() => makeComputerMove(), 1000);
        }
      }
    } else {
      // Tentativa de palavra completa
      const isCorrect = guess.toUpperCase() === gameState.word;
      const newCurrentPlayer = isCorrect ? gameState.currentPlayer : (gameState.currentPlayer === 0 ? 1 : 0);
      
      setRoomState(prev => prev ? {
        ...prev,
        gameState: {
          ...gameState,
          winner: isCorrect ? gameState.currentPlayer : null,
          currentPlayer: newCurrentPlayer
        }
      } : null);

      // Se é modo solo e agora é a vez do computador
      if (gameState.isSoloMode && newCurrentPlayer === 1 && !isCorrect) {
        setTimeout(() => makeComputerMove(), 1000);
      }
    }
  }, [roomState, makeComputerMove]);

  const resetGame = useCallback(() => {
    setRoomState(prev => prev ? { ...prev, gameState: null } : null);
  }, []);

  const leaveRoom = useCallback(() => {
    setRoomState(null);
    setPlayerIndex(-1);
    setConnected(false);
  }, []);

  // Trigger computer move when it's computer's turn
  useEffect(() => {
    if (roomState?.gameState?.isSoloMode && 
        roomState.gameState.currentPlayer === 1 && 
        !roomState.gameState.winner &&
        roomState.gameState.gameStarted) {
      makeComputerMove();
    }
  }, [roomState?.gameState?.currentPlayer, makeComputerMove]);

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
