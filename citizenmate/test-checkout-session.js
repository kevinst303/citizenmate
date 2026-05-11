require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function run() {
  try {
    const sessionParams = {
      customer: 'cus_RukZqRBSsD2N8B', // Use a valid test customer if needed, or omit. I'll omit to just test parameters.
      line_items: [
        {
          price: 'price_1THcv4H15nIshCpR9jjjCNFr',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://www.citizenmate.com.au/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.citizenmate.com.au/pricing`,
      payment_intent_data: {
        metadata: { userId: '123', tier: 'sprint_pass' }
      },
      allow_promotion_codes: true
    };
    
    // Omit customer to avoid errors about non-existent customer
    delete sessionParams.customer;

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("Success:", session.id);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
