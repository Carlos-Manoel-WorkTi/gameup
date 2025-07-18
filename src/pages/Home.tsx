
import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { GameCard } from "@/components/GameCard";
import { ProfileGuard } from "@/components/ProfileGuard";
import { ProfileDialog } from "@/components/ProfileDialog";
import { useUser } from "@/contexts/UserContext";

const GAMES = [
  {
    id: 'roda-a-roda',
    name: 'Roda a Roda Jequiti',
    description: 'Adivinhe a palavra antes do seu adversário! Versão brasileira do famoso Wheel of Fortune.',
    thumbnail: 'photo-1518709268805-4e9042af2176'
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const navigate = useNavigate();
  const { hasProfile } = useUser();

  const filteredGames = GAMES.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayGame = (gameId: string) => {
    if (!hasProfile) {
      setShowCreateProfile(true);
      return;
    }
    navigate(`/game/${gameId}/join`);
  };

  return (
    <ProfileGuard>
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Mini-Games
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Multiplayer</span>
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Desafie seus amigos em jogos rápidos e divertidos. Sem cadastro, sem complicação!
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar jogos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              name={game.name}
              description={game.description}
              thumbnail={game.thumbnail}
              onPlay={() => handlePlayGame(game.id)}
            />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center text-slate-400 mt-12">
            <p>Nenhum jogo encontrado com "{searchTerm}"</p>
          </div>
        )}
      </main>

      <ProfileDialog 
        open={showCreateProfile} 
        onOpenChange={setShowCreateProfile}
      />
    </ProfileGuard>
  );
}
