import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "nodejs";
export const maxDuration = 5;

export async function POST(req: Request) {
  const { messages, code, language } = await req.json();

  // System message to instruct the AI to generate code
  const systemMessage = {
    role: "system",
    content: `You are a coder ai you generate code in ${language} language in backticks with language identifier. When asked you have to edit the code and make chenges to users code:>> ${code} <<:`,
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
