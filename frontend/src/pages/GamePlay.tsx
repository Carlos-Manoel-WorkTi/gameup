import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { RotateCcw, Home, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameHeader } from "@/components/GameHeader";
import { WordDisplay } from "@/components/WordDisplay";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { SolveGameDialog } from "@/components/SolveGameDialog";
import { useGameSocket } from "@/hooks/useGameSocket";
import { toast } from "@/hooks/use-toast";

export default function GamePlay() {
  const { gameId, roomCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { nickname?: string; isHost?: boolean; isSolo?: boolean } || {};
  const nickname = locationState.nickname || "Jogador";
  const isSolo = locationState.isSolo || false;

  const {
    roomState,
    playerIndex,
    makeGuess,
    solveGame,
    resetGame,
    leaveRoom
  } = useGameSocket({
    roomId: roomCode!,
    player: { id: "", name: nickname }, // ID já será atribuído corretamente no hook
    isSolo
  });

  const gameState = roomState?.gameState;
  const players = roomState?.players || [];

  const isMyTurn = gameState?.currentPlayer === playerIndex;
  const isGameOver = gameState?.winner !== null;
  const winner = gameState?.winner;
  const currentPlayerName = players[gameState?.currentPlayer ?? 0]?.name || "Jogador";
  const isComputerTurn = isSolo && gameState?.currentPlayer === 1;

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

    if (success) {
      toast({
        title: "Parabéns!",
        description: "Você resolveu o jogo e venceu!"
      });
    } else {
      toast({
        title: "Resposta incorreta!",
        description: "Uma ou mais palavras estão erradas. Turno passa para o adversário.",
        variant: "destructive"
      });
    }

    return success;
  };

  const handleRematch = () => {
    resetGame();
    navigate(`/game/${gameId}/lobby/${roomCode}`, {
      state: locationState
    });
  };

  const handleGoHome = () => {
    leaveRoom();
    navigate("/");
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <GameHeader title="Carregando..." />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-white">Carregando jogo...</p>
        </div>
      </div>
    );
  }


  const gameName = gameId === "roda-a-roda" ? "Roda a Roda Jequiti" : "Jogo";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GameHeader
        title={`${gameName} ${isSolo ? "(Solo)" : ""}`}
        showBackButton
        onBack={() =>
          navigate(`/game/${gameId}/lobby/${roomCode}`, {
            state: locationState
          })
        }
      />

      <main className="container mx-auto px-4 py-8">
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
                <Button
                  onClick={handleRematch}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Revanche
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="border-slate-400 text-slate-300 hover:bg-slate-700"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Palavras */}
          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="py-8">
              <WordDisplay
                words={gameState.words}
                revealedLetters={gameState.revealedLetters}
              />
            </CardContent>
          </Card>

          {/* Turno */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Turno Atual
                {isComputerTurn && <Bot className="w-5 h-5 text-orange-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`text-lg font-medium p-3 rounded-lg flex items-center gap-2 ${
                isMyTurn ? "bg-green-600 text-white" :
                isComputerTurn ? "bg-orange-600 text-white" :
                "bg-slate-700 text-slate-300"
              }`}>
                {isMyTurn
                  ? "🟢 Sua vez!"
                  : isComputerTurn
                  ? "🤖 Computador pensando..."
                  : `⏳ Vez de ${currentPlayerName}`}
              </div>

              {!isGameOver && isMyTurn && (
                <div className="flex justify-center">
                  <SolveGameDialog
                    onSolve={handleSolveGame}
                    disabled={!isMyTurn || isComputerTurn}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teclado Virtual */}
          {!isGameOver && (
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Teclado Virtual</CardTitle>
                <CardDescription className="text-slate-400">
                  Clique nas letras para fazer sua tentativa ou use o botão "Resolver"
                </CardDescription>
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
      </main>
    </div>
  );
}
