import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RotateCcw, Home, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { SolveGameDialog } from "@/components/SolveGameDialog";
import { useGameSocket } from "@/hooks/useGameSocket";
import { toast } from "@/hooks/use-toast";
import { useGameStore } from "../stores/useGameStore";
import { clsx } from "clsx";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { ActionButtons } from "../components/ui/ActionButtons";
import WordDisplay from "../components/WordDisplay";
import { useTurnTimer } from "@/hooks/useTurnTimer";
import { TimerDisplay } from "@/components/TimerDisplay";

const MAX_LETTERS = 8;



export default function GamePlay() {
  const { gameId, roomCode } = useParams();
  const navigate = useNavigate();

  const { player, roomState } = useGameStore();
  const nickname = player?.name ?? "Jogador";
  const isSolo = roomState?.totalPlayers === 1;
  console.log("GamePlay - roomState:", roomState);
  
  
  const {
    playerIndex,
    makeGuess,
    solveGame,
    resetGame,
    leaveRoom
  } = useGameSocket({
    roomId: roomCode!,
    player: player ?? { id: "", name: nickname },
    isSolo
  });

  const gameState = roomState?.gameState;
  let players = roomState?.players || [];

  
  if (isSolo && players.length === 1) {
    players = [
      ...players,
      {
        id: "bot",
        name: "🤖 Bot",
        isBot: true,
      }
    ];
  }


  const isMyTurn = gameState?.currentPlayer === playerIndex;
  const isGameOver = gameState?.winner !== null;
  const winner = gameState?.winner;
  const currentPlayerName = players[gameState?.currentPlayer ?? 0]?.name || "Jogador";
  const isComputerTurn = isSolo && gameState?.currentPlayer === 1;

  const timerPlayer0 = useTurnTimer({
  currentPlayer: gameState.currentPlayer,
  activePlayer: 0,
  onTimeout: () => {
    console.log("Player 0 timeout");
    // Aqui você vai emitir pro backend (ou localmente passar o turno)
  }
});

const timerPlayer1 = useTurnTimer({
  currentPlayer: gameState.currentPlayer,
  activePlayer: 1,
  onTimeout: () => {
    console.log("Player 1 timeout");
    // Backend ou lógica de passar turno
  }
});

  const handleLetterClick = (letter: string) => {
    if (!isMyTurn || isGameOver) return;

    makeGuess(letter);

    const letterExists = gameState?.words.some(word =>
      word.includes(letter.toUpperCase())
    );

    toast({
      title: letterExists ? "Acertou!" : "Errou!",
      description: letterExists
        ? `A letra ${letter} existe nas palavras!`
        : `A letra ${letter} não existe. Turno passa para o adversário.`
    });
  };

  const handleSolveGame = (guessedWords: string[]) => {
    const success = solveGame(guessedWords);

    toast({
      title: success ? "Parabéns!" : "Resposta incorreta!",
      description: success
        ? "Você resolveu o jogo e venceu!"
        : "Uma ou mais palavras estão erradas. Turno passa para o adversário.",
      variant: success ? "default" : "destructive"
    });

    return success;
  };

  const handleRematch = () => {
    resetGame();
    navigate(`/game/${gameId}/lobby/${roomCode}`);
  };

  const handleGoHome = () => {
    leaveRoom();
    navigate("/");
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Carregando jogo...</p>
      </div>
    );
  }

  const gameName = "COMIDAS";

  return (
     <BackgroundWrapper imageUrl="/adivinha_a_palavra/bg2.png">
    <div className="min-h-screen">
      <main className="container mx-auto px-0 sm:px-4 py-0 rounded-none">
        <div className="max-w-4xl mx-auto space-y-6">

          {isGameOver && (
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 border-purple-500">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-3xl">
                  🎉 {winner === playerIndex ? "Você Venceu!" : `${players[winner!]?.name || 'Adversário'} Venceu!`}
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  As palavras eram: <strong>{gameState.words.join(" - ")}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 justify-center">
                <Button onClick={handleRematch} className="bg-green-600 hover:bg-green-700 text-white">
                  <RotateCcw className="w-4 h-4 mr-2" /> Revanche
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="border-slate-400 text-slate-300 hover:bg-slate-700">
                  <Home className="w-4 h-4 mr-2" /> Sair
                </Button>
              </CardContent>
            </Card>
          )}


          <Card className="bg-[rgba(0,0,0,0.53)] border-none rounded-none p-0 " style={{ margin: '0 auto' }}>
            <CardContent className="py-2 flex flex-row items-center justify-between gap-4 flex-wrap px-3">
                <img
                  src="/adivinha_a_palavra/header.png"
                  alt="Header"
                  className="max-h-16 object-contain"
                />
                <h1 className="text-4xl font-bold text-transparent  bg-center"
                >
                  <a href="/"> <img
                  src="/logo.png"
                  alt="Header"
                  className="max-h-16 object-contain"
                /></a>
                
                </h1>
              </CardContent>
            <CardContent   
            className={clsx(
          "p-0 pb-4 pt-2 bg-[linear-gradient(to_top,_#1e2539_1%,_transparent_100%)]",
          
              )}
              >
                          <WordDisplay
                words={gameState.words}
                revealedLetters={gameState.revealedLetters}
                maxLetters={MAX_LETTERS}
              />
              <h2 className="mt-6 text-center text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
                <span className="text-[rgb(156,81,225)]">TEMA:</span>{" "}
                <span className="text-gray-400">{gameName}</span>
              </h2>
            </CardContent>
          
          </Card>
<div
  className="relative flex items-center justify-center gap-10 bg-[rgb(13,31,61,0.91)] h-[120px]"
  style={{ margin: "0 auto" }}
>
  {/* LINHA HORIZONTAL - JOGADOR 0 (esquerda) */}
  <div
    className={clsx(
      "absolute top-[-2px] left-0 h-[3px] transition-all duration-300",
      gameState.currentPlayer === 0
        ? "bg-green-500 opacity-100"
        : "bg-slate-500 opacity-40"
    )}
    style={{ width: "calc(50% - 88px)" }}
  />

  {/* LINHA HORIZONTAL - JOGADOR 1 (direita) */}
  <div
    className={clsx(
      "absolute top-[-2px] right-0 h-[3px] transition-all duration-300",
      gameState.currentPlayer === 1
        ? "bg-green-500 opacity-100"
        : "bg-slate-500 opacity-40"
    )}
    style={{ width: "calc(50% - 91px)" }}
  />

  {/* PLAYER 0 */}
  {players[0] && (
    <div className="relative flex flex-col items-center">
      <div className="flex items-center gap-2">
        {/* Timer do Jogador 0 (lado externo esquerdo) */}
        <div className="absolute" style={{right: "calc(21vw)"  }}>
          <TimerDisplay
            timeLeft={timerPlayer0}
            isActive={gameState.currentPlayer === 0}
          />
        </div>

        {/* Avatar do Jogador 0 */}
        <div
          className={clsx(
            "relative w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all",
            gameState.currentPlayer === 0
              ? "border-green-500"
              : "border-slate-500 opacity-50"
          )}
        >
          {/* LINHA VERTICAL ACIMA DO JOGADOR 0 */}
          <div
            className={clsx(
              "absolute left-1/2 w-[3px] transition-all duration-300",
              gameState.currentPlayer === 0
                ? "bg-green-500 opacity-100"
                : "bg-slate-500 opacity-50"
            )}
            style={{
              left: "50%",
              top: "-22px",
              height: "18px",
            }}
          />

          {/* ÍCONE DO JOGADOR 0 */}
          {players[0].isBot ? (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Nome do Jogador 0 */}
      <span
        className={clsx(
          "mt-1 text-sm font-semibold",
          gameState.currentPlayer === 0 ? "text-green-400" : "text-slate-300"
        )}
      >
        {players[0].name}
      </span>
    </div>
  )}

  {/* CENTRO - TEXTO "VS" E LINHA */}
  <div className="relative flex items-center justify-center h-20">
    <span className="text-white font-bold text-xl z-10 px-2 bg-[#e36922f6] rounded">
      vs
    </span>
    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-500 opacity-50" />
  </div>

  {/* PLAYER 1 */}
  {players[1] && (
    <div className="relative flex flex-col items-center">
      <div className="flex items-center gap-2">
        {/* Avatar do Jogador 1 */}
        <div
          className={clsx(
            "relative w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all",
            gameState.currentPlayer === 1
              ? "border-green-500"
              : "border-slate-500 opacity-50"
          )}
        >
          {/* LINHA VERTICAL ACIMA DO JOGADOR 1 */}
          <div
            className={clsx(
              "absolute left-1/2 w-[3px] transition-all duration-300",
              gameState.currentPlayer === 1
                ? "bg-green-500 opacity-100"
                : "bg-slate-500 opacity-50"
            )}
            style={{
              left: "50%",
              top: "-22px",
              height: "18px",
            }}
          />

          {/* ÍCONE DO JOGADOR 1 */}
          {players[1].isBot ? (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Timer do Jogador 1 (lado externo direito) */}
        <div className="absolute w-10" style={{left: "calc(21vw)"  }}>
          <TimerDisplay
            timeLeft={timerPlayer1}
            isActive={gameState.currentPlayer === 1}
          />
        </div>
      </div>

      {/* Nome do Jogador 1 */}
      <span
        className={clsx(
          "mt-1 text-sm font-semibold",
          gameState.currentPlayer === 1 ? "text-green-400" : "text-slate-300"
        )}
      >
        {players[1].name}
      </span>
    </div>
  )}
</div>





          {!isGameOver && (
            <Card className="bg-[rgb(13,31,61,0.91)] border-none rounded-none" style={{ margin: '0 auto' }}>
              <CardHeader>
                <CardTitle className="text-white">Tente acertar a palavra</CardTitle>
                {/* <CardDescription className="text-slate-400">
                  Clique nas letras para fazer sua tentativa ou use o botão "Resolver"
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                <VirtualKeyboard
                  onLetterClick={handleLetterClick}
                  usedLetters={gameState.usedLetters}
                  disabled={!isMyTurn || isComputerTurn}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <ActionButtons
          onSolve={() => {
            // abrir dialog de resolução
          }}
          onGiveUp={() => {
            leaveRoom();
            navigate("/");
          }}
        />

      </main>
    </div>
    </BackgroundWrapper>
  );
}
