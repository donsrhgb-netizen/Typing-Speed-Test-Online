import React from 'react';

interface VisualKeyboardProps {
  nextChar: string | undefined;
}

const KEY_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  [' '],
];

// Mappings for characters that require the Shift key
const SHIFT_MAP: { [key: string]: string } = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-',
  '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'",
  '<': ',', '>': '.', '?': '/',
};

const VisualKeyboard: React.FC<VisualKeyboardProps> = ({ nextChar }) => {

  const getHighlightClasses = (key: string): string => {
    if (!nextChar) return '';

    const lowerNextChar = nextChar.toLowerCase();
    const isShifted = nextChar !== lowerNextChar && !'abcdefghijklmnopqrstuvwxyz'.includes(lowerNextChar);
    
    // Highlight the character key itself
    if (lowerNextChar === key.toLowerCase()) {
        return 'bg-[var(--color-accent-primary)] text-[var(--color-text-inverted)] scale-110';
    }

    // Highlight the key for a shifted character (e.g., '!' highlights '1')
    if (SHIFT_MAP[nextChar] === key) {
        return 'bg-[var(--color-accent-primary)] text-[var(--color-text-inverted)] scale-110';
    }
    
    // Highlight shift key if needed
    if ((isShifted || (nextChar >= 'A' && nextChar <= 'Z')) && key === 'Shift') {
        return 'bg-[var(--color-accent-primary)] text-[var(--color-text-inverted)] scale-110';
    }

    // Highlight spacebar
    if (nextChar === ' ' && key === ' ') {
        return 'bg-[var(--color-accent-primary)] text-[var(--color-text-inverted)] scale-110';
    }

    return 'bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-interactive)]';
  };
  
  const getKeyDisplay = (key: string) => {
    switch (key) {
      case '`': return '~ `';
      case 'Backspace': return '⌫';
      case 'CapsLock': return 'Caps';
      case 'Enter': return '⏎';
      case 'Shift': return '⇧';
      case ' ': return ''; // Spacebar is visually represented by its size
      default: return key;
    }
  };

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'Backspace': return 'flex-grow-[2]';
      case 'Tab': return 'flex-grow-[1.5]';
      case 'CapsLock': return 'flex-grow-[1.7]';
      case 'Enter': return 'flex-grow-[1.8]';
      case 'Shift': return 'flex-grow-[2.5]';
      case ' ': return 'flex-grow-[8]'; // Spacebar
      default: return 'flex-grow';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-3 bg-[var(--color-bg-secondary)] rounded-lg shadow-inner mt-4">
      <div className="space-y-1 sm:space-y-2">
        {KEY_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-2">
            {row.map((key, keyIndex) => (
              <div
                key={`${rowIndex}-${keyIndex}`}
                className={`h-10 sm:h-12 flex items-center justify-center text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)] rounded-md transition-all duration-150 ease-in-out ${getKeyWidth(key)} ${getHighlightClasses(key)}`}
              >
                {getKeyDisplay(key)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualKeyboard;