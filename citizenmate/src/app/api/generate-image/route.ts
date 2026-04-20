import { NextRequest, NextResponse } from "next/server";

const KIE_API_BASE = "https://api.kie.ai/api/v1/jobs";

interface GenerateImageRequest {
  prompt: string;
  aspect_ratio?: string;
  resolution?: string;
  output_format?: string;
}

interface TaskResponse {
  code: number;
  msg: string;
  data: { taskId: string };
}

interface RecordInfoResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    state: string;
    resultJson?: string;
    failMsg?: string;
  };
}

async function createTask(prompt: string, options: Partial<GenerateImageRequest> = {}): Promise<string> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error("KIE_API_KEY is not configured");

  const res = await fetch(`${KIE_API_BASE}/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nano-banana-2",
      input: {
        prompt,
        image_input: [],
        aspect_ratio: options.aspect_ratio || "16:9",
        resolution: options.resolution || "1K",
        output_format: options.output_format || "png",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create task: ${res.status} ${text}`);
  }

  const json = (await res.json()) as TaskResponse;
  if (json.code !== 200) throw new Error(`API error: ${json.msg}`);
  return json.data.taskId;
}

async function pollTask(taskId: string, maxWaitMs: number = 120_000): Promise<string[]> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error("KIE_API_KEY is not configured");

  const startTime = Date.now();
  const pollInterval = 3_000;

  while (Date.now() - startTime < maxWaitMs) {
    const res = await fetch(`${KIE_API_BASE}/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to poll task: ${res.status} ${text}`);
    }

    const json = (await res.json()) as RecordInfoResponse;

    if (json.data.state === "success") {
      const result = JSON.parse(json.data.resultJson || "{}");
      return result.resultUrls || [];
    }

    if (json.data.state === "fail") {
      throw new Error(`Image generation failed: ${json.data.failMsg || "unknown error"}`);
    }

    // Still generating — wait and retry
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error("Image generation timed out");
}

export async function POST(request: NextRequest) {
  try {
    // ── Auth check ──
    const { createSupabaseServerClient } = await import('@/lib/supabase-server');
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Rate limiting (5 images per hour per IP) ──
    const { apiLimiter } = await import('@/lib/rate-limit');
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    const { success, reset } = await apiLimiter.limit(`image:${ip}`);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    const body = (await request.json()) as GenerateImageRequest;

    if (!body.prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const taskId = await createTask(body.prompt, body);
    const imageUrls = await pollTask(taskId);

    return NextResponse.json({
      success: true,
      taskId,
      imageUrls,
    });
  } catch (error) {
    console.error("[generate-image] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
