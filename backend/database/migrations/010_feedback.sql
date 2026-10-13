-- ================================================
-- MIGRATION 010 — Feedback
-- ================================================

CREATE TABLE feedback (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       uuid REFERENCES profiles(id) ON DELETE SET NULL,
    email         text,
    category      text NOT NULL
                  CHECK (category IN ('bug','confusion','suggestion','praise','other')),
    rating        int CHECK (rating BETWEEN 1 AND 5),
    message       text NOT NULL,
    page_url      text,
    resolved      boolean NOT NULL DEFAULT false,
    resolved_at   timestamptz,
    admin_notes   text,
    created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_user     ON feedback(user_id);
CREATE INDEX idx_feedback_created  ON feedback(created_at DESC);
CREATE INDEX idx_feedback_category ON feedback(category);
CREATE INDEX idx_feedback_unresolved ON feedback(created_at DESC) WHERE resolved = false;

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Anyone (even anonymous) can submit feedback.
-- Signed-in users link to their profile; anonymous gets user_id = NULL.
CREATE POLICY feedback_insert ON feedback FOR INSERT
    WITH CHECK (true);

-- Users see their own; admins see everything.
CREATE POLICY feedback_select ON feedback FOR SELECT
    USING (user_id = auth.uid() OR is_admin());

-- Only admins can update or delete.
CREATE POLICY feedback_admin_update ON feedback FOR UPDATE
    USING (is_admin());

CREATE POLICY feedback_admin_delete ON feedback FOR DELETE
    USING (is_admin());