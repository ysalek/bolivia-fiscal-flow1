-- Insertar Plan de Cuentas Boliviano 2025 - Corregido sin duplicados
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
('1211', 'Muebles y Enseres', 4, 'Activo', 'Mobiliario de oficina'),
('1212', 'Equipos de Computación', 4, 'Activo', 'Hardware y software'),
('1213', 'Vehículos', 4, 'Activo', 'Parque automotor')
ON CONFLICT (codigo) DO NOTHING;

-- Continuar con PASIVOS
INSERT INTO public.plan_cuentas_2025 (codigo, nombre, nivel, tipo, descripcion) VALUES 
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
('2134', 'Aguinaldos por Pagar', 4, 'Pasivo', 'Segundo aguinaldo')
ON CONFLICT (codigo) DO NOTHING;