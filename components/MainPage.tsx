import React, { useState } from 'react';
import TypingTest from './TypingTest';
import LandingPage from './LandingPage';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import PromoHeader from './PromoHeader';
import LessonsPage from './LessonsPage';
import { useLanguage } from '../context/LanguageContext';
import SettingsModal from './SettingsModal';
import BlogPage from './BlogPage';
import BlogPost from './BlogPost';
import FeedbackModal from './FeedbackModal';
import RatingBar from './RatingBar';
import { useProfile } from '../context/ProfileContext';
import Onboarding from './Onboarding';

const MainPage: React.FC = () => {
  const [page, setPage] = useState<'landing' | 'test' | 'lessons' | 'blog' | 'blogPost'>('landing');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { t } = useLanguage();
  const { profile, markOnboardingAsComplete } = useProfile();
  
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!profile.hasCompletedOnboarding);

  const handleCloseOnboarding = () => {
    markOnboardingAsComplete();
    setIsOnboardingOpen(false);
  };

  const handleNavigation = (view: 'tests' | 'lessons' | 'blog') => {
    if (view === 'tests') {
      setPage('landing');
    } else {
      setPage(view);
    }
  };
  
  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
    setPage('blogPost');
  };

  // FIX: Map the 'blogPost' page to the 'blog' active view to satisfy the prop type for PromoHeader and correctly highlight the navigation.
  const activeView = (() => {
    if (page === 'landing' || page === 'test') {
      return 'tests';
    }
    if (page === 'blog' || page === 'blogPost') {
      return 'blog';
    }
    return page; // This will be 'lessons'
  })();

  const renderPageContent = () => {
    switch(page) {
      case 'landing':
        return <LandingPage onStart={() => setPage('test')} onSelectPost={handleSelectPost} />;
      case 'test':
        return <TypingTest onGoBack={() => setPage('landing')} />;
      case 'lessons':
        return <LessonsPage />;
      case 'blog':
        return <BlogPage onSelectPost={handleSelectPost} />;
      case 'blogPost':
        return selectedPostId ? <BlogPost postId={selectedPostId} onGoBack={() => setPage('blog')} /> : <BlogPage onSelectPost={handleSelectPost} />;
      default:
        return <LandingPage onStart={() => setPage('test')} onSelectPost={handleSelectPost} />;
    }
  };
  
  const showBackButton = page === 'test';
  const showHeaderAndFooter = page === 'landing' || page === 'blog';

  return (
    <div className="flex flex-col min-h-screen">
      <PromoHeader 
        activeView={activeView} 
        onNavigate={handleNavigation} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <div className="relative flex-grow flex flex-col items-center justify-center p-4">
        {showBackButton && (
          <button
            onClick={() => setPage('landing')}
            aria-label="Go back to main menu"
            className="absolute top-6 left-6 flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] focus:ring-[var(--color-accent-primary)] rounded-lg px-3 py-1 text-sm z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('main.back')}
          </button>
        )}

        {page === 'landing' && (
          <header className="w-full max-w-5xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-accent-primary)] text-center">
              {t('main.landingTitle')}
            </h1>
            <p className="text-center text-[var(--color-text-secondary)] mt-2">
              {t('main.landingSubtitle')}
            </p>
          </header>
        )}
        
        <main className="w-full flex justify-center">
          {renderPageContent()}
        </main>

        {showHeaderAndFooter && (
          <footer className="w-full max-w-5xl mx-auto mt-12 flex flex-col items-center justify-between gap-4 text-center text-[var(--color-text-tertiary)] text-sm">
            <RatingBar />
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <button 
                  onClick={() => setIsPrivacyPolicyOpen(true)}
                  className="hover:text-[var(--color-accent-primary)] underline transition-colors"
              >
                  {t('footer.privacyPolicy')}
              </button>
              <button 
                  onClick={() => setIsTermsOfServiceOpen(true)}
                  className="hover:text-[var(--color-accent-primary)] underline transition-colors"
              >
                  {t('footer.termsOfService')}
              </button>
              <button 
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="hover:text-[var(--color-accent-primary)] underline transition-colors"
              >
                  {t('footer.feedback')}
              </button>
              <button 
                  onClick={() => setIsOnboardingOpen(true)}
                  className="hover:text-[var(--color-accent-primary)] underline transition-colors"
              >
                  {t('footer.help')}
              </button>
            </div>
            <p>{t('footer.builtWith')}</p>
          </footer>
        )}
      </div>
      {isPrivacyPolicyOpen && <PrivacyPolicy onClose={() => setIsPrivacyPolicyOpen(false)} />}
      {isTermsOfServiceOpen && <TermsOfService onClose={() => setIsTermsOfServiceOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />}
      {isOnboardingOpen && <Onboarding onClose={handleCloseOnboarding} />}
    </div>
  );
};

export default MainPage;