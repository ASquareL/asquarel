-- ================================================
-- MIGRATION 006 — Secure the views
-- Views must run with the caller's permissions,
-- otherwise RLS on underlying tables is bypassed.
-- ================================================

ALTER VIEW course_progress       SET (security_invoker = true);
ALTER VIEW user_stats            SET (security_invoker = true);
ALTER VIEW lesson_with_context   SET (security_invoker = true);
ALTER VIEW quiz_summary          SET (security_invoker = true);
ALTER VIEW thread_with_meta      SET (security_invoker = true);
ALTER VIEW quiz_options_safe     SET (security_invoker = true);