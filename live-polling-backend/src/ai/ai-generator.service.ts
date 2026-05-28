import fs from "fs";
import path from "path";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";

const SYSTEM_PROMPT_PATH = path.join(__dirname, "prompts", "system-prompt.txt");

export class AIGeneratorService {
  private systemPrompt: string;

  constructor() {
    try {
      this.systemPrompt = fs.readFileSync(SYSTEM_PROMPT_PATH, "utf-8");
    } catch (error) {
      logger.error("Failed to read system prompt file", error);
      this.systemPrompt = "You are a helpful presentation generator.";
    }
  }

  async generatePresentation(userPrompt: string): Promise<any> {
    const apiKey = ENV.AI_API_KEY;
    if (!apiKey) {
      throw new Error("AI_API_KEY is not configured.");
    }

    try {
      logger.info(`Starting AI generation with prompt: "${userPrompt.substring(0, 50)}..."`);
      
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
          messages: [
            { role: "system", content: this.systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("No content returned from AI model");
      }

      logger.info("AI generation successful, parsing JSON...");
      
      let jsonString = content.trim();
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (jsonString.startsWith("```")) {
         jsonString = jsonString.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }

      return JSON.parse(jsonString);
    } catch (error: any) {
      logger.error("Error in AIGeneratorService:", error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }
}
