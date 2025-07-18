
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, Plus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameHeader } from "@/components/GameHeader";
import { useGameSocket } from "@/hooks/useGameSocket";
import { toast } from "@/hooks/use-toast";

export default function JoinRoom() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { createRoom, joinRoom } = useGameSocket();
  
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (!nickname.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite seu nickname para criar uma sala",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const code = createRoom(nickname.trim());
      navigate(`/game/${gameId}/lobby/${code}`, { 
        state: { nickname: nickname.trim(), isHost: true } 
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a sala",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!nickname.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite seu nickname para entrar na sala",
        variant: "destructive"
      });
      return;
    }

    if (!roomCode.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Digite o código da sala",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = joinRoom(roomCode.trim().toUpperCase(), nickname.trim());
      if (success) {
        navigate(`/game/${gameId}/lobby/${roomCode.trim().toUpperCase()}`, { 
          state: { nickname: nickname.trim(), isHost: false } 
        });
      } else {
        toast({
          title: "Sala não encontrada",
          description: "Verifique o código e tente novamente",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível entrar na sala",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const gameName = gameId === 'roda-a-roda' ? 'Roda a Roda Jequiti' : 'Jogo';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GameHeader 
        title={gameName}
        showBackButton 
        onBack={() => navigate('/')} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Nickname Input */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Seu Nickname
              </CardTitle>
              <CardDescription className="text-slate-400">
                Como você gostaria de ser chamado?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Digite seu nickname..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                maxLength={20}
              />
            </CardContent>
          </Card>

          {/* Create Room */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Criar Nova Sala
              </CardTitle>
              <CardDescription className="text-slate-400">
                Crie uma sala e convide um amigo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleCreateRoom}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Sala
              </Button>
            </CardContent>
          </Card>

          {/* Join Room */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Entrar em Sala
              </CardTitle>
              <CardDescription className="text-slate-400">
                Digite o código da sala que você recebeu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Código da sala (6 caracteres)"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                maxLength={6}
              />
              <Button
                onClick={handleJoinRoom}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar na Sala
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
