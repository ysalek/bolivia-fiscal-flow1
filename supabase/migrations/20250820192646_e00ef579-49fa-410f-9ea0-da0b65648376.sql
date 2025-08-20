-- Crear función para asignar rol admin al primer usuario registrado
CREATE OR REPLACE FUNCTION public.assign_admin_to_first_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Crear trigger para asignar admin automáticamente al primer usuario
DROP TRIGGER IF EXISTS assign_admin_to_first_user_trigger ON auth.users;
CREATE TRIGGER assign_admin_to_first_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_to_first_user();