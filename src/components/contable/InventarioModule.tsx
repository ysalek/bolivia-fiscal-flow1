
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Plus,
  Minus,
  Search,
} from "lucide-react";
import { ProductoInventario, MovimientoInventario, productosIniciales, movimientosIniciales } from "./inventory/InventoryData";
import InventoryMovementDialog from "./inventory/InventoryMovementDialog";

const InventarioModule = () => {
  const [productos, setProductos] = useState<ProductoInventario[]>(productosIniciales);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>(movimientosIniciales);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [showMovementDialog, setShowMovementDialog] = useState<{ open: boolean; tipo: 'entrada' | 'salida' }>({
    open: false,
    tipo: 'entrada'
  });

  const handleMovimiento = (nuevoMovimiento: MovimientoInventario, productoActualizado: ProductoInventario) => {
    setMovimientos(prev => [nuevoMovimiento, ...prev]);
    setProductos(prev => prev.map(p => p.id === productoActualizado.id ? productoActualizado : p));
  };

  const getStockStatus = (producto: ProductoInventario) => {
    if (producto.categoria === "Servicios") return "service";
    if (producto.stockActual <= producto.stockMinimo) return "low";
    if (producto.stockActual >= producto.stockMaximo) return "high";
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low": return "bg-red-100 text-red-800";
      case "high": return "bg-yellow-100 text-yellow-800";
      case "service": return "bg-blue-100 text-blue-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "low": return "Stock Bajo";
      case "high": return "Stock Alto";
      case "service": return "Servicio";
      default: return "Normal";
    }
  };

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !filtroCategoria || producto.categoria === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  const productosConAlertas = productos.filter(p => getStockStatus(p) === "low").length;
  const valorTotalInventario = productos.reduce((total, p) => total + p.valorTotalInventario, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Inventario - Promedio Ponderado</h2>
          <p className="text-slate-600">Control de stock con valuación por promedio ponderado</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowMovementDialog({ open: true, tipo: 'entrada' })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Entrada
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowMovementDialog({ open: true, tipo: 'salida' })}
          >
            <Minus className="w-4 h-4 mr-2" />
            Salida
          </Button>
        </div>
      </div>

      {/* Métricas de inventario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Productos</p>
                <p className="text-2xl font-bold">{productos.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Valor Total (Prom. Pond.)</p>
                <p className="text-2xl font-bold">Bs. {valorTotalInventario.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Alertas de Stock</p>
                <p className="text-2xl font-bold text-red-600">{productosConAlertas}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Movimientos Hoy</p>
                <p className="text-2xl font-bold">{movimientos.filter(m => m.fecha === new Date().toISOString().slice(0, 10)).length}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="productos" className="w-full">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        {/* Lista de Productos */}
        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventario de Productos - Promedio Ponderado</CardTitle>
              <CardDescription>
                Lista de productos con valuación por promedio ponderado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar productos..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    <SelectItem value="Equipos">Equipos</SelectItem>
                    <SelectItem value="Accesorios">Accesorios</SelectItem>
                    <SelectItem value="Servicios">Servicios</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabla de productos */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Código</th>
                      <th className="text-left p-2">Producto</th>
                      <th className="text-left p-2">Categoría</th>
                      <th className="text-right p-2">Stock Actual</th>
                      <th className="text-right p-2">Costo Último</th>
                      <th className="text-right p-2">Costo Prom. Pond.</th>
                      <th className="text-right p-2">Valor Total</th>
                      <th className="text-center p-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((producto) => {
                      const status = getStockStatus(producto);
                      return (
                        <tr key={producto.id} className="border-b hover:bg-slate-50">
                          <td className="p-2 font-mono">{producto.codigo}</td>
                          <td className="p-2 font-medium">{producto.nombre}</td>
                          <td className="p-2">{producto.categoria}</td>
                          <td className="p-2 text-right">{producto.stockActual}</td>
                          <td className="p-2 text-right">Bs. {producto.costoUnitario.toFixed(2)}</td>
                          <td className="p-2 text-right font-semibold text-blue-600">
                            Bs. {producto.costoPromedioPonderado.toFixed(2)}
                          </td>
                          <td className="p-2 text-right font-semibold">
                            Bs. {producto.valorTotalInventario.toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <Badge className={getStatusColor(status)}>
                              {getStatusText(status)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Movimientos */}
        <TabsContent value="movimientos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Movimientos - Promedio Ponderado</CardTitle>
              <CardDescription>
                Registro de movimientos con cálculo de promedio ponderado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Fecha</th>
                      <th className="text-left p-2">Tipo</th>
                      <th className="text-left p-2">Producto</th>
                      <th className="text-right p-2">Cantidad</th>
                      <th className="text-right p-2">Costo Unit.</th>
                      <th className="text-right p-2">Costo Prom.</th>
                      <th className="text-right p-2">Stock Ant.</th>
                      <th className="text-right p-2">Stock Nuevo</th>
                      <th className="text-right p-2">Valor Mov.</th>
                      <th className="text-left p-2">Documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((movimiento) => (
                      <tr key={movimiento.id} className="border-b hover:bg-slate-50">
                        <td className="p-2">{movimiento.fecha}</td>
                        <td className="p-2">
                          <Badge 
                            className={
                              movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-800' :
                              movimiento.tipo === 'salida' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {movimiento.tipo.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-2 font-medium">{movimiento.producto}</td>
                        <td className="p-2 text-right">{movimiento.cantidad}</td>
                        <td className="p-2 text-right">Bs. {movimiento.costoUnitario.toFixed(2)}</td>
                        <td className="p-2 text-right font-semibold text-blue-600">
                          Bs. {movimiento.costoPromedioPonderado.toFixed(2)}
                        </td>
                        <td className="p-2 text-right">{movimiento.stockAnterior}</td>
                        <td className="p-2 text-right">{movimiento.stockNuevo}</td>
                        <td className="p-2 text-right">Bs. {movimiento.valorMovimiento.toFixed(2)}</td>
                        <td className="p-2 font-mono">{movimiento.documento}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alertas */}
        <TabsContent value="alertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Inventario</CardTitle>
              <CardDescription>
                Productos que requieren atención inmediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productos.filter(p => getStockStatus(p) === "low").map((producto) => (
                  <div key={producto.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-sm text-slate-600">
                          Stock actual: {producto.stockActual} | Mínimo: {producto.stockMinimo}
                        </p>
                        <p className="text-xs text-slate-500">
                          Costo promedio: Bs. {producto.costoPromedioPonderado.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => setShowMovementDialog({ open: true, tipo: 'entrada' })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Reabastecer
                    </Button>
                  </div>
                ))}
                
                {productos.filter(p => getStockStatus(p) === "low").length === 0 && (
                  <div className="text-center p-8 text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No hay alertas de inventario en este momento</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InventoryMovementDialog
        open={showMovementDialog.open}
        onOpenChange={(open) => setShowMovementDialog(prev => ({ ...prev, open }))}
        tipo={showMovementDialog.tipo}
        productos={productos}
        onMovimiento={handleMovimiento}
      />
    </div>
  );
};

export default InventarioModule;
