
/**
 * Servicio de integración con el SIN (Servicio de Impuestos Nacionales de Bolivia)
 * Implementa la conexión con los servicios web del SIN para facturación electrónica
 */

// Interfaces para los datos del SIN
export interface TokenDelegado {
  token: string;
  fechaVigencia: string;
}

export interface CUIS {
  codigo: string;
  fechaVigencia: string;
}

export interface CUFD {
  codigo: string;
  codigoControl: string;
  direccion: string;
  fechaVigencia: string;
}

export interface FacturaElectronica {
  codigoDocumentoSector: number;
  codigoEmision: number;
  codigoModalidad: number;
  codigoPuntoVenta: number;
  codigoSistema: string;
  codigoSucursal: number;
  cuis: string;
  cufd: string;
  nit: number;
  numeroFactura: number;
  fechaEmision: string;
  nombreRazonSocial: string;
  codigoTipoDocumentoIdentidad: number;
  numeroDocumento: string;
  complemento?: string;
  codigoCliente: string;
  emailCliente?: string;
  codigoMetodoPago: number;
  numeroTarjeta?: string;
  montoTotal: number;
  montoTotalSujetoIva: number;
  codigoMoneda: number;
  tipoCambio: number;
  montoTotalMoneda: number;
  leyenda: string;
  usuario: string;
  detalleFactura: DetalleFactura[];
}

export interface DetalleFactura {
  actividadEconomica: string;
  codigoProductoSin: string;
  codigoProducto: string;
  descripcion: string;
  cantidad: number;
  unidadMedida: number;
  precioUnitario: number;
  montoDescuento: number;
  subTotal: number;
  numeroSerie?: string;
  numeroImei?: string;
}

export interface RespuestaSIN {
  transaccion: boolean;
  codigoEstado: number;
  codigoDescripcion: string;
  codigoRecepcion?: number;
  mensajesList?: MensajeSIN[];
}

export interface MensajeSIN {
  codigo: number;
  descripcion: string;
}

// Configuración del SIN
const SIN_CONFIG = {
  urlBase: 'https://pilotosiatservicios.impuestos.gob.bo/',
  endpoints: {
    autenticacion: 'v2/FacturacionSincronizacion?wsdl',
    sincronizacion: 'v2/FacturacionSincronizacion?wsdl',
    recepcion: 'v2/ServicioFacturacionCompraVenta?wsdl'
  },
  codigoAmbiente: 2, // 1: Producción, 2: Pruebas
  codigoModalidad: 1, // 1: Electrónica en línea
  codigoPuntoVenta: 0,
  codigoSistema: 'SYS001', // Código asignado por el SIN
  codigoSucursal: 0,
  nit: 1234567890 // NIT de la empresa
};

class SINService {
  private tokenDelegado: TokenDelegado | null = null;
  private cuis: CUIS | null = null;
  private cufd: CUFD | null = null;

  /**
   * Obtiene el token delegado para autenticación
   */
  async obtenerTokenDelegado(): Promise<TokenDelegado> {
    try {
      // Simulación de la llamada al servicio web del SIN
      // En implementación real, aquí iría la llamada SOAP
      console.log('Obteniendo token delegado del SIN...');
      
      const response = await this.simularLlamadaSIN('token', {
        codigoAmbiente: SIN_CONFIG.codigoAmbiente,
        codigoModalidad: SIN_CONFIG.codigoModalidad,
        codigoPuntoVenta: SIN_CONFIG.codigoPuntoVenta,
        codigoSistema: SIN_CONFIG.codigoSistema,
        codigoSucursal: SIN_CONFIG.codigoSucursal,
        nit: SIN_CONFIG.nit
      });

      this.tokenDelegado = response;
      return response;
    } catch (error) {
      console.error('Error al obtener token delegado:', error);
      throw new Error('No se pudo obtener el token delegado del SIN');
    }
  }

  /**
   * Obtiene el CUIS (Código Único de Inicio de Sistema)
   */
  async obtenerCUIS(): Promise<CUIS> {
    try {
      if (!this.tokenDelegado) {
        await this.obtenerTokenDelegado();
      }

      console.log('Obteniendo CUIS del SIN...');
      
      const response = await this.simularLlamadaSIN('cuis', {
        codigoAmbiente: SIN_CONFIG.codigoAmbiente,
        codigoModalidad: SIN_CONFIG.codigoModalidad,
        codigoPuntoVenta: SIN_CONFIG.codigoPuntoVenta,
        codigoSistema: SIN_CONFIG.codigoSistema,
        codigoSucursal: SIN_CONFIG.codigoSucursal,
        nit: SIN_CONFIG.nit
      });

      this.cuis = response;
      return response;
    } catch (error) {
      console.error('Error al obtener CUIS:', error);
      throw new Error('No se pudo obtener el CUIS del SIN');
    }
  }

  /**
   * Obtiene el CUFD (Código Único de Facturación Diario)
   */
  async obtenerCUFD(): Promise<CUFD> {
    try {
      if (!this.cuis) {
        await this.obtenerCUIS();
      }

      console.log('Obteniendo CUFD del SIN...');
      
      const response = await this.simularLlamadaSIN('cufd', {
        codigoAmbiente: SIN_CONFIG.codigoAmbiente,
        codigoModalidad: SIN_CONFIG.codigoModalidad,
        codigoPuntoVenta: SIN_CONFIG.codigoPuntoVenta,
        codigoSistema: SIN_CONFIG.codigoSistema,
        codigoSucursal: SIN_CONFIG.codigoSucursal,
        cuis: this.cuis.codigo,
        nit: SIN_CONFIG.nit
      });

      this.cufd = response;
      return response;
    } catch (error) {
      console.error('Error al obtener CUFD:', error);
      throw new Error('No se pudo obtener el CUFD del SIN');
    }
  }

