import zod from "zod";

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const SlideThemeSchema = zod.object({
  backgroundColor: zod.string(),
  textColor: zod.string(),
  accentColor: zod.string(),
  fontFamily: zod.string().optional(),
});

const SlideSettingsSchema = zod.object({
  allowMultipleAnswers: zod.boolean().optional(),
  showResults: zod.boolean().optional(),
  timeLimit: zod.number().optional(),
  isAnonymous: zod.boolean().optional(),
  maxResponses: zod.number().optional(),
  showCorrectAnswer: zod.boolean().optional(),
  pointsPerCorrect: zod.number().optional(),
  moderated: zod.boolean().optional(),
  allowUpvotes: zod.boolean().optional(),
});

const SlideOptionSchema = zod.object({
  id: zod.string(),
  text: zod.string(),
  isCorrect: zod.boolean().optional(),
  color: zod.string().optional(),
  imageUrl: zod.string().url().optional(),
  votes: zod.number().optional(),
});

const SlideSchema = zod.object({
  id: zod.string(),
  type: zod.enum([
    "multiple-choice",
    "open-ended",
    "quiz",
    "content",
    "word-cloud",
    "rating",
    "ranking",
    "scales",
    "pin-on-image",
    "qa",
    "image-choice",
    "number",
    "100-points",
    "wheel-of-names",
  ]),
  title: zod.string().min(1, "Slide title is required"),
  subtitle: zod.string().optional(),
  theme: SlideThemeSchema,
  settings: SlideSettingsSchema.default({}),
  order: zod.number().int().min(0),
  // options — present for choice-based slides
  options: zod.array(SlideOptionSchema).optional(),
  // meta — type-specific extra fields
  meta: zod.record(zod.unknown()).optional(),
});

// ── Presentation schemas ──────────────────────────────────────────────────────

export const CreatePresentationSchema = zod.object({
  title: zod.string().min(1, "Title is required").max(200),
  description: zod.string().max(1000).optional(),
  thumbnail: zod.string().url().optional(),
  status: zod.enum(["draft", "published", "archived"]).default("draft"),
  theme: SlideThemeSchema,
  templateId: zod.string().optional(),
  isAIGenerated: zod.boolean().default(false),
  slides: zod.array(SlideSchema).default([]),
});

export const UpdatePresentationSchema = zod.object({
  title: zod.string().min(1).max(200).optional(),
  description: zod.string().max(1000).optional(),
  thumbnail: zod.string().url().optional(),
  status: zod.enum(["draft", "published", "archived"]).optional(),
  theme: SlideThemeSchema.optional(),
  templateId: zod.string().optional(),
  slides: zod.array(SlideSchema).optional(),
});

export type CreatePresentationDto = zod.infer<typeof CreatePresentationSchema>;
export type UpdatePresentationDto = zod.infer<typeof UpdatePresentationSchema>;
