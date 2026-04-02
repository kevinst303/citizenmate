import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// ===== Stripe Webhook Handler =====
// Handles checkout completion and sets premium status + expiry.

const SPRINT_PASS_DAYS = 90;

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error('Stripe environment variables not configured');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    appInfo: { name: 'CitizenMate', version: '1.0.0' },
  });

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    const adminSupabase = createSupabaseAdminClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const stripeCustomerId = session.customer as string | null;

        if (userId) {
          // Calculate premium expiry (90 days from now)
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + SPRINT_PASS_DAYS);

          console.log(`[Webhook] Sprint Pass purchased by user ${userId}. Expires: ${expiresAt.toISOString()}`);

          const updateData: Record<string, unknown> = {
            is_premium: true,
            premium_expires_at: expiresAt.toISOString(),
          };

          // Store Stripe customer ID for future lookups
          if (stripeCustomerId) {
            updateData.stripe_customer_id = stripeCustomerId;
          }

          const { error } = await adminSupabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId);

          if (error) {
            console.error('[Webhook] Error updating premium status:', error);
            throw new Error('Supabase update failed');
          }

          console.log(`[Webhook] Premium activated for user ${userId} until ${expiresAt.toISOString()}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        // Handle subscription cancellation (future-proofing for if we add subscriptions)
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log(`[Webhook] Subscription cancelled for customer: ${customerId}`);

        // Find user by stripe_customer_id and revoke premium
        const { error } = await adminSupabase
          .from('profiles')
          .update({
            is_premium: false,
            premium_expires_at: null,
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('[Webhook] Error revoking premium on subscription delete:', error);
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Webhook] Error processing: ${message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
