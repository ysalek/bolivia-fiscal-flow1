
// Servicio para integración con SIN (Servicio de Impuestos Nacionales de Bolivia)

export interface SINCredentials {
  codigoSistema: string;
  codigoSucursal: string;
  nit: number;
  usuario: string;
  clave: string;
  apiKey: string;
}

export interface CUFDResponse {
  codigo: string;
  direccion: string;
  fechaVigencia: string;
  transaccion: boolean;
  mensajesList: string[];
}

export interface TokenResponse {
  token: string;
  fechaExpiracion: string;
}

export interface FacturaRequest {
  codigoDocumentoSector: number;
  codigoEmision: number;
  codigoModalidad: number;
  tipoFacturaDocumento: number;
  numeroFactura: number;
  cuf: string;
  cufd: string;
  nitEmisor: number;
  razonSocialEmisor: string;
  municipio: string;
  telefono: string;
  numeroDocumento: string;
  complemento?: string;
  codigoCliente: string;
  emailCliente: string;
  nombreRazonSocial: string;
  codigoTipoDocumentoIdentidad: number;
  numeroDocumentoIdentidad: string;
  fechaEmision: string;
  nombreUsuario: string;
  codigoDocumentoSector: number;
  detalle: FacturaDetalle[];
}

export interface FacturaDetalle {
  actividadEconomica: string;
  codigoProductoSin: number;
  codigoProducto: string;
  descripcion: string;
  cantidad: number;
  unidadMedida: number;
  precioUnitario: number;
  montoDescuento: number;
  subTotal: number;
}

export interface FacturaResponse {
  codigoRecepcion: string;
  transaccion: boolean;
  mensajesList: string[];
}

class SINService {
  private baseUrl = 'https://pilotosiat.impuestos.gob.bo/v2/FacturacionSincronizacion';
  private credentials: SINCredentials | null = null;
  private token: string | null = null;

  constructor() {
    // Las credenciales se cargarían desde variables de entorno o configuración
    this.loadCredentials();
  }

  private loadCredentials() {
    // En un entorno real, estas credenciales vendrían de variables de entorno
    // Por ahora las dejamos como ejemplo
    this.credentials = {
      codigoSistema: "775FA42C4D6D6C2",
      codigoSucursal: "0",
      nit: 4189179011,
      usuario: "PRUEBA",
      clave: "123456",
      apiKey: "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9"
    };
  }

