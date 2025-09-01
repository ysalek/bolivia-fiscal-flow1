import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSystemReset = () => {
  const { toast } = useToast();

  const resetearSistemaCompleto = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // 1. Primero eliminar registros dependientes
      
      // Obtener IDs para eliminaciones en cascada
      const asientosIds = (await supabase
        .from('asientos_contables')
        .select('id')
        .eq('user_id', user.id)
      ).data?.map(a => a.id) || [];
      
      const facturasIds = (await supabase
        .from('facturas')
        .select('id')
        .eq('user_id', user.id)
      ).data?.map(f => f.id) || [];
      
      const comprasIds = (await supabase
        .from('compras')
        .select('id')
        .eq('user_id', user.id)
      ).data?.map(c => c.id) || [];
      
      const presupuestosIds = (await supabase
        .from('presupuestos')
        .select('id')
        .eq('user_id', user.id)
      ).data?.map(p => p.id) || [];

      // Eliminar registros dependientes primero
      if (asientosIds.length > 0) {
        await supabase
          .from('cuentas_asientos')
          .delete()
          .in('asiento_id', asientosIds);
      }
      
      if (facturasIds.length > 0) {
        await supabase
          .from('items_facturas')
          .delete()
          .in('factura_id', facturasIds);
      }
      
      if (comprasIds.length > 0) {
        await supabase
          .from('items_compras')
          .delete()
          .in('compra_id', comprasIds);
      }
      
      if (presupuestosIds.length > 0) {
        await supabase
          .from('items_presupuestos')
          .delete()
          .in('presupuesto_id', presupuestosIds);
      }

      // 2. Eliminar registros principales
      await supabase
        .from('asientos_contables')
        .delete()
        .eq('user_id', user.id);

      await supabase
        .from('facturas')
        .delete()
        .eq('user_id', user.id);

      await supabase
        .from('compras')
        .delete()
        .eq('user_id', user.id);

      await supabase
        .from('presupuestos')
        .delete()
        .eq('user_id', user.id);

      // 3. Eliminar todas las demás tablas
      await supabase
        .from('productos')
        .delete()
        .eq('user_id', user.id);

      await supabase
        .from('movimientos_inventario')
        .delete()
        .eq('user_id', user.id);
      await supabase
        .from('clientes')
        .delete()
        .eq('user_id', user.id);

      await supabase
        .from('proveedores')
        .delete()
        .eq('user_id', user.id);

      await supabase
        .from('categorias_productos')
        .delete()
        .eq('user_id', user.id);

      await supabase
        .from('plan_cuentas')
        .delete()
        .eq('user_id', user.id);
      await supabase
        .from('empleados')
        .delete()
        .eq('user_id', user.id);

      // Limpiar activos fijos
      await supabase
        .from('activos_fijos')
        .delete()
        .eq('user_id', user.id);

      // Limpiar pagos
      await supabase
        .from('pagos')
        .delete()
        .eq('user_id', user.id);

      // Limpiar cuentas bancarias
      await supabase
        .from('cuentas_bancarias')
        .delete()
        .eq('user_id', user.id);

      // Limpiar movimientos bancarios
      await supabase
        .from('movimientos_bancarios')
        .delete()
        .eq('user_id', user.id);

      // Limpiar datos de localStorage (para compatibilidad con datos antiguos)
      localStorage.removeItem('productos');
      localStorage.removeItem('facturas');
      localStorage.removeItem('compras');
      localStorage.removeItem('clientes');
      localStorage.removeItem('proveedores');
      localStorage.removeItem('asientosContables');
      localStorage.removeItem('planCuentas');
      localStorage.removeItem('empleados');
      localStorage.removeItem('movimientosBanco');
      localStorage.removeItem('movimientosBancarios');

      toast({
        title: "Sistema reseteado completamente",
        description: "Todos los datos han sido eliminados. El sistema está listo para empezar de nuevo.",
        variant: "default"
      });

      // Recargar la página para asegurar que todos los componentes se actualicen
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      return true;
    } catch (error: any) {
      console.error('Error al resetear sistema:', error);
      toast({
        title: "Error al resetear sistema",
        description: error.message || "Hubo un problema al limpiar los datos",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    resetearSistemaCompleto
  };
};