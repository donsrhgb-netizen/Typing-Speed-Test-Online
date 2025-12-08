import { Difficulty } from '../types';

const easyParagraphs = [
  "A cat sat on the mat.",
  "The sun is very bright today.",
  "I like to play in the park.",
  "My friend has a blue car.",
  "We eat lunch at noon."
];

const mediumParagraphs = [
  "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet. It is often used for practicing typing and testing fonts.",
  "Technology has revolutionized the way we live and work. From smartphones to artificial intelligence, these advancements continue to shape our future at an unprecedented pace.",
  "The sun is a star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process.",
  "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
  "React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.",
  "The journey of a thousand miles begins with a single step. This ancient proverb reminds us that even the most daunting tasks can be accomplished by starting small and being persistent.",
  "Creativity is intelligence having fun. Albert Einstein's famous quote highlights the playful and joyful nature of innovation and discovery. It encourages us to explore our ideas without fear of failure."
];

const hardParagraphs = [
  "The philosophical dichotomy between epistemology and ontology investigates the very nature of existence and knowledge, questioning whether reality is intrinsically objective or subjectively perceived through the lens of human consciousness and linguistic frameworks.",
  "Quantum entanglement, a phenomenon Albert Einstein famously derided as 'spooky action at a distance,' describes a state where two or more particles are linked in such a way that their fates are intertwined, regardless of the distance separating them, challenging classical intuitions about locality and realism.",
  "The socioeconomic ramifications of globalization are multifaceted, precipitating unprecedented economic integration and cultural homogenization while simultaneously exacerbating inequalities and fueling protectionist sentiments among nations grappling with the displacement of traditional industries.",
  "Beneath the placid surface of the abyssal zone, chemosynthetic ecosystems thrive in perpetual darkness, relying not on photosynthesis but on the oxidation of inorganic compounds, such as hydrogen sulfide, emanating from hydrothermal vents, a testament to life's extraordinary adaptability.",
  "Constitutional jurisprudence frequently grapples with the hermeneutical challenge of interpreting foundational legal texts, balancing originalist intentions against the exigencies of a progressively evolving societal ethos, a delicate equilibrium that defines the judiciary's role in a democratic state."
];

export const paragraphs = {
  [Difficulty.Easy]: easyParagraphs,
  [Difficulty.Medium]: mediumParagraphs,
  [Difficulty.Hard]: hardParagraphs,
};

export const getRandomParagraph = (difficulty: Difficulty): string => {
  const availableParagraphs = paragraphs[difficulty];
  const randomIndex = Math.floor(Math.random() * availableParagraphs.length);
  return availableParagraphs[randomIndex];
};

const wordList = mediumParagraphs.join(' ').toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(word => word.length > 2);
const uniqueWords = [...new Set(wordList)];

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


export const generateWords = (count: number): string => {
    const shuffled = shuffleArray([...uniqueWords]);
    return shuffled.slice(0, count).join(' ');
};