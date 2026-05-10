-- ══════════════════════════════════════════════════════════════════════════════
-- FIX: Simplified RLS Policies for Firebase Auth
-- This replaces the complex JWT policies with simpler ones
-- ══════════════════════════════════════════════════════════════════════════════

-- Fix career_results table RLS policies
ALTER TABLE public.career_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own career results" ON public.career_results;
DROP POLICY IF EXISTS "Users can create own career results" ON public.career_results;
DROP POLICY IF EXISTS "Users can update own career results" ON public.career_results;

-- Simple RLS policies that allow all authenticated users
CREATE POLICY "Enable read for authenticated users"
  ON public.career_results FOR SELECT
  USING (auth.role() = 'authenticated_user');

CREATE POLICY "Enable insert for authenticated users"
  ON public.career_results FOR INSERT
  WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Enable update for authenticated users"
  ON public.career_results FOR UPDATE
  USING (auth.role() = 'authenticated_user');

CREATE POLICY "Enable delete for authenticated users"
  ON public.career_results FOR DELETE
  USING (auth.role() = 'authenticated_user');

-- Fix career_predictions table RLS policies
ALTER TABLE public.career_predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own career predictions" ON public.career_predictions;
DROP POLICY IF EXISTS "Users can create own career predictions" ON public.career_predictions;
DROP POLICY IF EXISTS "Users can update own career predictions" ON public.career_predictions;

-- Simple RLS policies that allow all authenticated users
CREATE POLICY "Enable read for authenticated users"
  ON public.career_predictions FOR SELECT
  USING (auth.role() = 'authenticated_user');

CREATE POLICY "Enable insert for authenticated users"
  ON public.career_predictions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Enable update for authenticated users"
  ON public.career_predictions FOR UPDATE
  USING (auth.role() = 'authenticated_user');

CREATE POLICY "Enable delete for authenticated users"
  ON public.career_predictions FOR DELETE
  USING (auth.role() = 'authenticated_user');

-- Verify tables and columns
SELECT table_name, column_name, data_type FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('career_results', 'career_predictions')
ORDER BY table_name, ordinal_position;
