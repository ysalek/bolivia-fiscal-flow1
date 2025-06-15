
import { Factura } from "./BillingData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Receipt, FileText } from "lucide-react";

interface InvoiceListItemProps {
  factura: Factura;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "aceptado": return "bg-green-100 text-green-800";
    case "pendiente": return "bg-yellow-100 text-yellow-800";
    case "rechazado": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getInvoiceStatusColor = (status: string) => {
  switch (status) {
    case "pagada": return "bg-green-100 text-green-800";
    case "enviada": return "bg-blue-100 text-blue-800";
    case "borrador": return "bg-gray-100 text-gray-800";
    case "anulada": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const InvoiceListItem = ({ factura }: InvoiceListItemProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono">
              {factura.numero}
            </Badge>
            <Badge className={getInvoiceStatusColor(factura.estado)}>
              {factura.estado}
            </Badge>
            <Badge className={getStatusColor(factura.estadoSIN)}>
              SIN: {factura.estadoSIN}
            </Badge>
          </div>
          <div className="font-medium text-lg">{factura.cliente.nombre}</div>
          <div className="text-sm text-gray-500">
            NIT: {factura.cliente.nit} • Fecha: {factura.fecha}
          </div>
          <div className="text-sm text-gray-500">
            CUF: {factura.cuf}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">Bs. {factura.total.toFixed(2)}</div>
          <div className="text-sm text-gray-500">
            Subtotal: Bs. {factura.subtotal.toFixed(2)} + IVA: Bs. {factura.iva.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded p-3 mb-3">
        <div className="text-sm font-medium mb-2">Items facturados:</div>
        <div className="space-y-1">
          {factura.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.descripcion} (x{item.cantidad})</span>
              <span>Bs. {item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Código Control: {factura.codigoControl}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Receipt className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <FileText className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceListItem;
