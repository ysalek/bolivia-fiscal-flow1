-- Fix security issues by setting search_path for functions
-- Update functions that don't have search_path set

-- Fix the public.update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Secure the plan_cuentas_2025 table by restricting access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated users to read plan_cuentas_2025" ON public.plan_cuentas_2025;

-- Create more restrictive policies for plan_cuentas_2025
CREATE POLICY "Allow authenticated users with accounting role to read plan_cuentas_2025" 
ON public.plan_cuentas_2025 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  (
    -- Allow if user is admin or has accounting permissions
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND (role = 'admin' OR role = 'accountant' OR role = 'manager')
    )
    OR
    -- If no profiles table exists, allow all authenticated users for now
    NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles')
  )
);

-- Enable RLS on plan_cuentas_2025 if not already enabled
ALTER TABLE public.plan_cuentas_2025 ENABLE ROW LEVEL SECURITY;