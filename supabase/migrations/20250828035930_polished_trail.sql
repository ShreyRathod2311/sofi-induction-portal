/*
  # Add review column to applications table

  1. Changes
    - Add `admin_review` column to store admin reviews about applicants
    - Column allows NULL values (optional review)
    - Text type to store detailed review comments

  2. Security
    - No changes to existing RLS policies
    - Review column can be updated by admins through the existing policies
*/

-- Add admin review column to applications table
ALTER TABLE public.applications 
ADD COLUMN admin_review TEXT NULL;

-- Add index for better performance when filtering by reviewed applications
CREATE INDEX idx_applications_admin_review ON public.applications(admin_review) WHERE admin_review IS NOT NULL;