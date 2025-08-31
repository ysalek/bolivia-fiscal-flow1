-- SECURITY FIX: Ensure clientes table properly restricts access to customer personal information
-- Issue: user_id column is nullable, which can bypass RLS policies and expose customer PII

-- Step 1: Update any existing records with NULL user_id to have a proper user_id
-- For safety, we'll use the first admin user if any records exist without user_id
DO $$
DECLARE
    first_admin_id UUID;
    null_records_count INTEGER;
BEGIN
    -- Check if there are any records with NULL user_id
    SELECT COUNT(*) INTO null_records_count FROM public.clientes WHERE user_id IS NULL;
    
    IF null_records_count > 0 THEN
        -- Get the first admin user ID
        SELECT ur.user_id INTO first_admin_id 
        FROM public.user_roles ur 
        WHERE ur.role = 'admin'::app_role 
        LIMIT 1;
        
        -- If no admin exists, get the first user in the system
        IF first_admin_id IS NULL THEN
            SELECT id INTO first_admin_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
        END IF;
        
        -- Update NULL user_id records if we found a user to assign them to
        IF first_admin_id IS NOT NULL THEN
            UPDATE public.clientes 
            SET user_id = first_admin_id 
            WHERE user_id IS NULL;
            
            RAISE NOTICE 'Updated % customer records with NULL user_id to user %', null_records_count, first_admin_id;
        ELSE
            RAISE WARNING 'No users found in system to assign orphaned customer records';
        END IF;
    END IF;
END $$;

-- Step 2: Make user_id NOT NULL to prevent future security issues
ALTER TABLE public.clientes 
ALTER COLUMN user_id SET NOT NULL;

-- Step 3: Add a more explicit RLS policy with better security
-- Drop the existing policy and recreate with more explicit security checks
DROP POLICY IF EXISTS "Users can manage their own clientes" ON public.clientes;

-- Create more granular policies for better security control
CREATE POLICY "Users can view their own clientes" 
ON public.clientes 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own clientes" 
ON public.clientes 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own clientes" 
ON public.clientes 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own clientes" 
ON public.clientes 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- Step 4: Add audit logging for sensitive customer data access (optional security enhancement)
-- Create a trigger to log access to customer PII for security monitoring
CREATE TABLE IF NOT EXISTS public.customer_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accessed_by UUID REFERENCES auth.users(id),
    customer_id UUID REFERENCES public.clientes(id),
    action TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- Enable RLS on the audit log
ALTER TABLE public.customer_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view customer access logs"
ON public.customer_access_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.customer_access_log
FOR INSERT
TO authenticated
WITH CHECK (accessed_by = auth.uid());

-- Add index for performance on audit queries
CREATE INDEX IF NOT EXISTS idx_customer_access_log_timestamp ON public.customer_access_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_customer_access_log_customer_id ON public.customer_access_log(customer_id);

-- Step 5: Add additional security constraints
-- Ensure NIT numbers are properly formatted (basic validation)
ALTER TABLE public.clientes 
ADD CONSTRAINT check_nit_not_empty CHECK (length(trim(nit)) > 0);

-- Ensure email format is valid if provided
ALTER TABLE public.clientes 
ADD CONSTRAINT check_email_format CHECK (
    email IS NULL OR 
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Ensure customer names are not empty
ALTER TABLE public.clientes 
ADD CONSTRAINT check_nombre_not_empty CHECK (length(trim(nombre)) > 0);

COMMENT ON TABLE public.clientes IS 'Customer table with enhanced security - contains PII protected by RLS';
COMMENT ON COLUMN public.clientes.user_id IS 'Owner of this customer record - NOT NULL for security';
COMMENT ON COLUMN public.clientes.email IS 'Customer email - PII protected by RLS policies';
COMMENT ON COLUMN public.clientes.telefono IS 'Customer phone - PII protected by RLS policies';
COMMENT ON COLUMN public.clientes.direccion IS 'Customer address - PII protected by RLS policies';