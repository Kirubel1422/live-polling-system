import dotenv from "dotenv";
dotenv.config();

import { AppDataSource, connectDatabase } from "../configs/database";
import { TemplateEntity } from "../entities/Template.entity";
import logger from "../utils/logger/logger";
import crypto from "crypto";

const defaultTheme = {
  backgroundColor: "#ffffff",
  textColor: "#000000",
  accentColor: "#3b82f6",
  fontFamily: "Inter",
};

const mockTemplates = [
  {
    id: "feedback",
    title: "Team Feedback",
    description: "Gather anonymous team feedback",
    thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Business",
    slides: [
      {
        id: crypto.randomUUID(),
        type: "content",
        title: "Welcome to Team Feedback Session",
        subtitle: "Your honest thoughts help us improve.",
        order: 0,
        theme: defaultTheme,
        meta: { content: "Please answer the upcoming questions truthfully. All responses are anonymous." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "content",
        title: "Reviewing our recent milestones",
        subtitle: "Let's reflect on what we accomplished together.",
        order: 1,
        theme: defaultTheme,
        meta: { content: "Our major achievements include the new dashboard launch, resolving critical technical debt, and successfully onboarding three new team members." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "scales",
        title: "How do you rate our recent sprint?",
        order: 2,
        theme: defaultTheme,
        meta: {
          statement: "The sprint goals were clear and achievable.",
          steps: 5,
          scaleLabels: { left: "Strongly Disagree", right: "Strongly Agree" }
        },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "rating",
        title: "Overall satisfaction with our communication?",
        order: 3,
        theme: defaultTheme,
        meta: { ratingType: "stars", minValue: 1, maxValue: 5 },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "open-ended",
        title: "What went well?",
        order: 4,
        theme: defaultTheme,
        meta: { placeholder: "E.g., Great communication..." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "open-ended",
        title: "What could be improved?",
        order: 5,
        theme: defaultTheme,
        meta: { placeholder: "E.g., Less meetings..." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "word-cloud",
        title: "Describe team culture in one word",
        order: 6,
        theme: defaultTheme,
        meta: { maxWords: 1 },
        options: []
      }
    ]
  },
  {
    id: "quiz",
    title: "Fun Quiz",
    description: "Test knowledge with interactive quiz",
    thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    category: "Education",
    slides: [
      {
        id: crypto.randomUUID(),
        type: "content",
        title: "General Knowledge Quiz",
        subtitle: "Let's test your trivia skills!",
        order: 0,
        theme: defaultTheme,
        meta: { content: "Get ready! The faster you answer, the more points you get. Let the best player win!" },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "quiz",
        title: "What is the capital of France?",
        order: 1,
        theme: defaultTheme,
        meta: { timeLimit: 30, points: 100 },
        options: [
          { id: crypto.randomUUID(), text: "Paris", isCorrect: true, color: "#ef4444" },
          { id: crypto.randomUUID(), text: "London", isCorrect: false, color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "Berlin", isCorrect: false, color: "#eab308" },
          { id: crypto.randomUUID(), text: "Rome", isCorrect: false, color: "#22c55e" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "quiz",
        title: "Which planet is known as the Red Planet?",
        order: 2,
        theme: defaultTheme,
        meta: { timeLimit: 30, points: 100 },
        options: [
          { id: crypto.randomUUID(), text: "Venus", isCorrect: false, color: "#ef4444" },
          { id: crypto.randomUUID(), text: "Mars", isCorrect: true, color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "Jupiter", isCorrect: false, color: "#eab308" },
          { id: crypto.randomUUID(), text: "Saturn", isCorrect: false, color: "#22c55e" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "content",
        title: "Halfway Point!",
        subtitle: "Check the leaderboard on the main screen.",
        order: 3,
        theme: defaultTheme,
        meta: { content: "Don't give up yet, the hardest questions are coming up next." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "quiz",
        title: "Who painted the Mona Lisa?",
        order: 4,
        theme: defaultTheme,
        meta: { timeLimit: 30, points: 200 },
        options: [
          { id: crypto.randomUUID(), text: "Vincent Van Gogh", isCorrect: false, color: "#ef4444" },
          { id: crypto.randomUUID(), text: "Pablo Picasso", isCorrect: false, color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "Leonardo da Vinci", isCorrect: true, color: "#eab308" },
          { id: crypto.randomUUID(), text: "Michelangelo", isCorrect: false, color: "#22c55e" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "quiz",
        title: "What is the hardest natural substance on Earth?",
        order: 5,
        theme: defaultTheme,
        meta: { timeLimit: 30, points: 200 },
        options: [
          { id: crypto.randomUUID(), text: "Gold", isCorrect: false, color: "#ef4444" },
          { id: crypto.randomUUID(), text: "Iron", isCorrect: false, color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "Diamond", isCorrect: true, color: "#eab308" },
          { id: crypto.randomUUID(), text: "Quartz", isCorrect: false, color: "#22c55e" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "ranking",
        title: "Rank these animals by speed (Fastest to Slowest)",
        order: 6,
        theme: defaultTheme,
        options: [
          { id: crypto.randomUUID(), text: "Cheetah", color: "#ef4444" },
          { id: crypto.randomUUID(), text: "Lion", color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "Horse", color: "#eab308" },
          { id: crypto.randomUUID(), text: "Elephant", color: "#22c55e" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "qa",
        title: "Any disputes about the answers?",
        order: 7,
        theme: defaultTheme,
        meta: { allowSubmissions: true, questions: [] },
        options: []
      }
    ]
  },
  {
    id: "brainstorm",
    title: "Brainstorming Session",
    description: "Collect and visualize ideas",
    thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    category: "Workshop",
    slides: [
      {
        id: crypto.randomUUID(),
        type: "content",
        title: "Product Feature Brainstorm",
        subtitle: "Let's think about the next big thing.",
        order: 0,
        theme: defaultTheme,
        meta: { content: "There are no bad ideas. Feel free to pitch anything that crosses your mind!" },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "content",
        title: "Current Market Analysis",
        subtitle: "Where we stand today",
        order: 1,
        theme: defaultTheme,
        meta: { content: "Our users are demanding more AI integration, faster loading times, and mobile-friendly interfaces." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "word-cloud",
        title: "What should be our main focus next quarter?",
        order: 2,
        theme: defaultTheme,
        meta: { maxWords: 3 },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "open-ended",
        title: "Detail your biggest, craziest idea:",
        order: 3,
        theme: defaultTheme,
        meta: { placeholder: "We could build a virtual reality integration..." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "qa",
        title: "Submit your feature ideas",
        order: 4,
        theme: defaultTheme,
        meta: { allowSubmissions: true, questions: [] },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "rating",
        title: "Rate the importance of improving UX",
        order: 5,
        theme: defaultTheme,
        meta: { ratingType: "stars", minValue: 1, maxValue: 5 },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "scales",
        title: "Evaluate our readiness for these ideas",
        order: 6,
        theme: defaultTheme,
        meta: {
          statement: "We have the resources to build these features immediately.",
          steps: 5,
          scaleLabels: { left: "Not ready at all", right: "Fully prepared" }
        },
        options: []
      }
    ]
  },
  {
    id: "poll",
    title: "Quick Poll",
    description: "Get instant audience opinions",
    thumbnail: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    category: "Events",
    slides: [
      {
        id: crypto.randomUUID(),
        type: "content",
        title: "Quick Alignment Poll",
        subtitle: "We need your vote on a few key decisions.",
        order: 0,
        theme: defaultTheme,
        meta: { content: "Your feedback will directly influence our roadmap for the next two months." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "multiple-choice",
        title: "What time works best for the daily standup?",
        order: 1,
        theme: defaultTheme,
        options: [
          { id: crypto.randomUUID(), text: "9:00 AM", color: "#ef4444" },
          { id: crypto.randomUUID(), text: "10:00 AM", color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "11:00 AM", color: "#eab308" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "multiple-choice",
        title: "Should we adopt React 19?",
        order: 2,
        theme: defaultTheme,
        options: [
          { id: crypto.randomUUID(), text: "Yes", color: "#ef4444" },
          { id: crypto.randomUUID(), text: "No", color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "Need more info", color: "#eab308" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "multiple-choice",
        title: "Which cloud provider should we migrate to?",
        order: 3,
        theme: defaultTheme,
        options: [
          { id: crypto.randomUUID(), text: "AWS", color: "#ef4444" },
          { id: crypto.randomUUID(), text: "Google Cloud", color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "Azure", color: "#eab308" },
          { id: crypto.randomUUID(), text: "Stay on current", color: "#22c55e" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "open-ended",
        title: "Any specific concerns about the migration?",
        order: 4,
        theme: defaultTheme,
        meta: { placeholder: "I'm worried about downtime during the transition..." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "rating",
        title: "How satisfied are you with current internal tools?",
        order: 5,
        theme: defaultTheme,
        meta: { ratingType: "emoji", minValue: 1, maxValue: 5 },
        options: []
      }
    ]
  },
  {
    id: "icebreaker",
    title: "Icebreaker",
    description: "Fun questions to start meetings",
    thumbnail: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    category: "Team",
    slides: [
      {
        id: crypto.randomUUID(),
        type: "content",
        title: "Let's break the ice!",
        subtitle: "Time to get to know each other.",
        order: 0,
        theme: defaultTheme,
        meta: { content: "We have some new faces today. Let's start with a few fun questions before diving into the agenda!" },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "multiple-choice",
        title: "Are you an early bird or night owl?",
        order: 1,
        theme: defaultTheme,
        options: [
          { id: crypto.randomUUID(), text: "Early Bird", color: "#ef4444" },
          { id: crypto.randomUUID(), text: "Night Owl", color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "In Between", color: "#eab308" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "quiz",
        title: "Can you guess the company's founding year?",
        order: 2,
        theme: defaultTheme,
        meta: { timeLimit: 20, points: 50 },
        options: [
          { id: crypto.randomUUID(), text: "2010", isCorrect: false, color: "#ef4444" },
          { id: crypto.randomUUID(), text: "2015", isCorrect: true, color: "#3b82f6" },
          { id: crypto.randomUUID(), text: "2018", isCorrect: false, color: "#eab308" },
          { id: crypto.randomUUID(), text: "2020", isCorrect: false, color: "#22c55e" }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: "open-ended",
        title: "What is your favorite hobby?",
        order: 3,
        theme: defaultTheme,
        meta: { placeholder: "E.g., Reading, Hiking..." },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "word-cloud",
        title: "Where is your dream vacation destination?",
        order: 4,
        theme: defaultTheme,
        meta: { maxWords: 1 },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "qa",
        title: "Ask anonymous questions to the newcomers",
        order: 5,
        theme: defaultTheme,
        meta: { allowSubmissions: true, questions: [] },
        options: []
      },
      {
        id: crypto.randomUUID(),
        type: "wheel-of-names",
        title: "Who introduces themselves first?",
        order: 6,
        theme: defaultTheme,
        meta: { names: ["Alice", "Bob", "Charlie", "Diana"] },
        options: []
      }
    ]
  },
];

const seedTemplates = async () => {
  await connectDatabase();
  
  // Force synchronization to ensure tables exist
  logger.info("Synchronizing database schema...");
  await AppDataSource.synchronize(false);

  try {
    logger.info("Ensuring joinCode column exists on templates table...");
    await AppDataSource.query(`ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "joinCode" varchar UNIQUE`);
  } catch (error) {
    logger.warn(`Could not add joinCode column (it might already exist): ${error}`);
  }

  const repo = AppDataSource.getRepository(TemplateEntity);

  logger.info("Checking for existing templates...");
  const count = await repo.count();

  if (count > 0) {
    logger.info(`Found ${count} templates. Clearing...`);
    await repo.query("TRUNCATE TABLE templates CASCADE;");
  }

  logger.info("Seeding templates...");
  
  const entities = mockTemplates.map(template => {
    let joinCode = "";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    for (let i = 0; i < 4; i++) joinCode += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 2; i++) joinCode += numbers.charAt(Math.floor(Math.random() * numbers.length));

    return repo.create({
      id: template.id,
      title: template.title,
      description: template.description,
      thumbnail: template.thumbnail,
      category: template.category,
      slides: template.slides,
      isPublic: true,
      joinCode: joinCode,
    });
  });

  await repo.save(entities);
  logger.info(`Successfully seeded ${entities.length} templates.`);

  // Clear template caches in Redis
  try {
    const { connectRedis, disconnectRedis } = await import("../configs/redis");
    const { CacheService } = await import("../utils/cache/cache.service");
    await connectRedis();
    await CacheService.deletePattern("template:*");
    logger.info("Template caches cleared.");
    await disconnectRedis();
  } catch (err) {
    logger.warn(`Could not clear Redis cache (Redis may not be running): ${err}`);
  }
  
  process.exit(0);
};

seedTemplates().catch(error => {
  logger.error(`Error seeding templates: ${error}`);
  process.exit(1);
});
