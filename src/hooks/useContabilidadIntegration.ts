
import { useToast } from "@/hooks/use-toast";
import { AsientoContable, CuentaAsiento } from "@/components/contable/diary/DiaryData";
import { MovimientoInventario } from "@/components/contable/inventory/InventoryData";
import { Producto } from "@/components/contable/products/ProductsData";
import { useAsientos } from "./useAsientos";
import { useReportesContables, BalanceSheetData, IncomeStatementData, DeclaracionIVAData, TrialBalanceDetail, TrialBalanceTotals } from "./useReportesContables";

// Re-export types to avoid breaking changes in other modules after refactoring
export type { 
  TrialBalanceDetail, 
  TrialBalanceTotals, 
  BalanceSheetAccount,
  BalanceSheetData, 
  IncomeStatementData, 
  DeclaracionIVAData 
} from "./useReportesContables";

export interface ContabilidadIntegrationHook {
  generarAsientoInventario: (movimiento: MovimientoInventario) => AsientoContable;
  generarAsientoVenta: (factura: any) => AsientoContable;
  generarAsientoCompra: (compra: any) => AsientoContable;
  guardarAsiento: (asiento: AsientoContable) => void;
  getAsientos: () => AsientoContable[];
  getLibroMayor: () => { [key: string]: { nombre: string, codigo: string, movimientos: any[], totalDebe: number, totalHaber: number } };
  getTrialBalanceData: () => { details: TrialBalanceDetail[], totals: TrialBalanceTotals };
  actualizarStockProducto: (productoId: string, cantidad: number, tipo: 'entrada' | 'salida') => boolean;
  obtenerProductos: () => Producto[];
  validarTransaccion: (asiento: AsientoContable) => boolean;
  obtenerBalanceGeneral: () => { activos: number; pasivos: number; patrimonio: number };
  getBalanceSheetData: () => BalanceSheetData;
  getIncomeStatementData: () => IncomeStatementData;
  getDeclaracionIVAData: (fechas: { fechaInicio: string, fechaFin: string }) => DeclaracionIVAData;
}

export const useContabilidadIntegration = (): ContabilidadIntegrationHook => {
  const { toast } = useToast();
  const { getAsientos: getAsientosFromHook } = useAsientos();
  const reportesHook = useReportesContables();

  const validarTransaccion = (asiento: AsientoContable): boolean => {
    const totalDebe = asiento.cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0);
    const totalHaber = asiento.cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0);
    
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      console.error("Error: El asiento no está balanceado", { totalDebe, totalHaber });
      return false;
    }
    
    return true;
  };

  const guardarAsiento = (asiento: AsientoContable) => {
    if (!validarTransaccion(asiento)) {
      toast({
        title: "Error en el asiento contable",
        description: "El asiento no está balanceado. Debe = Haber",
        variant: "destructive"
      });
      return;
    }

    const asientosExistentes = JSON.parse(localStorage.getItem('asientosContables') || '[]');
    const nuevosAsientos = [asiento, ...asientosExistentes];
    localStorage.setItem('asientosContables', JSON.stringify(nuevosAsientos));
    
    console.log("Asiento guardado correctamente:", asiento);
    
    toast({
      title: "Asiento contable registrado",
      description: `Asiento ${asiento.numero} registrado exitosamente`,
    });
  };

  const getAsientos = (): AsientoContable[] => {
    return getAsientosFromHook();
  };

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
      
      // Evitar stock negativo
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
      
      // Alerta de stock bajo
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

  const obtenerBalanceGeneral = () => {
    const asientos = getAsientos();
    let activos = 0;
    let pasivos = 0;
    let patrimonio = 0;

    asientos.forEach(asiento => {
      if (asiento.estado === 'registrado') {
        asiento.cuentas.forEach(cuenta => {
          const codigo = cuenta.codigo;
          const saldoNeto = cuenta.debe - cuenta.haber;
          
          if (codigo.startsWith('1')) { // Activos
            activos += saldoNeto;
          } else if (codigo.startsWith('2')) { // Pasivos
            pasivos += saldoNeto;
          } else if (codigo.startsWith('3')) { // Patrimonio
            patrimonio += saldoNeto;
          }
        });
      }
    });

    return { activos, pasivos, patrimonio };
  };

  const generarAsientoInventario = (movimiento: MovimientoInventario): AsientoContable => {
    const cuentas: CuentaAsiento[] = [];
    const fecha = new Date().toISOString().slice(0, 10);
    
    if (movimiento.tipo === 'entrada') {
      cuentas.push({
        codigo: "1141",
        nombre: "Inventarios",
        debe: movimiento.valorMovimiento,
        haber: 0
      });
      
      cuentas.push({
        codigo: "2111",
        nombre: "Cuentas por Pagar",
        debe: 0,
        haber: movimiento.valorMovimiento
      });

      if (movimiento.productoId) {
        actualizarStockProducto(movimiento.productoId, movimiento.cantidad, 'entrada');
      }
    } else if (movimiento.tipo === 'salida') {
      cuentas.push({
        codigo: "5111",
        nombre: "Costo de Productos Vendidos",
        debe: movimiento.valorMovimiento,
        haber: 0
      });
      
      cuentas.push({
        codigo: "1141",
        nombre: "Inventarios",
        debe: 0,
        haber: movimiento.valorMovimiento
      });

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

    cuentas.push({
      codigo: "1131",
      nombre: "Cuentas por Cobrar",
      debe: totalConIVA,
      haber: 0
    });

    cuentas.push({
      codigo: "4111",
      nombre: "Ventas de Productos",
      debe: 0,
      haber: subtotal
    });

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
    const totalConIVA = compra.total * 1.13;
    const ivaCompra = totalConIVA - compra.total;

    cuentas.push({
      codigo: "1141",
      nombre: "Inventarios",
      debe: compra.total,
      haber: 0
    });

    cuentas.push({
      codigo: "2114",
      nombre: "IVA Crédito Fiscal",
      debe: ivaCompra,
      haber: 0
    });

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
    getLibroMayor: reportesHook.getLibroMayor,
    getTrialBalanceData: reportesHook.getTrialBalanceData,
    actualizarStockProducto,
    obtenerProductos,
    validarTransaccion,
    obtenerBalanceGeneral,
    getBalanceSheetData: reportesHook.getBalanceSheetData,
    getIncomeStatementData: reportesHook.getIncomeStatementData,
    getDeclaracionIVAData: reportesHook.getDeclaracionIVAData
  };
};
