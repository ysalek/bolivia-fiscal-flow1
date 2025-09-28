
export interface AsientoContable {
  id: string;
  numero: string;
  fecha: string;
  concepto: string;
  referencia: string;
  debe: number;
  haber: number;
  estado: 'borrador' | 'registrado' | 'anulado';
  cuentas: CuentaAsiento[];
  comprobanteId?: string; // ID del comprobante que generó este asiento
  origen?: string; // Origen del asiento ('comprobante', 'anulacion_comprobante', etc.)
}

export interface CuentaAsiento {
  codigo: string;
  nombre: string;
  debe: number;
  haber: number;
}

export interface CuentaContable {
  codigo: string;
  nombre: string;
}

export const planCuentas: CuentaContable[] = [
  // ACTIVOS
  { codigo: "1111", nombre: "Caja" },
  { codigo: "1112", nombre: "Caja Chica" },
  { codigo: "1121", nombre: "Bancos" },
  { codigo: "1131", nombre: "Cuentas por Cobrar" },
  { codigo: "1132", nombre: "Documentos por Cobrar" },
  { codigo: "1141", nombre: "Inventarios" },
  { codigo: "1211", nombre: "Muebles y Enseres" },
  { codigo: "1212", nombre: "Equipos de Computación" },
  { codigo: "1213", nombre: "Vehículos" },
  
  // PASIVOS
  { codigo: "2111", nombre: "Cuentas por Pagar" },
  { codigo: "2112", nombre: "Documentos por Pagar" },
  { codigo: "2113", nombre: "IVA por Pagar" },
  { codigo: "2114", nombre: "IVA Crédito Fiscal" },
  { codigo: "2211", nombre: "Préstamos Bancarios LP" },
  
  // PATRIMONIO
  { codigo: "3111", nombre: "Capital Social" },
  { codigo: "3211", nombre: "Utilidades del Ejercicio" },
  { codigo: "3212", nombre: "Utilidades Retenidas" },
  
  // INGRESOS
  { codigo: "4111", nombre: "Ventas de Productos" },
  { codigo: "4112", nombre: "Ventas de Servicios" },
  { codigo: "4211", nombre: "Otros Ingresos" },
  
  // GASTOS
  { codigo: "5111", nombre: "Costo de Productos Vendidos" },
  { codigo: "5211", nombre: "Sueldos y Salarios" },
  { codigo: "5212", nombre: "Servicios Básicos" },
  { codigo: "5213", nombre: "Alquileres" },
  { codigo: "5214", nombre: "Seguros" },
  { codigo: "5221", nombre: "Gastos de Ventas" },
  { codigo: "5222", nombre: "Publicidad" },
  { codigo: "5223", nombre: "Comisiones" }
];

export const asientosIniciales: AsientoContable[] = [
  {
    id: "1",
    numero: "AST-001",
    fecha: "2024-06-15",
    concepto: "Venta de productos según factura 001234",
    referencia: "FAC-001234",
    debe: 1412.50,
    haber: 1412.50,
    estado: "registrado",
    cuentas: [
      { codigo: "1121", nombre: "Bancos", debe: 1412.50, haber: 0 },
      { codigo: "4111", nombre: "Ventas de Productos", debe: 0, haber: 1250.00 },
      { codigo: "2113", nombre: "IVA por Pagar", debe: 0, haber: 162.50 }
    ]
  },
  {
    id: "2",
    numero: "AST-002",
    fecha: "2024-06-14",
    concepto: "Compra de inventario según factura C-456",
    referencia: "COMP-456",
    debe: 2825.00,
    haber: 2825.00,
    estado: "registrado",
    cuentas: [
      { codigo: "1141", nombre: "Inventarios", debe: 2500.00, haber: 0 },
      { codigo: "2114", nombre: "IVA Crédito Fiscal", debe: 325.00, haber: 0 },
      { codigo: "2111", nombre: "Cuentas por Pagar", debe: 0, haber: 2825.00 }
    ]
  }
];

export const generarNumeroAsiento = (ultimoNumero: number): string => {
  const nuevoNumero = ultimoNumero + 1;
  return `AST-${nuevoNumero.toString().padStart(3, '0')}`;
};
