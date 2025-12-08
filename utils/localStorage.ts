import { UserProfile, Difficulty, GameMode, FeedbackMessage } from '../types';

const PROFILE_KEY = 'typingTestUserProfile';
const FEEDBACK_KEY = 'typingTestFeedback';
const MAX_FEEDBACK_MESSAGES = 20;

const defaultProfile: UserProfile = {
  history: [],
  preferences: {
    colorMode: 'system',
    gameMode: GameMode.Time,
    timeLimit: 60,
    wordCount: 25,
    difficulty: Difficulty.Medium,
    theme: 'default',
    dailyGoal: 30, // Default 30 minutes
    rating: 0,
  },
  hasCompletedOnboarding: false,
};

export const loadProfile = (): UserProfile => {
  try {
    const serializedProfile = localStorage.getItem(PROFILE_KEY);
    if (serializedProfile === null) {
      return defaultProfile;
    }
    const stored = JSON.parse(serializedProfile);

    // Merge with default to handle users from older versions and ensure new properties are added
    const profile = {
        ...defaultProfile,
        ...stored,
        preferences: {
            ...defaultProfile.preferences,
            ...(stored.preferences || {}),
        }
    };
    
    // Basic validation to prevent crashes if localStorage data is malformed
    if (profile && profile.preferences && profile.history) {
      return profile;
    }
    return defaultProfile;
  } catch (error) {
    console.error("Failed to load profile from localStorage", error);
    return defaultProfile;
  }
};

export const saveProfile = (profile: UserProfile): void => {
  try {
    const serializedProfile = JSON.stringify(profile);
    localStorage.setItem(PROFILE_KEY, serializedProfile);
  } catch (error) {
    console.error("Failed to save profile to localStorage", error);
  }
};

// --- Feedback Wall Functions ---

export const loadFeedback = (): FeedbackMessage[] => {
  try {
    const serializedFeedback = localStorage.getItem(FEEDBACK_KEY);
    if (serializedFeedback === null) {
      return [];
    }
    return JSON.parse(serializedFeedback);
  } catch (error) {
    console.error("Failed to load feedback from localStorage", error);
    return [];
  }
};

export const saveFeedback = (newMessage: Omit<FeedbackMessage, 'timestamp'>): void => {
  try {
    const existingFeedback = loadFeedback();
    const fullMessage: FeedbackMessage = { ...newMessage, timestamp: Date.now() };
    const updatedFeedback = [fullMessage, ...existingFeedback].slice(0, MAX_FEEDBACK_MESSAGES);
    const serializedFeedback = JSON.stringify(updatedFeedback);
    localStorage.setItem(FEEDBACK_KEY, serializedFeedback);
  } catch (error) {
    console.error("Failed to save feedback to localStorage", error);
  }
};