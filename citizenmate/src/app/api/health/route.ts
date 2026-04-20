import { NextResponse } from 'next/server';

// ===== Health Check Endpoint =====
// Returns service status for uptime monitoring.
// GET /api/health

export async function GET() {
  const checks: Record<string, string> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.1.0',
  };

  // Check Supabase connectivity
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        },
        signal: AbortSignal.timeout(5000),
      });
      checks.supabase = res.ok ? 'connected' : 'error';
    } else {
      checks.supabase = 'not_configured';
    }
  } catch {
    checks.supabase = 'unreachable';
  }

  // Check Stripe API
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      const res = await fetch('https://api.stripe.com/v1/balance', {
        headers: {
          Authorization: `Bearer ${stripeKey}`,
        },
        signal: AbortSignal.timeout(5000),
      });
      checks.stripe = res.ok ? 'connected' : 'error';
    } else {
      checks.stripe = 'not_configured';
    }
  } catch {
    checks.stripe = 'unreachable';
  }

  // Check Upstash Redis
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (redisUrl && redisToken) {
      const res = await fetch(`${redisUrl}/ping`, {
        headers: {
          Authorization: `Bearer ${redisToken}`,
        },
        signal: AbortSignal.timeout(3000),
      });
      checks.redis = res.ok ? 'connected' : 'error';
    } else {
      checks.redis = 'not_configured';
    }
  } catch {
    checks.redis = 'unreachable';
  }

  const allHealthy =
    checks.supabase !== 'unreachable' &&
    checks.stripe !== 'unreachable' &&
    checks.redis !== 'unreachable';

  return NextResponse.json(checks, {
    status: allHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
