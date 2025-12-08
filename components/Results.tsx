import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ResultsProps {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
  onRetry: () => void;
  quoteSource?: string;
}

const Results: React.FC<ResultsProps> = ({ wpm, accuracy, onRestart, onRetry, quoteSource }) => {
  const { t } = useLanguage();
  const promptText = t('results.changeSettingsPrompt');
  const enterKey = `<kbd class="font-sans px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Enter</kbd>`;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-[var(--color-bg-secondary)] rounded-xl shadow-2xl shadow-[var(--color-shadow-primary)] text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{t('results.title')}</h2>
      <p className="text-[var(--color-text-secondary)] mb-8">{t('results.subtitle')}</p>
      
      {quoteSource && (
        <blockquote className="mb-8">
            <p className="text-xl italic text-[var(--color-text-secondary)]">"{t('results.quoteBy')} {quoteSource}"</p>
        </blockquote>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 bg-black/20 rounded-lg">
          <p className="text-lg text-[var(--color-text-secondary)] mb-2">{t('results.wpm')}</p>
          <p className="text-6xl font-bold text-[var(--color-accent-primary)]">{wpm}</p>
        </div>
        <div className="p-6 bg-black/20 rounded-lg">
          <p className="text-lg text-[var(--color-text-secondary)] mb-2">{t('results.accuracy')}</p>
          <p className="text-6xl font-bold text-[var(--color-accent-primary)]">{accuracy}%</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] font-bold text-lg rounded-md hover:bg-[var(--color-bg-interactive)] transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)] w-full sm:w-auto"
        >
          {t('results.retry')}
        </button>
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-[var(--color-accent-secondary)] text-[var(--color-text-inverted)] font-bold text-lg rounded-md hover:bg-[var(--color-accent-primary)] transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)] w-full sm:w-auto"
        >
          {t('results.tryAgain')}
        </button>
      </div>
      <p 
        className="mt-4 text-[var(--color-text-tertiary)] text-sm"
        dangerouslySetInnerHTML={{ __html: promptText.replace('<1>Enter</1>', enterKey) }}
      />
    </div>
  );
};

export default Results;