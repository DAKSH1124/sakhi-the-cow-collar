import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

export const openrouter = apiKey
  ? createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      fetch: async (url, options) => {
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Sakhi Cow Collar",
          },
        });
      },
    })
  : null;

export const systemPrompt = `You are Sakhi AI, a highly intelligent veterinary assistant and dairy farm manager.
You help farmers monitor their cattle's health using data from IoT smart collars.
Be concise, practical, and friendly. Give actionable advice related to cow health (temperature, pulse, vaccinations like FMD or Brucellosis, and feeding).`;

export async function processChatStream(messages: any[]) {
  if (!openrouter) {
    throw new Error("AI integration is not configured. Set OPENROUTER_API_KEY or OPENAI_API_KEY.");
  }

  const result = await streamText({
    model: openrouter("google/gemma-4-31b-it:free"),
    system: systemPrompt,
    messages,
  });

  return result.textStream;
}
