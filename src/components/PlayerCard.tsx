
import { Crown, User, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlayerCardProps {
  name: string;
  isHost?: boolean;
  isReady?: boolean;
  isComputer?: boolean;
}

export function PlayerCard({ name, isHost = false, isReady = false, isComputer = false }: PlayerCardProps) {
  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {isComputer ? (
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-white font-medium truncate">{name}</p>
              {isHost && (
                <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant={isReady ? "default" : "secondary"}
                className={isReady ? "bg-green-600 text-white" : "bg-slate-600 text-slate-300"}
              >
                {isComputer ? "CPU" : isReady ? "Pronto" : "Aguardando"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
