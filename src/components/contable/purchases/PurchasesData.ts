
export interface Proveedor {
  id: string;
  nombre: string;
  nit: string;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  fechaCreacion: string;
}

export interface ItemCompra {
  id: string;
  productoId: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

export interface Compra {
  id: string;
  numero: string;
  proveedor: Proveedor;
  fecha: string;
  fechaVencimiento: string;
  items: ItemCompra[];
  subtotal: number;
  descuentoTotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'recibida' | 'pagada' | 'anulada';
  observaciones: string;
  fechaCreacion: string;
}

export const proveedoresIniciales: Proveedor[] = [
  {
    id: "1",
    nombre: "Distribuidora Tech S.A.",
    nit: "1122334455",
    email: "ventas@distribuidoratech.com",
    telefono: "77555666",
    direccion: "Zona Sur 456, Santa Cruz",
    activo: true,
    fechaCreacion: "2024-01-10"
  },
  {
    id: "2", 
    nombre: "Proveedora Industrial Ltda.",
    nit: "5566778899",
    email: "compras@proindltda.com",
    telefono: "77333444",
    direccion: "Av. Industrial 789, La Paz",
    activo: true,
    fechaCreacion: "2024-02-15"
  }
];

export const comprasIniciales: Compra[] = [
  {
    id: "1",
    numero: "COM-001",
    proveedor: proveedoresIniciales[0],
    fecha: "2024-06-10",
    fechaVencimiento: "2024-07-10",
    items: [
      {
        id: "1",
        productoId: "1",
        codigo: "PROD001",
        descripcion: "Laptop Dell Inspiron 15",
        cantidad: 5,
        precioUnitario: 3500,
        descuento: 0,
        subtotal: 17500
      }
    ],
    subtotal: 17500,
    descuentoTotal: 0,
    iva: 2275,
    total: 19775,
    estado: 'recibida',
    observaciones: "Compra inicial de inventario",
    fechaCreacion: "2024-06-10"
  }
];

export const generarNumeroCompra = (ultimaCompra: string): string => {
  const numero = parseInt(ultimaCompra.split('-')[1]) + 1;
  return `COM-${numero.toString().padStart(3, '0')}`;
};
