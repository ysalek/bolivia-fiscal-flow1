-- Continuar con PATRIMONIO, INGRESOS y GASTOS
INSERT INTO public.plan_cuentas_2025 (codigo, nombre, nivel, tipo, descripcion) VALUES 
-- PATRIMONIO
('3', 'PATRIMONIO', 1, 'Patrimonio', 'Capital y reservas de la empresa'),
('31', 'CAPITAL', 2, 'Patrimonio', 'Aportes de capital'),
('32', 'RESERVAS', 2, 'Patrimonio', 'Reservas legales y voluntarias'),
('33', 'RESULTADOS', 2, 'Patrimonio', 'Utilidades y pérdidas'),
('3110', 'Capital Social', 4, 'Patrimonio', 'Capital aportado por socios'),
('3111', 'Aportes para Futuros Aumentos', 4, 'Patrimonio', 'Aportes pendientes de capitalizar'),
('3210', 'Reserva Legal', 4, 'Patrimonio', 'Reserva obligatoria 5% utilidades'),
('3211', 'Reservas Voluntarias', 4, 'Patrimonio', 'Reservas adicionales'),
('3310', 'Resultados Acumulados', 4, 'Patrimonio', 'Utilidades de gestiones anteriores'),
('3311', 'Resultado del Ejercicio', 4, 'Patrimonio', 'Utilidad o pérdida del período')
ON CONFLICT (codigo) DO NOTHING;

-- INGRESOS
INSERT INTO public.plan_cuentas_2025 (codigo, nombre, nivel, tipo, descripcion) VALUES 
('4', 'INGRESOS', 1, 'Ingreso', 'Ingresos por actividades'),
('41', 'INGRESOS OPERACIONALES', 2, 'Ingreso', 'Ingresos por ventas'),
('42', 'INGRESOS NO OPERACIONALES', 2, 'Ingreso', 'Otros ingresos'),
('4110', 'Ventas Gravadas', 4, 'Ingreso', 'Ventas sujetas a IVA 13%'),
('4111', 'Ventas Exentas', 4, 'Ingreso', 'Ventas exentas de IVA'),
('4112', 'Exportaciones', 4, 'Ingreso', 'Ventas al exterior - tasa 0%'),
('4113', 'Servicios Gravados', 4, 'Ingreso', 'Servicios con IVA 13%'),
('4114', 'Servicios Exentos', 4, 'Ingreso', 'Servicios sin IVA'),
('4210', 'Ingresos Financieros', 4, 'Ingreso', 'Intereses ganados'),
('4211', 'Diferencia de Cambio Ganada', 4, 'Ingreso', 'Ganancias cambiarias'),
('4212', 'Otros Ingresos', 4, 'Ingreso', 'Ingresos diversos')
ON CONFLICT (codigo) DO NOTHING;

-- GASTOS
INSERT INTO public.plan_cuentas_2025 (codigo, nombre, nivel, tipo, descripcion) VALUES 
('5', 'GASTOS', 1, 'Gasto', 'Gastos operacionales y no operacionales'),
('51', 'COSTO DE VENTAS', 2, 'Gasto', 'Costo directo de productos vendidos'),
('52', 'GASTOS OPERACIONALES', 2, 'Gasto', 'Gastos de administración y ventas'),
('53', 'GASTOS NO OPERACIONALES', 2, 'Gasto', 'Gastos financieros y otros'),
('5110', 'Costo de Mercaderías Vendidas', 4, 'Gasto', 'Costo directo de productos'),
('5111', 'Costo de Servicios Prestados', 4, 'Gasto', 'Costo directo de servicios'),
('5210', 'Sueldos y Salarios', 4, 'Gasto', 'Remuneraciones al personal'),
('5211', 'Cargas Sociales', 4, 'Gasto', 'Aportes patronales'),
('5212', 'Beneficios Sociales', 4, 'Gasto', 'Aguinaldos, primas, etc.'),
('5220', 'Alquileres', 4, 'Gasto', 'Arrendamientos pagados'),
('5221', 'Servicios Básicos', 4, 'Gasto', 'Luz, agua, teléfono, internet'),
('5222', 'Combustibles y Lubricantes', 4, 'Gasto', 'Gasolina, diesel, aceites'),
('5223', 'Mantenimiento y Reparaciones', 4, 'Gasto', 'Mantenimiento de activos'),
('5224', 'Seguros', 4, 'Gasto', 'Primas de seguros'),
('5225', 'Gastos de Viaje', 4, 'Gasto', 'Viáticos y hospedajes'),
('5226', 'Publicidad y Propaganda', 4, 'Gasto', 'Gastos de marketing'),
('5227', 'Papelería y Útiles', 4, 'Gasto', 'Material de oficina'),
('5228', 'Servicios Profesionales', 4, 'Gasto', 'Honorarios y consultorías'),
('5310', 'Gastos Financieros', 4, 'Gasto', 'Intereses y comisiones bancarias'),
('5311', 'Diferencia de Cambio Perdida', 4, 'Gasto', 'Pérdidas cambiarias'),
('5410', 'Depreciación de Activos Fijos', 4, 'Gasto', 'Depreciación según vida útil'),
('5411', 'Amortización de Intangibles', 4, 'Gasto', 'Amortización de software, etc.')
ON CONFLICT (codigo) DO NOTHING;

-- Insertar configuración tributaria inicial
INSERT INTO public.configuracion_tributaria (
  nit_empresa, 
  razon_social, 
  actividad_economica, 
  codigo_actividad,
  regimen_tributario,
  iva_tasa,
  it_tasa,
  iue_tasa,
  rc_iva_tasa,
  rc_it_tasa,
  ufv_actual,
  tipo_cambio_usd
) VALUES (
  '0000000000000', 
  'MI EMPRESA S.R.L.', 
  'SERVICIOS DE CONSULTORIA Y CONTABILIDAD', 
  '749100',
  'GENERAL',
  0.13,    -- IVA 13%
  0.03,    -- IT 3%
  0.25,    -- IUE 25%
  0.13,    -- RC-IVA 13%
  0.30,    -- RC-IT 30%
  2.96000, -- UFV Enero 2025
  6.9600   -- Tipo cambio USD
) ON CONFLICT DO NOTHING;