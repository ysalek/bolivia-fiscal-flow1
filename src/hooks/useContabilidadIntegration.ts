
import { AsientoContable, CuentaAsiento } from "@/components/contable/diary/DiaryData";
import { MovimientoInventario } from "@/components/contable/inventory/InventoryData";
import { useAsientos } from "./useAsientos";
import { useReportesContables } from "./useReportesContables";
import { useProductos } from "./useProductos";

// Re-export types to avoid breaking changes in other modules after refactoring
export type { 
  TrialBalanceDetail, 
  TrialBalanceTotals, 
  BalanceSheetAccount,
  BalanceSheetData, 
  IncomeStatementData, 
  DeclaracionIVAData 
} from "./useReportesContables";
export type { Producto } from "@/components/contable/products/ProductsData";

export interface ContabilidadIntegrationHook {
  generarAsientoInventario: (movimiento: MovimientoInventario) => AsientoContable;
  generarAsientoVenta: (factura: any) => AsientoContable;
  generarAsientoCompra: (compra: any) => AsientoContable;
  guardarAsiento: (asiento: AsientoContable) => void;
  getAsientos: () => AsientoContable[];
  getLibroMayor: () => { [key: string]: { nombre: string, codigo: string, movimientos: any[], totalDebe: number, totalHaber: number } };
  getTrialBalanceData: () => { details: TrialBalanceDetail[], totals: TrialBalanceTotals };
  actualizarStockProducto: (productoId: string, cantidad: number, tipo: 'entrada' | 'salida') => boolean;
  obtenerProductos: () => any[]; // Usar any[] para ser compatible con Producto[]
  validarTransaccion: (asiento: AsientoContable) => boolean;
  obtenerBalanceGeneral: () => { activos: number; pasivos: number; patrimonio: number };
  getBalanceSheetData: () => BalanceSheetData;
  getIncomeStatementData: () => IncomeStatementData;
  getDeclaracionIVAData: (fechas: { fechaInicio: string, fechaFin: string }) => DeclaracionIVAData;
}

export const useContabilidadIntegration = (): ContabilidadIntegrationHook => {
  const { getAsientos, guardarAsiento, validarTransaccion } = useAsientos();
  const reportesHook = useReportesContables();
  const { obtenerProductos, actualizarStockProducto } = useProductos();

  const obtenerBalanceGeneral = () => {
    const { activos, pasivos, patrimonio } = reportesHook.getBalanceSheetData();
    return {
      activos: activos.total,
      pasivos: pasivos.total,
      patrimonio: patrimonio.total,
    };
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
