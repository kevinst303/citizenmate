import { NextResponse } from 'next/server';
import { getDictionary, type Locale } from '@/i18n/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get('locale') || 'en') as Locale;

  const locales = ['en', 'es', 'hi', 'zh', 'ar'] as const;
  if (!locales.includes(locale as typeof locales[number])) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const dict = await getDictionary(locale);
  return NextResponse.json(dict);
}
