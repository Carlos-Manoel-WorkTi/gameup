import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  title: string;
  showBackButton?: boolean;
  minimal?: boolean;
  onBack?: () => void;
}

export function GameHeader({ title, showBackButton = false, onBack, minimal=false }: GameHeaderProps) {
  if (minimal) {
    return (
      <header className="bg-transparent border-none sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-slate-400 hover:text-white bg-slate-800/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          )}
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wide leading-tight">
          <span className="text-transparent bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text drop-shadow-sm">
            {title}
          </span>
      
        </h2>
        </div>
      </header>
    );
  }
  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-4 text-slate-400 hover:text-white "
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        )}

        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wide leading-tight">
          <span className="text-transparent bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text drop-shadow-sm">
            TEMA:
          </span>{" "}
          <span className="text-gray-100 break-words">{title}</span>
        </h1>
      </div>
    </header>
  );
}
