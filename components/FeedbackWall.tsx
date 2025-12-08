import React, { useState, useEffect } from 'react';
import { FeedbackMessage } from '../types';
import { loadFeedback } from '../utils/localStorage';
import { useLanguage } from '../context/LanguageContext';
import { formatDistanceToNow } from 'date-fns';

const FEEDBACK_KEY = 'typingTestFeedback';

const FeedbackWall: React.FC = () => {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    setMessages(loadFeedback());

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === FEEDBACK_KEY) {
        setMessages(loadFeedback());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h3 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 text-left">{t('feedbackWall.title')}</h3>
      <p className="text-left text-[var(--color-text-secondary)] mb-6">{t('feedbackWall.subtitle')}</p>
      <div className="bg-[var(--color-bg-secondary)] p-4 sm:p-6 rounded-lg shadow-inner ring-1 ring-black/20 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={msg.timestamp}
              className="p-4 bg-[var(--color-bg-primary)] rounded-md animate-fade-in"
              style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}
            >
              <p className="text-[var(--color-text-secondary)]">"{msg.message}"</p>
              <div className="flex justify-between items-center mt-2 text-sm">
                <p className="font-semibold text-[var(--color-accent-primary)]">- {msg.name}</p>
                <p className="text-[var(--color-text-tertiary)]">
                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackWall;