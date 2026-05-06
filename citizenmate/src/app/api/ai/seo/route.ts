import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { deepseekChatWithRetry } from '@/lib/deepseek';

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    const strippedContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    const result = await deepseekChatWithRetry({
      systemPrompt: `You are an SEO expert. Generate optimized metadata for a blog post.
Respond with valid JSON only: { "title": "SEO title (max 60 chars)", "description": "Meta description (max 160 chars)", "keywords": "comma,separated,keywords" }
The title should be compelling and include the main keyword. The description should summarize the post and entice clicks.`,
      userMessage: `Generate SEO metadata for this blog post:\n\n${strippedContent.substring(0, 3000)}`,
      temperature: 0.4,
      jsonMode: true,
    });

    const parsed = JSON.parse(result);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'SEO generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
