import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, createUIMessageStreamResponse } from "ai";
import { getChatSystemPrompt } from "@/lib/chat-context";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

const RATE_LIMIT_MAX = parseInt(process.env.CHAT_RATE_LIMIT || "20", 10);
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  // --- Rate limiting ---
  const ip = getClientIP(req);
  const limiter = rateLimit(`chat:${ip}`, {
    maxRequests: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!limiter.success) {
    const retryAfter = Math.ceil(limiter.resetIn / 1000);
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: `You've reached the maximum number of AI Tutor messages. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(retryAfter),
        },
      }
    );
  }

  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: getChatSystemPrompt(),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    status: 200,
    stream: result.toUIMessageStream(),
    headers: {
      "X-RateLimit-Remaining": String(limiter.remaining),
    },
  });
}

