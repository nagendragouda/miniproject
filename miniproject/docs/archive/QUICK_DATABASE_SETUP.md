================================================================================
⚡ QUICK START - Database Setup in 5 Minutes
================================================================================

Your development server is running on http://localhost:3000 ✅

But we still need to create database tables. Here's the fastest way:


================================================================================
OPTION 1: AUTOMATIC SETUP (If your Supabase is properly configured)
================================================================================

Your project has a setup script! Run this:

cd miniproject
npm run setup:ai

This will help initialize your database configuration.


================================================================================
OPTION 2: MANUAL SETUP (5 minutes via Supabase Web UI) ⭐ RECOMMENDED
================================================================================

1. Open Supabase Dashboard:
   https://app.supabase.com

2. Select your FutureMatrix project

3. Click SQL Editor (left sidebar)

4. Click "New Query"

5. COPY THE ENTIRE CONTENT below and paste into the SQL editor:

---START COPY HERE---

-- Create user_details table
CREATE TABLE IF NOT EXISTS public.user_details (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  city VARCHAR(100),
  education_level VARCHAR(100) NOT NULL,
  course VARCHAR(255) NOT NULL,
  institution_name VARCHAR(255) NOT NULL,
  year_of_study VARCHAR(50) NOT NULL,
  skills JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_id ON public.user_details(user_id);

-- Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  state VARCHAR(100),
  city VARCHAR(100),
  type VARCHAR(50) NOT NULL,
  rating NUMERIC(3,1) DEFAULT 3.5,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);

-- Create saved_colleges table
CREATE TABLE IF NOT EXISTS saved_colleges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  college_id TEXT NOT NULL,
  college_name TEXT,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, college_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_colleges_user_id ON saved_colleges(user_id);

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  page_path TEXT NOT NULL,
  page_title TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);

---END COPY HERE---

6. Click the "Run" button (▶️ green button)

7. Wait for "Success!" message ✅

8. That's it! Your database is set up! 🎉


================================================================================
OPTION 3: If Supabase Has Different Credentials
================================================================================

Check your .env.local file for these values:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

If the URL or keys are different from your actual Supabase project,
update them and restart the dev server.


================================================================================
After Database Setup, Do This:
================================================================================

1. Refresh your browser: http://localhost:3000

2. Open DevTools (F12) and check the console for errors

3. Try navigating to different pages

4. You should see NO more "relation does not exist" errors ✅


================================================================================
What If You Still See Errors?
================================================================================

Check the file: DATABASE_SETUP_COMPLETE.md

It has complete troubleshooting steps and detailed SQL for each table.


================================================================================
⚡ Quick Health Check
================================================================================

To verify your database is working:

1. In Supabase SQL Editor, run:
   SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public';

2. You should see count: at least 4 (user_details, colleges, saved_colleges, user_activity)

3. If all 4+ tables show up, database setup is complete! ✅


================================================================================
Need Help?
================================================================================

Files to check:
- UNIVERSAL_FINAL_SCHEMA.sql - Full schema definition
- DATABASE_SETUP_COMPLETE.md - Detailed guide with troubleshooting

Questions? The setup files have all the answers!

Good luck! 🚀
