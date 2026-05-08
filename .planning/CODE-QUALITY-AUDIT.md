---
phase: CODE-QUALITY-AUDIT
reviewed: 2026-05-08T00:00:00Z
depth: deep
files_reviewed: 52
files_reviewed_list:
  - src/middleware.ts
  - src/lib/auth-context.tsx
  - src/lib/quiz-context.tsx
  - src/lib/srs-engine.ts
  - src/lib/readiness.ts
  - src/lib/sync.ts
  - src/lib/referrals.ts
  - src/lib/types.ts
  - src/lib/env.ts
  - src/lib/supabase.ts
  - src/lib/supabase-server.ts
  - src/lib/supabase-admin.ts
  - src/lib/rate-limit.ts
  - src/lib/deepseek.ts
  - src/lib/chat-context.ts
  - src/lib/referral-codes.ts
  - src/lib/admin-auth.ts
  - src/lib/email.ts
  - src/lib/toast.ts
  - src/lib/utils.ts
  - src/lib/insights.ts
  - src/lib/dashboard-config.ts
  - src/lib/srs-types.ts
  - src/lib/srs-context.tsx
  - src/lib/study-context.tsx
  - src/lib/test-date-context.tsx
  - src/lib/store/useSettingsStore.ts
  - src/lib/store/useUpgradeModal.ts
  - src/data/tests.ts
  - src/data/questions.ts
  - src/data/study-content.ts
  - src/app/api/checkout/route.ts
  - src/app/api/webhooks/stripe/route.ts
  - src/app/api/chat/route.ts
  - src/app/api/referral/route.ts
  - src/app/api/auth/callback/route.ts
  - src/app/[lang]/dashboard/page.tsx
  - src/components/quiz/quiz-card.tsx
  - src/components/quiz/quiz-header.tsx
  - src/components/quiz/quiz-timer.tsx
  - src/components/quiz/quiz-progress.tsx
  - src/components/quiz/question-review.tsx
  - src/components/quiz/results-summary.tsx
  - src/components/dashboard/readiness-ring.tsx
  - src/components/shared/premium-gate.tsx
  - src/components/shared/chat-widget.tsx
  - src/components/blog-html-content.tsx
  - src/i18n/config.ts
  - src/i18n/i18n-context.tsx
  - src/components/emails/email-templates.tsx
  - src/lib/abs-api.ts
  - src/lib/blog-db.ts
findings:
  critical: 4
  warning: 14
  info: 12
  total: 30
status: issues_found
---

# CitizenMate Code Quality Audit

**Reviewed:** 2026-05-08
**Depth:** Deep (cross-file import graph & call chain analysis)
**Files Reviewed:** 52
**Findings:** 4 Critical, 14 Warning, 12 Info

---

## Executive Summary

This audit covers the CitzenMate Next.js 16 codebase (~24K+ LOC across 52 key files), focusing on bug hunting, security vulnerabilities, code quality, performance, and architecture. The codebase serves paying customers via Stripe subscriptions, manages quiz/test state with a custom SRS (spaced repetition) engine, and integrates with Supabase, Resend, Stripe, PostHog, and an AI chat tutor.

**Overall Assessment:** The codebase is well-structured with TypeScript, Zod validation, rate limiting, proper Stripe webhook idempotency, and graceful fallbacks for missing environment variables. However, there are **4 critical findings** that need immediate attention: a duplicated submit button group that creates dead code, a stored XSS risk in the blog HTML renderer, a rate-limit bypass in the chat endpoint, and an onboarding redirect that uses a full-page reload side-effect.

The architecture shows strong patterns: centralized sync layer, reducer-based state management, Zod env validation, and good separation of concerns. The main areas for improvement are: debouncing localStorage→Supabase sync operations, tightening the HTML sanitization pipeline, removing the duplicated UI code, and fixing the rate-limit counter timing issue.

---

## Findings by Category

### 🔴 Bug: Critical

