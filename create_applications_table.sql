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

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on applications
DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance on applications
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_bits_id ON public.applications(bits_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
