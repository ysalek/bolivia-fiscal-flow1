-- Convertir el primer usuario en administrador
-- Actualizar rol a admin
UPDATE public.user_roles 
SET role = 'admin'::app_role 
WHERE user_id = '176712a1-faac-4e7c-b295-6b0bddf43f44';

-- Dar permisos de admin en el perfil
UPDATE public.profiles 
SET permisos = ARRAY['*']
WHERE id = '176712a1-faac-4e7c-b295-6b0bddf43f44';