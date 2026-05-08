DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_inactivity_email_sent'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_inactivity_email_sent timestamptz;
  END IF;
END $$;
