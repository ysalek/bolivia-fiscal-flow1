import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Receipt, Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Factura, Cliente, facturasIniciales, clientesIniciales } from "./billing/BillingData";
import { productosIniciales } from "./products/ProductsData";
import InvoiceForm from "./billing/InvoiceForm";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";

const FacturacionModule = () => {
  const [facturas, setFacturas] = useState<Factura[]>(facturasIniciales);
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [productos] = useState(productosIniciales);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const { toast } = useToast();
  const { generarAsientoVenta } = useContabilidadIntegration();

  const handleSaveInvoice = (nuevaFactura: Factura) => {
    setFacturas(prev => [nuevaFactura, ...prev]);
    
    // Generar asiento contable automáticamente
    const asientoVenta = generarAsientoVenta({
      numero: nuevaFactura.numero,
      total: nuevaFactura.subtotal
    });
    
    console.log("Asiento de venta generado:", asientoVenta);
    
    toast({
      title: "Factura creada exitosamente",
      description: `Factura N° ${nuevaFactura.numero} ha sido generada y registrada contablemente.`,
    });
    
    setShowNewInvoice(false);
  };

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

  if (showNewInvoice) {
    return (
      <InvoiceForm
        clientes={clientes}
        productos={productos}
        facturas={facturas}
        onSave={handleSaveInvoice}
        onCancel={() => setShowNewInvoice(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Facturación Electrónica</h2>
          <p className="text-slate-600">Gestión de facturas y documentos fiscales con integración contable</p>
        </div>
        <Button onClick={() => setShowNewInvoice(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {facturas.filter(f => f.estadoSIN === 'aceptado').length}
              </div>
              <div className="text-sm text-gray-600">Aceptadas SIN</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {facturas.filter(f => f.estadoSIN === 'pendiente').length}
              </div>
              <div className="text-sm text-gray-600">Pendientes SIN</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Bs. {facturas.reduce((sum, f) => sum + f.total, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Facturado</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{facturas.length}</div>
              <div className="text-sm text-gray-600">Total Facturas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de facturas */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas Emitidas</CardTitle>
          <CardDescription>
            Historial completo de facturas electrónicas con integración contable automática
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facturas.map((factura) => (
              <div key={factura.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
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
                
                {/* Items de la factura */}
                <div className="bg-gray-50 rounded p-3 mb-3">
                  <div className="text-sm font-medium mb-2">Items facturados:</div>
                  <div className="space-y-1">
                    {factura.items.map((item, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacturacionModule;
