import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/route";

// This creates a standard mock streaming response for the AI Chatbot
function createMockStream(prompt: string) {
  const encoder = new TextEncoder();
  const baseResponse = "Hello! I am Sakhi's AI Assistant. I can help you interpret IoT data, recommend feeding schedules, and provide general veterinary advice for your herd. ";
  
  let responseText = baseResponse;
  
  if (prompt.toLowerCase().includes("temp") || prompt.toLowerCase().includes("fever")) {
    responseText += "If your cow is showing a high temperature (above 39.5°C), it could indicate an infection. Please check the 'Alerts' tab to see if the collar has flagged a critical warning, and consider consulting your local vet immediately.";
  } else if (prompt.toLowerCase().includes("fmd") || prompt.toLowerCase().includes("vaccine")) {
    responseText += "For Foot-and-Mouth Disease (FMD), ensure vaccinations are scheduled every 6 months. You can track this in the 'Alerts & Hub' page under the Vaccinations tab.";
  } else if (prompt.toLowerCase().includes("battery")) {
    responseText += "If a collar's battery is low, please remove it from the cow and charge it using the 4.0V supply port. A full charge takes about 2 hours.";
  } else {
    responseText += "How can I assist you with your cattle today? (Note: This is a simulated response because a valid API key was not found).";
  }

  const words = responseText.split(" ");
  
  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        // Stream format required by useChat (0:text)
        controller.enqueue(encoder.encode(`0:"${word} "` + "\n"));
        // Artificial delay for streaming effect
        await new Promise(r => setTimeout(r, 50));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    return createMockStream(lastMessage);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
