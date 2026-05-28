import zod from "zod";

// ── Shared sub-schemas ────────────────────────────────────────────────────────

export const SlideThemeSchema = zod.object({
  backgroundColor: zod.string(),
  textColor: zod.string(),
  accentColor: zod.string(),
  fontFamily: zod.string().optional(),
});

export const SlideSettingsSchema = zod.object({
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

export const SlideOptionSchema = zod.object({
  id: zod.string(),
  text: zod.string().min(1, "Option text is required"),
  isCorrect: zod.boolean().optional(),
  color: zod.string().optional(),
  imageUrl: zod.string().url("Invalid image URL").optional(),
  votes: zod.number().int().min(0).optional(),
});

// ── Type-specific meta schemas ────────────────────────────────────────────────
// Each validates the JSONB meta column for that slide type.

/** content */
const ContentMetaSchema = zod.object({
  content: zod.string().optional(),
  imageUrl: zod.string().url().optional(),
  layout: zod.enum(["center", "left", "right", "full-image"]).optional(),
});

/** open-ended */
const OpenEndedMetaSchema = zod.object({
  placeholder: zod.string().optional(),
  maxLength: zod.number().int().positive().optional(),
});

/** quiz — time limit and points live in meta */
const QuizMetaSchema = zod.object({
  timeLimit: zod.number().int().min(10).max(300).default(30),
  points: zod.number().int().min(50).max(500).default(100),
});

/** word-cloud */
const WordCloudMetaSchema = zod.object({
  maxWords: zod.number().int().min(1).max(10).optional(),
  profanityFilter: zod.boolean().optional(),
});

/** rating */
const RatingMetaSchema = zod.object({
  ratingType: zod.enum(["stars", "numbers", "slider", "nps", "emoji"]),
  minValue: zod.number().int().default(1),
  maxValue: zod.number().int().default(5),
  minLabel: zod.string().optional(),
  maxLabel: zod.string().optional(),
});

/** scales (Likert) */
const ScalesMetaSchema = zod.object({
  statement: zod.string().min(1, "Statement is required"),
  scaleLabels: zod.object({
    left: zod.string(),
    right: zod.string(),
  }),
  steps: zod.union([zod.literal(5), zod.literal(7)]).default(5),
});

/** pin-on-image */
const PinOnImageMetaSchema = zod.object({
  imageUrl: zod.string().url("Image URL is required"),
  question: zod.string().min(1),
});

/** qa */
const QAMetaSchema = zod.object({
  allowSubmissions: zod.boolean().optional(),
  questions: zod
    .array(
      zod.object({
        id: zod.string(),
        text: zod.string(),
        upvotes: zod.number().int().min(0).default(0),
        author: zod.string().optional(),
      })
    )
    .optional(),
});

/** number input */
const NumberMetaSchema = zod.object({
  minValue: zod.number().optional(),
  maxValue: zod.number().optional(),
  unit: zod.string().optional(),
});

/** 100-points */
const PointsMetaSchema = zod.object({
  totalPoints: zod.number().int().min(1).default(100),
});

/** wheel-of-names */
const WheelMetaSchema = zod.object({
  names: zod.array(zod.string()).min(2, "At least 2 names are required"),
  selectedName: zod.string().optional(),
});

// ── Main slide type enum ──────────────────────────────────────────────────────

export const SLIDE_TYPES = [
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
] as const;

// ── CreateSlide schema ────────────────────────────────────────────────────────

export const CreateSlideSchema = zod.object({
  type: zod.enum(SLIDE_TYPES),
  title: zod.string().min(1, "Slide title is required").max(300),
  subtitle: zod.string().max(500).optional(),
  order: zod.number().int().min(0),
  theme: SlideThemeSchema,
  settings: SlideSettingsSchema.default({}),

  /**
   * Choice-based options (multiple-choice, quiz, ranking, image-choice, 100-points).
   * The server validates that options are provided when the type requires them.
   */
  options: zod.array(SlideOptionSchema).optional(),

  /**
   * Type-specific extra fields stored as JSONB meta.
   * Validated loosely here (record of unknown) — each route can do
   * deep type-specific validation if needed in the future.
   */
  meta: zod.record(zod.unknown()).optional(),
});

// ── UpdateSlide schema ────────────────────────────────────────────────────────

export const UpdateSlideSchema = zod.object({
  title: zod.string().min(1).max(300).optional(),
  subtitle: zod.string().max(500).optional(),
  order: zod.number().int().min(0).optional(),
  theme: SlideThemeSchema.optional(),
  settings: SlideSettingsSchema.optional(),
  options: zod.array(SlideOptionSchema).optional(),
  meta: zod.record(zod.unknown()).optional(),
});

// ── Reorder schema ────────────────────────────────────────────────────────────

export const ReorderSlidesSchema = zod.object({
  /**
   * Array of slide IDs in the desired order.
   * The server will update the `order` field of each slide accordingly.
   */
  slideIds: zod
    .array(zod.string().uuid("Invalid slide ID"))
    .min(1, "slideIds must not be empty"),
});

// ── Exported types ────────────────────────────────────────────────────────────

export type CreateSlideDto = zod.infer<typeof CreateSlideSchema>;
export type UpdateSlideDto = zod.infer<typeof UpdateSlideSchema>;
export type ReorderSlidesDto = zod.infer<typeof ReorderSlidesSchema>;

// Re-export meta schemas for use in service-level validation if needed
export {
  ContentMetaSchema,
  OpenEndedMetaSchema,
  QuizMetaSchema,
  WordCloudMetaSchema,
  RatingMetaSchema,
  ScalesMetaSchema,
  PinOnImageMetaSchema,
  QAMetaSchema,
  NumberMetaSchema,
  PointsMetaSchema,
  WheelMetaSchema,
};
