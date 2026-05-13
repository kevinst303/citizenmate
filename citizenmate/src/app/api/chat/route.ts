import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { getChatSystemPrompt } from "@/lib/chat-context";
import { getRedisClient } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase-server";
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const WINDOW_MS = 60 * 60 * 1000;

/**
 * Atomic rate limit check: INCR first, then check threshold.
 * Eliminates the TOCTOU race condition where concurrent requests
 * could both pass the read check before either increments the counter.
 * Also fixes the bypass where counter was only incremented after
 * the AI stream call, allowing unlimited retries on stream failure.
 */
async function checkAndIncrementRateLimit(
  key: string,
  maxRequests: number
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const redis = getRedisClient();
  if (!redis) {
    return { success: true, remaining: maxRequests - 1, reset: Date.now() + WINDOW_MS };
  }

  // Atomic: INCR then check — prevents concurrent bypass
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

  // ── Atomic rate limit check: INCR + check in one step ──
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

  // Refund the Redis counter if the AI stream fails — the user shouldn't lose a request
  async function refundRateLimit() {
    const redis = getRedisClient();
    if (redis) {
      await redis.decr(counterKey).catch(() => {});
    }
  }

  // ── Prioritised free models for OpenRouter (verified 13 May 2026) ──
  // Non-streaming preflight catches 429/503 before we attempt streaming.
  //
  // ⚠️  ONLY models that actually emit delta.content in streaming mode are listed.
  //     Reasoning-only models (nemotron-3-super, nemotron-nano, minimax, ring, etc.)
  //     produce zero text output — the AI SDK rejects empty streams as errors.
  const FREE_MODELS = [
    "google/gemma-4-31b-it:free",               // primary: Google AI Studio, confirmed text streaming
    "z-ai/glm-4.5-air:free",                    // fallback 1: Z.AI, may emit text when not rate-limited
    "nvidia/nemotron-3-super-120b-a12b:free",   // fallback 2: ⚠️ slow, may emit content on retry
    "qwen/qwen-2.5-7b-instruct:free",           // fallback 3: Qwen, may recover from 429
  ];

  let selectedModel: string | null = null;

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "." }],
          max_tokens: 1,
          stream: false,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        selectedModel = model;
        console.log(`Preflight OK → using ${model}`);
        break;
      }

      const errorText = await response.text().catch(() => "");
      console.warn(`Preflight: ${model} returned ${response.status}: ${errorText.substring(0, 200)}`);
    } catch (err) {
      console.warn(`Preflight: ${model} failed:`, (err as Error).message);
    }
  }

  if (!selectedModel) {
    await refundRateLimit();
    return new Response(
      JSON.stringify({
        error: "All AI providers are temporarily rate-limited. Please try again in a moment.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let streamErrorOccurred = false;

  const result = streamText({
    // @ts-expect-error: OpenRouter provider type isn't fully synced with the latest AI SDK types yet
    model: openrouter(selectedModel),
    system: getChatSystemPrompt(),
    messages: sanitizedMessages,
  });

  const rawResponse = result.toUIMessageStreamResponse({
    headers: {
      "X-RateLimit-Remaining": String(remaining),
    },
    onError: async ({ error }) => {
      console.error("AI stream error:", error);
      streamErrorOccurred = true;
      await refundRateLimit();
    },
  });

  // ── Transform stream: detects provider errors and sanitizes invalid payloads ──
  // The AI SDK v4 stream protocol uses SSE-like lines prefixed with type codes:
  //   0: text content     3: error/tool data     e: end-of-stream
  //   d: finish step      f: finish message
  // When an OpenRouter provider returns a non-stream HTTP error (429, 401, etc.),
  // the error may appear inline in the SSE stream as a malformed JSON payload,
  // OR the stream may be empty (no chunks at all).
  const fallbackErrorText =
    "AI service is temporarily unavailable. Please try again in a moment.";
  let buffer = "";
  let totalChunks = 0;
  let textChunks = 0;
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      buffer += decoder.decode(chunk);
      totalChunks++;

      // Process complete lines only
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        // Track meaningful text content via data: SSE format from toUIMessageStreamResponse()
        // The UI stream wraps text-delta in data: lines like:
        //   data: {"type":"text-delta","id":"...","delta":"actual content"}
        if (line.includes('"type":"text-delta"')) textChunks++;

        // ═══ CRITICAL: Intercept AI SDK error events and convert to visible text ═══
        // When a model produces empty output (reasoning-only or aborted stream),
        // the AI SDK injects: data: {"type":"error","errorText":"..."}
        // This error type is NOT displayed as visible text by the client — the user
        // just sees a stuck loading indicator. We must convert it to text-delta.
        // The fallbackErrorText sanitizer below also fixes empty errorText values
        // that would fail client-side Zod validation with AI_TypeValidationError.
        if (line.includes('"type":"error"') && line.includes('"errorText"')) {
          console.error("AI SDK error event intercepted:", line.substring(0, 300));
          streamErrorOccurred = true;
          // Extract the error message or use fallback
          let errorMsg = fallbackErrorText;
          try {
            const dataStart = line.indexOf('data:');
            if (dataStart >= 0) {
              const jsonStr = line.substring(dataStart + 5).trim();
              const parsed = JSON.parse(jsonStr);
              if (parsed.errorText && typeof parsed.errorText === "string" && parsed.errorText.length > 0) {
                errorMsg = parsed.errorText;
              }
            }
          } catch { /* use fallback */ }
          // Replace the invisible error event with a visible text-delta.
          // CRITICAL: The AI SDK UI stream protocol requires a "text-start" chunk
          // before any "text-delta" chunks with the same ID. Without it, the
          // client throws AI_UIMessageStreamError.
          const textStart = JSON.stringify({
            type: "text-start",
            id: "error-recovery",
          });
          controller.enqueue(encoder.encode(`data: ${textStart}\n\n`));
          const textDelta = JSON.stringify({
            type: "text-delta",
            id: "error-recovery",
            delta: errorMsg,
          });
          controller.enqueue(encoder.encode(`data: ${textDelta}\n\n`));
          const textEnd = JSON.stringify({
            type: "text-end",
            id: "error-recovery",
          });
          controller.enqueue(encoder.encode(`data: ${textEnd}\n\n`));
          textChunks++; // mark that we provided visible content
          continue; // skip writing the original error line
        }

        // Sanitize invalid errorText values that would fail client-side type validation
        let sanitized = line.replace(
          /"errorText":\s*(null|undefined|\[\]|\{\})/g,
          `"errorText":${JSON.stringify(fallbackErrorText)}`
        );

        // Detect provider error chunks embedded in the stream
        // e.g. {"error":{"message":"Provider returned error","code":429,...}}
        if (sanitized.includes('"error":{"message"') || sanitized.includes('"error":{"code"')) {
          console.error("Provider error detected in stream chunk:", sanitized.substring(0, 300));
          streamErrorOccurred = true;
        }

        controller.enqueue(encoder.encode(sanitized + "\n"));
      }
    },
    flush(controller) {
      // Process any remaining buffered content
      if (buffer.length > 0) {
        const encoder = new TextEncoder();
        const sanitized = buffer.replace(
          /"errorText":\s*(null|undefined|\[\]|\{\})/g,
          `"errorText":${JSON.stringify(fallbackErrorText)}`
        );
        controller.enqueue(encoder.encode(sanitized));
      }

      // If the stream produced no text content, and no error was intercepted,
      // inject a friendly visible message as a last resort.
      // (The primary error handling is the type:error → text-delta interception above)
      if (textChunks === 0 && !streamErrorOccurred) {
        const encoder = new TextEncoder();
        console.error(
          `Chat stream produced zero text chunks (total=${totalChunks}). Injecting fallback.`
        );
        const msgObj = JSON.stringify({
          type: "text-delta",
          id: "fallback",
          delta: fallbackErrorText,
        });
        const finishObj = JSON.stringify({
          type: "finish",
          finishReason: "stop",
        });
        controller.enqueue(encoder.encode(`data: ${msgObj}\n\n`));
        controller.enqueue(encoder.encode(`data: ${finishObj}\n\n`));
      }
    },
  });

  rawResponse.body?.pipeTo(writable).catch((err) => {
    console.error("Stream pipe error:", err);
  });

  return new Response(readable, {
    status: rawResponse.status,
    statusText: rawResponse.statusText,
    headers: rawResponse.headers,
  });
}
