
import { useProductosUnificado } from "@/hooks/useProductosUnificado";

export const useProductos = () => {
  const { productos, actualizarStockProducto, obtenerProductos } = useProductosUnificado();

  return { obtenerProductos, actualizarStockProducto };
};
