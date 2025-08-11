-- Subscribers table for Stripe subscriptions (idempotent)
-- 1) Create table if not exists
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 3) Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscribers'
      AND policyname = 'select_own_subscription'
  ) THEN
    CREATE POLICY "select_own_subscription" ON public.subscribers
    FOR SELECT
    USING (user_id = auth.uid() OR email = auth.email());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscribers'
      AND policyname = 'update_own_subscription'
  ) THEN
    CREATE POLICY "update_own_subscription" ON public.subscribers
    FOR UPDATE
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscribers'
      AND policyname = 'insert_subscription'
  ) THEN
    CREATE POLICY "insert_subscription" ON public.subscribers
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

-- 4) Ensure unique constraint on email (if not present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'subscribers_email_key'
      AND conrelid = 'public.subscribers'::regclass
  ) THEN
    ALTER TABLE public.subscribers
    ADD CONSTRAINT subscribers_email_key UNIQUE (email);
  END IF;
END $$;