import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build', {
      apiVersion: '2025-02-24.acacia' as any,
      appInfo: {
        name: 'CitizenMate',
        version: '0.1.0'
      }
    });

    const { priceId, userId, email } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Adjust to 'payment' if using one-off purchases
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenmate.com.au'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenmate.com.au'}/dashboard?canceled=true`,
      client_reference_id: userId,
      customer_email: email,
    });

    return NextResponse.json({ 
      id: session.id,
      url: session.url 
    });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
