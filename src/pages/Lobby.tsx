
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Copy, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameHeader } from "@/components/GameHeader";
import { PlayerCard } from "@/components/PlayerCard";
import { useGameSocket } from "@/hooks/useGameSocket";
import { toast } from "@/hooks/use-toast";

export default function Lobby() {
  const { gameId, roomCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { roomState, playerIndex, startGame, leaveRoom } = useGameSocket();
  
  const [copied, setCopied] = useState(false);
  const nickname = location.state?.nickname || '';
  const isHost = location.state?.isHost || false;

  const copyRoomCode = async () => {
    if (roomCode) {
      try {
        await navigator.clipboard.writeText(roomCode);
        setCopied(true);
        toast({
          title: "Código copiado!",
          description: "O código da sala foi copiado para a área de transferência"
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o código",
          variant: "destructive"
        });
      }
    }
  };

  const handleStartGame = () => {
    startGame();
    navigate(`/game/${gameId}/play/${roomCode}`, { 
      state: { nickname, isHost } 
    });
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  const canStartGame = roomState?.players.length === 2;
  const gameName = gameId === 'roda-a-roda' ? 'Roda a Roda Jequiti' : 'Jogo';

  // Simula jogadores para demonstração
  const players = [
    nickname,
    roomState?.players.length === 2 ? roomState.players[1] : ''
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GameHeader 
        title={`${gameName} - Lobby`}
        showBackButton 
        onBack={handleLeaveRoom} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Room Info */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">
                Sala: {roomCode}
              </CardTitle>
              <CardDescription className="text-slate-400 text-center">
                Compartilhe este código com seu adversário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={copyRoomCode}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copiado!' : 'Copiar Código'}
              </Button>
            </CardContent>
          </Card>

          {/* Players */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Jogadores ({roomState?.players.length || 1}/2)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PlayerCard 
                nickname={players[0]} 
                isHost={true}
                isConnected={true}
              />
              <PlayerCard 
                nickname={players[1]} 
                isHost={false}
                isConnected={!!players[1]}
              />
            </CardContent>
          </Card>

          {/* Game Controls */}
          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="pt-6">
              {canStartGame && isHost ? (
                <Button
                  onClick={handleStartGame}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg py-3"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Jogo
                </Button>
              ) : (
                <div className="text-center text-slate-400">
                  {!canStartGame ? (
                    <p>Aguardando segundo jogador...</p>
                  ) : (
                    <p>Aguardando host iniciar o jogo...</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Rules */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Como Jogar</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-2">
              <p>• Dois jogadores se alternam tentando adivinhar uma palavra</p>
              <p>• Acertou a letra? Ela é revelada e você mantém o turno</p>
              <p>• Errou? Passa a vez para o adversário</p>
              <p>• Vence quem completar ou adivinhar a palavra primeiro!</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
