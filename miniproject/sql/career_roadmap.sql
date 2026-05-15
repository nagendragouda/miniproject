-- ══════════════════════════════════════════════════════════════════════════════
-- Career Roadmap Storage Vault
-- Run this in your Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

-- Drop existing table if it exists (safe re-run)
DROP TABLE IF EXISTS saved_roadmaps;

-- ─────────────────────────────────────────────────────────────────────────────
-- Main Table: saved_roadmaps
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_roadmaps (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         TEXT        NOT NULL,                    -- Firebase UID (TEXT for compatibility)
  career_name     TEXT        NOT NULL,                    -- Target career (e.g., "AI Engineer")
  roadmap_data    JSONB       NOT NULL,                    -- Full roadmap JSON from AI
  source          TEXT        DEFAULT 'dual-ai-race',      -- Which AI engine generated it
  stage_count     INTEGER     GENERATED ALWAYS AS (
                    jsonb_array_length(roadmap_data->'roadmap')
                  ) STORED,                                -- Auto-calculated number of stages
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Enable Row Level Security (RLS)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE saved_roadmaps ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- Policies: Open access (matches Firebase auth pattern used in this project)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Allow all operations on saved_roadmaps"
  ON saved_roadmaps FOR ALL
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes for Performance
-- ─────────────────────────────────────────────────────────────────────────────

-- Fast lookup by user
CREATE INDEX IF NOT EXISTS idx_saved_roadmaps_user_id
  ON saved_roadmaps(user_id);

-- Fast lookup by user + career (most common query)
CREATE INDEX IF NOT EXISTS idx_saved_roadmaps_user_career
  ON saved_roadmaps(user_id, career_name);

-- Time-sorted queries (dashboard view)
CREATE INDEX IF NOT EXISTS idx_saved_roadmaps_created_at
  ON saved_roadmaps(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- Auto-update updated_at timestamp on row changes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_saved_roadmaps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_saved_roadmaps_updated_at
  BEFORE UPDATE ON saved_roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_roadmaps_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification Query (Run this after to confirm the table was created)
-- ─────────────────────────────────────────────────────────────────────────────
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'saved_roadmaps'
ORDER BY ordinal_position;
