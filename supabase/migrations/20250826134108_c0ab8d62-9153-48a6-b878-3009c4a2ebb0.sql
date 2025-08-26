-- Crear tabla para declaraciones tributarias
CREATE TABLE public.declaraciones_tributarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL, -- iva, it, iue, rc-iva
  periodo TEXT NOT NULL,
  gestion INTEGER NOT NULL,
  mes INTEGER,
  monto_base NUMERIC DEFAULT 0,
  monto_impuesto NUMERIC DEFAULT 0,
  monto_pagado NUMERIC DEFAULT 0,
  fecha_presentacion DATE,
  fecha_vencimiento DATE NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para anticipos
CREATE TABLE public.anticipos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL, -- adelanto_sueldo, anticipo_proveedor, etc
  empleado_id UUID REFERENCES public.empleados(id),
  proveedor_id UUID REFERENCES public.proveedores(id),
  cliente_id UUID REFERENCES public.clientes(id),
  monto NUMERIC NOT NULL,
  fecha DATE NOT NULL,
  motivo TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  monto_descontado NUMERIC DEFAULT 0,
  saldo_pendiente NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para ventas a crédito
CREATE TABLE public.ventas_credito (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  factura_id UUID NOT NULL REFERENCES public.facturas(id),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id),
  monto_total NUMERIC NOT NULL,
  monto_pagado NUMERIC DEFAULT 0,
  saldo_pendiente NUMERIC NOT NULL,
  fecha_venta DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  plazo_dias INTEGER NOT NULL,
  interes_mora NUMERIC DEFAULT 0,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para comprobantes integrados
CREATE TABLE public.comprobantes_integrados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  numero_comprobante TEXT NOT NULL,
  fecha DATE NOT NULL,
  tipo_comprobante TEXT NOT NULL,
  razon_social TEXT NOT NULL,
  nit TEXT NOT NULL,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  iva NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  estado TEXT DEFAULT 'borrador',
  estado_sin TEXT,
  cuf TEXT,
  cufd TEXT,
  codigo_control TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para items de comprobantes integrados
CREATE TABLE public.items_comprobantes_integrados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comprobante_id UUID NOT NULL REFERENCES public.comprobantes_integrados(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES public.productos(id),
  codigo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario NUMERIC NOT NULL,
  descuento NUMERIC DEFAULT 0,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para centros de costo
CREATE TABLE public.centros_costo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  codigo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT DEFAULT 'operativo', -- operativo, administrativo, ventas
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, codigo)
);

-- Enable RLS on new tables
ALTER TABLE public.declaraciones_tributarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anticipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comprobantes_integrados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_comprobantes_integrados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centros_costo ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own declaraciones_tributarias" 
ON public.declaraciones_tributarias 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own anticipos" 
ON public.anticipos 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own ventas_credito" 
ON public.ventas_credito 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own comprobantes_integrados" 
ON public.comprobantes_integrados 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage items of their own comprobantes" 
ON public.items_comprobantes_integrados 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.comprobantes_integrados c 
  WHERE c.id = items_comprobantes_integrados.comprobante_id 
  AND c.user_id = auth.uid()
));

CREATE POLICY "Users can manage their own centros_costo" 
ON public.centros_costo 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_declaraciones_tributarias_updated_at
  BEFORE UPDATE ON public.declaraciones_tributarias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_anticipos_updated_at
  BEFORE UPDATE ON public.anticipos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ventas_credito_updated_at
  BEFORE UPDATE ON public.ventas_credito
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comprobantes_integrados_updated_at
  BEFORE UPDATE ON public.comprobantes_integrados
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_centros_costo_updated_at
  BEFORE UPDATE ON public.centros_costo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();