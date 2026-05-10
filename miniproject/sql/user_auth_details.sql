-- Create the user_auth_details table in Supabase
CREATE TABLE IF NOT EXISTS public.user_auth_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL, -- Firebase UID
    email TEXT NOT NULL,
    display_name TEXT,
    photo_url TEXT,
    phone_number TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    provider_id TEXT, -- e.g., 'google.com', 'password'
    firebase_created_at TIMESTAMP WITH TIME ZONE,
    firebase_last_login TIMESTAMP WITH TIME ZONE,
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.user_auth_details ENABLE ROW LEVEL SECURITY;

-- Policies
-- Note: We use public policies here because we are syncing from Firebase, 
-- and the client-side Supabase key might not have high enough privileges if RLS is strict.
-- In a production environment, you should use a service role on the backend for this sync.

CREATE POLICY "Public read access for user_auth_details" 
ON public.user_auth_details FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for all users" 
ON public.user_auth_details FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for all users" 
ON public.user_auth_details FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_auth_details_user_id ON public.user_auth_details(user_id);
CREATE INDEX IF NOT EXISTS idx_user_auth_details_email ON public.user_auth_details(email);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_user_auth_details_updated_at ON public.user_auth_details;
CREATE TRIGGER update_user_auth_details_updated_at
    BEFORE UPDATE ON public.user_auth_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
