
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PackageCheck, Clock, Banknote, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Compra, Proveedor, comprasIniciales, proveedoresIniciales } from "./purchases/PurchasesData";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { Producto, productosIniciales } from "./products/ProductsData";
import CompraForm from "./purchases/CompraForm";
import PurchasesList from "./purchases/PurchasesList";
import ProveedoresList from "./purchases/ProveedoresList";

const ComprasModule = () => {
  const [compras, setCompras] = useState<Compra[]>(comprasIniciales);
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresIniciales);
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [showNewCompraForm, setShowNewCompraForm] = useState(false);
  const { toast } = useToast();
  const { generarAsientoCompra, actualizarStockProducto, generarAsientoPagoCompra } = useContabilidadIntegration();

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
      // 1. Generate ONE accounting entry for the entire purchase
      const asientoCompra = generarAsientoCompra({
        numero: nuevaCompra.numero,
        total: nuevaCompra.total,
        subtotal: nuevaCompra.subtotal,
        iva: nuevaCompra.iva
      });
      
      // If accounting fails, stop. A toast is shown inside the hook.
      if (!asientoCompra) {
        return;
      }

      // 2. Update stock for each item *after* successful accounting entry
      nuevaCompra.items.forEach(item => {
        actualizarStockProducto(item.productoId, item.cantidad, 'entrada');
      });
      
      // 3. Update purchases list and persist
      const nuevasCompras = [nuevaCompra, ...compras];
      setCompras(nuevasCompras);
      localStorage.setItem('compras', JSON.stringify(nuevasCompras));

      // 4. Show success message
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
    if (compra.estado !== 'recibida') {
      toast({
        title: "Acción no permitida",
        description: `La compra ya tiene estado "${compra.estado}". Solo se pueden procesar compras en estado "recibida".`,
        variant: "destructive",
      });
      return;
    }
    
    // Generate accounting entry for payment
    const asientoPago = generarAsientoPagoCompra(compra);
    
    // If payment entry failed, stop. Error toast is shown inside the hook.
    if (!asientoPago) {
      return;
    }
    
    // Update purchase status to 'pagada'
    const comprasActualizadas: Compra[] = compras.map(c => 
        c.id === compra.id ? { ...c, estado: 'pagada' } : c
    );
    setCompras(comprasActualizadas);
    localStorage.setItem('compras', JSON.stringify(comprasActualizadas));
    
    toast({
      title: "Compra Procesada y Pagada",
      description: `La compra ${compra.numero} ha sido marcada como "pagada" y se generó el asiento de pago.`,
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
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Compras</h2>
          <p className="text-muted-foreground">Control de compras y proveedores con integración contable.</p>
        </div>
        <Button onClick={() => setShowNewCompraForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Compra
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recibidas</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compras.filter(c => c.estado === 'recibida').length}</div>
            <p className="text-xs text-muted-foreground">Compras en stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compras.filter(c => c.estado === 'pendiente').length}</div>
            <p className="text-xs text-muted-foreground">Esperando recepción</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comprado</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {compras.reduce((sum, c) => sum + c.total, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Valor total de las compras</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proveedores.length}</div>
            <p className="text-xs text-muted-foreground">Proveedores activos</p>
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
