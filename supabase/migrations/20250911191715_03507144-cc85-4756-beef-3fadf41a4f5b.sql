-- Limpiar productos antiguos (mantener solo algunos de ejemplo)
DELETE FROM productos WHERE user_id != (SELECT auth.uid()) AND created_at < NOW() - INTERVAL '1 day';

-- Limpiar categorías antiguas
DELETE FROM categorias_productos WHERE user_id != (SELECT auth.uid()) AND created_at < NOW() - INTERVAL '1 day';

-- Crear categorías básicas para el usuario actual
INSERT INTO categorias_productos (user_id, nombre, descripcion, activo) 
VALUES 
  ((SELECT auth.uid()), 'General', 'Productos generales', true),
  ((SELECT auth.uid()), 'Servicios', 'Servicios prestados', true),
  ((SELECT auth.uid()), 'Materiales', 'Materiales y suministros', true)
ON CONFLICT DO NOTHING;

-- Crear algunos productos de ejemplo para el usuario actual
WITH categoria_general AS (
  SELECT id FROM categorias_productos 
  WHERE user_id = (SELECT auth.uid()) AND nombre = 'General' 
  LIMIT 1
)
INSERT INTO productos (
  user_id, codigo, nombre, descripcion, categoria_id, 
  unidad_medida, precio_venta, precio_compra, costo_unitario,
  stock_actual, stock_minimo, activo
)
SELECT 
  (SELECT auth.uid()),
  'PROD001',
  'Producto de Prueba',
  'Producto para probar el sistema',
  categoria_general.id,
  'PZA',
  100.00,
  80.00,
  80.00,
  10,
  5,
  true
FROM categoria_general
ON CONFLICT DO NOTHING;