/*
  # Add 'selected' status to applications table

  1. Changes
    - Update the status constraint to include 'selected' as a valid status
    - Ensure all status transitions work properly

  2. Security
    - No changes to existing RLS policies
    - Maintains existing security model
*/

-- Drop the existing constraint
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_status_check;

-- Add the new constraint with 'selected' included
ALTER TABLE public.applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'waitlisted', 'selected'));

-- Update any existing 'approved' records that should be 'selected' if needed
-- (This is optional and can be uncommented if you want to migrate existing data)
-- UPDATE public.applications 
-- SET status = 'selected' 
-- WHERE status = 'approved' AND reviewed_by IS NOT NULL;