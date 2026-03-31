import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build', {
    apiVersion: '2025-02-24.acacia' as any,
    appInfo: {
      name: 'CitizenMate',
      version: '0.1.0'
    }
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'dummy_webhook_secret_for_build';

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    const adminSupabase = createSupabaseAdminClient();
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        if (userId) {
          console.log(`Payment successful for user: ${userId}. Subscribed!`);
          
          const { error } = await adminSupabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('id', userId);
            
          if (error) {
            console.error('Error updating premium status in Supabase:', error);
            throw new Error('Supabase update failed');
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        // TODO: Handle subscription cancellation
        console.log(`Subscription deleted: ${subscription.id}`);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Error processing webhook: ${err.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
