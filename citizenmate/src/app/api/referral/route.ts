import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getOrCreateReferralCode, getReferralStats } from '@/lib/referral-codes';

// ===== Referral Code API =====
// GET: Retrieve user's referral code + stats
// POST: Generate a new referral code if user doesn't have one

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getReferralStats(user.id);

    return NextResponse.json({
      promoCode: stats.promoCode,
      totalReferred: stats.totalReferred,
      qualifiedReferred: stats.qualifiedReferred,
      rewardsClaimed: stats.rewardsClaimed,
      maxRewards: stats.maxRewards,
    });
  } catch (error) {
    console.error('[ReferralAPI] GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await getOrCreateReferralCode(user.id);

    if (!result) {
      return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
    }

    return NextResponse.json({
      promoCode: result.code,
    });
  } catch (error) {
    console.error('[ReferralAPI] POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
