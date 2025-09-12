
import { useProductosUnificado } from "@/hooks/useProductosUnificado";

export const useProductos = () => {
  const { 
    productos, 
    categorias, 
    loading, 
    crearCategoria, 
    crearProducto, 
    actualizarProducto, 
    actualizarStockProducto, 
    generarCodigoProducto, 
    refetch, 
    obtenerProductos 
  } = useProductosUnificado();

  return { 
    productos,
    categorias,
    loading,
    crearCategoria,
    crearProducto,
    actualizarProducto,
    generarCodigoProducto,
    refetch,
    obtenerProductos, 
    actualizarStockProducto 
  };
};
