-- Remove anonymous access policies for better security
-- Users must be authenticated to save calculations

DROP POLICY IF EXISTS "Allow anonymous users to view their session calculations" ON public.tax_calculations;
DROP POLICY IF EXISTS "Allow anonymous users to insert session calculations" ON public.tax_calculations;

-- Note: Users can still use the calculator without logging in,
-- but they must create an account to save calculations
