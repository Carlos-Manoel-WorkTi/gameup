import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Inicializa Express e CORS
const app = express();
app.use(cors({ origin: "*" }));

// Cria servidor HTTP e Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Estrutura de uma sala
interface Room {
  players: any[];                  // lista de jogadores
  game: any;                       // estado do jogo (opcional)
  readyStatus: Record<string, boolean>; // mapa player.id → pronto?
  hostId: number;                    // índice do host em players[]
}

// Armazena salas em memória
const rooms: Record<string, Room> = {};

io.on("connection", socket => {
  console.log("Novo cliente conectado:", socket.id);

  // ===== JOIN ROOM =====
socket.on("join_room", ({ roomId, player }) => {
  socket.join(roomId);
  socket.data.roomId = roomId;
  socket.data.player = player;

  let room = rooms[roomId];

  if (!room) {
    // Sala nova: o primeiro a entrar é o host e já vem pronto
    room = rooms[roomId] = {
      players: [player],
      game: null,
      hostId: player.id,
      readyStatus: { [player.id]: true },
    };
  } else {
    // Sala existente: adiciona convidado (não pronto)
    const exists = room.players.some(p => p.id === player.id);
    if (!exists) {
      room.players.push(player);
      room.readyStatus[player.id] = false;
    }
  }

  // Avisa que entrou
  io.to(roomId).emit("player_joined", { data: player, status: "success" });

  const allReady = Object.values(room.readyStatus).every(Boolean);
  
  // Emite para TODOS da sala (atualização geral)
  io.to(roomId).emit("room_state", {
    players: room.players,
    totalPlayers: room.players.length,
    hostId: room.hostId,
    allReady,
    readyStatus: room.readyStatus,
    gameState: room.game
  });

  // Emite APENAS para o jogador que acabou de entrar (recarregar estado após refresh)
  socket.emit("room_state", {
    players: room.players,
    totalPlayers: room.players.length,
    hostId: room.hostId,
    allReady,
    readyStatus: room.readyStatus,
    gameState: room.game
  });

  console.log(`Sala ${roomId} readyStatus:`, room.readyStatus);
});

  // ===== LEAVE ROOM =====
  socket.on("leave_room", ({ roomId, player }) => {
    const room = rooms[roomId];
    if (!room) return;

    const idx = room.players.findIndex(p => p.id === player.id);
    if (idx !== -1) {
      room.players.splice(idx, 1);
      delete room.readyStatus[player.id];
    }
    socket.leave(roomId);

    // Recalcula host se for preciso
    // if (room.host === idx) {
    //   room.host = 0;
    // } else if (room.host > idx) {
    //   room.host--;
    // }

    io.to(roomId).emit("player_left", { data: player, status: "success" });

    const allReady = Object.values(room.readyStatus).every(Boolean);
    io.to(roomId).emit("room_state", {
      players:room.players,
      totalPlayers:room.players.length,
      hostId:room.hostId,
      allReady,
      readyStatus: room.readyStatus,
      gameState:room.game
    });

    console.log(`Sala ${roomId} after leave readyStatus:`, room.readyStatus);
  });

  // ===== KICK PLAYER =====
  socket.on("kick_player", ({ roomId, playerId }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.players = room.players.filter(p => p.id !== playerId);
    delete room.readyStatus[playerId];

    io.to(roomId).emit("player_kicked", { data: playerId, status: "success" });

    // Ajusta host se necessário
    // if (room.host >= room.players.length) room.host = 0;

    const allReady = Object.values(room.readyStatus).every(Boolean);
    io.to(roomId).emit("room_state", {
      players: room.players,
      totalPlayers: room.players.length,
      hostId:room.hostId,
      allReady,
      readyStatus: room.readyStatus,
      gameState:room.game
    });

    console.log(`Sala ${roomId} after kick readyStatus:`, room.readyStatus);
  });

  // ===== PLAYER READY =====
  socket.on("player_ready", ({ roomId, playerId, ready }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.readyStatus[playerId] = ready;

    const allReady = Object.values(room.readyStatus).every(Boolean);
    io.to(roomId).emit("player_ready_update", { readyStatus: room.readyStatus, allReady });

    console.log(`Sala ${roomId} readyStatus:`, room.readyStatus, "allReady:", allReady);
  });

  // ===== UPDATE GAME =====
  socket.on("update_game", ({ roomId, game }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.game = game;
    io.to(roomId).emit("game_updated", { data: game, status: "success" });
  });




  // ===== PLAYER TURN =====
  socket.on("make_guess", ({ roomId, playerId, letter }) => {
  const room = rooms[roomId];
  if (!room || !room.game) return;

  const game = room.game;

  // Verifica se é a vez do jogador
  const playerIndex = room.players.findIndex(p => p.id === playerId);
  if (playerIndex !== game.currentPlayer) return;

  // Letra já usada?
  if (game.usedLetters.includes(letter.toUpperCase())) return;

  game.usedLetters.push(letter.toUpperCase());

  let found = false;

  for (const word of game.words) {
    if (word.includes(letter.toUpperCase())) {
      found = true;
      break;
    }
  }

  if (found) {
    game.revealedLetters.push(letter.toUpperCase());
    // Verifica se todas letras estão reveladas
    const allLetters = game.words.join("").split("");
    const uniqueLetters = [...new Set(allLetters)];
    const allRevealed = uniqueLetters.every(l => game.revealedLetters.includes(l));

    if (allRevealed) {
      game.winner = game.currentPlayer;
    }
  } else {
    // Troca turno
    game.currentPlayer = (game.currentPlayer + 1) % room.players.length;
  }

  io.to(roomId).emit("game_updated", { data: game, status: "success" });
});

socket.on("solve_game", ({ roomId, playerId, guessedWords }) => {
  const room = rooms[roomId];
  if (!room || !room.game) return;

  const game = room.game;
  const playerIndex = room.players.findIndex(p => p.id === playerId);
  if (playerIndex !== game.currentPlayer) return;

  const normalized = (w: string) => w.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const isCorrect = game.words.every((word: string, idx: string | number) =>
    normalized(word) === normalized(guessedWords[idx])
  );

  if (isCorrect) {
    game.winner = game.currentPlayer;
  } else {
    // passa turno
    game.currentPlayer = (game.currentPlayer + 1) % room.players.length;
  }

  io.to(roomId).emit("game_updated", { data: game, status: "success" });
});




 // ===== START GAME =====
  socket.on("start_game", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    const wordPhrases = [
      ['BRASIL', 'VERDE', 'AMARELO'],
      ['FUTEBOL', 'PAIXAO', 'NACIONAL'],
      ['SAMBA', 'CARNAVAL', 'ALEGRIA']
    ];
    const selectedPhrase = wordPhrases[Math.floor(Math.random() * wordPhrases.length)];
    console.log(`🟢 Iniciando jogo na sala ${roomId} com palavras:`, selectedPhrase);
    room.game = { 
      gameStarted: true,
      currentPlayer: 0,
      words: selectedPhrase,
      revealedLetters: [],
      usedLetters: [],
      winner: null,
      isSoloMode: false
    };

    io.to(roomId).emit("game_updated", {
      data: room.game,
      players: room.players,
      status: "success"
    });

    console.log(`🟢 Jogo iniciado na sala ${roomId}`);
    // avisa que o jogo começou
    io.to(roomId).emit("game_started", {
      players: room.players,
      game: room.game
    });
  });


  // ===== DISCONNECT =====
  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    const player = socket.data.player;
    if (!roomId || !player) return;

    const room = rooms[roomId];
    if (!room) return;

    const idx = room.players.findIndex(p => p.id === player.id);
    if (idx !== -1) {
      room.players.splice(idx, 1);
      delete room.readyStatus[player.id];
    }

    // Recalcula host
    // if (room.host === idx) {
    //   room.host = 0;
    // } else if (room.host > idx) {
    //   room.host--;
    // }

    io.to(roomId).emit("player_left", { data: player, status: "disconnected" });

    const allReady = Object.values(room.readyStatus).every(Boolean);
    io.to(roomId).emit("room_state", {
      players:     room.players,
      totalPlayers: room.players.length,
          hostId: room.hostId,
      allReady,
      readyStatus: room.readyStatus,
      gameState:    room.game
    });

    console.log(`Sala ${roomId} after disconnect readyStatus:`, room.readyStatus);
  });
});

const PORT = 3001;
server.listen(PORT, "0.0.0.0" ,() => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});
