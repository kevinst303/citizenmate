import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

// ===== Admin Promo Code Management API =====
// GET: List all user promo codes with redemption info
// POST: Manually create a promo code for a user
// PATCH: Deactivate a promo code

function createStripeClient(): Stripe {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(stripeKey, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    appInfo: { name: 'CitizenMate', version: '1.1.0' },
  });
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adminSupabase = createSupabaseAdminClient();

    // Get all users who have promo codes
    const { data: usersWithCodes, error } = await adminSupabase
      .from('profiles')
      .select('id, display_name, email, referral_promo_code, created_at')
      .not('referral_promo_code', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch codes' }, { status: 500 });
    }

    // Get referral counts for each user
    const userIds = usersWithCodes?.map((u) => u.id) || [];
    let referralCounts: Record<string, { total: number; qualified: number }> = {};

    if (userIds.length > 0) {
      const { data: rewards } = await adminSupabase
        .from('referral_rewards')
        .select('referrer_id, qualified')
        .in('referrer_id', userIds);

      if (rewards) {
        rewards.forEach((r) => {
          if (!referralCounts[r.referrer_id]) {
            referralCounts[r.referrer_id] = { total: 0, qualified: 0 };
          }
          referralCounts[r.referrer_id].total++;
          if (r.qualified) referralCounts[r.referrer_id].qualified++;
        });
      }
    }

    const codes = usersWithCodes?.map((u) => ({
      userId: u.id,
      name: u.display_name || 'Unknown',
      email: u.email,
      code: u.referral_promo_code,
      createdAt: u.created_at,
      totalReferred: referralCounts[u.id]?.total || 0,
      qualifiedReferred: referralCounts[u.id]?.qualified || 0,
    })) || [];

    return NextResponse.json({ codes });
  } catch (error) {
    console.error('[AdminCodes] GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { code, action } = await req.json();

    if (!code || !action) {
      return NextResponse.json({ error: 'Missing code or action' }, { status: 400 });
    }

    const stripe = createStripeClient();

    if (action === 'deactivate') {
      // Find Stripe promo code by code string
      const promoCodes = await stripe.promotionCodes.list({
        code,
        limit: 1,
      });

      if (promoCodes.data.length > 0) {
        await stripe.promotionCodes.update(promoCodes.data[0].id, {
          active: false,
        });
      }

      // Also clear from user profile
      const adminSupabase = createSupabaseAdminClient();
      await adminSupabase
        .from('profiles')
        .update({ referral_promo_code: null })
        .eq('referral_promo_code', code);

      return NextResponse.json({ success: true, message: 'Code deactivated' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[AdminCodes] PATCH error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
