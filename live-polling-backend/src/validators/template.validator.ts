import zod from "zod";
import { SlideThemeSchema } from "./slide.validator";

export const CreateTemplateSchema = zod.object({
  title: zod.string().min(1, "Title is required").max(100),
  description: zod.string().max(500).optional(),
  thumbnail: zod.string().optional(),
  category: zod.string().optional(),
  slides: zod.array(zod.record(zod.unknown())).default([]),
  theme: SlideThemeSchema.optional(),
  isPublic: zod.boolean().default(true),
});

export const UpdateTemplateSchema = zod.object({
  title: zod.string().min(1).max(100).optional(),
  description: zod.string().max(500).optional(),
  thumbnail: zod.string().optional(),
  category: zod.string().optional(),
  slides: zod.array(zod.record(zod.unknown())).optional(),
  theme: SlideThemeSchema.optional(),
  isPublic: zod.boolean().optional(),
});

export type CreateTemplateDto = zod.infer<typeof CreateTemplateSchema>;
export type UpdateTemplateDto = zod.infer<typeof UpdateTemplateSchema>;
