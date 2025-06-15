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


export const useReportesContables = () => {
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

  const getTrialBalanceData = (): { details: TrialBalanceDetail[], totals: TrialBalanceTotals } => {
    const libroMayor = getLibroMayor();
    const details: TrialBalanceDetail[] = [];
    const totals: TrialBalanceTotals = {
        sumaDebe: 0,
        sumaHaber: 0,
        saldoDeudor: 0,
        saldoAcreedor: 0,
    };

    const sortedAccounts = Object.values(libroMayor).sort((a, b) => a.codigo.localeCompare(b.codigo));

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

    details.forEach(cuenta => {
      const saldo = cuenta.saldoDeudor - cuenta.saldoAcreedor;

      if (cuenta.codigo.startsWith('1')) { // Activo
        activos.cuentas.push({ codigo: cuenta.codigo, nombre: cuenta.nombre, saldo: saldo });
        activos.total += saldo;
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

    const ingresos = { cuentas: [] as { codigo: string, nombre: string, saldo: number }[], total: 0 };
    const gastos = { cuentas: [] as { codigo: string, nombre: string, saldo: number }[], total: 0 };

    details.forEach(cuenta => {
      const saldo = cuenta.saldoDeudor - cuenta.saldoAcreedor;

      if (cuenta.codigo.startsWith('4')) { // Ingresos
        const saldoAcreedor = -saldo;
        ingresos.cuentas.push({ codigo: cuenta.codigo, nombre: cuenta.nombre, saldo: saldoAcreedor });
        ingresos.total += saldoAcreedor;
      } else if (cuenta.codigo.startsWith('5')) { // Gastos
        const saldoDeudor = saldo;
        gastos.cuentas.push({ codigo: cuenta.codigo, nombre: cuenta.nombre, saldo: saldoDeudor });
        gastos.total += saldoDeudor;
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
