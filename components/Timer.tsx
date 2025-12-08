import React from 'react';

interface TimerProps {
  timeElapsed: number; 
  timeLimit: number; // The time limit for the test in seconds. 0 for count-up modes.
}

const Timer: React.FC<TimerProps> = ({ timeElapsed, timeLimit }) => {
  const isCountUp = timeLimit === 0;
  const displayTime = isCountUp ? timeElapsed : Math.max(0, timeLimit - timeElapsed);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="font-mono text-3xl text-[var(--color-accent-primary)]">
      {formatTime(displayTime)}
    </div>
  );
};

export default Timer;