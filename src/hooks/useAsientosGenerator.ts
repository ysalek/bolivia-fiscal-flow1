import { AsientoContable, CuentaAsiento } from "@/components/contable/diary/DiaryData";
import { MovimientoInventario } from "@/components/contable/inventory/InventoryData";
import { Factura } from "@/components/contable/billing/BillingData";
import { Compra } from "@/components/contable/purchases/PurchasesData";
import { useAsientos } from "./useAsientos";
import { useProductos } from "./useProductos";

export const useAsientosGenerator = () => {
  const { guardarAsiento } = useAsientos();
  const { obtenerProductos, actualizarStockProducto } = useProductos();

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
      
      if (movimiento.motivo === 'Anulación Venta') {
          cuentas.push({
              codigo: "5111",
              nombre: "Costo de Productos Vendidos",
              debe: 0,
              haber: movimiento.valorMovimiento
          });
      } else {
        cuentas.push({
          codigo: "2111",
          nombre: "Cuentas por Pagar",
          debe: 0,
          haber: movimiento.valorMovimiento
        });
      }

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

  const generarAsientoCompra = (compra: { numero: string, total: number, subtotal: number, iva: number }): AsientoContable => {
    const cuentas: CuentaAsiento[] = [];
    const fecha = new Date().toISOString().slice(0, 10);
    const totalCompra = compra.total;
    const inventarioValor = compra.subtotal;
    const ivaCreditoFiscal = compra.iva;

    cuentas.push({
      codigo: "1141",
      nombre: "Inventarios",
      debe: inventarioValor,
      haber: 0
    });

    cuentas.push({
      codigo: "1142",
      nombre: "IVA Crédito Fiscal",
      debe: ivaCreditoFiscal,
      haber: 0
    });

    cuentas.push({
      codigo: "2111",
      nombre: "Cuentas por Pagar",
      debe: 0,
      haber: totalCompra
    });

    const asiento: AsientoContable = {
      id: Date.now().toString(),
      numero: `CMP-${Date.now().toString().slice(-6)}`,
      fecha,
      concepto: `Compra según factura ${compra.numero}`,
      referencia: compra.numero,
      debe: totalCompra,
      haber: totalCompra,
      estado: 'registrado',
      cuentas
    };

    guardarAsiento(asiento);
    return asiento;
  };

  const generarAsientoPagoCompra = (compra: Compra): AsientoContable => {
    const asiento: AsientoContable = {
      id: Date.now().toString(),
      numero: `PGC-${compra.numero}`,
      fecha: new Date().toISOString().slice(0, 10),
      concepto: `Pago de compra N° ${compra.numero}`,
      referencia: compra.numero,
      debe: compra.total,
      haber: compra.total,
      estado: 'registrado',
      cuentas: [
        {
          codigo: "2111",
          nombre: "Cuentas por Pagar",
          debe: compra.total,
          haber: 0
        },
        {
          codigo: "1111",
          nombre: "Caja y Bancos",
          debe: 0,
          haber: compra.total
        }
      ]
    };
    guardarAsiento(asiento);
    return asiento;
  };

  const generarAsientoPagoFactura = (factura: Factura): AsientoContable => {
    const asiento: AsientoContable = {
      id: Date.now().toString(),
      numero: `PAG-${factura.numero}`,
      fecha: new Date().toISOString().slice(0, 10),
      concepto: `Pago de factura N° ${factura.numero}`,
      referencia: factura.numero,
      debe: factura.total,
      haber: factura.total,
      estado: 'registrado',
      cuentas: [
        {
          codigo: "1111",
          nombre: "Caja y Bancos",
          debe: factura.total,
          haber: 0
        },
        {
          codigo: "1131",
          nombre: "Cuentas por Cobrar",
          debe: 0,
          haber: factura.total
        }
      ]
    };
    guardarAsiento(asiento);
    return asiento;
  };

  const generarAsientoAnulacionFactura = (factura: Factura): AsientoContable[] => {
    // Reversión del asiento de venta
    const asientoVentaReversion: AsientoContable = {
      id: Date.now().toString(),
      numero: `ANV-${factura.numero}`,
      fecha: new Date().toISOString().slice(0, 10),
      concepto: `Anulación de venta, factura N° ${factura.numero}`,
      referencia: factura.numero,
      debe: factura.total,
      haber: factura.total,
      estado: 'registrado',
      cuentas: [
        {
          codigo: "4111",
          nombre: "Ventas de Productos",
          debe: factura.subtotal,
          haber: 0
        },
        {
          codigo: "2113",
          nombre: "IVA por Pagar",
          debe: factura.iva,
          haber: 0
        },
        {
          codigo: "1131",
          nombre: "Cuentas por Cobrar",
          debe: 0,
          haber: factura.total
        }
      ]
    };
    guardarAsiento(asientoVentaReversion);

    const asientosCosto: AsientoContable[] = [];
    factura.items.forEach(item => {
      const producto = obtenerProductos().find(p => p.id === item.productoId);
      if (producto && producto.costoUnitario > 0) {
        const valorMovimiento = item.cantidad * producto.costoUnitario;
        const movimientoInventario: MovimientoInventario = {
          id: `${Date.now().toString()}-${item.productoId}`,
          fecha: new Date().toISOString().slice(0, 10),
          tipo: 'entrada',
          productoId: item.productoId,
          producto: item.descripcion,
          cantidad: item.cantidad,
          costoUnitario: producto.costoUnitario,
          costoPromedioPonderado: producto.costoUnitario,
          motivo: 'Anulación Venta',
          documento: `Factura Anulada N° ${factura.numero}`,
          usuario: 'Sistema',
          stockAnterior: producto.stockActual,
          stockNuevo: producto.stockActual + item.cantidad,
          valorMovimiento,
        };
        const asientoCosto = generarAsientoInventario(movimientoInventario);
        asientosCosto.push(asientoCosto);
      }
    });

    return [asientoVentaReversion, ...asientosCosto];
  };
  
  return {
    generarAsientoInventario,
    generarAsientoVenta,
    generarAsientoCompra,
    generarAsientoPagoCompra,
    generarAsientoPagoFactura,
    generarAsientoAnulacionFactura,
  };
};
