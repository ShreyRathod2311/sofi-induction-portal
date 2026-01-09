/*
  # Create important URLs table
  
  1. New Tables
    - `important_urls`
      - `id` (uuid, primary key)
      - `title` (text)
      - `url` (text)
      - `description` (text)
      - `category` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `important_urls` table
    - Add policies for public read access
*/

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

-- Enable Row Level Security
ALTER TABLE public.important_urls ENABLE ROW LEVEL SECURITY;

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

-- Create or replace function for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_important_urls_updated_at
BEFORE UPDATE ON public.important_urls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_important_urls_category ON public.important_urls(category);
CREATE INDEX idx_important_urls_order ON public.important_urls(display_order);

-- Insert some default important URLs for SoFI
INSERT INTO public.important_urls (title, url, description, category, display_order) VALUES
  ('SoFI Official Website', 'https://sofi-website.example.com', 'Official SoFI society website', 'official', 1),
  ('SoFI Instagram', 'https://instagram.com/sofi', 'Follow us on Instagram', 'social', 2),
  ('SoFI LinkedIn', 'https://linkedin.com/company/sofi', 'Connect with us on LinkedIn', 'social', 3),
  ('Induction Portal', 'https://induction.sofi.example.com', 'SoFI Induction Application Portal', 'portal', 4)
ON CONFLICT DO NOTHING;
