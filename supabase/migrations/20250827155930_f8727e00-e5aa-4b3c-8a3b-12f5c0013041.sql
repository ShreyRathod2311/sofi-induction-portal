-- Fix the function search path security issue by recreating everything
DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Recreate function with proper security settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();