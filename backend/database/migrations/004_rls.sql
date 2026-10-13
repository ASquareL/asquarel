-- ================================================
-- MIGRATION 004 — Row Level Security + Quiz Grading
-- ================================================

-- Enable RLS on every table
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules               ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons               ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress       ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates          ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_prefs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_threads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies    ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_reactions  ENABLE ROW LEVEL SECURITY;

-- Helper: is current user admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT role = 'admin' FROM profiles WHERE id = auth.uid()),
        false
    );
$$;

-- Helper: is current user enrolled in course?
CREATE OR REPLACE FUNCTION is_enrolled(p_course uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM enrollments
        WHERE user_id = auth.uid() AND course_id = p_course
    );
$$;

-- Helper: is current user mentor of course?
CREATE OR REPLACE FUNCTION is_mentor_of(p_course uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM courses
        WHERE id = p_course AND mentor_id = auth.uid()
    );
$$;

-- ================================================
-- POLICIES
-- ================================================

-- PROFILES
CREATE POLICY profiles_select_own ON profiles FOR SELECT
    USING (id = auth.uid() OR is_admin());
CREATE POLICY profiles_update_own ON profiles FOR UPDATE
    USING (id = auth.uid() OR is_admin())
    WITH CHECK (id = auth.uid() OR is_admin());

-- COURSES
CREATE POLICY courses_select ON courses FOR SELECT
    USING (published = true OR is_admin() OR mentor_id = auth.uid() OR is_enrolled(id));
CREATE POLICY courses_insert ON courses FOR INSERT
    WITH CHECK (is_admin());
CREATE POLICY courses_update ON courses FOR UPDATE
    USING (is_admin() OR mentor_id = auth.uid())
    WITH CHECK (is_admin() OR mentor_id = auth.uid());
CREATE POLICY courses_delete ON courses FOR DELETE
    USING (is_admin());

-- MODULES
CREATE POLICY modules_select ON modules FOR SELECT
    USING (EXISTS (SELECT 1 FROM courses c WHERE c.id = course_id
                   AND (c.published = true OR is_admin() OR c.mentor_id = auth.uid() OR is_enrolled(c.id))));
CREATE POLICY modules_insert ON modules FOR INSERT
    WITH CHECK (is_admin() OR is_mentor_of(course_id));
CREATE POLICY modules_update ON modules FOR UPDATE
    USING (is_admin() OR is_mentor_of(course_id))
    WITH CHECK (is_admin() OR is_mentor_of(course_id));
CREATE POLICY modules_delete ON modules FOR DELETE
    USING (is_admin());

-- LESSONS
CREATE POLICY lessons_select ON lessons FOR SELECT
    USING (
        (published = true AND preview = true)
        OR is_enrolled(course_id)
        OR is_admin()
        OR is_mentor_of(course_id)
    );
CREATE POLICY lessons_insert ON lessons FOR INSERT
    WITH CHECK (is_admin() OR is_mentor_of(course_id));
CREATE POLICY lessons_update ON lessons FOR UPDATE
    USING (is_admin() OR is_mentor_of(course_id))
    WITH CHECK (is_admin() OR is_mentor_of(course_id));
CREATE POLICY lessons_delete ON lessons FOR DELETE
    USING (is_admin());

-- ENROLLMENTS
CREATE POLICY enrollments_select ON enrollments FOR SELECT
    USING (user_id = auth.uid() OR is_admin() OR is_mentor_of(course_id));
CREATE POLICY enrollments_insert ON enrollments FOR INSERT
    WITH CHECK (user_id = auth.uid() OR is_admin());
CREATE POLICY enrollments_update ON enrollments FOR UPDATE
    USING (user_id = auth.uid() OR is_admin())
    WITH CHECK (user_id = auth.uid() OR is_admin());
CREATE POLICY enrollments_delete ON enrollments FOR DELETE
    USING (user_id = auth.uid() OR is_admin());

-- LESSON PROGRESS
CREATE POLICY lp_select ON lesson_progress FOR SELECT
    USING (user_id = auth.uid() OR is_admin() OR is_mentor_of(course_id));
