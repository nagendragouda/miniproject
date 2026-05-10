-- ══════════════════════════════════════════════════════════════════════════════
-- MIGRATION: Add Career Results & Predictions Tables
-- Creates the tables and columns needed to store career prediction results
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. CREATE CAREER_RESULTS TABLE (if not exists)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.career_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL,
  personality_type TEXT,
  quiz_id UUID,
  total_careers_analyzed INT DEFAULT 0,
  top_match_score INT,
  stream_preference TEXT,
  learning_style TEXT,
  work_style TEXT,
  summary_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_results_firebase_uid 
  ON public.career_results(firebase_uid);

-- Enable RLS on career_results table
ALTER TABLE public.career_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for career_results if they exist
DROP POLICY IF EXISTS "Users can read own career results" ON public.career_results;
DROP POLICY IF EXISTS "Users can create own career results" ON public.career_results;
DROP POLICY IF EXISTS "Users can update own career results" ON public.career_results;

-- Create RLS Policies for career_results
CREATE POLICY "Users can read own career results"
  ON public.career_results FOR SELECT
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub' OR firebase_uid IS NOT NULL);

CREATE POLICY "Users can create own career results"
  ON public.career_results FOR INSERT
  WITH CHECK (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own career results"
  ON public.career_results FOR UPDATE
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- 2. CREATE CAREER_PREDICTIONS TABLE (if not exists)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.career_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id UUID REFERENCES public.career_results(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL,
  career_name TEXT NOT NULL,
  rank INT,
  match_score INT,
  analysis_data JSONB,
  is_saved_by_user BOOLEAN DEFAULT FALSE,
  user_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ADD MISSING COLUMNS TO career_predictions (if they don't exist)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.career_predictions
ADD COLUMN IF NOT EXISTS result_id UUID REFERENCES public.career_results(id) ON DELETE CASCADE;

ALTER TABLE public.career_predictions
ADD COLUMN IF NOT EXISTS rank INT;

ALTER TABLE public.career_predictions
ADD COLUMN IF NOT EXISTS is_saved_by_user BOOLEAN DEFAULT FALSE;

ALTER TABLE public.career_predictions
ADD COLUMN IF NOT EXISTS user_notes TEXT;

ALTER TABLE public.career_predictions
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. CREATE INDEXES FOR PERFORMANCE
-- ══════════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_career_predictions_firebase_uid 
  ON public.career_predictions(firebase_uid);

CREATE INDEX IF NOT EXISTS idx_career_predictions_result_id 
  ON public.career_predictions(result_id);

CREATE INDEX IF NOT EXISTS idx_career_predictions_created_at 
  ON public.career_predictions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_career_predictions_is_saved 
  ON public.career_predictions(is_saved_by_user);

-- Enable Row Level Security
ALTER TABLE public.career_predictions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own career predictions" ON public.career_predictions;
DROP POLICY IF EXISTS "Users can create own career predictions" ON public.career_predictions;
DROP POLICY IF EXISTS "Users can update own career predictions" ON public.career_predictions;

-- Create RLS Policies
CREATE POLICY "Users can read own career predictions"
  ON public.career_predictions FOR SELECT
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub' OR firebase_uid IS NOT NULL);

CREATE POLICY "Users can create own career predictions"
  ON public.career_predictions FOR INSERT
  WITH CHECK (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own career predictions"
  ON public.career_predictions FOR UPDATE
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Auto-update updated_at timestamp
DROP TRIGGER IF EXISTS trg_career_predictions_update ON public.career_predictions;

CREATE OR REPLACE FUNCTION update_career_predictions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_career_predictions_update
  BEFORE UPDATE ON public.career_predictions
  FOR EACH ROW EXECUTE FUNCTION update_career_predictions_timestamp();

-- Verify table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'career_predictions' AND table_schema = 'public' 
ORDER BY ordinal_position;
