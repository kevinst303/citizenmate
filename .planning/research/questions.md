
## 2026-05-12 — PWA: VAPID Key Management & Push Triggering

**Question:** Should Web Push notifications be triggered from Supabase Edge Functions or Next.js API Routes? Evaluate tradeoffs around:
- Latency for mobile push delivery
- Connection to Supabase database for subscription lookups (Edge Function runs in same region as DB)
- Cold-start concerns for Edge Functions vs API Routes
- VAPID key management and rotation best practices
