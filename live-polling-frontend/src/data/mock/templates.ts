import { ITemplate } from "@/types";

export const TEMPLATES: ITemplate[] = [
  {
    id: "feedback",
    title: "Team Feedback",
    description: "Gather anonymous team feedback",
    thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Business",
  },
  {
    id: "quiz",
    title: "Fun Quiz",
    description: "Test knowledge with interactive quiz",
    thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    category: "Education",
  },
  {
    id: "brainstorm",
    title: "Brainstorming Session",
    description: "Collect and visualize ideas",
    thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    category: "Workshop",
  },
  {
    id: "poll",
    title: "Quick Poll",
    description: "Get instant audience opinions",
    thumbnail: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    category: "Events",
  },
  {
    id: "icebreaker",
    title: "Icebreaker",
    description: "Fun questions to start meetings",
    thumbnail: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    category: "Team",
  },
];
