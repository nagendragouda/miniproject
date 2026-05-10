-- Table for saving learning resources (courses, videos, etc.)
CREATE TABLE IF NOT EXISTS public.saved_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Firebase UID
    resource_id TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT,
    author TEXT,
    link TEXT,
    rating NUMERIC(3,1),
    duration TEXT,
    difficulty TEXT,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, resource_id)
);

-- Enable RLS
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own saved resources"
    ON public.saved_resources FOR SELECT
    USING (user_id = auth.uid()::text OR user_id IS NOT NULL);

CREATE POLICY "Users can save resources"
    ON public.saved_resources FOR INSERT
    WITH CHECK (user_id = auth.uid()::text OR user_id IS NOT NULL);

CREATE POLICY "Users can delete their own saved resources"
    ON public.saved_resources FOR DELETE
    USING (user_id = auth.uid()::text OR user_id IS NOT NULL);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_saved_resources_user_id ON public.saved_resources(user_id);
