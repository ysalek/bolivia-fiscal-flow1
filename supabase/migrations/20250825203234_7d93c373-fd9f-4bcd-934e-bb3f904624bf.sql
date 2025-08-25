-- ===================================================
-- MIGRACIÓN COMPLETA SISTEMA CONTABLE BOLIVIANO 2025
-- ===================================================

-- ===================== EMPLEADOS ======================
CREATE TABLE public.empleados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  numero_empleado TEXT NOT NULL UNIQUE,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  ci TEXT NOT NULL UNIQUE,
  fecha_nacimiento DATE NOT NULL,
  genero TEXT CHECK (genero IN ('masculino', 'femenino', 'otro')),
  estado_civil TEXT CHECK (estado_civil IN ('soltero', 'casado', 'divorciado', 'viudo')),
  email TEXT UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  telefono TEXT,
  direccion TEXT,
  departamento TEXT NOT NULL,
  cargo TEXT NOT NULL,
  fecha_ingreso DATE NOT NULL,
  salario_base DECIMAL(12,2) NOT NULL DEFAULT 0,
  beneficios TEXT[] DEFAULT '{}',
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'vacaciones', 'licencia')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================== CATEGORÍAS PRODUCTOS =================
CREATE TABLE public.categorias_productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===================== PRODUCTOS ======================
CREATE TABLE public.productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  codigo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria_id UUID REFERENCES public.categorias_productos(id),
  unidad_medida TEXT DEFAULT 'PZA',
  precio_venta DECIMAL(12,2) NOT NULL DEFAULT 0,
  precio_compra DECIMAL(12,2) NOT NULL DEFAULT 0,
  costo_unitario DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock_actual INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 0,
  codigo_sin TEXT,
  activo BOOLEAN DEFAULT true,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, codigo)
);

-- ===================== PROVEEDORES ======================
CREATE TABLE public.proveedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  nit TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, nit)
);

-- ===================== CLIENTES ======================
CREATE TABLE public.clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  nit TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, nit)
);

-- ===================== COMPRAS ======================
CREATE TABLE public.compras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  numero TEXT NOT NULL,
  proveedor_id UUID REFERENCES public.proveedores(id),
  fecha DATE NOT NULL,
  fecha_vencimiento DATE,
  subtotal DECIMAL(12,2) DEFAULT 0,
  descuento_total DECIMAL(12,2) DEFAULT 0,
  iva DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'recibida', 'pagada', 'anulada')),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, numero)
);

-- ================== ITEMS COMPRAS ===================
CREATE TABLE public.items_compras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  compra_id UUID REFERENCES public.compras(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES public.productos(id),
  descripcion TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  costo_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===================== FACTURAS ======================
CREATE TABLE public.facturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  numero TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  fecha DATE NOT NULL,
  fecha_vencimiento DATE,
  subtotal DECIMAL(12,2) DEFAULT 0,
  descuento_total DECIMAL(12,2) DEFAULT 0,
  iva DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviada', 'pagada', 'anulada')),
  estado_sin TEXT DEFAULT 'pendiente' CHECK (estado_sin IN ('pendiente', 'aceptado', 'rechazado')),
  cuf TEXT,
  cufd TEXT,
  punto_venta INTEGER DEFAULT 0,
  codigo_control TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, numero)
);

-- ================== ITEMS FACTURAS ===================
CREATE TABLE public.items_facturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  factura_id UUID REFERENCES public.facturas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES public.productos(id),
  codigo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  descuento DECIMAL(12,2) DEFAULT 0,
  subtotal DECIMAL(12,2) NOT NULL,
  codigo_sin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================== ASIENTOS CONTABLES ==================
CREATE TABLE public.asientos_contables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  numero TEXT NOT NULL,
  fecha DATE NOT NULL,
  concepto TEXT NOT NULL,
  referencia TEXT,
  debe DECIMAL(12,2) DEFAULT 0,
  haber DECIMAL(12,2) DEFAULT 0,
  estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador', 'registrado', 'anulado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, numero)
);

-- ================== CUENTAS ASIENTOS ==================
CREATE TABLE public.cuentas_asientos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asiento_id UUID REFERENCES public.asientos_contables(id) ON DELETE CASCADE,
  codigo_cuenta TEXT NOT NULL,
  nombre_cuenta TEXT NOT NULL,
  debe DECIMAL(12,2) DEFAULT 0,
  haber DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================ MOVIMIENTOS INVENTARIO =================
