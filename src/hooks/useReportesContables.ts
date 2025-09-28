import { useAsientos } from "./useAsientos";

// Type Definitions
export interface TrialBalanceDetail {
  codigo: string;
  nombre: string;
  sumaDebe: number;
  sumaHaber: number;
  saldoDeudor: number;
  saldoAcreedor: number;
}

export interface TrialBalanceTotals {
  sumaDebe: number;
  sumaHaber: number;
  saldoDeudor: number;
  saldoAcreedor: number;
}

export interface BalanceSheetAccount {
  codigo: string;
  nombre: string;
  saldo: number;
}

export interface BalanceSheetData {
  activos: {
    cuentas: BalanceSheetAccount[];
    total: number;
  };
  pasivos: {
    cuentas: BalanceSheetAccount[];
    total: number;
  };
  patrimonio: {
    cuentas: BalanceSheetAccount[];
    total: number;
  };
  totalPasivoPatrimonio: number;
  ecuacionCuadrada: boolean;
}

export interface IncomeStatementData {
  ingresos: {
    cuentas: { codigo: string; nombre: string; saldo: number }[];
    total: number;
  };
  gastos: {
    cuentas: { codigo: string; nombre: string; saldo: number }[];
    total: number;
  };
  utilidadNeta: number;
}

export interface DeclaracionIVAData {
  ventas: {
    baseImponible: number;
    debitoFiscal: number;
  };
  compras: {
    baseImponible: number;
    creditoFiscal: number;
  };
  saldo: {
    aFavorFisco: number;
    aFavorContribuyente: number;
  };
}


