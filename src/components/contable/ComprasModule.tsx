import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Compra, Proveedor, comprasIniciales, proveedoresIniciales } from "./purchases/PurchasesData";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { Producto, productosIniciales } from "./products/ProductsData";
import { MovimientoInventario } from "./inventory/InventoryData";
import CompraForm from "./purchases/CompraForm";

const ComprasModule = () => {
  const [compras, setCompras] = useState<Compra[]>(comprasIniciales);
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresIniciales);
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [showNewCompraForm, setShowNewCompraForm] = useState(false);
  const { toast } = useToast();
  const { generarAsientoCompra, generarAsientoInventario, actualizarStockProducto } = useContabilidadIntegration();

  useEffect(() => {
    const comprasGuardadas = localStorage.getItem('compras');
    if (comprasGuardadas) setCompras(JSON.parse(comprasGuardadas));
    
    const proveedoresGuardados = localStorage.getItem('proveedores');
    if (proveedoresGuardados) setProveedores(JSON.parse(proveedoresGuardados));

    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) setProductos(JSON.parse(productosGuardados));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recibida": return "bg-green-100 text-green-800";
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      case "pagada": return "bg-blue-100 text-blue-800";
      case "anulada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Compra</CardTitle>
          <CardDescription>
            Historial de compras realizadas con integración contable automática
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {compras.map((compra) => (
              <div key={compra.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        {compra.numero}
                      </Badge>
                      <Badge className={getStatusColor(compra.estado)}>
                        {compra.estado}
                      </Badge>
                    </div>
                    <div className="font-medium text-lg">{compra.proveedor.nombre}</div>
                    <div className="text-sm text-gray-500">
                      NIT: {compra.proveedor.nit} • Fecha: {compra.fecha}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">Bs. {compra.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">
                      Subtotal: Bs. {compra.subtotal.toFixed(2)} + IVA: Bs. {compra.iva.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Items de la compra */}
                <div className="bg-gray-50 rounded p-3 mb-3">
                  <div className="text-sm font-medium mb-2">Items comprados:</div>
                  <div className="space-y-1">
                    {compra.items.map((item, index) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.descripcion} (x{item.cantidad})</span>
                        <span>Bs. {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Vencimiento: {compra.fechaVencimiento}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleProcessPurchase(compra)}
                    >
                      <Package className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Proveedores Activos</CardTitle>
          <CardDescription>Base de datos de proveedores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proveedores.map((proveedor) => (
              <div key={proveedor.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium">{proveedor.nombre}</div>
                    <div className="text-sm text-gray-500">NIT: {proveedor.nit}</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{proveedor.email}</div>
                  <div>{proveedor.telefono}</div>
                  <div>{proveedor.direccion}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprasModule;
