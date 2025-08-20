-- Deshabilitar confirmación de email para desarrollo
-- Crear usuario admin directo por SQL para acceso inmediato

-- Primero, confirmar cualquier usuario pendiente
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now()
WHERE email_confirmed_at IS NULL;

-- Insertar usuario admin si no existe
DO $$
BEGIN
  -- Solo si no hay usuarios admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@sistema.com') THEN
    -- Insertar usuario en auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@sistema.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"nombre":"Administrador","empresa":"Sistema","telefono":"123456789"}'
    );
  END IF;
END
$$;