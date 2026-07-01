import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/route";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const modelId = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

// OpenRouter is fully compatible with the OpenAI format.
const openrouter = apiKey
  ? createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      // OpenRouter requires standard HTTP headers for proper routing and identification
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!openrouter || !apiKey) {
      return NextResponse.json(
        { error: "AI integration is not configured. Set OPENROUTER_API_KEY or OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    const systemPrompt = `You are Sakhi AI, a highly intelligent veterinary assistant and dairy farm manager.
You help farmers monitor their cattle's health using data from IoT smart collars.
Be concise, practical, and friendly. Give actionable advice related to cow health (temperature, pulse, vaccinations like FMD or Brucellosis, and feeding).`;

    const result = await streamText({
      model: openrouter("google/gemma-4-31b-it:free"),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
