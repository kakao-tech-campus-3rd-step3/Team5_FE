import { useEffect, useRef, useState } from 'react';

interface useTimerProps {
  userDefinedTime: number;
  isActive: boolean;
  onAnswerDone: () => void;
}

const useTimer = ({ userDefinedTime: initialSeconds, isActive, onAnswerDone }: useTimerProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const targetTime = Date.now() + remainingSeconds * 1000;

    intervalRef.current = setInterval(() => {
      const newRemainingTime = Math.round((targetTime - Date.now()) / 1000);

      if (newRemainingTime <= 0) {
        setRemainingSeconds(0);
        onAnswerDone();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        setRemainingSeconds(newRemainingTime);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const min = Math.floor(remainingSeconds / 60);
  const sec = remainingSeconds % 60;

  return { min, sec };
};

export default useTimer;
