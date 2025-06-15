
import { useToast } from "@/hooks/use-toast";
import { Producto } from "@/components/contable/products/ProductsData";

export const useProductos = () => {
  const { toast } = useToast();

  const obtenerProductos = (): Producto[] => {
    return JSON.parse(localStorage.getItem('productos') || '[]');
  };

  const actualizarStockProducto = (productoId: string, cantidad: number, tipo: 'entrada' | 'salida'): boolean => {
    try {
      const productos = obtenerProductos();
      const productoIndex = productos.findIndex(p => p.id === productoId);
      
      if (productoIndex === -1) {
        toast({
          title: "Error",
          description: "Producto no encontrado",
          variant: "destructive"
        });
        return false;
      }

      const producto = productos[productoIndex];
      const nuevaCantidad = tipo === 'entrada' 
        ? producto.stockActual + cantidad 
        : producto.stockActual - cantidad;
      
      if (nuevaCantidad < 0) {
        toast({
          title: "Error de stock",
          description: `No hay suficiente stock para ${producto.nombre}. Stock actual: ${producto.stockActual}`,
          variant: "destructive"
        });
        return false;
      }
      
      productos[productoIndex] = {
        ...producto,
        stockActual: nuevaCantidad,
        fechaActualizacion: new Date().toISOString().slice(0, 10)
      };
      
      localStorage.setItem('productos', JSON.stringify(productos));
      
      if (nuevaCantidad <= producto.stockMinimo && nuevaCantidad > 0) {
        toast({
          title: "Stock bajo",
          description: `El producto ${producto.nombre} tiene stock bajo (${nuevaCantidad} unidades)`,
          variant: "destructive"
        });
      }

      console.log(`Stock actualizado: ${producto.nombre} - ${producto.stockActual} -> ${nuevaCantidad}`);
      return true;
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      return false;
    }
  };

  return { obtenerProductos, actualizarStockProducto };
};
