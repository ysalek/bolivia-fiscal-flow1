export interface Cliente {
  id: string;
  nombre: string;
  nit: string;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  fechaCreacion: string;
}

export interface ItemFactura {
  id: string;
  productoId: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
  codigoSIN: string;
}

export interface Factura {
  id: string;
  numero: string;
  cliente: Cliente;
  fecha: string;
  fechaVencimiento: string;
  items: ItemFactura[];
  subtotal: number;
  descuentoTotal: number;
  iva: number;
  total: number;
  estado: 'borrador' | 'enviada' | 'pagada' | 'anulada';
  estadoSIN: 'pendiente' | 'aceptado' | 'rechazado';
  cuf: string;
  codigoControl: string;
  observaciones: string;
  fechaCreacion: string;
}

export const clientesIniciales: Cliente[] = [
  {
    id: "1",
    nombre: "Empresa ABC S.R.L.",
    nit: "1234567890",
    email: "contacto@empresaabc.com",
    telefono: "77123456",
    direccion: "Av. Principal 123, Santa Cruz",
    activo: true,
    fechaCreacion: "2024-01-15"
  },
  {
    id: "2",
    nombre: "Comercial XYZ Ltda.",
    nit: "0987654321",
    email: "ventas@comercialxyz.com",
    telefono: "77654321",
    direccion: "Calle Secundaria 456, La Paz",
    activo: true,
    fechaCreacion: "2024-02-20"
  },
  {
    id: "3",
    nombre: "Servicios Integrales 123",
    nit: "5555666677",
    email: "info@servicios123.com",
    telefono: "77999888",
    direccion: "Zona Norte 789, Cochabamba",
    activo: true,
    fechaCreacion: "2024-03-10"
  }
];

export const facturasIniciales: Factura[] = [
  {
    id: "1",
    numero: "001234",
    cliente: clientesIniciales[0],
    fecha: "2024-06-15",
    fechaVencimiento: "2024-07-15",
    items: [
      {
        id: "1",
        productoId: "1",
        codigo: "PROD001",
        descripcion: "Laptop Dell Inspiron 15",
        cantidad: 1,
        precioUnitario: 4200,
        descuento: 0,
        subtotal: 4200,
        codigoSIN: "86173000"
      }
    ],
    subtotal: 4200,
    descuentoTotal: 0,
    iva: 546,
    total: 4746,
    estado: 'enviada',
    estadoSIN: 'aceptado',
    cuf: "E0D5C1B9A8F7E6D5C4B3A2F1E0D9C8B7A6F5E4D3C2B1A0F9E8D7C6B5A4F3E2D1",
    codigoControl: "12-34-56",
    observaciones: "",
    fechaCreacion: "2024-06-15"
  }
];

export const generarNumeroFactura = (ultimaFactura: string): string => {
  const numero = parseInt(ultimaFactura) + 1;
  return numero.toString().padStart(6, '0');
};

export const generarCUF = (): string => {
  // Simula un CUF (Código Único de Facturación) de 64 caracteres hexadecimales.
  // El CUF real se genera con un algoritmo complejo basado en los datos de la factura.
  const chars = '0123456789ABCDEF';
  let cuf = '';
  for (let i = 0; i < 64; i++) {
    cuf += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return cuf;
};

export const calcularIVA = (subtotal: number): number => {
  return subtotal * 0.13;
};

export const calcularTotal = (subtotalConDescuento: number): number => {
  const iva = calcularIVA(subtotalConDescuento);
  return subtotalConDescuento + iva;
};
