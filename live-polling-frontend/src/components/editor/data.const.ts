import {
  CheckSquare,
  MessageSquare,
  FileText,
  Cloud,
  Star,
  ListOrdered,
  Sliders,
  MessageCircle,
  PieChart,
  CircleDot,
  Palette,
  Settings,
} from 'lucide-react';
import { type SlideType } from '@/types/presentation';

// From AddSlideMenu.tsx
export const SLIDE_TEMPLATES = [
  { type: 'multiple-choice' as SlideType, label: 'Multiple Choice', description: 'Let participants choose', icon: CheckSquare, category: 'Interactive' },
  { type: 'open-ended' as SlideType, label: 'Open Ended', description: 'Collect text responses', icon: MessageSquare, category: 'Interactive' },
  { type: 'word-cloud' as SlideType, label: 'Word Cloud', description: 'Visualize responses', icon: Cloud, category: 'Interactive' },
  { type: 'rating' as SlideType, label: 'Rating Scale', description: 'Gather ratings', icon: Star, category: 'Interactive' },
  { type: 'ranking' as SlideType, label: 'Ranking', description: 'Rank items in order', icon: ListOrdered, category: 'Interactive' },
  { type: 'scales' as SlideType, label: 'Opinion Scale', description: 'Likert scale', icon: Sliders, category: 'Interactive' },
  { type: 'qa' as SlideType, label: 'Q&A', description: 'Collect questions', icon: MessageCircle, category: 'Interactive' },
  { type: '100-points' as SlideType, label: '100 Points', description: 'Distribute points', icon: PieChart, category: 'Interactive' },
  { type: 'content' as SlideType, label: 'Content', description: 'Text and images', icon: FileText, category: 'Content' },
  { type: 'wheel-of-names' as SlideType, label: 'Wheel of Names', description: 'Random picker', icon: CircleDot, category: 'Fun' },
];

// From RightPanel.tsx
export const RIGHT_PANEL_TABS = [
  { id: "design" as const, label: "Design", icon: Palette },
  { id: "settings" as const, label: "Settings", icon: Settings },
];

export const OPTION_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#a855f7", // Purple
  "#d946ef", // Fuchsia
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#eab308", // Yellow
];

// From SlideCanvas.tsx
export const WORD_CLOUD_SAMPLE_WORDS = [
  "Innovation",
  "Teamwork",
  "Growth",
  "Success",
  "Ideas",
  "Creativity",
];

export const QA_SAMPLE_QUESTIONS = [
  { text: "How will this affect our roadmap?", upvotes: 12 },
  { text: "When can we expect the next release?", upvotes: 8 },
  { text: "What are the key metrics for success?", upvotes: 5 },
];

export const WHEEL_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
];
