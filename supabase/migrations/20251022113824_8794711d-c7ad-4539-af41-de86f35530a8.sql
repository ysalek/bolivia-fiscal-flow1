-- Paso 1: Obtener el primer usuario (admin) para asignarle los productos huérfanos
DO $$
DECLARE
  primer_usuario_id UUID;
BEGIN
  -- Obtener el primer usuario registrado
  SELECT id INTO primer_usuario_id
  FROM auth.users
  ORDER BY created_at
  LIMIT 1;

  -- Si existe un usuario, asignar todos los productos huérfanos a ese usuario
  IF primer_usuario_id IS NOT NULL THEN
    UPDATE public.productos
    SET user_id = primer_usuario_id
    WHERE user_id IS NULL;
    
    UPDATE public.clientes
    SET user_id = primer_usuario_id
    WHERE user_id IS NULL;
    
    UPDATE public.categorias_productos
    SET user_id = primer_usuario_id
    WHERE user_id IS NULL;
    
    RAISE NOTICE 'Productos asignados al usuario: %', primer_usuario_id;
  END IF;
END $$;

-- Paso 2: Hacer que user_id sea obligatorio en productos
ALTER TABLE public.productos 
ALTER COLUMN user_id SET NOT NULL;

-- Paso 3: Hacer que user_id sea obligatorio en clientes si aún no lo es
ALTER TABLE public.clientes 
ALTER COLUMN user_id SET NOT NULL;

-- Paso 4: Hacer que user_id sea obligatorio en categorias_productos
ALTER TABLE public.categorias_productos
ALTER COLUMN user_id SET NOT NULL;

-- Paso 5: Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_user_id ON public.productos(user_id);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON public.productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON public.productos(activo);
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_facturas_user_id ON public.facturas(user_id);
CREATE INDEX IF NOT EXISTS idx_compras_user_id ON public.compras(user_id);