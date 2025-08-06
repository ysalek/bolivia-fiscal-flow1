// Plan de cuentas actualizado según normativas contables bolivianas 2024-2025
export interface CuentaContable {
  codigo: string;
  nombre: string;
  tipo: 'activo' | 'pasivo' | 'patrimonio' | 'ingreso' | 'gasto';
  naturaleza: 'deudora' | 'acreedora';
  nivel: number;
  padre?: string;
  activa: boolean;
  requiereDetalle: boolean;
  centrosCosto?: boolean;
  validacionesSIN?: string[];
  categoriaTributaria?: string;
}

// Plan de cuentas actualizado según CAMC 2024 y normativa SIN
export const planCuentasBoliviano2025: CuentaContable[] = [
  // 1. ACTIVOS
  { codigo: '1', nombre: 'ACTIVOS', tipo: 'activo', naturaleza: 'deudora', nivel: 1, activa: false, requiereDetalle: false },
  
  // 1.1 ACTIVOS CORRIENTES
  { codigo: '11', nombre: 'ACTIVOS CORRIENTES', tipo: 'activo', naturaleza: 'deudora', nivel: 2, padre: '1', activa: false, requiereDetalle: false },
  
  // 1.1.1 Disponibilidades
  { codigo: '111', nombre: 'DISPONIBILIDADES', tipo: 'activo', naturaleza: 'deudora', nivel: 3, padre: '11', activa: false, requiereDetalle: false },
  { codigo: '11101', nombre: 'Caja', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '111', activa: true, requiereDetalle: true },
  { codigo: '11102', nombre: 'Caja Moneda Extranjera', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '111', activa: true, requiereDetalle: true },
  { codigo: '11103', nombre: 'Bancos Moneda Nacional', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '111', activa: true, requiereDetalle: true, validacionesSIN: ['conciliacion_bancaria'] },
  { codigo: '11104', nombre: 'Bancos Moneda Extranjera', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '111', activa: true, requiereDetalle: true, validacionesSIN: ['conciliacion_bancaria'] },
  { codigo: '11105', nombre: 'Inversiones Temporales', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '111', activa: true, requiereDetalle: true },

  // 1.1.2 Exigible
  { codigo: '112', nombre: 'EXIGIBLE', tipo: 'activo', naturaleza: 'deudora', nivel: 3, padre: '11', activa: false, requiereDetalle: false },
  { codigo: '11201', nombre: 'Cuentas por Cobrar Comerciales', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '112', activa: true, requiereDetalle: true, validacionesSIN: ['antiguedad_saldos'] },
  { codigo: '11202', nombre: 'Documentos por Cobrar', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '112', activa: true, requiereDetalle: true },
  { codigo: '11203', nombre: 'Cuentas por Cobrar Empleados', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '112', activa: true, requiereDetalle: true },
  { codigo: '11204', nombre: 'IVA Crédito Fiscal', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '112', activa: true, requiereDetalle: true, categoriaTributaria: 'IVA', validacionesSIN: ['libro_compras'] },
  { codigo: '11205', nombre: 'IT por Recuperar', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '112', activa: true, requiereDetalle: true, categoriaTributaria: 'IT' },
  { codigo: '11206', nombre: 'Anticipos a Proveedores', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '112', activa: true, requiereDetalle: true },
  { codigo: '11207', nombre: 'Gastos Pagados por Anticipado', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '112', activa: true, requiereDetalle: true },

  // 1.1.3 Realizables
  { codigo: '113', nombre: 'REALIZABLES', tipo: 'activo', naturaleza: 'deudora', nivel: 3, padre: '11', activa: false, requiereDetalle: false },
  { codigo: '11301', nombre: 'Inventario de Mercaderías', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '113', activa: true, requiereDetalle: true, validacionesSIN: ['kardex'] },
  { codigo: '11302', nombre: 'Inventario de Materias Primas', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '113', activa: true, requiereDetalle: true, validacionesSIN: ['kardex'] },
  { codigo: '11303', nombre: 'Inventario de Productos en Proceso', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '113', activa: true, requiereDetalle: true, validacionesSIN: ['kardex'] },
  { codigo: '11304', nombre: 'Inventario de Productos Terminados', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '113', activa: true, requiereDetalle: true, validacionesSIN: ['kardex'] },

  // 1.2 ACTIVOS NO CORRIENTES
  { codigo: '12', nombre: 'ACTIVOS NO CORRIENTES', tipo: 'activo', naturaleza: 'deudora', nivel: 2, padre: '1', activa: false, requiereDetalle: false },
  
  // 1.2.1 Activos Fijos
  { codigo: '121', nombre: 'ACTIVOS FIJOS', tipo: 'activo', naturaleza: 'deudora', nivel: 3, padre: '12', activa: false, requiereDetalle: false },
  { codigo: '12101', nombre: 'Terrenos', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '121', activa: true, requiereDetalle: true, validacionesSIN: ['registro_activos_fijos'] },
  { codigo: '12102', nombre: 'Edificios', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '121', activa: true, requiereDetalle: true, validacionesSIN: ['registro_activos_fijos', 'depreciacion'] },
  { codigo: '12103', nombre: 'Maquinaria y Equipo', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '121', activa: true, requiereDetalle: true, validacionesSIN: ['registro_activos_fijos', 'depreciacion'] },
  { codigo: '12104', nombre: 'Vehículos', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '121', activa: true, requiereDetalle: true, validacionesSIN: ['registro_activos_fijos', 'depreciacion'] },
  { codigo: '12105', nombre: 'Muebles y Enseres', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '121', activa: true, requiereDetalle: true, validacionesSIN: ['registro_activos_fijos', 'depreciacion'] },
  { codigo: '12106', nombre: 'Equipo de Computación', tipo: 'activo', naturaleza: 'deudora', nivel: 4, padre: '121', activa: true, requiereDetalle: true, validacionesSIN: ['registro_activos_fijos', 'depreciacion'] },

  // 1.2.2 Depreciación Acumulada
  { codigo: '122', nombre: 'DEPRECIACIÓN ACUMULADA', tipo: 'activo', naturaleza: 'acreedora', nivel: 3, padre: '12', activa: false, requiereDetalle: false },
  { codigo: '12201', nombre: 'Depreciación Acumulada Edificios', tipo: 'activo', naturaleza: 'acreedora', nivel: 4, padre: '122', activa: true, requiereDetalle: true },
  { codigo: '12202', nombre: 'Depreciación Acumulada Maquinaria', tipo: 'activo', naturaleza: 'acreedora', nivel: 4, padre: '122', activa: true, requiereDetalle: true },
  { codigo: '12203', nombre: 'Depreciación Acumulada Vehículos', tipo: 'activo', naturaleza: 'acreedora', nivel: 4, padre: '122', activa: true, requiereDetalle: true },

  // 2. PASIVOS
  { codigo: '2', nombre: 'PASIVOS', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 1, activa: false, requiereDetalle: false },
  
  // 2.1 PASIVOS CORRIENTES
  { codigo: '21', nombre: 'PASIVOS CORRIENTES', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 2, padre: '2', activa: false, requiereDetalle: false },
  
  { codigo: '211', nombre: 'CUENTAS POR PAGAR', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 3, padre: '21', activa: false, requiereDetalle: false },
  { codigo: '21101', nombre: 'Proveedores', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '211', activa: true, requiereDetalle: true },
  { codigo: '21102', nombre: 'Documentos por Pagar', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '211', activa: true, requiereDetalle: true },
  { codigo: '21103', nombre: 'Acreedores Diversos', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '211', activa: true, requiereDetalle: true },

  // 2.1.2 Obligaciones Fiscales
  { codigo: '212', nombre: 'OBLIGACIONES FISCALES', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 3, padre: '21', activa: false, requiereDetalle: false },
  { codigo: '21201', nombre: 'IVA por Pagar', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '212', activa: true, requiereDetalle: true, categoriaTributaria: 'IVA', validacionesSIN: ['libro_ventas'] },
  { codigo: '21202', nombre: 'IT por Pagar', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '212', activa: true, requiereDetalle: true, categoriaTributaria: 'IT' },
  { codigo: '21203', nombre: 'RC-IVA por Enterar', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '212', activa: true, requiereDetalle: true, categoriaTributaria: 'RC-IVA' },
  { codigo: '21204', nombre: 'IUE por Pagar', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '212', activa: true, requiereDetalle: true, categoriaTributaria: 'IUE' },

  // 2.1.3 Obligaciones Laborales
  { codigo: '213', nombre: 'OBLIGACIONES LABORALES', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 3, padre: '21', activa: false, requiereDetalle: false },
  { codigo: '21301', nombre: 'Sueldos por Pagar', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '213', activa: true, requiereDetalle: true },
  { codigo: '21302', nombre: 'Aguinaldos por Pagar', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '213', activa: true, requiereDetalle: true },
  { codigo: '21303', nombre: 'Provisión Indemnización', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '213', activa: true, requiereDetalle: true },
  { codigo: '21304', nombre: 'AFP por Pagar', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '213', activa: true, requiereDetalle: true },
  { codigo: '21305', nombre: 'CNS por Pagar', tipo: 'pasivo', naturaleza: 'acreedora', nivel: 4, padre: '213', activa: true, requiereDetalle: true },

  // 3. PATRIMONIO
  { codigo: '3', nombre: 'PATRIMONIO', tipo: 'patrimonio', naturaleza: 'acreedora', nivel: 1, activa: false, requiereDetalle: false },
  { codigo: '31', nombre: 'CAPITAL', tipo: 'patrimonio', naturaleza: 'acreedora', nivel: 2, padre: '3', activa: false, requiereDetalle: false },
  { codigo: '3101', nombre: 'Capital Social', tipo: 'patrimonio', naturaleza: 'acreedora', nivel: 3, padre: '31', activa: true, requiereDetalle: true },
  { codigo: '3102', nombre: 'Reservas', tipo: 'patrimonio', naturaleza: 'acreedora', nivel: 3, padre: '31', activa: true, requiereDetalle: true },
  { codigo: '3103', nombre: 'Resultados Acumulados', tipo: 'patrimonio', naturaleza: 'acreedora', nivel: 3, padre: '31', activa: true, requiereDetalle: true },
  { codigo: '3104', nombre: 'Resultado del Ejercicio', tipo: 'patrimonio', naturaleza: 'acreedora', nivel: 3, padre: '31', activa: true, requiereDetalle: true },

  // 4. INGRESOS
  { codigo: '4', nombre: 'INGRESOS', tipo: 'ingreso', naturaleza: 'acreedora', nivel: 1, activa: false, requiereDetalle: false },
  { codigo: '41', nombre: 'INGRESOS OPERACIONALES', tipo: 'ingreso', naturaleza: 'acreedora', nivel: 2, padre: '4', activa: false, requiereDetalle: false },
  { codigo: '4101', nombre: 'Ventas', tipo: 'ingreso', naturaleza: 'acreedora', nivel: 3, padre: '41', activa: true, requiereDetalle: true, validacionesSIN: ['libro_ventas'], centrosCosto: true },
  { codigo: '4102', nombre: 'Servicios', tipo: 'ingreso', naturaleza: 'acreedora', nivel: 3, padre: '41', activa: true, requiereDetalle: true, validacionesSIN: ['libro_ventas'], centrosCosto: true },
  { codigo: '4103', nombre: 'Descuentos Obtenidos', tipo: 'ingreso', naturaleza: 'acreedora', nivel: 3, padre: '41', activa: true, requiereDetalle: true },

  // 5. GASTOS
  { codigo: '5', nombre: 'GASTOS', tipo: 'gasto', naturaleza: 'deudora', nivel: 1, activa: false, requiereDetalle: false },
  { codigo: '51', nombre: 'COSTO DE VENTAS', tipo: 'gasto', naturaleza: 'deudora', nivel: 2, padre: '5', activa: false, requiereDetalle: false },
  { codigo: '5101', nombre: 'Costo de Mercaderías Vendidas', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '51', activa: true, requiereDetalle: true, centrosCosto: true },
  
  { codigo: '52', nombre: 'GASTOS OPERACIONALES', tipo: 'gasto', naturaleza: 'deudora', nivel: 2, padre: '5', activa: false, requiereDetalle: false },
  { codigo: '5201', nombre: 'Sueldos y Salarios', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '52', activa: true, requiereDetalle: true, centrosCosto: true },
  { codigo: '5202', nombre: 'Cargas Sociales', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '52', activa: true, requiereDetalle: true, centrosCosto: true },
  { codigo: '5203', nombre: 'Servicios Básicos', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '52', activa: true, requiereDetalle: true, centrosCosto: true },
  { codigo: '5204', nombre: 'Alquileres', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '52', activa: true, requiereDetalle: true, centrosCosto: true },
  { codigo: '5205', nombre: 'Depreciaciones', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '52', activa: true, requiereDetalle: true, centrosCosto: true },
  { codigo: '5206', nombre: 'Seguros', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '52', activa: true, requiereDetalle: true, centrosCosto: true },
  { codigo: '5207', nombre: 'Mantenimiento y Reparaciones', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '52', activa: true, requiereDetalle: true, centrosCosto: true },
  { codigo: '5208', nombre: 'Publicidad', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '52', activa: true, requiereDetalle: true, centrosCosto: true },

  { codigo: '53', nombre: 'GASTOS FINANCIEROS', tipo: 'gasto', naturaleza: 'deudora', nivel: 2, padre: '5', activa: false, requiereDetalle: false },
  { codigo: '5301', nombre: 'Intereses Bancarios', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '53', activa: true, requiereDetalle: true },
  { codigo: '5302', nombre: 'Comisiones Bancarias', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '53', activa: true, requiereDetalle: true },
  
  { codigo: '54', nombre: 'OTROS GASTOS', tipo: 'gasto', naturaleza: 'deudora', nivel: 2, padre: '5', activa: false, requiereDetalle: false },
  { codigo: '5401', nombre: 'IT Pagado', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '54', activa: true, requiereDetalle: true, categoriaTributaria: 'IT' },
  { codigo: '5402', nombre: 'Multas e Intereses', tipo: 'gasto', naturaleza: 'deudora', nivel: 3, padre: '54', activa: true, requiereDetalle: true },
];

