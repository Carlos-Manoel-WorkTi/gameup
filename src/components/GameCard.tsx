
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GameCardProps {
  name: string;
  description: string;
  thumbnail: string;
  onPlay: () => void;
}

export function GameCard({ name, description, thumbnail, onPlay }: GameCardProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group">
      <CardHeader className="pb-3">
        <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-purple-600 to-blue-600">
          <img 
            src={`https://images.unsplash.com/${thumbnail}?w=400&h=225&fit=crop`}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardTitle className="text-white text-xl font-bold">{name}</CardTitle>
        <CardDescription className="text-slate-400 text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onPlay}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          Jogar Agora
        </Button>
      </CardContent>
    </Card>
  );
}
