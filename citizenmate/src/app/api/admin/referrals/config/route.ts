import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

// ===== Admin Referral Config API =====
// GET: Retrieve current referral program configuration
// PUT: Update configuration (discount %, reward days, max cap, qualification rules)

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adminSupabase = createSupabaseAdminClient();
    const { data, error } = await adminSupabase
      .from('referral_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      // Return defaults if no config row exists
      return NextResponse.json({
        discount_percent: 20,
        reward_days: 7,
        max_referrals_per_user: 5,
        require_quiz_completion: true,
        require_purchase: false,
        program_active: true,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[AdminReferral] Config GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate inputs
    const {
      discount_percent,
      reward_days,
      max_referrals_per_user,
      require_quiz_completion,
      require_purchase,
      program_active,
    } = body;

    if (discount_percent !== undefined && (discount_percent < 1 || discount_percent > 100)) {
      return NextResponse.json({ error: 'Discount must be between 1-100%' }, { status: 400 });
    }
    if (reward_days !== undefined && (reward_days < 1 || reward_days > 90)) {
      return NextResponse.json({ error: 'Reward days must be between 1-90' }, { status: 400 });
    }
    if (max_referrals_per_user !== undefined && (max_referrals_per_user < 1 || max_referrals_per_user > 50)) {
      return NextResponse.json({ error: 'Max referrals must be between 1-50' }, { status: 400 });
    }

    const adminSupabase = createSupabaseAdminClient();

    // Upsert config (singleton row with id=1)
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (discount_percent !== undefined) updateData.discount_percent = Math.round(discount_percent);
    if (reward_days !== undefined) updateData.reward_days = Math.round(reward_days);
    if (max_referrals_per_user !== undefined) updateData.max_referrals_per_user = Math.round(max_referrals_per_user);
    if (require_quiz_completion !== undefined) updateData.require_quiz_completion = Boolean(require_quiz_completion);
    if (require_purchase !== undefined) updateData.require_purchase = Boolean(require_purchase);
    if (program_active !== undefined) updateData.program_active = Boolean(program_active);

    const { data, error } = await adminSupabase
      .from('referral_config')
      .upsert({ id: 1, ...updateData })
      .select()
      .single();

    if (error) {
      console.error('[AdminReferral] Config PUT error:', error);
      return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[AdminReferral] Config PUT error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
