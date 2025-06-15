
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Calculator } from "lucide-react";
import { AsientoContable } from "../diary/DiaryData";

interface InvoiceAccountingHistoryProps {
  asientos: AsientoContable[];
  facturaNumero?: string;
}

const InvoiceAccountingHistory = ({ asientos, facturaNumero }: InvoiceAccountingHistoryProps) => {
  const asientosFiltrados = facturaNumero 
    ? asientos.filter(a => a.referencia === facturaNumero)
    : asientos.filter(a => a.referencia?.startsWith('FAC-') || a.concepto.includes('factura'));

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'registrado': 'bg-green-100 text-green-800',
      'anulado': 'bg-red-100 text-red-800'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          <div>
            <CardTitle>Historial Contable</CardTitle>
            <CardDescription>
              Asientos contables generados automáticamente por facturación
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {asientosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay asientos contables registrados</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Debe</TableHead>
                <TableHead>Haber</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asientosFiltrados.map(asiento => (
                <TableRow key={asiento.id}>
                  <TableCell className="font-medium">{asiento.numero}</TableCell>
                  <TableCell>{asiento.fecha}</TableCell>
                  <TableCell>{asiento.concepto}</TableCell>
                  <TableCell>{asiento.referencia}</TableCell>
                  <TableCell>Bs. {asiento.debe.toFixed(2)}</TableCell>
                  <TableCell>Bs. {asiento.haber.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadge(asiento.estado)}>
                      {asiento.estado.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceAccountingHistory;
