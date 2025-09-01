import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BarChart, FileText, DollarSign, Users, Package, TrendingUp, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { EnhancedHeader, MetricGrid, EnhancedMetricCard, Section } from "./dashboard/EnhancedLayout";
import { useToast } from "@/hooks/use-toast";
import { Factura, Cliente, facturasIniciales, clientesIniciales, simularValidacionSIN } from "./billing/BillingData";
import { MovimientoInventario } from "./inventory/InventoryData";
import InvoiceForm from "./billing/InvoiceForm";
import InvoiceAccountingHistory from "./billing/InvoiceAccountingHistory";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { useSupabaseProductos } from "@/hooks/useSupabaseProductos";
import InvoiceSummary from "./billing/InvoiceSummary";
import InvoiceList from "./billing/InvoiceList";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvoicePreview from "./billing/InvoicePreview";
import DeclaracionIVA from "./DeclaracionIVA";

const FacturacionModule = () => {
  const [facturas, setFacturas] = useState<Factura[]>(facturasIniciales);
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [showAccountingHistory, setShowAccountingHistory] = useState(false);
  const [showDeclaracionIVA, setShowDeclaracionIVA] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const { toast } = useToast();
  const { productos } = useSupabaseProductos();
  const { 
    generarAsientoVenta, 
    generarAsientoInventario, 
    getAsientos,
    generarAsientoPagoFactura,
    generarAsientoAnulacionFactura,
    actualizarStockProducto
  } = useContabilidadIntegration();

  // Cargar datos desde localStorage
  useEffect(() => {
    const facturasGuardadas = localStorage.getItem('facturas');
    if (facturasGuardadas) {
      setFacturas(JSON.parse(facturasGuardadas));
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
    
    toast({
      title: "Procesando factura...",
      description: "Enviando al SIN para validación. Esto puede tardar unos segundos.",
    });

    try {
      const facturaValidada = await simularValidacionSIN(nuevaFactura);
      
      toast({
        title: "Respuesta del SIN recibida",
        description: "Procesando integración contable...",
      });

      if (facturaValidada.estadoSIN === 'aceptado') {
        // La factura fue aceptada, proceder con la contabilidad
        
        // 1. Procesar inventario según normativa boliviana
        for (const item of facturaValidada.items) {
          const producto = productos.find(p => p.id === item.productoId);
          if (producto && producto.costo_unitario > 0) {
            // CRÍTICO: Actualizar stock del producto en Supabase
            const stockActualizado = await actualizarStockProducto(item.productoId, item.cantidad, 'salida');
            
            if (!stockActualizado) {
              toast({
                title: "Error de Stock - Normativa Boliviana",
                description: `Stock insuficiente para ${item.descripcion}. No se puede procesar la factura.`,
                variant: "destructive"
              });
              return; // Detener el proceso si falla la actualización de stock
            }

            // Generar movimiento de inventario con motivo específico para contabilidad
            const movimientoInventario: MovimientoInventario = {
              id: `FAC-${facturaValidada.numero}-${item.productoId}`,
              fecha: facturaValidada.fecha,
              tipo: 'salida',
              productoId: item.productoId,
              producto: item.descripcion,
              cantidad: item.cantidad,
              costoUnitario: producto.costo_unitario,
              costoPromedioPonderado: producto.costo_unitario,
              motivo: 'Venta',
              documento: `Factura N° ${facturaValidada.numero}`,
              usuario: 'Sistema',
              stockAnterior: producto.stock_actual,
              stockNuevo: producto.stock_actual - item.cantidad,
              valorMovimiento: item.cantidad * producto.costo_unitario,
            };

            // Generar asiento contable del movimiento de inventario
            generarAsientoInventario(movimientoInventario);

            // Guardar el movimiento en el historial
            const movimientosExistentes = JSON.parse(localStorage.getItem('movimientosInventario') || '[]');
            const nuevosMovimientos = [movimientoInventario, ...movimientosExistentes];
            localStorage.setItem('movimientosInventario', JSON.stringify(nuevosMovimientos));
            
            console.log(`✅ Stock descontado: ${item.descripcion} - Cantidad: ${item.cantidad}`);
          }
        }

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
        productos={productos.map(p => ({
          id: p.id,
          codigo: p.codigo,
          nombre: p.nombre,
          descripcion: p.descripcion || '',
          categoria: p.categoria_id || 'General',
          unidadMedida: p.unidad_medida,
          precioVenta: p.precio_venta,
          precioCompra: p.precio_compra,
          costoUnitario: p.costo_unitario,
          stockActual: p.stock_actual,
          stockMinimo: p.stock_minimo,
          codigoSIN: p.codigo_sin || '00000000',
          activo: p.activo,
          fechaCreacion: p.created_at?.split('T')[0] || new Date().toISOString().slice(0, 10),
          fechaActualizacion: p.updated_at?.split('T')[0] || new Date().toISOString().slice(0, 10)
        }))}
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

  const facturasPagadas = facturas.filter(f => f.estado === 'pagada').length;
  const facturasEnviadas = facturas.filter(f => f.estado === 'enviada').length;
  const facturasRechazadas = facturas.filter(f => f.estadoSIN === 'rechazado').length;
  const ingresosMes = facturas.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.total, 0);
  const facturasHoy = facturas.filter(f => f.fecha === new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <EnhancedHeader
        title="Facturación Electrónica Integrada"
        subtitle="Sistema completo de facturación con integración SIN, control contable e inventario automático"
        badge={{
          text: `${facturas.length} Facturas Registradas`,
          variant: "default"
        }}
        actions={
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setShowAccountingHistory(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Historial Contable
            </Button>
            <Button variant="outline" onClick={() => setShowDeclaracionIVA(true)}>
              <BarChart className="w-4 h-4 mr-2" />
              Declaración IVA
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl"
              onClick={() => setShowNewInvoice(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Factura
            </Button>
          </div>
        }
      />

      {/* Enhanced Metrics Section */}
      <Section 
        title="Métricas de Facturación" 
        subtitle="Indicadores clave del rendimiento comercial y financiero"
      >
        <MetricGrid columns={4}>
          <EnhancedMetricCard
            title="Total Facturas"
            value={facturas.length}
            subtitle="Facturas registradas"
            icon={FileText}
            variant="default"
            trend="up"
            trendValue={`${facturasHoy} hoy`}
          />
          <EnhancedMetricCard
            title="Ingresos del Mes"
            value={`Bs. ${ingresosMes.toLocaleString()}`}
            subtitle="Facturas pagadas"
            icon={DollarSign}
            variant="success"
            trend="up"
            trendValue={`${facturasPagadas} pagadas`}
          />
          <EnhancedMetricCard
            title="Facturas Pendientes"
            value={facturasEnviadas}
            subtitle="Esperando pago"
            icon={AlertCircle}
            variant={facturasEnviadas > 0 ? "warning" : "success"}
            trend={facturasEnviadas > 0 ? "down" : "up"}
            trendValue="Por cobrar"
          />
          <EnhancedMetricCard
            title="Tasa de Éxito SIN"
            value={`${facturas.length > 0 ? (((facturas.length - facturasRechazadas) / facturas.length) * 100).toFixed(1) : 0}%`}
            subtitle={`${facturasRechazadas} rechazadas`}
            icon={CheckCircle}
            variant={facturasRechazadas === 0 ? "success" : "warning"}
            trend={facturasRechazadas === 0 ? "up" : "down"}
            trendValue="Integración SIN"
          />
        </MetricGrid>
      </Section>

      {/* Enhanced Invoice Summary */}
      <Section 
        title="Resumen Ejecutivo de Facturación"
        subtitle="Vista consolidada del estado actual de todas las facturas"
      >
        <InvoiceSummary facturas={facturas} />
      </Section>

      {/* Enhanced Invoice List */}
      <Section 
        title="Gestión de Facturas"
        subtitle="Lista completa con controles de estado y acciones rápidas"
      >
        <InvoiceList 
          facturas={facturas} 
          onShowDetails={handleShowDetails}
          onUpdateStatus={handleUpdateInvoiceStatus}
        />
      </Section>
      
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
