-- Crear tabla para plan de cuentas boliviano 2025
CREATE TABLE IF NOT EXISTS public.plan_cuentas_2025 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  nivel INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Activo', 'Pasivo', 'Patrimonio', 'Ingreso', 'Gasto')),
  descripcion TEXT,
  cuenta_padre TEXT REFERENCES public.plan_cuentas_2025(codigo),
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS para plan de cuentas
ALTER TABLE public.plan_cuentas_2025 ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para plan de cuentas
CREATE POLICY "Todos pueden ver plan de cuentas" 
ON public.plan_cuentas_2025 
FOR SELECT 
USING (true);

CREATE POLICY "Solo admins pueden modificar plan de cuentas" 
ON public.plan_cuentas_2025 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role)) 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Crear tabla para configuración tributaria boliviana
CREATE TABLE IF NOT EXISTS public.configuracion_tributaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nit_empresa TEXT NOT NULL,
  razon_social TEXT NOT NULL,
  actividad_economica TEXT NOT NULL,
  codigo_actividad TEXT NOT NULL,
  regimen_tributario TEXT NOT NULL DEFAULT 'GENERAL', -- GENERAL, SIMPLIFICADO, INTEGRADO
  iva_tasa DECIMAL(5,4) NOT NULL DEFAULT 0.13, -- 13%
  it_tasa DECIMAL(5,4) NOT NULL DEFAULT 0.03, -- 3%
  iue_tasa DECIMAL(5,4) NOT NULL DEFAULT 0.25, -- 25%
  rc_iva_tasa DECIMAL(5,4) NOT NULL DEFAULT 0.13, -- Retención IVA 13%
  rc_it_tasa DECIMAL(5,4) NOT NULL DEFAULT 0.30, -- Retención IT 30%
  ufv_actual DECIMAL(10,5) NOT NULL DEFAULT 2.96000, -- UFV actual
  tipo_cambio_usd DECIMAL(8,4) NOT NULL DEFAULT 6.9600, -- Tipo cambio USD
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.configuracion_tributaria ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para configuración tributaria
CREATE POLICY "Solo admins pueden ver configuración tributaria" 
ON public.configuracion_tributaria 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Solo admins pueden modificar configuración tributaria" 
ON public.configuracion_tributaria 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role)) 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Triggers para timestamps
CREATE TRIGGER update_plan_cuentas_2025_updated_at
  BEFORE UPDATE ON public.plan_cuentas_2025
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configuracion_tributaria_updated_at
  BEFORE UPDATE ON public.configuracion_tributaria
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();