// Funciones de utilidad para el plan de cuentas
export const obtenerCuentasPorTipo = (tipo: string): CuentaContable[] => {
  return planCuentasBoliviano2025.filter(cuenta => cuenta.tipo === tipo);
};

export const obtenerCuentasActivas = (): CuentaContable[] => {
  return planCuentasBoliviano2025.filter(cuenta => cuenta.activa);
};

export const obtenerCuentaPorCodigo = (codigo: string): CuentaContable | undefined => {
  return planCuentasBoliviano2025.find(cuenta => cuenta.codigo === codigo);
};

export const obtenerCuentasHijas = (codigoPadre: string): CuentaContable[] => {
  return planCuentasBoliviano2025.filter(cuenta => cuenta.padre === codigoPadre);
};

export const validarCuentaParaSIN = (codigo: string): { valida: boolean; validaciones: string[] } => {
  const cuenta = obtenerCuentaPorCodigo(codigo);
  if (!cuenta) {
    return { valida: false, validaciones: ['Cuenta no existe'] };
  }
  
  return {
    valida: true,
    validaciones: cuenta.validacionesSIN || []
  };
};

export const obtenerCuentasTributarias = (): CuentaContable[] => {
  return planCuentasBoliviano2025.filter(cuenta => cuenta.categoriaTributaria);
};

export const estructuraJerarquica = (): any => {
  const cuentasNivel1 = planCuentasBoliviano2025.filter(c => c.nivel === 1);
  
  const construirArbol = (cuentas: CuentaContable[], nivel: number = 1): any[] => {
    return cuentas
      .filter(c => c.nivel === nivel)
      .map(cuenta => ({
        ...cuenta,
        hijas: construirArbol(
          planCuentasBoliviano2025.filter(c => c.padre === cuenta.codigo),
          nivel + 1
        )
      }));
  };
  
  return construirArbol(planCuentasBoliviano2025);
};