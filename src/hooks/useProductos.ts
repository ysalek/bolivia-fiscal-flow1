
import { useSupabaseProductos } from "@/hooks/useSupabaseProductos";

export const useProductos = () => {
  const { productos, actualizarStockProducto: actualizarStockSupabase } = useSupabaseProductos();

  const obtenerProductos = () => {
    // Convertir productos de Supabase al formato esperado
    return productos.map(producto => ({
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria_id || 'General',
      unidadMedida: producto.unidad_medida,
      precioVenta: producto.precio_venta,
      precioCompra: producto.precio_compra,
      costoUnitario: producto.costo_unitario,
      stockActual: producto.stock_actual,
      stockMinimo: producto.stock_minimo,
      codigoSIN: producto.codigo_sin || '00000000',
      activo: producto.activo,
      fechaCreacion: producto.created_at?.split('T')[0] || new Date().toISOString().slice(0, 10),
      fechaActualizacion: producto.updated_at?.split('T')[0] || new Date().toISOString().slice(0, 10),
      imagenUrl: producto.imagen_url
    }));
  };

  const actualizarStockProducto = async (productoId: string, cantidad: number, tipo: 'entrada' | 'salida'): Promise<boolean> => {
    return await actualizarStockSupabase(productoId, cantidad, tipo);
  };

  return { obtenerProductos, actualizarStockProducto };
};
