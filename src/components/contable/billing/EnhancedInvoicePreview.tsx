
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Factura } from './BillingData';
import { generarQRContent, generarURLQR } from '@/utils/qrGenerator';
import { Download, Printer, Share2 } from 'lucide-react';

interface EnhancedInvoicePreviewProps {
  invoice: Factura;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const EnhancedInvoicePreview = ({ invoice, onPrint, onDownload, onShare }: EnhancedInvoicePreviewProps) => {
  const qrContent = generarQRContent({
    nit: "123456789", // NIT de la empresa
    numeroFactura: invoice.numero,
    numeroAutorizacion: invoice.cuf,
    fecha: invoice.fecha,
    monto: invoice.total,
    codigoControl: invoice.codigoControl
  });
  
  const qrUrl = generarURLQR(qrContent);

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header con botones de acción */}
      <div className="flex justify-between items-center mb-6 p-4 bg-muted/30 rounded-lg print:hidden">
        <h2 className="text-xl font-bold">Vista Previa de Factura</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Factura */}
      <div className="p-8 bg-white border rounded-lg shadow-sm print:shadow-none">
        {/* Encabezado de la empresa */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">MI EMPRESA S.R.L.</h1>
          <p className="text-sm text-muted-foreground">
            Av. Ejemplo #123, La Paz - Bolivia<br />
            NIT: 123456789 | Tel: (2) 2345678<br />
            Email: contacto@miempresa.com
          </p>
        </div>

        {/* Información de la factura */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3 text-primary">DATOS DEL CLIENTE</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Razón Social:</strong> {invoice.cliente.nombre}</p>
              <p><strong>NIT/CI:</strong> {invoice.cliente.nit}</p>
              {invoice.cliente.direccion && (
                <p><strong>Dirección:</strong> {invoice.cliente.direccion}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-primary">DATOS DE LA FACTURA</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Número:</strong> {invoice.numero}</p>
              <p><strong>Fecha:</strong> {new Date(invoice.fecha).toLocaleDateString('es-BO')}</p>
              <p><strong>CUF:</strong> {invoice.cuf}</p>
              <p><strong>Código Control:</strong> {invoice.codigoControl}</p>
              <p><strong>Punto de Venta:</strong> {invoice.puntoVenta}</p>
            </div>
          </div>
        </div>

        {/* Items de la factura */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">#</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Código</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Descripción</th>
                <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">Cant.</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">P. Unit.</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Desc.</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{index + 1}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.codigo}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.descripcion}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm">{item.cantidad}</td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-sm">Bs. {item.precioUnitario.toFixed(2)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-sm">Bs. {item.descuento.toFixed(2)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-sm font-medium">Bs. {item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales y QR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Totales */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>Bs. {invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.descuentoTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span>Descuento Total:</span>
                <span>Bs. {invoice.descuentoTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>IVA (13%):</span>
              <span>Bs. {invoice.iva.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>TOTAL:</span>
              <span>Bs. {invoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Código QR */}
          <div className="text-center">
            <h4 className="font-semibold mb-3">Código QR</h4>
            <div className="inline-block p-4 border rounded-lg">
              <img 
                src={qrUrl} 
                alt="Código QR de la factura" 
                className="w-32 h-32 mx-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Escanee para verificar en impuestos.gob.bo
            </p>
          </div>
        </div>

        {/* Observaciones */}
        {invoice.observaciones && (
          <div className="mt-8">
            <h4 className="font-semibold mb-2">Observaciones:</h4>
            <p className="text-sm text-muted-foreground">{invoice.observaciones}</p>
          </div>
        )}

        {/* Footer legal */}
        <div className="mt-8 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            "Esta factura contribuye al desarrollo del país. El uso ilícito será sancionado penalmente de acuerdo a ley."
          </p>
          <div className="mt-2 flex justify-center items-center gap-4 text-xs">
            <Badge variant="outline">CUF: {invoice.cuf}</Badge>
            <Badge variant="outline">Estado: {invoice.estadoSIN}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedInvoicePreview;
