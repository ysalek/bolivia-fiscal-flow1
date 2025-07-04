
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Download, Calculator } from 'lucide-react';
import { useProductos } from '@/hooks/useProductos';

interface MovimientoKardex {
  fecha: string;
  documento: string;
  detalle: string;
  entrada: {
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
  } | null;
  salida: {
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
  } | null;
  saldo: {
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
  };
}

const KardexModule = () => {
  const [selectedProducto, setSelectedProducto] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().slice(0, 10));
  const [metodoValoracion, setMetodoValoracion] = useState<'FIFO' | 'LIFO' | 'PROMEDIO'>('PROMEDIO');
  
  const { obtenerProductos } = useProductos();
  const productos = obtenerProductos();

  // Simulamos movimientos de kardex
  const generarKardex = (productoId: string): MovimientoKardex[] => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return [];

    // Datos simulados para demostración
    return [
      {
        fecha: '2024-01-01',
        documento: 'SALDO INICIAL',
        detalle: 'Inventario inicial',
        entrada: null,
        salida: null,
        saldo: { cantidad: 100, costoUnitario: 50.00, costoTotal: 5000.00 }
      },
      {
        fecha: '2024-01-15',
        documento: 'COMPRA-001',
        detalle: 'Compra a proveedor XYZ',
        entrada: { cantidad: 50, costoUnitario: 52.00, costoTotal: 2600.00 },
        salida: null,
        saldo: { cantidad: 150, costoUnitario: 50.67, costoTotal: 7600.00 }
      },
      {
        fecha: '2024-01-20',
        documento: 'VENTA-001',
        detalle: 'Venta factura 001',
        entrada: null,
        salida: { cantidad: 30, costoUnitario: 50.67, costoTotal: 1520.00 },
        saldo: { cantidad: 120, costoUnitario: 50.67, costoTotal: 6080.00 }
      },
      {
        fecha: '2024-02-05',
        documento: 'COMPRA-002',
        detalle: 'Compra a proveedor ABC',
        entrada: { cantidad: 75, costoUnitario: 55.00, costoTotal: 4125.00 },
        salida: null,
        saldo: { cantidad: 195, costoUnitario: 52.33, costoTotal: 10205.00 }
      }
    ];
  };

  const movimientos = selectedProducto ? generarKardex(selectedProducto) : [];
  const productoSeleccionado = productos.find(p => p.id === selectedProducto);

  const exportarKardex = () => {
    console.log('Exportando Kardex a Excel...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            Kardex por Producto
          </CardTitle>
          <CardDescription>
            Control detallado de movimientos y valoración de inventarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="producto">Producto</Label>
              <Select onValueChange={setSelectedProducto}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productos.map((producto) => (
                    <SelectItem key={producto.id} value={producto.id}>
                      {producto.codigo} - {producto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodo">Método de Valoración</Label>
              <Select value={metodoValoracion} onValueChange={(value: 'FIFO' | 'LIFO' | 'PROMEDIO') => setMetodoValoracion(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIFO">FIFO (Primero en Entrar, Primero en Salir)</SelectItem>
                  <SelectItem value="LIFO">LIFO (Último en Entrar, Primero en Salir)</SelectItem>
                  <SelectItem value="PROMEDIO">Promedio Ponderado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha-fin">Fecha Fin</Label>
              <Input
                id="fecha-fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          {productoSeleccionado && (
            <div className="mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Producto</div>
                      <div className="font-medium">{productoSeleccionado.nombre}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Código</div>
                      <div className="font-medium">{productoSeleccionado.codigo}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Stock Actual</div>
                      <Badge variant="outline" className="font-medium">
                        {productoSeleccionado.stockActual} {productoSeleccionado.unidadMedida}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Método</div>
                      <Badge variant="secondary">{metodoValoracion}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {movimientos.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Movimientos del Kardex</h3>
                <Button onClick={exportarKardex} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead rowSpan={2} className="text-center border-r">Fecha</TableHead>
                      <TableHead rowSpan={2} className="text-center border-r">Documento</TableHead>
                      <TableHead rowSpan={2} className="text-center border-r">Detalle</TableHead>
                      <TableHead colSpan={3} className="text-center border-r bg-success/10">ENTRADAS</TableHead>
                      <TableHead colSpan={3} className="text-center border-r bg-destructive/10">SALIDAS</TableHead>
                      <TableHead colSpan={3} className="text-center bg-primary/10">SALDOS</TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="text-center border-r">Cant.</TableHead>
                      <TableHead className="text-center border-r">C.U.</TableHead>
                      <TableHead className="text-center border-r">C.T.</TableHead>
                      <TableHead className="text-center border-r">Cant.</TableHead>
                      <TableHead className="text-center border-r">C.U.</TableHead>
                      <TableHead className="text-center border-r">C.T.</TableHead>
                      <TableHead className="text-center border-r">Cant.</TableHead>
                      <TableHead className="text-center border-r">C.U.</TableHead>
                      <TableHead className="text-center">C.T.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimientos.map((mov, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center border-r">{mov.fecha}</TableCell>
                        <TableCell className="text-center border-r">{mov.documento}</TableCell>
                        <TableCell className="border-r">{mov.detalle}</TableCell>
                        
                        {/* Entradas */}
                        <TableCell className="text-center border-r bg-success/5">
                          {mov.entrada?.cantidad || '-'}
                        </TableCell>
                        <TableCell className="text-center border-r bg-success/5">
                          {mov.entrada?.costoUnitario.toFixed(2) || '-'}
                        </TableCell>
                        <TableCell className="text-center border-r bg-success/5">
                          {mov.entrada?.costoTotal.toFixed(2) || '-'}
                        </TableCell>
                        
                        {/* Salidas */}
                        <TableCell className="text-center border-r bg-destructive/5">
                          {mov.salida?.cantidad || '-'}
                        </TableCell>
                        <TableCell className="text-center border-r bg-destructive/5">
                          {mov.salida?.costoUnitario.toFixed(2) || '-'}
                        </TableCell>
                        <TableCell className="text-center border-r bg-destructive/5">
                          {mov.salida?.costoTotal.toFixed(2) || '-'}
                        </TableCell>
                        
                        {/* Saldos */}
                        <TableCell className="text-center border-r bg-primary/5 font-medium">
                          {mov.saldo.cantidad}
                        </TableCell>
                        <TableCell className="text-center border-r bg-primary/5 font-medium">
                          {mov.saldo.costoUnitario.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center bg-primary/5 font-medium">
                          {mov.saldo.costoTotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Total Entradas:</strong> {movimientos.reduce((sum, mov) => sum + (mov.entrada?.cantidad || 0), 0)} unidades
                  </div>
                  <div>
                    <strong>Total Salidas:</strong> {movimientos.reduce((sum, mov) => sum + (mov.salida?.cantidad || 0), 0)} unidades
                  </div>
                  <div>
                    <strong>Saldo Final:</strong> {movimientos[movimientos.length - 1]?.saldo.cantidad || 0} unidades
                  </div>
                </div>
              </div>
            </>
          )}

          {!selectedProducto && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Seleccione un producto</h3>
              <p>Elija un producto para ver su kardex detallado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KardexModule;
