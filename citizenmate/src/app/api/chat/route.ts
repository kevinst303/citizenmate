import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText, createUIMessageStreamResponse } from "ai";
import type { UIMessageChunk } from "ai";
import { getChatSystemPrompt } from "@/lib/chat-context";
import { getRedisClient } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// DeepSeek has an OpenAI-compatible API. We use the openai-compatible
// provider to avoid OpenAI-specific parameters that DeepSeek rejects.
const deepseek = createOpenAICompatible({
  name: "deepseek",
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const WINDOW_MS = 60 * 60 * 1000;

/**
 * Atomic rate limit check: INCR first, then check threshold.
 */
async function checkAndIncrementRateLimit(
  key: string,
  maxRequests: number
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const redis = getRedisClient();
  if (!redis) {
    return { success: true, remaining: maxRequests - 1, reset: Date.now() + WINDOW_MS };
  }

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, Math.ceil(WINDOW_MS / 1000));
  }

  if (current > maxRequests) {
    const ttl = await redis.ttl(key);
    return {
      success: false,
      remaining: 0,
      reset: Date.now() + Math.max(ttl, 0) * 1000,
    };
  }

  return {
    success: true,
    remaining: maxRequests - current,
    reset: Date.now() + WINDOW_MS,
  };
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
  interface ChatMessage {
    role: string;
    content: unknown;
    [key: string]: unknown;
  }
  const sanitizedMessages = recentMessages.map((msg: ChatMessage) => {
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

      const id = "prefilter-rejection";
      const uiStream = new ReadableStream<UIMessageChunk>({
        start(controller) {
          controller.enqueue({ type: "text-start", id });
          controller.enqueue({ type: "text-delta", id, delta: fallbackText });
          controller.enqueue({ type: "text-end", id });
          controller.enqueue({ type: "finish", finishReason: "stop" });
          controller.close();
        },
      });

      return createUIMessageStreamResponse({ stream: uiStream });
    }
  }

  // ── Atomic rate limit check ──
  const ip = getClientIP(req);
  const prefix = isPremiumUser ? "premium" : "free";
  const limitKey = isPremiumUser ? userId : ip;
  const maxRequests = isPremiumUser ? 100 : 20;
  const counterKey = `citizenmate:chat:${prefix}:${limitKey}`;

  const { success, remaining, reset } = await checkAndIncrementRateLimit(counterKey, maxRequests);

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

  async function refundRateLimit() {
    const redis = getRedisClient();
    if (redis) {
      await redis.decr(counterKey).catch(() => {});
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  Streaming Pipeline — DeepSeek primary, OpenRouter fallback
  // ═══════════════════════════════════════════════════════════════

  /**
   * Pre-validates the DeepSeek API key with a cheap models-list call.
   * Returns true if the key is valid and DeepSeek is reachable.
   */
  async function deepseekKeyIsValid(): Promise<boolean> {
    if (!process.env.DEEPSEEK_API_KEY) return false;
    try {
      const res = await fetch("https://api.deepseek.com/v1/models", {
        headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // ── Tier 1: DeepSeek (paid API, highly reliable) ──
  const deepseekReady = await deepseekKeyIsValid();
  if (deepseekReady) {
    try {
      const result = streamText({
        model: deepseek("deepseek-chat"),
        system: getChatSystemPrompt(),
        messages: sanitizedMessages,
      });

      const response = result.toUIMessageStreamResponse({
        headers: {
          "X-RateLimit-Remaining": String(remaining),
          "X-Model-Provider": "deepseek",
        },
        onError: (error: unknown) => {
          console.error("DeepSeek stream error:", error);
          refundRateLimit().catch(() => {});
          return `DeepSeek stream error — please retry.`;
        },
      });

      console.log("→ DeepSeek primary");
      return response;
    } catch (err) {
      console.error("DeepSeek streamText threw:", err);
      // fall through to OpenRouter
    }
  } else if (process.env.DEEPSEEK_API_KEY) {
    console.warn("→ DeepSeek API key invalid or unreachable — falling back to OpenRouter");
  }

  // ── Tier 2: OpenRouter free-tier models (first to respond wins) ──
  const FREE_MODELS = [
    "liquid/lfm-2.5-1.2b-instruct:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "inclusionai/ring-2.6-1t:free",
  ];

  for (const model of FREE_MODELS) {
    try {
      const result = streamText({
        model: openrouter(model),
        system: getChatSystemPrompt(),
        messages: sanitizedMessages,
      });

      const response = result.toUIMessageStreamResponse({
        headers: {
          "X-RateLimit-Remaining": String(remaining),
          "X-Model-Provider": "openrouter",
          "X-Model-Id": model,
        },
        onError: (error: unknown) => {
          console.error(`OpenRouter stream error (${model}):`, error);
          refundRateLimit().catch(() => {});
          return `OpenRouter ${model} error — trying another model.`;
        },
      });

      console.log(`→ OpenRouter fallback: ${model}`);
      return response;
    } catch (err) {
      console.warn(`OpenRouter ${model} failed:`, (err as Error).message);
      continue;
    }
  }

  // ── All providers exhausted ──
  await refundRateLimit();
  const fallbackText =
    "I'm having trouble connecting to any AI provider right now. This is usually temporary — please try again in a moment.";

  const id = "all-providers-exhausted";
  const uiStream = new ReadableStream<UIMessageChunk>({
    start(controller) {
      controller.enqueue({ type: "text-start", id });
      controller.enqueue({ type: "text-delta", id, delta: fallbackText });
      controller.enqueue({ type: "text-end", id });
      controller.enqueue({ type: "finish", finishReason: "stop" });
      controller.close();
    },
  });

  return createUIMessageStreamResponse({ stream: uiStream });
}