CREATE TABLE public.movimientos_inventario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  producto_id UUID REFERENCES public.productos(id),
  fecha DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'salida', 'ajuste')),
  cantidad INTEGER NOT NULL,
  costo_unitario DECIMAL(12,2) DEFAULT 0,
  stock_anterior INTEGER DEFAULT 0,
  stock_actual INTEGER DEFAULT 0,
  observaciones TEXT,
  compra_id UUID REFERENCES public.compras(id),
  factura_id UUID REFERENCES public.facturas(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===================== PRESUPUESTOS ======================
CREATE TABLE public.presupuestos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  periodo TEXT NOT NULL,
  estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador', 'aprobado', 'en_ejecucion', 'cerrado')),
  total_presupuestado DECIMAL(12,2) DEFAULT 0,
  total_ejecutado DECIMAL(12,2) DEFAULT 0,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  responsable TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================== ITEMS PRESUPUESTOS ==================
CREATE TABLE public.items_presupuestos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  presupuesto_id UUID REFERENCES public.presupuestos(id) ON DELETE CASCADE,
  concepto TEXT NOT NULL,
  categoria TEXT NOT NULL,
  presupuestado DECIMAL(12,2) NOT NULL DEFAULT 0,
  ejecutado DECIMAL(12,2) DEFAULT 0,
  variacion DECIMAL(12,2) DEFAULT 0,
  porcentaje_ejecucion DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===================== TRIGGERS ======================

-- Trigger para updated_at en todas las tablas
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a todas las tablas que tienen updated_at
CREATE TRIGGER handle_empleados_updated_at BEFORE UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_categorias_productos_updated_at BEFORE UPDATE ON public.categorias_productos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_productos_updated_at BEFORE UPDATE ON public.productos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_proveedores_updated_at BEFORE UPDATE ON public.proveedores FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_compras_updated_at BEFORE UPDATE ON public.compras FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_facturas_updated_at BEFORE UPDATE ON public.facturas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_asientos_contables_updated_at BEFORE UPDATE ON public.asientos_contables FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_presupuestos_updated_at BEFORE UPDATE ON public.presupuestos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_items_presupuestos_updated_at BEFORE UPDATE ON public.items_presupuestos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==================== RLS POLICIES ======================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asientos_contables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuentas_asientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presupuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_presupuestos ENABLE ROW LEVEL SECURITY;

-- Policies para EMPLEADOS
CREATE POLICY "Users can manage their own empleados" ON public.empleados 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para CATEGORÍAS PRODUCTOS
CREATE POLICY "Users can manage their own categorias_productos" ON public.categorias_productos 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para PRODUCTOS  
CREATE POLICY "Users can manage their own productos" ON public.productos 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para PROVEEDORES
CREATE POLICY "Users can manage their own proveedores" ON public.proveedores 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para CLIENTES
CREATE POLICY "Users can manage their own clientes" ON public.clientes 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para COMPRAS
CREATE POLICY "Users can manage their own compras" ON public.compras 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para ITEMS COMPRAS
CREATE POLICY "Users can manage items of their own compras" ON public.items_compras 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.compras c 
    WHERE c.id = compra_id AND c.user_id = auth.uid()
  )
);

-- Policies para FACTURAS
CREATE POLICY "Users can manage their own facturas" ON public.facturas 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para ITEMS FACTURAS
CREATE POLICY "Users can manage items of their own facturas" ON public.items_facturas 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.facturas f 
    WHERE f.id = factura_id AND f.user_id = auth.uid()
  )
);

-- Policies para ASIENTOS CONTABLES
CREATE POLICY "Users can manage their own asientos_contables" ON public.asientos_contables 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para CUENTAS ASIENTOS
CREATE POLICY "Users can manage cuentas of their own asientos" ON public.cuentas_asientos 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.asientos_contables a 
    WHERE a.id = asiento_id AND a.user_id = auth.uid()
  )
);

-- Policies para MOVIMIENTOS INVENTARIO
CREATE POLICY "Users can manage their own movimientos_inventario" ON public.movimientos_inventario 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para PRESUPUESTOS
CREATE POLICY "Users can manage their own presupuestos" ON public.presupuestos 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies para ITEMS PRESUPUESTOS
CREATE POLICY "Users can manage items of their own presupuestos" ON public.items_presupuestos 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.presupuestos p 
    WHERE p.id = presupuesto_id AND p.user_id = auth.uid()
  )
);

-- ==================== ÍNDICES ======================

-- Índices para mejorar rendimiento
CREATE INDEX idx_empleados_user_id ON public.empleados(user_id);
CREATE INDEX idx_empleados_numero ON public.empleados(numero_empleado);
CREATE INDEX idx_empleados_ci ON public.empleados(ci);

CREATE INDEX idx_productos_user_id ON public.productos(user_id);
CREATE INDEX idx_productos_codigo ON public.productos(user_id, codigo);
CREATE INDEX idx_productos_categoria ON public.productos(categoria_id);

CREATE INDEX idx_compras_user_id ON public.compras(user_id);
CREATE INDEX idx_compras_numero ON public.compras(user_id, numero);
CREATE INDEX idx_compras_proveedor ON public.compras(proveedor_id);

CREATE INDEX idx_facturas_user_id ON public.facturas(user_id);
CREATE INDEX idx_facturas_numero ON public.facturas(user_id, numero);
CREATE INDEX idx_facturas_cliente ON public.facturas(cliente_id);

CREATE INDEX idx_asientos_user_id ON public.asientos_contables(user_id);
CREATE INDEX idx_asientos_numero ON public.asientos_contables(user_id, numero);
CREATE INDEX idx_asientos_fecha ON public.asientos_contables(fecha);

CREATE INDEX idx_movimientos_inventario_user_id ON public.movimientos_inventario(user_id);
CREATE INDEX idx_movimientos_inventario_producto ON public.movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_inventario_fecha ON public.movimientos_inventario(fecha);