  /**
   * Envía una factura electrónica al SIN
   */
  async enviarFactura(factura: FacturaElectronica): Promise<RespuestaSIN> {
    try {
      if (!this.cufd) {
        await this.obtenerCUFD();
      }

      console.log('Enviando factura al SIN...', factura);

      // Generar CUF (Código Único de Facturación)
      const cuf = this.generarCUF(factura);
      console.log('CUF generado:', cuf);

      // Preparar la factura con CUFD y CUF
      const facturaCompleta = {
        ...factura,
        cufd: this.cufd!.codigo,
        cuf: cuf
      };

      const response = await this.simularLlamadaSIN('enviarFactura', facturaCompleta);

      if (response.transaccion) {
        console.log('Factura enviada exitosamente. Código de recepción:', response.codigoRecepcion);
      } else {
        console.error('Error al enviar factura:', response.codigoDescripcion);
      }

      return response;
    } catch (error) {
      console.error('Error al enviar factura:', error);
      throw new Error('No se pudo enviar la factura al SIN');
    }
  }

  /**
   * Consulta el estado de una factura en el SIN
   */
  async consultarEstadoFactura(codigoRecepcion: number): Promise<RespuestaSIN> {
    try {
      console.log('Consultando estado de factura:', codigoRecepcion);
      
      const response = await this.simularLlamadaSIN('consultarEstado', {
        codigoRecepcion,
        codigoAmbiente: SIN_CONFIG.codigoAmbiente,
        codigoSistema: SIN_CONFIG.codigoSistema
      });

      return response;
    } catch (error) {
      console.error('Error al consultar estado de factura:', error);
      throw new Error('No se pudo consultar el estado de la factura');
    }
  }

  /**
   * Anula una factura previamente emitida
   */
  async anularFactura(codigoRecepcion: number, motivoAnulacion: string): Promise<RespuestaSIN> {
    try {
      console.log('Anulando factura:', codigoRecepcion, 'Motivo:', motivoAnulacion);
      
      const response = await this.simularLlamadaSIN('anularFactura', {
        codigoRecepcion,
        motivoAnulacion,
        codigoAmbiente: SIN_CONFIG.codigoAmbiente,
        codigoSistema: SIN_CONFIG.codigoSistema
      });

      return response;
    } catch (error) {
      console.error('Error al anular factura:', error);
      throw new Error('No se pudo anular la factura');
    }
  }

  /**
   * Genera el CUF (Código Único de Facturación)
   * Basado en el algoritmo especificado por el SIN
   */
  private generarCUF(factura: FacturaElectronica): string {
    // Implementación simplificada del algoritmo CUF
    // En implementación real debe seguir el algoritmo oficial del SIN
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hora = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
    const nit = SIN_CONFIG.nit.toString().padStart(13, '0');
    const numero = factura.numeroFactura.toString().padStart(10, '0');
    
    const base = `${nit}${fecha}${hora}${numero}${factura.codigoDocumentoSector}`;
    
    // Simulación de hash (en implementación real usar SHA-256 + Base16)
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      const char = base.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16).toUpperCase().padStart(16, '0');
  }

  /**
   * Simulación de llamadas al SIN para desarrollo
   * En implementación real, reemplazar con llamadas SOAP reales
   */
  private async simularLlamadaSIN(operacion: string, datos: any): Promise<any> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    console.log(`Simulando llamada SIN - ${operacion}:`, datos);

    switch (operacion) {
      case 'token':
        return {
          token: 'TOKEN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          fechaVigencia: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };

      case 'cuis':
        return {
          codigo: 'CUIS_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          fechaVigencia: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        };

      case 'cufd':
        return {
          codigo: 'CUFD_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          codigoControl: Math.random().toString(36).substr(2, 6).toUpperCase(),
          direccion: 'https://pilotosiat.impuestos.gob.bo/',
          fechaVigencia: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };

      case 'enviarFactura':
        // Simular respuesta exitosa en 90% de los casos
        const exitoso = Math.random() > 0.1;
        return {
          transaccion: exitoso,
          codigoEstado: exitoso ? 901 : 902,
          codigoDescripcion: exitoso ? 'VALIDADA' : 'OBSERVADA',
          codigoRecepcion: exitoso ? Math.floor(Math.random() * 1000000) : undefined,
          mensajesList: exitoso ? [] : [
            {
              codigo: 1001,
              descripcion: 'Error de validación en datos del cliente'
            }
          ]
        };

      case 'consultarEstado':
        return {
          transaccion: true,
          codigoEstado: 901,
          codigoDescripcion: 'VALIDADA',
          mensajesList: []
        };

      case 'anularFactura':
        return {
          transaccion: true,
          codigoEstado: 905,
          codigoDescripcion: 'ANULADA',
          mensajesList: []
        };

      default:
        throw new Error(`Operación no soportada: ${operacion}`);
    }
  }

  /**
   * Inicializa el servicio obteniendo tokens necesarios
   */
  async inicializar(): Promise<boolean> {
    try {
      console.log('Inicializando servicio SIN...');
      await this.obtenerTokenDelegado();
      await this.obtenerCUIS();
      await this.obtenerCUFD();
      console.log('Servicio SIN inicializado correctamente');
      return true;
    } catch (error) {
      console.error('Error al inicializar servicio SIN:', error);
      return false;
    }
  }

  /**
   * Obtiene el estado actual del servicio
   */
  getEstadoServicio() {
    return {
      tokenDelegado: this.tokenDelegado,
      cuis: this.cuis,
      cufd: this.cufd,
      configuracion: SIN_CONFIG
    };
  }
}

// Exportar instancia singleton
export const sinService = new SINService();

// Exportar clase para casos de uso específicos
export { SINService };
