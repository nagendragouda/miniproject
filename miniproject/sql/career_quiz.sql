-- ══════════════════════════════════════════════════════════════════════════════
-- Career Quiz Responses Table
-- Run this in your Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS career_quiz_responses (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid    TEXT        NOT NULL,

  -- 10 quiz answers stored as A / B / C / D
  q1              CHAR(1),   -- Problem Solving Style
  q2              CHAR(1),   -- Work Preference
  q3              CHAR(1),   -- Technology Comfort
  q4              CHAR(1),   -- Decision Making
  q5              CHAR(1),   -- Career Motivation
  q6              CHAR(1),   -- Learning Style
  q7              CHAR(1),   -- Work Environment
  q8              CHAR(1),   -- Risk Handling
  q9              CHAR(1),   -- Task Preference
  q10             CHAR(1),   -- Long-term Vision

  -- Computed personality type from the answers
  personality_type TEXT,     -- 'Analytical' | 'Creative' | 'Social' | 'Entrepreneurial'

  -- Counts per personality bucket
  score_analytical    INT DEFAULT 0,
  score_creative      INT DEFAULT 0,
  score_social        INT DEFAULT 0,
  score_entrepreneurial INT DEFAULT 0,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  -- One response per user (latest wins via upsert)
  CONSTRAINT career_quiz_responses_firebase_uid_key UNIQUE (firebase_uid)
);

-- Enable Row Level Security
ALTER TABLE career_quiz_responses ENABLE ROW LEVEL SECURITY;

-- Policy: users can read/write their own responses
CREATE POLICY "Users can manage own quiz responses"
  ON career_quiz_responses
  FOR ALL
  USING  (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Allow all for anonymous (adjust if you have auth set up differently)
CREATE POLICY "Allow all operations on career_quiz_responses"
  ON career_quiz_responses FOR ALL USING (true) WITH CHECK (true);
