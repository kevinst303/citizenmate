import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
import { streamText } from "ai";
import { getChatSystemPrompt } from "@/lib/chat-context";
import { getRedisClient } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const WINDOW_MS = 60 * 60 * 1000;

async function getChatCounter(
  key: string,
  maxRequests: number
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const redis = getRedisClient();
  if (!redis) {
    return { success: true, remaining: maxRequests - 1, reset: Date.now() + WINDOW_MS };
  }

  const val = await redis.get<number>(key);
  const current = val ?? 0;

  if (current >= maxRequests) {
    const ttl = await redis.ttl(key);
    return { success: false, remaining: 0, reset: Date.now() + Math.max(ttl, 0) * 1000 };
  }

  return { success: true, remaining: maxRequests - current - 1, reset: Date.now() + WINDOW_MS };
}

async function incrementCounter(key: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;
  const val = await redis.incr(key);
  if (val === 1) {
    await redis.expire(key, Math.ceil(WINDOW_MS / 1000));
  }
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(req: Request) {
  let isPremiumUser = false;
  let userId = "anon";

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;
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

  // ── Parse & validate body BEFORE counting ──
  const body = await req.json().catch(() => null);
  if (!body?.messages || !Array.isArray(body.messages)) {
    return new Response(
      JSON.stringify({ error: "Invalid request: messages array required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Revenue Margin Protection ──
  const maxHistory = 6;
  const recentMessages = body.messages.slice(-maxHistory);

  const maxMessageLength = 500;
  const sanitizedMessages = recentMessages.map((msg: any) => {
    if (msg.role === "user" && typeof msg.content === "string" && msg.content.length > maxMessageLength) {
      return { ...msg, content: msg.content.slice(0, maxMessageLength) + "..." };
    }
    return msg;
  });

  // ── Zero-Token Pre-Filter ──
  const RELEVANCE_KEYWORDS = [
    "australia", "citizen", "test", "exam", "bond", "government",
    "history", "values", "flag", "vote", "law", "aboriginal",
    "indigenous", "parliament", "rights", "responsibility",
    "democracy", "freedom", "minister", "states", "territory",
    "english", "help", "study", "capital", "symbols", "fail", "pass",
    "retake", "score", "mark", "booking", "schedule", "certificate",
    "ceremony", "prepare", "interview", "fee", "cost", "times",
  ];

  const lastUserMessage = [...sanitizedMessages].reverse().find((m) => m.role === "user");
  if (lastUserMessage && typeof lastUserMessage.content === "string") {
    const textToLower = lastUserMessage.content.toLowerCase();
    const isRelevant = RELEVANCE_KEYWORDS.some((kw) => textToLower.includes(kw));

    if (!isRelevant) {
      const fallbackText =
        'Please refer to the official "Our Common Bond" documents on the Department of Home Affairs website (immi.homeaffairs.gov.au) or search online for more information. I am only here to assist with the citizenship test.';
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(fallbackText)}\n`));
          controller.close();
        },
      });
      return new Response(mockStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Vercel-AI-Data-Stream": "v1",
        },
      });
    }
  }

  // ── Check rate WITHOUT consuming ──
  const ip = getClientIP(req);
  const prefix = isPremiumUser ? "premium" : "free";
  const limitKey = isPremiumUser ? userId : ip;
  const maxRequests = isPremiumUser ? 100 : 20;
  const counterKey = `citizenmate:chat:${prefix}:${limitKey}`;

  const { success, remaining, reset } = await getChatCounter(counterKey, maxRequests);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
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

  // ── Call AI — only count on success ──
  let result;
  try {
    result = streamText({
      // @ts-expect-error: OpenRouter provider type isn't fully synced with the latest AI SDK types yet
      model: openrouter("openrouter/free"),
      system: getChatSystemPrompt(),
      messages: sanitizedMessages,
    });
    // Stream created successfully — NOW count this request
    await incrementCounter(counterKey);
  } catch (err) {
    console.error("AI stream failed to start:", err);
    return new Response(
      JSON.stringify({ error: "AI service unavailable. Please try again." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  return result!.toUIMessageStreamResponse({
    headers: {
      "X-RateLimit-Remaining": String(remaining),
    },
  });
}

