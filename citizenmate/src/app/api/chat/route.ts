import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, createUIMessageStreamResponse } from "ai";
import { getChatSystemPrompt } from "@/lib/chat-context";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: getChatSystemPrompt(),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    status: 200,
    stream: result.toUIMessageStream(),
  });
}
