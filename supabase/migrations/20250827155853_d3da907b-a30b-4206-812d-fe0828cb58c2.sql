-- Create applications table for storing induction form submissions
CREATE TABLE public.applications (
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
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (since this is a public form)
CREATE POLICY "Anyone can submit applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view all applications (we'll use a simple approach for now)
CREATE POLICY "Anyone can view applications" 
ON public.applications 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX idx_applications_bits_id ON public.applications(bits_id);