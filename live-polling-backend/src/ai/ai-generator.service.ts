import fs from "fs";
import path from "path";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";

const SYSTEM_PROMPT_PATH = path.join(__dirname, "prompts", "system-prompt.txt");

export class AIGeneratorService {
  private systemPrompt: string;
  private enhancementPrompt: string;

  constructor() {
    try {
      this.systemPrompt = fs.readFileSync(SYSTEM_PROMPT_PATH, "utf-8");
    } catch (error) {
      logger.error("Failed to read system prompt file", error);
      this.systemPrompt = "You are a helpful presentation generator.";
    }

    try {
      const ENHANCEMENT_PROMPT_PATH = path.join(__dirname, "prompts", "enhancement-system-prompt.txt");
      this.enhancementPrompt = fs.readFileSync(ENHANCEMENT_PROMPT_PATH, "utf-8");
    } catch (error) {
      logger.error("Failed to read enhancement prompt file", error);
      this.enhancementPrompt = "You are a presentation modifier. Given a presentation JSON and a request, return the modified JSON.";
    }
  }

  private async *streamOpenRouter(messages: { role: string; content: string }[]): AsyncGenerator<any, void, unknown> {
    const apiKey = ENV.AI_API_KEY;
    if (!apiKey) {
      throw new Error("AI_API_KEY is not configured.");
    }

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
        include_reasoning: true,
        stream: true,
        max_tokens: 8192,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullContent = "";
    
    if (!reader) throw new Error("No response body stream");

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed === "data: [DONE]") continue;
        if (trimmed.startsWith("data: ")) {
          try {
            const data = JSON.parse(trimmed.substring(6));
            const delta = data.choices?.[0]?.delta;
            if (delta?.reasoning) {
              yield { type: "reasoning", text: delta.reasoning };
            }
            if (delta?.content) {
              fullContent += delta.content;
              yield { type: "reasoning", text: delta.content };
            }
          } catch (e) {
            // Ignore incomplete JSON chunks if any
          }
        }
      }
    }

    if (!fullContent) {
      throw new Error("No content returned from AI model");
    }
    
    let jsonString = fullContent.trim();
    
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(jsonString);
    yield { type: "result", data: parsed };
  }

  async *generatePresentationStream(userPrompt: string): AsyncGenerator<any, void, unknown> {
    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        logger.info(`Starting AI generation with prompt (Attempt ${attempt + 1}/${maxRetries + 1}): "${userPrompt.substring(0, 50)}..."`);
        
        const messages = [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: userPrompt },
        ];

        yield* this.streamOpenRouter(messages);
        logger.info("AI generation successful, parsing JSON...");
        return;
      } catch (error: any) {
        logger.error(`Error in AIGeneratorService (Attempt ${attempt + 1}):`, error);
        if (attempt === maxRetries) {
          throw new Error(`AI generation failed after ${maxRetries} retries: ${error.message}`);
        }
        yield { type: "reasoning", text: `\n[Error encountered. Retrying (${attempt + 1}/${maxRetries})...]\n` };
        await new Promise(res => setTimeout(res, 2000));
      }
    }
  }

  async *enhancePresentationStream(userModificationRequest: string, presentationJson: any): AsyncGenerator<any, void, unknown> {
    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        logger.info(`Starting AI enhancement with request (Attempt ${attempt + 1}/${maxRetries + 1}): "${userModificationRequest.substring(0, 50)}..."`);
        
        const trimmedPresentation = {
          title: presentationJson.title,
          description: presentationJson.description,
          theme: presentationJson.theme,
          slides: presentationJson.slides?.map((s: any) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            subtitle: s.subtitle,
            options: s.options?.map((o: any) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })),
            settings: s.settings,
          }))
        };

        const userMessage = `EXISTING PRESENTATION:\n${JSON.stringify(trimmedPresentation)}\n\nUSER MODIFICATION REQUEST:\n${userModificationRequest}`;
        const messages = [
          { role: "system", content: this.enhancementPrompt },
          { role: "user", content: userMessage },
        ];

        yield* this.streamOpenRouter(messages);
        logger.info("AI enhancement successful, parsing JSON...");
        return;
      } catch (error: any) {
        logger.error(`Error in AIGeneratorService enhancePresentationStream (Attempt ${attempt + 1}):`, error);
        if (attempt === maxRetries) {
          throw new Error(`AI enhancement failed after ${maxRetries} retries: ${error.message}`);
        }
        yield { type: "reasoning", text: `\n[Error encountered. Retrying (${attempt + 1}/${maxRetries})...]\n` };
        await new Promise(res => setTimeout(res, 2000));
      }
    }
  }
}
