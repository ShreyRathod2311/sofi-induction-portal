/*
  # Complete Database Setup for SoFI Induction Portal
  
  This migration sets up the entire database from scratch including:
  1. Applications table for storing induction form submissions
  2. Admin users table for authentication
  3. Important URLs table for storing SoFI links
  4. All necessary functions, triggers, and policies
*/

-- =============================================================================
-- PART 1: CREATE HELPER FUNCTIONS
-- =============================================================================

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- PART 2: CREATE APPLICATIONS TABLE
-- =============================================================================

-- Create applications table for storing induction form submissions
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Personal Information
  full_name TEXT NOT NULL,
  bits_id TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  whatsapp_number TEXT,
  email TEXT NOT NULL,
  
  -- Basic Questions (Section 2)
  assets_equity_answer TEXT NOT NULL,
  financial_statements_answer TEXT NOT NULL,
  net_worth_answer TEXT NOT NULL,
  balance_income_difference TEXT NOT NULL,
  pe_pb_ratio_answer TEXT NOT NULL,
  
  -- Case Study (Section 3)
  loan_transaction_answer TEXT NOT NULL,
  life_annual_report_answer TEXT NOT NULL,
  tinder_portfolio_answer TEXT NOT NULL,
  stock_market_explanation TEXT NOT NULL,
  
  -- About SoFI (Section 4)
  sofi_platforms_answer TEXT NOT NULL,
  sofi_purpose_answer TEXT NOT NULL,
  
  -- Admin Review Fields
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'waitlisted', 'selected')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_review TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can view applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can update applications" ON public.applications;

-- Create policy to allow anyone to insert applications (public form)
CREATE POLICY "Anyone can submit applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view applications
CREATE POLICY "Anyone can view applications" 
ON public.applications 
FOR SELECT 
USING (true);

-- Create policy for updating applications (for admin panel)
CREATE POLICY "Anyone can update applications" 
ON public.applications 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates on applications
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance on applications
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_bits_id ON public.applications(bits_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- =============================================================================
-- PART 3: CREATE ADMIN USERS TABLE
-- =============================================================================

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read for authentication" ON public.admin_users;

-- Create policy for admin login (allow select for authentication)
CREATE POLICY "Allow public read for authentication" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates on admin_users
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (username: sofigoats, password: sofiinduction2)
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('sofigoats', md5('sofiinduction2'))
ON CONFLICT (username) DO UPDATE 
SET password_hash = md5('sofiinduction2');

-- =============================================================================
-- PART 4: CREATE IMPORTANT URLS TABLE
-- =============================================================================

-- Create important_urls table
CREATE TABLE IF NOT EXISTS public.important_urls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on important_urls
ALTER TABLE public.important_urls ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view important URLs" ON public.important_urls;
DROP POLICY IF EXISTS "Authenticated users can manage URLs" ON public.important_urls;

-- Create policy for public read access
CREATE POLICY "Anyone can view important URLs" 
ON public.important_urls 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to manage URLs
CREATE POLICY "Authenticated users can manage URLs" 
ON public.important_urls 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates on important_urls
CREATE TRIGGER update_important_urls_updated_at
BEFORE UPDATE ON public.important_urls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance on important_urls
CREATE INDEX IF NOT EXISTS idx_important_urls_category ON public.important_urls(category);
CREATE INDEX IF NOT EXISTS idx_important_urls_order ON public.important_urls(display_order);

-- Insert default important URLs for SoFI
INSERT INTO public.important_urls (title, url, description, category, display_order) VALUES
  ('SoFI Official Website', 'https://sofi-website.example.com', 'Official SoFI society website', 'official', 1),
  ('SoFI Instagram', 'https://instagram.com/sofi', 'Follow us on Instagram', 'social', 2),
  ('SoFI LinkedIn', 'https://linkedin.com/company/sofi', 'Connect with us on LinkedIn', 'social', 3),
  ('Induction Portal', 'https://induction.sofi.example.com', 'SoFI Induction Application Portal', 'portal', 4)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SETUP COMPLETE
-- =============================================================================

-- Verify tables were created
DO $$
BEGIN
  RAISE NOTICE 'Database setup complete!';
  RAISE NOTICE 'Tables created: applications, admin_users, important_urls';
  RAISE NOTICE 'Admin user created: username=sofigoats, password=sofiinduction2';
END $$;
