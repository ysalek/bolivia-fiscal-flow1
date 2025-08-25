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

-- Fix the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Drop the overly permissive policy for plan_cuentas_2025
DROP POLICY IF EXISTS "Todos pueden ver plan de cuentas" ON public.plan_cuentas_2025;

-- Create more restrictive policy for plan_cuentas_2025 based on roles
CREATE POLICY "Allow users with accounting access to read plan_cuentas_2025" 
ON public.plan_cuentas_2025 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'accountant'::app_role) OR
    has_role(auth.uid(), 'manager'::app_role)
  )
);