#### CR-B01: Duplicated Submit Button Group in Quiz Header Modal

**File:** `src/components/quiz/quiz-header.tsx:134-184`
**Severity:** CRITICAL

**Issue:** Lines 159-184 are an exact duplicate of lines 134-158 — there are two identical button groups (`Keep Going` + `Submit Test`) inside the submit confirmation modal. The second group (159-184) renders outside the modal's visible flow and is dead code. It also has missing translation fallback strings for the toast messages (lines 176-177 vs lines 149-152).

**Fix:** Remove lines 159-184 (the duplicate), and ensure lines 149-152 have proper fallbacks:

```tsx
// Lines 134-158 are correct — remove 159-184 entirely
// Ensure toast calls use:
toast.default(
  t("quiz.toast_title", "Test submitted! 📝"),
  t("quiz.toast_desc", "Calculating your results…")
);
```

#### CR-B02: Race Condition — Obsolete `request.cookies.set()` in Middleware

**File:** `src/middleware.ts:43-53`
**Severity:** CRITICAL

**Issue:** In the Supabase `setAll` callback, `request.cookies.set(name, value)` is called on line 46 using the original `request` object. However, when `NextResponse.next()` is called on line 48, it returns a *new* response that has its own cookie jar. The cookies set on the original request object are lost. The response cookies via `response.cookies.set(name, value, options)` on line 52 correctly persist, but the gap between the two can cause cookie inconsistency. Additionally, the `response` reassignment inside `setAll` creates a closure issue where the outer `response` variable reference may not reflect the most recently created response object.

**Fix:**

```tsx
setAll(cookiesToSet) {
  // Remove request.cookies.set — it has no effect on the response
  response = NextResponse.next({
    request: { headers: request.headers },
  });
  cookiesToSet.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  );
},
```

#### CR-B03: Onboarding Redirect Uses Full-Page Reload

**File:** `src/lib/auth-context.tsx:108-115`
**Severity:** CRITICAL

**Issue:** Inside `fetchProfileData`, when a user lacks a `test_date`, the code uses `window.location.href = ...` to redirect to onboarding. This triggers a full browser page reload, which:
1. Drops all client-side React state (including auth session tokens in memory)
2. Re-runs the entire middleware chain
3. Could theoretically cause an infinite redirect loop if the profile fetch doesn't complete before the redirect fires
4. Is jarring for the user experience compared to Next.js `router.push()`

**Fix:** Refactor to use Next.js `redirect()` in a server component, or use `router.push()` from the calling component:

```tsx
// Move onboarding redirect logic out of fetchProfileData
// Into a dedicated useEffect or server-side middleware check
// Example: return a signal that the caller handles
if (!data.test_date && typeof window !== "undefined") {
  const path = window.location.pathname;
  if (!path.includes("/onboarding") && !path.includes("/admin")) {
    // Instead of window.location.href = ...:
    // OPTION A: Use router.push() from the component that calls useAuth
    // OPTION B: Server-side redirect in middleware.ts
    // OPTION C: Return a flag and let the page component handle navigation
    return { ...result, needsOnboarding: true };
  }
}
```

Then in the dashboard/page.tsx:
```tsx
const { profile } = useAuth();
useEffect(() => {
  if (profile.needsOnboarding) {
    router.push(`/${lang}/onboarding`);
  }
}, [profile.needsOnboarding]);
```

---

### 🔐 Security: Critical

#### CR-S01: Stored XSS via Blog HTML Content

**File:** `src/components/blog-html-content.tsx:20-78`
**Severity:** CRITICAL

**Issue:** The `BlogHtmlContent` component uses `html-react-parser` with a custom `replace` function that handles only `<img>`, `<a>`, and `<quizcta>` tags. **All other HTML tags pass through unfiltered.** Since blog content originates from the admin editor and is stored in Supabase, a compromised admin account or malicious content injection could render `<script>`, `<iframe>`, `<style>`, or `onerror`/`onload` attributes in the user's browser — a stored XSS vector.

