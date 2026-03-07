-- ============================================================
--  Care Bridge Kenya — Donation Tracking Migration
--  Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Add confirmation_code + fund_status to donations table
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS confirmation_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS fund_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (fund_status IN ('pending', 'distributed', 'completed'));

-- Index for fast lookup by confirmation code
CREATE UNIQUE INDEX IF NOT EXISTS idx_donations_confirmation_code
  ON donations (confirmation_code);

-- 2. Index on donor_email for monthly update queries
CREATE INDEX IF NOT EXISTS idx_donations_donor_email
  ON donations (donor_email)
  WHERE donor_email IS NOT NULL;

-- 3. Project updates table (for tracking page stories/photos)
CREATE TABLE IF NOT EXISTS project_updates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  photo_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: anyone can read project updates
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project_updates_public_read" ON project_updates
  FOR SELECT USING (true);
CREATE POLICY "project_updates_admin_write" ON project_updates
  FOR ALL USING (auth.role() = 'service_role');

-- 4. Transparency stats table (admin-updated monthly snapshot)
CREATE TABLE IF NOT EXISTS transparency_stats (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period           TEXT NOT NULL,            -- e.g. '2026-03'
  total_raised     BIGINT NOT NULL DEFAULT 0,
  donor_count      INT    NOT NULL DEFAULT 0,
  projects_funded  INT    NOT NULL DEFAULT 0,
  lives_impacted   INT    NOT NULL DEFAULT 0,
  school_fees_pct  NUMERIC(5,2) DEFAULT 0,
  medical_pct      NUMERIC(5,2) DEFAULT 0,
  emergency_pct    NUMERIC(5,2) DEFAULT 0,
  community_pct    NUMERIC(5,2) DEFAULT 0,
  other_pct        NUMERIC(5,2) DEFAULT 0,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE transparency_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transparency_stats_public_read" ON transparency_stats
  FOR SELECT USING (true);
CREATE POLICY "transparency_stats_admin_write" ON transparency_stats
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Helper function: get_transparency_overview
--    Returns live aggregate data directly from donations + campaigns
CREATE OR REPLACE FUNCTION get_transparency_overview()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_raised',      COALESCE(SUM(d.amount) FILTER (WHERE d.status = 'confirmed'), 0),
    'donor_count',       COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'confirmed'),
    'projects_funded',   COUNT(DISTINCT d.campaign_id) FILTER (WHERE d.status = 'confirmed'),
    'this_month_raised', COALESCE(SUM(d.amount) FILTER (
                           WHERE d.status = 'confirmed'
                             AND d.created_at >= date_trunc('month', now())
                         ), 0),
    'school_fees_total', COALESCE(SUM(d.amount) FILTER (
                           WHERE d.status = 'confirmed'
                             AND c.category = 'school_fees'
                         ), 0),
    'medical_total',     COALESCE(SUM(d.amount) FILTER (
                           WHERE d.status = 'confirmed'
                             AND c.category = 'medical'
                         ), 0),
    'emergency_total',   COALESCE(SUM(d.amount) FILTER (
                           WHERE d.status = 'confirmed'
                             AND c.category = 'emergency'
                         ), 0),
    'community_total',   COALESCE(SUM(d.amount) FILTER (
                           WHERE d.status = 'confirmed'
                             AND c.category = 'community'
                         ), 0)
  )
  INTO result
  FROM donations d
  LEFT JOIN campaigns c ON c.id = d.campaign_id;

  RETURN result;
END;
$$;
