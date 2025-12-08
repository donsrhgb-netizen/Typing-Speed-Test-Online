import React, { useState, useRef, useLayoutEffect } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SettingsSelectorProps {
  options: Option[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
  ariaLabel: string;
}

const SettingsSelector: React.FC<SettingsSelectorProps> = ({ options, selectedValue, onSelect, ariaLabel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [gliderStyle, setGliderStyle] = useState({});

  useLayoutEffect(() => {
    const selectedIndex = options.findIndex(opt => opt.value === selectedValue);
    const selectedButton = buttonRefs.current[selectedIndex];

    if (selectedButton) {
      setGliderStyle({
        width: `${selectedButton.offsetWidth}px`,
        transform: `translateX(${selectedButton.offsetLeft}px)`,
      });
    }
  }, [selectedValue, options]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + options.length) % options.length;
    }

    if (nextIndex !== -1) {
      const nextButton = buttonRefs.current[nextIndex];
      if (nextButton) {
        nextButton.focus();
      }
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-2 p-1 bg-black/20 rounded-lg" role="group" aria-label={ariaLabel}>
      <div 
        className="absolute top-1 bottom-1 left-0 bg-[var(--color-accent-secondary)] rounded-md shadow-lg shadow-[var(--color-shadow-primary)] transition-all duration-300 ease-in-out"
        style={gliderStyle}
        role="presentation"
      />
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={el => { buttonRefs.current[index] = el; }}
          onClick={() => onSelect(option.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`relative z-10 px-3 py-1 text-sm rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-[var(--color-bg-secondary)] focus:ring-[var(--color-accent-primary)] ${
            selectedValue === option.value
              ? 'text-[var(--color-text-inverted)] font-semibold'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
          aria-pressed={selectedValue === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SettingsSelector;