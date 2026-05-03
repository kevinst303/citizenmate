import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { sendPurchaseConfirmation } from '@/lib/email';
import { checkAndProcessPendingReward } from '@/lib/referrals';
import { findReferrerByPromoCode } from '@/lib/referral-codes';

// ===== Stripe Webhook Handler =====
// Handles payment lifecycle events with idempotency protection.
// Events are deduplicated via the `processed_webhook_events` table
// to prevent double-fulfillment on Stripe retries.

const SPRINT_PASS_DAYS = 60;

function createStripeClient(): Stripe {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured');

  return new Stripe(stripeKey, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    appInfo: { name: 'CitizenMate', version: '1.1.0' },
  });
}

// ── Idempotency: check if event was already processed ──

async function isEventProcessed(
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>,
  eventId: string
): Promise<boolean> {
  const { data } = await adminSupabase
    .from('processed_webhook_events')
    .select('event_id')
    .eq('event_id', eventId)
    .single();

  return !!data;
}

async function markEventProcessed(
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>,
  eventId: string,
  eventType: string
): Promise<void> {
  await adminSupabase.from('processed_webhook_events').insert({
    event_id: eventId,
    event_type: eventType,
    processed_at: new Date().toISOString(),
  });
}

// ── Event Handlers ──

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<void> {
  const userId = session.client_reference_id;
  const stripeCustomerId = session.customer as string | null;

  if (!userId) {
    console.error('[Webhook] checkout.session.completed missing client_reference_id');
    return;
  }

  // Calculate premium expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SPRINT_PASS_DAYS);

  console.log(
    `[Webhook] Sprint Pass purchased | user=${userId} | expires=${expiresAt.toISOString()}`
  );

  const updateData: Record<string, unknown> = {
    is_premium: true,
    premium_expires_at: expiresAt.toISOString(),
  };

  if (stripeCustomerId) {
    updateData.stripe_customer_id = stripeCustomerId;
  }

  const { error } = await adminSupabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('[Webhook] Supabase update failed:', error.message);
    throw new Error(`Failed to activate premium for user ${userId}`);
  }

  console.log(
    `[Webhook] Premium activated | user=${userId} | until=${expiresAt.toISOString()}`
  );

  // Send purchase confirmation email
  const customerEmail = session.customer_details?.email || session.customer_email;
  if (customerEmail) {
    await sendPurchaseConfirmation(customerEmail, expiresAt.toISOString()).catch((err) =>
      console.error('[Webhook] Failed to send confirmation email:', err)
    );
  }

  // ── Process referral rewards ──
  // 1. If this checkout used a referral promo code, credit the referrer
  const referralPromoCodeId = session.metadata?.referral_promo_code_id;
  if (referralPromoCodeId) {
    try {
      const referrerId = await findReferrerByPromoCode(referralPromoCodeId);
      if (referrerId) {
        console.log(`[Webhook] Referral purchase detected | referrer=${referrerId} | buyer=${userId}`);
        // Store the referral relationship if not already present
        await adminSupabase
          .from('profiles')
          .update({ referred_by: referrerId })
          .eq('id', userId)
          .is('referred_by', null); // Only set if not already referred
      }
    } catch (err) {
      console.error('[Webhook] Failed to process referral promo code:', err);
    }
  }

  // 2. Buyer just purchased → they qualify as a referee. Check for pending rewards.
  try {
    await checkAndProcessPendingReward(userId);
  } catch (err) {
    console.error('[Webhook] Failed to check pending referral reward:', err);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<void> {
  const customerId = subscription.customer as string;

  console.log(`[Webhook] Subscription cancelled | customer=${customerId}`);

  const { error } = await adminSupabase
    .from('profiles')
    .update({
      is_premium: false,
      premium_expires_at: null,
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('[Webhook] Failed to revoke premium:', error.message);
  }
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const userId = paymentIntent.metadata?.userId;
  console.error(
    `[Webhook] Payment failed | user=${userId || 'unknown'} | pi=${paymentIntent.id} | reason=${paymentIntent.last_payment_error?.message || 'unknown'}`
  );
  // Future: send failure notification email via Resend/Postmark
}

async function handleChargeDisputed(
  dispute: Stripe.Dispute,
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<void> {
  const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge?.id;
  console.error(
    `[Webhook] Charge disputed | dispute=${dispute.id} | charge=${chargeId} | amount=${dispute.amount} | reason=${dispute.reason}`
  );

  // Revoke premium access during dispute to prevent abuse
  if (dispute.payment_intent) {
    const piId = typeof dispute.payment_intent === 'string'
      ? dispute.payment_intent
      : dispute.payment_intent.id;

    // Try to find user from payment intent metadata
    const stripe = createStripeClient();
    const pi = await stripe.paymentIntents.retrieve(piId);
    const userId = pi.metadata?.userId;

    if (userId) {
      console.log(`[Webhook] Revoking premium during dispute | user=${userId}`);
      await adminSupabase
        .from('profiles')
        .update({ is_premium: false })
        .eq('id', userId);
    }
  }
}

async function handleChargeRefunded(
  charge: Stripe.Charge,
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<void> {
  const customerId = charge.customer as string | null;
  console.log(
    `[Webhook] Charge refunded | charge=${charge.id} | customer=${customerId} | amount=${charge.amount_refunded}`
  );

  // Full refund → revoke premium
  if (charge.refunded && customerId) {
    const { error } = await adminSupabase
      .from('profiles')
      .update({
        is_premium: false,
        premium_expires_at: null,
      })
      .eq('stripe_customer_id', customerId);

    if (error) {
      console.error('[Webhook] Failed to revoke premium on refund:', error.message);
    }
  }
}

// ── Main Handler ──

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // ── Verify signature ──
  let event: Stripe.Event;
  try {
    const stripe = createStripeClient();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Webhook] Signature verification failed: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // ── Idempotency check ──
  const adminSupabase = createSupabaseAdminClient();

  try {
    const alreadyProcessed = await isEventProcessed(adminSupabase, event.id);
    if (alreadyProcessed) {
      console.log(`[Webhook] Skipping duplicate event | id=${event.id} | type=${event.type}`);
      return NextResponse.json({ received: true, duplicate: true });
    }
  } catch (err) {
    // If idempotency check fails, log but continue processing
    // (better to risk double-processing than to miss a payment)
    console.error('[Webhook] Idempotency check failed, continuing:', err);
  }

  // ── Process event ──
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
          adminSupabase
        );
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
          adminSupabase
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.dispute.created':
        await handleChargeDisputed(
          event.data.object as Stripe.Dispute,
          adminSupabase
        );
        break;

      case 'charge.refunded':
        await handleChargeRefunded(
          event.data.object as Stripe.Charge,
          adminSupabase
        );
        break;

      default:
        console.log(`[Webhook] Unhandled event | type=${event.type}`);
    }

    // ── Mark as processed ──
    await markEventProcessed(adminSupabase, event.id, event.type);

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Webhook] Processing error | event=${event.id} | type=${event.type} | error=${message}`);
    // Return 500 so Stripe retries the event
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
