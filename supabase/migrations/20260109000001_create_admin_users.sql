/*
  # Create admin users table
  
  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `admin_users` table
    - Add policies for admin authentication
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin login (allow select for authentication)
CREATE POLICY "Allow public read for authentication" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Create or replace function for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (username: sofigoats, password: sofiinduction2)
-- Using a simple hash for demonstration - in production, use bcrypt or similar
-- For this demo, we'll use md5 which is not recommended for production
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('sofigoats', md5('sofiinduction2'))
ON CONFLICT (username) DO UPDATE 
SET password_hash = md5('sofiinduction2');