export const useReportesContables = (productos?: any[]) => {
  const { getAsientos } = useAsientos();

  const getLibroMayor = (): { [key: string]: { nombre: string, codigo: string, movimientos: any[], totalDebe: number, totalHaber: number } } => {
    const asientos = getAsientos();
    const libroMayor: { [key: string]: { nombre: string, codigo: string, movimientos: any[], totalDebe: number, totalHaber: number } } = {};

    asientos.filter(a => a.estado === 'registrado').reverse().forEach(asiento => {
        asiento.cuentas.forEach(cuenta => {
            if (!libroMayor[cuenta.codigo]) {
                libroMayor[cuenta.codigo] = {
                    codigo: cuenta.codigo,
                    nombre: cuenta.nombre,
                    movimientos: [],
                    totalDebe: 0,
                    totalHaber: 0,
                };
            }
            libroMayor[cuenta.codigo].movimientos.push({
                fecha: asiento.fecha,
                concepto: asiento.concepto,
                referencia: asiento.referencia,
                debe: cuenta.debe,
                haber: cuenta.haber,
            });
            libroMayor[cuenta.codigo].totalDebe += cuenta.debe;
            libroMayor[cuenta.codigo].totalHaber += cuenta.haber;
        });
    });

    // Sort movements by date
    for (const codigo in libroMayor) {
        libroMayor[codigo].movimientos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    }

    return libroMayor;
  };

  const getTrialBalanceData = (filtros?: { fechaInicio?: string, fechaFin?: string, cuentaInicio?: string, cuentaFin?: string }): { details: TrialBalanceDetail[], totals: TrialBalanceTotals } => {
    const asientos = getAsientos();
    
    // Obtener comprobantes para verificar estado de anulación
    const comprobantesIntegrados = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
    
    const filteredAsientos = asientos.filter(asiento => {
      if (asiento.estado !== 'registrado') return false;
      
      // Excluir asientos de comprobantes anulados (excepto los asientos de reversión)
      if (asiento.comprobanteId && asiento.origen !== 'anulacion_comprobante') {
        const comprobante = comprobantesIntegrados.find((c: any) => c.id === asiento.comprobanteId);
        if (comprobante && comprobante.estado === 'anulado') {
          return false; // Excluir el asiento original del comprobante anulado
        }
      }
      
      // Filtro por fechas
      if (filtros?.fechaInicio || filtros?.fechaFin) {
        const fechaAsiento = new Date(asiento.fecha);
        if (filtros.fechaInicio && fechaAsiento < new Date(filtros.fechaInicio)) return false;
        if (filtros.fechaFin && fechaAsiento > new Date(filtros.fechaFin + 'T23:59:59')) return false;
      }
      
      return true;
    });

    // Recrear libro mayor con asientos filtrados
    const libroMayorFiltrado: { [key: string]: { nombre: string, codigo: string, movimientos: any[], totalDebe: number, totalHaber: number } } = {};
    
    filteredAsientos.reverse().forEach(asiento => {
        asiento.cuentas.forEach(cuenta => {
            if (!libroMayorFiltrado[cuenta.codigo]) {
                libroMayorFiltrado[cuenta.codigo] = {
                    codigo: cuenta.codigo,
                    nombre: cuenta.nombre,
                    movimientos: [],
                    totalDebe: 0,
                    totalHaber: 0,
                };
            }
            libroMayorFiltrado[cuenta.codigo].movimientos.push({
                fecha: asiento.fecha,
                concepto: asiento.concepto,
                referencia: asiento.referencia,
                debe: cuenta.debe,
                haber: cuenta.haber,
            });
            libroMayorFiltrado[cuenta.codigo].totalDebe += cuenta.debe;
            libroMayorFiltrado[cuenta.codigo].totalHaber += cuenta.haber;
        });
    });

    const details: TrialBalanceDetail[] = [];
    const totals: TrialBalanceTotals = {
        sumaDebe: 0,
        sumaHaber: 0,
        saldoDeudor: 0,
        saldoAcreedor: 0,
    };

    let sortedAccounts = Object.values(libroMayorFiltrado).sort((a, b) => a.codigo.localeCompare(b.codigo));

    // Filtro por rango de cuentas
    if (filtros?.cuentaInicio || filtros?.cuentaFin) {
      sortedAccounts = sortedAccounts.filter(cuenta => {
        if (filtros.cuentaInicio && cuenta.codigo < filtros.cuentaInicio) return false;
        if (filtros.cuentaFin && cuenta.codigo > filtros.cuentaFin) return false;
        return true;
      });
    }

    sortedAccounts.forEach(cuenta => {
        const { codigo, nombre, totalDebe, totalHaber } = cuenta;
        let saldoDeudor = 0;
        let saldoAcreedor = 0;

        const saldo = totalDebe - totalHaber;
        
        if (saldo > 0) {
            saldoDeudor = saldo;
        } else {
            saldoAcreedor = -saldo;
        }
        
        details.push({
            codigo,
            nombre,
            sumaDebe: totalDebe,
            sumaHaber: totalHaber,
            saldoDeudor,
            saldoAcreedor,
        });

        totals.sumaDebe += totalDebe;
        totals.sumaHaber += totalHaber;
        totals.saldoDeudor += saldoDeudor;
        totals.saldoAcreedor += saldoAcreedor;
    });

    return { details, totals };
  };

  const getBalanceSheetData = (): BalanceSheetData => {
    const { details } = getTrialBalanceData();

    const activos = { cuentas: [] as BalanceSheetAccount[], total: 0 };
    const pasivos = { cuentas: [] as BalanceSheetAccount[], total: 0 };
    const patrimonio = { cuentas: [] as BalanceSheetAccount[], total: 0 };
    const ingresos = { total: 0 };
    const gastos = { total: 0 };

    // PRIMERO: Calcular INVENTARIO según normativa boliviana
    const productosData = productos || JSON.parse(localStorage.getItem('productos') || '[]');
    let valorInventarioFisico = 0;
    let valorInventarioContable = 0;
    
    // Calcular valor físico del inventario (stock actual * costo unitario)
    productosData.forEach((producto: any) => {
      const stockActual = producto.stock_actual || producto.stockActual || 0;
      const costoUnitario = producto.costo_unitario || producto.costoUnitario || 0;
      valorInventarioFisico += stockActual * costoUnitario;
    });
    
    // Buscar saldo contable de inventarios (cuenta 1141)
    const cuentaInventario = details.find(cuenta => cuenta.codigo === '1141');
    if (cuentaInventario) {
      valorInventarioContable = cuentaInventario.saldoDeudor - cuentaInventario.saldoAcreedor;
    }
    
    // Según normativa boliviana, usar el valor físico real o contable (el que sea mayor)
    const saldoInventario = Math.max(valorInventarioFisico, valorInventarioContable);
    let inventarioAgregado = false;
    
    console.log('📊 INVENTARIO BALANCE GENERAL:', {
      valorInventarioFisico,
      valorInventarioContable,
      saldoInventarioFinal: saldoInventario,
      productos: productosData.length
    });

    details.forEach(cuenta => {
      const saldo = cuenta.saldoDeudor - cuenta.saldoAcreedor;

      if (cuenta.codigo.startsWith('1')) { // Activo
        if (cuenta.codigo === '1141') {
          // Usar el valor físico real calculado arriba
          activos.cuentas.push({ 
            codigo: cuenta.codigo, 
            nombre: "Inventarios de Productos", 
            saldo: saldoInventario 
          });
          activos.total += saldoInventario;
          inventarioAgregado = true;
        } else {
          // Para otras cuentas de activo, usar el saldo contable normal
          const saldoActivo = Math.max(0, saldo); // Los activos deben ser positivos
          activos.cuentas.push({ codigo: cuenta.codigo, nombre: cuenta.nombre, saldo: saldoActivo });
          activos.total += saldoActivo;
        }
      } else if (cuenta.codigo.startsWith('2')) { // Pasivo
        pasivos.cuentas.push({ codigo: cuenta.codigo, nombre: cuenta.nombre, saldo: -saldo });
        pasivos.total -= saldo;
      } else if (cuenta.codigo.startsWith('3')) { // Patrimonio
        patrimonio.cuentas.push({ codigo: cuenta.codigo, nombre: cuenta.nombre, saldo: -saldo });
        patrimonio.total -= saldo;
      } else if (cuenta.codigo.startsWith('4')) { // Ingresos
        ingresos.total -= saldo; // Ingresos son acreedores
      } else if (cuenta.codigo.startsWith('5')) { // Gastos
        gastos.total += saldo; // Gastos son deudores
      }
    });

    // Si no se encontró la cuenta 1141 en el balance de comprobación, agregarla
    if (!inventarioAgregado && saldoInventario > 0) {
      activos.cuentas.push({
        codigo: '1141',
        nombre: "Inventarios de Productos",
        saldo: saldoInventario
      });
      activos.total += saldoInventario;
    }

    const utilidadPeriodo = ingresos.total - gastos.total;
    if (Math.abs(utilidadPeriodo) > 0.01) {
        patrimonio.cuentas.push({
            codigo: '3211',
            nombre: 'Utilidad (o Pérdida) del Ejercicio',
            saldo: utilidadPeriodo
        });
        patrimonio.total += utilidadPeriodo;
    }

    const totalPasivoPatrimonio = pasivos.total + patrimonio.total;
    const ecuacionCuadrada = Math.abs(activos.total - totalPasivoPatrimonio) < 0.01;

    activos.cuentas.sort((a, b) => a.codigo.localeCompare(b.codigo));
    pasivos.cuentas.sort((a, b) => a.codigo.localeCompare(b.codigo));
    patrimonio.cuentas.sort((a, b) => a.codigo.localeCompare(b.codigo));

    return {
      activos,
      pasivos,
      patrimonio,
      totalPasivoPatrimonio,
      ecuacionCuadrada
    };
  };

  const getIncomeStatementData = (): IncomeStatementData => {
    const { details } = getTrialBalanceData();
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
    
    const ingresos = { cuentas: [] as { codigo: string, nombre: string, saldo: number }[], total: 0 };
    const gastos = { cuentas: [] as { codigo: string, nombre: string, saldo: number }[], total: 0 };

    // Procesar datos del libro mayor
    details.forEach(cuenta => {
      const saldo = cuenta.saldoDeudor - cuenta.saldoAcreedor;

      if (cuenta.codigo.startsWith('4')) { // Ingresos
        const saldoAcreedor = -saldo;
        if (saldoAcreedor > 0.01) { // Solo mostrar cuentas con saldo significativo
          ingresos.cuentas.push({ codigo: cuenta.codigo, nombre: cuenta.nombre, saldo: saldoAcreedor });
          ingresos.total += saldoAcreedor;
        }
      } else if (cuenta.codigo.startsWith('5') || cuenta.codigo.startsWith('6')) { // Gastos
        const saldoDeudor = saldo;
        if (saldoDeudor > 0.01) { // Solo mostrar cuentas con saldo significativo
          // CORREGIDO: Calcular Costo de Ventas real basado en ventas efectivas
          if (cuenta.codigo === '5111') {
            // Calcular el costo real de productos vendidos desde facturas/ventas
            const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
            const productos = JSON.parse(localStorage.getItem('productos') || '[]');
            
            let costoVentasReal = 0;
            facturas.forEach((factura: any) => {
              if (factura.estado === 'pagada' || factura.estado === 'pendiente') {
                factura.items?.forEach((item: any) => {
                  const producto = productos.find((p: any) => p.id === item.productoId);
                  const costoUnitario = producto?.costoUnitario || 0;
                  const cantidadVendida = item.cantidad || 0;
                  costoVentasReal += cantidadVendida * costoUnitario;
                });
              }
            });
            
            // Solo agregar si hay ventas reales registradas
            if (costoVentasReal > 0) {
              cuenta.nombre = "Costo de Ventas (Solo productos vendidos)";
              gastos.cuentas.push({ codigo: cuenta.codigo, nombre: cuenta.nombre, saldo: costoVentasReal });
              gastos.total += costoVentasReal;
            }
          } else if (cuenta.codigo === '5121') {
            // Las compras NO van al Estado de Resultados, van a inventario
            // Solo incluir si hay una diferencia contable específica
            cuenta.nombre = "Compras (Capitalizadas en Inventario)";
            // No agregar al estado de resultados normal
            console.log(`⚠️ Cuenta 5121 (Compras) no debe aparecer en Estado de Resultados. Revisar asientos.`);
          } else {
            // Otros gastos operativos normales
            gastos.cuentas.push({ codigo: cuenta.codigo, nombre: cuenta.nombre, saldo: saldoDeudor });
            gastos.total += saldoDeudor;
          }
        }
      }
    });

    // Integrar comprobantes autorizados que no hayan generado asientos aún
    comprobantes
      .filter((c: any) => c.estado === 'autorizado' && !c.asientoGenerado)
      .forEach((comprobante: any) => {
        if (comprobante.tipo === 'ingreso') {
          if (comprobante.conFactura) {
            // Para ingresos con factura, separar base imponible del IVA y IT
            const montoTotal = comprobante.monto;
            const baseImponible = montoTotal / 1.16; // Base sin IVA (13%) ni IT (3%)
            const impuestoTransacciones = baseImponible * 0.03;
            
            // Registrar ingreso sin impuestos
            let cuentaIngreso = ingresos.cuentas.find(c => c.codigo === comprobante.cuentaIngreso);
            if (!cuentaIngreso) {
              cuentaIngreso = { codigo: comprobante.cuentaIngreso, nombre: 'Ingresos por Ventas', saldo: 0 };
              ingresos.cuentas.push(cuentaIngreso);
            }
            cuentaIngreso.saldo += baseImponible;
            ingresos.total += baseImponible;

            // Registrar IT como gasto
            let cuentaIT = gastos.cuentas.find(c => c.codigo === '5211');
            if (!cuentaIT) {
              cuentaIT = { codigo: '5211', nombre: 'Impuesto a las Transacciones', saldo: 0 };
              gastos.cuentas.push(cuentaIT);
            }
            cuentaIT.saldo += impuestoTransacciones;
            gastos.total += impuestoTransacciones;
          } else {
            // Ingreso sin factura - monto completo
            let cuentaIngreso = ingresos.cuentas.find(c => c.codigo === comprobante.cuentaIngreso);
            if (!cuentaIngreso) {
              cuentaIngreso = { codigo: comprobante.cuentaIngreso, nombre: 'Ingresos', saldo: 0 };
              ingresos.cuentas.push(cuentaIngreso);
            }
            cuentaIngreso.saldo += comprobante.monto;
            ingresos.total += comprobante.monto;
          }
        } else if (comprobante.tipo === 'egreso') {
          if (comprobante.conFactura) {
            // Para egresos con factura, solo el 87% va como gasto (sin IVA)
            const montoTotal = comprobante.monto;
            const baseImponible = montoTotal / 1.13; // Base sin IVA (13%)
            
            // Registrar solo la base imponible como gasto
            let cuentaGasto = gastos.cuentas.find(c => c.codigo === comprobante.cuentaGasto);
            if (!cuentaGasto) {
              cuentaGasto = { codigo: comprobante.cuentaGasto, nombre: 'Gastos', saldo: 0 };
              gastos.cuentas.push(cuentaGasto);
            }
            cuentaGasto.saldo += baseImponible;
            gastos.total += baseImponible;
          } else {
            // Gasto sin factura - monto completo
            let cuentaGasto = gastos.cuentas.find(c => c.codigo === comprobante.cuentaGasto);
            if (!cuentaGasto) {
              cuentaGasto = { codigo: comprobante.cuentaGasto, nombre: 'Gastos', saldo: 0 };
              gastos.cuentas.push(cuentaGasto);
            }
            cuentaGasto.saldo += comprobante.monto;
            gastos.total += comprobante.monto;
          }
        }
      });

    const utilidadNeta = ingresos.total - gastos.total;

    ingresos.cuentas.sort((a, b) => a.codigo.localeCompare(b.codigo));
    gastos.cuentas.sort((a, b) => a.codigo.localeCompare(b.codigo));

    return {
      ingresos,
      gastos,
      utilidadNeta
    };
  };

  const getDeclaracionIVAData = (fechas: { fechaInicio: string, fechaFin: string }): DeclaracionIVAData => {
    const asientos = getAsientos();
    const startDate = new Date(fechas.fechaInicio);
    const endDate = new Date(fechas.fechaFin);

    // Adding time to endDate to include the whole day
    endDate.setHours(23, 59, 59, 999);
    // Adjusting startDate to the beginning of the day
    startDate.setHours(0, 0, 0, 0);

    const asientosEnPeriodo = asientos.filter(a => {
        if (!a.fecha) return false;
        const fechaAsiento = new Date(a.fecha);
        return fechaAsiento >= startDate && fechaAsiento <= endDate && a.estado === 'registrado';
    });

    let debitoFiscalTotal = 0;
    let baseImponibleVentas = 0;
    let creditoFiscalTotal = 0;
    let baseImponibleCompras = 0;

    asientosEnPeriodo.forEach(asiento => {
      // Ventas (Débito Fiscal): Se identifica por un crédito a una cuenta de Ingresos (código 4xxx)
      const ventaCuenta = asiento.cuentas.find(c => c.codigo.startsWith('4') && c.haber > 0);
      const ivaDebitoCuenta = asiento.cuentas.find(c => c.codigo === '2113' && c.haber > 0);
      if (ventaCuenta && ivaDebitoCuenta) {
        baseImponibleVentas += ventaCuenta.haber;
        debitoFiscalTotal += ivaDebitoCuenta.haber;
      }

      // Anulación de Ventas (Notas de Crédito): Se identifica por un débito a una cuenta de Ingresos
      const reversionVentaCuenta = asiento.cuentas.find(c => c.codigo.startsWith('4') && c.debe > 0);
      const reversionIvaDebito = asiento.cuentas.find(c => c.codigo === '2113' && c.debe > 0);
      if (reversionVentaCuenta && reversionIvaDebito) {
        baseImponibleVentas -= reversionVentaCuenta.debe;
        debitoFiscalTotal -= reversionIvaDebito.debe;
      }

      // Compras (Crédito Fiscal): Se identifica por un débito a la cuenta de IVA Crédito Fiscal (1142)
      const ivaCreditoCuenta = asiento.cuentas.find(c => c.codigo === '1142' && c.debe > 0);
      if (ivaCreditoCuenta) {
        creditoFiscalTotal += ivaCreditoCuenta.debe;
        // La base imponible son los otros débitos (Inventario, Gastos) en la misma transacción
        const baseCompra = asiento.cuentas
          .filter(c => (c.codigo === '1141' || c.codigo.startsWith('5')) && c.debe > 0)
          .reduce((sum, c) => sum + c.debe, 0);
        baseImponibleCompras += baseCompra;
      }
    });

    const diferencia = debitoFiscalTotal - creditoFiscalTotal;
    const saldo = {
      aFavorFisco: diferencia > 0 ? diferencia : 0,
      aFavorContribuyente: diferencia < 0 ? -diferencia : 0
    };

    return {
      ventas: {
        baseImponible: baseImponibleVentas,
        debitoFiscal: debitoFiscalTotal
      },
      compras: {
        baseImponible: baseImponibleCompras,
        creditoFiscal: creditoFiscalTotal
      },
      saldo
    };
  };
  
  return {
    getLibroMayor,
    getTrialBalanceData,
    getBalanceSheetData,
    getIncomeStatementData,
    getDeclaracionIVAData
  }
};
