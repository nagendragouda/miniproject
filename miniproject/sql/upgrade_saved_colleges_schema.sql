-- Add missing columns to saved_colleges table to support full persistence of AI synthesized discoveries
ALTER TABLE IF EXISTS saved_colleges 
ADD COLUMN IF NOT EXISTS college_rating NUMERIC DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS college_fees TEXT DEFAULT 'N/A',
ADD COLUMN IF NOT EXISTS college_established NUMERIC DEFAULT 1990,
ADD COLUMN IF NOT EXISTS college_website TEXT DEFAULT '#',
ADD COLUMN IF NOT EXISTS college_description TEXT DEFAULT 'Personalized Synthesis Discovery';

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_saved_colleges_user_id ON saved_colleges(user_id);
