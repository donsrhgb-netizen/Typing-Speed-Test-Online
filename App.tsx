import React, { useLayoutEffect } from 'react';
import MainPage from './components/MainPage';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { applyTheme } from './utils/themes';
import LoadingSpinner from './components/LoadingSpinner';
import { LanguageProvider } from './context/LanguageContext';

const ThemedApp: React.FC = () => {
  const { profile, isLoading } = useProfile();
  
  useLayoutEffect(() => {
    if (!isLoading) {
      applyTheme(profile.preferences.theme);
    }
  }, [isLoading, profile.preferences.theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <MainPage />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <ThemedApp />
      </ProfileProvider>
    </LanguageProvider>
  );
};

export default App;