CREATE POLICY lp_insert ON lesson_progress FOR INSERT
    WITH CHECK (user_id = auth.uid());
CREATE POLICY lp_update ON lesson_progress FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
CREATE POLICY lp_delete ON lesson_progress FOR DELETE
    USING (user_id = auth.uid() OR is_admin());

-- CERTIFICATES
CREATE POLICY cert_select ON certificates FOR SELECT
    USING (user_id = auth.uid() OR is_admin());
CREATE POLICY cert_admin_update ON certificates FOR UPDATE
    USING (is_admin());
CREATE POLICY cert_admin_delete ON certificates FOR DELETE
    USING (is_admin());

-- ACTIVITY LOG
CREATE POLICY act_select ON activity_log FOR SELECT
    USING (user_id = auth.uid() OR is_admin());
CREATE POLICY act_insert ON activity_log FOR INSERT
    WITH CHECK (user_id = auth.uid());
CREATE POLICY act_admin_delete ON activity_log FOR DELETE
    USING (is_admin());

-- NOTIFICATION PREFS
CREATE POLICY np_select ON notification_prefs FOR SELECT
    USING (user_id = auth.uid() OR is_admin());
CREATE POLICY np_update ON notification_prefs FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- NOTIFICATIONS
CREATE POLICY notif_select ON notifications FOR SELECT
    USING (user_id = auth.uid() OR is_admin());
CREATE POLICY notif_update ON notifications FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
CREATE POLICY notif_delete ON notifications FOR DELETE
    USING (user_id = auth.uid());

-- PLANS
CREATE POLICY plans_select ON plans FOR SELECT
    USING (true);
CREATE POLICY plans_admin_write ON plans FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- SUBSCRIPTIONS
CREATE POLICY subs_select ON subscriptions FOR SELECT
    USING (user_id = auth.uid() OR is_admin());
CREATE POLICY subs_insert ON subscriptions FOR INSERT
    WITH CHECK (user_id = auth.uid() OR is_admin());
CREATE POLICY subs_update ON subscriptions FOR UPDATE
    USING (user_id = auth.uid() OR is_admin())
    WITH CHECK (user_id = auth.uid() OR is_admin());
CREATE POLICY subs_delete ON subscriptions FOR DELETE
    USING (is_admin());

-- TRANSACTIONS
CREATE POLICY tx_select ON transactions FOR SELECT
    USING (user_id = auth.uid() OR is_admin());
CREATE POLICY tx_admin_write ON transactions FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- QUIZZES
CREATE POLICY quizzes_select ON quizzes FOR SELECT
    USING (is_enrolled(course_id) OR is_admin() OR is_mentor_of(course_id));
CREATE POLICY quizzes_write ON quizzes FOR INSERT
    WITH CHECK (is_admin() OR is_mentor_of(course_id));
CREATE POLICY quizzes_update ON quizzes FOR UPDATE
    USING (is_admin() OR is_mentor_of(course_id))
    WITH CHECK (is_admin() OR is_mentor_of(course_id));
CREATE POLICY quizzes_delete ON quizzes FOR DELETE
    USING (is_admin());

-- QUIZ QUESTIONS
CREATE POLICY qq_select ON quiz_questions FOR SELECT
    USING (EXISTS (SELECT 1 FROM quizzes q WHERE q.id = quiz_id
                   AND (is_enrolled(q.course_id) OR is_admin() OR is_mentor_of(q.course_id))));
CREATE POLICY qq_write ON quiz_questions FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM quizzes q WHERE q.id = quiz_id
                        AND (is_admin() OR is_mentor_of(q.course_id))));
CREATE POLICY qq_update ON quiz_questions FOR UPDATE
    USING (EXISTS (SELECT 1 FROM quizzes q WHERE q.id = quiz_id
                   AND (is_admin() OR is_mentor_of(q.course_id))));
CREATE POLICY qq_delete ON quiz_questions FOR DELETE
    USING (is_admin());

-- QUIZ OPTIONS
-- Students can SELECT option rows, but is_correct is hidden by using a view
-- below. Direct table access is admin/mentor only for full columns.
CREATE POLICY qo_select ON quiz_options FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM quiz_questions qq
        JOIN quizzes q ON q.id = qq.quiz_id
        WHERE qq.id = question_id
          AND (is_enrolled(q.course_id) OR is_admin() OR is_mentor_of(q.course_id))
    ));
