-- Create property_tax_rates table for Phase 2/3
-- Stores municipal property tax rates with full provenance tracking
CREATE TABLE public.property_tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality_code TEXT NOT NULL,
  financial_year TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'industrial', 'agricultural', 'vacant_land')),
  rate DECIMAL(10, 6) NOT NULL,
  rate_free_threshold DECIMAL(12, 2) DEFAULT 50000,
  
  -- Provenance tracking fields
  source TEXT NOT NULL DEFAULT 'manual_override' CHECK (source IN ('manual_override', 'validated_fallback', 'api')),
  source_url TEXT,
  last_validated DATE,
  validated_by TEXT,
  notes TEXT,
  effective_date DATE,
  expiry_date DATE,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Composite unique constraint
  UNIQUE(municipality_code, financial_year, category)
);

-- Enable RLS
ALTER TABLE public.property_tax_rates ENABLE ROW LEVEL SECURITY;

-- Public can read all rates
CREATE POLICY "Anyone can view property tax rates"
ON public.property_tax_rates
FOR SELECT
TO public
USING (true);

-- Only authenticated admins can insert rates
CREATE POLICY "Admins can insert property tax rates"
ON public.property_tax_rates
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Only authenticated admins can update rates
CREATE POLICY "Admins can update property tax rates"
ON public.property_tax_rates
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Only authenticated admins can delete rates
CREATE POLICY "Admins can delete property tax rates"
ON public.property_tax_rates
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Create indexes for faster queries
CREATE INDEX idx_property_tax_rates_municipality ON public.property_tax_rates(municipality_code);
CREATE INDEX idx_property_tax_rates_financial_year ON public.property_tax_rates(financial_year);
CREATE INDEX idx_property_tax_rates_lookup ON public.property_tax_rates(municipality_code, category, financial_year);
CREATE INDEX idx_property_tax_rates_created_at ON public.property_tax_rates(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_property_tax_rates_updated_at
BEFORE UPDATE ON public.property_tax_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add helpful comment
COMMENT ON TABLE public.property_tax_rates IS 'Municipal property tax rates with full provenance tracking for admin override management';
