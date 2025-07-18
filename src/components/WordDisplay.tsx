
interface WordDisplayProps {
  words: string[];
  revealedLetters: string[];
}

export function WordDisplay({ words, revealedLetters }: WordDisplayProps) {
  const renderWord = (word: string, wordIndex: number) => {
    return word.split('').map((letter, letterIndex) => {
      const isRevealed = revealedLetters.includes(letter.toUpperCase());
      return (
        <div
          key={`${wordIndex}-${letterIndex}`}
          className="w-12 h-12 md:w-16 md:h-16 border-2 border-slate-600 bg-slate-800 flex items-center justify-center rounded-lg"
        >
          <span className="text-xl md:text-2xl font-bold text-white">
            {isRevealed ? letter.toUpperCase() : '_'}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {words.map((word, index) => (
        <div key={index} className="flex gap-2">
          {renderWord(word, index)}
        </div>
      ))}
    </div>
  );
}
