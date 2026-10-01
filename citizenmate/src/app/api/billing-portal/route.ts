import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import * as Sentry from '@sentry/nextjs';

// POST /api/billing-portal
// Creates a Stripe billing portal session so members can cancel, change
// plans, or update their card — self-service, no support ticket required.
export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const requested = typeof body?.locale === 'string' ? body.locale : '';
    const locale: Locale = locales.includes(requested as Locale) ? (requested as Locale) : defaultLocale;

    const stripeKey = process.env.STRIPE_SECRET_KEY?.replace(/\\n/g, '')?.trim();
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No billing profile found yet — purchase a plan first.' },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
      appInfo: { name: 'CitizenMate', version: '1.1.0' },
    });

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenmate.com.au').replace(/\\n/g, '').trim();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/${locale}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[BillingPortal] Error:', message);
    Sentry.captureException(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
