// Servicio para cumplimiento de normativas contables y tributarias bolivianas 2024-2025
export interface NormativaVigente {
  codigo: string;
  titulo: string;
  descripcion: string;
  fechaVigencia: string;
  fechaActualizacion: string;
  categoria: 'contable' | 'tributaria' | 'facturacion' | 'laboral' | 'financiera';
  estado: 'vigente' | 'derogada' | 'modificada';
  organismo: 'SIN' | 'CAMC' | 'ASFI' | 'Ministerio_Trabajo' | 'Ministerio_Economia';
  url?: string;
}

export interface RequisitosCumplimiento {
  codigo: string;
  descripcion: string;
  obligatorio: boolean;
  frecuencia: 'diaria' | 'mensual' | 'trimestral' | 'anual' | 'eventual';
  fechaLimite?: string;
  sancion?: string;
  estado: 'cumplido' | 'pendiente' | 'vencido';
}

class NormativaService {
  private normativas: NormativaVigente[] = [];
  private requisitos: RequisitosCumplimiento[] = [];

  constructor() {
    this.inicializarNormativas();
    this.inicializarRequisitos();
  }

  // Normativas actualizadas 2024-2025
  private inicializarNormativas(): void {
    this.normativas = [
      {
        codigo: 'RND-102500000031',
        titulo: 'Prórroga presentación Estados Financieros 2025',
        descripcion: 'Prórroga hasta el 21 de julio de 2025 para presentación de Estados Financieros, Memoria Anual, Dictamen de Auditoría Externa',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2024-12-30',
        categoria: 'contable',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'RND-102400000003',
        titulo: 'Facturación Electrónica - Octavo Grupo',
        descripcion: 'Obligatoriedad de facturación electrónica para el octavo grupo de contribuyentes',
        fechaVigencia: '2024-01-01',
        fechaActualizacion: '2024-03-15',
        categoria: 'facturacion',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'SIAT-V2.0',
        titulo: 'Sistema de Facturación v2.0',
        descripcion: 'Nueva versión del sistema de facturación con mejoras en seguridad y funcionalidades',
        fechaVigencia: '2024-06-01',
        fechaActualizacion: '2024-05-30',
        categoria: 'facturacion',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'CAMC-2024-01',
        titulo: 'Normas de Contabilidad 2024',
        descripcion: 'Actualización de normas contables para preparación de estados financieros',
        fechaVigencia: '2024-01-01',
        fechaActualizacion: '2024-01-15',
        categoria: 'contable',
        estado: 'vigente',
        organismo: 'CAMC'
      },
      {
        codigo: 'LEY-317',
        titulo: 'Código Tributario Boliviano',
        descripcion: 'Normas fundamentales del régimen jurídico del sistema tributario boliviano',
        fechaVigencia: '2012-12-11',
        fechaActualizacion: '2024-12-01',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'RND-SECTORES-ESPECIALES',
        titulo: 'Régimen Sectores Especiales',
        descripcion: 'Normativa para biodiesel, combustibles no subvencionados y energía eléctrica',
        fechaVigencia: '2024-01-01',
        fechaActualizacion: '2024-02-15',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      }
    ];
  }

  private inicializarRequisitos(): void {
    const hoy = new Date();
    const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 20);
    
