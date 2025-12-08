import React, { forwardRef, useState, useEffect, useRef } from 'react';

// Custom hook to get the previous value of a prop or state.
function usePrevious<T>(value: T): T | undefined {
  // FIX: `useRef` requires an initial value. Initialize with `undefined` as the hook is designed to return it on the first render.
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface CharacterProps {
  char: string;
  state: 'correct' | 'incorrect' | 'pending';
  isCurrent: boolean;
  lessonContext?: boolean;
}

const Character = forwardRef<HTMLSpanElement, CharacterProps>(({ char, state, isCurrent, lessonContext }, ref) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevState = usePrevious(state);

  // This effect adds a brief "pop" animation when a character is first typed (i.e., its state changes from 'pending').
  useEffect(() => {
    if (prevState === 'pending' && (state === 'correct' || state === 'incorrect')) {
      setIsAnimating(true);
      // Remove the animation class after it completes to allow it to be re-triggered.
      const animationTimeout = setTimeout(() => {
        setIsAnimating(false);
      }, 200); // Duration must match the CSS animation duration.

      return () => clearTimeout(animationTimeout);
    }
  }, [state, prevState]);
  
  const getClassName = () => {
    if (state === 'correct') {
      return lessonContext 
        ? 'text-[var(--color-correct)] bg-[var(--color-correct-bg)] rounded-sm' 
        : 'text-[var(--color-correct)]';
    }
    if (state === 'incorrect') return 'text-[var(--color-error)] bg-[var(--color-error-bg)] rounded-sm animate-shake';
    return 'text-[var(--color-text-secondary)]';
  };

  // A static underline provides a clear, non-distracting visual indicator for the active character.
  const cursorClass = isCurrent ? 'underline decoration-[var(--color-accent-primary)] decoration-2 underline-offset-4' : '';
  const animationClass = isAnimating ? 'animate-key-pop' : '';

  // Enhanced ARIA label for clearer screen reader announcements about the character's state.
  const getAriaLabel = () => {
    const charName = char === ' ' ? 'space' : char;
    if (isCurrent) return `Current character: ${charName}`;
    if (state !== 'pending') return `${charName}, ${state}`;
    return charName;
  };

  const ariaInvalid = state === 'incorrect' ? 'true' : undefined;
  const ariaCurrent = isCurrent ? 'true' : undefined;

  return (
    <span
      ref={ref}
      className={`transition-colors duration-150 ease-in-out ${getClassName()} ${cursorClass} ${animationClass}`}
      aria-label={getAriaLabel()}
      aria-invalid={ariaInvalid}
      aria-current={ariaCurrent}
    >
      {char}
    </span>
  );
});
Character.displayName = 'Character';

export default React.memo(Character);