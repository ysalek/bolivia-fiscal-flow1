
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductoInventario {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  costoUnitario: number;
  costoPromedioPonderado: number; // Nuevo campo para promedio ponderado
  precioVenta: number;
  ubicacion: string;
  fechaUltimoMovimiento: string;
  valorTotalInventario: number; // Stock * Costo promedio ponderado
}

interface MovimientoInventario {
  id: string;
  fecha: string;
  tipo: 'entrada' | 'salida' | 'ajuste';
  productoId: string;
  producto: string;
  cantidad: number;
  costoUnitario: number;
  costoPromedioPonderado: number; // Costo promedio después del movimiento
  motivo: string;
  documento: string;
  usuario: string;
  stockAnterior: number;
  stockNuevo: number;
  valorMovimiento: number;
}

const InventarioModule = () => {
  const { toast } = useToast();
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Función para calcular promedio ponderado
  const calcularPromedioPonderado = (stockAnterior: number, costoAnterior: number, cantidadNueva: number, costoNuevo: number): number => {
    if (stockAnterior + cantidadNueva === 0) return 0;
    const valorAnterior = stockAnterior * costoAnterior;
    const valorNuevo = cantidadNueva * costoNuevo;
    return (valorAnterior + valorNuevo) / (stockAnterior + cantidadNueva);
  };

  const productos: ProductoInventario[] = [
    {
      id: "1",
      codigo: "PROD001",
      nombre: "Laptop Dell Inspiron 15",
      categoria: "Equipos",
      stockActual: 15,
      stockMinimo: 5,
      stockMaximo: 50,
      costoUnitario: 3500, // Último costo de compra
      costoPromedioPonderado: 3480, // Promedio ponderado calculado
      precioVenta: 4200,
      ubicacion: "Almacén A-1",
      fechaUltimoMovimiento: "2024-06-14",
      valorTotalInventario: 15 * 3480
    },
    {
      id: "2",
      codigo: "PROD002",
      nombre: "Mouse Inalámbrico",
      categoria: "Accesorios",
      stockActual: 3,
      stockMinimo: 10,
      stockMaximo: 100,
      costoUnitario: 45,
      costoPromedioPonderado: 47.5, // Promedio ponderado
      precioVenta: 65,
      ubicacion: "Almacén B-2",
      fechaUltimoMovimiento: "2024-06-13",
      valorTotalInventario: 3 * 47.5
    },
    {
      id: "3",
      codigo: "SERV001",
      nombre: "Consultoría IT",
      categoria: "Servicios",
      stockActual: 0,
      stockMinimo: 0,
      stockMaximo: 0,
      costoUnitario: 0,
      costoPromedioPonderado: 0,
      precioVenta: 150,
      ubicacion: "N/A",
      fechaUltimoMovimiento: "2024-06-15",
      valorTotalInventario: 0
    }
  ];

  const movimientos: MovimientoInventario[] = [
    {
      id: "1",
      fecha: "2024-06-15",
      tipo: "entrada",
      productoId: "1",
      producto: "Laptop Dell Inspiron 15",
      cantidad: 10,
      costoUnitario: 3500,
      costoPromedioPonderado: 3480,
      motivo: "Compra a proveedor",
      documento: "FC-001234",
      usuario: "Admin",
      stockAnterior: 5,
      stockNuevo: 15,
      valorMovimiento: 35000
    },
    {
      id: "2",
      fecha: "2024-06-14",
      tipo: "salida",
      productoId: "2",
      producto: "Mouse Inalámbrico",
      cantidad: 5,
      costoUnitario: 47.5, // Se usa el costo promedio ponderado para salidas
      costoPromedioPonderado: 47.5,
      motivo: "Venta",
      documento: "FV-000567",
      usuario: "Vendedor",
      stockAnterior: 8,
      stockNuevo: 3,
      valorMovimiento: 237.5
    },
    {
      id: "3",
      fecha: "2024-06-13",
      tipo: "ajuste",
      productoId: "1",
      producto: "Laptop Dell Inspiron 15",
      cantidad: -2,
      costoUnitario: 3480, // Ajuste al costo promedio
      costoPromedioPonderado: 3480,
      motivo: "Inventario físico - faltante",
      documento: "AJ-000012",
      usuario: "Contador",
      stockAnterior: 7,
      stockNuevo: 5,
      valorMovimiento: -6960
    }
  ];

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

  const simularMovimiento = (tipo: 'entrada' | 'salida') => {
    const tipoTexto = tipo === 'entrada' ? 'entrada' : 'salida';
    toast({
      title: `Registrar ${tipoTexto}`,
      description: `Funcionalidad de ${tipoTexto} de inventario con promedio ponderado`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Inventario - Promedio Ponderado</h2>
          <p className="text-slate-600">Control de stock con valuación por promedio ponderado</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => simularMovimiento('entrada')}>
            <Plus className="w-4 h-4 mr-2" />
            Entrada
          </Button>
          <Button variant="outline" onClick={() => simularMovimiento('salida')}>
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
                <p className="text-2xl font-bold">{movimientos.filter(m => m.fecha === "2024-06-15").length}</p>
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
          <TabsTrigger value="promedio">Cálculo Promedio</TabsTrigger>
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
                      <th className="text-center p-2">Acciones</th>
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
                          <td className="p-2 text-center">
                            <div className="flex gap-1 justify-center">
                              <Button size="sm" variant="outline">Ver</Button>
                              <Button size="sm" variant="outline">Editar</Button>
                            </div>
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
                    <Button size="sm">
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

        {/* Nueva pestaña: Cálculo Promedio */}
        <TabsContent value="promedio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Promedio Ponderado</CardTitle>
              <CardDescription>
                Visualiza cómo se calcula el promedio ponderado con cada movimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Fórmula del Promedio Ponderado</h3>
                  <p className="text-blue-700 text-sm">
                    Nuevo Promedio = (Valor Inventario Anterior + Valor Compra Nueva) / (Stock Anterior + Stock Nuevo)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ejemplo práctico */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Ejemplo: Laptop Dell Inspiron 15</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Stock inicial:</span>
                        <span>5 unidades</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Costo inicial:</span>
                        <span>Bs. 3,450 c/u</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor inicial:</span>
                        <span>Bs. 17,250</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between">
                        <span>Nueva compra:</span>
                        <span>10 unidades</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Costo compra:</span>
                        <span>Bs. 3,500 c/u</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor compra:</span>
                        <span>Bs. 35,000</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-blue-600">
                        <span>Nuevo promedio:</span>
                        <span>Bs. 3,480</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        (17,250 + 35,000) / (5 + 10) = 3,480
                      </div>
                    </div>
                  </div>

                  {/* Ventajas del método */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Ventajas del Promedio Ponderado</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Refleja el costo real del inventario</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Suaviza las fluctuaciones de precios</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Fácil de calcular y aplicar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Aceptado por normas contables</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventarioModule;
