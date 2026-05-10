CREATE TABLE IF NOT EXISTS public.saved_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Firebase UID
    resource_id VARCHAR(255) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    instructor VARCHAR(255),
    access_url TEXT NOT NULL,
    difficulty VARCHAR(50),
    duration VARCHAR(100),
    is_paid BOOLEAN DEFAULT false,
    description TEXT,
    topics JSONB,
    learning_process JSONB,
    learners_count VARCHAR(50),
    accuracy_score INTEGER,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    UNIQUE(user_id, course_title)
);
