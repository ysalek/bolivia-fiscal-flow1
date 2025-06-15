
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { ProductoInventario } from "./InventoryData";
import { getStockStatus, getStatusColor, getStatusText } from "./inventoryUtils";

interface ProductListTabProps {
  productos: ProductoInventario[];
  busqueda: string;
  setBusqueda: (value: string) => void;
  filtroCategoria: string;
  setFiltroCategoria: (value: string) => void;
}

const ProductListTab = ({
  productos,
  busqueda,
  setBusqueda,
  filtroCategoria,
  setFiltroCategoria,
}: ProductListTabProps) => {
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === "all" || producto.categoria === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventario de Productos - Promedio Ponderado</CardTitle>
        <CardDescription>
          Lista de productos con valuación por promedio ponderado e integración contable automática
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="Equipos">Equipos</SelectItem>
              <SelectItem value="Accesorios">Accesorios</SelectItem>
              <SelectItem value="Servicios">Servicios</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
  );
};

export default ProductListTab;
