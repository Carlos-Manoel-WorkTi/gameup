import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Copy, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameHeader } from "@/components/GameHeader";
import { PlayerCard } from "@/components/PlayerCard";
import { useGameSocket } from "@/hooks/useGameSocket";
import { toast } from "@/hooks/use-toast";
import { getOrCreatePlayerId } from "@/utils/utils";

export default function Lobby() {
  const [isReady, setReady] = useState(false);
  const { gameId, roomCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const nickname = location.state?.nickname || '';
  const isHost = location.state?.isHost || false;
  const isSolo = location.state?.isSolo || false;

  useEffect(() => {
      if (roomState && setPlayerReady) {
    setPlayerReady(isReady); // passa o valor booleano
    
  }
  }, [isReady]);
  

  const player = {
    id: getOrCreatePlayerId(), // Cada jogador tem um ID único
    name: nickname
  };

  
  const {
    roomState,
    startGame,
    leaveRoom,
    playerIndex,
    setPlayerReady,
    isCurrentHost,
    allReady
  } = useGameSocket({
    roomId: roomCode!,
    player,
    isSolo
  });

   // Captura o botão "voltar" do navegador
  useEffect(() => {
    const handlePopState = () => {
      leaveRoom();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [leaveRoom]);

  // (Opcional) Captura fechar/atualizar aba
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      leaveRoom();
      // sem mensagem customizada, só garante o emit
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [leaveRoom]);
  

  const players = roomState?.players || [];
  const [copied, setCopied] = useState(false);

  const copyRoomCode = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "O código da sala foi copiado para a área de transferência."
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartGame = () => {
    startGame();
    navigate(`/game/${gameId}/play/${roomCode}`, { 
      state: { nickname, isHost, isSolo } 
    });
  };

  const handleBack = () => {
    leaveRoom(); // Opcional: remove da sala ao voltar
    navigate(-1);   
  };

  
 const canStart = isCurrentHost && (isSolo || (allReady && players.length === 2));


  if (!roomState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Carregando sala...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GameHeader 
        title="Advinha a palavra" 
        showBackButton 
        onBack={handleBack} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Room Info */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">
                {isSolo ? 'Modo Solo' : 'Sala de Espera'}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {isSolo ? 'Você vs Computador' : `Código da Sala: ${roomCode}`}
              </CardDescription>
              {!isSolo && (
                <Button
                  variant="outline"
                  onClick={copyRoomCode}
                  className="mx-auto mt-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copiado!" : "Copiar Código"}
                </Button>
              )}
            </CardHeader>
          </Card>

          {/* Players */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Jogadores ({players.length}/2)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {players.map((p, index) => (
                  <PlayerCard
                    key={index}
                    name={p.name}
                    isHost={index === 0}
                    isReady={index === 0 ? true : roomState && roomState.readyStatus && roomState.readyStatus[p.id]}
                    isComputer={isSolo && index === 1}

                  />
                ))}

                {!isSolo && players.length < 2 && (
                  <Card className="bg-slate-700/50 border-slate-600 border-dashed">
                    <CardContent className="flex items-center justify-center h-20">
                      <p className="text-slate-400">Aguardando jogador...</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Game Controls */}
          {isCurrentHost ? (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-slate-400">
                    {canStart 
                      ? (isSolo ? "Pronto para começar!" : "Todos os jogadores estão prontos!")
                      : "Aguardando mais jogadores..."
                    }
                  </p>
                  <Button
                    onClick={handleStartGame}
                    disabled={!canStart}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Iniciar Jogo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-slate-400">
                    Aguardando o host iniciar o jogo...
                  </p>
                  <Button
                    onClick={() => setReady((prev) => !prev)}
                    className={`${
                      isReady
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white font-semibold px-8 py-3 text-lg`}
                  >
                    {isReady ? "Cancelar Pronto" : "Estou Pronto"}
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