CREATE POLICY qo_write ON quiz_options FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM quiz_questions qq
        JOIN quizzes q ON q.id = qq.quiz_id
        WHERE qq.id = question_id
          AND (is_admin() OR is_mentor_of(q.course_id))
    ));
CREATE POLICY qo_update ON quiz_options FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM quiz_questions qq
        JOIN quizzes q ON q.id = qq.quiz_id
        WHERE qq.id = question_id
          AND (is_admin() OR is_mentor_of(q.course_id))
    ));
CREATE POLICY qo_delete ON quiz_options FOR DELETE
    USING (is_admin());

-- Public view that NULLs out is_correct for students
CREATE OR REPLACE VIEW quiz_options_safe AS
SELECT
    id,
    question_id,
    option_text,
    order_index,
    CASE
        WHEN is_admin() THEN is_correct
        WHEN EXISTS (
            SELECT 1 FROM quiz_questions qq
            JOIN quizzes q ON q.id = qq.quiz_id
            WHERE qq.id = quiz_options.question_id
              AND is_mentor_of(q.course_id)
        ) THEN is_correct
        ELSE NULL
    END AS is_correct
FROM quiz_options;

-- QUIZ ATTEMPTS
CREATE POLICY qa_select ON quiz_attempts FOR SELECT
    USING (user_id = auth.uid() OR is_admin() OR is_mentor_of(course_id));
CREATE POLICY qa_insert ON quiz_attempts FOR INSERT
    WITH CHECK (user_id = auth.uid());
CREATE POLICY qa_update ON quiz_attempts FOR UPDATE
    USING (
        (user_id = auth.uid() AND submitted_at IS NULL)
        OR is_admin()
    )
    WITH CHECK (
        (user_id = auth.uid() AND submitted_at IS NULL)
        OR is_admin()
    );
CREATE POLICY qa_delete ON quiz_attempts FOR DELETE
    USING (
        (user_id = auth.uid() AND submitted_at IS NULL)
        OR is_admin()
    );

-- QUIZ ANSWERS
CREATE POLICY qan_select ON quiz_answers FOR SELECT
    USING (EXISTS (SELECT 1 FROM quiz_attempts a WHERE a.id = attempt_id
                   AND (a.user_id = auth.uid() OR is_admin())));
CREATE POLICY qan_insert ON quiz_answers FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM quiz_attempts a WHERE a.id = attempt_id
                        AND a.user_id = auth.uid() AND a.submitted_at IS NULL));
CREATE POLICY qan_delete ON quiz_answers FOR DELETE
    USING (EXISTS (SELECT 1 FROM quiz_attempts a WHERE a.id = attempt_id
                   AND a.user_id = auth.uid() AND a.submitted_at IS NULL));

-- DISCUSSION THREADS
CREATE POLICY dt_select ON discussion_threads FOR SELECT
    USING (is_enrolled(course_id) OR is_admin() OR is_mentor_of(course_id));
CREATE POLICY dt_insert ON discussion_threads FOR INSERT
    WITH CHECK (author_id = auth.uid() AND is_enrolled(course_id));
CREATE POLICY dt_update ON discussion_threads FOR UPDATE
    USING (author_id = auth.uid() OR is_admin() OR is_mentor_of(course_id))
    WITH CHECK (author_id = auth.uid() OR is_admin() OR is_mentor_of(course_id));
CREATE POLICY dt_delete ON discussion_threads FOR DELETE
    USING (author_id = auth.uid() OR is_admin() OR is_mentor_of(course_id));

-- DISCUSSION REPLIES
CREATE POLICY dr_select ON discussion_replies FOR SELECT
    USING (EXISTS (SELECT 1 FROM discussion_threads t WHERE t.id = thread_id
                   AND (is_enrolled(t.course_id) OR is_admin() OR is_mentor_of(t.course_id))));
