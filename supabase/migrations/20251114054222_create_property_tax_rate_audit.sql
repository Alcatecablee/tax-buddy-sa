-- Create property_tax_rate_audit table for Phase 3
-- Tracks all changes to property tax rates for compliance and transparency
CREATE TABLE public.property_tax_rate_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_id UUID NOT NULL,
  
  -- Action details
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Changed data snapshot (JSONB for flexibility)
  old_values JSONB,
  new_values JSONB,
  
  -- Contextual information
  ip_address TEXT,
  user_agent TEXT,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.property_tax_rate_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.property_tax_rate_audit
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- System can insert audit logs (via triggers or service)
CREATE POLICY "System can insert audit logs"
ON public.property_tax_rate_audit
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_audit_rate_id ON public.property_tax_rate_audit(rate_id);
CREATE INDEX idx_audit_changed_by ON public.property_tax_rate_audit(changed_by);
CREATE INDEX idx_audit_changed_at ON public.property_tax_rate_audit(changed_at DESC);
CREATE INDEX idx_audit_action ON public.property_tax_rate_audit(action);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.log_property_tax_rate_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO public.property_tax_rate_audit (
      rate_id,
      action,
      changed_by,
      old_values
    ) VALUES (
      OLD.id,
      'DELETE',
      auth.uid(),
      to_jsonb(OLD)
    );
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.property_tax_rate_audit (
      rate_id,
      action,
      changed_by,
      old_values,
      new_values
    ) VALUES (
      NEW.id,
      'UPDATE',
      auth.uid(),
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.property_tax_rate_audit (
      rate_id,
      action,
      changed_by,
      new_values
    ) VALUES (
      NEW.id,
      'INSERT',
      auth.uid(),
      to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger on property_tax_rates table
CREATE TRIGGER property_tax_rates_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.property_tax_rates
FOR EACH ROW
EXECUTE FUNCTION public.log_property_tax_rate_change();

-- Add helpful comment
COMMENT ON TABLE public.property_tax_rate_audit IS 'Audit trail for all property tax rate changes, automatically populated via triggers';
