-- Add UPDATE policy for applications table to allow admin actions to persist
CREATE POLICY "Allow updating application status and reviews" 
ON public.applications 
FOR UPDATE 
USING (true)
WITH CHECK (true);