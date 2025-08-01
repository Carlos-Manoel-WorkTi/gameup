
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameHeader } from "@/components/GameHeader";
import { useUser } from "@/contexts/UserContext";
import { User, Users } from "lucide-react";
import BackgroundWrapper from "../components/BackgroundWrapper";


export default function JoinRoom() {



  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { user } = useUser();

  const handleCreateRoom = (isSolo: boolean = false) => {
    setIsCreating(true);
    // Simulate room creation
    setTimeout(() => {
      const newRoomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
      navigate(`/game/${gameId}/lobby/${newRoomCode}`, { 
        state: { nickname: user?.nickname, isHost: true, isSolo } 
      });
      setIsCreating(false);
    }, 1000);
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/game/${gameId}/lobby/${roomCode.toUpperCase()}`, { 
        state: { nickname: user?.nickname, isHost: false } 
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
     <BackgroundWrapper imageUrl="/adivinha_a_palavra/bg1.png">
      <div className="">
        <GameHeader 
          title="Adivinha a Palavra" 
          showBackButton 
          onBack={handleBack}
          minimal
        />
        
        <main className="container mx-auto px-4 py-1">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 bg-s">
                Escolha como você quer jogar, {user?.nickname}!
              </h2>
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Solo Mode */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-purple-500 transition-all">
                <CardHeader className="text-center">
                  <User className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <CardTitle className="text-white text-xl">Modo Solo</CardTitle>
                  <p className="text-slate-400 text-sm">Jogue contra o computador</p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleCreateRoom(true)}
                    disabled={isCreating}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
                  >
                    {isCreating ? "Iniciando..." : "Jogar Solo"}
                  </Button>
                </CardContent>
              </Card>

              {/* Multiplayer Mode */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all">
                <CardHeader className="text-center">
                  <Users className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <CardTitle className="text-white text-xl">Multiplayer</CardTitle>
                  <p className="text-slate-400 text-sm">Jogue com amigos online</p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleCreateRoom(false)}
                    disabled={isCreating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                  >
                    {isCreating ? "Criando Sala..." : "Criar Sala"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Join Existing Room */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Entrar em Sala Existente</CardTitle>
                <p className="text-slate-400 text-sm">Digite o código da sala para participar</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="text"
                  placeholder="Código da Sala (6 caracteres)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="bg-slate-700 border-slate-600 text-white text-center text-lg tracking-widest placeholder-slate-400 focus:border-purple-500"
                />
                <Button
                  onClick={handleJoinRoom}
                  disabled={roomCode.length !== 6}
                  variant="outline"
                  className="w-full border-slate-600  hover:bg-slate-700 py-6 text-lg font-semibold"
                >
                  Entrar na Sala
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </BackgroundWrapper>
  );
}
