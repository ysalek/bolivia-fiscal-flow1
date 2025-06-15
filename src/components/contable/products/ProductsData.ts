
export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  unidadMedida: string;
  precioVenta: number;
  costoUnitario: number;
  codigoSIN: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CategoriaProducto {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export const categoriasIniciales: CategoriaProducto[] = [
  {
    id: "1",
    nombre: "Equipos",
    descripcion: "Equipos de computación y tecnología",
    activo: true
  },
  {
    id: "2", 
    nombre: "Accesorios",
    descripcion: "Accesorios y periféricos",
    activo: true
  },
  {
    id: "3",
    nombre: "Servicios",
    descripcion: "Servicios profesionales",
    activo: true
  }
];

export const productosIniciales: Producto[] = [
  {
    id: "1",
    codigo: "PROD001",
    nombre: "Laptop Dell Inspiron 15",
    descripcion: "Laptop Dell Inspiron 15 con procesador Intel i5",
    categoria: "Equipos",
    unidadMedida: "PZA",
    precioVenta: 4200,
    costoUnitario: 3500,
    codigoSIN: "86173000",
    activo: true,
    fechaCreacion: "2024-06-01",
    fechaActualizacion: "2024-06-15"
  },
  {
    id: "2",
    codigo: "PROD002", 
    nombre: "Mouse Inalámbrico",
    descripcion: "Mouse inalámbrico óptico con sensor de alta precisión",
    categoria: "Accesorios",
    unidadMedida: "PZA",
    precioVenta: 65,
    costoUnitario: 45,
    codigoSIN: "84716070",
    activo: true,
    fechaCreacion: "2024-06-01",
    fechaActualizacion: "2024-06-13"
  },
  {
    id: "3",
    codigo: "SERV001",
    nombre: "Consultoría IT",
    descripcion: "Servicios de consultoría en tecnologías de información",
    categoria: "Servicios",
    unidadMedida: "HR",
    precioVenta: 150,
    costoUnitario: 0,
    codigoSIN: "83111100",
    activo: true,
    fechaCreacion: "2024-06-01",
    fechaActualizacion: "2024-06-15"
  }
];

export const generarCodigoProducto = (ultimoCodigo: string): string => {
  const numero = parseInt(ultimoCodigo.replace('PROD', '')) + 1;
  return `PROD${numero.toString().padStart(3, '0')}`;
};
