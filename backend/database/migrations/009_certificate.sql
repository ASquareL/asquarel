-- ================================================
-- MIGRATION 009 — Certificate public verification
-- ================================================

-- Public-safe verify function.
-- Given a verification_code, returns limited info.
-- Anyone (including anon) can call this. No other cert data leaks.
CREATE OR REPLACE FUNCTION verify_certificate(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_cert record;
    v_student_name text;
    v_course_title text;
BEGIN
    SELECT
        c.certificate_number,
        c.issued_at,
        c.verification_code,
        p.full_name AS student_name,
        co.title AS course_title
    INTO v_cert
    FROM certificates c
    JOIN profiles p ON p.id = c.user_id
    JOIN courses co ON co.id = c.course_id
    WHERE c.verification_code = p_code
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false);
    END IF;

    RETURN jsonb_build_object(
        'valid', true,
        'certificate_number', v_cert.certificate_number,
        'issued_at', v_cert.issued_at,
        'student_name', v_cert.student_name,
        'course_title', v_cert.course_title
    );
END;
$$;

GRANT EXECUTE ON FUNCTION verify_certificate(text) TO anon, authenticated;