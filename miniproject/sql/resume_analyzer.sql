-- ══════════════════════════════════════════════════════════════════════════════
-- Resume Analysis Intelligence Vault (Corrected for Firebase Auth)
-- Run this in your Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS resume_analyses;

CREATE TABLE IF NOT EXISTS resume_analyses (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         TEXT        NOT NULL, -- Using TEXT for Firebase UID compatibility
  file_name       TEXT        NOT NULL,
  job_description TEXT,
  analysis_result JSONB       NOT NULL,
  score           INTEGER     NOT NULL,
  detected_role   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_id ON resume_analyses(user_id);

-- Policy: Allow all for testing (Tighten this later if needed)
CREATE POLICY "Allow all operations on resume_analyses"
  ON resume_analyses FOR ALL
  USING (true)
  WITH CHECK (true);

-- Alternative tight policy if you have custom JWT claims set up:
-- CREATE POLICY "Users can manage own analyses"
--   ON resume_analyses FOR ALL
--   USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
