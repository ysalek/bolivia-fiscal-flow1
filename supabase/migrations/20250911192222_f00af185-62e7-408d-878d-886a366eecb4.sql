-- Eliminar la vista existente con problemas de seguridad
DROP VIEW IF EXISTS public.financial_security_dashboard;

-- Crear función de seguridad para obtener datos del dashboard financiero
CREATE OR REPLACE FUNCTION public.get_financial_security_dashboard()
RETURNS TABLE (
    access_date timestamp with time zone,
    total_accesses bigint,
    high_risk_accesses bigint,
    medium_risk_accesses bigint,
    low_risk_accesses bigint,
    unique_users_accessing bigint,
    average_risk_score integer,
    tables_accessed text,
    operations_performed text
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    -- Solo los administradores pueden ver el dashboard de seguridad
    SELECT 
        date_trunc('day', fal.timestamp) AS access_date,
        count(*) AS total_accesses,
        count(*) FILTER (WHERE fal.risk_score > 70) AS high_risk_accesses,
        count(*) FILTER (WHERE fal.risk_score >= 40 AND fal.risk_score <= 70) AS medium_risk_accesses,
        count(*) FILTER (WHERE fal.risk_score < 40) AS low_risk_accesses,
        count(DISTINCT fal.user_id) AS unique_users_accessing,
        avg(fal.risk_score)::integer AS average_risk_score,
        string_agg(DISTINCT fal.table_name, ', ') AS tables_accessed,
        string_agg(DISTINCT fal.operation, ', ') AS operations_performed
    FROM financial_access_log fal
    WHERE fal.timestamp >= (now() - interval '30 days')
    AND public.has_role(auth.uid(), 'admin'::app_role)  -- Solo admins pueden ver estos datos
    GROUP BY date_trunc('day', fal.timestamp)
    ORDER BY date_trunc('day', fal.timestamp) DESC;
$$;

-- Crear una nueva vista segura que usa la función
CREATE VIEW public.financial_security_dashboard_secure AS
SELECT * FROM public.get_financial_security_dashboard();

-- Crear política RLS para la nueva vista (aunque las funciones ya controlan el acceso)
ALTER VIEW public.financial_security_dashboard_secure OWNER TO postgres;

-- Comentario para documentar el cambio de seguridad
COMMENT ON FUNCTION public.get_financial_security_dashboard() IS 
'Función segura para obtener datos del dashboard de seguridad financiera. Solo accesible para administradores.';

COMMENT ON VIEW public.financial_security_dashboard_secure IS 
'Vista segura del dashboard financiero que reemplaza la vista anterior con problemas de seguridad.';