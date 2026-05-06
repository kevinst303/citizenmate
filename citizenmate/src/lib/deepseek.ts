import OpenAI from 'openai';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.warn('DEEPSEEK_API_KEY not set — AI features will not work');
}

export const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: DEEPSEEK_API_KEY || '',
});

export interface DeepSeekChatParams {
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export async function deepseekChat({
  systemPrompt,
  userMessage,
  temperature = 0.7,
  maxTokens = 4000,
  jsonMode = false,
}: DeepSeekChatParams): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    model: 'deepseek-v4-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    thinking: { type: 'disabled' },
    temperature,
    max_tokens: maxTokens,
  };
  if (jsonMode) {
    params.response_format = { type: 'json_object' };
  }
  const completion = await deepseek.chat.completions.create(params);

  return completion.choices[0]?.message?.content || '';
}

export async function deepseekChatWithRetry(
  params: DeepSeekChatParams,
  maxRetries = 3
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await deepseekChat(params);
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      const status = err.status;

      if (status === 429 || status === 500 || status === 503) {
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 30000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (status === 400 || status === 401 || status === 402 || status === 422) {
        throw new Error(`DeepSeek API error ${status}: ${err.message}`);
      }

      throw error;
    }
  }
  throw new Error('DeepSeek API: max retries exceeded');
}
