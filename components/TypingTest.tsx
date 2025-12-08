import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import useTypingGame from '../hooks/useTypingGame';
import { GameMode, GameStatus } from '../types';
import Results from './Results';
import Character from './Character';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import { useProfile } from '../context/ProfileContext';
import Tooltip from './Tooltip';
import { useLanguage } from '../context/LanguageContext';

interface TypingTestProps {
  onGoBack: () => void;
}

const VIRTUALIZATION_WINDOW = {
  BEFORE: 50, // Characters to render before the cursor
  AFTER: 100, // Characters to render after the cursor
};

const TypingTest: React.FC<TypingTestProps> = ({ onGoBack }) => {
  const { 
    text, 
    typed, 
    status, 
    gameMode,
    quoteSource,
    timeElapsed, 
    wpm, 
    accuracy,
    timeLimit,
    progress,
    handleKeyDown, 
    resetTest,
    togglePause,
  } = useTypingGame();
  const { profile, cycleDifficulty, cycleTimeLimit } = useProfile();
  const { t } = useLanguage();
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const textAreaRef = useRef<HTMLDivElement>(null);
  
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.altKey) {
        e.preventDefault();
        switch (e.key.toLowerCase()) {
            case 'd':
                cycleDifficulty();
                break;
            case 'l':
                cycleTimeLimit();
                break;
        }
        return;
    }

    if (status === GameStatus.Finished && e.key === 'Enter') {
      e.preventDefault();
      onGoBack();
    } else {
      handleKeyDown(e);
    }
  }, [status, onGoBack, handleKeyDown, cycleDifficulty, cycleTimeLimit]);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleGlobalKeyDown]);

  useEffect(() => {
    // This effect ensures the active character smoothly scrolls into view as the user types.
    if (status !== GameStatus.Running) return;

    const activeChar = activeCharRef.current;
    const textArea = textAreaRef.current;

    if (!activeChar || !textArea) return;

    // Use getBoundingClientRect for positions relative to the viewport, which is more robust.
    const { top: charTop } = activeChar.getBoundingClientRect();
    const { top: areaTop, height: areaHeight } = textArea.getBoundingClientRect();

    // Calculate the character's position within the visible portion of the text area.
    const charPositionInArea = charTop - areaTop;

    // Define thresholds to create a "comfort zone" where no scrolling occurs.
    // This prevents distracting scroll adjustments on every keystroke.
    const scrollDownThreshold = areaHeight * 0.6; // Scroll when cursor is in the bottom 40%
    const scrollUpThreshold = areaHeight * 0.1;   // Scroll when cursor is in the top 10%

    // Trigger a scroll only if the character is outside the comfort zone.
    if (charPositionInArea > scrollDownThreshold || charPositionInArea < scrollUpThreshold) {
      // The 'center' block alignment provides a pleasant scrolling experience,
      // keeping the active line roughly in the middle of the text area.
      activeChar.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [typed.length, status]);

  const { visibleCharacters, leadingPlaceholder } = useMemo(() => {
    const currentIndex = typed.length;
    const textLength = text.length;

    const windowStart = Math.max(0, currentIndex - VIRTUALIZATION_WINDOW.BEFORE);
    const windowEnd = Math.min(textLength, currentIndex + VIRTUALIZATION_WINDOW.AFTER);

    const leadingText = text.slice(0, windowStart).replace(/ /g, '\u00A0');
    
    const visibleChars = [];
    for (let i = windowStart; i < windowEnd; i++) {
        const char = text[i];
        const typedChar = typed[i];
        let state: 'correct' | 'incorrect' | 'pending' = 'pending';
        
        if (typedChar === char) {
            state = 'correct';
        } else if (typedChar !== undefined) {
            state = 'incorrect';
        }

        visibleChars.push({
            char,
            state,
            isCurrent: i === currentIndex,
            index: i,
        });
    }

    return {
        leadingPlaceholder: <span className="opacity-0 pointer-events-none">{leadingText}</span>,
        visibleCharacters: visibleChars,
    };
  }, [text, typed]);

  const { currentWordCharacters } = useMemo(() => {
    if (status === GameStatus.Idle || status === GameStatus.Finished) {
      return { currentWordCharacters: [] };
    }

    const currentIndex = typed.length;
    if (currentIndex >= text.length) {
      return { currentWordCharacters: [{char: '\u00A0', state: 'pending', isCurrent: true, index: 'cursor-word'}] };
    }

    const wordStart = text.lastIndexOf(' ', currentIndex - 1) + 1;
    let wordEnd = text.indexOf(' ', wordStart);
    if (wordEnd === -1) {
      wordEnd = text.length;
    }

    const currentWordSlice = text.substring(wordStart, wordEnd);
    if (!currentWordSlice) { 
      return { currentWordCharacters: [] };
    }
    
    const chars = currentWordSlice.split('').map((char, i) => {
      const textIndex = wordStart + i;
      const typedChar = typed[textIndex];
      let state: 'correct' | 'incorrect' | 'pending' = 'pending';

      if (typedChar !== undefined) {
        state = typedChar === char ? 'correct' : 'incorrect';
      }

      return {
        char,
        state,
        isCurrent: textIndex === currentIndex,
        index: textIndex,
      };
    });

    return { currentWordCharacters: chars };
  }, [text, typed, status]);

  const extraTyped = typed.length > text.length ? typed.slice(text.length) : '';

  if (status === GameStatus.Finished) {
    return <Results wpm={wpm} accuracy={accuracy} onRestart={onGoBack} onRetry={resetTest} quoteSource={quoteSource} />;
  }

  return (
    <>
      <div className="relative w-full max-w-4xl mx-auto p-6 md:p-8 bg-[var(--color-bg-secondary)] rounded-xl shadow-2xl shadow-[var(--color-shadow-primary)] animate-fade-in">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <Timer timeElapsed={timeElapsed} timeLimit={timeLimit} />
            {(status === GameStatus.Running || status === GameStatus.Paused) && (
              <div className="flex items-baseline gap-6 font-mono animate-fade-in">
                <div>
                  <span className="text-sm text-[var(--color-text-secondary)] mr-1">WPM</span>
                  <span className="text-2xl text-[var(--color-text-primary)]">{wpm}</span>
                </div>
                <div>
                  <span className="text-sm text-[var(--color-text-secondary)] mr-1">ACC</span>
                  <span className="text-2xl text-[var(--color-text-primary)]">{accuracy}%</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {status !== GameStatus.Idle && (
               <Tooltip text={t(status === GameStatus.Paused ? 'test.tooltipResume' : 'test.tooltipPause')}>
                <button
                  onClick={togglePause}
                  className="px-4 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-bg-interactive)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                  aria-label={t(status === GameStatus.Paused ? 'test.resume' : 'test.pause')}
                >
                  {t(status === GameStatus.Paused ? 'test.resume' : 'test.pause')}
                </button>
              </Tooltip>
            )}
            <Tooltip text={t('test.tooltipRestart')}>
              <button
                onClick={resetTest}
                className="px-4 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-bg-interactive)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              >
                {t('test.reset')}
              </button>
            </Tooltip>
          </div>
        </div>

        {gameMode === GameMode.Time && <ProgressBar progress={progress} />}

        <div 
          ref={textAreaRef} 
          className={`font-mono text-xl md:text-2xl text-[var(--color-text-secondary)] leading-relaxed tracking-wider p-4 bg-black/20 rounded-lg overflow-hidden relative max-h-48 overflow-y-auto`}
        >
          {status === GameStatus.Paused && (
            <div 
              className="absolute inset-0 bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 animate-fade-in cursor-pointer"
              onClick={togglePause}
              role="button"
              aria-label={t('test.resume')}
            >
              <h3 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{t('test.pausedTitle')}</h3>
              <p className="text-[var(--color-text-secondary)]">{t('test.pausedMessage')}</p>
            </div>
          )}
          <p className="select-none break-all">
            {leadingPlaceholder}
            {visibleCharacters.map(({ char, state, isCurrent, index }) => (
              <Character
                key={index}
                char={char}
                state={state}
                isCurrent={isCurrent}
                ref={isCurrent ? activeCharRef : null}
              />
            ))}
            {extraTyped.split('').map((char, index) => (
                <Character
                    key={`extra-${index}`}
                    char={char}
                    state="incorrect"
                    isCurrent={false}
                />
            ))}
            {typed.length > text.length && (
                <Character
                    key="cursor"
                    char={'\u00A0'}
                    state="pending"
                    isCurrent={true}
                    ref={activeCharRef}
                />
            )}
          </p>
          <div className="absolute inset-0 opacity-0 cursor-text" />
        </div>
        
        <div className="mt-4 w-full">
            <div className="font-mono text-3xl md:text-4xl leading-relaxed tracking-wider p-4 bg-black/10 rounded-lg flex items-center justify-center min-h-[4rem] border-t border-[var(--color-bg-tertiary)]">
                <p className="select-none">
                    {currentWordCharacters.map(({ char, state, isCurrent, index }) => (
                        <Character
                            key={index}
                            char={char}
                            state={state}
                            isCurrent={isCurrent}
                        />
                    ))}
                </p>
            </div>
        </div>

        {gameMode === GameMode.Quote && quoteSource && (
            <div className="text-right text-[var(--color-text-secondary)] italic mt-2 mr-2">
                - {quoteSource}
            </div>
        )}

         <div className="text-center mt-6 text-[var(--color-text-secondary)] text-sm">
          {status === GameStatus.Idle && <p>{t('test.startTyping')}</p>}
         </div>
      </div>
    </>
  );
};

export default TypingTest;