The `escapeAttr` function (line 14-16) is defined but **never used**.

**Fix:**

```tsx
import sanitizeHtml from 'sanitize-html';
// OR use a more comprehensive allowlist

const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (!isElement(domNode)) return;
    
    // Strip event handlers from all elements
    const { attribs } = domNode;
    if (attribs) {
      for (const key of Object.keys(attribs)) {
        if (key.toLowerCase().startsWith('on')) {
          delete attribs[key];
        }
      }
    }
    
    const { name, children } = domNode;
    
    // Only allow known-safe tags
    const ALLOWED_TAGS = new Set([
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'strong', 'em',
      'code', 'pre', 'br', 'hr', 'table', 'thead', 'tbody',
      'tr', 'th', 'td', 'span', 'div', 'img', 'a', 'quizcta'
    ]);
    
    if (!ALLOWED_TAGS.has(name)) {
      return <>{domToReact(children as unknown as DOMNode[], options)}</>;
    }
    
    // ... rest of existing tag handling
  },
};
```

Additionally, implement server-side sanitization using `sanitize-html` before storing blog content in Supabase.

#### CR-S02: Chat Rate Limit Bypass — Counter Incremented After AI Call

**File:** `src/app/api/chat/route.ts:162-177`
**Severity:** CRITICAL

**Issue:** The rate limit counter is incremented only *after* the AI stream is created (line 171). If the `streamText()` call fails (throws), the counter is never incremented, allowing unlimited retries without rate limiting. A malicious user could intentionally trigger failures (by sending malformed messages, exceeding token limits, etc.) and bypass the rate limit entirely.

Additionally, the rate limit check uses a separate `getChatCounter` (reads Redis without incrementing), which races with concurrent requests — two requests passing the check simultaneously would both proceed.

**Fix:** Use an atomic increment-and-check operation:

```tsx
// Replace getChatCounter with an atomic increment-then-check
async function checkAndIncrement(key: string, maxRequests: number): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const redis = getRedisClient();
  if (!redis) {
    return { success: true, remaining: maxRequests - 1, reset: Date.now() + WINDOW_MS };
  }
  
  // Atomic: INCR then check
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, Math.ceil(WINDOW_MS / 1000));
  }
  
  if (current > maxRequests) {
    const ttl = await redis.ttl(key);
    return { success: false, remaining: 0, reset: Date.now() + Math.max(ttl, 0) * 1000 };
  }
  
  return { success: true, remaining: maxRequests - current, reset: Date.now() + WINDOW_MS };
}

// In POST handler:
const { success, remaining, reset } = await checkAndIncrement(counterKey, maxRequests);
if (!success) {
  // return 429
}
// No separate incrementCounter call needed
```

---

### 🟡 Warning

#### WR-01: Multiple Sync Firehose — Unnecessary Supabase Auth Checks on Every State Change

**Files:** `src/lib/study-context.tsx:154-170`, `src/lib/test-date-context.tsx:81-101`
**Severity:** HIGH

**Issue:** Both context providers trigger a background Supabase sync on **every** state change — including `study-context.tsx` syncing on every progress update AND every language change. When a user rapidly clicks through study sections, this generates a cascade of Supabase `auth.getSession()` calls, each of which does a full JWT verification. This is wasteful and can stress the Supabase connection pool.

A debounce of at least 2-3 seconds should be applied, and the language sync should be independent of progress sync.

**Fix:**

```tsx
// In study-context.tsx
useEffect(() => {
  const debounceTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    // Sync to Supabase only after 2s of inactivity
    import("@/lib/supabase").then(({ getSupabaseBrowserClient }) => {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncStudyProgressToSupabase(session.user.id).catch(() => {});
        }
      });
    }).catch(() => {});
  }, 2000);
  
  return () => clearTimeout(debounceTimer);
}, [state.progress]);
```

