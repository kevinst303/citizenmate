import Stripe from "stripe";
import CheckoutSuccessClient from "./success-client";

// Reads ?session_id= and verifies the payment with Stripe before rendering.
// Never trust the redirect alone: if the webhook is slow, the member still
// sees an accurate, tier-correct confirmation instead of free-tier UI.
export const dynamic = "force-dynamic";

type VerifiedSession = {
  verified: boolean;
  tier: string | null;
  mode: "subscription" | "payment" | "setup" | null;
  interval: string | null;
};

async function verifySession(sessionId: string): Promise<VerifiedSession> {
  const result: VerifiedSession = { verified: false, tier: null, mode: null, interval: null };

  const stripeKey = process.env.STRIPE_SECRET_KEY?.replace(/\\n/g, "")?.trim();
  if (!stripeKey) return result;

  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status !== "complete") return result;

    result.verified = session.payment_status === "paid";
    result.tier = session.metadata?.product ?? null;
    result.mode = session.mode;

    if (session.mode === "subscription" && typeof session.subscription === "string") {
      try {
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        result.interval = sub.items.data[0]?.price?.recurring?.interval ?? null;
      } catch {
        // Display-only concern — success/copy falls back to generic wording.
      }
    }
  } catch (err) {
    console.error("[CheckoutSuccess] Session verification failed:", err);
  }

  return result;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const verification = sessionId
    ? await verifySession(sessionId)
    : { verified: false, tier: null, mode: null, interval: null };

  return <CheckoutSuccessClient {...verification} />;
}
