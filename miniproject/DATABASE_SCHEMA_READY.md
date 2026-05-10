# Career Predictions Database Schema - Final Structure

## Complete Migration Ready to Deploy

### Table 1: career_results
Stores metadata about each career analysis session

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| firebase_uid | TEXT | User identifier (Firebase) |
| personality_type | TEXT | User's personality type |
| quiz_id | UUID | Reference to quiz taken |
| total_careers_analyzed | INT | Number of careers analyzed |
| top_match_score | INT | Highest match percentage |
| stream_preference | TEXT | Academic stream preference |
| learning_style | TEXT | User's learning style |
| work_style | TEXT | User's work style preference |
| summary_notes | TEXT | Notes about results |
| created_at | TIMESTAMP | Auto-created timestamp |
| updated_at | TIMESTAMP | Auto-updated timestamp |

**Indexes:**
- idx_career_results_firebase_uid (for user queries)

**RLS Policies:**
- Users can read own results
- Users can create own results
- Users can update own results

---

### Table 2: career_predictions
Stores individual career predictions with analysis details

| Column | Type | Description | Status |
|--------|------|-------------|--------|
| id | UUID | Primary key | ✅ Existing |
| result_id | UUID | Links to career_results | ✨ ADDED |
| firebase_uid | TEXT | User identifier | ✅ Existing |
| career_name | TEXT | Name of career | ✅ Existing |
| rank | INT | Position in results (1,2,3...) | ✨ ADDED |
| match_score | INT | Match percentage | ✅ Existing |
| analysis_data | JSONB | Full analysis data | ✅ Existing |
| is_saved_by_user | BOOLEAN | Saved by user flag | ✨ ADDED |
| user_notes | TEXT | User's notes | ✨ ADDED |
| created_at | TIMESTAMP | Auto-created timestamp | ✅ Existing |
| updated_at | TIMESTAMP | Auto-updated timestamp | ✨ ADDED |

**Indexes:**
- idx_career_predictions_firebase_uid (for user queries)
- idx_career_predictions_result_id (for result lookups)
- idx_career_predictions_created_at (for sorting)
- idx_career_predictions_is_saved (for dashboard filters)

**RLS Policies:**
- Users can read own predictions
- Users can create own predictions
- Users can update own predictions

**Triggers:**
- Auto-update `updated_at` on modification

---

## Data Relationships

```
career_results (1)
    ↓ 1-to-many
career_predictions (many)
```

When a user completes a career analysis:
1. One `career_results` record created (metadata)
2. Multiple `career_predictions` records created (one per career option)
3. When user clicks SAVE, `is_saved_by_user` set to TRUE
4. Dashboard filters where `is_saved_by_user = TRUE`

---

## SQL Migration Status

✅ **READY TO DEPLOY**

File: `sql/add_career_predictions_columns.sql`

Contains:
- CREATE TABLE IF NOT EXISTS (idempotent)
- ALTER TABLE ADD COLUMN IF NOT EXISTS (safe for existing tables)
- CREATE INDEX IF NOT EXISTS (won't error if exists)
- ALTER TABLE ENABLE ROW LEVEL SECURITY
- CREATE POLICY statements
- CREATE TRIGGER for auto-timestamps
- SELECT query to verify structure

**Safe to run multiple times** - all commands are idempotent

---

## Application Integration

**Career Result Page** (`app/career-result/page.tsx`)
- ✅ Code already writes to all required columns
- ✅ Handles both new inserts and updates
- ✅ Uses result_id relationship
- ✅ Sets is_saved_by_user on save

**Dashboard** (`components/Dashboard.tsx`)
- ✅ Ready to query saved predictions
- ✅ Filters by is_saved_by_user = true
- ✅ Displays from career_predictions table

---

## Verification Query

After running migration, verify with:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'career_predictions' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

Should return 11 columns total (listed above)
