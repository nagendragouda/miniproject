-- Enforce strict no-duplicate rules on existing public.user_details
-- Supabase / PostgreSQL
-- Uniqueness fields: username, institution_name, email, phone_number

BEGIN;

-- Fix profile picture storage for base64 payloads.
ALTER TABLE public.user_details
  ALTER COLUMN profile_picture_url TYPE TEXT;

-- Normalize values first.
UPDATE public.user_details
SET
  username = REGEXP_REPLACE(BTRIM(COALESCE(username, '')), '\s+', ' ', 'g'),
  institution_name = REGEXP_REPLACE(BTRIM(COALESCE(institution_name, '')), '\s+', ' ', 'g'),
  country = REGEXP_REPLACE(BTRIM(COALESCE(country, '')), '\s+', ' ', 'g'),
  state = REGEXP_REPLACE(BTRIM(COALESCE(state, '')), '\s+', ' ', 'g'),
  email = LOWER(BTRIM(COALESCE(email, ''))),
  phone_number = REGEXP_REPLACE(COALESCE(phone_number, ''), '\D', '', 'g'),
  updated_at = CURRENT_TIMESTAMP;

-- Reject empty required fields.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.user_details
    WHERE
      BTRIM(COALESCE(username, '')) = '' OR
      BTRIM(COALESCE(institution_name, '')) = '' OR
      BTRIM(COALESCE(country, '')) = '' OR
      BTRIM(COALESCE(state, '')) = '' OR
      BTRIM(COALESCE(email, '')) = '' OR
      BTRIM(COALESCE(phone_number, '')) = ''
  ) THEN
    RAISE EXCEPTION 'Cannot enforce strict uniqueness: required fields (username/institution/country/state/email/phone) are blank in some rows.';
  END IF;
END $$;

-- Reject duplicates after normalization.
DO $$
BEGIN
  IF EXISTS (
    SELECT LOWER(REGEXP_REPLACE(BTRIM(username), '\s+', ' ', 'g'))
    FROM public.user_details
    GROUP BY 1 HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate username values found after normalization.';
  END IF;

  IF EXISTS (
    SELECT LOWER(REGEXP_REPLACE(BTRIM(institution_name), '\s+', ' ', 'g'))
    FROM public.user_details
    GROUP BY 1 HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate institution_name values found after normalization.';
  END IF;

  IF EXISTS (
    SELECT LOWER(BTRIM(email))
    FROM public.user_details
    GROUP BY 1 HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate email values found after normalization.';
  END IF;

  IF EXISTS (
    SELECT REGEXP_REPLACE(phone_number, '\D', '', 'g')
    FROM public.user_details
    GROUP BY 1 HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate phone_number values found after normalization.';
  END IF;
END $$;

-- Enforce required columns.
ALTER TABLE public.user_details
  ALTER COLUMN age SET NOT NULL,
  ALTER COLUMN country SET NOT NULL,
  ALTER COLUMN state SET NOT NULL,
  ALTER COLUMN institution_name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN phone_number SET NOT NULL;

ALTER TABLE public.user_details
  DROP CONSTRAINT IF EXISTS user_details_age_check;

ALTER TABLE public.user_details
  ADD CONSTRAINT user_details_age_check
  CHECK (age >= 13 AND age <= 100);

-- Validation checks.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_user_details_email_format'
      AND conrelid = 'public.user_details'::regclass
  ) THEN
    ALTER TABLE public.user_details
      ADD CONSTRAINT chk_user_details_email_format
      CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_user_details_username_format'
      AND conrelid = 'public.user_details'::regclass
  ) THEN
    ALTER TABLE public.user_details
      ADD CONSTRAINT chk_user_details_username_format
      CHECK (username ~ '^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_user_details_full_name_format'
      AND conrelid = 'public.user_details'::regclass
  ) THEN
    ALTER TABLE public.user_details
      ADD CONSTRAINT chk_user_details_full_name_format
      CHECK (full_name ~ '^[A-Za-z ]{3,255}$');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_user_details_phone_digits'
      AND conrelid = 'public.user_details'::regclass
  ) THEN
    ALTER TABLE public.user_details
      ADD CONSTRAINT chk_user_details_phone_digits
      CHECK (LENGTH(REGEXP_REPLACE(phone_number, '\D', '', 'g')) BETWEEN 10 AND 15);
  END IF;
END $$;

-- Normalized unique indexes.
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_username_normalized
  ON public.user_details (LOWER(REGEXP_REPLACE(BTRIM(username), '\s+', ' ', 'g')));

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_institution_normalized
  ON public.user_details (LOWER(REGEXP_REPLACE(BTRIM(institution_name), '\s+', ' ', 'g')));

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_email_normalized
  ON public.user_details (LOWER(BTRIM(email)));

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_phone_normalized
  ON public.user_details (REGEXP_REPLACE(phone_number, '\D', '', 'g'));

DROP INDEX IF EXISTS public.ux_user_details_country_normalized;
DROP INDEX IF EXISTS public.ux_user_details_state_normalized;

-- Auto-normalize future writes.
CREATE OR REPLACE FUNCTION public.normalize_user_details_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.username := REGEXP_REPLACE(BTRIM(COALESCE(NEW.username, '')), '\s+', ' ', 'g');
  NEW.institution_name := REGEXP_REPLACE(BTRIM(COALESCE(NEW.institution_name, '')), '\s+', ' ', 'g');
  NEW.country := REGEXP_REPLACE(BTRIM(COALESCE(NEW.country, '')), '\s+', ' ', 'g');
  NEW.state := REGEXP_REPLACE(BTRIM(COALESCE(NEW.state, '')), '\s+', ' ', 'g');
  NEW.email := LOWER(BTRIM(COALESCE(NEW.email, '')));
  NEW.phone_number := REGEXP_REPLACE(COALESCE(NEW.phone_number, ''), '\D', '', 'g');
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_user_details_fields ON public.user_details;

CREATE TRIGGER trg_normalize_user_details_fields
BEFORE INSERT OR UPDATE ON public.user_details
FOR EACH ROW
EXECUTE FUNCTION public.normalize_user_details_fields();

COMMIT;
