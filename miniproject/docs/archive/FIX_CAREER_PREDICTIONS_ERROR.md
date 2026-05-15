# Fix Career Predictions Save Error

## Problem
When saving career predictions, you get error:
```
"Could not find the 'is_saved_by_user' column of 'career_predictions' in the schema cache"
```

## Solution - Run This SQL in Supabase

1. Go to [Supabase Dashboard](https://supabase.com)
2. Open your project
3. Go to **SQL Editor**
4. Create a new query
5. Copy and paste the SQL from: `sql/add_career_predictions_columns.sql`
6. Click **Run**

## What This Does
✅ Creates `career_results` table (if missing)
✅ Creates `career_predictions` table (if missing)
✅ Adds missing columns:
   - `result_id` - Links to career_results
   - `rank` - Position in results (1st, 2nd, 3rd)
   - `is_saved_by_user` - Boolean for saved status
   - `user_notes` - User's notes about career
   - `updated_at` - Auto-updated timestamp

✅ Creates indexes for performance
✅ Sets up Row Level Security (RLS) policies
✅ Auto-updates timestamps

## After Running SQL
- Career predictions will save successfully ✅
- Saved careers appear in Dashboard ✅
- All data is properly stored and retrieved ✅

## File Location
- SQL Migration: `sql/add_career_predictions_columns.sql`
- Career Result Page: `app/career-result/page.tsx`
- Dashboard: `components/Dashboard.tsx`
