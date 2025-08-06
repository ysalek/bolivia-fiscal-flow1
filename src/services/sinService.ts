// Servicio para integración con el SIN (Servicio de Impuestos Nacionales)
export interface CUFDResponse {
  codigo: string;
  codigoControl: string;
  direccion: string;
  fechaVigencia: string;
}

export interface FacturaRequest {
  cabecera: {
    nitEmisor: string;
    razonSocialEmisor: string;
    municipio: string;
    telefono: string;
    numeroFactura: number;
    cuf: string;
    cufd: string;
    codigoSucursal: number;
    direccion: string;
    codigoPuntoVenta: number;
    fechaEmision: string;
    nombreRazonSocial: string;
    codigoTipoDocumentoIdentidad: number;
    numeroDocumento: string;
    complemento: string;
    codigoCliente: string;
    codigoMetodoPago: number;
    numeroTarjeta: string;
    montoTotal: number;
    montoTotalSujetoIva: number;
    codigoMoneda: number;
    tipoCambio: number;
    montoTotalMoneda: number;
    montoGiftCard: number;
    descuentoAdicional: number;
    codigoExcepcion: number;
    cafc: string;
    leyenda: string;
    usuario: string;
    codigoDocumentoSector: number;
  };
  detalle: Array<{
    actividadEconomica: string;
    codigoProductoSin: string;
    codigoProducto: string;
    descripcion: string;
    cantidad: number;
    unidadMedida: number;
    precioUnitario: number;
    montoDescuento: number;
    subTotal: number;
    numeroSerie: string;
    numeroImei: string;
  }>;
}

export interface FacturaResponse {
  codigoRecepcion: string;
  transaccion: boolean;
  codigoEstado: number;
  codigoDescripcion: string;
  mensajesList: Array<{
    codigo: number;
    descripcion: string;
  }>;
}

class SINService {
  private baseURL: string;
  private apiKey: string;
  private nitEmisor: string;
  private version: string;
  
  constructor() {
    // URLs actualizadas según normativa 2025 - SIAT v2.0
    this.baseURL = 'https://siatrest.impuestos.gob.bo/v2'; // API v2 actualizada
    this.apiKey = process.env.VITE_SIN_API_KEY || 'demo-key';
    this.nitEmisor = process.env.VITE_NIT_EMISOR || '123456789';
    this.version = '2.0.0'; // Versión actual del sistema de facturación
  }

  // Obtener CUFD (Código Único de Facturación Diaria)
  async obtenerCUFD(): Promise<CUFDResponse> {
    try {
      // Simulación para demo - en producción haría llamada real al API
      const response: CUFDResponse = {
        codigo: `CUFD${Date.now()}`,
        codigoControl: `CC${Math.random().toString(36).substr(2, 9)}`,
        direccion: 'https://piloto.facturacionelectronica.bo/',
        fechaVigencia: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      console.log('CUFD obtenido:', response);
      return response;
    } catch (error) {
      console.error('Error obteniendo CUFD:', error);
      throw new Error('No se pudo obtener el CUFD del SIN');
    }
  }

  // Verificar comunicación con SIN
  async verificarComunicacion(): Promise<boolean> {
    try {
      // Simulación para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Comunicación con SIN verificada');
      return true;
    } catch (error) {
      console.error('Error verificando comunicación:', error);
      return false;
    }
  }

  // Enviar factura al SIN
  async enviarFactura(factura: FacturaRequest): Promise<FacturaResponse> {
    try {
      console.log('Enviando factura al SIN:', factura);
      
      // Simulación para demo - en producción haría llamada real al API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response: FacturaResponse = {
        codigoRecepcion: `REC${Date.now()}`,
        transaccion: true,
        codigoEstado: 901, // Código de éxito
        codigoDescripcion: 'PROCESADA',
        mensajesList: [{
          codigo: 0,
          descripcion: 'Factura procesada correctamente'
        }]
      };
      
      console.log('Respuesta del SIN:', response);
      return response;
    } catch (error) {
      console.error('Error enviando factura:', error);
      throw new Error('No se pudo enviar la factura al SIN');
    }
  }

  // Consultar estado de factura
  async consultarEstado(codigoRecepcion: string): Promise<any> {
    try {
      console.log('Consultando estado de factura:', codigoRecepcion);
      
      // Simulación para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        codigoRecepcion,
        codigoEstado: 901,
        descripcion: 'PROCESADA',
        fechaProceso: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error consultando estado:', error);
      throw new Error('No se pudo consultar el estado de la factura');
    }
  }

