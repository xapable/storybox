/**
 * Cloud Functions for Storybox — T2Q Quiz Generation
 *
 * Deploy: firebase deploy --only functions
 * Set DeepSeek API key: firebase functions:config:set deepseek.key="YOUR_API_KEY"
 */

import * as logger from "firebase-functions/logger";
import { onCall } from "firebase-functions/v2/https";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

const SYSTEM_PROMPT = `You are a T2Q story generator. Output only valid T2Q content using the format:
- > Speaker: Text for conversation
- ? Question text
- Numbered options 1) ... 2) ...
- = correct number (1-indexed)
- Blank lines between scenes.
Do not output any extra text, markdown, or explanations. Output only the T2Q content.`;

interface GenerateT2QData {
  topic: string;
}

export const generateT2Q = onCall<GenerateT2QData>(
  { cors: true },
  async (request) => {
    const topic = request.data.topic?.trim();

    if (!topic) {
      throw new Error("Topic is required.");
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      logger.error("DEEPSEEK_API_KEY not configured");
      throw new Error("AI generation is not configured. Set DEEPSEEK_API_KEY.");
    }

    logger.info(`Generating T2Q for topic: ${topic}`);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Topic: ${topic}` },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.error(`DeepSeek API error: ${response.status} ${errText}`);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      logger.error("Empty response from DeepSeek", data);
      throw new Error("AI returned an empty response. Try again.");
    }

    logger.info(`Generated ${content.split("\n").length} lines of T2Q`);
    return { content };
  }
);
