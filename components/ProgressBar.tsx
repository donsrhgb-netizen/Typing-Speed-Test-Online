import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-black/20 rounded-full h-2.5 mb-6 overflow-hidden">
      <div
        className="bg-[var(--color-accent-primary)] h-2.5 rounded-full transition-all duration-150 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;