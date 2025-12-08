import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, TypingTestResult, Difficulty, GameMode } from '../types';
import { loadProfile, saveProfile } from '../utils/localStorage';
import { TIME_LIMIT_OPTIONS, DIFFICULTY_OPTIONS, WORD_COUNT_OPTIONS } from '../utils/constants';

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
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const loadedProfile = loadProfile();
    // This check migrates users from the old 'paragraph' setting (0) to the new default.
    if (!TIME_LIMIT_OPTIONS.includes(loadedProfile.preferences.timeLimit)) {
      loadedProfile.preferences.timeLimit = 60;
    }
    return loadedProfile;
  });

  useEffect(() => {
    // Since loadProfile is synchronous, we add a small delay to give feedback
    // that the app is initializing and loading user settings.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveProfile(profile);
    }
  }, [profile, isLoading]);
  
  // This effect will run when colorMode changes or when loading finishes.
  // It is responsible for setting the correct theme and for handling system preference changes.
  useEffect(() => {
    if (isLoading) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // This handler will be called when the system theme changes.
    const handleSystemThemeChange = () => {
      // We only act if the user's preference is 'system'.
      // By using the functional update form of setProfile, we get the latest state
      // and avoid stale closure problems.
      setProfile(currentProfile => {
        if (currentProfile.preferences.colorMode !== 'system') {
          return currentProfile; // Do nothing if not in system mode
        }
        const prefersDark = mediaQuery.matches;
        const newTheme = prefersDark ? 'default' : 'arctic';
        if (currentProfile.preferences.theme === newTheme) {
          return currentProfile; // No change needed
        }
        return {
          ...currentProfile,
          preferences: { ...currentProfile.preferences, theme: newTheme },
        };
      });
    };

    // Set the initial theme based on the current colorMode preference.
    setProfile(currentProfile => {
      const { colorMode } = currentProfile.preferences;
      let newTheme: string;
      if (colorMode === 'light') {
        newTheme = 'arctic';
      } else if (colorMode === 'dark') {
        newTheme = 'default';
      } else { // 'system'
        newTheme = mediaQuery.matches ? 'default' : 'arctic';
      }
      
      if (currentProfile.preferences.theme === newTheme) {
        return currentProfile; // No change needed
      }
      return {
        ...currentProfile,
        preferences: { ...currentProfile.preferences, theme: newTheme },
      };
    });

    // Add listener for system theme changes.
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup listener on component unmount or when dependencies change.
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [isLoading, profile.preferences.colorMode]); // Rerun when loading state changes or user switches mode.


  const addTestResult = (result: Omit<TypingTestResult, 'timestamp'>) => {
    const newResult: TypingTestResult = {
      ...result,
      timestamp: Date.now(),
    };
    setProfile(prevProfile => ({
      ...prevProfile,
      history: [newResult, ...prevProfile.history.slice(0, 99)], // Prepend new result, keep last 100
    }));
  };

  const updateDifficultyPreference = (difficulty: Difficulty) => {
    if (profile.preferences.difficulty === difficulty) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        difficulty,
      },
    }));
  };
  
  const updateTimeLimitPreference = (timeLimit: number) => {
    if (profile.preferences.timeLimit === timeLimit) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        timeLimit,
      },
    }));
  };

  const updateThemePreference = (theme: string) => {
    if (profile.preferences.theme === theme) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        theme,
        // Sync colorMode with the selected theme. 'arctic' is the only light theme.
        // This ensures the colorMode selector is in a consistent state and that the
        // system theme override is disabled when a specific theme is chosen.
        colorMode: theme === 'arctic' ? 'light' : 'dark',
      },
    }));
  };

  const updateGameModePreference = (gameMode: GameMode) => {
    if (profile.preferences.gameMode === gameMode) return;
    setProfile(prevProfile => ({
        ...prevProfile,
        preferences: {
            ...prevProfile.preferences,
            gameMode,
        },
    }));
  };

  const updateWordCountPreference = (wordCount: number) => {
    if (profile.preferences.wordCount === wordCount) return;
    setProfile(prevProfile => ({
        ...prevProfile,
        preferences: {
            ...prevProfile.preferences,
            wordCount,
        },
    }));
  };

  const updateDailyGoalPreference = (minutes: number) => {
    if (profile.preferences.dailyGoal === minutes) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        dailyGoal: minutes,
      },
    }));
  };
  
  const updateColorModePreference = (mode: 'light' | 'dark' | 'system') => {
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        colorMode: mode,
      },
    }));
  };

  const updateRatingPreference = (rating: number) => {
    if (profile.preferences.rating === rating) return;
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        rating,
      },
    }));
  };

  const cycleDifficulty = () => {
    setProfile(prevProfile => {
      const currentDifficulty = prevProfile.preferences.difficulty;
      const currentIndex = DIFFICULTY_OPTIONS.indexOf(currentDifficulty);
      const nextIndex = (currentIndex + 1) % DIFFICULTY_OPTIONS.length;
      const nextDifficulty = DIFFICULTY_OPTIONS[nextIndex];
      return {
        ...prevProfile,
        preferences: {
          ...prevProfile.preferences,
          difficulty: nextDifficulty,
        },
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