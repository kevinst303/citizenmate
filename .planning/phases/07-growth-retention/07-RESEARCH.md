# Phase 07: Growth & Retention - Research

## Context and Requirements
We need to implement three main growth levers:
1. **Internationalization (i18n)**: Spanish, Hindi, Mandarin, Arabic.
2. **Referral Program**: `/?ref=userId`, updating `profiles.referred_by`, extending premium by 7 days.
3. **Email Notifications**: Resend integration, `/api/cron/emails` endpoint for Vercel Cron.

## Codebase Findings
### i18n
- **Framework**: Next.js App Router has standard patterns for i18n via dictionaries or libraries like `next-intl`.
- **Implementation**: The simplest method without heavy third-party libraries is to use JSON dictionaries and a `getDictionary` function.
- **Routing**: We will need to update middleware (`src/middleware.ts` or `src/lib/proxy.ts`) to handle language negotiation or rely on cookies for the chosen language if we don't want to rewrite URLs to include `/[lang]`. However, the context explicitly mentions `src/app/[lang]/...`, so we need to set up `/[lang]` dynamic routing.

### Referral Program
- **Mechanism**: When a user clicks `?ref=uuid`, we save it in a cookie. When they sign up, Supabase inserts this into `profiles.referred_by`.
- **Reward**: A Supabase trigger or a webhook on signup can execute logic to extend `premium_expires_at` for both the referrer and referee. Since the app relies on Supabase Auth, we can use a database trigger or edge function. The context suggests standard implementation.

### Email Notifications
- **Provider**: Resend.
- **Triggers**: 3-day inactivity, 100 questions answered, referral successful.
- **Implementation**: Create `src/app/api/cron/emails/route.ts` to be triggered by Vercel Cron. It queries Supabase for users meeting the criteria and sends emails via the Resend Node SDK.
- **Unsubscribe**: A `profiles.unsubscribed` boolean flag should be checked before sending.

## Validation Architecture
- i18n: Verify UI translates correctly when navigating to `/es` or changing the language cookie.
- Referrals: Verify signup with `?ref=` correctly updates the profile and extends premium time.
- Emails: Verify the cron endpoint successfully queries the correct users and calls the Resend API (can be mocked in dev).
