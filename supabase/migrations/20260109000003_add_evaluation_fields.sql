-- Add evaluation fields to applications table
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS is_evaluated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS evaluation_score DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS evaluation_feedback TEXT,
ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMP WITH TIME ZONE;

-- Create index for filtering evaluated applications
CREATE INDEX IF NOT EXISTS idx_applications_is_evaluated ON public.applications(is_evaluated);

-- Update the status check constraint to ensure evaluated applications are properly handled
-- (existing constraint already allows rejected status)
