export type SlideType =
  | "multiple-choice"
  | "open-ended"
  | "quiz"
  | "content"
  | "word-cloud"
  | "rating"
  | "ranking"
  | "scales"
  | "pin-on-image"
  | "qa"
  | "image-choice"
  | "number"
  | "100-points"
  | "wheel-of-names";

export interface SlideOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  color?: string;
  imageUrl?: string;
  votes?: number;
}

export interface SlideSettings {
  allowMultipleAnswers?: boolean;
  showResults?: boolean;
  timeLimit?: number;
  isAnonymous?: boolean;
  maxResponses?: number;
  showCorrectAnswer?: boolean;
  pointsPerCorrect?: number;
  moderated?: boolean;
  allowUpvotes?: boolean;
}

export interface SlideTheme {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily?: string;
}

export interface BaseSlide {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  theme: SlideTheme;
  settings: SlideSettings;
  order: number;
}

// Interactive Slide Types
export interface MultipleChoiceSlide extends BaseSlide {
  type: "multiple-choice";
  options: SlideOption[];
}

export interface OpenEndedSlide extends BaseSlide {
  type: "open-ended";
  placeholder?: string;
  maxLength?: number;
}

export interface QuizSlide extends BaseSlide {
  type: "quiz";
  options: SlideOption[];
  timeLimit: number;
  points: number;
}

export interface WordCloudSlide extends BaseSlide {
  type: "word-cloud";
  maxWords?: number;
  profanityFilter?: boolean;
}

export interface RatingSlide extends BaseSlide {
  type: "rating";
  ratingType: "stars" | "numbers" | "slider" | "nps" | "emoji";
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface RankingSlide extends BaseSlide {
  type: "ranking";
  items: SlideOption[];
}

export interface ScalesSlide extends BaseSlide {
  type: "scales";
  statement: string;
  scaleLabels: { left: string; right: string };
  steps: 5 | 7;
}

export interface PinOnImageSlide extends BaseSlide {
  type: "pin-on-image";
  imageUrl: string;
  question: string;
}

export interface QASlide extends BaseSlide {
  type: "qa";
  allowSubmissions?: boolean;
  questions?: { id: string; text: string; upvotes: number; author?: string }[];
}

export interface ImageChoiceSlide extends BaseSlide {
  type: "image-choice";
  options: SlideOption[];
}

export interface NumberSlide extends BaseSlide {
  type: "number";
  minValue?: number;
  maxValue?: number;
  unit?: string;
}

export interface PointsSlide extends BaseSlide {
  type: "100-points";
  items: SlideOption[];
  totalPoints: number;
}

export interface WheelSlide extends BaseSlide {
  type: "wheel-of-names";
  names: string[];
  selectedName?: string;
}

// Content Slide Type
export interface ContentSlide extends BaseSlide {
  type: "content";
  content: string;
  imageUrl?: string;
  layout: "center" | "left" | "right" | "full-image";
}

export type Slide =
  | MultipleChoiceSlide
  | OpenEndedSlide
  | QuizSlide
  | ContentSlide
  | WordCloudSlide
  | RatingSlide
  | RankingSlide
  | ScalesSlide
  | PinOnImageSlide
  | QASlide
  | ImageChoiceSlide
  | NumberSlide
  | PointsSlide
  | WheelSlide;

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  status: "draft" | "published" | "archived";
  theme: SlideTheme;
  joinCode?: string;
  isAIGenerated: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  slides: Partial<Slide>[];
}

export const DEFAULT_THEME: SlideTheme = {
  backgroundColor: "#ffffff",
  textColor: "#1a1a2e",
  accentColor: "#6366f1",
  fontFamily: "Geist",
};

export const THEMES: Record<string, SlideTheme> = {
  "menti-dark": {
    backgroundColor: "#1a1a2e",
    textColor: "#ffffff",
    accentColor: "#0097AF",
  },
  rosehip: {
    backgroundColor: "#7b1d1d",
    textColor: "#fff5f5",
    accentColor: "#f87171",
  },
  pistachio: {
    backgroundColor: "#1a3d2b",
    textColor: "#f0fdf4",
    accentColor: "#6AB68D",
  },
  ocean: {
    backgroundColor: "#0c2a4a",
    textColor: "#e0f2fe",
    accentColor: "#38bdf8",
  },
  sunset: {
    backgroundColor: "#431407",
    textColor: "#fff7ed",
    accentColor: "#fb923c",
  },
  monochrome: {
    backgroundColor: "#1c1917",
    textColor: "#f5f5f4",
    accentColor: "#a8a29e",
  },
  light: {
    backgroundColor: "#f8fafc",
    textColor: "#0f172a",
    accentColor: "#0097AF",
  },
};

export const SLIDE_TYPE_INFO: Record<
  SlideType,
  {
    label: string;
    description: string;
    icon: string;
    category: "interactive" | "content" | "fun";
  }
> = {
  "multiple-choice": {
    label: "Multiple Choice",
    description: "Let participants choose from options",
    icon: "CheckSquare",
    category: "interactive",
  },
  "open-ended": {
    label: "Open Ended",
    description: "Collect free-text responses",
    icon: "MessageSquare",
    category: "interactive",
  },
  quiz: {
    label: "Quiz",
    description: "Test knowledge with timed questions",
    icon: "HelpCircle",
    category: "interactive",
  },
  "word-cloud": {
    label: "Word Cloud",
    description: "Visualize popular responses",
    icon: "Cloud",
    category: "interactive",
  },
  rating: {
    label: "Rating Scale",
    description: "Gather ratings on a scale",
    icon: "Star",
    category: "interactive",
  },
  ranking: {
    label: "Ranking",
    description: "Let participants rank items",
    icon: "ListOrdered",
    category: "interactive",
  },
  scales: {
    label: "Opinion Scale",
    description: "Likert scale for opinions",
    icon: "Sliders",
    category: "interactive",
  },
  "pin-on-image": {
    label: "Pin on Image",
    description: "Place pins on an image",
    icon: "MapPin",
    category: "interactive",
  },
  qa: {
    label: "Q&A",
    description: "Collect and upvote questions",
    icon: "MessageCircle",
    category: "interactive",
  },
  "image-choice": {
    label: "Image Choice",
    description: "Choose from image options",
    icon: "Images",
    category: "interactive",
  },
  number: {
    label: "Number Input",
    description: "Collect numeric responses",
    icon: "Hash",
    category: "interactive",
  },
  "100-points": {
    label: "100 Points",
    description: "Distribute points across items",
    icon: "PieChart",
    category: "interactive",
  },
  content: {
    label: "Content",
    description: "Present information with text and images",
    icon: "FileText",
    category: "content",
  },
  "wheel-of-names": {
    label: "Wheel of Names",
    description: "Spin to pick a random name",
    icon: "CircleDot",
    category: "fun",
  },
};

// Response types for participant data
export interface ParticipantResponse {
  id: string;
  participantId: string;
  participantName?: string;
  slideId: string;
  value: unknown;
  createdAt: string;
}

export interface Participant {
  id: string;
  name: string;
  joinedAt: string;
  score?: number;
}

export interface LiveSession {
  presentationId: string;
  joinCode: string;
  currentSlideIndex: number;
  participants: Participant[];
  responses: ParticipantResponse[];
  isLive: boolean;
  startedAt?: string;
}
