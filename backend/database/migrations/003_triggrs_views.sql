-- ================================================
-- MIGRATION 003 — Triggers & Views
-- ================================================

-- 3.1 Auto-create profile + prefs on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, reg_number, full_name, email)
    VALUES (
        NEW.id,
        public.generate_reg_number(),
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Student'),
        NEW.email
    );

    INSERT INTO public.notification_prefs (user_id) VALUES (NEW.id);

    RETURN NEW;
END;
$$;

-- 3.2 Lock protected columns on profile update
CREATE OR REPLACE FUNCTION protect_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_admin boolean;
BEGIN
    SELECT (role = 'admin') INTO is_admin
    FROM public.profiles WHERE id = auth.uid();

    IF NOT COALESCE(is_admin, false) THEN
        NEW.role := OLD.role;
        NEW.reg_number := OLD.reg_number;
        NEW.level := OLD.level;
    END IF;

    RETURN NEW;
END;
$$;

-- 3.3 On lesson progress: log, complete course, issue certificate
CREATE OR REPLACE FUNCTION on_lesson_progress_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_in_course int;
    completed_in_course int;
    cert_number text;
    verify_code text;
    course_cert_enabled boolean;
BEGIN
    IF NEW.status = 'completed' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'completed') THEN

        INSERT INTO activity_log (user_id, type, lesson_id, course_id)
        VALUES (NEW.user_id, 'lesson_completed', NEW.lesson_id, NEW.course_id);

        UPDATE enrollments
        SET last_accessed_at = now(), last_lesson_id = NEW.lesson_id
        WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

        SELECT count(*) INTO total_in_course
        FROM lessons WHERE course_id = NEW.course_id AND published = true;

        SELECT count(*) INTO completed_in_course
        FROM lesson_progress
        WHERE user_id = NEW.user_id AND course_id = NEW.course_id AND status = 'completed';

        IF completed_in_course >= total_in_course AND total_in_course > 0 THEN

            UPDATE enrollments
            SET completed_at = now()
            WHERE user_id = NEW.user_id AND course_id = NEW.course_id
              AND completed_at IS NULL;

            INSERT INTO activity_log (user_id, type, course_id)
            VALUES (NEW.user_id, 'course_completed', NEW.course_id);

            SELECT certificate_enabled INTO course_cert_enabled
            FROM courses WHERE id = NEW.course_id;

            IF course_cert_enabled THEN
                cert_number := public.generate_certificate_number();
                verify_code := encode(gen_random_bytes(8), 'hex');

                INSERT INTO certificates
                    (user_id, course_id, certificate_number, verification_code)
                VALUES
                    (NEW.user_id, NEW.course_id, cert_number, verify_code)
                ON CONFLICT (user_id, course_id) DO NOTHING;

                INSERT INTO activity_log (user_id, type, course_id, metadata)
                VALUES (NEW.user_id, 'certificate_earned', NEW.course_id,
                        jsonb_build_object('certificate_number', cert_number));

                INSERT INTO notifications (user_id, type, title, body, link)
                VALUES (NEW.user_id, 'certificate_earned',
                        'Certificate Earned!',
                        'You completed a course and earned your certificate.',
                        '/academy/profile.html');
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 3.4 Log enrollment
CREATE OR REPLACE FUNCTION on_enrollment_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO activity_log (user_id, type, course_id)
    VALUES (NEW.user_id, 'course_enrolled', NEW.course_id);
    RETURN NEW;
END;
$$;

-- 3.5 Refresh cached counts on lessons change
CREATE OR REPLACE FUNCTION refresh_course_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_course uuid;
    target_module uuid;
BEGIN
    target_course := COALESCE(NEW.course_id, OLD.course_id);
    target_module := COALESCE(NEW.module_id, OLD.module_id);

    UPDATE modules SET
        lessons_count = (SELECT count(*) FROM lessons WHERE module_id = target_module),
        total_minutes = (SELECT COALESCE(sum(duration_minutes),0) FROM lessons WHERE module_id = target_module)
    WHERE id = target_module;

    UPDATE courses SET
        lessons_count = (SELECT count(*) FROM lessons WHERE course_id = target_course),
        total_minutes = (SELECT COALESCE(sum(duration_minutes),0) FROM lessons WHERE course_id = target_course)
    WHERE id = target_course;

    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3.6 Discussion: thread created
