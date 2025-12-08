import React, { useState, useMemo } from 'react';
import { lessons as lessonData } from '../utils/lessons';
import { Lesson } from '../types';
import TypingLesson from './TypingLesson';
import { useLanguage } from '../context/LanguageContext';

interface LessonCardProps {
  title: string;
  description: string;
  onStart: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ title, description, onStart }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-lg hover:shadow-[var(--color-shadow-primary)] transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">{title}</h3>
        <p className="text-[var(--color-text-secondary)]">{description}</p>
      </div>
      <button
        onClick={onStart}
        className="mt-6 px-6 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] font-semibold rounded-md hover:bg-[var(--color-bg-interactive)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        {t('lessons.startLesson')}
      </button>
    </div>
  );
};

const LessonsPage: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const filteredLessons = useMemo(() => {
    if (!searchQuery) {
      return lessonData;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return lessonData.filter(
      (lesson) =>
        t(lesson.titleKey).toLowerCase().includes(lowercasedQuery) ||
        t(lesson.descriptionKey).toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, t]);

  const activeLessonIndex = useMemo(() => {
    if (!activeLesson) return -1;
    return lessonData.findIndex((l) => l.id === activeLesson.id);
  }, [activeLesson]);

  const nextLesson = useMemo(() => {
    if (activeLessonIndex !== -1 && activeLessonIndex < lessonData.length - 1) {
      return lessonData[activeLessonIndex + 1];
    }
    return null;
  }, [activeLessonIndex]);

  const handleNextLesson = () => {
    if (nextLesson) {
      setActiveLesson(nextLesson);
    } else {
      setActiveLesson(null); // Go back to lesson list if it's the last one
    }
  };

  if (activeLesson) {
    return (
      <TypingLesson
        lesson={activeLesson}
        onGoBack={() => setActiveLesson(null)}
        onNextLesson={handleNextLesson}
        hasNextLesson={!!nextLesson}
        nextLessonTitleKey={nextLesson?.titleKey ?? null}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto text-center animate-fade-in flex flex-col items-center">
      <header className="w-full mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-accent-primary)] text-center">
          {t('lessons.title')}
        </h1>
        <p className="text-center text-[var(--color-text-secondary)] mt-2">
          {t('lessons.subtitle')}
        </p>
      </header>
      
      <div className="w-full mb-8 max-w-lg mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder={t('lessons.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filteredLessons.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              title={t(lesson.titleKey)}
              description={t(lesson.descriptionKey)}
              onStart={() => setActiveLesson(lesson)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-16 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-secondary)]">{t('lessons.noResults')}</p>
        </div>
      )}
    </div>
  );
};

export default LessonsPage;