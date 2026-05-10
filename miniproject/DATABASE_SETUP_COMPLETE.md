================================================================================
🚀 DATABASE SETUP GUIDE - Complete Solution
================================================================================

This guide will help you set up all required database tables in Supabase.

================================================================================
⚠️  IMPORTANT: Follow these steps in ORDER!
================================================================================


================================================================================
STEP 1: OPEN SUPABASE SQL EDITOR
================================================================================

1. Go to your Supabase Dashboard: https://app.supabase.com

2. Select your project (FutureMatrix or your project name)

3. Click on "SQL Editor" in the left sidebar

4. Click "New Query" to create a new SQL query


================================================================================
STEP 2: CREATE ALL TABLES AT ONCE
================================================================================

⭐ EASIEST METHOD: Copy & Paste Entire Schema

1. Open the file: UNIVERSAL_FINAL_SCHEMA.sql (in project root)

2. Copy the ENTIRE content of that file

3. Paste it into the Supabase SQL Editor

4. Click "Run" button

5. Wait for success message ✅

If it runs successfully, SKIP TO STEP 3!


================================================================================
STEP 2 (ALTERNATIVE): Create Tables Individually
================================================================================

If the full schema doesn't work, create tables one by one:

----- TABLE 1: USER DETAILS -----

Copy & paste this into SQL Editor and click Run:

```sql
CREATE TABLE IF NOT EXISTS public.user_details (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  profile_picture_url VARCHAR(500),
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
  activity_preference VARCHAR(100),
  work_style VARCHAR(100),
  desired_career_field VARCHAR(255),
  dream_job_role VARCHAR(255),
  expected_salary VARCHAR(100),
  work_preference VARCHAR(100),
  learning_method VARCHAR(100),
  weekly_time_availability VARCHAR(100),
  career_clarity VARCHAR(255),
  experience JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '[]'::jsonb,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_id ON public.user_details(user_id);
CREATE INDEX IF NOT EXISTS idx_username ON public.user_details(username);
```

----- TABLE 2: COLLEGES -----

```sql
CREATE TABLE IF NOT EXISTS colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  short_name VARCHAR(100),
  location VARCHAR(255) NOT NULL,
  state VARCHAR(100),
  city VARCHAR(100),
  type VARCHAR(50) NOT NULL,
  established INTEGER,
  website VARCHAR(255),
  is_public BOOLEAN DEFAULT FALSE,
  courses TEXT[] DEFAULT ARRAY[]::TEXT[],
  programs TEXT[] DEFAULT ARRAY[]::TEXT[],
  rating NUMERIC(3,1) DEFAULT 3.5 CHECK (rating >= 0 AND rating <= 5),
  ranking INTEGER DEFAULT 999,
  acceptance_rate NUMERIC(5,2),
  fees VARCHAR(100),
  cutoff VARCHAR(255),
  average_gpa VARCHAR(10),
  average_sat INTEGER,
  campus_size VARCHAR(50),
  student_population INTEGER DEFAULT 0,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  image_url VARCHAR(500),
  description TEXT,
  highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
  tuition VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  CONSTRAINT valid_type CHECK (type IN ('Government', 'Private', 'Deemed'))
);

CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);

ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read colleges" ON colleges
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can insert colleges" ON colleges
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Admins can update colleges" ON colleges
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Admins can delete colleges" ON colleges
  FOR DELETE USING (auth.role() = 'authenticated');
```

----- TABLE 3: SAVED COLLEGES -----

```sql
CREATE TABLE IF NOT EXISTS saved_colleges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  college_id TEXT NOT NULL,
  college_name TEXT,
  college_location TEXT,
  college_type TEXT,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, college_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_colleges_user_id ON saved_colleges(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_colleges_college_id ON saved_colleges(college_id);

ALTER TABLE saved_colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can read their own saved colleges" ON saved_colleges
  FOR SELECT USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Users can save colleges" ON saved_colleges
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can remove saved colleges" ON saved_colleges
  FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their saved colleges" ON saved_colleges
  FOR UPDATE USING (auth.uid()::text = user_id);
```

----- TABLE 4: USER ACTIVITY -----

```sql
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  event_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_page_path ON user_activity(page_path);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own activity" ON user_activity
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = 'anonymous');

CREATE POLICY IF NOT EXISTS "Anyone can insert activity" ON user_activity
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admins can delete activity" ON user_activity
  FOR DELETE USING (auth.role() = 'authenticated');
```


================================================================================
STEP 3: VERIFY TABLES WERE CREATED
================================================================================

Run this query in Supabase SQL Editor to verify all tables exist:

```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_details', 'colleges', 'saved_colleges', 'user_activity', 'learning_processes')
ORDER BY tablename;
```

You should see ✅ all 5 tables listed:
- colleges
- saved_colleges
- user_activity
- user_details
- learning_processes (if you created it)


================================================================================
STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
================================================================================

⚠️  CRITICAL: If you're getting permission errors:

1. Go to Supabase Dashboard → "Authentication" in left menu

2. Click "Policies" tab

3. For each table (user_details, colleges, saved_colleges, user_activity):
   - Make sure RLS is ENABLED (green toggle)
   - Policies should be set up as shown in the SQL above


================================================================================
STEP 5: TEST THE DATABASE CONNECTION
================================================================================

Option A: Using the Supabase Dashboard

1. In SQL Editor, run:
```sql
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'public';
```

Option B: Test from your Next.js app

1. Go to: http://localhost:3000

2. Open browser DevTools (F12) → Console tab

3. Look for any error messages about database connections


================================================================================
STEP 6: IF YOU STILL SEE ERRORS
================================================================================

Common Issues & Solutions:

❌ "relation 'user_activity' does not exist"
✅ Solution: Make sure you created the user_activity table (Step 2, Table 4)

❌ "relation 'saved_colleges' does not exist"
✅ Solution: Make sure you created the saved_colleges table (Step 2, Table 3)

❌ "relation 'colleges' does not exist"
✅ Solution: Make sure you created the colleges table (Step 2, Table 2)

❌ "permission denied" errors
✅ Solution: Check Row Level Security (RLS) policies in Step 4

❌ "Unsafe attempt to load URL" error
✅ Solution: Already fixed in next.config.js (security headers updated)


================================================================================
STEP 7: RESTART YOUR DEV SERVER
================================================================================

After database setup is complete:

1. Stop the dev server (Ctrl+C in terminal)

2. Run: npm run dev

3. Go to: http://localhost:3000

4. Check if all errors are gone ✅


================================================================================
REFERENCE: Your Database Credentials
================================================================================

If needed for direct connections:
- Supabase URL: https://app.supabase.com
- Project ID: Check your .env.local file (NEXT_PUBLIC_SUPABASE_URL)
- Service Role Key: Check your .env.local file (SUPABASE_SERVICE_ROLE_KEY)

⚠️  NEVER share these credentials publicly!


================================================================================
💡 TIPS FOR FUTURE DEVELOPMENT
================================================================================

1. Always enable RLS for security
2. Create proper indexes for frequently queried columns
3. Use UUID for public-facing IDs
4. Document schema changes with comments
5. Test database changes in development first


================================================================================
Need More Help?
================================================================================

Check these files for reference:
- sql/UNIVERSAL_FINAL_SCHEMA.sql - Complete schema
- sql/user_details_schema.sql - User details table
- sql/colleges_schema.sql - Colleges table
- sql/saved_colleges_table.sql - Saved colleges table
- sql/user_activity_schema.sql - Activity tracking table

Good luck! 🚀