    this.requisitos = [
      {
        codigo: 'IVA-MENSUAL',
        descripcion: 'Declaración y pago de IVA mensual (Formulario 200)',
        obligatorio: true,
        frecuencia: 'mensual',
        fechaLimite: proximoMes.toISOString().slice(0, 10),
        sancion: 'Multa del 10% más intereses',
        estado: 'pendiente'
      },
      {
        codigo: 'IT-MENSUAL',
        descripcion: 'Declaración y pago de IT mensual (Formulario 401)',
        obligatorio: true,
        frecuencia: 'mensual',
        fechaLimite: proximoMes.toISOString().slice(0, 10),
        sancion: 'Multa del 10% más intereses',
        estado: 'pendiente'
      },
      {
        codigo: 'RC-IVA-MENSUAL',
        descripcion: 'Declaración de retenciones RC-IVA (Formulario 110)',
        obligatorio: true,
        frecuencia: 'mensual',
        fechaLimite: proximoMes.toISOString().slice(0, 10),
        sancion: 'Multa del 20% más intereses',
        estado: 'pendiente'
      },
      {
        codigo: 'ESTADOS-FINANCIEROS',
        descripcion: 'Presentación de Estados Financieros anuales',
        obligatorio: true,
        frecuencia: 'anual',
        fechaLimite: '2025-07-21',
        sancion: 'Multa progresiva según días de atraso',
        estado: 'pendiente'
      },
      {
        codigo: 'FACTURACION-ELECTRONICA',
        descripcion: 'Migración a facturación electrónica según cronograma SIN',
        obligatorio: true,
        frecuencia: 'eventual',
        sancion: 'Suspensión de actividades',
        estado: 'cumplido'
      }
    ];
  }

  // Obtener normativas vigentes
  getNormativasVigentes(categoria?: string): NormativaVigente[] {
    let normativas = this.normativas.filter(n => n.estado === 'vigente');
    if (categoria) {
      normativas = normativas.filter(n => n.categoria === categoria);
    }
    return normativas.sort((a, b) => new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime());
  }

  // Obtener requisitos de cumplimiento
  getRequisitosCumplimiento(estado?: string): RequisitosCumplimiento[] {
    let requisitos = this.requisitos;
    if (estado) {
      requisitos = requisitos.filter(r => r.estado === estado);
    }
    return requisitos.sort((a, b) => {
      if (!a.fechaLimite) return 1;
      if (!b.fechaLimite) return -1;
      return new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime();
    });
  }

  // Verificar cumplimiento específico
  verificarCumplimiento(codigo: string): RequisitosCumplimiento | null {
    return this.requisitos.find(r => r.codigo === codigo) || null;
  }

  // Calcular días hasta vencimiento
  getDiasHastaVencimiento(fechaLimite: string): number {
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    return Math.ceil((limite.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
  }

  // Obtener alertas de vencimiento
  getAlertasVencimiento(): RequisitosCumplimiento[] {
    const hoy = new Date();
    return this.requisitos.filter(r => {
      if (!r.fechaLimite || r.estado === 'cumplido') return false;
      const dias = this.getDiasHastaVencimiento(r.fechaLimite);
      return dias <= 15; // Alertar 15 días antes
    });
  }

  // Marcar requisito como cumplido
  marcarComoCumplido(codigo: string): void {
    const index = this.requisitos.findIndex(r => r.codigo === codigo);
    if (index !== -1) {
      this.requisitos[index].estado = 'cumplido';
    }
  }

  // Obtener resumen de cumplimiento
  getResumenCumplimiento(): {
    total: number;
    cumplidos: number;
    pendientes: number;
    vencidos: number;
    porcentajeCumplimiento: number;
  } {
    const total = this.requisitos.length;
    const cumplidos = this.requisitos.filter(r => r.estado === 'cumplido').length;
    const vencidos = this.requisitos.filter(r => {
      if (!r.fechaLimite || r.estado === 'cumplido') return false;
      return this.getDiasHastaVencimiento(r.fechaLimite) < 0;
    }).length;
    const pendientes = total - cumplidos - vencidos;

    return {
      total,
      cumplidos,
      pendientes,
      vencidos,
      porcentajeCumplimiento: Math.round((cumplidos / total) * 100)
    };
  }

  // Validar formato de documentos según normativa
  validarFormatoDocumento(tipo: string, datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    switch (tipo) {
      case 'factura':
        if (!datos.numeroFactura) errores.push('Número de factura requerido');
        if (!datos.nitCliente) errores.push('NIT del cliente requerido');
        if (!datos.cuf) errores.push('CUF (Código Único de Facturación) requerido');
        if (!datos.cufd) errores.push('CUFD (Código Único de Facturación Diaria) requerido');
        break;
      
      case 'asiento':
        if (!datos.fecha) errores.push('Fecha del asiento requerida');
        if (!datos.glosa) errores.push('Glosa del asiento requerida');
        if (!datos.movimientos || datos.movimientos.length === 0) {
          errores.push('Debe incluir al menos un movimiento');
        }
        break;

      case 'estado_financiero':
        if (!datos.periodo) errores.push('Período del estado financiero requerido');
        if (!datos.moneda) errores.push('Moneda de presentación requerida');
        break;
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  // Obtener códigos de actividad económica actualizados
  getActividadesEconomicas(): Array<{ codigo: string; descripcion: string; sector: string }> {
    return [
      { codigo: '620100', descripcion: 'Programación informática', sector: 'Servicios tecnológicos' },
      { codigo: '620200', descripcion: 'Consultoría informática', sector: 'Servicios tecnológicos' },
      { codigo: '192000', descripcion: 'Fabricación de productos de refinación del petróleo', sector: 'Combustibles' },
      { codigo: '351100', descripcion: 'Generación de energía eléctrica', sector: 'Energía' },
      { codigo: '461000', descripcion: 'Venta al por mayor de maquinaria y equipo', sector: 'Comercio' },
      { codigo: '471100', descripcion: 'Venta al por menor en almacenes no especializados', sector: 'Comercio' },
      { codigo: '682000', descripcion: 'Alquiler de bienes inmuebles propios o arrendados', sector: 'Inmobiliario' }
    ];
  }
}

export const normativaService = new NormativaService();
export default normativaService;