
interface VirtualKeyboardProps {
  onLetterClick: (letter: string) => void;
  usedLetters: string[];
  disabled?: boolean;
}

export function VirtualKeyboard({ onLetterClick, usedLetters, disabled }: VirtualKeyboardProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleLetterClick = (letter: string) => {
    if (disabled || usedLetters.includes(letter)) return;
    onLetterClick(letter);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-7 md:grid-cols-9 gap-2">
        {alphabet.map((letter) => {
          const isUsed = usedLetters.includes(letter);
          const isDisabled = disabled || isUsed;
          
          return (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              disabled={isDisabled}
              className={`
                w-10 h-10 md:w-12 md:h-12 rounded-lg font-bold text-sm md:text-base
                transition-all duration-200
                ${isDisabled 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:scale-105 active:scale-95'
                }
              `}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
