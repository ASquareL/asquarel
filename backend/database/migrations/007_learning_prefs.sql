-- ================================================
-- MIGRATION 007 — Learning Preferences
-- ================================================

ALTER TABLE profiles
  ADD COLUMN daily_goal_minutes   int  NOT NULL DEFAULT 30,
  ADD COLUMN preferred_time       text NOT NULL DEFAULT 'afternoon'
    CHECK (preferred_time IN ('early_morning','morning','afternoon','evening','late_night')),
  ADD COLUMN preferred_timezone   text NOT NULL DEFAULT 'Africa/Lagos',
  ADD COLUMN preferred_language   text NOT NULL DEFAULT 'en',
  ADD COLUMN difficulty_level     text NOT NULL DEFAULT 'intermediate'
    CHECK (difficulty_level IN ('beginner','intermediate','advanced'));