-- =============================================
-- Migration: Processed Webhook Events
-- Purpose: Idempotency table for Stripe webhook deduplication
-- =============================================

CREATE TABLE IF NOT EXISTS processed_webhook_events (
  event_id TEXT PRIMARY KEY,           -- Stripe event ID (evt_xxx)
  event_type TEXT NOT NULL,            -- e.g. 'checkout.session.completed'
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  payload_hash TEXT                    -- SHA-256 of event data for audit
);

-- Auto-cleanup: remove events older than 30 days (Stripe retries within 72h)
-- Run this as a Supabase cron or Edge Function
COMMENT ON TABLE processed_webhook_events IS 
  'Idempotency guard for Stripe webhooks. Safe to prune entries older than 7 days.';

-- Index for cleanup queries
CREATE INDEX idx_processed_webhook_events_processed_at 
  ON processed_webhook_events (processed_at);

-- RLS: This table is only accessed by the service role (admin client),
-- so no user-facing policies are needed. Deny all user access.
ALTER TABLE processed_webhook_events ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies for anon/authenticated roles
-- means only the service_role can access this table.
