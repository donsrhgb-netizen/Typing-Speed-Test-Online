import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    className={`w-6 h-6 transition-colors duration-200 ${
      filled ? 'text-yellow-400' : 'text-[var(--color-text-tertiary)]'
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const RatingBar: React.FC = () => {
  const { profile, updateRatingPreference } = useProfile();
  const { t } = useLanguage();
  const [hoverRating, setHoverRating] = useState(0);
  const [showThanks, setShowThanks] = useState(false);

  const handleClick = (rating: number) => {
    updateRatingPreference(rating);
    setShowThanks(true);
  };

  useEffect(() => {
    // FIX: Changed timer type from NodeJS.Timeout to `number | undefined` for browser compatibility.
    let timer: number | undefined;
    if (showThanks) {
      timer = setTimeout(() => {
        setShowThanks(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showThanks]);

  const displayRating = hoverRating > 0 ? hoverRating : profile.preferences.rating;

  return (
    <div className="flex flex-col items-center justify-center gap-2 mb-4">
      <div
        className="flex items-center"
        onMouseLeave={() => setHoverRating(0)}
        aria-label="Rate this application"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHoverRating(star)}
            className="transform transition-transform duration-150 hover:scale-125 focus:outline-none"
            aria-label={`Rate ${star} out of 5 stars`}
          >
            <StarIcon filled={star <= displayRating} />
          </button>
        ))}
      </div>
      <div className="h-4">
        {showThanks && (
          <p className="text-sm text-[var(--color-correct)] animate-fade-in">{t('rating.thanks')}</p>
        )}
      </div>
    </div>
  );
};

export default RatingBar;