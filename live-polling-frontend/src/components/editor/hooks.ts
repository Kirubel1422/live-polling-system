import { nanoid } from 'nanoid';
import { Slide, SlideType, DEFAULT_THEME } from '@/types/presentation';

// From AddSlideMenu.tsx
export function createSlideByType(type: SlideType): Slide {
  const baseSlide = { id: nanoid(), theme: DEFAULT_THEME, settings: {}, order: 0 };

  switch (type) {
    case 'multiple-choice':
      return {
        ...baseSlide,
        type: 'multiple-choice',
        title: 'Your question here',
        subtitle: 'Select the best option',
        options: [
          { id: nanoid(), text: 'Option A', color: '#6366f1' },
          { id: nanoid(), text: 'Option B', color: '#8b5cf6' },
          { id: nanoid(), text: 'Option C', color: '#a855f7' },
          { id: nanoid(), text: 'Option D', color: '#d946ef' },
        ],
        settings: { showResults: true },
      };
    case 'open-ended':
      return {
        ...baseSlide,
        type: 'open-ended',
        title: 'What do you think?',
        subtitle: 'Share your thoughts',
        placeholder: 'Type your answer here...',
        settings: { isAnonymous: true },
      };
    case 'quiz':
      return {
        ...baseSlide,
        type: 'quiz',
        title: 'Quiz Question',
        subtitle: 'Select the correct answer',
        options: [
          { id: nanoid(), text: 'Correct Answer', isCorrect: true, color: '#22c55e' },
          { id: nanoid(), text: 'Wrong Answer 1', isCorrect: false, color: '#ef4444' },
          { id: nanoid(), text: 'Wrong Answer 2', isCorrect: false, color: '#f97316' },
          { id: nanoid(), text: 'Wrong Answer 3', isCorrect: false, color: '#eab308' },
        ],
        timeLimit: 30,
        points: 100,
        settings: { showCorrectAnswer: true },
      };
    case 'word-cloud':
      return { ...baseSlide, type: 'word-cloud', title: 'What comes to mind?', subtitle: 'Enter up to 3 words', maxWords: 3, profanityFilter: true };
    case 'rating':
      return { ...baseSlide, type: 'rating', title: 'How would you rate this?', subtitle: 'Select your rating', ratingType: 'stars', minValue: 1, maxValue: 5, minLabel: 'Poor', maxLabel: 'Excellent' };
    case 'ranking':
      return {
        ...baseSlide,
        type: 'ranking',
        title: 'Rank these items',
        subtitle: 'Drag to reorder',
        items: [
          { id: nanoid(), text: 'First item', color: '#6366f1' },
          { id: nanoid(), text: 'Second item', color: '#8b5cf6' },
          { id: nanoid(), text: 'Third item', color: '#a855f7' },
          { id: nanoid(), text: 'Fourth item', color: '#d946ef' },
        ],
      };
    case 'scales':
      return { ...baseSlide, type: 'scales', title: 'How do you feel about this statement?', statement: 'I am satisfied with the current process', scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }, steps: 5 };
    case 'pin-on-image':
      return { ...baseSlide, type: 'pin-on-image', title: 'Where would you place your pin?', question: 'Click on the image to place your answer', imageUrl: '' };
    case 'qa':
      return { ...baseSlide, type: 'qa', title: 'Q&A Session', subtitle: 'Submit your questions', allowSubmissions: true, questions: [], settings: { isAnonymous: false, allowUpvotes: true } };
    case 'image-choice':
      return {
        ...baseSlide,
        type: 'image-choice',
        title: 'Which do you prefer?',
        subtitle: 'Select an image',
        options: [
          { id: nanoid(), text: 'Option A', imageUrl: '', color: '#6366f1' },
          { id: nanoid(), text: 'Option B', imageUrl: '', color: '#8b5cf6' },
        ],
        settings: { showResults: true },
      };
    case 'number':
      return { ...baseSlide, type: 'number', title: 'Enter a number', subtitle: 'What is your guess?', minValue: 0, maxValue: 100, unit: '' };
    case '100-points':
      return {
        ...baseSlide,
        type: '100-points',
        title: 'Distribute 100 points',
        subtitle: 'Allocate points based on importance',
        items: [
          { id: nanoid(), text: 'Item A', color: '#6366f1' },
          { id: nanoid(), text: 'Item B', color: '#8b5cf6' },
          { id: nanoid(), text: 'Item C', color: '#a855f7' },
        ],
        totalPoints: 100,
      };
    case 'wheel-of-names':
      return { ...baseSlide, type: 'wheel-of-names', title: 'Wheel of Names', subtitle: 'Spin to pick a winner!', names: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'] };
    case 'content':
    default:
      return { ...baseSlide, type: 'content', title: 'Slide Title', subtitle: 'Optional subtitle', content: 'Add your content here', layout: 'center' };
  }
}
