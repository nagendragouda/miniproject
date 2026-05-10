/**
 * SQL Setup Instructions for User Activity Tracking
 * 
 * RUN THIS SQL IN YOUR SUPABASE DATABASE to create the user_activity table:
 * 
 * Navigate to: Supabase Dashboard → SQL Editor → New Query
 * Paste the SQL below and click "Run"
 * 
 * ============================================================
 */

-- Create user_activity table for tracking page visits
CREATE TABLE IF NOT EXISTS public.user_activity (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  event_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for faster queries
  CONSTRAINT user_activity_user_id_idx UNIQUE (id) DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_page_path ON public.user_activity(page_path);
CREATE INDEX IF NOT EXISTS idx_user_activity_session_id ON public.user_activity(session_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_timestamp ON public.user_activity(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous inserts"
  ON public.user_activity
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to read their own activity
CREATE POLICY "Allow users to read their activity"
  ON public.user_activity
  FOR SELECT
  USING (
    auth.uid()::text = user_id 
    OR user_id = 'anonymous'
  );

-- Allow admin (if you have admin role) to read all
CREATE POLICY "Allow admin to read all activity"
  ON public.user_activity
  FOR SELECT
  USING (
    (SELECT COUNT(*) FROM public.users WHERE id = auth.uid() AND role = 'admin') > 0
  );

/*
 * Optional: Create a view for analytics
 */

CREATE OR REPLACE VIEW public.activity_analytics AS
SELECT
  DATE_TRUNC('day', created_at) as visit_date,
  page_path,
  COUNT(*) as total_visits,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions
FROM public.user_activity
GROUP BY DATE_TRUNC('day', created_at), page_path
ORDER BY visit_date DESC, total_visits DESC;

/*
 * Optional: Create a view for user summary
 */

CREATE OR REPLACE VIEW public.user_activity_summary AS
SELECT
  user_id,
  COUNT(*) as total_page_visits,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT page_path) as unique_pages_visited,
  MIN(created_at) as first_visit,
  MAX(created_at) as last_visit,
  ARRAY_AGG(DISTINCT page_path) as pages_visited
FROM public.user_activity
GROUP BY user_id;
