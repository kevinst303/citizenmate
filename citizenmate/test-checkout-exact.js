require('dotenv').config({ path: '.env.vercel.prod' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY.replace(/\\n/g, '').trim());

async function run() {
  try {
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1THcv4H15nIshCpR9jjjCNFr',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://citizenmate.com.au/en/checkout/success`,
      cancel_url: `https://citizenmate.com.au/en/checkout/cancel`,
      client_reference_id: 'test-user-id',
      customer_email: 'vh2teen@gmail.com',
      metadata: { userId: 'test-user-id', product: 'sprint_pass' },
      payment_intent_data: {
        metadata: { userId: 'test-user-id', product: 'sprint_pass' }
      },
      allow_promotion_codes: true
    };
    
    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("Success:", session.id);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
