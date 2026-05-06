import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { deepseek } from '@/lib/deepseek';

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { topic, keywords } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    }

    const keywordHint = keywords?.length ? `\nInclude these keywords naturally: ${keywords.join(', ')}.` : '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      model: 'deepseek-v4-flash',
      messages: [
        {
          role: 'system',
          content: `You are a professional blog writer for a civic education platform called CitizenMate that helps people prepare for the Australian citizenship test.
Write in clear, engaging HTML format. Use <h2> for section headings, <p> for paragraphs, <ul>/<li> for lists, and <blockquote> for important callouts.
Target audience: general readers preparing for the citizenship test.
Tone: informative, approachable, and encouraging.`,
        },
        {
          role: 'user',
          content: `Write a blog post about "${topic}".${keywordHint}\nTarget length: ~800 words.\nUse HTML formatting only (no markdown).`,
        },
      ],
      thinking: { type: 'disabled' },
      temperature: 0.7,
      max_tokens: 4000,
      stream: true,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = (await deepseek.chat.completions.create(params)) as any;

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullContent = '';
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            fullContent += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text, fullContent })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
