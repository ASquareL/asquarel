-- ================================================
-- MIGRATION 011 — Student suspension
-- ================================================

ALTER TABLE profiles
ADD COLUMN suspended_at timestamptz DEFAULT NULL;

-- Index for quick filtering if you need it later
CREATE INDEX idx_profiles_suspended ON profiles(suspended_at) WHERE suspended_at IS NOT NULL;