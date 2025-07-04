
// Generador de códigos QR para facturas bolivianas según normativas SIAT

export interface QRData {
  nit: string;
  numeroFactura: string;
  numeroAutorizacion: string;
  fecha: string;
  monto: number;
  moneda: string;
  tipoDocumento: string;
}

export const generateBolivianQR = (data: QRData): string => {
  // Formato específico para QR de facturas bolivianas
  const qrString = [
    data.nit,                    // NIT del emisor
    data.numeroFactura,          // Número de factura
    data.numeroAutorizacion,     // Número de autorización
    data.fecha,                  // Fecha en formato YYYYMMDD
    data.monto.toFixed(2),       // Monto con 2 decimales
    data.moneda,                 // Código de moneda (BOL)
    data.tipoDocumento,          // Tipo de documento
    'https://pilotosiat.impuestos.gob.bo/', // URL base del SIAT
  ].join('|');

  return qrString;
};

export const generateQRCode = async (data: string): Promise<string> => {
  // En un entorno real, usarías una librería como qrcode
  // Por ahora simulamos la generación del QR
  try {
    // Simulación: en producción usarías:
    // import QRCode from 'qrcode';
    // return await QRCode.toDataURL(data);
    
    // Para desarrollo, retornamos un placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    if (ctx) {
      // Fondo blanco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 200, 200);
      
      // Borde negro
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 180, 180);
      
      // Texto simulando QR
      ctx.fillStyle = 'black';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('QR CODE', 100, 50);
      ctx.fillText('BOLIVIANO', 100, 70);
      
      // Algunos cuadrados simulando patrón QR
      const squares = [
        [20, 20, 30, 30], [160, 20, 30, 30], [20, 160, 30, 30],
        [80, 80, 10, 10], [110, 80, 10, 10], [80, 110, 10, 10],
        [60, 60, 15, 15], [125, 125, 15, 15], [40, 140, 20, 20]
      ];
      
      ctx.fillStyle = 'black';
      squares.forEach(([x, y, w, h]) => {
        ctx.fillRect(x, y, w, h);
      });
      
      // Data pequeña en la parte inferior
      ctx.font = '8px monospace';
      const shortData = data.length > 20 ? data.substring(0, 20) + '...' : data;
      ctx.fillText(shortData, 100, 180);
    }
    
    return canvas.toDataURL();
  } catch (error) {
    console.error('Error generando QR:', error);
    throw new Error('No se pudo generar el código QR');
  }
};

export const validateBolivianNIT = (nit: string): boolean => {
  // Validación básica de NIT boliviano
  if (!nit || nit.length < 7) return false;
  
  // Remover caracteres no numéricos
  const cleanNIT = nit.replace(/\D/g, '');
  
  // Debe tener entre 7 y 12 dígitos
  if (cleanNIT.length < 7 || cleanNIT.length > 12) return false;
  
  return true;
};

export const formatBolivianNIT = (nit: string): string => {
  const cleanNIT = nit.replace(/\D/g, '');
  
  if (cleanNIT.length <= 7) {
    return cleanNIT;
  }
  
  // Formato: XXXXXXX-X para NITs de 8 dígitos
  if (cleanNIT.length === 8) {
    return `${cleanNIT.slice(0, 7)}-${cleanNIT.slice(7)}`;
  }
  
  // Para NITs más largos, mantener formato original
  return cleanNIT;
};

export const generateAuthorizationNumber = (): string => {
  // Simula la generación de un número de autorización
  // En producción esto vendría del SIAT
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp}${random}`;
};
