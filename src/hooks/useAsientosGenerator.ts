import { AsientoContable, CuentaAsiento } from "@/components/contable/diary/DiaryData";
import { MovimientoInventario } from "@/components/contable/inventory/InventoryData";
import { Factura } from "@/components/contable/billing/BillingData";
import { Compra } from "@/components/contable/purchases/PurchasesData";
import { useAsientos } from "./useAsientos";
import { useProductos } from "./useProductos";

export const useAsientosGenerator = () => {
  const { guardarAsiento } = useAsientos();
  const { obtenerProductos } = useProductos();

  const generarAsientoInventario = (movimiento: MovimientoInventario): AsientoContable | null => {
    try {
      const cuentas: CuentaAsiento[] = [];
      const fecha = new Date().toISOString().slice(0, 10);
      
      console.log("Generando asiento para movimiento (normativa boliviana):", movimiento);
      
      if (movimiento.tipo === 'entrada') {
        // ENTRADA DE INVENTARIO según normativa boliviana
        // Las entradas siempre incrementan el activo inventario
        cuentas.push({
          codigo: "1141",
          nombre: "Inventarios",
          debe: movimiento.valorMovimiento,
          haber: 0
        });
        
        // Determinar la cuenta de contrapartida según el motivo específico
        if (movimiento.motivo?.toLowerCase().includes('anulación') || 
            movimiento.motivo?.toLowerCase().includes('devolución') ||
            movimiento.motivo?.toLowerCase().includes('devolucion')) {
          // DEVOLUCIÓN DE VENTA - Se revierte el costo registrado previamente
          cuentas.push({
            codigo: "5111",
            nombre: "Costo de Productos Vendidos",
            debe: 0,
            haber: movimiento.valorMovimiento
          });
        } else if (movimiento.motivo?.toLowerCase().includes('compra') ||
                   movimiento.motivo?.toLowerCase().includes('proveedor') ||
                   movimiento.motivo?.toLowerCase().includes('adquisición')) {
          // COMPRA NORMAL - Incrementa pasivo por pagar
          cuentas.push({
            codigo: "2111",
            nombre: "Cuentas por Pagar",
            debe: 0,
            haber: movimiento.valorMovimiento
          });
        } else if (movimiento.motivo?.toLowerCase().includes('ajuste positivo')) {
          // AJUSTE POSITIVO - Se registra como ganancia por diferencia de inventario
          cuentas.push({
            codigo: "4211",
            nombre: "Otros Ingresos",
            debe: 0,
            haber: movimiento.valorMovimiento
          });
        } else {
          // Por defecto, se considera compra
          cuentas.push({
            codigo: "2111",
            nombre: "Cuentas por Pagar",
            debe: 0,
            haber: movimiento.valorMovimiento
          });
        }
      } else if (movimiento.tipo === 'salida') {
        // SALIDA DE INVENTARIO - Análisis crítico según normativa boliviana
        
        // SIEMPRE se reduce el inventario en cualquier salida
        cuentas.push({
          codigo: "1141",
          nombre: "Inventarios",
          debe: 0,
          haber: movimiento.valorMovimiento
        });
        
        // La cuenta de contrapartida es CRÍTICA según la normativa
        if (movimiento.motivo?.toLowerCase().includes('venta') || 
            movimiento.motivo?.toLowerCase().includes('factura') ||
            movimiento.motivo?.toLowerCase().includes('vendido')) {
          // VENTA REAL - Va al costo de ventas para calcular utilidad bruta
          cuentas.push({
            codigo: "5111",
            nombre: "Costo de Productos Vendidos",
            debe: movimiento.valorMovimiento,
            haber: 0
          });
        } else if (movimiento.motivo?.toLowerCase().includes('pérdida') ||
                   movimiento.motivo?.toLowerCase().includes('perdida') ||
                   movimiento.motivo?.toLowerCase().includes('deterioro') ||
                   movimiento.motivo?.toLowerCase().includes('robo') ||
                   movimiento.motivo?.toLowerCase().includes('vencimiento')) {
          // PÉRDIDA/DETERIORO - Va a pérdidas, NO al costo de ventas
          cuentas.push({
            codigo: "5322",
            nombre: "Pérdidas y Faltantes de Inventario",
            debe: movimiento.valorMovimiento,
            haber: 0
          });
        } else if (movimiento.motivo?.toLowerCase().includes('consumo interno') ||
                   movimiento.motivo?.toLowerCase().includes('uso interno') ||
                   movimiento.motivo?.toLowerCase().includes('muestra')) {
          // USO INTERNO - Se registra como gasto operativo
          cuentas.push({
            codigo: "5211",
            nombre: "Gastos Operativos",
            debe: movimiento.valorMovimiento,
            haber: 0
          });
        } else if (movimiento.motivo?.toLowerCase().includes('ajuste negativo')) {
          // AJUSTE NEGATIVO por diferencia de inventario
          cuentas.push({
            codigo: "5322",
            nombre: "Pérdidas y Faltantes de Inventario",
            debe: movimiento.valorMovimiento,
            haber: 0
          });
        } else {
          // POR DEFECTO - Si no es claramente una venta, va a pérdidas
          console.warn("Motivo de salida no específico, registrando como pérdida:", movimiento.motivo);
          cuentas.push({
            codigo: "5322",
            nombre: "Pérdidas y Faltantes de Inventario",
            debe: movimiento.valorMovimiento,
            haber: 0
          });
        }
      }

      const totalDebe = cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0);
      const totalHaber = cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0);

      const asiento: AsientoContable = {
        id: `AST-INV-${Date.now()}`,
        numero: `INV-${movimiento.tipo.toUpperCase()}-${Date.now().toString().slice(-6)}`,
        fecha,
        concepto: `${movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'} de inventario - ${movimiento.producto}${movimiento.motivo ? ` (${movimiento.motivo})` : ''}`,
        referencia: movimiento.documento || 'N/A',
        debe: totalDebe,
        haber: totalHaber,
        estado: 'registrado',
        cuentas
      };

      console.log("Asiento generado:", asiento);

      const resultado = guardarAsiento(asiento);
      return resultado ? asiento : null;
    } catch (error) {
      console.error("Error al generar asiento de inventario:", error);
      return null;
    }
  };

  const generarAsientoVenta = (factura: any): AsientoContable | null => {
    const cuentas: CuentaAsiento[] = [];
    const fecha = new Date().toISOString().slice(0, 10);
    
    // El total de la factura ya incluye IVA
    const totalConIVA = factura.total;
    
    // Calcular venta sin IVA (dividiendo entre 1.13)
    const ventaSinIVA = totalConIVA / 1.13;
    
    // El IVA es la diferencia
    const ivaVenta = totalConIVA - ventaSinIVA;

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
      haber: ventaSinIVA
    });

    cuentas.push({
      codigo: "2131",
      nombre: "IVA Débito Fiscal",
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

    return guardarAsiento(asiento) ? asiento : null;
  };

  const generarAsientoCompra = (compra: { numero: string, total: number, subtotal: number, iva: number }): AsientoContable | null => {
    const cuentas: CuentaAsiento[] = [];
    const fecha = new Date().toISOString().slice(0, 10);
    
    // CORREGIDO: Las compras se capitalizan en INVENTARIO, no van directo a gastos
    const totalCompra = compra.total;
    
    // Base sin IVA (87% del total) 
    const comprasValor = totalCompra / 1.13;
    
    // IVA Crédito Fiscal (13% del total)
    const ivaCreditoFiscal = totalCompra - comprasValor;

    // CAMBIO CRÍTICO: Las compras van a INVENTARIO (1141), no a gastos (5121)
    cuentas.push({
      codigo: "1141", 
      nombre: "Inventarios",
      debe: comprasValor,
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
      concepto: `Compra de mercadería según factura ${compra.numero}`,
      referencia: compra.numero,
      debe: totalCompra,
      haber: totalCompra,
      estado: 'registrado',
      cuentas
    };

    return guardarAsiento(asiento) ? asiento : null;
  };

  const generarAsientoPagoCompra = (compra: Compra): AsientoContable | null => {
    const totalPago = compra.subtotal + compra.iva; // Total contable = subtotal + IVA
    const asiento: AsientoContable = {
      id: Date.now().toString(),
      numero: `PGC-${compra.numero}`,
      fecha: new Date().toISOString().slice(0, 10),
      concepto: `Pago de compra N° ${compra.numero}`,
      referencia: compra.numero,
      debe: totalPago,
      haber: totalPago,
      estado: 'registrado',
      cuentas: [
        {
          codigo: "2111",
          nombre: "Cuentas por Pagar",
          debe: totalPago,
          haber: 0
        },
        {
          codigo: "1111",
          nombre: "Caja y Bancos",
          debe: 0,
          haber: totalPago
        }
      ]
    };
    return guardarAsiento(asiento) ? asiento : null;
  };

  const generarAsientoPagoFactura = (factura: Factura): AsientoContable | null => {
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
    return guardarAsiento(asiento) ? asiento : null;
  };

  const generarAsientoAnulacionFactura = (factura: Factura): AsientoContable[] | null => {
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
          debe: factura.total / 1.13, // Venta sin IVA
          haber: 0
        },
        {
          codigo: "2131",
          nombre: "IVA Débito Fiscal",
          debe: factura.total - (factura.total / 1.13), // IVA incluido
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
    if (!guardarAsiento(asientoVentaReversion)) {
      return null;
    }

    const asientosGenerados: AsientoContable[] = [asientoVentaReversion];
    let todoOk = true;

    factura.items.forEach(item => {
      if (!todoOk) return;

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
        if (asientoCosto) {
          asientosGenerados.push(asientoCosto);
        } else {
          console.error(`Error crítico: Falló la reversión del costo para el producto ${item.productoId} en la anulación de la factura ${factura.numero}. El sistema puede quedar en un estado inconsistente.`);
          todoOk = false;
        }
      }
    });

    if (!todoOk) {
      return asientosGenerados;
    }

    return asientosGenerados;
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
