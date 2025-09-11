-- Eliminar la vista problemática
DROP VIEW IF EXISTS public.financial_security_dashboard_secure;

-- Eliminar la función que también puede tener problemas
DROP FUNCTION IF EXISTS public.get_financial_security_dashboard();

-- Reemplazar con una tabla materializada que se actualiza periódicamente
-- y tiene políticas RLS adecuadas
CREATE TABLE IF NOT EXISTS public.financial_security_summary (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    access_date date NOT NULL,
    total_accesses bigint DEFAULT 0,
    high_risk_accesses bigint DEFAULT 0,
    medium_risk_accesses bigint DEFAULT 0,
    low_risk_accesses bigint DEFAULT 0,
    unique_users_accessing bigint DEFAULT 0,
    average_risk_score integer DEFAULT 0,
    tables_accessed text,
    operations_performed text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS en la nueva tabla
ALTER TABLE public.financial_security_summary ENABLE ROW LEVEL SECURITY;

-- Crear política RLS para que solo los administradores puedan ver los datos
CREATE POLICY "Only admins can view financial security summary"
ON public.financial_security_summary
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Crear función para actualizar el resumen de seguridad (sin SECURITY DEFINER en vista)
CREATE OR REPLACE FUNCTION public.update_financial_security_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Verificar que solo los administradores pueden ejecutar esta función
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Solo los administradores pueden actualizar el resumen de seguridad';
    END IF;

    -- Limpiar datos anteriores (mantener solo últimos 30 días)
    DELETE FROM public.financial_security_summary 
    WHERE access_date < CURRENT_DATE - INTERVAL '30 days';

    -- Insertar/actualizar datos del resumen
    INSERT INTO public.financial_security_summary (
        access_date, total_accesses, high_risk_accesses, medium_risk_accesses, 
        low_risk_accesses, unique_users_accessing, average_risk_score, 
        tables_accessed, operations_performed, updated_at
    )
    SELECT 
        date_trunc('day', fal.timestamp)::date AS access_date,
        count(*) AS total_accesses,
        count(*) FILTER (WHERE fal.risk_score > 70) AS high_risk_accesses,
        count(*) FILTER (WHERE fal.risk_score >= 40 AND fal.risk_score <= 70) AS medium_risk_accesses,
        count(*) FILTER (WHERE fal.risk_score < 40) AS low_risk_accesses,
        count(DISTINCT fal.user_id) AS unique_users_accessing,
        COALESCE(avg(fal.risk_score)::integer, 0) AS average_risk_score,
        string_agg(DISTINCT fal.table_name, ', ') AS tables_accessed,
        string_agg(DISTINCT fal.operation, ', ') AS operations_performed,
        now() AS updated_at
    FROM financial_access_log fal
    WHERE fal.timestamp >= (now() - interval '30 days')
    AND date_trunc('day', fal.timestamp)::date = CURRENT_DATE
    GROUP BY date_trunc('day', fal.timestamp)::date
    ON CONFLICT (access_date) DO UPDATE SET
        total_accesses = EXCLUDED.total_accesses,
        high_risk_accesses = EXCLUDED.high_risk_accesses,
        medium_risk_accesses = EXCLUDED.medium_risk_accesses,
        low_risk_accesses = EXCLUDED.low_risk_accesses,
        unique_users_accessing = EXCLUDED.unique_users_accessing,
        average_risk_score = EXCLUDED.average_risk_score,
        tables_accessed = EXCLUDED.tables_accessed,
        operations_performed = EXCLUDED.operations_performed,
        updated_at = now();
END;
$$;

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_financial_security_summary_date 
ON public.financial_security_summary(access_date DESC);

-- Comentarios para documentación
COMMENT ON TABLE public.financial_security_summary IS 
'Tabla segura para resúmenes de seguridad financiera con políticas RLS adecuadas';

COMMENT ON FUNCTION public.update_financial_security_summary() IS 
'Función para actualizar resúmenes de seguridad financiera. Solo ejecutable por administradores.';