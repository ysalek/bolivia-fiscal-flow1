-- Fix critical security vulnerability in subscribers table
-- Replace the overly permissive update policy with a properly restricted one

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create a new secure update policy that only allows users to update their own subscription
CREATE POLICY "users_can_update_own_subscription" ON public.subscribers
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR email = auth.email())
WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Also ensure the insert policy is properly named and secure
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create a secure insert policy that only allows users to create their own subscription records
CREATE POLICY "users_can_insert_own_subscription" ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Keep the select policy as is - it's already secure
-- Policy "select_own_subscription" already properly restricts to owner