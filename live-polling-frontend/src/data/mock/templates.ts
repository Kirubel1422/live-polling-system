import { ITemplate } from "@/types";
import { nanoid } from "nanoid";

const defaultTheme = {
  backgroundColor: "#ffffff",
  textColor: "#000000",
  accentColor: "#3b82f6",
  fontFamily: "Inter",
};

export const TEMPLATES: ITemplate[] = [
  {
    id: "feedback",
    title: "Team Feedback",
    description: "Gather anonymous team feedback",
    thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Business",
    slides: [
      {
        id: nanoid(),
        type: "content",
        title: "Welcome to Team Feedback Session",
        subtitle: "Your honest thoughts help us improve.",
        order: 0,
        theme: defaultTheme,
        meta: { content: "Please answer the upcoming questions truthfully. All responses are anonymous." } as any,
        options: []
      },
      {
        id: nanoid(),
        type: "scales",
        title: "How do you rate our recent sprint?",
        order: 1,
        theme: defaultTheme,
        meta: {
          statement: "The sprint goals were clear and achievable.",
          steps: 5,
          scaleLabels: { left: "Strongly Disagree", right: "Strongly Agree" }
        } as any,
        options: []
      },
      {
        id: nanoid(),
        type: "open-ended",
        title: "What went well?",
        order: 2,
        theme: defaultTheme,
        meta: { placeholder: "E.g., Great communication..." } as any,
        options: []
      },
      {
        id: nanoid(),
        type: "open-ended",
        title: "What could be improved?",
        order: 3,
        theme: defaultTheme,
        meta: { placeholder: "E.g., Less meetings..." } as any,
        options: []
      },
      {
        id: nanoid(),
        type: "word-cloud",
        title: "Describe team culture in one word",
        order: 4,
        theme: defaultTheme,
        meta: { maxWords: 1 } as any,
        options: []
      }
    ] as any
  },
  {
    id: "quiz",
    title: "Fun Quiz",
    description: "Test knowledge with interactive quiz",
    thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    category: "Education",
    slides: [
      {
        id: nanoid(),
        type: "content",
        title: "General Knowledge Quiz",
        subtitle: "Let's test your trivia skills!",
        order: 0,
        theme: defaultTheme,
        options: []
      },
      {
        id: nanoid(),
        type: "quiz",
        title: "What is the capital of France?",
        order: 1,
        theme: defaultTheme,
        timeLimit: 30,
        points: 100,
        options: [
          { id: nanoid(), text: "Paris", isCorrect: true, color: "#ef4444" },
          { id: nanoid(), text: "London", isCorrect: false, color: "#3b82f6" },
          { id: nanoid(), text: "Berlin", isCorrect: false, color: "#eab308" },
          { id: nanoid(), text: "Rome", isCorrect: false, color: "#22c55e" }
        ]
      },
      {
        id: nanoid(),
        type: "quiz",
        title: "Which planet is known as the Red Planet?",
        order: 2,
        theme: defaultTheme,
        timeLimit: 30,
        points: 100,
        options: [
          { id: nanoid(), text: "Venus", isCorrect: false, color: "#ef4444" },
          { id: nanoid(), text: "Mars", isCorrect: true, color: "#3b82f6" },
          { id: nanoid(), text: "Jupiter", isCorrect: false, color: "#eab308" },
          { id: nanoid(), text: "Saturn", isCorrect: false, color: "#22c55e" }
        ]
      },
      {
        id: nanoid(),
        type: "ranking",
        title: "Rank these animals by speed (Fastest to Slowest)",
        order: 3,
        theme: defaultTheme,
        items: [
          { id: nanoid(), text: "Cheetah", color: "#ef4444" },
          { id: nanoid(), text: "Lion", color: "#3b82f6" },
          { id: nanoid(), text: "Horse", color: "#eab308" },
          { id: nanoid(), text: "Elephant", color: "#22c55e" }
        ]
      }
    ] as any
  },
  {
    id: "brainstorm",
    title: "Brainstorming Session",
    description: "Collect and visualize ideas",
    thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    category: "Workshop",
    slides: [
      {
        id: nanoid(),
        type: "content",
        title: "Product Feature Brainstorm",
        subtitle: "Let's think about the next big thing.",
        order: 0,
        theme: defaultTheme,
        options: []
      },
      {
        id: nanoid(),
        type: "word-cloud",
        title: "What should be our main focus next quarter?",
        order: 1,
        theme: defaultTheme,
        maxWords: 3,
        options: []
      },
      {
        id: nanoid(),
        type: "qa",
        title: "Submit your feature ideas",
        order: 2,
        theme: defaultTheme,
        allowSubmissions: true,
        questions: [],
        options: []
      },
      {
        id: nanoid(),
        type: "rating",
        title: "Rate the importance of improving UX",
        order: 3,
        theme: defaultTheme,
        ratingType: "stars",
        minValue: 1,
        maxValue: 5,
        options: []
      }
    ] as any
  },
  {
    id: "poll",
    title: "Quick Poll",
    description: "Get instant audience opinions",
    thumbnail: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    category: "Events",
    slides: [
      {
        id: nanoid(),
        type: "multiple-choice",
        title: "What time works best for the daily standup?",
        order: 0,
        theme: defaultTheme,
        options: [
          { id: nanoid(), text: "9:00 AM", color: "#ef4444" },
          { id: nanoid(), text: "10:00 AM", color: "#3b82f6" },
          { id: nanoid(), text: "11:00 AM", color: "#eab308" }
        ]
      },
      {
        id: nanoid(),
        type: "multiple-choice",
        title: "Should we adopt React 19?",
        order: 1,
        theme: defaultTheme,
        options: [
          { id: nanoid(), text: "Yes", color: "#ef4444" },
          { id: nanoid(), text: "No", color: "#3b82f6" },
          { id: nanoid(), text: "Need more info", color: "#eab308" }
        ]
      },
      {
        id: nanoid(),
        type: "rating",
        title: "How satisfied are you with current tools?",
        order: 2,
        theme: defaultTheme,
        ratingType: "emoji",
        minValue: 1,
        maxValue: 5,
        options: []
      }
    ] as any
  },
  {
    id: "icebreaker",
    title: "Icebreaker",
    description: "Fun questions to start meetings",
    thumbnail: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    category: "Team",
    slides: [
      {
        id: nanoid(),
        type: "content",
        title: "Let's break the ice!",
        subtitle: "Time to get to know each other.",
        order: 0,
        theme: defaultTheme,
        options: []
      },
      {
        id: nanoid(),
        type: "multiple-choice",
        title: "Are you an early bird or night owl?",
        order: 1,
        theme: defaultTheme,
        options: [
          { id: nanoid(), text: "Early Bird", color: "#ef4444" },
          { id: nanoid(), text: "Night Owl", color: "#3b82f6" },
          { id: nanoid(), text: "In Between", color: "#eab308" }
        ]
      },
      {
        id: nanoid(),
        type: "open-ended",
        title: "What is your favorite hobby?",
        order: 2,
        theme: defaultTheme,
        meta: { placeholder: "E.g., Reading, Hiking..." } as any,
        options: []
      },
      {
        id: nanoid(),
        type: "word-cloud",
        title: "Where is your dream vacation destination?",
        order: 3,
        theme: defaultTheme,
        maxWords: 1,
        options: []
      },
      {
        id: nanoid(),
        type: "wheel-of-names",
        title: "Who introduces themselves first?",
        order: 4,
        theme: defaultTheme,
        names: ["Alice", "Bob", "Charlie", "Diana"],
        options: []
      }
    ] as any
  },
];
