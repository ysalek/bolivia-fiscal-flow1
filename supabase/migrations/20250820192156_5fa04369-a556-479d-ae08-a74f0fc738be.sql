-- Corregir códigos de activos fijos - deben empezar con 121 no 1210
UPDATE public.plan_cuentas_2025 SET 
  codigo = '1210', 
  nombre = 'Muebles y Enseres',
  descripcion = 'Mobiliario de oficina'
WHERE codigo = '1210' AND descripcion = 'Mobiliario de oficina';

-- Como hay conflicto, usar códigos correctos para activos fijos
INSERT INTO public.plan_cuentas_2025 (codigo, nombre, nivel, tipo, descripcion) VALUES 
('1211', 'Muebles y Enseres', 4, 'Activo', 'Mobiliario de oficina'),
('1212', 'Equipos de Computación', 4, 'Activo', 'Hardware y software'),
('1213', 'Vehículos', 4, 'Activo', 'Parque automotor'),
('1214', 'Edificios', 4, 'Activo', 'Construcciones y edificaciones'),
('1215', 'Maquinaria y Equipo', 4, 'Activo', 'Maquinarias de producción')
ON CONFLICT (codigo) DO UPDATE SET 
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion;