import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { coderSchema } from "./schema";

export const maxDuration = 5;

export async function POST(req: Request) {
  const context = await req.json();

  const result = streamObject({
    model: google("gemini-2.0-flash-thinking-exp-01-21"),
    prompt: "generate code on the context: " + context,
    system:
      "Your are a expert coder. You are able to write code in any language. You can also explain code to a user. You write code and rewrite it wiht minimal line changes for better understanding. Along with code you give explaination in simple language.",
    schema: coderSchema,
  });

  console.log(context);

  return result.toTextStreamResponse();
}
