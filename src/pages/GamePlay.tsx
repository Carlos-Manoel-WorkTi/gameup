
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Send, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameHeader } from "@/components/GameHeader";
import { useGameSocket } from "@/hooks/useGameSocket";
import { toast } from "@/hooks/use-toast";

export default function GamePlay() {
  const { gameId, roomCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { roomState, playerIndex, makeGuess, resetGame, leaveRoom } = useGameSocket();
  
  const [guess, setGuess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const nickname = location.state?.nickname || '';
  const isHost = location.state?.isHost || false;
  const gameState = roomState?.gameState;
  
  const isMyTurn = gameState?.currentPlayer === playerIndex;
  const isGameOver = gameState?.winner !== null;
  const winner = gameState?.winner;
  const players = roomState?.players || [nickname, 'Adversário'];

  const handleSubmitGuess = async () => {
    if (!guess.trim() || submitting || !isMyTurn || isGameOver) return;

    setSubmitting(true);
    try {
      makeGuess(guess.trim());
      setGuess("");
      
      if (guess.length === 1) {
        toast({
          title: "Letra enviada!",
          description: `Você tentou a letra: ${guess.toUpperCase()}`
        });
      } else {
        toast({
          title: "Palavra enviada!",
          description: `Você tentou a palavra: ${guess.toUpperCase()}`
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua tentativa",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRematch = () => {
    resetGame();
    navigate(`/game/${gameId}/lobby/${roomCode}`, { 
      state: { nickname, isHost } 
    });
  };

  const handleGoHome = () => {
    leaveRoom();
    navigate('/');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitGuess();
    }
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

  const gameName = gameId === 'roda-a-roda' ? 'Roda a Roda Jequiti' : 'Jogo';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GameHeader 
        title={gameName}
        showBackButton 
        onBack={() => navigate(`/game/${gameId}/lobby/${roomCode}`, { state: { nickname, isHost } })} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Game Over Modal */}
          {isGameOver && (
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 border-purple-500">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-3xl">
                  🎉 {winner === playerIndex ? 'Você Venceu!' : `${players[winner!]} Venceu!`}
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  A palavra era: <strong>{gameState.word}</strong>
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

          {/* Word Display */}
          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="py-8">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-mono font-bold text-white tracking-widest mb-4">
                  {gameState.hiddenWord.split('').join(' ')}
                </div>
                <p className="text-slate-400">Adivinhe a palavra!</p>
              </div>
            </CardContent>
          </Card>

          {/* Game Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Turno Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-medium p-3 rounded-lg ${
                  isMyTurn ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {isMyTurn ? '🟢 Sua vez!' : `⏳ Vez de ${players[gameState.currentPlayer]}`}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-300">
                  <p>Letras corretas: <span className="text-green-400">{gameState.guessedLetters.join(', ') || 'Nenhuma'}</span></p>
                  <p>Letras erradas: <span className="text-red-400">{gameState.wrongLetters.join(', ') || 'Nenhuma'}</span></p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Input Area */}
          {!isGameOver && (
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Sua Tentativa</CardTitle>
                <CardDescription className="text-slate-400">
                  Digite uma letra ou tente adivinhar a palavra completa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={isMyTurn ? "Digite uma letra ou palavra..." : "Aguarde sua vez..."}
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isMyTurn || submitting}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    maxLength={20}
                  />
                  <Button
                    onClick={handleSubmitGuess}
                    disabled={!guess.trim() || !isMyTurn || submitting}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
