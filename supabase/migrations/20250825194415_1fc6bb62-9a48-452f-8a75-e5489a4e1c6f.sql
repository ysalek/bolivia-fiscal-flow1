-- Fix remaining functions with search_path issues

-- Fix the assign_admin_to_first_user function
CREATE OR REPLACE FUNCTION public.assign_admin_to_first_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si no hay otros usuarios, asignar rol admin
  IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
    -- Insertar rol admin para el primer usuario
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Actualizar perfil con permisos de admin
    UPDATE public.profiles 
    SET permisos = ARRAY['*']
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix the touch_updated_at function
CREATE OR REPLACE FUNCTION public.touch_updated_at()
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