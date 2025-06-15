
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  const { generarAsientoCompra, actualizarStockProducto } = useContabilidadIntegration();

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
      // 1. Update stock for each item
      nuevaCompra.items.forEach(item => {
        actualizarStockProducto(item.productoId, item.cantidad, 'entrada');
      });
      
      // 2. Generate ONE accounting entry for the entire purchase
      generarAsientoCompra({
        numero: nuevaCompra.numero,
        total: nuevaCompra.total,
        subtotal: nuevaCompra.subtotal,
        iva: nuevaCompra.iva
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
    if (compra.estado !== 'recibida') {
      toast({
        title: "Acción no permitida",
        description: `La compra ya tiene estado "${compra.estado}". Solo se pueden procesar compras en estado "recibida".`,
        variant: "destructive",
      });
      return;
    }
    
    // Update purchase status to 'pagada'
    const comprasActualizadas: Compra[] = compras.map(c => 
        c.id === compra.id ? { ...c, estado: 'pagada' } : c
    );
    setCompras(comprasActualizadas);
    localStorage.setItem('compras', JSON.stringify(comprasActualizadas));
    
    toast({
      title: "Compra Procesada",
      description: `La compra ${compra.numero} ha sido marcada como "pagada".`,
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
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Compras</h2>
          <p className="text-slate-500">Control de compras y proveedores con integración contable</p>
        </div>
        <Button onClick={() => setShowNewCompraForm(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Nueva Compra
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Recibidas</p>
              <p className="text-2xl font-bold">{compras.filter(c => c.estado === 'recibida').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <PackageCheck className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pendientes</p>
              <p className="text-2xl font-bold">{compras.filter(c => c.estado === 'pendiente').length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Comprado</p>
              <p className="text-2xl font-bold">Bs. {compras.reduce((sum, c) => sum + c.total, 0).toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Banknote className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Proveedores</p>
              <p className="text-2xl font-bold">{proveedores.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Truck className="w-6 h-6 text-purple-600" />
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
