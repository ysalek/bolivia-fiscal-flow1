
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factura } from "./BillingData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoiceListProps {
  facturas: Factura[];
  onShowDetails: (factura: Factura) => void;
  onUpdateStatus: (invoiceId: string, newStatus: 'pagada' | 'anulada') => void;
}

const getStatusClasses = (estado: Factura['estado']) => {
    switch (estado) {
        case 'pagada':
            return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
        case 'enviada':
            return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100';
        case 'anulada':
            return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
        case 'borrador':
            return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
        default:
            return '';
    }
};

const InvoiceList = ({ facturas, onShowDetails, onUpdateStatus }: InvoiceListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturas Emitidas</CardTitle>
        <CardDescription>
          Historial completo con actualización automática de inventario y contabilidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facturas.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No hay facturas emitidas.</TableCell>
                </TableRow>
            ) : facturas.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell className="font-medium">{factura.numero}</TableCell>
                <TableCell>{factura.cliente.nombre}</TableCell>
                <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">Bs. {factura.total.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Badge className={cn("capitalize border", getStatusClasses(factura.estado))}>
                    {factura.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onShowDetails(factura)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onUpdateStatus(factura.id, 'pagada')}
                        disabled={factura.estado !== 'enviada'}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Pagada
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onUpdateStatus(factura.id, 'anulada')}
                        disabled={factura.estado === 'anulada' || factura.estado === 'pagada'}
                        className="focus:bg-red-100 focus:text-red-600"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Anular Factura
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InvoiceList;
