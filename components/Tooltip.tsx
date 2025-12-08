import React, { ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group flex items-center">
      {children}
      <div
        className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-xs font-semibold rounded-md shadow-lg z-20 transition-all duration-200 transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 pointer-events-none origin-bottom"
        role="tooltip"
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
