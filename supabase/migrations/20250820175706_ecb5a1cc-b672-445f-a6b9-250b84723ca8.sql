-- Insertar Plan de Cuentas Boliviano 2025 según normativas actuales del SIN
INSERT INTO public.plan_cuentas_2025 (codigo, nombre, nivel, tipo, descripcion) VALUES 
-- ACTIVOS NIVEL 1
('1', 'ACTIVO', 1, 'Activo', 'Bienes y derechos de la empresa'),
-- ACTIVOS NIVEL 2
('11', 'ACTIVO CORRIENTE', 2, 'Activo', 'Activos de fácil convertibilidad'),
('12', 'ACTIVO NO CORRIENTE', 2, 'Activo', 'Activos de largo plazo'),
-- ACTIVOS NIVEL 3
('111', 'DISPONIBLE', 3, 'Activo', 'Efectivo y equivalentes'),
('112', 'EXIGIBLE', 3, 'Activo', 'Cuentas por cobrar'),
('113', 'REALIZABLE', 3, 'Activo', 'Inventarios y mercaderías'),
('121', 'ACTIVOS FIJOS', 3, 'Activo', 'Bienes de uso'),
-- ACTIVOS NIVEL 4 - Detallados según SIN
('1110', 'Caja Moneda Nacional', 4, 'Activo', 'Efectivo en Bolivianos'),
('1111', 'Caja Moneda Extranjera', 4, 'Activo', 'Efectivo en Dólares USD'),
('1120', 'Bancos Moneda Nacional', 4, 'Activo', 'Depósitos bancarios en Bs.'),
('1121', 'Bancos Moneda Extranjera', 4, 'Activo', 'Depósitos bancarios en USD'),
('1210', 'Cuentas por Cobrar Comerciales', 4, 'Activo', 'Facturas por cobrar'),
('1211', 'Documentos por Cobrar', 4, 'Activo', 'Pagarés y letras de cambio'),
('1212', 'Anticipo a Proveedores', 4, 'Activo', 'Pagos anticipados a proveedores'),
('1310', 'Inventarios Mercaderías', 4, 'Activo', 'Stock de productos terminados'),
('1311', 'Inventarios Materia Prima', 4, 'Activo', 'Materiales para producción'),
('1312', 'Productos en Proceso', 4, 'Activo', 'Producción en curso'),
('1410', 'Gastos Pagados por Anticipado', 4, 'Activo', 'Seguros, alquileres anticipados'),
('1210', 'Muebles y Enseres', 4, 'Activo', 'Mobiliario de oficina'),
('1211', 'Equipos de Computación', 4, 'Activo', 'Hardware y software'),
('1212', 'Vehículos', 4, 'Activo', 'Parque automotor'),

-- PASIVOS NIVEL 1
('2', 'PASIVO', 1, 'Pasivo', 'Obligaciones de la empresa'),
-- PASIVOS NIVEL 2
('21', 'PASIVO CORRIENTE', 2, 'Pasivo', 'Obligaciones a corto plazo'),
('22', 'PASIVO NO CORRIENTE', 2, 'Pasivo', 'Obligaciones a largo plazo'),
-- PASIVOS NIVEL 3
('211', 'COMERCIALES', 3, 'Pasivo', 'Obligaciones comerciales'),
('212', 'FISCALES', 3, 'Pasivo', 'Obligaciones tributarias'),
('213', 'LABORALES', 3, 'Pasivo', 'Obligaciones con empleados'),
-- PASIVOS NIVEL 4 - Según obligaciones bolivianas
('2110', 'Cuentas por Pagar Comerciales', 4, 'Pasivo', 'Facturas pendientes de pago'),
('2111', 'Documentos por Pagar', 4, 'Pasivo', 'Pagarés y letras por pagar'),
('2120', 'IVA Débito Fiscal', 4, 'Pasivo', 'IVA cobrado en ventas - 13%'),
('2121', 'IVA Crédito Fiscal', 4, 'Activo', 'IVA pagado en compras'),
('2122', 'IT por Pagar', 4, 'Pasivo', 'Impuesto a las Transacciones 3%'),
('2123', 'IUE por Pagar', 4, 'Pasivo', 'Impuesto sobre Utilidades 25%'),
('2124', 'RC-IVA por Pagar', 4, 'Pasivo', 'Retención IVA 13%'),
('2125', 'RC-IT por Pagar', 4, 'Pasivo', 'Retención IT 30%'),
('2130', 'Sueldos y Salarios por Pagar', 4, 'Pasivo', 'Remuneraciones pendientes'),
('2131', 'Aportes AFP por Pagar', 4, 'Pasivo', 'Aportes pensiones'),
('2132', 'Aportes CNS por Pagar', 4, 'Pasivo', 'Seguro social de salud'),
('2133', 'Aportes Solidario por Pagar', 4, 'Pasivo', 'Aporte solidario'),
('2134', 'Aguinaldos por Pagar', 4, 'Pasivo', 'Segundo aguinaldo'),

