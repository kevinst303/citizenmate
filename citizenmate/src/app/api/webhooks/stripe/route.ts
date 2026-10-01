import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { sendPurchaseConfirmation, sendPaymentFailedEmail } from '@/lib/email';
import { checkAndProcessPendingReward } from '@/lib/referrals';
import { findReferrerByPromoCode } from '@/lib/referral-codes';
import * as Sentry from '@sentry/nextjs';

// ===== Stripe Webhook Handler =====
// Handles payment lifecycle events with idempotency protection.
// Events are deduplicated via the `processed_webhook_events` table
// to prevent double-fulfillment on Stripe retries.

const SPRINT_PASS_DAYS = 60;
// Grace days added on top of a subscription's current_period_end so access
// survives short webhook/processing delays and past_due retry windows.
const SUBSCRIPTION_GRACE_DAYS = 3;
// Days of continued access after a payment failure before revocation.
const PAST_DUE_GRACE_DAYS = 3;

function createStripeClient(): Stripe {
  const stripeKey = process.env.STRIPE_SECRET_KEY?.replace(/\\n/g, '')?.trim();
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
  // Upsert (not insert): on concurrent duplicate delivery the loser of the
  // race is silently ignored instead of failing the whole webhook with a
  // primary-key violation and triggering needless Stripe retries.
  await adminSupabase.from('processed_webhook_events').upsert(
    {
      event_id: eventId,
      event_type: eventType,
      processed_at: new Date().toISOString(),
    },
    { onConflict: 'event_id', ignoreDuplicates: true }
  );
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

  const tier = session.metadata?.product || 'premium';
  const stripe = createStripeClient();

  // Current expiry, so repeat purchases stack and nothing ever shortens.
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('premium_expires_at')
    .eq('id', userId)
    .single();
  const currentExpiry = profile?.premium_expires_at
    ? new Date(profile.premium_expires_at)
    : null;

  // Calculate premium expiry
  let expiresAt: Date;

  if (session.mode === 'subscription') {
    // Anchor the initial grant to the subscription's real current_period_end
    // (+ grace) rather than a hardcoded 31 days — a yearly plan must not
    // lapse at day 31 if customer.subscription.* events lost the ordering
    // race against this one.
    let periodEndMs: number | null = null;
    if (typeof session.subscription === 'string') {
      try {
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        const periodEnd = sub.items.data[0]?.current_period_end;
        periodEndMs = periodEnd ? periodEnd * 1000 : null;
      } catch (err) {
        console.error('[Webhook] Failed to retrieve subscription for period end:', err);
      }
    }

    if (periodEndMs) {
      expiresAt = new Date(periodEndMs);
    } else {
      // Fallback: monthly-length grant, corrected by invoice.paid /
      // customer.subscription.updated as soon as they arrive.
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 31);
    }
    expiresAt.setDate(expiresAt.getDate() + SUBSCRIPTION_GRACE_DAYS);
  } else {
    // Sprint pass: 60 days from the later of now or any existing expiry, so
    // repeat purchases stack instead of resetting.
    const now = new Date();
    const base = currentExpiry && currentExpiry > now ? currentExpiry : now;
    expiresAt = new Date(base.getTime());
    expiresAt.setDate(expiresAt.getDate() + SPRINT_PASS_DAYS);
  }

  if (currentExpiry && currentExpiry > expiresAt) {
    expiresAt = currentExpiry;
  }

  console.log(
    `[Webhook] Checkout completed | mode=${session.mode} | user=${userId} | expires=${expiresAt.toISOString()} | tier=${tier}`
  );

  const updateData: Record<string, unknown> = {
    is_premium: true,
    premium_expires_at: expiresAt.toISOString(),
    tier: tier,
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
    await sendPurchaseConfirmation(customerEmail, expiresAt.toISOString()).catch((err) => {
      console.error('[Webhook] Failed to send confirmation email:', err);
      Sentry.captureException(err, { extra: { email: customerEmail, userId } });
    });
  }

  // ── Process referral rewards ──
  // 1. A code applied via the app's cookie flow arrives in session metadata…
  let referralPromoCodeId = session.metadata?.referral_promo_code_id;

  // 2. …but a code the buyer typed into Stripe's own promo box only appears
  //    in the session's discount breakdown, so expand and attribute it too.
  if (!referralPromoCodeId) {
    try {
      const expanded = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['total_details.breakdown'],
      });
      const discounts = expanded.total_details?.breakdown?.discounts ?? [];
      const promoCode = discounts.map((d) => d.discount.promotion_code).find(Boolean);
      referralPromoCodeId = typeof promoCode === 'string' ? promoCode : promoCode?.id;
    } catch (err) {
      console.error('[Webhook] Failed to expand checkout discounts for referral attribution:', err);
    }
  }

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
      Sentry.captureException(err, { extra: { referralPromoCodeId, buyerId: userId } });
    }
  }

  // 2. Buyer just purchased → they qualify as a referee. Check for pending rewards.
  try {
    await checkAndProcessPendingReward(userId);
  } catch (err) {
    console.error('[Webhook] Failed to check pending referral reward:', err);
    Sentry.captureException(err, { extra: { userId } });
  }
}

