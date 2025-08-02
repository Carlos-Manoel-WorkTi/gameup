import { clsx } from "clsx";

interface TimerDisplayProps {
  timeLeft: number;
  isActive: boolean;
}

export function TimerDisplay({ timeLeft, isActive }: TimerDisplayProps) {
  return (
    <span
     className={clsx(
        "flex items-center justify-center font-bold",
        "w-16 h-16 text-3xl", // tamanho do timer (número e box)
        isActive ? "text-green-400" : "text-slate-500"
      )}
    >
      {isActive ? timeLeft : "--"}
    </span>
  );
}
