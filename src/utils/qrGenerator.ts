
interface QRData {
  nit: string;
  numeroFactura: string;
  numeroAutorizacion: string;
  fecha: string;
  monto: number;
  codigoControl: string;
}

export const generarQRContent = (data: QRData): string => {
  // Formato estándar para códigos QR de facturas bolivianas
  const qrContent = [
    data.nit,
    data.numeroFactura,
    data.numeroAutorizacion,
    data.fecha,
    data.monto.toFixed(2),
    data.codigoControl
  ].join('|');
  
  return qrContent;
};

export const generarURLQR = (content: string): string => {
  // Usar servicio gratuito de generación de QR
  const encodedContent = encodeURIComponent(content);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedContent}`;
};

export const validarQRBoliviano = (content: string): boolean => {
  const parts = content.split('|');
  return parts.length === 6 && parts.every(part => part.trim().length > 0);
};
