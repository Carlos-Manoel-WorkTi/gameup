import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RotateCcw, Home, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { SolveGameDialog } from "@/components/SolveGameDialog";
import { useGameSocket } from "@/hooks/useGameSocket";
import { toast } from "@/hooks/use-toast";
import { useGameStore } from "../stores/useGameStore";
import { clsx } from "clsx";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { ActionButtons } from "../components/ui/ActionButtons";

const MAX_LETTERS = 8;

const WordDisplay = ({
  words,
  revealedLetters
}: {
  words: string[];
  revealedLetters: string[];
}) => {
  const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newHits = revealedLetters.filter((l) => !highlighted[l]);
    if (newHits.length > 0) {
      const newHighlighted = { ...highlighted };
      newHits.forEach((letter) => {
        newHighlighted[letter] = true;
        setTimeout(() => {
          setHighlighted((prev) => ({ ...prev, [letter]: false }));
        }, 3000);
      });
      setHighlighted(newHighlighted);
    }
  }, [revealedLetters]);

  return (
    <div className="space-y-3 px-1 sm:px-4">
      {words.map((word, wordIndex) => (
        <div
          key={wordIndex}
          className="grid grid-cols-8 gap-1 w-full max-w-full"
        >
          {Array.from({ length: MAX_LETTERS }).map((_, i) => {
            const letter = word[i] ?? "";
            const isFilled = i < word.length;
            const upperLetter = letter.toUpperCase();
            const isRevealed = isFilled && revealedLetters.includes(upperLetter);
            const isHighlighted = isFilled && highlighted[upperLetter];

            return (
              <div
                key={i}
                className={clsx(
                  "aspect-square w-full h-auto flex items-center justify-center text-2xl font-bold border border-white/20 transition-all duration-300",
                  {
                    "bg-[#3f8bec] text-white": isRevealed && !isHighlighted,
                    "bg-green-600 text-white animate-pulse": isHighlighted,
                    "bg-slate-800 text-slate-500": isFilled && !isRevealed,
                    "bg-slate-700 opacity-10": !isFilled
                  }
                )}
              >
                {isRevealed ? upperLetter : isFilled ? "_" : ""}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default function GamePlay() {
  const { gameId, roomCode } = useParams();
  const navigate = useNavigate();

  const { player, roomState } = useGameStore();
  const nickname = player?.name ?? "Jogador";
  const isSolo = roomState?.totalPlayers === 1;
  console.log("GamePlay - roomState:", roomState);
  
  
  const {
    playerIndex,
    makeGuess,
    solveGame,
    resetGame,
    leaveRoom
  } = useGameSocket({
    roomId: roomCode!,
    player: player ?? { id: "", name: nickname },
    isSolo
  });

  const gameState = roomState?.gameState;
  let players = roomState?.players || [];

  
  if (isSolo && players.length === 1) {
    players = [
      ...players,
      {
        id: "bot",
        name: "🤖 Bot",
        isBot: true,
      }
    ];
  }


  const isMyTurn = gameState?.currentPlayer === playerIndex;
  const isGameOver = gameState?.winner !== null;
  const winner = gameState?.winner;
  const currentPlayerName = players[gameState?.currentPlayer ?? 0]?.name || "Jogador";
  const isComputerTurn = isSolo && gameState?.currentPlayer === 1;

  const handleLetterClick = (letter: string) => {
    if (!isMyTurn || isGameOver) return;

    makeGuess(letter);

    const letterExists = gameState?.words.some(word =>
      word.includes(letter.toUpperCase())
    );

    toast({
      title: letterExists ? "Acertou!" : "Errou!",
      description: letterExists
        ? `A letra ${letter} existe nas palavras!`
        : `A letra ${letter} não existe. Turno passa para o adversário.`
    });
  };

  const handleSolveGame = (guessedWords: string[]) => {
    const success = solveGame(guessedWords);

    toast({
      title: success ? "Parabéns!" : "Resposta incorreta!",
      description: success
        ? "Você resolveu o jogo e venceu!"
        : "Uma ou mais palavras estão erradas. Turno passa para o adversário.",
      variant: success ? "default" : "destructive"
    });

    return success;
  };

  const handleRematch = () => {
    resetGame();
    navigate(`/game/${gameId}/lobby/${roomCode}`);
  };

  const handleGoHome = () => {
    leaveRoom();
    navigate("/");
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Carregando jogo...</p>
      </div>
    );
  }

  const gameName = "COMIDAS";

  return (
     <BackgroundWrapper imageUrl="/adivinha_a_palavra/bg2.png">
    <div className="min-h-screen">
      <main className="container mx-auto px-0 sm:px-4 py-0 rounded-none">
        <div className="max-w-4xl mx-auto space-y-6">

          {isGameOver && (
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 border-purple-500">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-3xl">
                  🎉 {winner === playerIndex ? "Você Venceu!" : `${players[winner!]?.name || 'Adversário'} Venceu!`}
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  As palavras eram: <strong>{gameState.words.join(" - ")}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 justify-center">
                <Button onClick={handleRematch} className="bg-green-600 hover:bg-green-700 text-white">
                  <RotateCcw className="w-4 h-4 mr-2" /> Revanche
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="border-slate-400 text-slate-300 hover:bg-slate-700">
                  <Home className="w-4 h-4 mr-2" /> Sair
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-[rgba(0,0,0,0.53)] border-slate-600 rounded-none p-0">
            <CardContent className="py-6">
              <WordDisplay
                words={gameState.words}
                revealedLetters={gameState.revealedLetters}
              />
              <h2 className="mt-6 text-center text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
                <span className="text-[rgb(156,81,225)]">TEMA:</span>{" "}
                <span className="text-gray-400">{gameName}</span>
              </h2>
            </CardContent>
          
          </Card>
          <div className="flex items-center justify-center gap-10 bg-[rgb(13,31,61,0.91)]
 h-[80px] " style={{margin: '0 auto'}}>
            {players[0] && (
              <div
                className={clsx(
                  "relative w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all",
                  gameState.currentPlayer === 0 ? "border-green-500" : "border-slate-500 opacity-50"
                )}
              >
                {players[0].isBot ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            )}

            <span className="text-white font-bold text-xl">vs</span>

            {players[1] && (
              <div
                className={clsx(
                  "relative w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all",
                  gameState.currentPlayer === 1 ? "border-green-500" : "border-slate-500 opacity-50"
                )}
              >
                {players[1].isBot ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>



          {!isGameOver && (
            <Card className="bg-[rgb(13,31,61,0.91)] border-none rounded-none" style={{ margin: '0 auto' }}>
              <CardHeader>
                <CardTitle className="text-white">Tente acertar a palavra</CardTitle>
                {/* <CardDescription className="text-slate-400">
                  Clique nas letras para fazer sua tentativa ou use o botão "Resolver"
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                <VirtualKeyboard
                  onLetterClick={handleLetterClick}
                  usedLetters={gameState.usedLetters}
                  disabled={!isMyTurn || isComputerTurn}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <ActionButtons
          onSolve={() => {
            // abrir dialog de resolução
          }}
          onGiveUp={() => {
            leaveRoom();
            navigate("/");
          }}
        />

      </main>
    </div>
    </BackgroundWrapper>
  );
}
