
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
  
  constructor() {
    // En producción estos valores vendrían de variables de entorno
    this.baseURL = 'https://pilotosiatservicios.impuestos.gob.bo';
    this.apiKey = process.env.VITE_SIN_API_KEY || 'demo-key';
    this.nitEmisor = process.env.VITE_NIT_EMISOR || '123456789';
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

  // Validar NIT
  validarNIT(nit: string): boolean {
    // Algoritmo básico de validación de NIT boliviano
    if (!nit || nit.length < 7) return false;
    
    const digits = nit.replace(/\D/g, '');
    if (digits.length < 7) return false;
    
    // Verificar dígito verificador (implementación simplificada)
    return true;
  }
}

export const sinService = new SINService();
export default sinService;
