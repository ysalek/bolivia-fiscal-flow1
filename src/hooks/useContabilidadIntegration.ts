
import { useToast } from "@/hooks/use-toast";
import { AsientoContable, CuentaAsiento } from "@/components/contable/diary/DiaryData";
import { MovimientoInventario } from "@/components/contable/inventory/InventoryData";
import { Producto } from "@/components/contable/products/ProductsData";

export interface ContabilidadIntegrationHook {
  generarAsientoInventario: (movimiento: MovimientoInventario) => AsientoContable;
  generarAsientoVenta: (factura: any) => AsientoContable;
  generarAsientoCompra: (compra: any) => AsientoContable;
  guardarAsiento: (asiento: AsientoContable) => void;
  getAsientos: () => AsientoContable[];
  actualizarStockProducto: (productoId: string, cantidad: number, tipo: 'entrada' | 'salida') => void;
  obtenerProductos: () => Producto[];
}

export const useContabilidadIntegration = (): ContabilidadIntegrationHook => {
  const { toast } = useToast();

  const guardarAsiento = (asiento: AsientoContable) => {
    const asientosExistentes = JSON.parse(localStorage.getItem('asientosContables') || '[]');
    const nuevosAsientos = [asiento, ...asientosExistentes];
    localStorage.setItem('asientosContables', JSON.stringify(nuevosAsientos));
    
    console.log("Asiento guardado en localStorage:", asiento);
  };

  const getAsientos = (): AsientoContable[] => {
    return JSON.parse(localStorage.getItem('asientosContables') || '[]');
  };

  const obtenerProductos = (): Producto[] => {
    return JSON.parse(localStorage.getItem('productos') || '[]');
  };

  const actualizarStockProducto = (productoId: string, cantidad: number, tipo: 'entrada' | 'salida') => {
    const productos = obtenerProductos();
    const productoIndex = productos.findIndex(p => p.id === productoId);
    
    if (productoIndex !== -1) {
      const producto = productos[productoIndex];
      const nuevaCantidad = tipo === 'entrada' 
        ? producto.stockActual + cantidad 
        : producto.stockActual - cantidad;
      
      // Evitar stock negativo
      if (nuevaCantidad < 0) {
        toast({
          title: "Error de stock",
          description: `No hay suficiente stock para ${producto.nombre}. Stock actual: ${producto.stockActual}`,
          variant: "destructive"
        });
        return;
      }
      
      productos[productoIndex] = {
        ...producto,
        stockActual: nuevaCantidad,
        fechaActualizacion: new Date().toISOString().slice(0, 10)
      };
      
      localStorage.setItem('productos', JSON.stringify(productos));
      
      // Alerta de stock bajo
      if (nuevaCantidad <= producto.stockMinimo && nuevaCantidad > 0) {
        toast({
          title: "Stock bajo",
          description: `El producto ${producto.nombre} tiene stock bajo (${nuevaCantidad} unidades)`,
          variant: "destructive"
        });
      }
    }
  };

  const generarAsientoInventario = (movimiento: MovimientoInventario): AsientoContable => {
    const cuentas: CuentaAsiento[] = [];
    const fecha = new Date().toISOString().slice(0, 10);
    
    if (movimiento.tipo === 'entrada') {
      // Débito: Inventarios
      cuentas.push({
        codigo: "1141",
        nombre: "Inventarios",
        debe: movimiento.valorMovimiento,
        haber: 0
      });
      
      // Crédito: Cuentas por Pagar (asumiendo compra a crédito)
      cuentas.push({
        codigo: "2111",
        nombre: "Cuentas por Pagar",
        debe: 0,
        haber: movimiento.valorMovimiento
      });

      // Actualizar stock del producto
      if (movimiento.productoId) {
        actualizarStockProducto(movimiento.productoId, movimiento.cantidad, 'entrada');
      }
    } else if (movimiento.tipo === 'salida') {
      // Débito: Costo de Productos Vendidos
      cuentas.push({
        codigo: "5111",
        nombre: "Costo de Productos Vendidos",
        debe: movimiento.valorMovimiento,
        haber: 0
      });
      
      // Crédito: Inventarios
      cuentas.push({
        codigo: "1141",
        nombre: "Inventarios",
        debe: 0,
        haber: movimiento.valorMovimiento
      });

      // Actualizar stock del producto
      if (movimiento.productoId) {
        actualizarStockProducto(movimiento.productoId, movimiento.cantidad, 'salida');
      }
    }

    const asiento: AsientoContable = {
      id: Date.now().toString(),
      numero: `AST-${Date.now().toString().slice(-6)}`,
      fecha,
      concepto: `${movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'} de inventario - ${movimiento.producto}`,
      referencia: movimiento.documento,
      debe: movimiento.valorMovimiento,
      haber: movimiento.valorMovimiento,
      estado: 'registrado',
      cuentas
    };

    guardarAsiento(asiento);
    return asiento;
  };

  const generarAsientoVenta = (factura: any): AsientoContable => {
    const cuentas: CuentaAsiento[] = [];
    const fecha = new Date().toISOString().slice(0, 10);
    const totalConIVA = factura.total;
    const subtotal = factura.subtotal;
    const ivaVenta = factura.iva;

    // Débito: Cuentas por Cobrar o Caja
    cuentas.push({
      codigo: "1131",
      nombre: "Cuentas por Cobrar",
      debe: totalConIVA,
      haber: 0
    });

    // Crédito: Ventas
    cuentas.push({
      codigo: "4111",
      nombre: "Ventas de Productos",
      debe: 0,
      haber: subtotal
    });

    // Crédito: IVA por Pagar
    cuentas.push({
      codigo: "2113",
      nombre: "IVA por Pagar",
      debe: 0,
      haber: ivaVenta
    });

    const asiento: AsientoContable = {
      id: Date.now().toString(),
      numero: `VTA-${Date.now().toString().slice(-6)}`,
      fecha,
      concepto: `Venta según factura ${factura.numero}`,
      referencia: factura.numero,
      debe: totalConIVA,
      haber: totalConIVA,
      estado: 'registrado',
      cuentas
    };

    guardarAsiento(asiento);
    return asiento;
  };

  const generarAsientoCompra = (compra: any): AsientoContable => {
    const cuentas: CuentaAsiento[] = [];
    const fecha = new Date().toISOString().slice(0, 10);
    const totalConIVA = compra.total * 1.13; // IVA 13%
    const ivaCompra = totalConIVA - compra.total;

    // Débito: Inventarios o Gastos
    cuentas.push({
      codigo: "1141",
      nombre: "Inventarios",
      debe: compra.total,
      haber: 0
    });

    // Débito: IVA Crédito Fiscal
    cuentas.push({
      codigo: "2114",
      nombre: "IVA Crédito Fiscal",
      debe: ivaCompra,
      haber: 0
    });

    // Crédito: Cuentas por Pagar
    cuentas.push({
      codigo: "2111",
      nombre: "Cuentas por Pagar",
      debe: 0,
      haber: totalConIVA
    });

    const asiento: AsientoContable = {
      id: Date.now().toString(),
      numero: `CMP-${Date.now().toString().slice(-6)}`,
      fecha,
      concepto: `Compra según factura ${compra.numero}`,
      referencia: compra.numero,
      debe: totalConIVA,
      haber: totalConIVA,
      estado: 'registrado',
      cuentas
    };

    guardarAsiento(asiento);
    return asiento;
  };

  return {
    generarAsientoInventario,
    generarAsientoVenta,
    generarAsientoCompra,
    guardarAsiento,
    getAsientos,
    actualizarStockProducto,
    obtenerProductos
  };
};
