# ✅ EXECUTION CHECKLIST - Deploy Career Predictions Schema

## STEP 1: Open Supabase Dashboard
- [ ] Go to https://supabase.com
- [ ] Sign in to your account
- [ ] Select your project

## STEP 2: Navigate to SQL Editor
- [ ] In left sidebar, click **SQL Editor**
- [ ] Click **New Query** button
- [ ] Name it: "Add Career Predictions Tables"

## STEP 3: Copy & Paste Migration SQL
- [ ] Open file: `sql/add_career_predictions_columns.sql`
- [ ] Select ALL content (Ctrl+A)
- [ ] Copy (Ctrl+C)
- [ ] Paste into Supabase SQL Editor (Ctrl+V)

## STEP 4: Execute Migration
- [ ] Click **Run** button (or Ctrl+Enter)
- [ ] Wait for completion (should be quick)
- [ ] Look for green checkmark ✅

## STEP 5: Verify Success
Expected output at bottom:
```
column_name              | data_type
------------------------+---------------------
id                       | uuid
result_id                | uuid
firebase_uid             | text
career_name              | text
rank                     | integer
match_score              | integer
analysis_data            | jsonb
is_saved_by_user         | boolean
user_notes               | text
created_at               | timestamp with time zone
updated_at               | timestamp with time zone
(11 rows)
```

**If you see all 11 columns → ✅ SUCCESS!**

---

## STEP 6: Test Save Functionality

### In Your App:
1. Go to **Career Quiz** page
2. Complete the quiz
3. View **Career Results**
4. Click **SAVE** button on a prediction
5. Should see: ✅ "Career result saved to your dashboard!"

### If it works:
- ✅ Predictions save to database
- ✅ Saved careers appear in Dashboard
- ✅ All columns properly populated

---

## TROUBLESHOOTING

### Error: "Table already exists"
- This is normal! Migration uses `IF NOT EXISTS`
- No action needed, continue to next step

### Error: "Column already exists"
- This is normal! Migration uses `ADD COLUMN IF NOT EXISTS`
- No action needed, continue to next step

### Error: "RLS policy already exists"
- This is expected! Migration drops and recreates them
- No action needed

### Error: "relation 'career_predictions' does not exist"
- Run the migration again
- Make sure you're in correct Supabase project

### Save still not working after migration:
- Check browser console (F12) for error message
- Verify firebase_uid is being sent
- Check Supabase RLS policies are applied
- Contact support with error message

---

## ROLLBACK (if needed)

If something goes wrong, run:
```sql
DROP TABLE IF EXISTS public.career_predictions CASCADE;
DROP TABLE IF EXISTS public.career_results CASCADE;
```

Then re-run the full migration

---

## FILES MODIFIED
- ✅ `sql/add_career_predictions_columns.sql` - Main migration
- ✅ `app/career-result/page.tsx` - Already configured
- ✅ `components/Dashboard.tsx` - Ready to display
- ✅ Database schema - After running migration

## TIME TO COMPLETE
⏱️ **2-3 minutes** to run migration
⏱️ **30 seconds** to test

---

**Questions?** Check:
- [DATABASE_SCHEMA_READY.md](DATABASE_SCHEMA_READY.md) - Full schema details
- [FIX_CAREER_PREDICTIONS_ERROR.md](FIX_CAREER_PREDICTIONS_ERROR.md) - Problem explanation
- Career result page code: `app/career-result/page.tsx` lines 400-450
