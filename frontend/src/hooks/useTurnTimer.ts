import { useEffect, useState, useRef } from "react";

interface UseTurnTimerProps {
  currentPlayer: number;
  activePlayer: number;
  duration?: number; // tempo em segundos
  onTimeout?: () => void;
}

export function useTurnTimer({
  currentPlayer,
  activePlayer,
  duration = 10,
  onTimeout
}: UseTurnTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentPlayer !== activePlayer) {
      setTimeLeft(duration);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPlayer, activePlayer, duration, onTimeout]);

  return timeLeft;
}
