
import { Factura } from "./BillingData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface InvoicePreviewProps {
  invoice: Factura;
}

const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  return (
    <Card className="border-none">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-primary">FACTURA</h1>
                <p className="text-muted-foreground">N°: {invoice.numero}</p>
            </div>
            <div className="text-right">
                <h2 className="text-lg font-semibold">Sistema Contable Inc.</h2>
                <p className="text-sm text-muted-foreground">Calle Falsa 123, Santa Cruz</p>
                <p className="text-sm text-muted-foreground">NIT: 123456789</p>
            </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h3 className="font-semibold">Facturar a:</h3>
                <p>{invoice.cliente.nombre}</p>
                <p>NIT/CI: {invoice.cliente.nit}</p>
                <p>{invoice.cliente.email}</p>
            </div>
            <div className="text-right">
                <p><span className="font-semibold">Fecha:</span> {new Date(invoice.fecha).toLocaleDateString()}</p>
                <p><span className="font-semibold">Vencimiento:</span> {new Date(invoice.fechaVencimiento).toLocaleDateString()}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">P. Unitario</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.codigo}</TableCell>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell className="text-right">{item.cantidad}</TableCell>
                <TableCell className="text-right">{item.precioUnitario.toFixed(2)}</TableCell>
                <TableCell className="text-right">{item.subtotal.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Separator className="my-4" />
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>Bs. {invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Descuento:</span>
              <span>- Bs. {invoice.descuentoTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA (13%):</span>
              <span>Bs. {invoice.iva.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>Bs. {invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {invoice.observaciones && (
            <div className="mt-6">
                <h4 className="font-semibold">Observaciones:</h4>
                <p className="text-sm text-muted-foreground">{invoice.observaciones}</p>
            </div>
        )}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground break-all"><span className="font-semibold">CUF:</span> {invoice.cuf}</p>
          <p className="text-xs text-muted-foreground break-all"><span className="font-semibold">CUFD:</span> {invoice.cufd}</p>
          <p className="text-xs text-muted-foreground"><span className="font-semibold">Código de Control:</span> {invoice.codigoControl}</p>
        </div>
        <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground font-semibold">"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS. EL USO ILÍCITO DE ÉSTA SERÁ SANCIONADO DE ACUERDO A LEY"</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreview;
