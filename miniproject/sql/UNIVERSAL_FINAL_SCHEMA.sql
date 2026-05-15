-- ============================================================================
-- UNIVERSAL FINAL SCHEMA - FutureMatrix Platform
-- Complete database setup for all required tables
-- ============================================================================

-- ============================================================================
-- 1. USER DETAILS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_details (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  profile_picture_url TEXT,
  username VARCHAR(100) UNIQUE NOT NULL,
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    WHERE conname = 'chk_user_details_email_format'
      AND conrelid = 'public.user_details'::regclass
  ) THEN
    ALTER TABLE public.user_details
      ADD CONSTRAINT chk_user_details_email_format
      CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$');
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
      CHECK (LENGTH(REGEXP_REPLACE(phone_number, '\\D', '', 'g')) BETWEEN 10 AND 15);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_details_user_id ON public.user_details(user_id);
CREATE INDEX IF NOT EXISTS idx_user_details_username ON public.user_details(username);

-- Normalized uniqueness (case and extra-space insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_username_normalized
  ON public.user_details (LOWER(BTRIM(username)));

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_institution_normalized
  ON public.user_details (LOWER(REGEXP_REPLACE(BTRIM(institution_name), '\\s+', ' ', 'g')));

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_email_normalized
  ON public.user_details (LOWER(BTRIM(email)));

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_details_phone_normalized
  ON public.user_details (REGEXP_REPLACE(COALESCE(phone_number, ''), '\\D', '', 'g'));

-- ============================================================================
-- 2. COLLEGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  name VARCHAR(255) NOT NULL UNIQUE,
  short_name VARCHAR(100),
  location VARCHAR(255) NOT NULL,
  state VARCHAR(100),
  city VARCHAR(100),
  
  -- College Type and Details
  type VARCHAR(50) NOT NULL, -- Government, Private, Deemed
  established INTEGER,
  website VARCHAR(255),
  is_public BOOLEAN DEFAULT FALSE,
  
  -- Academic Information
  courses TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of courses
  programs TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Ratings and Rankings
  rating NUMERIC(3,1) DEFAULT 3.5 CHECK (rating >= 0 AND rating <= 5),
  ranking INTEGER DEFAULT 999,
  acceptance_rate NUMERIC(5,2),
  
  -- Fees and Admission
  fees VARCHAR(100),
  cutoff VARCHAR(255),
  average_gpa VARCHAR(10),
  average_sat INTEGER,
  
  -- Campus Information
  campus_size VARCHAR(50), -- Small, Medium, Large
  student_population INTEGER DEFAULT 0,
  
  -- Location (Map)
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  
  -- Media and Description
  image_url VARCHAR(500),
  description TEXT,
  highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  tuition VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  
  CONSTRAINT valid_type CHECK (type IN ('Government', 'Private', 'Deemed'))
);

CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);
CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(type);
CREATE INDEX IF NOT EXISTS idx_colleges_rating ON colleges(rating DESC);
CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges(location);

ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read colleges"
  ON colleges FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Admins can insert colleges"
  ON colleges FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Admins can update colleges"
  ON colleges FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Admins can delete colleges"
  ON colleges FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 3. SAVED COLLEGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_colleges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  college_id TEXT NOT NULL,
  college_name TEXT,
  college_location TEXT,
  college_type TEXT,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, college_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_colleges_user_id ON saved_colleges(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_colleges_college_id ON saved_colleges(college_id);

ALTER TABLE saved_colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can read their own saved colleges" ON saved_colleges
  FOR SELECT
  USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Users can save colleges" ON saved_colleges
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can remove saved colleges" ON saved_colleges
  FOR DELETE
  USING (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their saved colleges" ON saved_colleges
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- ============================================================================
-- 4. USER ACTIVITY TRACKING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  event_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_page_path ON user_activity(page_path);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_session_id ON user_activity(session_id);

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own activity" ON user_activity
  FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'anonymous');

CREATE POLICY IF NOT EXISTS "Anyone can insert activity" ON user_activity
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admins can delete activity" ON user_activity
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 5. LEARNING PROCESSES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),
  icon_type VARCHAR(100),
  benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
  duration VARCHAR(100),
  difficulty VARCHAR(50),
  success_rate NUMERIC(5,2),
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_learning_processes_name ON learning_processes(name);
CREATE INDEX IF NOT EXISTS idx_learning_processes_category ON learning_processes(category);
CREATE INDEX IF NOT EXISTS idx_learning_processes_active ON learning_processes(is_active);

ALTER TABLE learning_processes ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read learning processes"
  ON learning_processes FOR SELECT
  USING (true);

-- ============================================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================================

-- Print confirmation
SELECT 'All tables created successfully!' as status;
