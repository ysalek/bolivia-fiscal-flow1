-- Crear usuario administrador inicial
-- Insertar en auth.users (esto debe hacerse desde la interfaz de Supabase Auth)
-- Por ahora, crearemos la estructura para manejar el primer usuario como admin

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

-- Actualizar Plan de Cuentas Boliviano 2025 según normativas actuales
-- Agregar cuentas específicas requeridas por el SIN
INSERT INTO plan_cuentas_2025 (codigo, nombre, nivel, tipo, descripcion) VALUES 
-- Activos - Actualizados según normativa 2025
('1110', 'Caja Moneda Nacional', 4, 'Activo', 'Efectivo en moneda nacional - Bolivianos'),
('1111', 'Caja Moneda Extranjera', 4, 'Activo', 'Efectivo en moneda extranjera - Dólares USD'),
('1120', 'Bancos Moneda Nacional', 4, 'Activo', 'Depósitos bancarios en Bolivianos'),
('1121', 'Bancos Moneda Extranjera', 4, 'Activo', 'Depósitos bancarios en Dólares USD'),
('1210', 'Cuentas por Cobrar Comerciales', 4, 'Activo', 'Facturas por cobrar a clientes'),
('1211', 'Documentos por Cobrar', 4, 'Activo', 'Pagarés y letras de cambio por cobrar'),
('1310', 'Inventarios Mercaderías', 4, 'Activo', 'Stock de productos terminados'),
('1311', 'Inventarios Materia Prima', 4, 'Activo', 'Materiales para producción'),
('1410', 'Gastos Pagados por Anticipado', 4, 'Activo', 'Seguros, alquileres pagados por adelantado'),

-- Pasivos - Según obligaciones tributarias bolivianas
('2110', 'Cuentas por Pagar Comerciales', 4, 'Pasivo', 'Facturas pendientes de pago a proveedores'),
('2210', 'IVA Débito Fiscal', 4, 'Pasivo', 'IVA cobrado en ventas - 13%'),
('2211', 'IVA Crédito Fiscal', 4, 'Activo', 'IVA pagado en compras - recuperable'),
('2220', 'IT por Pagar', 4, 'Pasivo', 'Impuesto a las Transacciones 3%'),
('2230', 'IUE por Pagar', 4, 'Pasivo', 'Impuesto sobre Utilidades de Empresas 25%'),
('2240', 'Aportes Laborales por Pagar', 4, 'Pasivo', 'AFP, Seguro Social, Solidario'),
('2250', 'Sueldos y Salarios por Pagar', 4, 'Pasivo', 'Remuneraciones pendientes de pago'),

-- Patrimonio
('3110', 'Capital Social', 4, 'Patrimonio', 'Capital aportado por socios'),
('3210', 'Reserva Legal', 4, 'Patrimonio', 'Reserva obligatoria 5% utilidades'),
('3310', 'Resultados Acumulados', 4, 'Patrimonio', 'Utilidades de gestiones anteriores'),

-- Ingresos - Según normativa SIN
('4110', 'Ventas Gravadas', 4, 'Ingreso', 'Ventas sujetas a IVA 13%'),
('4120', 'Ventas Exentas', 4, 'Ingreso', 'Ventas exentas de IVA'),
('4130', 'Exportaciones', 4, 'Ingreso', 'Ventas al exterior - tasa 0%'),
('4210', 'Ingresos Financieros', 4, 'Ingreso', 'Intereses ganados'),

-- Gastos - Clasificación fiscal boliviana
('5110', 'Costo de Ventas', 4, 'Gasto', 'Costo directo de productos vendidos'),
('5210', 'Gastos de Administración', 4, 'Gasto', 'Gastos administrativos generales'),
('5220', 'Gastos de Comercialización', 4, 'Gasto', 'Gastos de ventas y marketing'),
('5310', 'Gastos Financieros', 4, 'Gasto', 'Intereses y comisiones bancarias'),
('5410', 'Depreciación de Activos Fijos', 4, 'Gasto', 'Depreciación según vida útil fiscal')

ON CONFLICT (codigo) DO UPDATE SET 
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion;

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

-- Insertar configuración inicial
INSERT INTO public.configuracion_tributaria (
  nit_empresa, 
  razon_social, 
  actividad_economica, 
  codigo_actividad,
  regimen_tributario
) VALUES (
  '0000000000000', 
  'MI EMPRESA S.R.L.', 
  'SERVICIOS DE CONSULTORIA', 
  '749100',
  'GENERAL'
) ON CONFLICT DO NOTHING;

-- Trigger para actualizar timestamp
CREATE TRIGGER update_configuracion_tributaria_updated_at
  BEFORE UPDATE ON public.configuracion_tributaria
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();