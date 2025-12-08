import { Quote } from '../types';

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", source: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", source: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", source: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", source: "Aristotle" },
  { text: "Whoever is happy will make others happy too.", source: "Anne Frank" },
  { text: "The purpose of our lives is to be happy.", source: "Dalai Lama" },
  { text: "You only live once, but if you do it right, once is enough.", source: "Mae West" },
  { text: "Get busy living or get busy dying.", source: "Stephen King" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", source: "Nelson Mandela" },
  { text: "The way to get started is to quit talking and begin doing.", source: "Walt Disney" },
  { text: "If life were predictable it would cease to be life, and be without flavor.", source: "Eleanor Roosevelt" },
  { text: "If you look at what you have in life, you'll always have more.", source: "Oprah Winfrey" },
  { text: "Your time is limited, so don't waste it living someone else's life.", source: "Steve Jobs" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", source: "Abraham Lincoln" },
  { text: "Life is a succession of lessons which must be lived to be understood.", source: "Helen Keller" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", source: "Maya Angelou" },
  { text: "Go confidently in the direction of your dreams! Live the life you've imagined.", source: "Henry David Thoreau" },
  { text: "The only impossible journey is the one you never begin.", source: "Tony Robbins" },
  { text: "In this life we cannot do great things. We can only do small things with great love.", source: "Mother Teresa" },
  { text: "The best way to predict your future is to create it.", source: "Abraham Lincoln" },
];

export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};