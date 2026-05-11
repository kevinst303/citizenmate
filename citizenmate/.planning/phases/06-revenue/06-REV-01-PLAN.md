---
phase: "06"
plan: "REV-01"
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: ["REV-01", "REV-02", "REV-03"]
task_count: 5
---

# Plan REV-01: Revenue Engine Audit — Stripe Webhook & Onboarding Flow

**Objective:** Verify Stripe webhook handler manages subscription lifecycle correctly, and the test-date-anchored onboarding flow generates a personalized study plan end-to-end.

## Tasks

### Task 1: Audit Stripe Webhook Handler
<task id="6.1" autonomous="true">

<read_first>
- src/app/api/webhooks/stripe/route.ts
- .env.example
- src/lib/stripe.ts (if exists)
</read_first>

<action>
Audit the Stripe webhook handler (`src/app/api/webhooks/stripe/route.ts`) for subscription lifecycle management:

1. Verify webhook signature verification is in place (`stripe.webhooks.constructEvent`)
2. Check that these Stripe events are handled:
   - `checkout.session.completed` — subscription created
   - `customer.subscription.updated` — plan changes, cancellations
   - `customer.subscription.deleted` — subscription ended
   - `invoice.paid` — payment confirmation
   - `invoice.payment_failed` — dunning management
3. Verify each event handler updates the `subscriptions` table in Supabase with correct status
4. Check for proper error handling and Sentry capture on failures
5. Verify the webhook returns 200 quickly (async processing of heavy work)
</action>

<acceptance_criteria>
- grep "constructEvent" src/app/api/webhooks/stripe/route.ts returns a match
- grep "checkout.session.completed" src/app/api/webhooks/stripe/route.ts returns a match
- grep "customer.subscription" src/app/api/webhooks/stripe/route.ts returns a match
- grep "invoice.paid\|invoice.payment_failed" src/app/api/webhooks/stripe/route.ts returns a match
- grep "Sentry.captureException\|captureException" src/app/api/webhooks/stripe/route.ts returns a match (or Sentry wrapping exists)
- Any gaps found are documented with severity (critical/major/minor)
</acceptance_criteria>

</task>

### Task 2: Verify Test-Date → Study Plan Onboarding Flow
<task id="6.2" autonomous="true">

<read_first>
- src/lib/test-date-context.tsx
- src/lib/study-context.tsx
- src/app/[lang]/onboarding/ (all page files)
- src/app/[lang]/dashboard/page.tsx
</read_first>

<action>
Trace the complete onboarding flow from test date entry to dashboard:

1. **TestDateProvider** (`src/lib/test-date-context.tsx`):
   - Verify it stores test date in state + persists to Supabase
   - Verify it calculates days until test and readiness score
   
2. **StudyProvider** (`src/lib/study-context.tsx`):
   - Verify it generates a study plan based on test date + user's knowledge gaps
   - Check if it provides daily/weekly study targets
   
3. **Onboarding pages** (`src/app/[lang]/onboarding/`):
   - Trace the flow from test date input → study plan generation → dashboard
   - Verify each step passes data correctly to the next
   
4. **Integration check**:
   - Test date context is available in the dashboard
   - Study plan context is available in the dashboard
   - Dashboard displays personalized plan based on test date
</action>

<acceptance_criteria>
- grep "TestDateProvider\|createTestDate\|testDate" src/lib/test-date-context.tsx returns matches
- grep "StudyProvider\|studyPlan\|generatePlan" src/lib/study-context.tsx returns matches
- ls src/app/[lang]/onboarding/ returns at least one page file
- grep "TestDateProvider\|StudyProvider" src/app/[lang]/layout.tsx returns a match (providers in layout)
- Any broken links or missing data flow documented
</acceptance_criteria>

</task>

### Task 3: Count and Categorize Upgrade Triggers
<task id="6.3" autonomous="true">

<read_first>
- src/components/global/upgrade-modal.tsx
- src/app/[lang]/layout.tsx (look for upgrade modal usage)
- Search for all files importing or referencing upgrade-modal
</read_first>

<action>
Find and categorize all 6 distinct upgrade triggers:

1. Run a comprehensive grep for upgrade modal triggers:
   - Search for `UpgradeModal`, `upgrade-modal`, `showUpgrade`, `setShowUpgrade` across the codebase
   - Search for `checkout`, `/api/checkout` callers to find payment prompts

2. Categorize each trigger by:
   - **Location**: Which component/page triggers it
   - **Condition**: What user action or state causes the trigger
   - **Type**: Feature-gate, usage-limit, time-based, etc.

3. Expected triggers (from REV-02 requirement):
   - AI Tutor usage limit reached
   - Study plan generation (after onboarding)
   - Accessing premium quiz features
   - Dashboard "Go Pro" CTA
   - Feature comparison/pricing page
   - Inactivity/reactivation prompt

