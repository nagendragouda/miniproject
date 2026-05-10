-- Strict user_details table creation script (Supabase/PostgreSQL)
-- Guarantees original unique values after normalization.

BEGIN;

CREATE TABLE IF NOT EXISTS public.user_details (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  profile_picture_url TEXT,

  username VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,

  age INTEGER NOT NULL CHECK (age >= 13 AND age <= 100),
  gender VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100),

  education_level VARCHAR(100) NOT NULL,
  course VARCHAR(255) NOT NULL,
  institution_name VARCHAR(255) NOT NULL,
  year_of_study VARCHAR(50) NOT NULL,

  skills JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,

  activity_preference VARCHAR(100),
  work_style VARCHAR(100),
  desired_career_field VARCHAR(255),
  dream_job_role VARCHAR(255),
  expected_salary VARCHAR(100),
  work_preference VARCHAR(100),
  learning_method VARCHAR(100),
  weekly_time_availability VARCHAR(100),

  career_clarity VARCHAR(255),
  experience JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '[]'::jsonb,

  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_user_details_email_format
    CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  CONSTRAINT chk_user_details_username_format
    CHECK (username ~ '^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$'),
  CONSTRAINT chk_user_details_full_name_format
    CHECK (full_name ~ '^[A-Za-z ]{3,255}$'),
  CONSTRAINT chk_user_details_phone_digits
    CHECK (LENGTH(REGEXP_REPLACE(phone_number, '\\D', '', 'g')) BETWEEN 10 AND 15)
);

CREATE INDEX IF NOT EXISTS idx_user_details_user_id
  ON public.user_details(user_id);

CREATE INDEX IF NOT EXISTS idx_user_details_username
  ON public.user_details(username);

-- Strict uniqueness after normalization.
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_username_normalized
  ON public.user_details (LOWER(REGEXP_REPLACE(BTRIM(username), '\\s+', ' ', 'g')));

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_institution_normalized
  ON public.user_details (LOWER(REGEXP_REPLACE(BTRIM(institution_name), '\\s+', ' ', 'g')));

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_email_normalized
  ON public.user_details (LOWER(BTRIM(email)));

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_phone_normalized
  ON public.user_details (REGEXP_REPLACE(phone_number, '\\D', '', 'g'));

-- Auto-normalize incoming values so duplicates like " MIT " and "mit" are blocked.
CREATE OR REPLACE FUNCTION public.normalize_user_details_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.username := REGEXP_REPLACE(BTRIM(COALESCE(NEW.username, '')), '\\s+', ' ', 'g');
  NEW.institution_name := REGEXP_REPLACE(BTRIM(COALESCE(NEW.institution_name, '')), '\\s+', ' ', 'g');
  NEW.country := REGEXP_REPLACE(BTRIM(COALESCE(NEW.country, '')), '\\s+', ' ', 'g');
  NEW.state := REGEXP_REPLACE(BTRIM(COALESCE(NEW.state, '')), '\\s+', ' ', 'g');
  NEW.email := LOWER(BTRIM(COALESCE(NEW.email, '')));
  NEW.phone_number := REGEXP_REPLACE(COALESCE(NEW.phone_number, ''), '\\D', '', 'g');
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
