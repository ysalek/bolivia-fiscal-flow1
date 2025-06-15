import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Factura, Cliente, facturasIniciales, clientesIniciales } from "./billing/BillingData";
import { Producto, productosIniciales } from "./products/ProductsData";
import { MovimientoInventario } from "./inventory/InventoryData";
import InvoiceForm from "./billing/InvoiceForm";
import InvoiceAccountingHistory from "./billing/InvoiceAccountingHistory";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import InvoiceSummary from "./billing/InvoiceSummary";
import InvoiceList from "./billing/InvoiceList";

const FacturacionModule = () => {
  const [facturas, setFacturas] = useState<Factura[]>(facturasIniciales);
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [showAccountingHistory, setShowAccountingHistory] = useState(false);
  const { toast } = useToast();
  const { generarAsientoVenta, generarAsientoInventario, getAsientos } = useContabilidadIntegration();

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

  const handleSaveInvoice = (nuevaFactura: Factura) => {
    try {
      // 1. Procesar inventario y generar asiento de costo de ventas
      nuevaFactura.items.forEach(item => {
        const producto = productos.find(p => p.id === item.productoId);
        if (producto && producto.costoUnitario > 0) {
          const movimientoInventario: MovimientoInventario = {
            id: `${Date.now().toString()}-${item.productoId}`,
            fecha: nuevaFactura.fecha,
            tipo: 'salida',
            productoId: item.productoId,
            producto: item.descripcion,
            cantidad: item.cantidad,
            costoUnitario: producto.costoUnitario,
            costoPromedioPonderado: producto.costoUnitario, // Placeholder, usar costo unitario por ahora
            motivo: 'Venta',
            documento: `Factura N° ${nuevaFactura.numero}`,
            usuario: 'Sistema',
            stockAnterior: producto.stockActual,
            stockNuevo: producto.stockActual - item.cantidad,
            valorMovimiento: item.cantidad * producto.costoUnitario,
          };

          // Genera el asiento contable de costo y actualiza el stock del producto
          generarAsientoInventario(movimientoInventario);

          // Guarda el movimiento en localStorage para el historial de inventario
          const movimientosExistentes = JSON.parse(localStorage.getItem('movimientosInventario') || '[]');
          const nuevosMovimientos = [movimientoInventario, ...movimientosExistentes];
          localStorage.setItem('movimientosInventario', JSON.stringify(nuevosMovimientos));
        }
      });

      // 2. Generar asiento contable de venta
      generarAsientoVenta(nuevaFactura);
      
      // 3. Actualizar la lista de facturas y persistir
      const nuevasFacturas = [nuevaFactura, ...facturas];
      setFacturas(nuevasFacturas);
      localStorage.setItem('facturas', JSON.stringify(nuevasFacturas));
      
      toast({
        title: "Factura creada exitosamente",
        description: `Factura N° ${nuevaFactura.numero} generada y registrada contablemente. Inventario actualizado.`,
      });
      
      setShowNewInvoice(false);
    } catch (error) {
      console.error("Error al guardar y procesar la factura:", error);
      toast({
        title: "Error al procesar la factura",
        description: "Ocurrió un error inesperado durante la integración contable.",
        variant: "destructive"
      });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Facturación Electrónica</h2>
          <p className="text-slate-600">Gestión de facturas con integración contable e inventario automática</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAccountingHistory(true)}>
            Ver Historial Contable
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
      <InvoiceList facturas={facturas} />
    </div>
  );
};

export default FacturacionModule;
