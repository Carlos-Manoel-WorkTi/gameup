
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameHeader } from "@/components/GameHeader";
import { useUser } from "@/contexts/UserContext";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { user } = useUser();

  const handleCreateRoom = () => {
    setIsCreating(true);
    // Simulate room creation
    setTimeout(() => {
      const newRoomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
      navigate(`/game/${gameId}/lobby/${newRoomCode}`);
      setIsCreating(false);
    }, 1000);
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/game/${gameId}/lobby/${roomCode.toUpperCase()}`);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GameHeader 
        title="Roda a Roda Jequiti" 
        showBackButton 
        onBack={handleBack}
      />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Bem-vindo, {user?.nickname}!
              </h2>
              <p className="text-slate-400">
                Crie uma nova sala ou entre em uma existente
              </p>
            </div>

            <div className="space-y-6">
              {/* Create Room */}
              <div className="text-center">
                <Button
                  onClick={handleCreateRoom}
                  disabled={isCreating}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
                >
                  {isCreating ? "Criando Sala..." : "Criar Nova Sala"}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800/50 text-slate-400">ou</span>
                </div>
              </div>

              {/* Join Room */}
              <div className="space-y-4">
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
                  className="w-full border-slate-600 text-white hover:bg-slate-700 py-6 text-lg font-semibold"
                >
                  Entrar na Sala
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
