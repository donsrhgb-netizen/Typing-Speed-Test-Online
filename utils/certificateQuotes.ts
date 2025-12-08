interface QuoteSelectionParams {
  wpm: number;
  testsCompleted: number;
}

const beginnerQuotes = [
  'certificate.quotes.beginner1',
  'certificate.quotes.beginner2',
];

const intermediateQuotes = [
  'certificate.quotes.intermediate1',
  'certificate.quotes.intermediate2',
];

const expertQuotes = [
  'certificate.quotes.expert1',
  'certificate.quotes.expert2',
];

const getRandomQuote = (quotes: string[]): string => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getCertificateQuoteKey = ({ wpm, testsCompleted }: QuoteSelectionParams): string => {
  if (testsCompleted < 5) {
    return getRandomQuote(beginnerQuotes);
  }
  if (wpm >= 60) {
    return getRandomQuote(expertQuotes);
  }
  if (wpm >= 40) {
    return getRandomQuote(intermediateQuotes);
  }
  return getRandomQuote(beginnerQuotes);
};
