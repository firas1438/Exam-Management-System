"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  date_debut: string;
}

const Countdown = ({ date_debut }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const startDate = new Date(date_debut);
      const timeDifference = startDate.getTime() - now.getTime();

      if (timeDifference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(timeDifference / (1000 * 3600 * 24)),
        hours: Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600)),
        minutes: Math.floor((timeDifference % (1000 * 3600)) / (1000 * 60)),
        seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Set up interval for updates
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [date_debut]);

  if (timeLeft === null) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col py-1 pr-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-xl">
          <span
            style={{ "--value": timeLeft.days } as React.CSSProperties}
            aria-live="polite"
            aria-label="jours"
          >
            {timeLeft.days}
          </span>
        </span>
        <h1 className="text-xs">jours</h1>
      </div>
      <div className="flex flex-col py-1 pr-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-xl">
          <span
            style={{ "--value": timeLeft.hours } as React.CSSProperties}
            aria-live="polite"
            aria-label="heures"
          >
            {timeLeft.hours}
          </span>
        </span>
        <h1 className="text-xs">heures</h1>
      </div>
      <div className="flex flex-col py-1 pr-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-xl">
          <span
            style={{ "--value": timeLeft.minutes } as React.CSSProperties}
            aria-live="polite"
            aria-label="minutes"
          >
            {timeLeft.minutes}
          </span>
        </span>
        <h1 className="text-xs">mins</h1>
      </div>
      <div className="flex flex-col py-1 pr-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-lg">
          <span
            style={{ "--value": timeLeft.seconds } as React.CSSProperties}
            aria-live="polite"
            aria-label="secondes"
          >
            {timeLeft.seconds}
          </span>
        </span>
        <h1 className="text-xs">secs</h1>
      </div>
    </div>
  );
};

export default Countdown;