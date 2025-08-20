-- Corregir códigos duplicados en activos fijos
DELETE FROM public.plan_cuentas_2025 WHERE codigo IN ('1211', '1212') AND nombre IN ('Muebles y Enseres', 'Equipos de Computación');

-- Insertar activos fijos con códigos correctos
INSERT INTO public.plan_cuentas_2025 (codigo, nombre, nivel, tipo, descripcion) VALUES 
('1210', 'Muebles y Enseres', 4, 'Activo', 'Mobiliario de oficina'),
('1211', 'Equipos de Computación', 4, 'Activo', 'Hardware y software'),
('1212', 'Vehículos', 4, 'Activo', 'Parque automotor')
ON CONFLICT (codigo) DO UPDATE SET 
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion;