import { useState, useCallback, useEffect } from 'react';

const useLesson = (text: string) => {
  const [typed, setTyped] = useState('');
  const [errors, setErrors] = useState(0);

  const resetLesson = useCallback(() => {
    setTyped('');
    setErrors(0);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const { key } = e;

    if (key === 'Escape') {
      resetLesson();
      return;
    }

    // Don't allow typing past the end of the text
    if (typed.length >= text.length) {
      return;
    }

    if (key.length === 1 && !e.metaKey && !e.ctrlKey) {
      setTyped(prev => prev + key);
    } else if (key === 'Backspace') {
      setTyped(prev => prev.slice(0, -1));
    }
  }, [text.length, typed.length, resetLesson]);

  useEffect(() => {
    let currentErrors = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== text[i]) {
        currentErrors++;
      }
    }
    setErrors(currentErrors);
  }, [typed, text]);

  const accuracy = typed.length > 0
    ? Math.round(((typed.length - errors) / typed.length) * 100)
    : 100;

  const isComplete = typed.length > 0 && typed.length === text.length;

  const progress = text.length > 0 ? (typed.length / text.length) * 100 : 0;

  return { typed, accuracy, isComplete, handleKeyDown, resetLesson, progress };
};

export default useLesson;