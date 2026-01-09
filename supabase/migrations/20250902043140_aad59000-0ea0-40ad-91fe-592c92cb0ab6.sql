-- Create admin user profiles table to store admin information
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for admin profiles
CREATE POLICY "Admins can view their own profile" 
ON public.admin_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update their own profile" 
ON public.admin_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for timestamps
CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();