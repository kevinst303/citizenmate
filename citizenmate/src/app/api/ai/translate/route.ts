import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { deepseekChatWithRetry } from '@/lib/deepseek';

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  hi: 'Hindi',
  zh: 'Chinese',
  ar: 'Arabic',
};

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { content, targetLocale } = await req.json();
    if (!content || !targetLocale) {
      return NextResponse.json(
        { error: 'content and targetLocale are required' },
        { status: 400 }
      );
    }

    const localeName = LOCALE_NAMES[targetLocale] || targetLocale;
    const result = await deepseekChatWithRetry({
      systemPrompt: `You are a professional translator. Translate the following blog content to ${localeName}.
Preserve all HTML formatting, links, and structure exactly. Do not translate URLs or HTML tags.
Maintain the original tone and style.`,
      userMessage: `Translate this content to ${localeName}:\n\n${content}`,
      temperature: 0.2,
    });

    return NextResponse.json({ translated: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