async function handleSubscriptionCreatedOrUpdated(
  subscription: Stripe.Subscription,
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<void> {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const tier = subscription.metadata?.product || 'premium';
  // checkout puts the buyer's user id on the subscription's metadata; rely on
  // it as a second match key because customer.subscription.created can arrive
  // BEFORE checkout.session.completed saved stripe_customer_id on the profile.
  const metadataUserId = subscription.metadata?.userId;

  console.log(`[Webhook] Subscription ${status} | customer=${customerId} | tier=${tier} | user=${metadataUserId || 'unknown'}`);

  if (status === 'active' || status === 'trialing') {
    // Current period end is in seconds, convert to milliseconds
    const currentPeriodEnd = subscription.items.data[0]?.current_period_end ?? Math.floor(Date.now() / 1000);
    const expiresAt = new Date(currentPeriodEnd * 1000);
    // Add 3 days grace period
    expiresAt.setDate(expiresAt.getDate() + SUBSCRIPTION_GRACE_DAYS);

    // Match by customer id OR by metadata user id (ordering-race safety), and
    // never shorten an existing later expiry (e.g. stacked sprint-pass days).
    let query = adminSupabase
      .from('profiles')
      .select('id, premium_expires_at');

    if (metadataUserId) {
      query = query.or(`stripe_customer_id.eq.${customerId},id.eq.${metadataUserId}`);
    } else {
      query = query.eq('stripe_customer_id', customerId);
    }

    const { data: profiles, error: fetchError } = await query;

    if (fetchError) {
      console.error('[Webhook] Failed to fetch profiles for subscription update:', fetchError.message);
      Sentry.captureException(new Error(`Failed to fetch profiles for subscription update: ${fetchError.message}`), {
        extra: { customerId, status },
      });
      return;
    }

    if (!profiles || profiles.length === 0) {
      // No match at all — nothing we can do beyond surfacing it.
      console.error(`[Webhook] Subscription update matched no profile | customer=${customerId} | user=${metadataUserId || 'unknown'}`);
      Sentry.captureException(new Error('Subscription webhook matched no profile'), {
        extra: { customerId, status, metadataUserId },
      });
      return;
    }

    for (const profile of profiles) {
      const existingExpiry = profile.premium_expires_at ? new Date(profile.premium_expires_at) : null;
      const finalExpiry = existingExpiry && existingExpiry > expiresAt ? existingExpiry : expiresAt;

      const { error } = await adminSupabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_expires_at: finalExpiry.toISOString(),
          tier: tier,
          stripe_customer_id: customerId,
        })
        .eq('id', profile.id);

      if (error) {
        console.error('[Webhook] Failed to update premium access:', error.message);
        Sentry.captureException(new Error(`Failed to update premium access: ${error.message}`), {
          extra: { customerId, status, profileId: profile.id },
        });
      }
    }
  } else if (status === 'past_due') {
    // Payment failed but Stripe is retrying — keep access for a grace window
    // instead of cutting the member off on the first failure.
    const graceExpiry = new Date();
    graceExpiry.setDate(graceExpiry.getDate() + PAST_DUE_GRACE_DAYS);

    const { data: profiles } = await adminSupabase
      .from('profiles')
      .select('id, premium_expires_at')
      .eq('stripe_customer_id', customerId);

    for (const profile of profiles ?? []) {
      const existingExpiry = profile.premium_expires_at ? new Date(profile.premium_expires_at) : null;
      const finalExpiry = existingExpiry && existingExpiry > graceExpiry ? existingExpiry : graceExpiry;

      await adminSupabase
        .from('profiles')
        .update({ premium_expires_at: finalExpiry.toISOString() })
        .eq('id', profile.id);
    }
    console.log(`[Webhook] past_due grace applied | customer=${customerId} | until≈${graceExpiry.toISOString()}`);
  } else if (status === 'canceled' || status === 'unpaid') {
    const { error } = await adminSupabase
      .from('profiles')
      .update({
        is_premium: false,
        premium_expires_at: null,
        tier: 'free',
      })
      .eq('stripe_customer_id', customerId);

    if (error) {
      console.error('[Webhook] Failed to revoke premium access:', error.message);
      Sentry.captureException(new Error(`Failed to revoke premium access: ${error.message}`), {
        extra: { customerId, status },
      });
    }
  }
}

