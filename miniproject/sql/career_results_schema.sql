-- ══════════════════════════════════════════════════════════════════════════════
-- CAREER RESULTS & PREDICTIONS TABLES
-- Stores career predictions, analysis, and personalized recommendations
-- ══════════════════════════════════════════════════════════════════════════════

-- ═════════════════════════════════════════════════════════════════════════════
-- 1. CAREER RESULTS TABLE (Main result per user)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS career_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL,
  
  -- Quiz & Analysis Info
  personality_type TEXT NOT NULL, -- 'Analytical' | 'Creative' | 'Social' | 'Entrepreneurial'
  quiz_id UUID, -- Reference to career_quiz_responses
  
  -- Result Metadata
  total_careers_analyzed INT DEFAULT 0,
  top_match_score INT, -- Highest match score from all predictions
  analysis_date TIMESTAMP DEFAULT NOW(),
  
  -- User Preferences from Quiz
  stream_preference TEXT, -- Stream basis (if any)
  learning_style TEXT,
  work_style TEXT,
  
  -- General Notes
  summary_notes TEXT,
  is_reviewed BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT career_results_firebase_uid_fkey UNIQUE (firebase_uid, analysis_date)
);

CREATE INDEX IF NOT EXISTS idx_career_results_firebase_uid ON career_results(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_career_results_personality ON career_results(personality_type);
CREATE INDEX IF NOT EXISTS idx_career_results_created_at ON career_results(created_at DESC);

-- ═════════════════════════════════════════════════════════════════════════════
-- 2. CAREER PREDICTIONS TABLE (Individual career recommendations)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS career_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id UUID NOT NULL REFERENCES career_results(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL,
  
  -- Career Info
  rank INT NOT NULL, -- 1st, 2nd, 3rd recommendation
  career_name TEXT NOT NULL,
  alternate_names TEXT[] DEFAULT ARRAY[]::TEXT[], -- Other names for same career
  based_on_stream TEXT, -- If from specific stream
  
  -- Scoring
  match_score INT NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  personality_alignment_score INT DEFAULT 0,
  
  -- Overview & Description
  overview TEXT, -- Logical reason for recommendation
  personality_fit TEXT, -- How it matches their personality
  career_summary TEXT, -- Detailed career description
  
  -- Education Path
  suggested_subjects TEXT[] DEFAULT ARRAY[]::TEXT[],
  suggested_courses TEXT[] DEFAULT ARRAY[]::TEXT[],
  course_duration VARCHAR(100),
  entry_qualifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Skills & Development
  required_skills TEXT[] DEFAULT ARRAY[]::TEXT[], -- Core skills needed
  soft_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  technical_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Skill Gap
  current_skills TEXT[] DEFAULT ARRAY[]::TEXT[], -- User's existing skills
  missing_skills TEXT[] DEFAULT ARRAY[]::TEXT[], -- Skills to develop
  improvement_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Tools & Technologies
  tools_and_technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
  programming_languages TEXT[] DEFAULT ARRAY[]::TEXT[],
  frameworks_libraries TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Career Development
  recommended_projects TEXT[] DEFAULT ARRAY[]::TEXT[],
  learning_resources TEXT[] DEFAULT ARRAY[]::TEXT[],
  common_mistakes_to_avoid TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Salary Information (India-based)
  salary_entry_level VARCHAR(100), -- e.g., "₹5-10 LPA"
  salary_mid_level VARCHAR(100),   -- e.g., "₹15-30 LPA"
  salary_senior_level VARCHAR(100), -- e.g., "₹50-100+ LPA"
  salary_currency VARCHAR(10) DEFAULT 'INR',
  
  -- Market Dynamics
  current_demand VARCHAR(100), -- "High", "Medium", "Low"
  growth_rate VARCHAR(100), -- e.g., "5-8% annually"
  future_scope TEXT,
  
  -- Risk Assessment
  automation_risk VARCHAR(100), -- "Low", "Moderate", "High"
  competition_level VARCHAR(100), -- "Low", "Moderate", "High"
  risk_analysis_notes TEXT,
  
  -- Action Plan
  step_1_description TEXT, -- Step 1 of educational roadmap
  step_2_description TEXT, -- Step 2 of educational roadmap
  beginner_phase TEXT[] DEFAULT ARRAY[]::TEXT[],
  intermediate_phase TEXT[] DEFAULT ARRAY[]::TEXT[],
  advanced_phase TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Short-term Goals (Next 30 Days)
  goals_next_30_days TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Mid-term Goals (3-6 months)
  goals_3_6_months TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Long-term Goals (1 year+)
  goals_long_term TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Learning Resources & Videos
  website_guide_url TEXT,
  related_videos TEXT[] DEFAULT ARRAY[]::TEXT[], -- JSON array of video objects
  
  -- Additional Info
  is_saved_by_user BOOLEAN DEFAULT FALSE,
  user_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_predictions_result_id ON career_predictions(result_id);
CREATE INDEX IF NOT EXISTS idx_career_predictions_firebase_uid ON career_predictions(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_career_predictions_rank ON career_predictions(rank);
CREATE INDEX IF NOT EXISTS idx_career_predictions_match_score ON career_predictions(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_career_predictions_career_name ON career_predictions(career_name);

-- ═════════════════════════════════════════════════════════════════════════════
-- 3. ROW LEVEL SECURITY POLICIES
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE career_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_predictions ENABLE ROW LEVEL SECURITY;

-- Career Results Policies
CREATE POLICY "Users can read own career results"
  ON career_results FOR SELECT
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub' OR firebase_uid IS NOT NULL);

CREATE POLICY "Users can create own career results"
  ON career_results FOR INSERT
  WITH CHECK (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own career results"
  ON career_results FOR UPDATE
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Career Predictions Policies
CREATE POLICY "Users can read own career predictions"
  ON career_predictions FOR SELECT
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub' OR firebase_uid IS NOT NULL);

CREATE POLICY "Users can create own career predictions"
  ON career_predictions FOR INSERT
  WITH CHECK (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own career predictions"
  ON career_predictions FOR UPDATE
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- ═════════════════════════════════════════════════════════════════════════════
-- 4. AUTO-UPDATE TIMESTAMPS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_career_results_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_career_predictions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_career_results_update ON career_results;
CREATE TRIGGER trg_career_results_update
  BEFORE UPDATE ON career_results
  FOR EACH ROW EXECUTE FUNCTION update_career_results_timestamp();

DROP TRIGGER IF EXISTS trg_career_predictions_update ON career_predictions;
CREATE TRIGGER trg_career_predictions_update
  BEFORE UPDATE ON career_predictions
  FOR EACH ROW EXECUTE FUNCTION update_career_predictions_timestamp();

-- ══════════════════════════════════════════════════════════════════════════════
-- SCHEMA CREATION COMPLETE
-- ══════════════════════════════════════════════════════════════════════════════
