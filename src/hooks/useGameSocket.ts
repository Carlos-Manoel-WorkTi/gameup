
import { useState, useEffect, useCallback } from 'react';

// Simulação do Socket.io para desenvolvimento
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

    const wordPhrases = [
      ['BRASIL', 'VERDE', 'AMARELO'],
      ['FUTEBOL', 'PAIXAO', 'NACIONAL'],
      ['PRAIA', 'SOL', 'MAR'],
      ['CARNAVAL', 'FESTA', 'ALEGRIA'],
      ['SAMBA', 'MUSICA', 'DANCA'],
      ['FEIJOADA', 'COMIDA', 'TRADICIONAL']
    ];
    const selectedPhrase = wordPhrases[Math.floor(Math.random() * wordPhrases.length)];
    
    const gameState: GameState = {
      gameStarted: true,
      currentPlayer: 0,
      words: selectedPhrase,
      revealedLetters: [],
      usedLetters: [],
      winner: null,
      isSoloMode: roomState.isSoloMode
    };

    setRoomState(prev => prev ? { ...prev, gameState } : null);
  }, [roomState]);

  const makeComputerMove = useCallback(() => {
    if (!roomState?.gameState || !roomState.gameState.isSoloMode) return;

    const { gameState } = roomState;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const availableLetters = alphabet.split('').filter(letter => !gameState.usedLetters.includes(letter));
    
    if (availableLetters.length === 0) return;

    // Estratégia simples: escolher letras mais comuns primeiro
    const commonLetters = ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N'];
    let computerGuess = availableLetters.find(letter => commonLetters.includes(letter));
    
    if (!computerGuess) {
      computerGuess = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    }

    setTimeout(() => {
      makeGuess(computerGuess!);
    }, 1500);
  }, [roomState]);

  const makeGuess = useCallback((guess: string) => {
    if (!roomState?.gameState) return;

    const { gameState } = roomState;
    const letter = guess.toUpperCase();
    
    // Verifica se a letra já foi usada
    if (gameState.usedLetters.includes(letter)) return;

    // Verifica se a letra existe em alguma das palavras
    const letterExists = gameState.words.some(word => word.includes(letter));
    
    const newUsedLetters = [...gameState.usedLetters, letter];
    let newRevealedLetters = [...gameState.revealedLetters];
    let newCurrentPlayer = gameState.currentPlayer;
    
    if (letterExists) {
      // Acertou: adiciona a letra às reveladas e mantém o turno
      if (!newRevealedLetters.includes(letter)) {
        newRevealedLetters.push(letter);
      }
    } else {
      // Errou: passa a vez
      newCurrentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
    }

    // Verifica se o jogo terminou (todas as letras foram reveladas)
    const allLettersRevealed = gameState.words.every(word => 
      word.split('').every(wordLetter => newRevealedLetters.includes(wordLetter))
    );

    const winner = allLettersRevealed ? gameState.currentPlayer : null;

    setRoomState(prev => prev ? {
      ...prev,
      gameState: {
        ...gameState,
        revealedLetters: newRevealedLetters,
        usedLetters: newUsedLetters,
        currentPlayer: newCurrentPlayer,
        winner
      }
    } : null);

    // Se é modo solo e agora é a vez do computador (e o jogo não terminou)
    if (gameState.isSoloMode && newCurrentPlayer === 1 && !winner) {
      setTimeout(() => makeComputerMove(), 1000);
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
