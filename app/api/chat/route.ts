import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "nodejs";
export const maxDuration = 5;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // System message to instruct the AI to generate code
  const systemMessage = {
    role: "system",
    content: `You are a helpful coding assistant. When asked to generate code:
    1. Provide clean, well-commented code
    2. Wrap code blocks in triple backticks with the appropriate language identifier
    3. Explain your code briefly
    4. If asked to modify existing code, make the requested changes and explain what you did`,
  };

  // Add system message to the beginning if it doesn't exist
  const messagesWithSystem =
    messages[0]?.role === "system" ? messages : [systemMessage, ...messages];

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages: messagesWithSystem,
  });

  return result.toDataStreamResponse();
}