CREATE OR REPLACE FUNCTION on_thread_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO activity_log (user_id, type, course_id, metadata)
    VALUES (NEW.author_id, 'thread_created', NEW.course_id,
            jsonb_build_object('thread_id', NEW.id, 'title', NEW.title));
    RETURN NEW;
END;
$$;

-- 3.7 Discussion: reply created
CREATE OR REPLACE FUNCTION on_reply_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    thread_author uuid;
    thread_title  text;
BEGIN
    UPDATE discussion_threads
    SET reply_count = reply_count + 1, last_reply_at = now()
    WHERE id = NEW.thread_id
    RETURNING author_id, title INTO thread_author, thread_title;

    INSERT INTO activity_log (user_id, type, metadata)
    VALUES (NEW.author_id, 'reply_posted',
            jsonb_build_object('thread_id', NEW.thread_id, 'reply_id', NEW.id));

    IF thread_author IS NOT NULL AND thread_author <> NEW.author_id THEN
        INSERT INTO notifications (user_id, type, title, body, link)
        VALUES (thread_author, 'discussion_reply',
                'New reply to your thread',
                'Someone replied to "' || thread_title || '"',
                NULL);
    END IF;

    RETURN NEW;
END;
$$;

-- 3.8 Discussion: reaction change
CREATE OR REPLACE FUNCTION on_reaction_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.thread_id IS NOT NULL THEN
            UPDATE discussion_threads
            SET reaction_count = (SELECT count(*) FROM discussion_reactions WHERE thread_id = NEW.thread_id)
            WHERE id = NEW.thread_id;
        ELSE
            UPDATE discussion_replies
            SET reaction_count = (SELECT count(*) FROM discussion_reactions WHERE reply_id = NEW.reply_id)
            WHERE id = NEW.reply_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.thread_id IS NOT NULL THEN
            UPDATE discussion_threads
            SET reaction_count = (SELECT count(*) FROM discussion_reactions WHERE thread_id = OLD.thread_id)
            WHERE id = OLD.thread_id;
        ELSE
            UPDATE discussion_replies
            SET reaction_count = (SELECT count(*) FROM discussion_reactions WHERE reply_id = OLD.reply_id)
            WHERE id = OLD.reply_id;
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3.9 TRIGGERS

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER profiles_protect_cols
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION protect_profile_columns();

CREATE TRIGGER courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER modules_updated_at
    BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER quizzes_updated_at
    BEFORE UPDATE ON quizzes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER threads_updated_at
    BEFORE UPDATE ON discussion_threads
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER replies_updated_at
    BEFORE UPDATE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER lesson_progress_after_change
    AFTER INSERT OR UPDATE ON lesson_progress
    FOR EACH ROW EXECUTE FUNCTION on_lesson_progress_change();

CREATE TRIGGER enrollments_after_insert
    AFTER INSERT ON enrollments
    FOR EACH ROW EXECUTE FUNCTION on_enrollment_insert();

CREATE TRIGGER lessons_after_change
    AFTER INSERT OR DELETE ON lessons
    FOR EACH ROW EXECUTE FUNCTION refresh_course_counts();

CREATE TRIGGER threads_after_insert
    AFTER INSERT ON discussion_threads
    FOR EACH ROW EXECUTE FUNCTION on_thread_created();

CREATE TRIGGER replies_after_insert
    AFTER INSERT ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION on_reply_created();

CREATE TRIGGER reactions_after_change
    AFTER INSERT OR DELETE ON discussion_reactions
    FOR EACH ROW EXECUTE FUNCTION on_reaction_change();

-- 3.10 VIEWS

CREATE OR REPLACE VIEW course_progress AS
SELECT
    e.user_id,
    e.course_id,
    c.lessons_count AS total_lessons,
    COALESCE(
        (SELECT count(*) FROM lesson_progress lp
         WHERE lp.user_id = e.user_id AND lp.course_id = e.course_id
           AND lp.status = 'completed'), 0
    )::int AS completed_lessons,
    CASE
        WHEN c.lessons_count = 0 THEN 0
        ELSE ROUND(100.0 *
            COALESCE((SELECT count(*) FROM lesson_progress lp
                     WHERE lp.user_id = e.user_id AND lp.course_id = e.course_id
                       AND lp.status = 'completed'), 0)
            / c.lessons_count)::int
    END AS percentage
