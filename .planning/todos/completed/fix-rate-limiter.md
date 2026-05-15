---
title: "Fix In-Memory Rate Limiter"
date: "2026-05-03"
priority: "medium"
phase: 26
---

# Fix In-Memory Rate Limiter

The current rate limiter (`src/lib/rate-limit.ts`) relies on an in-memory Map which is ineffective in serverless environments like Vercel (where each instance gets its own memory space). 

**Task:**
Migrate the rate limiting implementation to use Upstash Redis to ensure global rate-limiting is enforced correctly, especially for the free-tier AI Tutor.

**Milestone:** v1.5 Phase 26 — Rate Limiter
