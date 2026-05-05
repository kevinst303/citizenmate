import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { checkoutLimiter } from '@/lib/rate-limit';
import * as Sentry from '@sentry/nextjs';

export async function POST(req: Request) {
  try {
    // ── Apply Rate Limiting ──
    // In serverless environments, x-forwarded-for is typically populated by the load balancer/CDN
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await checkoutLimiter.limit(ip);
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // ── Verify authenticated user server-side ──
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse options from request body ──
    let promoCode: string | undefined;
    let tier = 'premium';
    let interval = 'year';
    
    try {
      const body = await req.json().catch(() => ({}));
      promoCode = body.promoCode;
      if (body.tier) tier = body.tier;
      if (body.interval) interval = body.interval;
    } catch {
      // No body or invalid JSON
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
      appInfo: {
        name: 'CitizenMate',
        version: '1.1.0'
      }
    });

    // ── Map tier to Price ID ──
    let priceId: string | undefined;

    if (tier === 'pro') {
      priceId = interval === 'year' 
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEAR 
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTH;
    } else if (tier === 'sprint_pass') {
      priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SPRINT_PASS;
    } else {
      // Premium tier
      priceId = interval === 'year'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_YEAR
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTH;
    }

    if (!priceId) {
      return NextResponse.json({ error: `Price ID not configured for tier: ${tier}, interval: ${interval}` }, { status: 500 });
    }

    // Determine mode dynamically based on the price type
    const price = await stripe.prices.retrieve(priceId);
    const mode: Stripe.Checkout.SessionCreateParams.Mode = price.type === 'one_time' ? 'payment' : 'subscription';

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenmate.com.au';

    // ── Look up Stripe Promotion Code if a promo code was provided ──
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    let referralPromoCodeId: string | undefined;

    if (promoCode) {
      try {
        const promoCodes = await stripe.promotionCodes.list({
          code: promoCode,
          active: true,
          limit: 1,
        });

        if (promoCodes.data.length > 0) {
          const promoCodeObj = promoCodes.data[0];
          discounts.push({ promotion_code: promoCodeObj.id });
          referralPromoCodeId = promoCodeObj.id;
        }
      } catch (err) {
        console.warn('[Checkout] Failed to look up promo code:', err);
        // Continue without discount rather than blocking checkout
      }
    }

    const metadataPayload = {
      userId: user.id,
      product: tier,
      ...(referralPromoCodeId && { referral_promo_code_id: referralPromoCodeId }),
    };

    // Use verified user identity — never trust client-provided userId/email
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      // NOTE: No GST/tax applied — business is not yet GST-registered.
      // When registering, add automatic_tax: { enabled: true } and
      // set tax_behavior='inclusive' on the Stripe Price object.
      success_url: `${siteUrl}/checkout/success`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: metadataPayload,
    };
    
    // For subscriptions, we pass metadata to the subscription object.
    // For payments (one-time), we pass metadata to the payment_intent.
    if (mode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: metadataPayload
      };
    } else if (mode === 'payment') {
      sessionParams.payment_intent_data = {
        metadata: metadataPayload
      };
    }

    // Apply discount if a valid promo code was found
    if (discounts.length > 0) {
      sessionParams.discounts = discounts;
    } else {
      // Allow customers to enter promo codes manually at checkout
      sessionParams.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ 
      id: session.id,
      url: session.url 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Stripe Checkout Error:', message);
    Sentry.captureException(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
