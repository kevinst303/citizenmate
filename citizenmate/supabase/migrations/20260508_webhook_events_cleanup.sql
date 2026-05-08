CREATE OR REPLACE FUNCTION cleanup_old_webhook_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM processed_webhook_events
  WHERE processed_at < now() - interval '7 days';
END;
$$;

SELECT cron.schedule(
  'cleanup-webhook-events',
  '0 3 * * *',
  'SELECT cleanup_old_webhook_events();'
);
