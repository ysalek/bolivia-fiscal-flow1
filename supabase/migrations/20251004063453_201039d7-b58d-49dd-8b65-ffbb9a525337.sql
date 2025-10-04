-- Agregar columnas faltantes a la tabla proveedores existente
ALTER TABLE public.proveedores
  ADD COLUMN IF NOT EXISTS codigo TEXT,
  ADD COLUMN IF NOT EXISTS saldo_deuda NUMERIC DEFAULT 0;

-- Crear índice para codigo si no existe
CREATE INDEX IF NOT EXISTS idx_proveedores_codigo ON public.proveedores(codigo);

-- Actualizar la tabla compras para agregar columnas de control de pagos
ALTER TABLE public.compras
  ADD COLUMN IF NOT EXISTS tipo_pago TEXT DEFAULT 'contado',
  ADD COLUMN IF NOT EXISTS monto_pagado NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS saldo_pendiente NUMERIC DEFAULT 0;

-- Agregar constraint para tipo_pago si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'compras_tipo_pago_check'
  ) THEN
    ALTER TABLE public.compras
      ADD CONSTRAINT compras_tipo_pago_check 
      CHECK (tipo_pago IN ('contado', 'credito'));
  END IF;
END $$;

-- Trigger para actualizar updated_at en proveedores
CREATE OR REPLACE FUNCTION update_proveedores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_proveedores_updated_at ON public.proveedores;
CREATE TRIGGER trigger_update_proveedores_updated_at
  BEFORE UPDATE ON public.proveedores
  FOR EACH ROW
  EXECUTE FUNCTION update_proveedores_updated_at();