
import { useToast } from "@/hooks/use-toast";
import { AsientoContable, CuentaAsiento } from "@/components/contable/diary/DiaryData";
import { MovimientoInventario } from "@/components/contable/inventory/InventoryData";

export interface ContabilidadIntegrationHook {
  generarAsientoInventario: (movimiento: MovimientoInventario) => AsientoContable;
  generarAsientoVenta: (factura: any) => AsientoContable;
  generarAsientoCompra: (compra: any) => AsientoContable;
}

export const useContabilidadIntegration = (): ContabilidadIntegrationHook => {
  const { toast } = useToast();

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
    }

    const asiento: AsientoContable = {
      id: Date.now().toString(),
      numero: `AST-${Date.now().toString().slice(-3)}`,
      fecha,
      concepto: `${movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'} de inventario - ${movimiento.producto}`,
      referencia: movimiento.documento,
      debe: movimiento.valorMovimiento,
      haber: movimiento.valorMovimiento,
      estado: 'registrado',
      cuentas
    };

    return asiento;
  };

  const generarAsientoVenta = (factura: any): AsientoContable => {
    const cuentas: CuentaAsiento[] = [];
    const fecha = new Date().toISOString().slice(0, 10);
    const totalConIVA = factura.total * 1.13; // IVA 13%
    const ivaVenta = totalConIVA - factura.total;

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
      haber: factura.total
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
      numero: `AST-${Date.now().toString().slice(-3)}`,
      fecha,
      concepto: `Venta según factura ${factura.numero}`,
      referencia: factura.numero,
      debe: totalConIVA,
      haber: totalConIVA,
      estado: 'registrado',
      cuentas
    };

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
      numero: `AST-${Date.now().toString().slice(-3)}`,
      fecha,
      concepto: `Compra según factura ${compra.numero}`,
      referencia: compra.numero,
      debe: totalConIVA,
      haber: totalConIVA,
      estado: 'registrado',
      cuentas
    };

    return asiento;
  };

  return {
    generarAsientoInventario,
    generarAsientoVenta,
    generarAsientoCompra
  };
};
