
import { AsientoContable } from "@/components/contable/diary/DiaryData";
import { MovimientoInventario } from "@/components/contable/inventory/InventoryData";
import { useAsientos } from "./useAsientos";
import { useReportesContables } from "./useReportesContables";
import { useProductos } from "./useProductos";
import { useAsientosGenerator } from "./useAsientosGenerator";
import type { 
  TrialBalanceDetail, 
  TrialBalanceTotals, 
  BalanceSheetAccount,
  BalanceSheetData, 
  IncomeStatementData, 
  DeclaracionIVAData 
} from "./useReportesContables";
import type { Producto } from "@/components/contable/products/ProductsData";
import type { Factura } from "@/components/contable/billing/BillingData";
import type { Compra } from "@/components/contable/purchases/PurchasesData";

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
export type { Compra } from "@/components/contable/purchases/PurchasesData";

export interface ContabilidadIntegrationHook {
  generarAsientoInventario: (movimiento: MovimientoInventario) => AsientoContable | null;
  generarAsientoVenta: (factura: any) => AsientoContable | null;
  generarAsientoCompra: (compra: { numero: string, total: number, subtotal: number, iva: number }) => AsientoContable | null;
  generarAsientoPagoCompra: (compra: Compra) => AsientoContable | null;
  generarAsientoPagoFactura: (factura: Factura) => AsientoContable | null;
  generarAsientoAnulacionFactura: (factura: Factura) => AsientoContable[] | null;
  guardarAsiento: (asiento: AsientoContable) => boolean;
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
  const { getAsientos, guardarAsiento, validarTransaccion } = useAsientos();
  const reportesHook = useReportesContables();
  const { obtenerProductos, actualizarStockProducto } = useProductos();
  const {
    generarAsientoInventario,
    generarAsientoVenta,
    generarAsientoCompra,
    generarAsientoPagoCompra,
    generarAsientoPagoFactura,
    generarAsientoAnulacionFactura,
  } = useAsientosGenerator();

  const obtenerBalanceGeneral = () => {
    const { activos, pasivos, patrimonio } = reportesHook.getBalanceSheetData();
    return {
      activos: activos.total,
      pasivos: pasivos.total,
      patrimonio: patrimonio.total,
    };
  };

  return {
    generarAsientoInventario,
    generarAsientoVenta,
    generarAsientoCompra,
    generarAsientoPagoCompra,
    generarAsientoPagoFactura,
    generarAsientoAnulacionFactura,
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
