
import { Compra } from "./PurchasesData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PurchasesListProps {
  compras: Compra[];
  onProcessPurchase: (compra: Compra) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "recibida": return "bg-green-100 text-green-800";
    case "pendiente": return "bg-yellow-100 text-yellow-800";
    case "pagada": return "bg-blue-100 text-blue-800";
    case "anulada": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const PurchasesList = ({ compras, onProcessPurchase }: PurchasesListProps) => {
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Órdenes de Compra</CardTitle>
        <CardDescription>
          Historial de compras realizadas con integración contable automática
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compras.length > 0 ? (
              compras.map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell className="font-mono">{compra.numero}</TableCell>
                  <TableCell>{compra.proveedor.nombre}</TableCell>
                  <TableCell>{compra.fecha}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(compra.estado)}>
                      {compra.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">Bs. {compra.total.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        title="Ver detalles de la compra"
                        onClick={() => toast({ title: "Ver Compra", description: `Detalles de la compra ${compra.numero}: ${compra.items.length} items por Bs. ${compra.total.toFixed(2)}. Proveedor: ${compra.proveedor.nombre}` })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        title="Ver asiento contable generado"
                        onClick={() => toast({ title: "Asiento Contable", description: `Asiento generado para compra ${compra.numero}. Débito: Inventario Bs. ${compra.subtotal.toFixed(2)}, IVA Débito Fiscal Bs. ${compra.iva.toFixed(2)}. Crédito: Cuentas por Pagar Bs. ${compra.total.toFixed(2)}` })}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onProcessPurchase(compra)}
                        className="h-8 w-8 p-0"
                        title="Procesar pago de la compra"
                        disabled={compra.estado === 'pagada'}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron compras.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PurchasesList;
