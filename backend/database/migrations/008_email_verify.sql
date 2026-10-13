-- ================================================
-- MIGRATION 008 — Email verification attempt tracking
-- ================================================

ALTER TABLE profiles
    ADD COLUMN email_verify_attempts int NOT NULL DEFAULT 0,
    ADD COLUMN email_verify_locked_until timestamptz;

-- Helper function to check + increment attempts atomically.
-- Called from client before verifyOtp to enforce 3-attempt limit.
CREATE OR REPLACE FUNCTION check_verify_attempts(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_attempts int;
    v_locked_until timestamptz;
    v_remaining int;
BEGIN
    SELECT email_verify_attempts, email_verify_locked_until
    INTO v_attempts, v_locked_until
    FROM profiles WHERE id = p_user_id;

    IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'locked_until', v_locked_until,
            'remaining_seconds', EXTRACT(EPOCH FROM (v_locked_until - now()))::int
        );
    END IF;

    -- If lock has expired, reset
    IF v_locked_until IS NOT NULL AND v_locked_until <= now() THEN
        UPDATE profiles
        SET email_verify_attempts = 0, email_verify_locked_until = NULL
        WHERE id = p_user_id;
        v_attempts := 0;
    END IF;

    v_remaining := 3 - v_attempts;

    RETURN jsonb_build_object(
        'allowed', true,
        'attempts', v_attempts,
        'remaining', v_remaining
    );
END;
$$;

GRANT EXECUTE ON FUNCTION check_verify_attempts(uuid) TO authenticated;

-- Function to record a failed attempt
CREATE OR REPLACE FUNCTION record_failed_verify(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_attempts int;
BEGIN
    UPDATE profiles
    SET email_verify_attempts = email_verify_attempts + 1
    WHERE id = p_user_id
    RETURNING email_verify_attempts INTO v_attempts;

    IF v_attempts >= 3 THEN
        UPDATE profiles
        SET email_verify_locked_until = now() + interval '21 minutes'
        WHERE id = p_user_id;

        RETURN jsonb_build_object('locked', true, 'locked_until_minutes', 21);
    END IF;

    RETURN jsonb_build_object('locked', false, 'remaining', 3 - v_attempts);
END;
$$;

GRANT EXECUTE ON FUNCTION record_failed_verify(uuid) TO authenticated;