-- Crear tabla para activos fijos
CREATE TABLE public.activos_fijos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  codigo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  fecha_adquisicion DATE NOT NULL,
  costo_inicial NUMERIC NOT NULL DEFAULT 0,
  valor_residual NUMERIC DEFAULT 0,
  vida_util_anos INTEGER NOT NULL,
  metodo_depreciacion TEXT DEFAULT 'lineal',
  categoria TEXT,
  ubicacion TEXT,
  estado TEXT DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para depreciaciones de activos
CREATE TABLE public.depreciaciones_activos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activo_id UUID NOT NULL REFERENCES public.activos_fijos(id) ON DELETE CASCADE,
  periodo TEXT NOT NULL,
  valor_depreciacion NUMERIC NOT NULL,
  depreciacion_acumulada NUMERIC NOT NULL DEFAULT 0,
  valor_neto NUMERIC NOT NULL,
  fecha_depreciacion DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para cuentas bancarias
CREATE TABLE public.cuentas_bancarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nombre TEXT NOT NULL,
  banco TEXT NOT NULL,
  numero_cuenta TEXT NOT NULL,
  tipo_cuenta TEXT DEFAULT 'corriente',
  moneda TEXT DEFAULT 'BOB',
  saldo NUMERIC DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para movimientos bancarios
CREATE TABLE public.movimientos_bancarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cuenta_bancaria_id UUID NOT NULL REFERENCES public.cuentas_bancarias(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  tipo TEXT NOT NULL, -- ingreso, egreso
  monto NUMERIC NOT NULL,
  descripcion TEXT NOT NULL,
  numero_comprobante TEXT,
  beneficiario TEXT,
  saldo_anterior NUMERIC DEFAULT 0,
  saldo_actual NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para plan de cuentas principal
CREATE TABLE public.plan_cuentas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  codigo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL, -- activo, pasivo, patrimonio, ingresos, gastos
  naturaleza TEXT NOT NULL, -- deudora, acreedora
  nivel INTEGER DEFAULT 1,
  cuenta_padre TEXT,
  saldo NUMERIC DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, codigo)
);

-- Crear tabla para pagos
CREATE TABLE public.pagos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL, -- cobro, pago
  factura_id UUID REFERENCES public.facturas(id),
  compra_id UUID REFERENCES public.compras(id),
  fecha DATE NOT NULL,
  monto NUMERIC NOT NULL,
  metodo_pago TEXT DEFAULT 'efectivo',
  numero_comprobante TEXT,
  observaciones TEXT,
  estado TEXT DEFAULT 'registrado',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.activos_fijos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depreciaciones_activos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuentas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos_bancarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_cuentas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user-specific data
CREATE POLICY "Users can manage their own activos_fijos" 
ON public.activos_fijos 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage depreciaciones of their own activos" 
ON public.depreciaciones_activos 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own cuentas_bancarias" 
ON public.cuentas_bancarias 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage movimientos of their own cuentas" 
ON public.movimientos_bancarios 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own plan_cuentas" 
ON public.plan_cuentas 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own pagos" 
ON public.pagos 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_activos_fijos_updated_at
  BEFORE UPDATE ON public.activos_fijos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cuentas_bancarias_updated_at
  BEFORE UPDATE ON public.cuentas_bancarias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_cuentas_updated_at
  BEFORE UPDATE ON public.plan_cuentas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pagos_updated_at
  BEFORE UPDATE ON public.pagos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();