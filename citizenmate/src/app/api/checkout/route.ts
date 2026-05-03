import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { checkoutLimiter } from '@/lib/rate-limit';

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

    // ── Parse optional promo code from request body ──
    let promoCode: string | undefined;
    try {
      const body = await req.json().catch(() => ({}));
      promoCode = body.promoCode;
    } catch {
      // No body or invalid JSON — continue without promo code
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

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID not configured' }, { status: 500 });
    }

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

    // Use verified user identity — never trust client-provided userId/email
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment for Sprint Pass
      // NOTE: No GST/tax applied — business is not yet GST-registered.
      // When registering, add automatic_tax: { enabled: true } and
      // set tax_behavior='inclusive' on the Stripe Price object.
      success_url: `${siteUrl}/checkout/success`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        product: 'sprint_pass',
        ...(referralPromoCodeId && { referral_promo_code_id: referralPromoCodeId }),
      },
    };

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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
