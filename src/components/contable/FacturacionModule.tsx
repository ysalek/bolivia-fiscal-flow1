import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart, FileText, DollarSign, Users, Package, TrendingUp, Activity, CheckCircle, AlertCircle, Shield, Gavel } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

const FacturacionModule = () => {
  const [facturas, setFacturas] = useState<Factura[]>(facturasIniciales);
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [showAccountingHistory, setShowAccountingHistory] = useState(false);
  const [showDeclaracionIVA, setShowDeclaracionIVA] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [normativasAlerts, setNormativasAlerts] = useState<any[]>([]);
  const [configuracionTributaria, setConfiguracionTributaria] = useState<any>(null);
  const [isInitializingProducts, setIsInitializingProducts] = useState(false);
  const [productsInitialized, setProductsInitialized] = useState(false);
  const { toast } = useToast();
  const { productos, crearProducto } = useSupabaseProductos();
  const { 
    generarAsientoVenta, 
    generarAsientoInventario, 
    getAsientos,
    generarAsientoPagoFactura,
    generarAsientoAnulacionFactura,
    actualizarStockProducto
  } = useContabilidadIntegration();

  // Cargar datos desde localStorage y verificar normativas
  useEffect(() => {
    const facturasGuardadas = localStorage.getItem('facturas');
    if (facturasGuardadas) {
      setFacturas(JSON.parse(facturasGuardadas));
    }

    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      setClientes(JSON.parse(clientesGuardados));
    }

    // Cargar configuración tributaria y normativas
    loadConfiguracionTributaria();
    loadNormativasAlerts();
  }, []);

  // CRÍTICO: Inicializar productos de ejemplo cuando sea necesario
  useEffect(() => {
    if (productos.length === 0 && crearProducto && !isInitializingProducts && !productsInitialized) {
      console.log('📦 No hay productos, inicializando ejemplos...');
      initializeExampleProducts();
    }
  }, [productos.length, crearProducto, isInitializingProducts, productsInitialized]);

  const loadConfiguracionTributaria = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracion_tributaria')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      setConfiguracionTributaria(data);
    } catch (error: any) {
      console.error('Error loading configuracion tributaria:', error);
    }
  };

  const loadNormativasAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('normativas_2025')
        .select('*')
        .eq('estado', 'vigente')
        .in('categoria', ['facturacion', 'iva'])
        .order('fecha_emision', { ascending: false })
        .limit(3);

      if (error) throw error;
      setNormativasAlerts(data || []);
    } catch (error: any) {
      console.error('Error loading normativas alerts:', error);
    }
  };

  // CRÍTICO: Inicializar productos de ejemplo si no hay productos en la base de datos
  const initializeExampleProducts = async () => {
    if (productos.length === 0 && crearProducto && !isInitializingProducts) {
      setIsInitializingProducts(true);
      
      try {
        console.log('📦 Inicializando productos de ejemplo...');
        
        // Verificar si ya existen productos con estos códigos
        const { data: existingProducts, error } = await supabase
          .from('productos')
          .select('codigo')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .in('codigo', ['PROD001', 'PROD002', 'SERV001']);

        if (error) {
          console.error('Error verificando productos existentes:', error);
          return;
        }

        const existingCodes = existingProducts?.map(p => p.codigo) || [];
        console.log('📋 Códigos existentes:', existingCodes);

        // Solo crear productos que no existan
        const productosEjemplo = [
          {
            codigo: 'PROD001',
            nombre: 'Laptop Dell Inspiron 15',
            descripcion: 'Laptop Dell Inspiron 15 con procesador Intel i5',
            categoria_id: null,
            unidad_medida: 'PZA',
            precio_venta: 4200,
            precio_compra: 3500,
            costo_unitario: 3500,
            stock_actual: 15,
            stock_minimo: 10,
            codigo_sin: '86173000',
            activo: true,
          },
          {
            codigo: 'PROD002',
            nombre: 'Mouse Inalámbrico',
            descripcion: 'Mouse inalámbrico óptico con sensor de alta precisión',
            categoria_id: null,
            unidad_medida: 'PZA',
            precio_venta: 65,
            precio_compra: 45,
            costo_unitario: 45,
            stock_actual: 25,
            stock_minimo: 10,
            codigo_sin: '84716070',
            activo: true,
          },
          {
            codigo: 'SERV001',
            nombre: 'Consultoría IT',
            descripcion: 'Servicios de consultoría en tecnologías de información',
            categoria_id: null,
            unidad_medida: 'HR',
            precio_venta: 150,
            precio_compra: 0,
            costo_unitario: 0,
            stock_actual: 0,
            stock_minimo: 0,
            codigo_sin: '83111100',
            activo: true,
          }
        ].filter(producto => !existingCodes.includes(producto.codigo));

        console.log(`📦 Creando ${productosEjemplo.length} productos nuevos...`);

        for (const producto of productosEjemplo) {
          try {
            await crearProducto(producto);
            console.log(`✅ Producto creado: ${producto.codigo}`);
          } catch (error: any) {
            console.error(`❌ Error creando producto ${producto.codigo}:`, error);
            // Si es error de duplicado, continúa con el siguiente
            if (error.code !== '23505') {
              throw error;
            }
          }
        }
        
        if (productosEjemplo.length > 0) {
          toast({
            title: "Productos inicializados",
            description: `Se han creado ${productosEjemplo.length} productos de ejemplo para comenzar.`,
          });
        }
        
        setProductsInitialized(true);
      } catch (error) {
        console.error('Error inicializando productos:', error);
        toast({
          title: "Error al inicializar productos",
          description: "No se pudieron crear algunos productos de ejemplo.",
          variant: "destructive"
        });
      } finally {
        setIsInitializingProducts(false);
      }
    }
  };

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
        
        // 1. Validar y procesar inventario según normativa boliviana
        console.log('📦 Procesando inventario para factura:', facturaValidada.numero);
        for (const item of facturaValidada.items) {
          const producto = productos.find(p => p.id === item.productoId);
          console.log(`🔍 Producto encontrado:`, { 
            id: producto?.id, 
            stock_actual: producto?.stock_actual, 
            cantidad_solicitada: item.cantidad 
          });
          
          if (producto && Number(producto.costo_unitario || 0) > 0) {
            // CRÍTICO: Verificar stock antes de procesar
            const stockDisponible = Number(producto.stock_actual || 0);
            console.log('🔍 Validando stock para', item.descripcion + ':', 'Stock disponible:', stockDisponible, 'Solicitado:', item.cantidad);
            
            if (stockDisponible < item.cantidad) {
              console.error('❌ Stock insuficiente:', { producto: item.descripcion, disponible: stockDisponible, solicitado: item.cantidad });
              toast({
                title: "Error de Stock - Normativa Boliviana",
                description: `Stock insuficiente para ${item.descripcion}. Disponible: ${stockDisponible}, Solicitado: ${item.cantidad}`,
                variant: "destructive"
              });
              return; // Detener el proceso si no hay stock suficiente
            }
            
            console.log('✅ Stock suficiente para', item.descripcion);
            
            // CRÍTICO: Actualizar stock del producto en Supabase
            console.log('🔄 Actualizando stock del producto:', item.descripcion);
            const stockActualizado = await actualizarStockProducto(item.productoId, item.cantidad, 'salida');
            
            if (!stockActualizado) {
              console.error('❌ Error actualizando stock para:', item.descripcion);
              toast({
                title: "Error de Stock - Normativa Boliviana",
                description: `No se pudo actualizar el stock para ${item.descripcion}. Factura cancelada.`,
                variant: "destructive"
              });
              return; // Detener el proceso si falla la actualización de stock
            }
            
            console.log('✅ Stock actualizado exitosamente para:', item.descripcion);

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
    // Verificar que hay productos disponibles antes de mostrar el formulario
    if (productos.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No hay productos disponibles</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Necesitas tener productos registrados en el sistema antes de crear facturas. 
                Por favor, dirígete al módulo de Productos para agregar productos.
              </p>
            </div>
            <Button onClick={() => setShowNewInvoice(false)} variant="outline">
              Volver a Facturación
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <InvoiceForm
        clientes={clientes}
        productos={productos.map(p => ({
          id: String(p.id),
          codigo: String(p.codigo || ''),
          nombre: String(p.nombre || ''),
          descripcion: String(p.descripcion || ''),
          categoria: String(p.categoria_id || 'General'),
          unidadMedida: String(p.unidad_medida || 'PZA'),
          precioVenta: Number(p.precio_venta || 0),
          precioCompra: Number(p.precio_compra || 0),
          costoUnitario: Number(p.costo_unitario || 0),
          stockActual: Number(p.stock_actual || 0),
          stockMinimo: Number(p.stock_minimo || 0),
          codigoSIN: String(p.codigo_sin || '00000000'),
          activo: Boolean(p.activo),
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
          <DialogContent className="max-w-4xl p-0" aria-describedby="invoice-preview-description">
            <div className="p-6">
              <div className="sr-only" id="invoice-preview-description">
                Vista previa de la factura seleccionada
              </div>
              <InvoicePreview invoice={selectedInvoice} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FacturacionModule;
