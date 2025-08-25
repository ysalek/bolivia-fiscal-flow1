// Tipos y datos para el módulo de empleados

export interface Empleado {
  id: string;
  numeroEmpleado: string;
  ci: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  direccion: string;
  cargo: string;
  departamento: string;
  fechaIngreso: string;
  salarioBase: number;
  estado: 'activo' | 'inactivo' | 'vacaciones' | 'licencia';
  tipoContrato: 'indefinido' | 'temporal' | 'consultor' | 'practicante';
  cuentaBancaria?: string;
  contactoEmergencia?: {
    nombre: string;
    telefono: string;
    relacion: string;
  };
  beneficios: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HistorialLaboral {
  id: string;
  empleadoId: string;
  fechaInicio: string;
  fechaFin?: string;
  cargo: string;
  departamento: string;
  salario: number;
  motivo?: string;
  activo: boolean;
}

export interface Evaluacion {
  id: string;
  empleadoId: string;
  fecha: string;
  periodo: string;
  calificacion: number; // 1-5
  comentarios: string;
  evaluador: string;
  objetivos: string[];
  fortalezas: string[];
  areasAMejorar: string[];
}

// Datos de ejemplo para cargos por departamento
export const cargosPorDepartamento = {
  'Contabilidad': [
    'Contador Senior',
    'Contador Junior', 
    'Asistente Contable',
    'Auxiliar Contable',
    'Analista Contable'
  ],
  'Finanzas': [
    'Gerente Financiero',
    'Analista Financiero',
    'Tesorero',
    'Coordinador Financiero'
  ],
  'Administración': [
    'Gerente Administrativo',
    'Asistente Administrativo',
    'Secretaria',
    'Recepcionista'
  ],
  'Recursos Humanos': [
    'Gerente de RRHH',
    'Especialista en RRHH',
    'Asistente de RRHH'
  ],
  'Auditoría': [
    'Auditor Senior',
    'Auditor Junior',
    'Supervisor de Auditoría'
  ],
  'Tesorería': [
    'Tesorero',
    'Asistente de Tesorería',
    'Cajero'
  ]
};

// Beneficios disponibles
export const beneficiosDisponibles = [
  'Seguro de salud',
  'Seguro de vida',
  'Bono de antigüedad',
  'Vacaciones',
  'Aguinaldo',
  'Prima',
  'Subsidio de transporte',
  'Subsidio de alimentación',
  'Capacitación y formación',
  'Flexibilidad horaria',
  'Bono por desempeño'
];

// Datos iniciales de empleados
export const empleadosIniciales: Empleado[] = [
  {
    id: '1',
    numeroEmpleado: 'EMP001',
    ci: '12345678',
    nombres: 'Juan Carlos',
    apellidos: 'Mamani Quispe',
    fechaNacimiento: '1985-03-15',
    telefono: '76543210',
    email: 'juan.mamani@empresa.com',
    direccion: 'Av. 6 de Agosto #123, La Paz',
    cargo: 'Contador Senior',
    departamento: 'Contabilidad',
    fechaIngreso: '2020-01-15',
    salarioBase: 8500,
    estado: 'activo',
    tipoContrato: 'indefinido',
    cuentaBancaria: '1234567890',
    contactoEmergencia: {
      nombre: 'Maria Mamani',
      telefono: '76123456',
      relacion: 'Esposa'
    },
    beneficios: ['Seguro de salud', 'Bono de antigüedad', 'Vacaciones', 'Aguinaldo'],
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    numeroEmpleado: 'EMP002',
    ci: '87654321',
    nombres: 'Ana Sofia',
    apellidos: 'Condori Lopez',
    fechaNacimiento: '1990-07-22',
    telefono: '78901234',
    email: 'ana.condori@empresa.com',
    direccion: 'Calle Comercio #456, La Paz',
    cargo: 'Asistente Contable',
    departamento: 'Contabilidad',
    fechaIngreso: '2021-03-01',
    salarioBase: 4500,
    estado: 'activo',
    tipoContrato: 'indefinido',
    cuentaBancaria: '0987654321',
    contactoEmergencia: {
      nombre: 'Pedro Condori',
      telefono: '78567890',
      relacion: 'Padre'
    },
    beneficios: ['Seguro de salud', 'Vacaciones', 'Aguinaldo'],
    createdAt: '2021-03-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    numeroEmpleado: 'EMP003',
    ci: '11223344',
    nombres: 'Carlos Miguel',
    apellidos: 'Vargas Herrera',
    fechaNacimiento: '1988-11-10',
    telefono: '69876543',
    email: 'carlos.vargas@empresa.com',
    direccion: 'Zona Sur #789, La Paz',
    cargo: 'Gerente Financiero',
    departamento: 'Finanzas',
    fechaIngreso: '2019-06-15',
    salarioBase: 12000,
    estado: 'activo',
    tipoContrato: 'indefinido',
    cuentaBancaria: '5555666677',
    contactoEmergencia: {
      nombre: 'Sandra Vargas',
      telefono: '69123456',
      relacion: 'Esposa'
    },
    beneficios: ['Seguro de salud', 'Seguro de vida', 'Bono de antigüedad', 'Vacaciones', 'Aguinaldo', 'Bono por desempeño'],
    createdAt: '2019-06-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '4',
    numeroEmpleado: 'EMP004',
    ci: '55667788',
    nombres: 'Patricia Elena',
    apellidos: 'Flores Gutierrez',
    fechaNacimiento: '1992-02-18',
    telefono: '72345678',
    email: 'patricia.flores@empresa.com',
    direccion: 'Av. Arce #321, La Paz',
    cargo: 'Analista Financiero',
    departamento: 'Finanzas',
    fechaIngreso: '2022-08-01',
    salarioBase: 6500,
    estado: 'activo',
    tipoContrato: 'indefinido',
    cuentaBancaria: '7777888899',
    contactoEmergencia: {
      nombre: 'Luis Flores',
      telefono: '72987654',
      relacion: 'Hermano'
    },
    beneficios: ['Seguro de salud', 'Vacaciones', 'Aguinaldo', 'Capacitación y formación'],
    createdAt: '2022-08-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '5',
    numeroEmpleado: 'EMP005',
    ci: '99887766',
    nombres: 'Roberto Luis',
    apellidos: 'Choque Apaza',
    fechaNacimiento: '1987-12-05',
    telefono: '71234567',
    email: 'roberto.choque@empresa.com',
    direccion: 'Calle Potosí #147, La Paz',
    cargo: 'Auditor Senior',
    departamento: 'Auditoría',
    fechaIngreso: '2018-04-10',
    salarioBase: 9500,
    estado: 'vacaciones',
    tipoContrato: 'indefinido',
    cuentaBancaria: '3333444455',
    contactoEmergencia: {
      nombre: 'Rosa Choque',
      telefono: '71876543',
      relacion: 'Madre'
    },
    beneficios: ['Seguro de salud', 'Seguro de vida', 'Bono de antigüedad', 'Vacaciones', 'Aguinaldo'],
    createdAt: '2018-04-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Utilidad para calcular antigüedad
export const calcularAntiguedad = (fechaIngreso: string): number => {
  const ingreso = new Date(fechaIngreso);
  const hoy = new Date();
  const diff = hoy.getTime() - ingreso.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

// Utilidad para calcular edad
export const calcularEdad = (fechaNacimiento: string): number => {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  const diff = hoy.getTime() - nacimiento.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

// Generar número de empleado automático
export const generarNumeroEmpleado = (empleados: Empleado[]): string => {
  const siguiente = empleados.length + 1;
  return `EMP${String(siguiente).padStart(3, '0')}`;
};

// Validar CI boliviano (básico)
export const validarCI = (ci: string): boolean => {
  return /^\d{7,8}$/.test(ci);
};

// Validar email
export const validarEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Obtener rango salarial por cargo
export const getRangoSalarial = (cargo: string): { min: number; max: number } => {
  const rangos: Record<string, { min: number; max: number }> = {
    'Gerente Financiero': { min: 10000, max: 15000 },
    'Gerente Administrativo': { min: 9000, max: 13000 },
    'Gerente de RRHH': { min: 8500, max: 12000 },
    'Contador Senior': { min: 7000, max: 10000 },
    'Auditor Senior': { min: 8000, max: 11000 },
    'Analista Financiero': { min: 5500, max: 8000 },
    'Contador Junior': { min: 4000, max: 6000 },
    'Asistente Contable': { min: 3500, max: 5000 },
    'Auxiliar Contable': { min: 3000, max: 4500 },
    'Tesorero': { min: 6000, max: 9000 },
    'Asistente Administrativo': { min: 3000, max: 4500 },
    'Secretaria': { min: 2800, max: 4000 },
    'Recepcionista': { min: 2500, max: 3500 }
  };
  
  return rangos[cargo] || { min: 2500, max: 15000 };
};