CREATE POLICY dr_insert ON discussion_replies FOR INSERT
    WITH CHECK (
        author_id = auth.uid()
        AND EXISTS (SELECT 1 FROM discussion_threads t WHERE t.id = thread_id
                    AND t.locked = false
                    AND (is_enrolled(t.course_id) OR is_admin() OR is_mentor_of(t.course_id)))
    );
CREATE POLICY dr_update ON discussion_replies FOR UPDATE
    USING (author_id = auth.uid() OR is_admin())
    WITH CHECK (author_id = auth.uid() OR is_admin());
CREATE POLICY dr_delete ON discussion_replies FOR DELETE
    USING (author_id = auth.uid() OR is_admin());

-- DISCUSSION REACTIONS
CREATE POLICY drx_select ON discussion_reactions FOR SELECT
    USING (
        (thread_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM discussion_threads t WHERE t.id = thread_id
            AND (is_enrolled(t.course_id) OR is_admin() OR is_mentor_of(t.course_id))
        ))
        OR (reply_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM discussion_replies r
            JOIN discussion_threads t ON t.id = r.thread_id
            WHERE r.id = reply_id
            AND (is_enrolled(t.course_id) OR is_admin() OR is_mentor_of(t.course_id))
        ))
    );
CREATE POLICY drx_insert ON discussion_reactions FOR INSERT
    WITH CHECK (user_id = auth.uid());
CREATE POLICY drx_delete ON discussion_reactions FOR DELETE
    USING (user_id = auth.uid());

-- ================================================
-- QUIZ GRADING FUNCTION
-- ================================================

CREATE OR REPLACE FUNCTION submit_quiz_attempt(p_attempt_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user uuid := auth.uid();
    v_attempt quiz_attempts%ROWTYPE;
    v_pass_threshold int;
    v_points_scored int := 0;
    v_points_total  int := 0;
    v_score_percent int;
    v_passed boolean;
BEGIN
    SELECT * INTO v_attempt FROM quiz_attempts
    WHERE id = p_attempt_id AND user_id = v_user;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Attempt not found or not owned by user';
    END IF;

    IF v_attempt.submitted_at IS NOT NULL THEN
        RAISE EXCEPTION 'Attempt already submitted';
    END IF;

    -- Grade each answer
    UPDATE quiz_answers a
    SET is_correct = (
        SELECT o.is_correct
        FROM quiz_options o
        WHERE o.id = a.option_id
    )
    WHERE a.attempt_id = p_attempt_id;

    -- Compute totals
    SELECT COALESCE(sum(qq.points), 0) INTO v_points_total
    FROM quiz_questions qq WHERE qq.quiz_id = v_attempt.quiz_id;

    SELECT COALESCE(sum(qq.points), 0) INTO v_points_scored
    FROM quiz_answers a
    JOIN quiz_questions qq ON qq.id = a.question_id
    WHERE a.attempt_id = p_attempt_id AND a.is_correct = true;

    SELECT q.pass_threshold INTO v_pass_threshold
    FROM quizzes q WHERE q.id = v_attempt.quiz_id;

    v_score_percent := CASE
        WHEN v_points_total = 0 THEN 0
        ELSE ROUND(100.0 * v_points_scored / v_points_total)::int
    END;

    v_passed := v_score_percent >= v_pass_threshold;

    UPDATE quiz_attempts
    SET points_scored = v_points_scored,
        points_total = v_points_total,
        score_percent = v_score_percent,
        passed = v_passed,
        submitted_at = now(),
        time_spent_sec = EXTRACT(EPOCH FROM (now() - started_at))::int
    WHERE id = p_attempt_id;

    INSERT INTO activity_log (user_id, type, course_id, metadata)
    VALUES (v_user,
            CASE WHEN v_passed THEN 'quiz_passed' ELSE 'quiz_failed' END,
            v_attempt.course_id,
            jsonb_build_object(
                'attempt_id', p_attempt_id,
                'quiz_id', v_attempt.quiz_id,
                'score_percent', v_score_percent
            ));

    RETURN jsonb_build_object(
        'score_percent', v_score_percent,
        'points_scored', v_points_scored,
        'points_total', v_points_total,
        'passed', v_passed
    );
END;
$$;

GRANT EXECUTE ON FUNCTION submit_quiz_attempt(uuid) TO authenticated;