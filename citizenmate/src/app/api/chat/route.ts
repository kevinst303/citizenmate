import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, createUIMessageStreamResponse } from "ai";
import { getChatSystemPrompt } from "@/lib/chat-context";
import { rateLimit, getClientIP } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  let isPremiumUser = false;
  let userId = "anon";
  
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      userId = session.user.id;
      const { data } = await supabase
        .from("profiles")
        .select("is_premium, premium_expires_at")
        .eq("id", userId)
        .single();
        
      if (data?.is_premium) {
        const expiresAt = data.premium_expires_at ? new Date(data.premium_expires_at) : null;
        if (expiresAt === null || expiresAt > new Date()) {
          isPremiumUser = true;
        }
      }
    }
  } catch (err) {
    console.error("Error verifying premium status for chat API:", err);
  }

  // --- Tiered Rate limiting ---
  const ip = getClientIP(req);
  
  // Free users: max 5 requests per hour per IP (as an anti-bypass measure for local ui limits). 
  // Premium users: 100 requests per hour per User ID.
  const limitMax = isPremiumUser ? 100 : 5;
  const limitKey = isPremiumUser ? `chat:premium:${userId}` : `chat:free:${ip}`;
  const rateLimitWindowMs = 60 * 60 * 1000; // 1 hour

  const limiter = rateLimit(limitKey, {
    maxRequests: limitMax,
    windowMs: rateLimitWindowMs,
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

  const body = await req.json().catch(() => null);
  if (!body?.messages || !Array.isArray(body.messages)) {
    return new Response(
      JSON.stringify({ error: "Invalid request: messages array required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- Revenue Margin Protection: Token & Context Limits ---
  // 1. Limit conversation history to the last 6 messages to prevent context explosion
  const maxHistory = 6;
  const recentMessages = body.messages.slice(-maxHistory);

  // 2. Truncate maliciously long individual user messages
  const maxMessageLength = 500; // ~120 words max per message
  const sanitizedMessages = recentMessages.map((msg: any) => {
    if (msg.role === "user" && typeof msg.content === "string" && msg.content.length > maxMessageLength) {
      return { ...msg, content: msg.content.slice(0, maxMessageLength) + "..." };
    }
    return msg;
  });

  // --- Zero-Token Pre-Filter Heuristic ---
  const RELEVANCE_KEYWORDS = [
    "australia", "citizen", "test", "exam", "bond", "government", 
    "history", "values", "flag", "vote", "law", "aboriginal", 
    "indigenous", "parliament", "rights", "responsibility", 
    "democracy", "freedom", "minister", "states", "territory", 
    "english", "help", "study", "capital", "symbols", "fail", "pass",
    "retake", "score", "mark", "booking", "schedule", "certificate", 
    "ceremony", "prepare", "interview", "fee", "cost", "times"
  ];

  const lastUserMessage = [...sanitizedMessages].reverse().find(m => m.role === "user");
  if (lastUserMessage && typeof lastUserMessage.content === "string") {
    const textToLower = lastUserMessage.content.toLowerCase();
    const isRelevant = RELEVANCE_KEYWORDS.some(kw => textToLower.includes(kw));

    if (!isRelevant) {
      const fallbackText = "Please refer to the official \"Our Common Bond\" documents on the Department of Home Affairs website (immi.homeaffairs.gov.au) or search online for more information. I am only here to assist with the citizenship test.";
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(fallbackText)}\n`));
          controller.close();
        }
      });
      return new Response(mockStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Vercel-AI-Data-Stream': 'v1',
          'X-RateLimit-Remaining': String(limiter.remaining),
        }
      });
    }
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: getChatSystemPrompt(),
    messages: sanitizedMessages,
  });
  return result.toUIMessageStreamResponse({
    headers: {
      "X-RateLimit-Remaining": String(limiter.remaining),
    },
  });
}

