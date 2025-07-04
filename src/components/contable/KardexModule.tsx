
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calculator, Download, TrendingUp, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Producto, productosIniciales } from "./products/ProductsData";
import { MovimientoInventario, movimientosIniciales } from "./inventory/InventoryData";

const KardexModule = () => {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>(movimientosIniciales);
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().slice(0, 10));
  const [metodoValoracion, setMetodoValoracion] = useState("promedio");
  const { toast } = useToast();

  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    }

    const movimientosGuardados = localStorage.getItem('movimientosInventario');
    if (movimientosGuardados) {
      setMovimientos(JSON.parse(movimientosGuardados));
    }
  }, []);

  const producto = productos.find(p => p.id === productoSeleccionado);
  const movimientosProducto = movimientos.filter(m => 
    m.productoId === productoSeleccionado &&
    m.fecha >= fechaInicio &&
    m.fecha <= fechaFin
  ).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const calcularKardex = () => {
    let saldoAcumulado = 0;
    let valorAcumulado = 0;
    let costoPromedio = 0;

    const kardex = movimientosProducto.map((mov, index) => {
      const cantidadMovimiento = mov.tipo === 'entrada' ? mov.cantidad : -mov.cantidad;
      const valorMovimiento = mov.tipo === 'entrada' ? mov.valorMovimiento : mov.cantidad * costoPromedio;

      if (mov.tipo === 'entrada') {
        saldoAcumulado += cantidadMovimiento;
        valorAcumulado += valorMovimiento;
        costoPromedio = saldoAcumulado > 0 ? valorAcumulado / saldoAcumulado : 0;
      } else {
        saldoAcumulado += cantidadMovimiento;
        valorAcumulado -= valorMovimiento;
      }

      return {
        ...mov,
        saldoAnterior: index === 0 ? (producto?.stockActual || 0) - saldoAcumulado : 0,
        saldoAcumulado: Math.max(0, saldoAcumulado),
        valorAcumulado: Math.max(0, valorAcumulado),
        costoPromedio: costoPromedio,
        valorMovimiento: valorMovimiento
      };
    });

    return kardex;
  };

  const kardex = calcularKardex();

  const exportarExcel = () => {
    toast({
      title: "Exportación iniciada",
      description: "El kardex se está exportando a Excel...",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Kardex por Producto
          </CardTitle>
          <CardDescription>
            Control detallado de movimientos y valoración de inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="producto">Producto</Label>
              <Select value={productoSeleccionado} onValueChange={setProductoSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {productos.map((producto) => (
                    <SelectItem key={producto.id} value={producto.id}>
                      {producto.nombre} ({producto.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="metodo">Método de Valoración</Label>
              <Select value={metodoValoracion} onValueChange={setMetodoValoracion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promedio">Promedio Ponderado</SelectItem>
                  <SelectItem value="fifo">FIFO</SelectItem>
                  <SelectItem value="lifo">LIFO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fecha-fin">Fecha Fin</Label>
              <Input
                id="fecha-fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Button onClick={exportarExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </div>

          {producto && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{producto.stockActual}</div>
                  <div className="text-sm text-muted-foreground">Stock Actual</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">Bs. {producto.costoUnitario.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Costo Unitario</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Calculator className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">
                    Bs. {(producto.stockActual * producto.costoUnitario).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Valor Total</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold">{movimientosProducto.length}</div>
                  <div className="text-sm text-muted-foreground">Movimientos</div>
                </CardContent>
              </Card>
            </div>
          )}

          {productoSeleccionado && (
            <Card>
              <CardHeader>
                <CardTitle>Kardex - {producto?.nombre}</CardTitle>
                <CardDescription>
                  Método: {metodoValoracion === 'promedio' ? 'Promedio Ponderado' : metodoValoracion.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead className="text-center">Entradas</TableHead>
                      <TableHead className="text-center">Salidas</TableHead>
                      <TableHead className="text-center">Saldo</TableHead>
                      <TableHead className="text-right">Costo Unit.</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kardex.map((mov, index) => (
                      <TableRow key={mov.id}>
                        <TableCell>{mov.fecha}</TableCell>
                        <TableCell>{mov.motivo}</TableCell>
                        <TableCell>{mov.documento || 'N/A'}</TableCell>
                        <TableCell className="text-center">
                          {mov.tipo === 'entrada' ? (
                            <Badge variant="outline" className="text-green-600">
                              +{mov.cantidad}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {mov.tipo === 'salida' ? (
                            <Badge variant="outline" className="text-red-600">
                              -{mov.cantidad}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {mov.saldoAcumulado}
                        </TableCell>
                        <TableCell className="text-right">
                          Bs. {mov.costoPromedio.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          Bs. {mov.valorAcumulado.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {kardex.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No hay movimientos en el período seleccionado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KardexModule;
