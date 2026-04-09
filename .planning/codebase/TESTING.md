# Testing

## Current State

**No automated tests exist.** The project has no test framework configured, no test files, and no testing-related dependencies in `package.json`.

### What's Missing

| Layer | Status | Impact |
|-------|--------|--------|
| Unit tests | ❌ None | Business logic (SRS engine, readiness calculator) is untested |
| Component tests | ❌ None | UI components have no render/interaction tests |
| Integration tests | ❌ None | API routes, auth flows, sync logic are untested |
| E2E tests | ❌ None | No Playwright/Cypress for full user flows |
| Type checking | ✅ Exists | `npx tsc --noEmit` is used as a build gate |
| Linting | ✅ Exists | ESLint with Next.js rules (`eslint-config-next`) |

## Build Gate (Only Verification)

The project relies on TypeScript type checking and successful builds as the primary verification:

```bash
npx tsc --noEmit        # Type checking (used during development)
npm run build            # Full production build (Webpack)
```

These are the gates mentioned in `.planning/PROJECT.md`:
> **Build gate**: `npx tsc --noEmit` + `npm run build` must pass zero errors after every phase

## Manual Verification

Quality assurance has been performed manually through:
- Visual comparison against the Conseil reference design (pixel-accurate)
- Browser testing of interactive features (quiz flow, study mode, dashboard)
- Checkout flow testing with Stripe test keys

## Recommended Testing Strategy

### Priority 1: Unit Tests for Business Logic

The following pure-function modules are ideal candidates for unit testing:

| Module | File | Priority | Reason |
|--------|------|----------|--------|
| SRS Engine | `src/lib/srs-engine.ts` | 🔴 High | Core algorithm, complex math, no side effects |
| Readiness Calculator | `src/lib/readiness.ts` | 🔴 High | Scoring algorithm used for user-facing decisions |
| Rate Limiter | `src/lib/rate-limit.ts` | 🟡 Medium | Time-based logic, edge cases with window expiry |
| Types | `src/lib/types.ts` | 🟢 Low | Type-level validation (covered by TypeScript) |

### Priority 2: API Route Integration Tests

| Route | File | Priority | Reason |
|-------|------|----------|--------|
| Chat | `src/app/api/chat/route.ts` | 🟡 Medium | Rate limiting, relevance filtering, auth tiering |
| Checkout | `src/app/api/checkout/route.ts` | 🟡 Medium | Auth verification, Stripe session creation |
| Webhook | `src/app/api/webhooks/stripe/route.ts` | 🔴 High | Critical payment flow, signature verification |

### Priority 3: E2E Tests

| Flow | Priority | Reason |
|------|----------|--------|
| Quiz completion | 🟡 Medium | Core user journey: start → answer → results |
| Study progress | 🟢 Low | Simple state tracking |
| Auth flow | 🟡 Medium | Sign-up, sign-in, premium gating |
| Checkout flow | 🔴 High | Revenue-critical |

### Suggested Test Framework

For a Next.js 16 / React 19 project, the recommended stack would be:

```json
{
  "devDependencies": {
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "playwright": "latest"
  }
}
```

## Static Data Validation

The `src/data/questions.ts` file contains 500+ hand-curated questions. There are no automated checks for:
- Unique question IDs
- Valid `correctAnswer` indices (0-3)
- Non-empty `options` arrays
- Complete `topic` assignments
- Question ID referential integrity with `study-content.ts` (`relatedQuestionIds`)

A simple validation script would add high value here.
