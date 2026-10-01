# v1.6 Production Rollout Runbook

> Code for v1.6 (Payment Trust & Production Readiness) was pushed to `main`
> on 2026-10-01 and deploys to Vercel automatically. **One manual step
> remains: apply the Supabase migration.** Until it is applied, the premium
> self-grant RLS hole still exists in production (the new code does not
> depend on it, so deploying code first is safe).

## 1. Apply the Supabase migration (required, ~1 minute)

The project is not linked to the Supabase CLI on this machine, so either:

**Option A — Dashboard (fastest):**
1. Open https://supabase.com/dashboard → your CitizenMate project → **SQL Editor**
2. Paste the contents of `citizenmate/supabase/migrations/20261001000000_lock_entitlement_columns.sql`
3. Run it (it only touches `profiles` policies/grants — no table rebuild, no data change)

**Option B — CLI:**
```bash
cd citizenmate
supabase login                      # opens browser
supabase link --project-ref <your-project-ref>
supabase db push
```

### Verify it worked
In the SQL Editor:
```sql
-- Should return the two locked-down policies:
select policyname from pg_policies where tablename = 'profiles';
-- Should show column-scoped UPDATE grants:
select privilege_type, column_name from information_schema.column_privileges
where table_name = 'profiles' and grantee = 'authenticated';
```
Expected: UPDATE grants on exactly `test_date, study_language, xp, level`;
no INSERT privilege for `authenticated`.

## 2. Post-deploy smoke checks (verified live 2026-10-01 ✅)

```bash
# Landing page must contain real text, NOT raw keys:
curl -sL https://citizenmate.com.au/en | grep -c "Pass your Australian Citizenship Test"
# → 2 (was 0 before v1.6)
curl -sL https://citizenmate.com.au/en | grep -c ">landing\."
# → 0 (raw keys no longer rendered)

# New free-tier copy is live:
curl -sL https://citizenmate.com.au/en | grep -c "20 AI tutor questions per day"
# → 2

# Other pages:
curl -sL -o /dev/null -w "%{http_code}\n" https://citizenmate.com.au/en/checkout/success  # → 200
curl -sL -o /dev/null -w "%{http_code}\n" https://citizenmate.com.au/en/free-test         # → 200
curl -sL -X POST https://citizenmate.com.au/api/billing-portal \
  -H 'Content-Type: application/json' -d '{}'                                             # → 401 unauth
```

> Note: `/en/checkout` itself 404s by design — checkout is initiated from
> pricing/upgrade CTAs and completes on Stripe's hosted page (`/en/checkout`
> only has `success/` and `cancel/` children). Not a defect.

## 2b. ⚠️ Watch item: Supabase health reports "unreachable"

`GET /api/health` on production returned
`{"stripe":"connected","redis":"connected","supabase":"unreachable"}` on
2026-10-01. Stripe/Redis fine; the Supabase auth health probe (5s timeout)
failed. Possible causes: transient timeout, or a **paused free-tier Supabase
project** (free projects pause after ~1 week of inactivity — this codebase
was dormant from May to October).

**Check now:** open the Supabase dashboard — if the project is paused,
restore it (members cannot sign in or sync while paused), then re-run:

```bash
curl -s https://citizenmate.com.au/api/health
# expect "supabase":"connected"
```

## 3. Stripe dashboard (user action, one-time)

1. **Billing portal**: Stripe Dashboard → Settings → Billing → Customer
   portal → activate for **Live mode**. Until then, the new Settings
   "Manage subscription" button will return a Stripe error for live users.
2. **Webhook events**: confirm the webhook endpoint subscribes to
   `invoice.payment_failed` (newly handled dunning email) in addition to the
   existing events. No endpoint URL change needed.

## 4. Recommended follow-ups

- Rotate the TestSprite API key that lived in `testsprite_tests/tmp/config.json`
  (now gitignored, but it existed in plaintext on disk).
- Run one Stripe **test-mode** purchase locally with webhook forwarding
  (`stripe listen --forward-to localhost:4000/api/webhooks/stripe`) to
  exercise Sprint Pass + a yearly subscription end-to-end — local `.env.local`
  has no Stripe keys, so this was verified by unit tests + build only.
