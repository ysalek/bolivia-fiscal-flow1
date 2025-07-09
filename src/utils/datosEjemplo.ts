// Datos de ejemplo reales para el sistema contable boliviano

export const productosEjemplo = [
  {
    id: '1',
    codigo: 'PROD001',
    nombre: 'Laptop Dell Inspiron 15',
    descripcion: 'Laptop Dell Inspiron 15, Intel Core i5, 8GB RAM, 256GB SSD',
    categoria: 'Equipos de Computación',
    precio: 5200.00,
    costo: 4100.00,
    stockActual: 15,
    stockMinimo: 5,
    unidadMedida: 'PZA',
    estado: 'activo' as const,
    fechaRegistro: '2024-01-01',
    proveedor: 'Dell Technologies Bolivia'
  },
  {
    id: '2',
    codigo: 'PROD002',
    nombre: 'Mouse Logitech MX Master 3',
    descripcion: 'Mouse inalámbrico Logitech MX Master 3 para productividad',
    categoria: 'Accesorios de Computación',
    precio: 250.00,
    costo: 180.00,
    stockActual: 45,
    stockMinimo: 10,
    unidadMedida: 'PZA',
    estado: 'activo' as const,
    fechaRegistro: '2024-01-02',
    proveedor: 'Logitech Bolivia'
  },
  {
    id: '3',
    codigo: 'PROD003',
    nombre: 'Escritorio Ejecutivo de Madera',
    descripcion: 'Escritorio ejecutivo de madera maciza con cajones y espacio para CPU',
    categoria: 'Muebles de Oficina',
    precio: 1800.00,
    costo: 1200.00,
    stockActual: 8,
    stockMinimo: 3,
    unidadMedida: 'PZA',
    estado: 'activo' as const,
    fechaRegistro: '2024-01-03',
    proveedor: 'Muebles Santa Cruz Ltda.'
  }
];

export const clientesEjemplo = [
  {
    id: '1',
    codigo: 'CLI001',
    nit: '1234567890',
    nombre: 'Juan Carlos Pérez Miranda',
    email: 'juan.perez@email.com',
    telefono: '78945612',
    direccion: 'Av. 6 de Agosto #2450, La Paz',
    tipoCliente: 'persona' as const,
    estado: 'activo' as const,
    fechaRegistro: '2024-01-10',
    limiteCredito: 50000.00,
    saldoPendiente: 2100.00
  },
  {
    id: '2',
    codigo: 'CLI002',
    nit: '9876543210',
    nombre: 'Empresa Constructora Los Andes S.R.L.',
    email: 'contacto@constructoraandes.com',
    telefono: '22451234',
    direccion: 'Zona Sur, Calle 21 #567, La Paz',
    tipoCliente: 'empresa' as const,
    estado: 'activo' as const,
    fechaRegistro: '2024-01-12',
    limiteCredito: 200000.00,
    saldoPendiente: 0.00
  },
  {
    id: '3',
    codigo: 'CLI003',
    nit: '5555444433',
    nombre: 'María Elena Rodríguez Mamani',
    email: 'maria.rodriguez@gmail.com',
    telefono: '69887745',
    direccion: 'Villa Fátima, Calle 15 #234, La Paz',
    tipoCliente: 'persona' as const,
    estado: 'activo' as const,
    fechaRegistro: '2024-01-15',
    limiteCredito: 25000.00,
    saldoPendiente: 0.00
  }
];

export const proveedoresEjemplo = [
  {
    id: '1',
    codigo: 'PROV001',
    nit: '1020304050',
    nombre: 'Dell Technologies Bolivia S.A.',
    email: 'ventas@dell.com.bo',
    telefono: '22789456',
    direccion: 'Av. Arce #2234, La Paz',
    contacto: 'Carlos Mendoza - Gerente de Ventas',
    estado: 'activo' as const,
    fechaRegistro: '2024-01-05'
  },
  {
    id: '2',
    codigo: 'PROV002',
    nit: '2030405060',
    nombre: 'Muebles Santa Cruz Ltda.',
    email: 'info@mueblessantacruz.com',
    telefono: '33456789',
    direccion: 'Parque Industrial, Santa Cruz',
    contacto: 'Ana Fernández - Coordinadora Comercial',
    estado: 'activo' as const,
    fechaRegistro: '2024-01-06'
  }
];

export const facturasEjemplo = [
  {
    id: '1',
    numero: 'FAC-001',
    fecha: '2024-01-15',
    vencimiento: '2024-02-14',
    cliente: {
      id: '1',
      nit: '1234567890',
      nombre: 'Juan Carlos Pérez Miranda',
      email: 'juan.perez@email.com'
    },
    items: [
      {
        id: '1',
        productoId: '2',
        descripcion: 'Mouse Logitech MX Master 3',
        cantidad: 2,
        precio: 250.00,
        descuento: 0,
        total: 500.00
      }
    ],
    subtotal: 500.00,
    descuento: 0.00,
    iva: 65.00,
    total: 565.00,
    estado: 'pagada' as const,
    metodoPago: 'efectivo',
    observaciones: 'Pago al contado',
    fechaCreacion: '2024-01-15T10:30:00Z',
    creadoPor: 'Ana García - Contadora'
  },
  {
    id: '2',
    numero: 'FAC-002',
    fecha: '2024-01-18',
    vencimiento: '2024-02-17',
    cliente: {
      id: '2',
      nit: '9876543210',
      nombre: 'Empresa Constructora Los Andes S.R.L.',
      email: 'contacto@constructoraandes.com'
    },
    items: [
      {
        id: '1',
        productoId: '1',
        descripcion: 'Laptop Dell Inspiron 15',
        cantidad: 3,
        precio: 5200.00,
        descuento: 260.00,
        total: 15340.00
      },
      {
        id: '2',
        productoId: '3',
        descripcion: 'Escritorio Ejecutivo de Madera',
        cantidad: 2,
        precio: 1800.00,
        descuento: 0,
        total: 3600.00
      }
    ],
    subtotal: 18940.00,
    descuento: 260.00,
    iva: 2462.20,
    total: 21142.20,
    estado: 'enviada' as const,
    metodoPago: 'transferencia',
    observaciones: 'Entrega en oficinas del cliente',
    fechaCreacion: '2024-01-18T14:45:00Z',
    creadoPor: 'Ana García - Contadora'
  }
];

