import { z } from 'zod';

// ===== Environment Variable Validation =====
// Validates all required env vars at import time.
// Fails fast with descriptive error messages if any are missing.

// ── Server-side env vars (not exposed to client) ──

const serverEnvSchema = z.object({
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Missing SUPABASE_SERVICE_ROLE_KEY'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'STRIPE_SECRET_KEY must start with sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'STRIPE_WEBHOOK_SECRET must start with whsec_'),

  // AI
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, 'Missing GOOGLE_GENERATIVE_AI_API_KEY'),

  // Upstash (optional in dev, required in production)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Sentry (optional in dev)
  SENTRY_DSN: z.string().url().optional(),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// ── Client-side env vars (NEXT_PUBLIC_ prefix) ──

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'Must start with pk_'),
  NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEAR: z.string().startsWith('price_', 'Must start with price_').optional(),
  NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTH: z.string().startsWith('price_', 'Must start with price_').optional(),
  NEXT_PUBLIC_STRIPE_PRICE_ID_SPRINT_PASS: z.string().startsWith('price_', 'Must start with price_').optional(),
  NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_YEAR: z.string().startsWith('price_', 'Must start with price_').optional(),
  NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTH: z.string().startsWith('price_', 'Must start with price_').optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://citizenmate.com.au'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
});

// ── Validate and export ──

function validateEnv() {
  // Server env
  const serverResult = serverEnvSchema.safeParse(process.env);
  if (!serverResult.success) {
    const formatted = serverResult.error.issues
      .map((i) => `  ✗ ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    console.error(`\n❌ Server environment validation failed:\n${formatted}\n`);

    // In production, crash immediately
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required server environment variables');
    }
  }

  // Client env
  const clientResult = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEAR: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEAR,
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTH: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTH,
    NEXT_PUBLIC_STRIPE_PRICE_ID_SPRINT_PASS: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SPRINT_PASS,
    NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_YEAR: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_YEAR,
    NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTH: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTH,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  });

  if (!clientResult.success) {
    const formatted = clientResult.error.issues
      .map((i) => `  ✗ ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    console.error(`\n❌ Client environment validation failed:\n${formatted}\n`);

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required client environment variables');
    }
  }

  return {
    server: serverResult.success ? serverResult.data : null,
    client: clientResult.success ? clientResult.data : null,
  };
}

export const env = validateEnv();
