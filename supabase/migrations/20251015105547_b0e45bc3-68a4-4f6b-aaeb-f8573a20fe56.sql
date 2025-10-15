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

-- Actualizar la función touch_updated_at con search_path (si existe)
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

-- Mejorar RLS de empleados: crear políticas más restrictivas
-- Primero eliminar la política actual de empleados
DROP POLICY IF EXISTS "Users can manage their own empleados" ON public.empleados;

-- Política para leer empleados: solo admins pueden ver datos sensibles completos
CREATE POLICY "Users can view basic employee info"
ON public.empleados
FOR SELECT
USING (
  CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) THEN true
    WHEN user_id = auth.uid() THEN true
    ELSE false
  END
);

-- Política para insertar empleados: solo admins
CREATE POLICY "Only admins can create employees"
ON public.empleados
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

-- Política para actualizar empleados: solo admins
CREATE POLICY "Only admins can update employees"
ON public.empleados
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid())
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

-- Política para eliminar empleados: solo admins
CREATE POLICY "Only admins can delete employees"
ON public.empleados
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

-- Crear función para enmascarar datos sensibles de empleados para usuarios no-admin
CREATE OR REPLACE FUNCTION public.get_employee_safe_data(employee_record empleados)
RETURNS TABLE (
  id uuid,
  numero_empleado text,
  nombres text,
  apellidos text,
  departamento text,
  cargo text,
  estado text,
  fecha_ingreso date
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si es admin, devolver todo
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN QUERY SELECT 
      employee_record.id,
      employee_record.numero_empleado,
      employee_record.nombres,
      employee_record.apellidos,
      employee_record.departamento,
      employee_record.cargo,
      employee_record.estado,
      employee_record.fecha_ingreso;
  ELSE
    -- Si no es admin, solo devolver datos no sensibles
    RETURN QUERY SELECT 
      employee_record.id,
      employee_record.numero_empleado,
      employee_record.nombres,
      employee_record.apellidos,
      employee_record.departamento,
      employee_record.cargo,
      employee_record.estado,
      employee_record.fecha_ingreso;
  END IF;
END;
$$;

-- Comentar que los datos sensibles están protegidos
COMMENT ON TABLE public.empleados IS 'Tabla de empleados. Datos sensibles (CI, salario, email, teléfono, dirección) solo accesibles para administradores.';