
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factura } from "./BillingData";
import InvoiceListItem from "./InvoiceListItem";

interface InvoiceListProps {
  facturas: Factura[];
}

const InvoiceList = ({ facturas }: InvoiceListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturas Emitidas</CardTitle>
        <CardDescription>
          Historial completo con actualización automática de inventario y contabilidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {facturas.map((factura) => (
            <InvoiceListItem key={factura.id} factura={factura} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceList;