#### WR-02: Deduplication Key Collision Risk in Quiz History Sync

**File:** `src/lib/sync.ts:86-92`
**Severity:** MEDIUM

**Issue:** Quiz history entries are deduplicated using `completed_at` (timestamp) as the unique key. If two quiz attempts complete in the same second (possible during rapid practice on two tabs/devices), one would be incorrectly treated as a duplicate and silently dropped. While unlikely in normal usage, this is a data loss risk.

**Fix:** Use a composite key or add a unique attempt ID:

```tsx
// Store a UUID per attempt, or use test_id + completed_at as composite key
const existingKeys = new Set(
  (existing ?? []).map((r) => `${r.test_id}:${r.completed_at}`)
);
const newEntries = history
  .filter((h) => !existingKeys.has(`${h.testId}:${h.completedAt}`))
  // ...
```

#### WR-03: Unvalidated Tier/Interval in Checkout Route

**File:** `src/app/api/checkout/route.ts:33-43`
**Severity:** MEDIUM

**Issue:** The `tier` and `interval` values from the request body are used without validation against known values. A crafted request with `tier: "__proto__"` or `interval: "constructor"` could potentially interact with prototype pollution (though unlikely given the string comparison pattern). More practically, a user sending `tier: "nonexistent"` would get a confusing error from Stripe rather than a clear validation message.

**Fix:**

```tsx
const VALID_TIERS = ['pro', 'premium', 'sprint_pass'] as const;
const VALID_INTERVALS = ['month', 'year'] as const;

if (body.tier && !VALID_TIERS.includes(body.tier)) {
  return NextResponse.json({ error: `Invalid tier: ${body.tier}` }, { status: 400 });
}
if (body.interval && !VALID_INTERVALS.includes(body.interval)) {
  return NextResponse.json({ error: `Invalid interval: ${body.interval}` }, { status: 400 });
}
```

#### WR-04: Non-Null Assertion Risk in Async SRS Update

**File:** `src/lib/quiz-context.tsx:254-266`
**Severity:** MEDIUM

**Issue:** Inside the dynamic import callback for SRS update, `state.test!` uses a non-null assertion on line 255. While the `saveAttempt` function is only called when `state.test` is non-null (checked at the top of `calculateResult`), the dynamic import's async nature means the state could theoretically be reset between when `saveAttempt` starts and when the dynamic import resolves. If `state.test` becomes null, this crashes.

**Fix:**

```tsx
import("@/lib/srs-engine").then(({ updatePerformance }) => {
  if (!state.test) return; // Guard against async race
  for (const question of state.test.questions) {
    // ...
  }
}).catch(() => {});
```

#### WR-05: Chat Widget Renders Raw Message Content

**File:** `src/components/shared/chat-widget.tsx:325-331`
**Severity:** MEDIUM

**Issue:** When `message.parts` is not available, the chat widget falls back to `(message as any).content`. This `any` cast bypasses type safety, and if the AI returns HTML or script content in the message, it would be rendered as inner HTML (via `dangerouslySetInnerHTML`-adjacent behavior in React when using `whitespace-pre-wrap` with untrusted strings). While the AI is instructed to return plain text, a compromised AI model or prompt injection could return malicious content.

**Fix:** Ensure content is always rendered as text, never HTML:

```tsx
{message.parts && message.parts.length > 0
  ? message.parts
      .filter((part): part is { type: "text"; text: string } => part.type === "text")
      .map((part, i) => <span key={i}>{part.text}</span>)
  : <span>{String(message.content ?? '')}</span>}
```

#### WR-06: Azure Function Timeout Risk — Welcome Email Awaited in Auth Callback

**File:** `src/app/api/auth/callback/route.ts:44-46`
**Severity:** MEDIUM

