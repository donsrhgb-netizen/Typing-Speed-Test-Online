import { useState, useEffect, useCallback } from 'react';
import { GameStatus, TypingState, Difficulty, GameMode } from '../types';
import { getRandomParagraph, generateWords, paragraphs } from '../utils/paragraphs';
import { getRandomQuote } from '../utils/quotes';
import { useProfile } from '../context/ProfileContext';

const useTypingGame = () => {
  const { profile, addTestResult } = useProfile();
  const { 
    difficulty: preferredDifficulty, 
    timeLimit: preferredTimeLimit,
    gameMode: preferredGameMode,
    wordCount: preferredWordCount,
  } = profile.preferences;

  const getInitialText = useCallback((gameMode: GameMode) => {
    switch(gameMode) {
      case GameMode.Words:
        return generateWords(preferredWordCount);
      case GameMode.Quote:
        return getRandomQuote().text;
      case GameMode.Time:
      default:
        return getRandomParagraph(preferredDifficulty);
    }
  }, [preferredDifficulty, preferredWordCount]);

  const [state, setState] = useState<TypingState>(() => {
    const quote = preferredGameMode === GameMode.Quote ? getRandomQuote() : null;
    return {
      text: quote ? quote.text : getInitialText(preferredGameMode),
      typed: '',
      status: GameStatus.Idle,
      startTime: null,
      endTime: null,
      errors: 0,
      difficulty: preferredDifficulty,
      gameMode: preferredGameMode,
      timeLimit: preferredGameMode === GameMode.Time ? preferredTimeLimit : 0,
      wordCount: preferredWordCount,
      quoteSource: quote ? quote.source : undefined,
      wpm: 0,
      accuracy: 100,
    };
  });

  const [timeElapsed, setTimeElapsed] = useState(0);

  const resetTest = useCallback(() => {
    setTimeElapsed(0);
    setState(prev => {
      const newQuote = preferredGameMode === GameMode.Quote ? getRandomQuote() : null;
      let newText = '';
      switch(preferredGameMode) {
        case GameMode.Words:
          newText = generateWords(preferredWordCount);
          break;
        case GameMode.Quote:
          newText = newQuote?.text ?? getRandomQuote().text;
          break;
        case GameMode.Time:
        default:
          if (paragraphs[preferredDifficulty].length > 1) {
            do {
              newText = getRandomParagraph(preferredDifficulty);
            } while (newText === prev.text);
          } else {
            newText = getRandomParagraph(preferredDifficulty);
          }
          break;
      }
      
      return {
        text: newText,
        typed: '',
        status: GameStatus.Idle,
        startTime: null,
        endTime: null,
        errors: 0,
        difficulty: preferredDifficulty,
        gameMode: preferredGameMode,
        timeLimit: preferredGameMode === GameMode.Time ? preferredTimeLimit : 0,
        wordCount: preferredWordCount,
        quoteSource: newQuote?.source,
        wpm: 0,
        accuracy: 100,
      };
    });
  }, [preferredDifficulty, preferredTimeLimit, preferredGameMode, preferredWordCount]);

  // Syncs the game with any changes in user preferences.
  useEffect(() => {
    resetTest();
  }, [resetTest]);
  
  const finishGame = useCallback(() => {
    if (state.status !== GameStatus.Running) return;

    const endTime = Date.now();
    const durationInSeconds = (endTime - (state.startTime ?? endTime)) / 1000;
    
    const wordsTyped = state.typed.trim().length / 5;
    const timeInMinutes = (state.gameMode === GameMode.Time ? state.timeLimit : durationInSeconds) / 60;
    
    const wpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
    
    let finalErrors = 0;
    const typedChars = state.typed.split('');
    typedChars.forEach((char, i) => {
      if (char !== state.text[i]) {
        finalErrors++;
      }
    });
    
    const accuracy = state.typed.length > 0
      ? Math.max(0, Math.round(((state.typed.length - finalErrors) / state.typed.length) * 100))
      : 0;
      
    addTestResult({ 
        wpm, 
        accuracy, 
        difficulty: state.difficulty,
        gameMode: state.gameMode,
        duration: durationInSeconds,
        ...(state.gameMode === GameMode.Time && { timeLimit: state.timeLimit }),
        ...(state.gameMode === GameMode.Words && { wordCount: state.wordCount }),
        ...(state.gameMode === GameMode.Quote && { quoteSource: state.quoteSource }),
    });
    
    setState(prev => ({ ...prev, status: GameStatus.Finished, endTime, wpm, accuracy, errors: finalErrors }));
  }, [state, addTestResult]);

  // Timer effect
  useEffect(() => {
    let timerInterval: number | undefined;

    if (state.status === GameStatus.Running) {
      timerInterval = window.setInterval(() => {
        if (state.startTime) {
          const elapsed = (Date.now() - state.startTime) / 1000;
          setTimeElapsed(elapsed);

          if (state.gameMode === GameMode.Time && elapsed >= state.timeLimit) {
            finishGame();
          }
        }
      }, 100);
    }

    return () => clearInterval(timerInterval);
  }, [state.status, state.startTime, state.gameMode, state.timeLimit, finishGame]);

  // Completion check for untimed modes
  useEffect(() => {
    if (
      (state.gameMode === GameMode.Words || state.gameMode === GameMode.Quote) &&
      state.status === GameStatus.Running &&
      state.text.length > 0 &&
      state.typed.length === state.text.length
    ) {
      finishGame();
    }
  }, [state.typed.length, state.text.length, state.gameMode, state.status, finishGame]);

  const togglePause = useCallback(() => {
    setState(prev => {
        if (prev.status === GameStatus.Running) {
            return { ...prev, status: GameStatus.Paused };
        }
        if (prev.status === GameStatus.Paused) {
            return {
                ...prev,
                status: GameStatus.Running,
                startTime: Date.now() - (timeElapsed * 1000),
            };
        }
        return prev;
    });
  }, [timeElapsed]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const { key } = e;

    if (key === 'Escape') {
      resetTest();
      return;
    }

    if (state.status === GameStatus.Paused) {
        togglePause();
        return;
    }
    
    if (state.status === GameStatus.Finished) {
      return;
    }

    if (key.length === 1 && !e.metaKey && !e.ctrlKey) {
        if (state.typed.length >= state.text.length && state.gameMode !== GameMode.Time) {
            return;
        }

      setState(prev => {
        const isStarting = prev.status === GameStatus.Idle;
        return {
          ...prev,
          typed: prev.typed + key,
          status: isStarting ? GameStatus.Running : prev.status,
          startTime: isStarting ? Date.now() : prev.startTime,
        };
      });
    } else if (key === 'Backspace') {
      setState(prev => ({ ...prev, typed: prev.typed.slice(0, -1) }));
    }

  }, [state.status, state.text, state.gameMode, resetTest, togglePause]);

  // Effect for error calculation, accuracy, and adding new paragraphs in Time mode
  useEffect(() => {
    if (state.status !== GameStatus.Running) {
      return;
    }
    
    setState(prev => {
      let newErrors = 0;
      for (let i = 0; i < prev.typed.length; i++) {
        if (prev.typed[i] !== prev.text[i]) {
          newErrors++;
        }
      }

      const newAccuracy = prev.typed.length > 0
        ? Math.max(0, Math.round(((prev.typed.length - newErrors) / prev.typed.length) * 100))
        : 100;

      // If the user completes the current text in Time mode, append a new paragraph.
      if (prev.gameMode === GameMode.Time && prev.typed.length === prev.text.length && prev.text.length > 0) {
        const nextParagraph = getRandomParagraph(prev.difficulty);
        return {
          ...prev,
          text: prev.text + ' ' + nextParagraph,
          errors: newErrors,
          accuracy: newAccuracy,
        };
      }
      
      return { ...prev, errors: newErrors, accuracy: newAccuracy };
    });
  }, [state.typed, state.text, state.status, state.difficulty, state.gameMode]);
  
  // Effect for real-time WPM calculation
  useEffect(() => {
    if (state.status === GameStatus.Running && timeElapsed > 0) {
      const timeInMinutes = timeElapsed / 60;
      const wpm = Math.round((state.typed.length / 5) / timeInMinutes);
      setState(prev => ({ ...prev, wpm: isFinite(wpm) ? wpm : 0 }));
    } else if (state.status === GameStatus.Idle && state.wpm !== 0) {
      // Reset WPM only when the test is idle, not when it's finished.
      setState(prev => ({ ...prev, wpm: 0 }));
    }
  }, [timeElapsed, state.status, state.typed.length]);

  const progress = (state.gameMode === GameMode.Time && state.timeLimit > 0)
    ? (timeElapsed / state.timeLimit) * 100
    : 0;

  return { ...state, timeElapsed, progress, handleKeyDown, resetTest, togglePause };
};

export default useTypingGame;