-- PATRIMONIO NIVEL 1
('3', 'PATRIMONIO', 1, 'Patrimonio', 'Capital y reservas de la empresa'),
-- PATRIMONIO NIVEL 2
('31', 'CAPITAL', 2, 'Patrimonio', 'Aportes de capital'),
('32', 'RESERVAS', 2, 'Patrimonio', 'Reservas legales y voluntarias'),
('33', 'RESULTADOS', 2, 'Patrimonio', 'Utilidades y pérdidas'),
-- PATRIMONIO NIVEL 3 y 4
('3110', 'Capital Social', 4, 'Patrimonio', 'Capital aportado por socios'),
('3111', 'Aportes para Futuros Aumentos', 4, 'Patrimonio', 'Aportes pendientes de capitalizar'),
('3210', 'Reserva Legal', 4, 'Patrimonio', 'Reserva obligatoria 5% utilidades'),
('3211', 'Reservas Voluntarias', 4, 'Patrimonio', 'Reservas adicionales'),
('3310', 'Resultados Acumulados', 4, 'Patrimonio', 'Utilidades de gestiones anteriores'),
('3311', 'Resultado del Ejercicio', 4, 'Patrimonio', 'Utilidad o pérdida del período'),

-- INGRESOS NIVEL 1
('4', 'INGRESOS', 1, 'Ingreso', 'Ingresos por actividades'),
-- INGRESOS NIVEL 2
('41', 'INGRESOS OPERACIONALES', 2, 'Ingreso', 'Ingresos por ventas'),
('42', 'INGRESOS NO OPERACIONALES', 2, 'Ingreso', 'Otros ingresos'),
-- INGRESOS NIVEL 3 y 4 - Según normativa SIN
('4110', 'Ventas Gravadas', 4, 'Ingreso', 'Ventas sujetas a IVA 13%'),
('4111', 'Ventas Exentas', 4, 'Ingreso', 'Ventas exentas de IVA'),
('4112', 'Exportaciones', 4, 'Ingreso', 'Ventas al exterior - tasa 0%'),
('4113', 'Servicios Gravados', 4, 'Ingreso', 'Servicios con IVA 13%'),
('4114', 'Servicios Exentos', 4, 'Ingreso', 'Servicios sin IVA'),
('4210', 'Ingresos Financieros', 4, 'Ingreso', 'Intereses ganados'),
('4211', 'Diferencia de Cambio Ganada', 4, 'Ingreso', 'Ganancias cambiarias'),
('4212', 'Otros Ingresos', 4, 'Ingreso', 'Ingresos diversos'),

-- GASTOS NIVEL 1
('5', 'GASTOS', 1, 'Gasto', 'Gastos operacionales y no operacionales'),
-- GASTOS NIVEL 2
('51', 'COSTO DE VENTAS', 2, 'Gasto', 'Costo directo de productos vendidos'),
('52', 'GASTOS OPERACIONALES', 2, 'Gasto', 'Gastos de administración y ventas'),
('53', 'GASTOS NO OPERACIONALES', 2, 'Gasto', 'Gastos financieros y otros'),
-- GASTOS NIVEL 3 y 4 - Clasificación fiscal boliviana
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

ON CONFLICT (codigo) DO UPDATE SET 
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  nivel = EXCLUDED.nivel,
  tipo = EXCLUDED.tipo;

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