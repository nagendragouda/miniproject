import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase environment variables in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function fixRLS() {
  console.log('Fixing RLS policies for career_predictions and career_results...')

  const sql = `
    -- Relax RLS for career_results
    DROP POLICY IF EXISTS "Users can read own career results" ON career_results;
    DROP POLICY IF EXISTS "Users can create own career results" ON career_results;
    DROP POLICY IF EXISTS "Users can update own career results" ON career_results;

    CREATE POLICY "Allow anonymous read results" ON career_results FOR SELECT USING (true);
    CREATE POLICY "Allow anonymous insert results" ON career_results FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow anonymous update results" ON career_results FOR UPDATE USING (true);

    -- Relax RLS for career_predictions
    DROP POLICY IF EXISTS "Users can read own career predictions" ON career_predictions;
    DROP POLICY IF EXISTS "Users can create own career predictions" ON career_predictions;
    DROP POLICY IF EXISTS "Users can update own career predictions" ON career_predictions;

    CREATE POLICY "Allow anonymous read predictions" ON career_predictions FOR SELECT USING (true);
    CREATE POLICY "Allow anonymous insert predictions" ON career_predictions FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow anonymous update predictions" ON career_predictions FOR UPDATE USING (true);
    
    -- Ensure columns exist (just in case)
    ALTER TABLE career_predictions ADD COLUMN IF NOT EXISTS analysis_data JSONB;
    ALTER TABLE career_predictions ALTER COLUMN result_id DROP NOT NULL;
    ALTER TABLE career_predictions ALTER COLUMN rank DROP NOT NULL;
  `

  // Supabase doesn't have a direct 'rpc' for arbitrary SQL unless a function is created.
  // Usually we'd run this in the dashboard.
  // Since I can't run arbitrary SQL via the client easily without a stored proc,
  // I will check if I can at least verify the table structure via RPC if any exists.
  
  console.log('NOTE: Since I cannot run raw SQL via the client without a pre-defined function,')
  console.log('please run the following SQL in your Supabase SQL Editor to fix the issue:')
  console.log('-------------------------------------------------------------------------')
  console.log(sql)
  console.log('-------------------------------------------------------------------------')
}

fixRLS()