**Issue:** The `sendWelcomeEmail` call is `await`ed in the OAuth callback route handler. If Resend is slow or down, this could delay the redirect response, potentially exceeding Vercel's serverless function timeout (10s on Hobby, 60s on Pro). Users would see a white page while waiting for the redirect. The welcome email should be fire-and-forget.

**Fix:**

```tsx
if (isNewUser && data.user.email) {
  const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || undefined;
  // Don't await — fire and forget
  sendWelcomeEmail(data.user.email, name).catch((err) =>
    console.error('[Auth Callback] Failed to send welcome email:', err)
  );
}
// Respond immediately
```

#### WR-07: Hardcoded Stripe Coupon ID Fallback

**File:** `src/lib/referral-codes.ts:9`
**Severity:** MEDIUM

**Issue:** `REFERRAL_COUPON_ID` falls back to a hardcoded string `'osa7HMgY'` if the env var is not set. In production, this would silently use the wrong coupon (or a non-existent one). The coupon ID should be required or the referral code generation should fail fast.

**Fix:**

```tsx
const REFERRAL_COUPON_ID = process.env.STRIPE_REFERRAL_COUPON_ID;
if (!REFERRAL_COUPON_ID) {
  throw new Error('STRIPE_REFERRAL_COUPON_ID environment variable is not set');
}
```

#### WR-08: Multiple Admin Client Instantiations in Referral Processing

**File:** `src/lib/referrals.ts:24,88,115,137,167`
**Severity:** MEDIUM

**Issue:** `createSupabaseAdminClient()` is called 5 separate times within a single `processReferralReward` call chain (once in the main function, once in `checkQualification`, once in `checkAndProcessPendingReward`, and twice in the email notification functions). Each call creates a new Supabase client with `SERVICE_ROLE_KEY`, wasting connections. The admin client should be passed as a parameter or created once.

**Fix:**

```tsx
export async function processReferralReward(
  refereeId: string,
  _adminClient?: ReturnType<typeof createSupabaseAdminClient>
): Promise<{ success: boolean; error?: string }> {
  const adminSupabase = _adminClient ?? createSupabaseAdminClient();
  // Pass adminSupabase to checkQualification and notification functions
}
```

#### WR-09: Non-Standard Streaming Format for Chat Fallback

**File:** `src/app/api/chat/route.ts:115-128`
**Severity:** MEDIUM

**Issue:** When the zero-token pre-filter detects an off-topic query, the response uses a custom `ReadableStream` with format `0:${JSON.stringify(fallbackText)}\n`. This format may not be correctly parsed by the AI SDK's client component (`useChat` from `@ai-sdk/react`), which expects the AI SDK streaming protocol (SSE-based). This could result in the client not displaying the fallback message at all, or showing a parsing error.

**Fix:** Use the AI SDK's standard response format or return a plain JSON error:

```tsx
if (!isRelevant) {
  return new Response(
    JSON.stringify({
      role: "assistant",
      content: fallbackText,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
```

#### WR-10: `calculateResult` Can Throw in Reducer

**File:** `src/lib/quiz-context.tsx:147-149`
**Severity:** MEDIUM

**Issue:** `calculateResult` throws `new Error("No test loaded")` if `state.test` is null. While the reducer guards against this in the SUBMIT_QUIZ/TIME_UP cases, the throw is inside a reducer which React expects to be pure. If the error is ever reached, it would crash the React component tree rather than gracefully handling the error through the ErrorBoundary.

**Fix:** Return a sentinel result instead of throwing:

```tsx
function calculateResult(state: QuizState): QuizResult | null {
  if (!state.test) return null;
  // ... calculation
}
// In reducer:
const result = calculateResult(state);
if (!result) return state;
```

#### WR-11: `Promise.allSettled` Results Discarded in Referral Rewards

**File:** `src/lib/referrals.ts:75-78`
**Severity:** LOW