  // Obtener eventos significativos
  async obtenerEventos(): Promise<any[]> {
    try {
      console.log('Obteniendo eventos del SIN');
      
      // Simulación para demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return [
        {
          fecha: new Date().toISOString(),
          tipo: 'CONEXION',
          descripcion: 'Conexión exitosa con SIN'
        },
        {
          fecha: new Date(Date.now() - 3600000).toISOString(),
          tipo: 'CUFD',
          descripcion: 'CUFD renovado automáticamente'
        }
      ];
    } catch (error) {
      console.error('Error obteniendo eventos:', error);
      return [];
    }
  }

  // Generar CUF (Código Único de Factura)
  generarCUF(numeroFactura: number, cufd: string): string {
    // Implementación simplificada del algoritmo CUF
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hora = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
    
    return `${this.nitEmisor}${fecha}${hora}${numeroFactura.toString().padStart(6, '0')}${cufd.slice(-8)}`;
  }

  // Validar NIT según normativa actualizada 2025
  validarNIT(nit: string): { valido: boolean; mensaje: string } {
    if (!nit) return { valido: false, mensaje: "NIT requerido" };
    
    const nitLimpio = nit.replace(/[-\s]/g, '');
    
    // Longitud válida según normativa actual (7-12 dígitos)
    if (nitLimpio.length < 7 || nitLimpio.length > 12) {
      return { valido: false, mensaje: "NIT debe tener entre 7 y 12 dígitos" };
    }
    
    if (!/^\d+$/.test(nitLimpio)) {
      return { valido: false, mensaje: "NIT debe contener solo números" };
    }
    
    // Algoritmo de validación de dígito verificador boliviano
    const digits = nitLimpio.split('').map(Number);
    const checkDigit = digits.pop();
    
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (digits.length + 1 - i);
    }
    
    const remainder = sum % 11;
    const calculatedCheckDigit = remainder < 2 ? remainder : 11 - remainder;
    
    if (checkDigit !== calculatedCheckDigit) {
      return { valido: false, mensaje: "Dígito verificador inválido" };
    }
    
    return { valido: true, mensaje: "NIT válido" };
  }

  // Nuevos métodos para sectores especiales según RND 2024-2025
  async validarSectorEspecial(codigoSector: number): Promise<boolean> {
    const sectoresValidos = [54, 55, 56]; // Biodiesel, combustible no subvencionado y energía eléctrica
    return sectoresValidos.includes(codigoSector);
  }

  // Método para obtener códigos de actividad económica actualizados 2025
  async obtenerActividadesEconomicas(): Promise<any[]> {
    return [
      { codigo: "620100", descripcion: "Programación informática", sector: "Servicios tecnológicos" },
      { codigo: "620200", descripcion: "Consultoría informática", sector: "Servicios tecnológicos" },
      { codigo: "192000", descripcion: "Fabricación de productos de refinación del petróleo", sector: "Combustibles" },
      { codigo: "351100", descripcion: "Generación de energía eléctrica", sector: "Energía" },
      { codigo: "461000", descripcion: "Venta al por mayor de maquinaria y equipo", sector: "Comercio" },
      { codigo: "471100", descripcion: "Venta al por menor en almacenes no especializados", sector: "Comercio" },
      { codigo: "682000", descripcion: "Alquiler de bienes inmuebles propios o arrendados", sector: "Inmobiliario" }
    ];
  }

  // Validar cumplimiento de facturación electrónica según grupo
  async validarGrupoFacturacionElectronica(nit: string): Promise<{
    obligatorio: boolean;
    grupo: string;
    fechaImplementacion: string;
    estado: 'implementado' | 'en_proceso' | 'pendiente';
  }> {
    // Simulación - en producción consultaría base de datos del SIN
    const grupos = {
      'octavo': { fechaImplementacion: '2024-01-01', obligatorio: true },
      'noveno': { fechaImplementacion: '2024-06-01', obligatorio: true },
      'decimo': { fechaImplementacion: '2024-12-01', obligatorio: true }
    };

    return {
      obligatorio: true,
      grupo: 'octavo',
      fechaImplementacion: '2024-01-01',
      estado: 'implementado'
    };
  }

  // Obtener tasas de impuestos actualizadas 2025
  async obtenerTasasImpuestos(): Promise<{
    iva: number;
    it: number;
    rcIva: number;
    ufv: number;
    fechaActualizacion: string;
  }> {
    return {
      iva: 13, // 13% IVA estándar
      it: 3, // 3% IT estándar
      rcIva: 13, // 13% RC-IVA
      ufv: 2.55, // UFV aproximado 2025
      fechaActualizacion: new Date().toISOString().slice(0, 10)
    };
  }
}

export const sinService = new SINService();
export default sinService;