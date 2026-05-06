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
      systemPrompt: `Suggest 5 relevant tags/categories for a blog post about Australian citizenship test preparation.
Respond with valid JSON only: { "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"] }
Tags should be concise (1-3 words), SEO-relevant, and specific to citizenship test topics.`,
      userMessage: `Suggest 5 tags for this blog post:\n\n${strippedContent.substring(0, 3000)}`,
      temperature: 0.5,
      jsonMode: true,
    });

    const parsed = JSON.parse(result);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Tag suggestion failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