4. If fewer than 6 triggers found, document the gap and what's missing
5. If more than 6, list all and identify duplicates
</action>

<acceptance_criteria>
- At least 6 distinct upgrade triggers are identified and documented
- Each trigger has: location, condition, and type documented
- grep -r "UpgradeModal\|upgrade-modal\|setShowUpgrade" src/ --include="*.tsx" --include="*.ts" returns at least 6 distinct call sites
- Report includes a table: Trigger | File | Condition | Type | Status (active/inactive)
</acceptance_criteria>

</task>

### Task 4: Verify Stripe Price ID ↔ Tier Mapping
<task id="6.4" autonomous="true">

<read_first>
- .env.example
- src/app/api/checkout/route.ts
- src/components/global/upgrade-modal.tsx (or wherever price IDs are used)
</read_first>

<action>
Verify all Stripe price IDs correctly map to subscription tiers:

1. Extract all Stripe price IDs from `.env.example`:
   - `STRIPE_PRO_MONTHLY_PRICE_ID`
   - `STRIPE_PRO_YEARLY_PRICE_ID`
   - `STRIPE_PREMIUM_MONTHLY_PRICE_ID`
   - `STRIPE_PREMIUM_YEARLY_PRICE_ID`
   - `STRIPE_SPRINT_PASS_PRICE_ID`

2. Verify each price ID is used in `src/app/api/checkout/route.ts`:
   - Check that the correct price ID is selected based on the requested tier + interval
   - Verify Pro vs Premium routing logic
   - Verify Sprint Pass (one-time payment) routing

3. Check that the upgrade modal sends the correct price ID to the checkout API

4. Verify `.env.example` has documentation comments explaining each price ID
</action>

<acceptance_criteria>
- .env.example contains all 5 price IDs: STRIPE_PRO_MONTHLY, STRIPE_PRO_YEARLY, STRIPE_PREMIUM_MONTHLY, STRIPE_PREMIUM_YEARLY, STRIPE_SPRINT_PASS
- grep "STRIPE_PRO_MONTHLY_PRICE_ID\|STRIPE_PRO_YEARLY_PRICE_ID\|STRIPE_PREMIUM_MONTHLY_PRICE_ID\|STRIPE_PREMIUM_YEARLY_PRICE_ID\|STRIPE_SPRINT_PASS_PRICE_ID" src/app/api/checkout/route.ts returns matches
- Price ID selection logic distinguishes between Pro, Premium, and Sprint Pass
- Any missing price ID mappings documented
</acceptance_criteria>

</task>

### Task 5: Audit Upgrade Modal Against Design System
<task id="6.5" autonomous="true">

<read_first>
- src/components/global/upgrade-modal.tsx
- src/components/global/upgrade-modal.module.css (if exists)
- docs/research/conseil/DESIGN_TOKENS.md (design token reference)
</read_first>

<action>
Audit the upgrade modal implementation against the Conseil design system:

1. **Visual audit — check against Conseil tokens**:
   - Colors: Primary teal (#006d77), Secondary (#3d348b), card borders (#E9ECEF)
   - Typography: Poppins for headings, Inter for body text
   - Card radius: 15px, dual-layer shadow
   - Button styles: Conseil primary/secondary button patterns
   
2. **Functional audit**:
   - Modal overlay: backdrop blur/dark with proper z-index
   - Close button: accessible, properly positioned
   - Pricing display: clear tier comparison
   - CTA buttons: "Get Pro" / "Get Premium" with Stripe redirect
   - Loading state during checkout redirect
   - Error state if checkout fails

3. **Content audit**:
   - Feature comparison between Free/Pro/Premium tiers is accurate
   - Pricing matches current Stripe configuration
   - Sprint Pass option displayed if applicable

4. Document any deviations from the Conseil spec
</action>

<acceptance_criteria>
- Modal uses primary color #006d77 for CTAs
- Modal uses Poppins font for headings
- Modal has proper overlay (backdrop blur or dark background)
- Close button is accessible and functional
- Loading state exists for checkout redirect
- All deviations from Conseil design system documented
</acceptance_criteria>

</task>

## Verification

### must_haves
- Stripe webhook handles all 5 required events with proper error handling
- Onboarding flow connects test date → study plan → dashboard without breaks
- 6 distinct upgrade triggers are active and documented
- All 5 Stripe price IDs map to correct tiers in checkout route
- Upgrade modal meets Conseil design system requirements

### human_verification
- Manual checkout flow test: verify Pro Monthly, Pro Yearly, Premium Monthly, Premium Yearly, Sprint Pass all create valid Stripe sessions
- Visual review of upgrade modal on desktop and mobile
