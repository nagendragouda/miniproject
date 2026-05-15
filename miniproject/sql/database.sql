-- ============================================================
--  FutureMatrix – profiles table
--  Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create the table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (

  -- ── Primary Key (Firebase UID) ────────────────────────────
  firebase_uid          TEXT PRIMARY KEY,

  -- ── Auth ─────────────────────────────────────────────────
  email                 TEXT NOT NULL
    CONSTRAINT chk_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),

  -- ── Profile Header ────────────────────────────────────────
  full_name             TEXT
    CONSTRAINT chk_full_name_length CHECK (char_length(TRIM(full_name)) >= 3),

  profile_image_url     TEXT,  -- base64 data-URI or HTTPS URL

  -- ── Basic Information ─────────────────────────────────────
  gender                TEXT
    CONSTRAINT chk_gender CHECK (gender IN ('Male', 'Female', 'Other')),

  dob                   DATE
    CONSTRAINT chk_dob_past CHECK (dob < CURRENT_DATE),

  phone                 TEXT
    CONSTRAINT chk_phone_digits CHECK (phone ~ '^\d{10,15}$'),

  country               TEXT,

  state                 TEXT,

  -- ── Education Details ─────────────────────────────────────
  education_level       TEXT
    CONSTRAINT chk_education_level CHECK (
      education_level IN ('10th', 'PUC', 'Diploma', 'Graduation', 'Post Graduation')
    ),

  course_stream         TEXT
    CONSTRAINT chk_course_stream_length CHECK (char_length(TRIM(course_stream)) >= 2),

  institution_name      TEXT
    CONSTRAINT chk_institution_name_length CHECK (char_length(TRIM(institution_name)) >= 3),

  academic_score        NUMERIC(5, 2)
    CONSTRAINT chk_academic_score_range CHECK (academic_score >= 0 AND academic_score <= 100),

  -- ── Skills & Interests (stored as text arrays) ────────────
  skills                TEXT[]  DEFAULT '{}',
  interests             TEXT[]  DEFAULT '{}',

  -- ── Experience ────────────────────────────────────────────
  experience_years      NUMERIC(4, 1)
    CONSTRAINT chk_experience_years CHECK (experience_years >= 0 AND experience_years <= 60),

  experience_details    TEXT,

  -- ── Social Links ──────────────────────────────────────────
  linkedin_url          TEXT
    CONSTRAINT chk_linkedin_url CHECK (
      linkedin_url IS NULL OR linkedin_url = '' OR linkedin_url ~* '^https?://.+\..+'
    ),

  github_url            TEXT
    CONSTRAINT chk_github_url CHECK (
      github_url IS NULL OR github_url = '' OR github_url ~* '^https?://.+\..+'
    ),

  portfolio_url         TEXT
    CONSTRAINT chk_portfolio_url CHECK (
      portfolio_url IS NULL OR portfolio_url = '' OR portfolio_url ~* '^https?://.+\..+'
    ),

  -- ── Timestamps ────────────────────────────────────────────
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. Auto-update updated_at on every row change
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. Indexes for common query patterns
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email        ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_country       ON public.profiles (country);
CREATE INDEX IF NOT EXISTS idx_profiles_education     ON public.profiles (education_level);
CREATE INDEX IF NOT EXISTS idx_profiles_skills        ON public.profiles USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_profiles_interests     ON public.profiles USING GIN (interests);

-- ============================================================
-- 4. Row Level Security (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read any profile (needed for leaderboards / discovery)
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert only their own row
-- (firebase_uid must match the JWT claim or use service role from API)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (true);   -- relax for Firebase-auth projects; tighten in production

-- Users can update only their own row
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);   -- tighten to match firebase_uid once JWT validation is set up

-- ============================================================
-- 5. (Optional) Add columns to an existing table
--    Run only if you already have a profiles table
-- ============================================================
/*
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS education_level   TEXT,
  ADD COLUMN IF NOT EXISTS course_stream     TEXT,
  ADD COLUMN IF NOT EXISTS institution_name  TEXT,
  ADD COLUMN IF NOT EXISTS academic_score    NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS skills            TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS interests         TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience_years  NUMERIC(4,1),
  ADD COLUMN IF NOT EXISTS experience_details TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url      TEXT,
  ADD COLUMN IF NOT EXISTS github_url        TEXT,
  ADD COLUMN IF NOT EXISTS portfolio_url     TEXT;

-- Then add constraints
ALTER TABLE public.profiles
  ADD CONSTRAINT chk_education_level CHECK (
    education_level IN ('10th','PUC','Diploma','Graduation','Post Graduation')
  ),
  ADD CONSTRAINT chk_academic_score_range CHECK (
    academic_score >= 0 AND academic_score <= 100
  ),
  ADD CONSTRAINT chk_linkedin_url CHECK (
    linkedin_url IS NULL OR linkedin_url = '' OR linkedin_url ~* '^https?://.+\..+'
  ),
  ADD CONSTRAINT chk_github_url CHECK (
    github_url IS NULL OR github_url = '' OR github_url ~* '^https?://.+\..+'
  ),
  ADD CONSTRAINT chk_portfolio_url CHECK (
    portfolio_url IS NULL OR portfolio_url = '' OR portfolio_url ~* '^https?://.+\..+'
  );
*/
