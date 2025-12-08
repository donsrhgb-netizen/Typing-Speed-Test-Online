import React, { useState, useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import { Difficulty, GameMode } from '../types';
import HistoryChart from './HistoryChart';
import { TIME_LIMIT_OPTIONS, DIFFICULTY_OPTIONS, WORD_COUNT_OPTIONS } from '../utils/constants';
import SettingsSelector from './SettingsSelector';
import FAQ from './FAQ';
import Tooltip from './Tooltip';
import { useLanguage } from '../context/LanguageContext';
import StatsDisplay from './StatsDisplay';
import Certificate from './Certificate';
import { getCertificateQuoteKey } from '../utils/certificateQuotes';
import { blogPosts } from '../utils/blogPosts';
import FeedbackWall from './FeedbackWall';

interface LandingPageProps {
  onStart: () => void;
  onSelectPost: (postId: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onSelectPost }) => {
  const { 
    profile, 
    updateDifficultyPreference, 
    updateTimeLimitPreference,
    updateGameModePreference,
    updateWordCountPreference,
  } = useProfile();
  const { t } = useLanguage();
  // FIX: The 'history' property is on the root of the profile object, not within 'preferences'.
  // The component already uses `profile.history` correctly, so `history` is removed from this destructuring to fix the type error.
  const { difficulty, timeLimit, gameMode, wordCount } = profile.preferences;

  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isCertificateVisible, setIsCertificateVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [certificateQuoteKey, setCertificateQuoteKey] = useState('');

  const stats = useMemo(() => {
    if (profile.history.length === 0) {
        return { avgWpm: 0, avgAcc: 0, totalTime: 0, testsCompleted: 0 };
    }
    const totalWpm = profile.history.reduce((sum, r) => sum + r.wpm, 0);
    const totalAcc = profile.history.reduce((sum, r) => sum + r.accuracy, 0);
    const totalTime = profile.history.reduce((sum, r) => sum + r.duration, 0);
    return {
        avgWpm: Math.round(totalWpm / profile.history.length),
        avgAcc: Math.round(totalAcc / profile.history.length),
        totalTime,
        testsCompleted: profile.history.length,
    };
  }, [profile.history]);

  const getTimeLimitLabel = (limit: number): string => {
    if (limit % 60 === 0) {
        const minutes = limit / 60;
        return `${minutes}m`;
    }
    return `${limit}s`;
  };

  const handleGenerateCertificate = () => {
    if (userName.trim()) {
        const quoteKey = getCertificateQuoteKey({
          wpm: stats.avgWpm,
          testsCompleted: stats.testsCompleted,
        });
        setCertificateQuoteKey(quoteKey);
        setIsNameModalVisible(false);
        setIsCertificateVisible(true);
    }
  };

  const gameModeOptions = [
    { value: GameMode.Time, label: t('landing.time') },
    { value: GameMode.Words, label: t('landing.words') },
    { value: GameMode.Quote, label: t('landing.quote') },
  ];
  
  const difficultyOptions = DIFFICULTY_OPTIONS.map(d => ({
    value: d,
    label: t(`landing.difficulty.${d}`),
  }));

  const timeLimitOptions = TIME_LIMIT_OPTIONS.map(t => ({
    value: t,
    label: getTimeLimitLabel(t),
  }));
  
  const wordCountOptions = WORD_COUNT_OPTIONS.map(w => ({
    value: w,
    label: String(w),
  }));

  const featuredArticles = blogPosts.slice(0, 4);

  return (
    <>
    <div className="w-full max-w-4xl mx-auto text-center animate-fade-in flex flex-col items-center">
      <div className="w-full p-8 bg-[var(--color-bg-secondary)] rounded-xl shadow-2xl shadow-[var(--color-shadow-primary)]">
        <div className="flex justify-center items-center flex-wrap gap-4 md:gap-6 mb-8">
            <Tooltip text={t('landing.tooltipMode')}>
                <SettingsSelector
                    options={gameModeOptions}
                    selectedValue={gameMode}
                    onSelect={(val) => updateGameModePreference(val as GameMode)}
                    ariaLabel="Select game mode"
                />
            </Tooltip>
            
            {gameMode === GameMode.Time && (
                <Tooltip text={t('landing.tooltipTimeLimit')}>
                    <SettingsSelector
                    options={timeLimitOptions}
                    selectedValue={timeLimit}
                    onSelect={(val) => updateTimeLimitPreference(val as number)}
                    ariaLabel="Select time limit"
                    />
                </Tooltip>
            )}

            {gameMode === GameMode.Words && (
                 <Tooltip text={t('landing.tooltipWordCount')}>
                    <SettingsSelector
                    options={wordCountOptions}
                    selectedValue={wordCount}
                    onSelect={(val) => updateWordCountPreference(val as number)}
                    ariaLabel="Select word count"
                    />
                </Tooltip>
            )}
            
            {gameMode !== GameMode.Quote && (
                <Tooltip text={t('landing.tooltipDifficulty')}>
                    <SettingsSelector 
                    options={difficultyOptions}
                    selectedValue={difficulty}
                    onSelect={(val) => updateDifficultyPreference(val as Difficulty)}
                    ariaLabel="Select typing difficulty"
                    />
                </Tooltip>
            )}
        </div>
        <button
          onClick={onStart}
          className="px-10 py-4 bg-[var(--color-accent-secondary)] text-[var(--color-text-inverted)] font-bold text-xl rounded-md hover:bg-[var(--color-accent-primary)] transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)] shadow-lg shadow-[var(--color-shadow-primary)]"
        >
          {t('landing.startTyping')}
        </button>
      </div>

      <StatsDisplay />

      <HistoryChart />

      {profile.history.length > 0 && (
        <div className="w-full text-center mt-8">
            <button
              onClick={() => setIsNameModalVisible(true)}
              className="px-6 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] font-semibold rounded-md hover:bg-[var(--color-bg-interactive)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {t('certificate.generate')}
            </button>
        </div>
      )}

      <FAQ />

      <div className="w-full max-w-4xl mx-auto mt-12">
        <h3 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 text-left">{t('landing.detailedArticles.title')}</h3>
        <p className="text-left text-[var(--color-text-secondary)] mb-6">{t('landing.detailedArticles.subtitle')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuredArticles.map((post) => (
            <button
              key={post.id}
              onClick={() => onSelectPost(post.id)}
              className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-lg hover:shadow-[var(--color-shadow-primary)] transition-all duration-300 text-left h-full flex flex-col hover:scale-[1.02] focus:outline-none focus:ring-2 ring-offset-2 ring-offset-[var(--color-bg-primary)] focus:ring-[var(--color-accent-primary)]"
            >
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{t(post.titleKey)}</h4>
              <p className="text-sm text-[var(--color-text-secondary)] flex-grow">{t(post.summaryKey)}</p>
            </button>
          ))}
        </div>
      </div>

      <FeedbackWall />

    </div>
     {isNameModalVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="name-prompt-title">
          <div className="bg-[var(--color-bg-secondary)] p-8 rounded-xl shadow-2xl w-[90%] max-w-sm text-center">
            <h2 id="name-prompt-title" className="text-xl font-bold mb-4">{t('certificate.namePrompt')}</h2>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t('certificate.namePlaceholder')}
              className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCertificate()}
            />
            <div className="flex gap-4 mt-6">
              <button onClick={() => setIsNameModalVisible(false)} className="flex-1 px-4 py-2 bg-[var(--color-bg-tertiary)] rounded-md hover:bg-[var(--color-bg-interactive)] transition-colors">{t('certificate.close')}</button>
              <button onClick={handleGenerateCertificate} className="flex-1 px-4 py-2 bg-[var(--color-accent-secondary)] text-[var(--color-text-inverted)] rounded-md hover:bg-[var(--color-accent-primary)] transition-colors">{t('certificate.generate')}</button>
            </div>
          </div>
        </div>
      )}
      {isCertificateVisible && (
          <Certificate 
              name={userName}
              avgWpm={stats.avgWpm}
              avgAcc={stats.avgAcc}
              totalTime={stats.totalTime}
              testsCompleted={stats.testsCompleted}
              quoteKey={certificateQuoteKey}
              onClose={() => {
                setIsCertificateVisible(false);
                setUserName('');
                setCertificateQuoteKey('');
              }}
          />
      )}
    </>
  );
};

export default LandingPage;