-- Add approval status to applications table
ALTER TABLE public.applications 
ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add reviewed_at timestamp
ALTER TABLE public.applications 
ADD COLUMN reviewed_at timestamp with time zone NULL;

-- Add reviewed_by column to track who reviewed it
ALTER TABLE public.applications 
ADD COLUMN reviewed_by text NULL;