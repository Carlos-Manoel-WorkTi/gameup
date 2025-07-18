
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function GameHeader({ title, showBackButton = false, onBack }: GameHeaderProps) {
  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        )}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
    </header>
  );
}
