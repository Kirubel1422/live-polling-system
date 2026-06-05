import fs from "fs";
import path from "path";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";

// ── Valid slide types (mirrors Slide.entity.ts) ────────────────────────────
const VALID_SLIDE_TYPES = new Set([
  "content", "multiple-choice", "quiz", "open-ended", "word-cloud", "rating",
  "ranking", "scales", "number", "100-points", "qa", "wheel-of-names",
  "image-choice", "pin-on-image",
]);

const INTERACTIVE_CLOSERS = new Set(["qa", "open-ended", "word-cloud"]);

const OPTION_REQUIRED_TYPES = new Set([
  "multiple-choice", "quiz", "ranking", "100-points", "image-choice",
]);

const NO_OPTION_TYPES = new Set([
  "content", "open-ended", "word-cloud", "rating", "scales", "number",
  "qa", "wheel-of-names", "pin-on-image",
]);

type SchemaType = "presentation" | "enhancement" | "context";

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class AIJsonValidatorService {
  private presentationPrompt: string;
  private enhancementPrompt: string;
  private contextPrompt: string;

  constructor() {
    this.presentationPrompt = this.loadPrompt("json-correction-presentation.txt", "You are a JSON correction engine for presentations.");
    this.enhancementPrompt = this.loadPrompt("json-correction-enhancement.txt", "You are a JSON correction engine for enhancements.");
    this.contextPrompt = this.loadPrompt("json-correction-context.txt", "You are a JSON correction engine for context building.");
  }

  private loadPrompt(filename: string, fallback: string): string {
    try {
      const p = path.join(__dirname, "prompts", filename);
      return fs.readFileSync(p, "utf-8");
    } catch (error) {
      logger.error(`Failed to read JSON correction prompt file: ${filename}`, error);
      return fallback;
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Schema validators
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  private isHexColor(val: unknown): boolean {
    return typeof val === "string" && /^#[0-9a-fA-F]{3,8}$/.test(val);
  }

  private validateTheme(theme: any, path: string): string[] {
    const errors: string[] = [];
    if (!theme || typeof theme !== "object") {
      errors.push(`${path} must be an object`);
      return errors;
    }
    if (!this.isHexColor(theme.backgroundColor)) errors.push(`${path}.backgroundColor must be a valid hex color`);
    if (!this.isHexColor(theme.textColor)) errors.push(`${path}.textColor must be a valid hex color`);
    if (!this.isHexColor(theme.accentColor)) errors.push(`${path}.accentColor must be a valid hex color`);
    if (typeof theme.fontFamily !== "string" || !theme.fontFamily) errors.push(`${path}.fontFamily must be a non-empty string`);
    return errors;
  }

  private validateOption(opt: any, index: number, slideIndex: number): string[] {
    const errors: string[] = [];
    const p = `slides[${slideIndex}].options[${index}]`;
    if (!opt || typeof opt !== "object") {
      errors.push(`${p} must be an object`);
      return errors;
    }
    if (typeof opt.text !== "string" || !opt.text) errors.push(`${p}.text must be a non-empty string`);
    if (opt.isCorrect !== null && typeof opt.isCorrect !== "boolean") errors.push(`${p}.isCorrect must be boolean or null`);
    if (!this.isHexColor(opt.color)) errors.push(`${p}.color must be a valid hex color`);
    if (typeof opt.order !== "number") errors.push(`${p}.order must be a number`);
    return errors;
  }

  private validateSlide(slide: any, index: number, totalSlides: number): string[] {
    const errors: string[] = [];
    const p = `slides[${index}]`;

    if (!slide || typeof slide !== "object") {
      errors.push(`${p} must be an object`);
      return errors;
    }

    // type
    if (!VALID_SLIDE_TYPES.has(slide.type)) {
      errors.push(`${p}.type "${slide.type}" is not a valid slide type`);
    }

    // title
    if (typeof slide.title !== "string" || !slide.title) {
      errors.push(`${p}.title must be a non-empty string`);
    }

    // subtitle (string | null)
    if (slide.subtitle !== null && slide.subtitle !== undefined && typeof slide.subtitle !== "string") {
      errors.push(`${p}.subtitle must be a string or null`);
    }

    // order
    if (typeof slide.order !== "number") {
      errors.push(`${p}.order must be a number`);
    } else if (slide.order !== index) {
      errors.push(`${p}.order is ${slide.order} but expected ${index} (must be 0-based sequential)`);
    }

    // theme
    errors.push(...this.validateTheme(slide.theme, `${p}.theme`));

    // settings
    if (!slide.settings || typeof slide.settings !== "object") {
      errors.push(`${p}.settings must be an object (at minimum {})`);
    }

    // meta
    if (!slide.meta || typeof slide.meta !== "object") {
      errors.push(`${p}.meta must be an object (at minimum {})`);
    }

    // options
    if (!Array.isArray(slide.options)) {
      errors.push(`${p}.options must be an array (at minimum [])`);
    } else {
      // Type-specific option validation
      if (OPTION_REQUIRED_TYPES.has(slide.type) && slide.options.length < 2) {
        errors.push(`${p} (type "${slide.type}") must have at least 2 options`);
      }
      if (NO_OPTION_TYPES.has(slide.type) && slide.options.length > 0) {
        errors.push(`${p} (type "${slide.type}") should have an empty options array`);
      }

      // Quiz: exactly one correct
      if (slide.type === "quiz") {
        const correctCount = slide.options.filter((o: any) => o?.isCorrect === true).length;
        if (correctCount !== 1) {
          errors.push(`${p} (quiz) must have exactly 1 option with isCorrect=true, found ${correctCount}`);
        }
      }

      // Validate each option
      for (let i = 0; i < slide.options.length; i++) {
        errors.push(...this.validateOption(slide.options[i], i, index));
      }
    }

    // Structural: first slide must be content
    if (index === 0 && slide.type !== "content") {
      errors.push(`First slide (order 0) must be type "content", got "${slide.type}"`);
    }

    // Structural: last slide must be interactive closer
    if (index === totalSlides - 1 && !INTERACTIVE_CLOSERS.has(slide.type)) {
      errors.push(`Last slide must be an interactive type (qa, open-ended, or word-cloud), got "${slide.type}"`);
    }

    return errors;
  }

  private validatePresentationSchema(data: any): ValidationResult {
    const errors: string[] = [];

    // Top-level keys
    if (!data || typeof data !== "object") {
      return { valid: false, errors: ["Root must be a JSON object"] };
    }

    // presentation object
    if (!data.presentation || typeof data.presentation !== "object") {
      errors.push(`"presentation" key must be an object`);
    } else {
      if (typeof data.presentation.title !== "string" || !data.presentation.title) {
        errors.push(`presentation.title must be a non-empty string`);
      }
      if (typeof data.presentation.description !== "string") {
        errors.push(`presentation.description must be a string`);
      }
      errors.push(...this.validateTheme(data.presentation.theme, "presentation.theme"));
    }

    // slides array
    if (!Array.isArray(data.slides)) {
      errors.push(`"slides" must be an array`);
    } else {
      if (data.slides.length === 0) {
        errors.push(`"slides" array must have at least 1 slide`);
      }
      if (data.slides.length > 15) {
        errors.push(`"slides" array must not exceed 15 slides, got ${data.slides.length}`);
      }

      // No consecutive same-type
      for (let i = 1; i < data.slides.length; i++) {
        if (data.slides[i]?.type && data.slides[i - 1]?.type && data.slides[i].type === data.slides[i - 1].type) {
          errors.push(`Slides ${i - 1} and ${i} have the same type "${data.slides[i].type}" — consecutive same-type slides are not allowed`);
        }
      }

      for (let i = 0; i < data.slides.length; i++) {
        errors.push(...this.validateSlide(data.slides[i], i, data.slides.length));
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private validateContextSchema(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data || typeof data !== "object") {
      return { valid: false, errors: ["Root must be a JSON object"] };
    }

    if (typeof data.ready !== "boolean") {
      errors.push(`"ready" must be a boolean`);
    }

    if (data.ready === false) {
      if (typeof data.question !== "string" || !data.question) {
        errors.push(`When ready=false, "question" must be a non-empty string`);
      }
      if (data.enrichedPrompt !== null && data.enrichedPrompt !== undefined) {
        errors.push(`When ready=false, "enrichedPrompt" must be null`);
      }
    }

    if (data.ready === true) {
      if (data.question !== null && data.question !== undefined) {
        errors.push(`When ready=true, "question" must be null`);
      }
      if (typeof data.enrichedPrompt !== "string" || !data.enrichedPrompt) {
        errors.push(`When ready=true, "enrichedPrompt" must be a non-empty string`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate parsed JSON against the expected schema.
   */
  public validate(data: any, schemaType: SchemaType): ValidationResult {
    switch (schemaType) {
      case "presentation":
      case "enhancement":
        return this.validatePresentationSchema(data);
      case "context":
        return this.validateContextSchema(data);
      default:
        return { valid: false, errors: [`Unknown schema type: ${schemaType}`] };
    }
  }

  /**
   * Validate and, if invalid, send to LLM for correction.
   * Returns the validated (or corrected) data.
   * Throws if correction also fails after max attempts.
   */
  public async validateAndCorrect(
    data: any,
    schemaType: SchemaType,
    maxCorrectionAttempts: number = 1
  ): Promise<any> {
    // First pass: validate
    const result = this.validate(data, schemaType);
    if (result.valid) {
      logger.info(`JSON validation passed for schema "${schemaType}"`);
      return data;
    }

    logger.warn(
      `JSON validation failed for schema "${schemaType}" with ${result.errors.length} error(s):\n${result.errors.map(e => `  - ${e}`).join("\n")}`
    );

    // Attempt LLM correction
    for (let attempt = 1; attempt <= maxCorrectionAttempts; attempt++) {
      logger.info(`Attempting LLM JSON correction (Attempt ${attempt}/${maxCorrectionAttempts}) for schema "${schemaType}"`);

      try {
        const corrected = await this.requestCorrection(data, schemaType, result.errors);
        const revalidation = this.validate(corrected, schemaType);

        if (revalidation.valid) {
          logger.info(`LLM correction succeeded on attempt ${attempt} for schema "${schemaType}"`);
          return corrected;
        }

        logger.warn(
          `LLM correction attempt ${attempt} still invalid:\n${revalidation.errors.map(e => `  - ${e}`).join("\n")}`
        );

        // Use the corrected (but still invalid) output for the next attempt
        data = corrected;
      } catch (correctionError: any) {
        logger.error(`LLM correction attempt ${attempt} threw an error:`, correctionError);
      }
    }

    throw new Error(
      `JSON validation failed for schema "${schemaType}" and LLM correction could not fix it. Errors: ${result.errors.join("; ")}`
    );
  }

  /**
   * Call the LLM to correct malformed JSON.
   */
  private async requestCorrection(
    originalData: any,
    schemaType: SchemaType,
    errors: string[]
  ): Promise<any> {
    const apiKey = ENV.AI_API_KEY;
    if (!apiKey) {
      throw new Error("AI_API_KEY is not configured.");
    }

    let promptContent = "";
    switch (schemaType) {
      case "presentation": promptContent = this.presentationPrompt; break;
      case "enhancement": promptContent = this.enhancementPrompt; break;
      case "context": promptContent = this.contextPrompt; break;
    }

    const userMessage = [
      `VALIDATION ERRORS:`,
      ...errors.map(e => `- ${e}`),
      `ORIGINAL OUTPUT:`,
      JSON.stringify(originalData, null, 2),
    ].join("\n");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": ENV.CLIENT_URL[0] || "http://localhost:5173",
        "X-Title": "Live Polling System",
      },
      body: JSON.stringify({
        model: ENV.AI_MODEL_NAME,
        stream: false,
        max_tokens: 8192,
        messages: [
          { role: "system", content: promptContent },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error during correction: ${response.status} - ${errText}`);
    }

    const responseData = await response.json();
    const content = responseData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from correction LLM");
    }

    // Extract JSON from the response
    let jsonString = content.trim();
    const firstBrace = jsonString.indexOf("{");
    const lastBrace = jsonString.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(jsonString);
  }
}
