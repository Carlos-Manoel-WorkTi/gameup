
import { User, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PlayerCardProps {
  nickname: string;
  isHost?: boolean;
  isConnected?: boolean;
}

export function PlayerCard({ nickname, isHost = false, isConnected = true }: PlayerCardProps) {
  return (
    <Card className={`bg-slate-800 border-slate-600 ${isConnected ? 'opacity-100' : 'opacity-50'}`}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isConnected ? 'bg-green-600' : 'bg-slate-600'
        }`}>
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{nickname || "Aguardando..."}</span>
            {isHost && <Crown className="w-4 h-4 text-yellow-500" />}
          </div>
          <p className="text-sm text-slate-400">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
