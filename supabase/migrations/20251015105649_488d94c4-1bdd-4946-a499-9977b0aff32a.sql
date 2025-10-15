-- Corregir funciones sin search_path y mejorar seguridad de empleados
-- Actualizar la función update_proveedores_updated_at con search_path
CREATE OR REPLACE FUNCTION public.update_proveedores_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Actualizar la función handle_updated_at con search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Actualizar la función touch_updated_at con search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Eliminar TODAS las políticas existentes de empleados
DROP POLICY IF EXISTS "Users can manage their own empleados" ON public.empleados;
DROP POLICY IF EXISTS "Users can view basic employee info" ON public.empleados;
DROP POLICY IF EXISTS "Only admins can create employees" ON public.empleados;
DROP POLICY IF EXISTS "Only admins can update employees" ON public.empleados;
DROP POLICY IF EXISTS "Only admins can delete employees" ON public.empleados;

-- Crear nuevas políticas restrictivas para empleados
-- Solo admins pueden ver todos los datos de empleados
CREATE POLICY "Admins can view all employee data"
ON public.empleados
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Solo admins pueden crear empleados
CREATE POLICY "Admins can create employees"
ON public.empleados
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Solo admins pueden actualizar empleados
CREATE POLICY "Admins can update employees"
ON public.empleados
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Solo admins pueden eliminar empleados
CREATE POLICY "Admins can delete employees"
ON public.empleados
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Comentar que los datos sensibles están protegidos
COMMENT ON TABLE public.empleados IS 'Tabla de empleados. Todos los datos solo accesibles para administradores debido a información sensible (CI, salarios, datos personales).';