-- Create table for storing tax calculations
CREATE TABLE public.tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_year TEXT NOT NULL,
  
  -- Personal info
  age_category TEXT NOT NULL CHECK (age_category IN ('under_65', '65_to_74', '75_plus')),
  
  -- Income sources
  salary_income DECIMAL(12, 2) DEFAULT 0,
  freelance_income DECIMAL(12, 2) DEFAULT 0,
  rental_income DECIMAL(12, 2) DEFAULT 0,
  investment_income DECIMAL(12, 2) DEFAULT 0,
  
  -- Deductions
  retirement_contributions DECIMAL(12, 2) DEFAULT 0,
  medical_aid_contributions DECIMAL(12, 2) DEFAULT 0,
  medical_expenses DECIMAL(12, 2) DEFAULT 0,
  charitable_donations DECIMAL(12, 2) DEFAULT 0,
  
  -- Tax already paid
  paye_paid DECIMAL(12, 2) DEFAULT 0,
  provisional_tax_paid DECIMAL(12, 2) DEFAULT 0,
  
  -- Calculated results
  total_income DECIMAL(12, 2),
  taxable_income DECIMAL(12, 2),
  total_tax_owed DECIMAL(12, 2),
  total_tax_paid DECIMAL(12, 2),
  refund_amount DECIMAL(12, 2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;

-- Users can view their own calculations
CREATE POLICY "Users can view their own calculations"
ON public.tax_calculations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own calculations
CREATE POLICY "Users can insert their own calculations"
ON public.tax_calculations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own calculations
CREATE POLICY "Users can update their own calculations"
ON public.tax_calculations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own calculations
CREATE POLICY "Users can delete their own calculations"
ON public.tax_calculations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow anonymous users to use the calculator (without saving)
CREATE POLICY "Allow anonymous users to view their session calculations"
ON public.tax_calculations
FOR SELECT
TO anon
USING (user_id IS NULL);

CREATE POLICY "Allow anonymous users to insert session calculations"
ON public.tax_calculations
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Create index for faster queries
CREATE INDEX idx_tax_calculations_user_id ON public.tax_calculations(user_id);
CREATE INDEX idx_tax_calculations_created_at ON public.tax_calculations(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tax_calculations_updated_at
BEFORE UPDATE ON public.tax_calculations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();