async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<void> {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice.parent?.subscription_details?.subscription as string) ?? null;

  console.log(
    `[Webhook] Invoice paid | invoice=${invoice.id} | customer=${customerId} | amount=${invoice.amount_paid} | subscription=${subscriptionId || 'none'}`
  );

  // For subscription renewals, customer.subscription.updated handles the expiry extension.
  // Here we provide canonical confirmation and could trigger renewal-specific logic.

  if (customerId) {
    // Verify the profile reflects the correct tier/expiry post-payment
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id, is_premium, premium_expires_at, tier')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profile && !profile.is_premium) {
      // Edge case: payment succeeded but profile wasn't updated by subscription handler.
      // This can happen if subscription.created fires before checkout.session.completed.
      console.log(`[Webhook] Re-granting premium on invoice.paid for customer ${customerId}`);

      // Anchor to the subscription's real period end, not a hardcoded guess.
      let expiresAt: Date | null = null;
      if (subscriptionId) {
        try {
          const stripe = createStripeClient();
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const periodEnd = sub.items.data[0]?.current_period_end;
          if (periodEnd) {
            expiresAt = new Date(periodEnd * 1000);
            expiresAt.setDate(expiresAt.getDate() + SUBSCRIPTION_GRACE_DAYS);
          }
        } catch (err) {
          console.error('[Webhook] Failed to retrieve subscription on invoice.paid:', err);
        }
      }
      if (!expiresAt) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 31);
      }

      await adminSupabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_expires_at: expiresAt.toISOString(),
        })
        .eq('id', profile.id);
    }
  }

  // Future: send renewal receipt email, update revenue KPIs
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<void> {
  const customerId = invoice.customer as string;
  console.error(
    `[Webhook] Invoice payment failed | invoice=${invoice.id} | customer=${customerId} | attempt=${invoice.attempt_count}`
  );

  // Dunning email so the member knows to update their card — access itself
  // persists through the past_due grace window (see subscription handler).
  try {
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('email, tier')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profile?.email) {
      await sendPaymentFailedEmail(profile.email, profile.tier || 'premium');
    }
  } catch (err) {
    console.error('[Webhook] Failed to send payment-failed email:', err);
    Sentry.captureException(err, { extra: { customerId, invoiceId: invoice.id } });
  }
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const userId = paymentIntent.metadata?.userId;
  console.error(
    `[Webhook] Payment failed | user=${userId || 'unknown'} | pi=${paymentIntent.id} | reason=${paymentIntent.last_payment_error?.message || 'unknown'}`
  );
  Sentry.captureException(
    new Error(`Stripe payment failed: ${paymentIntent.last_payment_error?.message || 'unknown'}`),
    { extra: { userId, paymentIntentId: paymentIntent.id } }
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
        .update({ is_premium: false, tier: 'free' })
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

  const isFullRefund = charge.amount_refunded >= charge.amount;
  if (isFullRefund && customerId) {
    // Only revoke if the customer has no OTHER active subscription — a Sprint
    // Pass refund must not also wipe a running subscription (and vice versa).
    try {
      const stripe = createStripeClient();
      const activeSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      });

      if (activeSubs.data.length > 0) {
        console.log(
          `[Webhook] Refund skipped revocation — active subscription remains | charge=${charge.id} | customer=${customerId}`
        );
        return;
      }
    } catch (err) {
      console.error('[Webhook] Failed to check active subscriptions before refund revoke:', err);
      Sentry.captureException(err, { extra: { customerId, chargeId: charge.id } });
      // Fail open: don't revoke if we can't verify — over-revoking a paying
      // member is worse than a delayed revoke.
      return;
    }

    const { error } = await adminSupabase
      .from('profiles')
      .update({
        is_premium: false,
        premium_expires_at: null,
        tier: 'free',
      })
      .eq('stripe_customer_id', customerId);

    if (error) {
      console.error('[Webhook] Failed to revoke premium on refund:', error.message);
      Sentry.captureException(new Error(`Failed to revoke premium on refund: ${error.message}`), {
        extra: { customerId, chargeId: charge.id },
      });
    }
  } else {
    console.log(
      `[Webhook] Partial refund — not revoking premium | charge=${charge.id} | refunded=${charge.amount_refunded}/${charge.amount}`
    );
  }
}

// ── Main Handler ──

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.replace(/\\n/g, '').trim();

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

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionCreatedOrUpdated(
          event.data.object as Stripe.Subscription,
          adminSupabase
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice,
          adminSupabase
        );
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

      case 'invoice.paid':
        await handleInvoicePaid(
          event.data.object as Stripe.Invoice,
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
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
