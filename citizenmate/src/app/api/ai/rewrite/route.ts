import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { deepseekChatWithRetry } from '@/lib/deepseek';

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { content, style } = await req.json();
    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    const styleHint = style || 'more engaging and professional';

    const result = await deepseekChatWithRetry({
      systemPrompt: `You are a professional editor. Rewrite the given HTML content to be ${styleHint}.
Preserve all HTML tags and structure. Improve sentence flow, eliminate redundancy, and enhance readability.
Return the rewritten content in the same HTML format.`,
      userMessage: `Rewrite this content:\n\n${content}`,
      temperature: 0.5,
    });

    return NextResponse.json({ content: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Rewrite failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
