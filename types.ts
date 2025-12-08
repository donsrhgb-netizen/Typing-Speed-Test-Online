
export enum GameStatus {
  Idle = 'idle',
  Running = 'running',
  Paused = 'paused',
  Finished = 'finished',
}

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum GameMode {
  Time = 'time',
  Words = 'words',
  Quote = 'quote',
}

export interface TypingTestResult {
  wpm: number;
  accuracy: number;
  difficulty: Difficulty;
  timestamp: number;
  gameMode: GameMode;
  duration: number;
  timeLimit?: number;
  wordCount?: number;
  quoteSource?: string;
}

export interface UserProfile {
  history: TypingTestResult[];
  preferences: {
    colorMode: 'light' | 'dark' | 'system';
    gameMode: GameMode;
    timeLimit: number;
    wordCount: number;
    difficulty: Difficulty;
    theme: string;
    dailyGoal: number; // in minutes
    rating: number; // 0-5 stars
  };
  hasCompletedOnboarding: boolean;
}

export interface TypingState {
  text: string;
  typed: string;
  status: GameStatus;
  startTime: number | null;
  endTime: number | null;
  errors: number;
  difficulty: Difficulty;
  gameMode: GameMode;
  timeLimit: number;
  wordCount: number;
  quoteSource?: string;
  wpm: number;
  accuracy: number;
}

export interface Lesson {
  id: number;
  titleKey: string;
  descriptionKey: string;
  text: string;
}

export interface Quote {
  text: string;
  source: string;
}

export interface BlogPostData {
  id: string;
  titleKey: string;
  summaryKey: string;
  contentKey: string;
  author: string;
  date: string;
}

export interface FeedbackMessage {
  name: string;
  message: string;
  timestamp: number;
}