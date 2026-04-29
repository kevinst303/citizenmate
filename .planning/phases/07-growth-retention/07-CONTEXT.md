# Phase 7: Growth & Retention - Context

**Gathered:** 2026-04-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Deploy features designed to increase top-of-funnel acquisition and re-engage dormant users through internationalization, referral loops, and email notifications.

</domain>

<decisions>
## Implementation Decisions

### Internationalization (i18n) Strategy
- **Translation Management**: Server-side dictionaries (Next.js app router standard) using JSON files for fast SSR.
- **Languages**: Spanish, Hindi, Mandarin, Arabic.
- **Preference Persistence**: Cookie-based synced to the Supabase `profiles` table.
- **Content Scope**: App UI and Core Questions only (Study guides remain English).

### Referral Program "Help a Mate"
- **Link Structure**: `/?ref=userId` appended to landing/signup routes.
- **Tracking Mechanism**: Store referrer ID in a cookie, save to `profiles.referred_by` during Supabase signup.
- **Reward Mechanism**: Extend `premium_expires_at` by 7 days for both users upon successful signup.
- **Abuse Prevention**: Limit to 5 successful referrals per user; block same-IP signups from triggering rewards.

### Email Notifications
- **ESP Selection**: Resend.
- **Inactivity Triggers**: Vercel Cron jobs hitting a secured `/api/cron/emails` route.
- **Priority Templates**: React Email components for: "3-day inactivity", "100 questions answered", and "Referral successful".
- **Unsubscribe Logic**: Opt-out flags in the `profiles` table synced via standard unsubscribe links.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/supabase-admin.ts` for database interactions.
- `src/components/global/upgrade-modal.tsx` pattern for UI overlays (useful for referral sharing).

### Established Patterns
- Next.js App Router API handlers.
- Zustand for global client state if needed.

### Integration Points
- `src/app/api/cron/emails` (New).
- `src/app/[lang]/...` (New i18n routing).
- `src/app/api/webhooks/...` or `auth/callback/route.ts` for handling referral signups.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
