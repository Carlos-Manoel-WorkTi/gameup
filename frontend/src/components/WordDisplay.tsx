import clsx from "clsx";
import { useEffect, useState } from "react";

const WordDisplay = ({
  words,
  revealedLetters,
  maxLetters = 8,
}: {
  words: string[];
  revealedLetters: string[];
  maxLetters?: number;
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
  }, [highlighted, revealedLetters]);

  return (
    <div className="space-y-3 px-1 sm:px-4">
      {words.map((word, wordIndex) => (
        <div
          key={wordIndex}
          className="grid grid-cols-8 gap-1 w-full max-w-full"
        >
          {Array.from({ length: maxLetters }).map((_, i) => {
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

export default WordDisplay;