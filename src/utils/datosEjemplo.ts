// Datos vacíos para sistema de producción
export const productosEjemplo: any[] = [];
export const clientesEjemplo: any[] = [];
export const proveedoresEjemplo: any[] = [];
export const facturasEjemplo: any[] = [];
export const comprasEjemplo: any[] = [];
export const asientosEjemplo: any[] = [];
export const comprobantesIntegradosEjemplo: any[] = [];

export const initializarSistemaProduccion = () => {
  // Inicializar datos vacíos para producción
  if (!localStorage.getItem('productos')) {
    localStorage.setItem('productos', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('clientes')) {
    localStorage.setItem('clientes', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('proveedores')) {
    localStorage.setItem('proveedores', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('facturas')) {
    localStorage.setItem('facturas', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('compras')) {
    localStorage.setItem('compras', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('asientosContables')) {
    localStorage.setItem('asientosContables', JSON.stringify([]));
  }

  if (!localStorage.getItem('comprobantes_integrados')) {
    localStorage.setItem('comprobantes_integrados', JSON.stringify([]));
  }

  // Inicializar plan de cuentas completo
  if (!localStorage.getItem('planCuentas')) {
    const planCuentasCompleto = [
      // ACTIVOS
      { codigo: "1111", nombre: "Caja General", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "1112", nombre: "Banco Nacional de Bolivia", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "1113", nombre: "Banco Mercantil Santa Cruz", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "1121", nombre: "Cuentas por Cobrar Comerciales", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "1131", nombre: "Inventarios - Mercaderías", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "1141", nombre: "Gastos Pagados por Anticipado", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "1142", nombre: "IVA Crédito Fiscal", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "1211", nombre: "Muebles y Enseres", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "1212", nombre: "Equipos de Computación", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
      
      // PASIVOS
      { codigo: "2111", nombre: "Cuentas por Pagar Comerciales", tipo: "pasivo", naturaleza: "acreedora", saldo: 0, activa: true },
      { codigo: "2113", nombre: "IVA por Pagar", tipo: "pasivo", naturaleza: "acreedora", saldo: 0, activa: true },
      { codigo: "2121", nombre: "Sueldos y Salarios por Pagar", tipo: "pasivo", naturaleza: "acreedora", saldo: 0, activa: true },
      
      // PATRIMONIO
      { codigo: "3111", nombre: "Capital Social", tipo: "patrimonio", naturaleza: "acreedora", saldo: 100000, activa: true },
      { codigo: "3211", nombre: "Utilidades Acumuladas", tipo: "patrimonio", naturaleza: "acreedora", saldo: 0, activa: true },
      
      // INGRESOS
      { codigo: "4111", nombre: "Ventas", tipo: "ingresos", naturaleza: "acreedora", saldo: 0, activa: true },
      { codigo: "4191", nombre: "Otros Ingresos", tipo: "ingresos", naturaleza: "acreedora", saldo: 0, activa: true },
      
      // GASTOS
      { codigo: "5111", nombre: "Costo de Ventas", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "5191", nombre: "Gastos Varios", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "5211", nombre: "Sueldos y Salarios", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "5221", nombre: "Cargas Sociales", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "5231", nombre: "Servicios Básicos", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "5241", nombre: "Alquileres", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "5251", nombre: "Materiales y Suministros", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
      { codigo: "5261", nombre: "Impuesto a las Transacciones", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true }
    ];
    localStorage.setItem('planCuentas', JSON.stringify(planCuentasCompleto));
  }
  
  // Inicializar último backup
  if (!localStorage.getItem('ultimo-backup')) {
    localStorage.setItem('ultimo-backup', new Date().toISOString());
  }

  console.log("✅ Sistema de producción inicializado correctamente");
  console.log("🏭 Listo para usar en ambiente productivo");
  
  return true;
};