**Issue:** `Promise.allSettled` is used correctly for non-blocking email sends, but the results are completely discarded. If both email sends fail, the function still returns `{ success: true }`. While this is intentional (reward was processed, email failure shouldn't block), logging the failures would help with monitoring.

**Fix:**

```tsx
const emailResults = await Promise.allSettled([...]);
const failures = emailResults.filter(r => r.status === 'rejected');
if (failures.length > 0) {
  console.warn('[Referral] Email notification failures:', failures);
}
```

#### WR-12: Middleware Matcher Excludes API Routes from Locale Handling but Not All

**File:** `src/middleware.ts:64-80`
**Severity:** LOW

**Issue:** The middleware skips locale handling for paths starting with `/api`, `/_next`, or containing `.`. However, the auth check (lines 110-126) handles locale path stripping for page routes but not for API routes. The API auth response on line 74 uses `request.nextUrl.pathname` for the locale-less check, which for paths like `/en/api/checkout` would have the `/en` prefix. This path is already excluded from locale handling on line 65 (starts with `/api`), but if the URL structure changes, this could miss patterns.

#### WR-13: Mock Tests Use Math.random() for Shuffling

**File:** `src/data/tests.ts:8`
**Severity:** LOW

**Issue:** The fallback `pickRandom` function uses `Math.random()` for shuffling (line 8: `[...pool].sort(() => Math.random() - 0.5)`). This produces a biased shuffle (Fisher-Yates is uniform). The `buildTest` function uses a seeded PRNG which is correct, but the exported `pickRandom` function is still available and could be imported elsewhere.

**Fix:** Either remove the unused `pickRandom` export, or replace it with Fisher-Yates:

```tsx
function pickRandom(pool: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
```

#### WR-14: Chat Widget FAB Missing Loading/Fallback State

**File:** `src/components/shared/chat-widget.tsx:95-475`
**Severity:** LOW

**Issue:** The chat widget has no error boundary or loading state handling for the `useChat` hook. If the AI SDK experiences an error or network failure, the component has no visual feedback beyond whatever the browser shows. The stream interruption is also not handled — if the connection drops mid-stream, the partial message remains displayed with no retry mechanism.

---

### ℹ️ Info

#### IN-01: `any` Type Escape Hatches

**Files:** `src/lib/deepseek.ts:30`, `src/lib/email.ts:53`, `src/components/shared/chat-widget.tsx:330`
**Severity:** INFO

**Issue:** Multiple locations use `any` type assertions or `// eslint-disable-next-line @typescript-eslint/no-explicit-any` to bypass TypeScript type checking. This weakens the type safety of the codebase. Specific instances:
- `deepseek.ts:30` — `const params: any =` for API parameters
- `email.ts:53` — `const payload: any =` for Resend email payload
- `chat-widget.tsx:330` — `(message as any).content` fallback

**Fix:** Define proper interfaces or use `Record<string, unknown>` for generic objects.

#### IN-02: Unused `escapeAttr` Function

**File:** `src/components/blog-html-content.tsx:14-16`
**Severity:** INFO

**Issue:** The `escapeAttr` helper function is defined but never called. This is dead code and increases maintenance burden.

**Fix:** Either remove it or integrate it into the attribute handling in the `replace` function.

#### IN-03: Unused `pickRandom` Export

**File:** `src/data/tests.ts:7-10`
**Severity:** INFO

**Issue:** The `pickRandom` function is exported but never imported by any other file in the codebase. The `buildTest` function uses its own seeded shuffle instead.

**Fix:** Remove the export or mark as internal with `@internal` JSDoc.

#### IN-04: Import Order Inconsistency

**File:** `src/lib/quiz-context.tsx:1-23`
**Severity:** INFO

**Issue:** The import of `syncQuizHistoryToSupabase` on line 3 appears before the React imports (line 5-13) and library imports (line 14-23). Convention places third-party imports first, then local imports. This is a minor style issue.

**Fix:** Move line 3 to after the React imports group.

#### IN-05: Console Logging in Production Paths

**Files:** Multiple
**Severity:** INFO

**Issue:** Several production code paths use `console.log` and `console.error` for operational logging. While not harmful, these create noise in production log aggregators and may include sensitive data (user IDs, Stripe IDs). Files with significant logging:
- `src/app/api/webhooks/stripe/route.ts` — extensive console.log for payment processing
- `src/lib/auth-context.tsx:159,195` — console.error for auth errors
- `src/lib/sync.ts:51,109,128,147,279` — console.error in sync failures

**Fix:** Consider using a structured logger like `pino` or integrating with the existing Sentry for error-level events.

#### IN-06: Missing TypeScript `strictNullChecks` Coverage

**Files:** Multiple
**Severity:** INFO

**Issue:** The codebase uses `!` non-null assertions in several places without guard checks:
- `src/lib/supabase.ts:6-7` — `process.env.NEXT_PUBLIC_SUPABASE_URL!`
- `src/lib/supabase-server.ts:9-10` — same pattern
- `src/lib/quiz-context.tsx:255` — `state.test!`

While these are safe in production due to env validation, they could cause confusing errors during development if env vars are missing and `env.ts` validation isn't run.

#### IN-07: Potential Circular Dependency Between quiz-context and srs-engine

**Files:** `src/lib/quiz-context.tsx` → `src/lib/srs-engine.ts` → `src/lib/types.ts`
**Severity:** INFO

**Issue:** `quiz-context.tsx` dynamically imports `@/lib/srs-engine` (line 254), and `srs-engine.ts` imports from `@/lib/types` (line 4). The dynamic import avoids a hard circular dependency, but the comment `// Dynamically import the SRS engine to avoid circular deps` on line 253 confirms the architect was aware of the potential issue. The SRS engine itself has no dependency on quiz-context, so the dynamic import is only a soft coupling.

#### IN-08: Missing Error Boundary for Dashboard Page

**File:** `src/app/[lang]/dashboard/page.tsx`
**Severity:** INFO

**Issue:** The dashboard page is a complex client component with multiple hooks, localStorage reads, and async operations, but no React Error Boundary wraps it. If any hook throws (e.g., `useStudy()` throws because StudyProvider is missing), the entire page crashes with no fallback UI.

**Fix:** Wrap the dashboard content in a `<ErrorBoundary fallback={<DashboardErrorFallback />}>` component.

#### IN-09: Code Duplication Between quiz-context and srs-context

**Files:** `src/lib/quiz-context.tsx:245-272` and `src/lib/srs-context.tsx`
**Severity:** INFO

**Issue:** SRS performance data is updated in two places:
1. `quiz-context.tsx` — via dynamic import of `srs-engine` inside `saveAttempt`
2. `srs-context.tsx` — via `recordBatch` / `recordAnswer` actions

This creates two code paths for SRS updates that could diverge. The quiz-context path bypasses the SRS context's reducer entirely and directly writes to localStorage.

**Fix:** Consolidate SRS updates through the SRS context only. The quiz-context should dispatch to SRS context rather than directly manipulating SRS localStorage.

#### IN-10: `STRIPE_WEBHOOK_SECRET` Validated in `env.ts` but Not Used There

**File:** `src/lib/env.ts:15`
**Severity:** INFO

**Issue:** `STRIPE_WEBHOOK_SECRET` is validated in the server env schema of `env.ts`, but the `env` object is never imported in the webhook route (`src/app/api/webhooks/stripe/route.ts`). The webhook route reads the env var directly from `process.env`. This means the validation in `env.ts` will detect missing webhook secrets, but only if `env.ts` is actually imported/executed somewhere in the server bundle.

#### IN-11: Magic Numbers in Quiz Scoring

**File:** `src/lib/quiz-context.tsx:182-183`
**Severity:** INFO

**Issue:** The passing thresholds are hardcoded as magic numbers: `score >= 15` (75% of 20 questions), `valuesScore === 5`. While these are well-known test requirements, they should be declared as named constants for maintainability.

**Fix:**

```tsx
const PASSING_SCORE = 15; // 75% of 20 questions
const VALUES_PASSING_SCORE = 5; // All values questions must be correct
const passed = score >= PASSING_SCORE && valuesPassed;
```

#### IN-12: Inline Styles Using `style={{}}` Pattern

**Files:** Multiple components (quiz-card, results-summary, quiz-header, premium-gate, dashboard page)
**Severity:** INFO

**Issue:** Several components use inline style objects with complex box-shadow values and CSS custom properties. While this works, it creates render-time object allocations that could be memoized. For example, `quiz-card.tsx:26` and `results-summary.tsx:196` repeat the same box-shadow string.

**Fix:** Extract common styles to CSS classes or at least to module-level constants:

```tsx
const CARD_SHADOW = { 
  boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' 
} as const;
```

---

## Top 10 Priority Fixes (Ranked)

| Rank | ID | Severity | Description | Impact |
|------|-----|----------|-------------|--------|
| 1 | CR-S01 | CRITICAL | Stored XSS via blog HTML content — unfiltered HTML rendering | Security: any malicious blog post can execute scripts |
| 2 | CR-S02 | CRITICAL | Chat rate limit bypass — counter incremented after stream, not before | Security/Revenue: unlimited free AI usage bypasses paywall |
| 3 | CR-B01 | CRITICAL | Duplicated submit button group in quiz-header — dead code + missing i18n | Bug: confusing code, potential maintenance trap |
| 4 | CR-B03 | CRITICAL | Full-page reload for onboarding redirect | UX: jarring experience, potential infinite loop |
| 5 | WR-01 | HIGH | Multiple sync firehose — Supabase auth checks on every keystroke during study | Performance: excessive Supabase calls, cost + latency |
| 6 | WR-09 | MEDIUM | Non-standard streaming format for chat fallback — may not render on client | Bug: off-topic queries may show nothing to users |
| 7 | WR-06 | MEDIUM | Welcome email awaited in auth callback — risk of function timeout | Reliability: OAuth login could fail if email service is slow |
| 8 | WR-03 | MEDIUM | Unvalidated tier/interval in checkout route | Security/Quality: confusing errors, potential prototype pollution |
| 9 | WR-07 | MEDIUM | Hardcoded Stripe coupon ID fallback | Reliability: silent failure if env var missing |
| 10 | WR-02 | MEDIUM | Deduplication key collision risk — same-second quiz completions lost | Data: rare but potentially frustrating data loss |

---

## Architecture Observations

### Strengths
1. **Zod env validation** (`src/lib/env.ts`) — fails fast at import time with clear error messages
2. **Idempotent Stripe webhook processing** (`src/app/api/webhooks/stripe/route.ts`) — proper duplicate event detection via dedicated table
3. **Reducer-based state management** — `quiz-context`, `study-context`, `srs-context` all use `useReducer` with clean action types
4. **Graceful degradation** — all Supabase-dependent code checks `isSupabaseConfigured()` and falls back to localStorage-only mode
5. **Rate limiting infrastructure** (`src/lib/rate-limit.ts`) — Upstash Redis-based with dev fallback
6. **Referral system** — Two-sided rewards with Stripe promo codes and Supabase RPC for atomicity

### Areas for Improvement
1. **Data synchronization** — Three separate mechanisms write to localStorage + Supabase; consolidating into a single sync orchestrator would reduce bug surface
2. **SRS dual-write** — quiz-context bypasses srs-context to write SRS data directly; this should be unified
3. **Debouncing** — None of the localStorage→Supabase sync paths are debounced, causing request amplification
4. **Error boundaries** — Only present implicitly through Next.js error.tsx; no component-level error boundaries in complex client components like dashboard or quiz

---

_Reviewed: 2026-05-08T00:00:00Z_
_Reviewer: OpenCode (gsd-code-reviewer)_
_Depth: deep_
