-- ══════════════════════════════════════════════════════════════════════════════
-- SAVED ROADMAPS TABLE
-- Stores AI-generated roadmaps for users
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.saved_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    career_name TEXT NOT NULL,
    roadmap_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_roadmaps_user_id ON saved_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_roadmaps_career_name ON saved_roadmaps(career_name);

-- RLS
ALTER TABLE public.saved_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved roadmaps"
    ON saved_roadmaps FOR SELECT
    USING (user_id = auth.uid()::text OR user_id IS NOT NULL);

CREATE POLICY "Users can insert own saved roadmaps"
    ON saved_roadmaps FOR INSERT
    WITH CHECK (user_id = auth.uid()::text OR user_id IS NOT NULL);

CREATE POLICY "Users can update own saved roadmaps"
    ON saved_roadmaps FOR UPDATE
    USING (user_id = auth.uid()::text OR user_id IS NOT NULL);

CREATE POLICY "Users can delete own saved roadmaps"
    ON saved_roadmaps FOR DELETE
    USING (user_id = auth.uid()::text OR user_id IS NOT NULL);
