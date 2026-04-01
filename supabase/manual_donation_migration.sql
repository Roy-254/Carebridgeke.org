-- ============================================================
--  Unity Bridge Kenya — Manual Donation Flow Migration
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--  This script is idempotent (safe to re-run).
-- ============================================================

-- 1. Make campaign_id nullable so general-fund donations don't require a campaign
ALTER TABLE public.donations
  ALTER COLUMN campaign_id DROP NOT NULL;

-- 2. Widen payment_method check to include 'mpesa-manual'
ALTER TABLE public.donations
  DROP CONSTRAINT IF EXISTS donations_payment_method_check;

ALTER TABLE public.donations
  ADD CONSTRAINT donations_payment_method_check
    CHECK (payment_method IN ('mpesa', 'card', 'paypal', 'bank', 'mpesa-manual'));

-- 3. Add new columns (each idempotent via IF NOT EXISTS)
ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS donor_phone       TEXT,
  ADD COLUMN IF NOT EXISTS donation_type     TEXT NOT NULL DEFAULT 'general'
    CHECK (donation_type IN ('general', 'project', 'category')),
  ADD COLUMN IF NOT EXISTS project_category  TEXT,
  ADD COLUMN IF NOT EXISTS subscribe_updates BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS mpesa_receipt_code TEXT,
  ADD COLUMN IF NOT EXISTS completed_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS admin_notes       TEXT;

-- 4. Add confirmation_code column (if tracking_migration.sql wasn't run yet)
ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS confirmation_code TEXT UNIQUE;

ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS fund_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (fund_status IN ('pending', 'distributed', 'completed'));

-- 5. Indexes for fast admin lookups
CREATE INDEX IF NOT EXISTS idx_donations_donor_phone
  ON public.donations (donor_phone)
  WHERE donor_phone IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_donations_status
  ON public.donations (status);

CREATE INDEX IF NOT EXISTS idx_donations_created_at
  ON public.donations (created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_donations_confirmation_code
  ON public.donations (confirmation_code)
  WHERE confirmation_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_donations_donor_email
  ON public.donations (donor_email)
  WHERE donor_email IS NOT NULL;

-- 6. RLS: allow anon/public to insert (manual donations don't require auth)
DROP POLICY IF EXISTS "donations_public_insert" ON public.donations;
CREATE POLICY "donations_public_insert"
  ON public.donations FOR INSERT WITH CHECK (true);

-- 7. RLS: allow donors to see their own donations by confirmation code
DROP POLICY IF EXISTS "donations_track_by_code" ON public.donations;
CREATE POLICY "donations_track_by_code"
  ON public.donations FOR SELECT
  USING (
    -- existing check: campaign creator or donor
    auth.uid() = (SELECT creator_id FROM public.campaigns WHERE id = campaign_id)
    OR (NOT is_anonymous AND auth.uid() = donor_id)
    -- new check: anyone who knows the confirmation code (handled in API, not RLS)
    OR confirmation_code IS NOT NULL
  );

-- 8. Helper function: generate a UBK-YYYYMMDD-XXXX code (callable from app)
CREATE OR REPLACE FUNCTION public.generate_confirmation_code()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  date_part TEXT;
  rand_part TEXT;
  candidate TEXT;
  attempts  INT := 0;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  LOOP
    rand_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FOR 4));
    candidate := 'UBK-' || date_part || '-' || rand_part;
    -- Ensure uniqueness
    IF NOT EXISTS (
      SELECT 1 FROM public.donations WHERE confirmation_code = candidate
    ) THEN
      RETURN candidate;
    END IF;
    attempts := attempts + 1;
    IF attempts > 20 THEN
      RAISE EXCEPTION 'Could not generate unique confirmation code';
    END IF;
  END LOOP;
END;
$$;

-- DONE ─────────────────────────────────────────────────────
-- After running this:
-- 1. Confirm all columns exist in Table Editor
-- 2. Proceed to Stage 2 (API route) and Stage 3 (Donation page)
