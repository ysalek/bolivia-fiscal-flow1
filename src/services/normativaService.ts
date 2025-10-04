// Servicio para cumplimiento de normativas contables y tributarias bolivianas
// Actualizado a octubre 2025 según RND vigentes del SIN
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

  // Normativas actualizadas hasta octubre 2025
  private inicializarNormativas(): void {
    this.normativas = [
      {
        codigo: 'RND-102500000018',
        titulo: 'Nuevo Clasificador de Actividades Económicas (CAEB-SIN)',
        descripcion: 'Aprueba el nuevo Clasificador de Actividades Económicas del Registro Nacional de Contribuyentes del SIN. Vigente desde mayo 2025.',
        fechaVigencia: '2025-05-01',
        fechaActualizacion: '2025-04-22',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'RND-102500000017',
        titulo: 'Registro Nacional de Contribuyentes (RNC)',
        descripcion: 'Sustituye el PBD-11 por el nuevo Registro Nacional de Contribuyentes. Migración automática de datos.',
        fechaVigencia: '2025-04-01',
        fechaActualizacion: '2025-04-15',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'RND-102500000036',
        titulo: 'Prórroga Facturación en Línea - Grupos 9º al 12º',
        descripcion: 'Se amplía hasta el 31 de marzo de 2026 el plazo para que contribuyentes de los Grupos Noveno al Décimo Segundo ajusten sus sistemas a facturación en línea.',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-09-25',
        categoria: 'facturacion',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'RND-102500000002',
        titulo: 'Beneficio IVA Tasa Cero 2025',
        descripcion: 'Aplicación de Tasa Cero de IVA para sectores: agropecuario, industrial, construcción y minería durante la gestión 2025.',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-01-15',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
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
        codigo: 'RND-102400000021',
        titulo: 'Requisitos de Bancarización 2025',
        descripcion: 'Requisitos de bancarización para transacciones comerciales y tributarias. Rechazo de gastos y costos no bancarizados.',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2024-12-20',
        categoria: 'tributaria',
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
        codigo: 'RC-IVA-2025',
        titulo: 'RC-IVA Actualizado 2025',
        descripcion: 'Retenciones de RC-IVA: 13% para profesionales independientes, servicios y alquileres',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-01-15',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'RC-IT-2025',
        titulo: 'RC-IT Actualizado 2025',
        descripcion: 'Retenciones de RC-IT: 3% sobre ingresos de profesionales independientes y alquileres',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-01-15',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'FACILIDADES-PAGO-2025',
        titulo: 'Facilidades de Pago Actualizadas 2025',
        descripcion: 'Marco normativo actualizado para facilidades de pago tributario, incluyendo oportunidades para contribuyentes con planes incumplidos',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-01-10',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'LEY-1613',
        titulo: 'Ley Presupuesto General del Estado 2025',
        descripcion: 'Ley del Presupuesto General del Estado para la gestión 2025',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-01-01',
        categoria: 'financiera',
        estado: 'vigente',
        organismo: 'Ministerio_Economia'
      },
      {
        codigo: 'IVA-TASA-2025',
        titulo: 'Tasa IVA 13% - Vigente',
        descripcion: 'Tasa general del Impuesto al Valor Agregado: 13% aplicable a todas las transacciones gravadas',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-01-01',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'IT-TASA-2025',
        titulo: 'Tasa IT 3% - Vigente',
        descripcion: 'Tasa del Impuesto a las Transacciones: 3% sobre ingresos brutos',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-01-01',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'IUE-TASA-2025',
        titulo: 'Tasa IUE 25% - Vigente',
        descripcion: 'Tasa del Impuesto sobre las Utilidades de las Empresas: 25% sobre utilidades netas',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-01-01',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'LEY-317',
        titulo: 'Código Tributario Boliviano',
        descripcion: 'Normas fundamentales del régimen jurídico del sistema tributario boliviano',
        fechaVigencia: '2012-12-11',
        fechaActualizacion: '2025-01-01',
        categoria: 'tributaria',
        estado: 'vigente',
        organismo: 'SIN'
      },
      {
        codigo: 'SALARIO-MINIMO-2025',
        titulo: 'Salario Mínimo Nacional 2025',
        descripcion: 'D.S. N° 5383 - Incremento del 5% sobre salario básico para sector privado. SMN: Bs 2,500',
        fechaVigencia: '2025-05-01',
        fechaActualizacion: '2025-05-15',
        categoria: 'laboral',
        estado: 'vigente',
        organismo: 'Ministerio_Trabajo'
      },
      {
        codigo: 'UFV-2025',
        titulo: 'Unidad de Fomento de Vivienda 2025',
        descripcion: 'UFV actualizada diariamente por el BCB. Valor aproximado octubre 2025: 2.96 Bs',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-10-04',
        categoria: 'financiera',
        estado: 'vigente',
        organismo: 'Ministerio_Economia'
      },
      {
        codigo: 'TC-USD-2025',
        titulo: 'Tipo de Cambio USD 2025',
        descripcion: 'Tipo de cambio oficial USD/BOB: 6.96 Bs por dólar estadounidense',
        fechaVigencia: '2025-01-01',
        fechaActualizacion: '2025-10-04',
        categoria: 'financiera',
        estado: 'vigente',
        organismo: 'Ministerio_Economia'
      }
    ];
  }

  private inicializarRequisitos(): void {
    const hoy = new Date();
    const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 20);
    const proximoTrimestre = new Date(hoy.getFullYear(), hoy.getMonth() + 3, 31);
    
    this.requisitos = [
      {
        codigo: 'IVA-MENSUAL',
        descripcion: 'Declaración y pago de IVA mensual (Formulario 200)',
        obligatorio: true,
        frecuencia: 'mensual',
        fechaLimite: proximoMes.toISOString().slice(0, 10),
        sancion: 'Multa del 10% más intereses por mora',
        estado: 'pendiente'
      },
      {
        codigo: 'IT-MENSUAL',
        descripcion: 'Declaración y pago de IT mensual (Formulario 401)',
        obligatorio: true,
        frecuencia: 'mensual',
        fechaLimite: proximoMes.toISOString().slice(0, 10),
        sancion: 'Multa del 10% más intereses por mora',
        estado: 'pendiente'
      },
      {
        codigo: 'RC-IVA-MENSUAL',
        descripcion: 'Declaración de retenciones RC-IVA (Formulario 110)',
        obligatorio: true,
        frecuencia: 'mensual',
        fechaLimite: proximoMes.toISOString().slice(0, 10),
        sancion: 'Multa del 20% más intereses por mora',
        estado: 'pendiente'
      },
      {
        codigo: 'RC-IT-MENSUAL',
        descripcion: 'Declaración de retenciones RC-IT (Formulario 610)',
        obligatorio: true,
        frecuencia: 'mensual',
        fechaLimite: proximoMes.toISOString().slice(0, 10),
        sancion: 'Multa del 20% más intereses por mora',
        estado: 'pendiente'
      },
      {
        codigo: 'IUE-TRIMESTRAL',
        descripcion: 'Declaración jurada trimestral IUE (Formulario 500)',
        obligatorio: true,
        frecuencia: 'trimestral',
        fechaLimite: proximoTrimestre.toISOString().slice(0, 10),
        sancion: 'Multa del 15% más intereses por mora',
        estado: 'pendiente'
      },
      {
        codigo: 'ESTADOS-FINANCIEROS',
        descripcion: 'Presentación de Estados Financieros anuales con prórroga',
        obligatorio: true,
        frecuencia: 'anual',
        fechaLimite: '2025-07-21',
        sancion: 'Multa progresiva según días de atraso',
        estado: 'pendiente'
      },
      {
        codigo: 'BANCARIZACION-2025',
        descripcion: 'Cumplimiento de requisitos de bancarización según RND-102400000021',
        obligatorio: true,
        frecuencia: 'mensual',
        sancion: 'Rechazo de gastos y costos no bancarizados',
        estado: 'pendiente'
      },
      {
        codigo: 'FACTURACION-ELECTRONICA',
        descripcion: 'Migración a facturación electrónica según cronograma SIN',
        obligatorio: true,
        frecuencia: 'eventual',
        sancion: 'Suspensión de actividades',
        estado: 'cumplido'
      },
      {
        codigo: 'ACTUALIZACION-PADRON',
        descripcion: 'Actualización anual de datos en padrón de contribuyentes',
        obligatorio: true,
        frecuencia: 'anual',
        fechaLimite: '2025-03-31',
        sancion: 'Multa fija y suspensión temporal',
        estado: 'pendiente'
      },
      {
        codigo: 'LIBROS-CONTABLES',
        descripcion: 'Presentación y legalización de libros contables obligatorios',
        obligatorio: true,
        frecuencia: 'anual',
        fechaLimite: '2025-03-31',
        sancion: 'Multa progresiva según días de atraso',
        estado: 'pendiente'
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

  // Obtener códigos de actividad económica CAEB-SIN 2025 actualizados
  getActividadesEconomicas(): Array<{ codigo: string; descripcion: string; sector: string }> {
    // Actualizado según RND 102500000018 - Vigente desde mayo 2025
    return [
      { codigo: '620100', descripcion: 'Programación informática y actividades relacionadas', sector: 'Servicios tecnológicos' },
      { codigo: '620200', descripcion: 'Consultoría informática y gestión de instalaciones', sector: 'Servicios tecnológicos' },
      { codigo: '631100', descripcion: 'Procesamiento de datos y hospedaje', sector: 'Servicios tecnológicos' },
      { codigo: '192000', descripcion: 'Fabricación de productos de refinación del petróleo', sector: 'Combustibles' },
      { codigo: '351100', descripcion: 'Generación de energía eléctrica', sector: 'Energía' },
      { codigo: '461000', descripcion: 'Venta al por mayor a comisión o por contrata', sector: 'Comercio' },
      { codigo: '471100', descripcion: 'Venta al por menor en comercios no especializados', sector: 'Comercio' },
      { codigo: '471900', descripcion: 'Venta al por menor de otros productos en comercios no especializados', sector: 'Comercio' },
      { codigo: '682000', descripcion: 'Actividades inmobiliarias por retribución o contrata', sector: 'Inmobiliario' },
      { codigo: '691100', descripcion: 'Actividades jurídicas', sector: 'Servicios profesionales' },
      { codigo: '692000', descripcion: 'Actividades de contabilidad, auditoría y consultoría fiscal', sector: 'Servicios profesionales' },
      { codigo: '702000', descripcion: 'Actividades de consultoría de gestión', sector: 'Servicios profesionales' },
      { codigo: '711000', descripcion: 'Actividades de arquitectura e ingeniería', sector: 'Servicios profesionales' },
      { codigo: '561010', descripcion: 'Actividades de restaurantes', sector: 'Alimentos y bebidas' },
      { codigo: '563000', descripcion: 'Actividades de servicio de bebidas', sector: 'Alimentos y bebidas' }
    ];
  }
}

export const normativaService = new NormativaService();
export default normativaService;