
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Compra, Proveedor, comprasIniciales, proveedoresIniciales } from "./purchases/PurchasesData";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { Producto, productosIniciales } from "./products/ProductsData";
import { MovimientoInventario } from "./inventory/InventoryData";
import CompraForm from "./purchases/CompraForm";
import PurchasesList from "./purchases/PurchasesList";
import ProveedoresList from "./purchases/ProveedoresList";

const ComprasModule = () => {
  const [compras, setCompras] = useState<Compra[]>(comprasIniciales);
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresIniciales);
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [showNewCompraForm, setShowNewCompraForm] = useState(false);
  const { toast } = useToast();
  const { generarAsientoCompra, generarAsientoInventario } = useContabilidadIntegration();

  useEffect(() => {
    const comprasGuardadas = localStorage.getItem('compras');
    if (comprasGuardadas) setCompras(JSON.parse(comprasGuardadas));
    
    const proveedoresGuardados = localStorage.getItem('proveedores');
    if (proveedoresGuardados) setProveedores(JSON.parse(proveedoresGuardados));

    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) setProductos(JSON.parse(productosGuardados));
  }, []);

  const handleSaveCompra = (nuevaCompra: Compra) => {
    try {
      // 1. Process inventory and accounting for each item
      nuevaCompra.items.forEach(item => {
        const producto = productos.find(p => p.id === item.productoId);
        if (producto) {
          const movimiento: MovimientoInventario = {
            id: `${Date.now().toString()}-${item.productoId}`,
            fecha: nuevaCompra.fecha,
            tipo: 'entrada',
            productoId: item.productoId,
            producto: item.descripcion,
            cantidad: item.cantidad,
            costoUnitario: item.costoUnitario,
            costoPromedioPonderado: item.costoUnitario,
            motivo: 'Compra',
            documento: `Compra N° ${nuevaCompra.numero}`,
            usuario: 'Sistema',
            stockAnterior: producto.stockActual,
            stockNuevo: producto.stockActual + item.cantidad,
            valorMovimiento: item.cantidad * item.costoUnitario,
          };
          // This generates the inventory accounting entry and updates the stock
          generarAsientoInventario(movimiento);
        }
      });
      
      // 2. Generate purchase accounting entry (IVA, etc.)
      generarAsientoCompra({
        numero: nuevaCompra.numero,
        total: nuevaCompra.subtotal,
      });
      
      // 3. Update purchases list and persist
      const nuevasCompras = [nuevaCompra, ...compras];
      setCompras(nuevasCompras);
      localStorage.setItem('compras', JSON.stringify(nuevasCompras));

      toast({
        title: "Compra Creada Exitosamente",
        description: `Compra N° ${nuevaCompra.numero} registrada. Inventario actualizado.`,
      });

      setShowNewCompraForm(false);
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      toast({
        title: "Error al Procesar la Compra",
        description: "Ocurrió un error inesperado.",
        variant: "destructive",
      });
    }
  };

  const handleProcessPurchase = (compra: Compra) => {
    // Generar asiento contable automáticamente
    const asientoCompra = generarAsientoCompra({
      numero: compra.numero,
      total: compra.subtotal
    });
    
    console.log("Asiento de compra generado:", asientoCompra);
    
    toast({
      title: "Compra procesada",
      description: `Compra ${compra.numero} procesada y registrada contablemente.`,
    });
  };

  if (showNewCompraForm) {
    return (
      <CompraForm
        proveedores={proveedores}
        productos={productos}
        compras={compras}
        onSave={handleSaveCompra}
        onCancel={() => setShowNewCompraForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Compras</h2>
          <p className="text-slate-600">Control de compras y proveedores con integración contable</p>
        </div>
        <Button onClick={() => setShowNewCompraForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Compra
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {compras.filter(c => c.estado === 'recibida').length}
              </div>
              <div className="text-sm text-gray-600">Recibidas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {compras.filter(c => c.estado === 'pendiente').length}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Bs. {compras.reduce((sum, c) => sum + c.total, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Comprado</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{proveedores.length}</div>
              <div className="text-sm text-gray-600">Proveedores</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de compras */}
      <PurchasesList compras={compras} onProcessPurchase={handleProcessPurchase} />

      {/* Proveedores */}
      <ProveedoresList proveedores={proveedores} />
    </div>
  );
};

export default ComprasModule;