  // Obtener token de autenticación
  async obtenerToken(): Promise<TokenResponse> {
    if (!this.credentials) {
      throw new Error('Credenciales SIN no configuradas');
    }

    try {
      console.log('Obteniendo token SIN...');
      
      // En modo de desarrollo, simulamos la respuesta
      if (process.env.NODE_ENV === 'development') {
        const token = 'mock_token_' + Date.now();
        this.token = token;
        return {
          token,
          fechaExpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
      }

      const response = await fetch(`${this.baseUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.credentials.apiKey
        },
        body: JSON.stringify({
          codigoSistema: this.credentials.codigoSistema,
          codigoSucursal: this.credentials.codigoSucursal,
          nit: this.credentials.nit,
          usuario: this.credentials.usuario,
          clave: this.credentials.clave
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      this.token = data.token;
      return data;
    } catch (error) {
      console.error('Error obteniendo token SIN:', error);
      throw new Error('No se pudo obtener el token del SIN');
    }
  }

  // Obtener CUFD (Código Único de Facturación Diario)
  async obtenerCUFD(): Promise<CUFDResponse> {
    if (!this.token) {
      await this.obtenerToken();
    }

    try {
      console.log('Obteniendo CUFD...');

      // En modo de desarrollo, simulamos la respuesta
      if (process.env.NODE_ENV === 'development') {
        return {
          codigo: 'BQS7QB29xhbos50tWMUBFAE2' + Date.now().toString().slice(-6),
          direccion: 'https://pilotosiat.impuestos.gob.bo/',
          fechaVigencia: new Date().toISOString(),
          transaccion: true,
          mensajesList: ['Codigo generado correctamente']
        };
      }

      const response = await fetch(`${this.baseUrl}/cufd`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'apikey': this.credentials!.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo CUFD:', error);
      throw new Error('No se pudo obtener el CUFD del SIN');
    }
  }

  // Enviar factura al SIN
  async enviarFactura(factura: FacturaRequest): Promise<FacturaResponse> {
    if (!this.token) {
      await this.obtenerToken();
    }

    try {
      console.log('Enviando factura al SIN...', factura);

      // En modo de desarrollo, simulamos la respuesta
      if (process.env.NODE_ENV === 'development') {
        // Simulamos un tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
          codigoRecepcion: 'CR' + Date.now().toString(),
          transaccion: Math.random() > 0.1, // 90% de éxito
          mensajesList: [
            Math.random() > 0.1 
              ? 'Factura recibida correctamente' 
              : 'Error en validación de datos'
          ]
        };
      }

      const response = await fetch(`${this.baseUrl}/recepcionFactura`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'apikey': this.credentials!.apiKey
        },
        body: JSON.stringify(factura)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error enviando factura al SIN:', error);
      throw new Error('No se pudo enviar la factura al SIN');
    }
  }

  // Anular factura
  async anularFactura(cuf: string, codigoMotivo: number): Promise<any> {
    if (!this.token) {
      await this.obtenerToken();
    }

    try {
      console.log('Anulando factura...', cuf);

      // En modo de desarrollo, simulamos la respuesta
      if (process.env.NODE_ENV === 'development') {
        return {
          transaccion: true,
          mensajesList: ['Factura anulada correctamente']
        };
      }

      const response = await fetch(`${this.baseUrl}/anulacionFactura`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'apikey': this.credentials!.apiKey
        },
        body: JSON.stringify({
          cuf,
          codigoMotivo
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error anulando factura:', error);
      throw new Error('No se pudo anular la factura en el SIN');
    }
  }

  // Consultar estado de factura
  async consultarFactura(cuf: string): Promise<any> {
    if (!this.token) {
      await this.obtenerToken();
    }

    try {
      console.log('Consultando estado de factura...', cuf);

      // En modo de desarrollo, simulamos la respuesta
      if (process.env.NODE_ENV === 'development') {
        const estados = ['VALIDADA', 'RECHAZADA', 'PENDIENTE'];
        return {
          codigoEstado: 908,
          estado: estados[Math.floor(Math.random() * estados.length)],
          fechaRecepcion: new Date().toISOString()
        };
      }

      const response = await fetch(`${this.baseUrl}/verificacionEstadoFactura`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'apikey': this.credentials!.apiKey
        },
        body: JSON.stringify({ cuf })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error consultando factura:', error);
      throw new Error('No se pudo consultar el estado de la factura');
    }
  }

  // Generar CUF (Código Único de Facturación)
  generarCUF(
    nit: number,
    fechaEmision: Date,
    numeroFactura: number,
    puntoVenta: number = 0,
    tipoDocumento: number = 1,
    tipoEmision: number = 1
  ): string {
    const fecha = fechaEmision.toISOString().slice(0, 10).replace(/-/g, '');
    const hora = fechaEmision.toTimeString().slice(0, 8).replace(/:/g, '');
    
    // Algoritmo simplificado para generar CUF
    // En implementación real se debe usar el algoritmo oficial del SIN
    const base = `${nit}${fecha}${hora}${numeroFactura.toString().padStart(10, '0')}${puntoVenta}${tipoDocumento}${tipoEmision}`;
    
    // Generar dígito verificador (simplificado)
    let suma = 0;
    for (let i = 0; i < base.length; i++) {
      suma += parseInt(base[i]) * (i + 1);
    }
    const digitoVerificador = suma % 11;
    
    return base + digitoVerificador.toString();
  }
}

// Instancia singleton del servicio SIN
export const sinService = new SINService();

// Funciones de utilidad para el frontend
export const formatearNIT = (nit: string): string => {
  // Remover caracteres no numéricos
  const numeros = nit.replace(/\D/g, '');
  
  // Formatear NIT boliviano (ej: 1234567890 -> 1.234.567.890)
  if (numeros.length <= 10) {
    return numeros.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
  
  return numeros;
};

export const validarNIT = (nit: string): boolean => {
  const numeros = nit.replace(/\D/g, '');
  return numeros.length >= 7 && numeros.length <= 12;
};

export const calcularIVA = (monto: number, porcentajeIVA: number = 13): number => {
  return (monto * porcentajeIVA) / 100;
};

export const calcularTotal = (subtotal: number, iva: number): number => {
  return subtotal + iva;
};
