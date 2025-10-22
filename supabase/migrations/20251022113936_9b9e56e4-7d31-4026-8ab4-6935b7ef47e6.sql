-- Asignar user_id a proveedores huérfanos y hacer la columna obligatoria
DO $$
DECLARE
  primer_usuario_id UUID;
BEGIN
  -- Obtener el primer usuario registrado
  SELECT id INTO primer_usuario_id
  FROM auth.users
  ORDER BY created_at
  LIMIT 1;

  -- Si existe un usuario, asignar todos los proveedores huérfanos a ese usuario
  IF primer_usuario_id IS NOT NULL THEN
    UPDATE public.proveedores
    SET user_id = primer_usuario_id
    WHERE user_id IS NULL;
    
    RAISE NOTICE 'Proveedores asignados al usuario: %', primer_usuario_id;
  END IF;
END $$;

-- Hacer que user_id sea obligatorio en proveedores
ALTER TABLE public.proveedores 
ALTER COLUMN user_id SET NOT NULL;