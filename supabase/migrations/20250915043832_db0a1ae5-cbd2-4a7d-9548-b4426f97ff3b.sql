-- Actualizar configuración tributaria con normativa 2025
UPDATE configuracion_tributaria SET
  actividad_economica = 'SERVICIOS DE CONSULTORIA Y CONTABILIDAD',
  codigo_actividad = '749100',
  iva_tasa = 0.13,
  it_tasa = 0.03,
  iue_tasa = 0.25,
  rc_iva_tasa = 0.13,
  rc_it_tasa = 0.30,
  tipo_cambio_usd = 6.96,
  ufv_actual = 2.96000,
  regimen_tributario = 'GENERAL'
WHERE id = (SELECT id FROM configuracion_tributaria LIMIT 1);

-- Crear tabla para normativas 2025
CREATE TABLE IF NOT EXISTS public.normativas_2025 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rnd_numero TEXT NOT NULL UNIQUE,
  fecha_emision DATE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  contenido JSONB,
  estado TEXT DEFAULT 'vigente',
  fecha_vigencia DATE,
  fecha_vencimiento DATE,
  categoria TEXT NOT NULL, -- 'facturacion', 'iva', 'it', 'bancarizacion', etc.
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.normativas_2025 ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Solo admins pueden ver normativas"
ON public.normativas_2025
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Solo admins pueden modificar normativas"
ON public.normativas_2025
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insertar normativas principales de 2025
INSERT INTO public.normativas_2025 (rnd_numero, fecha_emision, titulo, descripcion, categoria, fecha_vigencia, contenido) VALUES 
('102500000002', '2025-01-07', 'Beneficio IVA Tasa Cero 2025', 'Establece procedimiento para facturar con tasa de IVA 0 para bienes de capital', 'iva', '2025-01-01', 
 '{"sectores": ["agropecuario", "industrial", "construccion", "mineria"], "modalidad": "Portal Web en Línea", "ley_base": "Ley N°1613"}'::jsonb),

('102500000003', '2025-01-10', 'Prórroga Obligaciones Tributarias', 'Prórroga de vencimiento para cumplimiento de obligaciones tributarias', 'general', '2025-01-10', 
 '{"tipo": "prorroga", "obligaciones": ["declaraciones", "pagos"], "periodo": "primer_trimestre_2025"}'::jsonb),

('102500000017', '2025-04-15', 'Registro Nacional de Contribuyentes', 'Nuevo marco normativo para RNC que sustituye al PBD-11', 'registro', '2025-05-01', 
 '{"sustituye": "PBD-11", "nuevo_sistema": "RNC", "implementacion": "mayo_2025"}'::jsonb),

('102500000018', '2025-04-22', 'Nuevo Clasificador Actividades Económicas', 'Aprueba nuevo clasificador CAEB-SIN compatible con INE', 'actividades', '2025-05-01', 
 '{"base": "CAEB-2022", "compatibilidad": "INE", "estandar": "CIIU Rev. 4", "vigencia": "mayo_2025"}'::jsonb);

-- Crear tabla para facilidades de pago actualizadas 2025
CREATE TABLE IF NOT EXISTS public.facilidades_pago_2025 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  numero_facilidad TEXT NOT NULL,
  tipo_facilidad TEXT NOT NULL, -- 'ordinaria', 'extraordinaria', 'covid'
  monto_deuda NUMERIC NOT NULL,
  monto_inicial NUMERIC DEFAULT 0,
  numero_cuotas INTEGER NOT NULL,
  monto_cuota NUMERIC NOT NULL,
  tasa_interes NUMERIC DEFAULT 0.05,
  fecha_solicitud DATE NOT NULL,
  fecha_aprobacion DATE,
  fecha_vencimiento DATE NOT NULL,
  estado TEXT DEFAULT 'solicitud', -- 'solicitud', 'aprobada', 'vigente', 'vencida', 'cumplida'
  normativa_aplicable TEXT DEFAULT '102500000003',
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.facilidades_pago_2025 ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Users can manage their own facilidades_pago_2025"
ON public.facilidades_pago_2025
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Actualizar tabla de declaraciones tributarias con nuevos campos 2025
ALTER TABLE public.declaraciones_tributarias 
ADD COLUMN IF NOT EXISTS formulario_tipo TEXT DEFAULT 'digital',
ADD COLUMN IF NOT EXISTS normativa_aplicable TEXT DEFAULT '102500000018',
ADD COLUMN IF NOT EXISTS codigo_actividad_caeb TEXT,
ADD COLUMN IF NOT EXISTS beneficio_iva_cero BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS modalidad_facturacion TEXT DEFAULT 'ordinaria';

-- Crear trigger para timestamp automático
CREATE TRIGGER update_normativas_2025_updated_at
  BEFORE UPDATE ON public.normativas_2025
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facilidades_pago_2025_updated_at
  BEFORE UPDATE ON public.facilidades_pago_2025
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();