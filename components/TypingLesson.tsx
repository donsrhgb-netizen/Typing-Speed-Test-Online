import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { Lesson } from '../types';
import useLesson from '../hooks/useLesson';
import Character from './Character';
import { useLanguage } from '../context/LanguageContext';
import ProgressBar from './ProgressBar';

interface TypingLessonProps {
  lesson: Lesson;
  onGoBack: () => void;
  onNextLesson: () => void;
  hasNextLesson: boolean;
  nextLessonTitleKey: string | null;
}

const TypingLesson: React.FC<TypingLessonProps> = ({ lesson, onGoBack, onNextLesson, hasNextLesson, nextLessonTitleKey }) => {
  const { typed, accuracy, isComplete, handleKeyDown, resetLesson, progress } = useLesson(lesson.text);
  const { t } = useLanguage();
  const activeCharRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Reset lesson state when the lesson prop changes
    resetLesson();
  }, [lesson, resetLesson]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const characters = useMemo(() => {
    return lesson.text.split('').map((char, index) => {
      const typedChar = typed[index];
      let state: 'correct' | 'incorrect' | 'pending' = 'pending';
      if (typedChar === char) {
        state = 'correct';
      } else if (typedChar !== undefined) {
        state = 'incorrect';
      }
      return { char, state };
    });
  }, [lesson.text, typed]);

  if (isComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-[var(--color-bg-secondary)] rounded-xl shadow-2xl shadow-[var(--color-shadow-primary)] text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{t('lesson.complete')}</h2>
        <div className="p-6 bg-black/20 rounded-lg my-8">
          <p className="text-lg text-[var(--color-text-secondary)] mb-2">{t('lesson.accuracy')}</p>
          <p className={`text-6xl font-bold ${accuracy > 95 ? 'text-[var(--color-correct)]' : 'text-[var(--color-accent-primary)]'}`}>
            {accuracy}%
          </p>
        </div>
        {hasNextLesson && nextLessonTitleKey && (
          <div className="mb-8 p-4 bg-black/20 rounded-lg animate-fade-in">
            <p className="text-sm text-[var(--color-text-secondary)]">{t('lesson.upNext')}</p>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">{t(nextLessonTitleKey)}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={resetLesson}
            className="px-8 py-3 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] font-bold text-lg rounded-md hover:bg-[var(--color-bg-interactive)] transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)] w-full sm:w-auto"
          >
            {t('lesson.retry')}
          </button>
          <button
            onClick={onNextLesson}
            className="px-8 py-3 bg-[var(--color-accent-secondary)] text-[var(--color-text-inverted)] font-bold text-lg rounded-md hover:bg-[var(--color-accent-primary)] transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)] w-full sm:w-auto"
          >
            {t(hasNextLesson ? 'lesson.nextLesson' : 'lesson.backToLessons')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="relative p-6 md:p-8 bg-[var(--color-bg-secondary)] rounded-xl shadow-2xl shadow-[var(--color-shadow-primary)]">
         <button
            onClick={onGoBack}
            aria-label="Go back to lessons"
            className="absolute top-6 left-6 flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] focus:ring-[var(--color-accent-primary)] rounded-lg px-3 py-1 text-sm z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('main.back')}
          </button>
        <div className="flex justify-end items-center mb-6">
            <div className="text-right">
                <p className="text-sm text-[var(--color-text-secondary)]">{t('lesson.accuracy')}</p>
                <p className="font-mono text-3xl text-[var(--color-accent-primary)]">{accuracy}%</p>
            </div>
        </div>
        <ProgressBar progress={progress} />
        <div className="font-mono text-3xl md:text-4xl text-center leading-relaxed tracking-widest p-8 bg-black/20 rounded-lg relative">
          <p className="select-none break-all">
            {characters.map(({ char, state }, index) => (
              <Character
                key={index}
                char={char === ' ' ? '\u00A0' : char} // Render space as non-breaking space
                state={state}
                isCurrent={index === typed.length}
                ref={index === typed.length ? activeCharRef : null}
                lessonContext={true}
              />
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypingLesson;
