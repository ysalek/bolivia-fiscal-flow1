
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Print, Share2 } from "lucide-react";
import { Factura } from "./BillingData";
import { generateBolivianQR, generateQRCode, QRData } from "@/utils/qrGenerator";
import { useToast } from "@/hooks/use-toast";

interface EnhancedInvoicePreviewProps {
  invoice: Factura;
  showActions?: boolean;
}

const EnhancedInvoicePreview = ({ invoice, showActions = true }: EnhancedInvoicePreviewProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    generateInvoiceQR();
  }, [invoice]);

  const generateInvoiceQR = async () => {
    try {
      const qrData: QRData = {
        nit: "1234567890001", // NIT de la empresa
        numeroFactura: invoice.numero,
        numeroAutorizacion: invoice.numeroAutorizacion || "AUTO123456789",
        fecha: invoice.fecha.replace(/-/g, ''),
        monto: invoice.total,
        moneda: "BOL",
        tipoDocumento: "01"
      };

      const qrString = generateBolivianQR(qrData);
      const qrImage = await generateQRCode(qrString);
      setQrCodeUrl(qrImage);
    } catch (error) {
      console.error("Error generando QR:", error);
    }
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Impresión iniciada",
      description: "Se ha enviado la factura a la impresora.",
    });
  };

  const handleDownload = () => {
    // Simular descarga de PDF
    toast({
      title: "Descarga iniciada",
      description: "La factura PDF se está descargando...",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Factura ${invoice.numero}`,
          text: `Factura por Bs. ${invoice.total.toFixed(2)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copiar enlace
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Enlace copiado",
        description: "El enlace de la factura se ha copiado al portapapeles.",
      });
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'enviada':
        return <Badge className="bg-green-100 text-green-800">Enviada</Badge>;
      case 'pagada':
        return <Badge className="bg-blue-100 text-blue-800">Pagada</Badge>;
      case 'anulada':
        return <Badge variant="destructive">Anulada</Badge>;
      case 'rechazada':
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">Borrador</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Acciones */}
      {showActions && (
        <div className="flex justify-end gap-2 mb-4 print:hidden">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Print className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
        </div>
      )}

      {/* Factura */}
      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-8">
          {/* Encabezado */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">FACTURA</h1>
              <div className="text-sm text-muted-foreground space-y-1">
                <div><strong>N°:</strong> {invoice.numero}</div>
                <div><strong>Fecha:</strong> {new Date(invoice.fecha).toLocaleDateString('es-BO')}</div>
                <div><strong>NIT:</strong> 1234567890001</div>
                {invoice.numeroAutorizacion && (
                  <div><strong>Autorización:</strong> {invoice.numeroAutorizacion}</div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              {getStatusBadge(invoice.estado)}
              <div className="mt-4">
                <h2 className="text-xl font-bold">EMPRESA DEMO S.R.L.</h2>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Av. Principal #123</div>
                  <div>La Paz, Bolivia</div>
                  <div>Tel: +591 2 1234567</div>
                  <div>info@empresademo.bo</div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Información del Cliente */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Datos del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Cliente:</strong> {invoice.cliente.nombre}
              </div>
              {invoice.cliente.nit && (
                <div>
                  <strong>NIT/CI:</strong> {invoice.cliente.nit}
                </div>
              )}
              {invoice.cliente.email && (
                <div>
                  <strong>Email:</strong> {invoice.cliente.email}
                </div>
              )}
              {invoice.cliente.telefono && (
                <div>
                  <strong>Teléfono:</strong> {invoice.cliente.telefono}
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Detalle de Productos/Servicios</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Descripción</th>
                    <th className="text-center p-3 font-semibold">Cantidad</th>
                    <th className="text-right p-3 font-semibold">Precio Unit.</th>
                    <th className="text-right p-3 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">
                        <div className="font-medium">{item.descripcion}</div>
                        {item.detalles && (
                          <div className="text-sm text-muted-foreground">{item.detalles}</div>
                        )}
                      </td>
                      <td className="p-3 text-center">{item.cantidad.toFixed(2)}</td>
                      <td className="p-3 text-right">Bs. {item.precioUnitario.toFixed(2)}</td>
                      <td className="p-3 text-right font-medium">
                        Bs. {(item.cantidad * item.precioUnitario).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>Bs. {invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (13%):</span>
                <span>Bs. {invoice.iva.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>Bs. {invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* QR Code y Información Adicional */}
          <div className="flex justify-between items-end">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div><strong>Ley N° 453:</strong> El Cliente tiene derecho a exigir factura</div>
              <div><strong>Ley N° 2492:</strong> Para consultas o reclamos contacte con SIAT</div>
              {invoice.observaciones && (
                <div className="mt-4">
                  <strong>Observaciones:</strong> {invoice.observaciones}
                </div>
              )}
            </div>
            
            {qrCodeUrl && (
              <div className="text-center">
                <img src={qrCodeUrl} alt="Código QR" className="w-24 h-24 border" />
                <div className="text-xs text-muted-foreground mt-1">Código QR SIAT</div>
              </div>
            )}
          </div>

          {/* Pie de página */}
          <Separator className="my-6" />
          <div className="text-center text-xs text-muted-foreground">
            <div>Esta factura contribuye al desarrollo del país, al usar tus servicios digitales contribuyes a la economía</div>
            <div className="mt-2">
              <strong>Sistema Contable Boliviano</strong> - Facturación Electrónica Integrada
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedInvoicePreview;
