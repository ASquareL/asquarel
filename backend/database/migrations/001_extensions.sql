-- ================================================
-- MIGRATION 001 — Foundation
-- Extensions · Sequences · Scalar Functions
-- ================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SEQUENCE IF NOT EXISTS reg_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS certificate_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_reg_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    seq_val int;
BEGIN
    seq_val := nextval('reg_number_seq');
    RETURN 'ASL-' || to_char(now(), 'YYYY') || '-' || lpad(seq_val::text, 3, '0');
END;
$$;

CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    seq_val int;
BEGIN
    seq_val := nextval('certificate_number_seq');
    RETURN 'ASL-CERT-' || to_char(now(), 'YYYY') || '-' || lpad(seq_val::text, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;