export const comprasEjemplo = [
  {
    id: '1',
    numero: 'COMP-001',
    fecha: '2024-01-10',
    proveedor: {
      id: '1',
      nit: '1020304050',
      nombre: 'Dell Technologies Bolivia S.A.'
    },
    items: [
      {
        id: '1',
        productoId: '1',
        descripcion: 'Laptop Dell Inspiron 15',
        cantidad: 20,
        costo: 4100.00,
        total: 82000.00
      }
    ],
    subtotal: 82000.00,
    iva: 10660.00,
    total: 92660.00,
    estado: 'recibida' as const,
    fechaCreacion: '2024-01-10T09:15:00Z',
    creadoPor: 'Carlos López - Gerente'
  },
  {
    id: '2',
    numero: 'COMP-002',
    fecha: '2024-01-12',
    proveedor: {
      id: '2',
      nit: '2030405060',
      nombre: 'Muebles Santa Cruz Ltda.'
    },
    items: [
      {
        id: '1',
        productoId: '3',
        descripcion: 'Escritorio Ejecutivo de Madera',
        cantidad: 10,
        costo: 1200.00,
        total: 12000.00
      }
    ],
    subtotal: 12000.00,
    iva: 1560.00,
    total: 13560.00,
    estado: 'pendiente' as const,
    fechaCreacion: '2024-01-12T11:30:00Z',
    creadoPor: 'Carlos López - Gerente'
  }
];

export const asientosEjemplo = [
  {
    id: '1',
    numero: 'AST-001',
    fecha: '2024-01-15',
    concepto: 'Venta de mercadería según factura FAC-001',
    referencia: 'FAC-001',
    debe: 565.00,
    haber: 565.00,
    estado: 'registrado' as const,
    cuentas: [
      { codigo: '1111', nombre: 'Caja General', debe: 565.00, haber: 0 },
      { codigo: '4111', nombre: 'Ventas', debe: 0, haber: 500.00 },
      { codigo: '2131', nombre: 'IVA Débito Fiscal', debe: 0, haber: 65.00 }
    ]
  },
  {
    id: '2',
    numero: 'AST-002',
    fecha: '2024-01-10',
    concepto: 'Compra de inventario según factura COMP-001',
    referencia: 'COMP-001',
    debe: 92660.00,
    haber: 92660.00,
    estado: 'registrado' as const,
    cuentas: [
      { codigo: '1131', nombre: 'Inventarios - Mercaderías', debe: 82000.00, haber: 0 },
      { codigo: '1142', nombre: 'IVA Crédito Fiscal', debe: 10660.00, haber: 0 },
      { codigo: '2111', nombre: 'Cuentas por Pagar Comerciales', debe: 0, haber: 92660.00 }
    ]
  },
  {
    id: '3',
    numero: 'AST-003',
    fecha: '2024-01-16',
    concepto: 'Pago de servicios básicos - Energía eléctrica',
    referencia: 'RECIBO-789',
    debe: 450.00,
    haber: 450.00,
    estado: 'registrado' as const,
    cuentas: [
      { codigo: '5231', nombre: 'Servicios Básicos', debe: 450.00, haber: 0 },
      { codigo: '1111', nombre: 'Caja General', debe: 0, haber: 450.00 }
    ]
  }
];

export const initializarDatosEjemplo = () => {
  // Solo inicializar si no existen datos
  if (!localStorage.getItem('productos')) {
    localStorage.setItem('productos', JSON.stringify(productosEjemplo));
  }
  
  if (!localStorage.getItem('clientes')) {
    localStorage.setItem('clientes', JSON.stringify(clientesEjemplo));
  }
  
  if (!localStorage.getItem('proveedores')) {
    localStorage.setItem('proveedores', JSON.stringify(proveedoresEjemplo));
  }
  
  if (!localStorage.getItem('facturas')) {
    localStorage.setItem('facturas', JSON.stringify(facturasEjemplo));
  }
  
  if (!localStorage.getItem('compras')) {
    localStorage.setItem('compras', JSON.stringify(comprasEjemplo));
  }
  
  if (!localStorage.getItem('asientosContables')) {
    localStorage.setItem('asientosContables', JSON.stringify(asientosEjemplo));
  }
  
  // Inicializar último backup
  if (!localStorage.getItem('ultimo-backup')) {
    localStorage.setItem('ultimo-backup', new Date().toISOString());
  }
};