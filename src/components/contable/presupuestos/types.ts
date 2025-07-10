export interface PresupuestoItem {
  id: string;
  concepto: string;
  categoria: string;
  presupuestado: number;
  ejecutado: number;
  variacion: number;
  porcentajeEjecucion: number;
}

export interface Presupuesto {
  id: string;
  nombre: string;
  descripcion: string;
  periodo: string;
  estado: 'borrador' | 'aprobado' | 'en_ejecucion' | 'cerrado';
  totalPresupuestado: number;
  totalEjecutado: number;
  fechaInicio: string;
  fechaFin: string;
  responsable: string;
}