FROM enrollments e
JOIN courses c ON c.id = e.course_id;

CREATE OR REPLACE VIEW user_stats AS
SELECT
    p.id AS user_id,
    (SELECT count(*) FROM enrollments WHERE user_id = p.id)::int AS courses_enrolled,
    (SELECT count(*) FROM enrollments WHERE user_id = p.id AND completed_at IS NOT NULL)::int AS courses_completed,
    (SELECT count(*) FROM lesson_progress WHERE user_id = p.id AND status = 'completed')::int AS lessons_completed,
    (SELECT COALESCE(sum(time_spent_sec),0)/60 FROM lesson_progress WHERE user_id = p.id)::int AS total_minutes_learned,
    (SELECT count(*) FROM certificates WHERE user_id = p.id)::int AS certificates_earned,
    (SELECT count(DISTINCT date_trunc('day', created_at)) FROM activity_log
     WHERE user_id = p.id AND created_at > now() - interval '30 days')::int AS active_days_30,
    (SELECT count(*) FROM quiz_attempts WHERE user_id = p.id AND passed = true)::int AS quizzes_passed,
    (SELECT count(*) FROM discussion_threads WHERE author_id = p.id)
     + (SELECT count(*) FROM discussion_replies WHERE author_id = p.id) AS discussion_posts
FROM profiles p;

CREATE OR REPLACE VIEW lesson_with_context AS
SELECT
    l.*,
    m.title AS module_title,
    m.order_index AS module_order,
    c.title AS course_title,
    c.slug AS course_slug,
    (SELECT lp.status FROM lesson_progress lp
     WHERE lp.user_id = auth.uid() AND lp.lesson_id = l.id LIMIT 1) AS user_status,
    (SELECT l2.number FROM lessons l2
     WHERE l2.course_id = l.course_id AND l2.number < l.number
     ORDER BY l2.number DESC LIMIT 1) AS prev_lesson_number,
    (SELECT l2.number FROM lessons l2
     WHERE l2.course_id = l.course_id AND l2.number > l.number
     ORDER BY l2.number ASC LIMIT 1) AS next_lesson_number
FROM lessons l
JOIN modules m ON m.id = l.module_id
JOIN courses c ON c.id = l.course_id;

CREATE OR REPLACE VIEW quiz_summary AS
SELECT
    q.id AS quiz_id,
    q.title,
    m.title AS module_title,
    c.title AS course_title,
    c.id AS course_id,
    (SELECT count(*) FROM quiz_questions WHERE quiz_id = q.id)::int AS question_count,
    (SELECT COALESCE(sum(points),0) FROM quiz_questions WHERE quiz_id = q.id)::int AS total_points,
    q.pass_threshold,
    (SELECT max(score_percent) FROM quiz_attempts WHERE quiz_id = q.id AND user_id = auth.uid()) AS user_best_score,
    (SELECT count(*) FROM quiz_attempts WHERE quiz_id = q.id AND user_id = auth.uid())::int AS user_attempts,
    (SELECT bool_or(passed) FROM quiz_attempts WHERE quiz_id = q.id AND user_id = auth.uid()) AS user_passed
FROM quizzes q
JOIN courses c ON c.id = q.course_id
LEFT JOIN modules m ON m.id = q.module_id;

CREATE OR REPLACE VIEW thread_with_meta AS
SELECT
    t.*,
    p.full_name AS author_name,
    p.avatar_url AS author_avatar,
    c.title AS course_title,
    l.title AS lesson_title,
    EXISTS (SELECT 1 FROM discussion_reactions dr
            WHERE dr.thread_id = t.id AND dr.user_id = auth.uid()) AS user_has_reacted
FROM discussion_threads t
JOIN profiles p ON p.id = t.author_id
JOIN courses c ON c.id = t.course_id
LEFT JOIN lessons l ON l.id = t.lesson_id;