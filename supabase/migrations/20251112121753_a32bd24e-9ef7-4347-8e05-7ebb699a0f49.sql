-- Drop trigger first, then function, then recreate with proper security
DROP TRIGGER IF EXISTS update_tax_calculations_updated_at ON public.tax_calculations;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_tax_calculations_updated_at
BEFORE UPDATE ON public.tax_calculations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();