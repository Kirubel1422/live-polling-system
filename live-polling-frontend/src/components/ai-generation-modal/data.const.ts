import type { Preset, SuggestionChip } from './types';

export const PRESETS: Preset[] = [
  { id: 'feedback',   label: 'Team Feedback',  prompt: 'Create a team feedback session' },
  { id: 'quiz',       label: 'Fun Quiz',        prompt: 'Create a fun trivia quiz' },
  { id: 'brainstorm', label: 'Brainstorming',   prompt: 'Create a brainstorming session' },
  { id: 'icebreaker', label: 'Icebreaker',      prompt: 'Create team icebreaker questions' },
];

export const SUGGESTION_CHIPS: SuggestionChip[] = [
  { text: 'Question for Audience', emoji: '🗣️' },
  { text: 'Voting',                emoji: '🗳️' },
  { text: 'Team Icebreaker',       emoji: '🧊' },
];

export const PLACEHOLDERS: string[] = [
  'E.g., Create a quiz about world geography...',
  'E.g., Question for Audience about remote work...',
  'E.g., Voting session for the next team outing...',
  'E.g., Team Icebreaker to start the weekly meeting...',
];

export const LOADING_FACTS: string[] = [
  'Almost there, your wonderful slides are being generated...',
  'Did you know? People remember 65% of information when paired with an image.',
  'Fun fact: The ideal presentation length is 20 minutes.',
  'Tip: Bullet points are great, but stories make presentations memorable.',
  'Did you know? Interactive polls increase audience engagement by 80%.',
  'Working on it... 90% of anxiety before a presentation is completely normal!',
];

export const DEFAULT_SLIDE_COUNT = 5;
export const GENERATION_STEPS = 10;
export const GENERATION_STEP_DELAY_MS = 300;
export const LOADING_FACT_INTERVAL_MS = 3500;
export const PLACEHOLDER_TYPE_SPEED_MS = 50;
export const PLACEHOLDER_DELETE_SPEED_MS = 30;
export const PLACEHOLDER_PAUSE_MS = 2500;
