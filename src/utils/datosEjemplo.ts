
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
    costoUnitario: 4100.00,
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
    costoUnitario: 180.00,
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
    costoUnitario: 1200.00,
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
        subtotal: 500.00,
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
        subtotal: 15340.00,
        total: 15340.00
      },
      {
        id: '2',
        productoId: '3',
        descripcion: 'Escritorio Ejecutivo de Madera',
        cantidad: 2,
        precio: 1800.00,
        descuento: 0,
        subtotal: 3600.00,
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
      { codigo: '2113', nombre: 'IVA Débito Fiscal', debe: 0, haber: 65.00 }
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

// Datos de ejemplo completos para comprobantes integrados
export const comprobantesIntegradosEjemplo = [
  {
    id: "1",
    tipo: "ingreso",
    numero: "ING-0001",
    fecha: "2024-01-20",
    concepto: "Venta de servicios de consultoría",
    beneficiario: "Empresa ABC S.R.L.",
    monto: 8700.00,
    metodoPago: "1112",
    referencia: "SERV-001",
    observaciones: "Servicio de consultoría con factura",
    estado: "autorizado",
    creadoPor: "Ana García - Contadora",
    fechaCreacion: "2024-01-20T10:30:00Z",
    conFactura: true,
    cuentaIngreso: "4191",
    cuentas: [
      { codigo: "1112", nombre: "Banco Nacional de Bolivia", debe: 8700.00, haber: 0 },
      { codigo: "4191", nombre: "Otros Ingresos", debe: 0, haber: 7522.17 }, // Base sin IT
      { codigo: "2113", nombre: "IVA por Pagar", debe: 0, haber: 977.83 }, // IVA 13%
      { codigo: "5211", nombre: "Impuesto a las Transacciones", debe: 225.66, haber: 0 }, // IT 3%
      { codigo: "1111", nombre: "Caja General", debe: 0, haber: 225.66 } // IT pagado
    ],
    asientoGenerado: true,
    asientoId: "ASI-001"
  },
  {
    id: "2",
    tipo: "egreso",
    numero: "EGR-0001",
    fecha: "2024-01-21",
    concepto: "Pago de alquiler de oficina",
    beneficiario: "Inmobiliaria La Paz Ltda.",
    monto: 4500.00,
    metodoPago: "1112",
    referencia: "ALQ-ENE-2024",
    observaciones: "Alquiler enero 2024 con factura",
    estado: "autorizado",
    creadoPor: "Carlos López - Gerente",
    fechaCreacion: "2024-01-21T14:15:00Z",
    conFactura: true,
    cuentaGasto: "5241",
    cuentas: [
      { codigo: "5241", nombre: "Alquileres", debe: 3982.30, haber: 0 }, // 87% del total (base sin IVA)
      { codigo: "1142", nombre: "IVA Crédito Fiscal", debe: 517.70, haber: 0 }, // IVA 13%
      { codigo: "1112", nombre: "Banco Nacional de Bolivia", debe: 0, haber: 4500.00 }
    ],
    asientoGenerado: true,
    asientoId: "ASI-002"
  },
  {
    id: "3",
    tipo: "egreso",
    numero: "EGR-0002",
    fecha: "2024-01-22",
    concepto: "Compra de suministros de oficina",
    beneficiario: "Papelería Central",
    monto: 850.00,
    metodoPago: "1111",
    referencia: "COMP-SUM-001",
    observaciones: "Suministros varios sin factura",
    estado: "autorizado",
    creadoPor: "Ana García - Contadora",
    fechaCreacion: "2024-01-22T09:45:00Z",
    conFactura: false,
    cuentaGasto: "5251",
    cuentas: [
      { codigo: "5251", nombre: "Materiales y Suministros", debe: 850.00, haber: 0 }, // Monto completo sin factura
      { codigo: "1111", nombre: "Caja General", debe: 0, haber: 850.00 }
    ],
    asientoGenerado: true,
    asientoId: "ASI-003"
  },
  {
    id: "4",
    tipo: "egreso",
    numero: "EGR-0003",
    fecha: "2024-01-23",
    concepto: "Pago de servicios profesionales",
    beneficiario: "Estudio Jurídico Morales & Asociados",
    monto: 2300.00,
    metodoPago: "1112",
    referencia: "HON-ENE-001",
    observaciones: "Honorarios profesionales con factura",
    estado: "autorizado",
    creadoPor: "Carlos López - Gerente",
    fechaCreacion: "2024-01-23T16:20:00Z",
    conFactura: true,
    cuentaGasto: "5191",
    cuentas: [
      { codigo: "5191", nombre: "Gastos Varios", debe: 2035.40, haber: 0 }, // 87% del total
      { codigo: "1142", nombre: "IVA Crédito Fiscal", debe: 264.60, haber: 0 }, // IVA 13%
      { codigo: "1112", nombre: "Banco Nacional de Bolivia", debe: 0, haber: 2300.00 }
    ],
    asientoGenerado: true,
    asientoId: "ASI-004"
  },
  {
    id: "5",
    tipo: "ingreso",
    numero: "ING-0002",
    fecha: "2024-01-24",
    concepto: "Venta adicional de productos",
    beneficiario: "Cliente Corporativo XYZ",
    monto: 12000.00,
    metodoPago: "1112",
    referencia: "VENTA-002",
    observaciones: "Venta con factura emitida",
    estado: "autorizado",
    creadoPor: "Ana García - Contadora",
    fechaCreacion: "2024-01-24T11:00:00Z",
    conFactura: true,
    cuentaIngreso: "4111",
    cuentas: [
      { codigo: "1112", nombre: "Banco Nacional de Bolivia", debe: 12000.00, haber: 0 },
      { codigo: "4111", nombre: "Ventas", debe: 0, haber: 10379.31 }, // Base sin IT
      { codigo: "2113", nombre: "IVA por Pagar", debe: 0, haber: 1349.31 }, // IVA 13%
      { codigo: "5211", nombre: "Impuesto a las Transacciones", debe: 311.38, haber: 0 }, // IT 3%
      { codigo: "1111", nombre: "Caja General", debe: 0, haber: 311.38 } // IT pagado
    ],
    asientoGenerado: true,
    asientoId: "ASI-005"
  },
  {
    id: "6",
    tipo: "egreso",
    numero: "EGR-0004",
    fecha: "2024-01-25",
    concepto: "Pago de sueldos y salarios",
    beneficiario: "Planilla de empleados",
    monto: 15000.00,
    metodoPago: "1112",
    referencia: "PLAN-ENE-2024",
    observaciones: "Planilla enero 2024 sin factura",
    estado: "autorizado",
    creadoPor: "Ana García - Contadora",
    fechaCreacion: "2024-01-25T17:30:00Z",
    conFactura: false,
    cuentaGasto: "5211",
    cuentas: [
      { codigo: "5211", nombre: "Sueldos y Salarios", debe: 15000.00, haber: 0 }, // Monto completo
      { codigo: "1112", nombre: "Banco Nacional de Bolivia", debe: 0, haber: 15000.00 }
    ],
    asientoGenerado: true,
    asientoId: "ASI-006"
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

  // Inicializar comprobantes integrados con datos completos de prueba
  if (!localStorage.getItem('comprobantes_integrados')) {
    localStorage.setItem('comprobantes_integrados', JSON.stringify(comprobantesIntegradosEjemplo));
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
      { codigo: "5211", nombre: "Impuesto a las Transacciones", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true }
    ];
    localStorage.setItem('planCuentas', JSON.stringify(planCuentasCompleto));
  }
  
  // Inicializar último backup
  if (!localStorage.getItem('ultimo-backup')) {
    localStorage.setItem('ultimo-backup', new Date().toISOString());
  }

  console.log("✅ Datos de ejemplo completos inicializados correctamente");
  console.log("📊 Comprobantes integrados:", comprobantesIntegradosEjemplo.length);
  console.log("💰 Total ingresos con factura:", comprobantesIntegradosEjemplo.filter(c => c.tipo === 'ingreso' && c.conFactura).reduce((sum, c) => sum + c.monto, 0));
  console.log("💸 Total gastos con factura:", comprobantesIntegradosEjemplo.filter(c => c.tipo === 'egreso' && c.conFactura).reduce((sum, c) => sum + c.monto, 0));
  console.log("📋 Estado de resultados debería mostrar todos los gastos administrativos");
};
