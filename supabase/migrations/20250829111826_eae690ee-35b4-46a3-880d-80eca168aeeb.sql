-- Add admin_review column back and modify status enum to include waitlisted
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS admin_review TEXT;

-- Update the status column to allow waitlisted status (first need to check if we can modify)
-- Since we can't modify enum directly with existing data, we'll handle this with constraints
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE public.applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'waitlisted'));