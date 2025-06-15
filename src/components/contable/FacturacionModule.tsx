import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Factura, Cliente, facturasIniciales, clientesIniciales, simularValidacionSIN } from "./billing/BillingData";
import { Producto, productosIniciales } from "./products/ProductsData";
import { MovimientoInventario } from "./inventory/InventoryData";
import InvoiceForm from "./billing/InvoiceForm";
import InvoiceAccountingHistory from "./billing/InvoiceAccountingHistory";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import InvoiceSummary from "./billing/InvoiceSummary";
import InvoiceList from "./billing/InvoiceList";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvoicePreview from "./billing/InvoicePreview";
import DeclaracionIVA from "./DeclaracionIVA";

const FacturacionModule = () => {
  const [facturas, setFacturas] = useState<Factura[]>(facturasIniciales);
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [showAccountingHistory, setShowAccountingHistory] = useState(false);
  const [showDeclaracionIVA, setShowDeclaracionIVA] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const { toast } = useToast();
  const { 
    generarAsientoVenta, 
    generarAsientoInventario, 
    getAsientos,
    generarAsientoPagoFactura,
    generarAsientoAnulacionFactura
  } = useContabilidadIntegration();

  // Cargar datos desde localStorage
  useEffect(() => {
    const facturasGuardadas = localStorage.getItem('facturas');
    if (facturasGuardadas) {
      setFacturas(JSON.parse(facturasGuardadas));
    }

    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    }

    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      setClientes(JSON.parse(clientesGuardados));
    }
  }, []);

  const handleAddNewClient = (nuevoCliente: Cliente) => {
    const nuevosClientes = [nuevoCliente, ...clientes];
    setClientes(nuevosClientes);
    localStorage.setItem('clientes', JSON.stringify(nuevosClientes));
    toast({
        title: "Cliente creado",
        description: `${nuevoCliente.nombre} ha sido agregado exitosamente.`,
    });
  };

  const handleSaveInvoice = async (nuevaFactura: Factura) => {
    setShowNewInvoice(false);
    
    const processingToast = toast({
      title: "Procesando factura...",
      description: "Enviando al SIN para validación. Esto puede tardar unos segundos.",
    });

    try {
      const facturaValidada = await simularValidacionSIN(nuevaFactura);
      
      processingToast.update({ id: processingToast.id, title: "Respuesta del SIN recibida" });

      if (facturaValidada.estadoSIN === 'aceptado') {
        // La factura fue aceptada, proceder con la contabilidad
        
        // 1. Procesar inventario y generar asiento de costo de ventas
        facturaValidada.items.forEach(item => {
          const producto = productos.find(p => p.id === item.productoId);
          if (producto && producto.costoUnitario > 0) {
            const movimientoInventario: MovimientoInventario = {
              id: `${Date.now().toString()}-${item.productoId}`,
              fecha: facturaValidada.fecha,
              tipo: 'salida',
              productoId: item.productoId,
              producto: item.descripcion,
              cantidad: item.cantidad,
              costoUnitario: producto.costoUnitario,
              costoPromedioPonderado: producto.costoUnitario,
              motivo: 'Venta',
              documento: `Factura N° ${facturaValidada.numero}`,
              usuario: 'Sistema',
              stockAnterior: producto.stockActual,
              stockNuevo: producto.stockActual - item.cantidad,
              valorMovimiento: item.cantidad * producto.costoUnitario,
            };

            generarAsientoInventario(movimientoInventario);

            const movimientosExistentes = JSON.parse(localStorage.getItem('movimientosInventario') || '[]');
            const nuevosMovimientos = [movimientoInventario, ...movimientosExistentes];
            localStorage.setItem('movimientosInventario', JSON.stringify(nuevosMovimientos));
          }
        });

        // 2. Generar asiento contable de venta
        generarAsientoVenta(facturaValidada);
        
        // 3. Actualizar la lista de facturas y persistir
        const nuevasFacturas = [facturaValidada, ...facturas];
        setFacturas(nuevasFacturas);
        localStorage.setItem('facturas', JSON.stringify(nuevasFacturas));
        
        toast({
          title: "Factura ACEPTADA por el SIN",
          description: `Factura N° ${facturaValidada.numero} generada y registrada contablemente.`,
          variant: "default",
        });

      } else {
        // La factura fue rechazada
        const nuevasFacturas = [facturaValidada, ...facturas];
        setFacturas(nuevasFacturas);
        localStorage.setItem('facturas', JSON.stringify(nuevasFacturas));

        toast({
          title: "Factura RECHAZADA por el SIN",
          description: `La factura N° ${facturaValidada.numero} fue rechazada. Revise las observaciones y corríjala.`,
          variant: "destructive",
          duration: 9000,
        });
      }
      
    } catch (error) {
      processingToast.update({ id: processingToast.id, title: "Error de Conexión" });
      console.error("Error al procesar la factura:", error);
      toast({
        title: "Error de Conexión",
        description: "No se pudo comunicar con el servicio de Impuestos Nacionales. Intente nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, newStatus: 'pagada' | 'anulada') => {
    const invoiceToUpdate = facturas.find(f => f.id === invoiceId);
    if (!invoiceToUpdate) return;

    let updatedInvoice: Factura;
    
    if (newStatus === 'pagada') {
      if (invoiceToUpdate.estado !== 'enviada') {
        toast({ title: "Acción no permitida", description: "Solo se pueden pagar facturas enviadas.", variant: "default" });
        return;
      }
      updatedInvoice = { ...invoiceToUpdate, estado: 'pagada' };
      generarAsientoPagoFactura(updatedInvoice);
      toast({ title: "Factura Pagada", description: `La factura N° ${updatedInvoice.numero} se marcó como pagada.` });
    } else if (newStatus === 'anulada') {
      if (invoiceToUpdate.estado === 'anulada' || invoiceToUpdate.estado === 'pagada') {
        toast({ title: "Acción no permitida", description: "No se puede anular una factura pagada o ya anulada.", variant: "destructive" });
        return;
      }
      updatedInvoice = { ...invoiceToUpdate, estado: 'anulada' };
      generarAsientoAnulacionFactura(updatedInvoice);
      toast({ title: "Factura Anulada", description: `La factura N° ${updatedInvoice.numero} ha sido anulada.` });
    } else {
      return;
    }

    const nuevasFacturas = facturas.map(f => f.id === invoiceId ? updatedInvoice : f);
    setFacturas(nuevasFacturas);
    localStorage.setItem('facturas', JSON.stringify(nuevasFacturas));
  };

  const handleShowDetails = (invoice: Factura) => {
    setSelectedInvoice(invoice);
    setIsDetailViewOpen(true);
  };

  if (showNewInvoice) {
    return (
      <InvoiceForm
        clientes={clientes}
        productos={productos}
        facturas={facturas}
        onSave={handleSaveInvoice}
        onCancel={() => setShowNewInvoice(false)}
        onAddNewClient={handleAddNewClient}
      />
    );
  }

  if (showAccountingHistory) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Historial Contable de Facturación</h2>
          <Button onClick={() => setShowAccountingHistory(false)}>
            Volver a Facturación
          </Button>
        </div>
        <InvoiceAccountingHistory 
          asientos={getAsientos()} 
        />
      </div>
    );
  }

  if (showDeclaracionIVA) {
    return <DeclaracionIVA onBack={() => setShowDeclaracionIVA(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Facturación Electrónica</h2>
          <p className="text-slate-600">Gestión de facturas con integración contable e inventario automática</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setShowAccountingHistory(true)}>
            Historial Contable
          </Button>
          <Button variant="outline" onClick={() => setShowDeclaracionIVA(true)}>
            <BarChart className="w-4 h-4 mr-2" />
            Declaración IVA
          </Button>
          <Button onClick={() => setShowNewInvoice(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <InvoiceSummary facturas={facturas} />

      {/* Lista de facturas */}
      <InvoiceList 
        facturas={facturas} 
        onShowDetails={handleShowDetails}
        onUpdateStatus={handleUpdateInvoiceStatus}
      />
      
      {selectedInvoice && (
        <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
          <DialogContent className="max-w-4xl p-0">
            <div className="p-6">
              <InvoicePreview invoice={selectedInvoice} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FacturacionModule;
