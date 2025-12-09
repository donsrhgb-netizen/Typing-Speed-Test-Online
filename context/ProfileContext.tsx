import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, TypingTestResult, Difficulty, GameMode } from '../types';
import { loadProfile, saveProfile } from '../utils/localStorage';
import { TIME_LIMIT_OPTIONS, DIFFICULTY_OPTIONS, WORD_COUNT_OPTIONS } from '../utils/constants';
import { themes } from '../utils/themes';

interface ProfileContextType {
  profile: UserProfile;
  isLoading: boolean;
  addTestResult: (result: Omit<TypingTestResult, 'timestamp'>) => void;
  updateDifficultyPreference: (difficulty: Difficulty) => void;
  updateTimeLimitPreference: (timeLimit: number) => void;
  updateThemePreference: (theme: string) => void;
  updateGameModePreference: (gameMode: GameMode) => void;
  updateWordCountPreference: (wordCount: number) => void;
  updateDailyGoalPreference: (minutes: number) => void;
  updateColorModePreference: (mode: 'light' | 'dark' | 'system') => void;
  updateRatingPreference: (rating: number) => void;
  cycleDifficulty: () => void;
  cycleTimeLimit: () => void;
  markOnboardingAsComplete: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize profile with logic to handle system preferences immediately if needed
  const [profile, setProfile] = useState<UserProfile>(() => {
    const loadedProfile = loadProfile();
    
    // Migration check for older profiles
    if (!TIME_LIMIT_OPTIONS.includes(loadedProfile.preferences.timeLimit)) {
      loadedProfile.preferences.timeLimit = 60;
    }

    // Immediate system theme check to prevent flash of wrong theme
    if (loadedProfile.preferences.colorMode === 'system' && typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const expectedTheme = prefersDark ? 'default' : 'arctic';
      if (loadedProfile.preferences.theme !== expectedTheme) {
        loadedProfile.preferences.theme = expectedTheme;
      }
    } else if (loadedProfile.preferences.colorMode === 'light') {
         if (loadedProfile.preferences.theme !== 'arctic') loadedProfile.preferences.theme = 'arctic';
    } else if (loadedProfile.preferences.colorMode === 'dark') {
         if (loadedProfile.preferences.theme === 'arctic') loadedProfile.preferences.theme = 'default';
    }

    return loadedProfile;
  });

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = () => {
      setProfile(currentProfile => {
        if (currentProfile.preferences.colorMode !== 'system') {
          return currentProfile;
        }
        const prefersDark = mediaQuery.matches;
        const newTheme = prefersDark ? 'default' : 'arctic';
        if (currentProfile.preferences.theme === newTheme) {
          return currentProfile;
        }
        return {
          ...currentProfile,
          preferences: { ...currentProfile.preferences, theme: newTheme },
        };
      });
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Watch for colorMode changes to update theme
  useEffect(() => {
      setProfile(currentProfile => {
          const { colorMode } = currentProfile.preferences;
          let newTheme = currentProfile.preferences.theme;

          if (colorMode === 'light') {
              newTheme = 'arctic';
          } else if (colorMode === 'dark') {
              // Only switch to default if current is arctic (light), otherwise keep user selected dark theme
               if (newTheme === 'arctic') newTheme = 'default';
          } else if (colorMode === 'system') {
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              newTheme = prefersDark ? 'default' : 'arctic';
          }

          if (currentProfile.preferences.theme === newTheme) {
              return currentProfile;
          }
          return {
              ...currentProfile,
              preferences: { ...currentProfile.preferences, theme: newTheme },
          };
      });
  }, [profile.preferences.colorMode]);


  const addTestResult = (result: Omit<TypingTestResult, 'timestamp'>) => {
    const newResult: TypingTestResult = {
      ...result,
      timestamp: Date.now(),
    };
    setProfile(prevProfile => ({
      ...prevProfile,
      history: [newResult, ...prevProfile.history.slice(0, 99)],
    }));
  };

  const updateDifficultyPreference = (difficulty: Difficulty) => {
    if (profile.preferences.difficulty === difficulty) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: { ...prevProfile.preferences, difficulty },
    }));
  };
  
  const updateTimeLimitPreference = (timeLimit: number) => {
    if (profile.preferences.timeLimit === timeLimit) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: { ...prevProfile.preferences, timeLimit },
    }));
  };

  const updateThemePreference = (theme: string) => {
    if (profile.preferences.theme === theme) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        theme,
        colorMode: theme === 'arctic' ? 'light' : 'dark',
      },
    }));
  };

  const updateGameModePreference = (gameMode: GameMode) => {
    if (profile.preferences.gameMode === gameMode) return;
    setProfile(prevProfile => ({
        ...prevProfile,
        preferences: { ...prevProfile.preferences, gameMode },
    }));
  };

  const updateWordCountPreference = (wordCount: number) => {
    if (profile.preferences.wordCount === wordCount) return;
    setProfile(prevProfile => ({
        ...prevProfile,
        preferences: { ...prevProfile.preferences, wordCount },
    }));
  };

  const updateDailyGoalPreference = (minutes: number) => {
    if (profile.preferences.dailyGoal === minutes) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: { ...prevProfile.preferences, dailyGoal: minutes },
    }));
  };
  
  const updateColorModePreference = (mode: 'light' | 'dark' | 'system') => {
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: { ...prevProfile.preferences, colorMode: mode },
    }));
  };

  const updateRatingPreference = (rating: number) => {
    if (profile.preferences.rating === rating) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: { ...prevProfile.preferences, rating },
    }));
  };

  const cycleDifficulty = () => {
    setProfile(prevProfile => {
      const currentDifficulty = prevProfile.preferences.difficulty;
      const currentIndex = DIFFICULTY_OPTIONS.indexOf(currentDifficulty);
      const nextIndex = (currentIndex + 1) % DIFFICULTY_OPTIONS.length;
      return {
        ...prevProfile,
        preferences: { ...prevProfile.preferences, difficulty: DIFFICULTY_OPTIONS[nextIndex] },
      };
    });
  };

  const cycleTimeLimit = () => {
    const gameMode = profile.preferences.gameMode;
    const options = gameMode === GameMode.Words ? WORD_COUNT_OPTIONS : TIME_LIMIT_OPTIONS;
    const currentVal = gameMode === GameMode.Words ? profile.preferences.wordCount : profile.preferences.timeLimit;

    setProfile(prevProfile => {
      const currentIndex = options.indexOf(currentVal);
      const nextIndex = (currentIndex + 1) % options.length;
      const nextVal = options[nextIndex];
      return {
        ...prevProfile,
        preferences: {
          ...prevProfile.preferences,
          ...(gameMode === GameMode.Words ? { wordCount: nextVal } : { timeLimit: nextVal }),
        },
      };
    });
  };

  const markOnboardingAsComplete = () => {
    setProfile(prevProfile => ({
      ...prevProfile,
      hasCompletedOnboarding: true,
    }));
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      isLoading,
      addTestResult, 
      updateDifficultyPreference, 
      updateTimeLimitPreference, 
      updateThemePreference, 
      updateGameModePreference,
      updateWordCountPreference,
      updateDailyGoalPreference,
      updateColorModePreference,
      updateRatingPreference,
      cycleDifficulty,
      cycleTimeLimit,
      markOnboardingAsComplete,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};