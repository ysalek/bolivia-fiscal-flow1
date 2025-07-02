
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Clock, TrendingDown, Calculator, AlertCircle } from "lucide-react";
import { Producto } from "../products/ProductsData";
import { Compra } from "../purchases/PurchasesData";

interface ProductAnalysis {
  producto: Producto;
  ultimaCompra: {
    fecha: string;
    precioCompra: number;
    cantidad: number;
  } | null;
  diasEnDeposito: number;
  margenUtilidad: number;
  posibleDescuento: number;
  rotacion: 'Alta' | 'Media' | 'Baja';
  recomendacion: string;
}

const InventoryAnalysis = () => {
  const [analisisProductos, setAnalisisProductos] = useState<ProductAnalysis[]>([]);

  useEffect(() => {
    const productos: Producto[] = JSON.parse(localStorage.getItem('productos') || '[]');
    const compras: Compra[] = JSON.parse(localStorage.getItem('compras') || '[]');
    const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');

    const analisis: ProductAnalysis[] = productos.map(producto => {
      // Buscar última compra del producto
      let ultimaCompra = null;
      let fechaUltimaCompra = null;

      compras.forEach(compra => {
        compra.items.forEach(item => {
          if (item.productoId === producto.id) {
            const fechaCompra = new Date(compra.fecha);
            if (!fechaUltimaCompra || fechaCompra > fechaUltimaCompra) {
              fechaUltimaCompra = fechaCompra;
              ultimaCompra = {
                fecha: compra.fecha,
                precioCompra: item.costoUnitario,
                cantidad: item.cantidad
              };
            }
          }
        });
      });

      // Calcular días en depósito
      const diasEnDeposito = ultimaCompra 
        ? Math.floor((new Date().getTime() - new Date(ultimaCompra.fecha).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Calcular margen de utilidad
      const precioCompra = ultimaCompra?.precioCompra || producto.costoUnitario;
      const margenUtilidad = precioCompra > 0 
        ? ((producto.precioVenta - precioCompra) / precioCompra) * 100
        : 0;

      // Calcular posible descuento (máximo 50% del margen)
      const posibleDescuento = margenUtilidad > 20 
        ? Math.min(margenUtilidad * 0.5, 30)
        : Math.max(margenUtilidad * 0.3, 5);

      // Determinar rotación basada en ventas recientes
      const ventasUltimos3Meses = facturas
        .filter(f => {
          const fechaFactura = new Date(f.fecha);
          const hace3Meses = new Date();
          hace3Meses.setMonth(hace3Meses.getMonth() - 3);
          return fechaFactura >= hace3Meses;
        })
        .reduce((sum, f) => {
          const itemsProducto = f.items.filter(item => item.codigo === producto.codigo);
          return sum + itemsProducto.reduce((itemSum, item) => itemSum + item.cantidad, 0);
        }, 0);

      let rotacion: 'Alta' | 'Media' | 'Baja' = 'Baja';
      if (ventasUltimos3Meses > producto.stockActual * 2) rotacion = 'Alta';
      else if (ventasUltimos3Meses > producto.stockActual) rotacion = 'Media';

      // Generar recomendación
      let recomendacion = '';
      if (diasEnDeposito > 180 && rotacion === 'Baja') {
        recomendacion = 'Considerar descuento agresivo o liquidación';
      } else if (diasEnDeposito > 90 && margenUtilidad > 30) {
        recomendacion = 'Aplicar descuento promocional';
      } else if (rotacion === 'Alta' && producto.stockActual < producto.stockMinimo) {
        recomendacion = 'Urgente: Reabastecer stock';
      } else if (margenUtilidad < 15) {
        recomendacion = 'Revisar estructura de costos';
      } else {
        recomendacion = 'Producto en condiciones normales';
      }

      return {
        producto,
        ultimaCompra,
        diasEnDeposito,
        margenUtilidad,
        posibleDescuento,
        rotacion,
        recomendacion
      };
    });

    // Ordenar por días en depósito (más antiguos primero)
    analisis.sort((a, b) => b.diasEnDeposito - a.diasEnDeposito);
    setAnalisisProductos(analisis);
  }, []);

  const productosAntiguos = analisisProductos.filter(p => p.diasEnDeposito > 90);
  const productosConProblemas = analisisProductos.filter(p => 
    p.margenUtilidad < 15 || (p.diasEnDeposito > 180 && p.rotacion === 'Baja')
  );

  const getRotationColor = (rotacion: string) => {
    switch (rotacion) {
      case 'Alta': return 'bg-green-100 text-green-800 border-green-200';
      case 'Media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Antiguos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productosAntiguos.length}</div>
            <p className="text-xs text-muted-foreground">Más de 90 días en stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Problemas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productosConProblemas.length}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen Promedio</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analisisProductos.length > 0 
                ? (analisisProductos.reduce((sum, p) => sum + p.margenUtilidad, 0) / analisisProductos.length).toFixed(1)
                : '0.0'
              }%
            </div>
            <p className="text-xs text-muted-foreground">Rentabilidad general</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Bs. {analisisProductos.reduce((sum, p) => sum + (p.producto.stockActual * p.producto.costoUnitario), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">A costo de compra</p>
          </CardContent>
        </Card>
      </div>

      {productosConProblemas.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atención:</strong> {productosConProblemas.length} productos requieren revisión urgente por bajo margen o baja rotación.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Análisis Detallado de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead className="text-center">Días en Stock</TableHead>
                <TableHead className="text-right">Margen %</TableHead>
                <TableHead className="text-right">Desc. Sugerido</TableHead>
                <TableHead className="text-center">Rotación</TableHead>
                <TableHead>Recomendación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analisisProductos.map((analisis) => (
                <TableRow key={analisis.producto.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{analisis.producto.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {analisis.producto.stockActual} | 
                        Precio: Bs. {analisis.producto.precioVenta.toFixed(2)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {analisis.ultimaCompra ? (
                      <div>
                        <p className="text-sm">{new Date(analisis.ultimaCompra.fecha).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Bs. {analisis.ultimaCompra.precioCompra.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sin compras</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={analisis.diasEnDeposito > 180 ? "destructive" : 
                                 analisis.diasEnDeposito > 90 ? "secondary" : "default"}>
                      {analisis.diasEnDeposito} días
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${
                      analisis.margenUtilidad > 30 ? 'text-green-600' : 
                      analisis.margenUtilidad > 15 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {analisis.margenUtilidad.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {analisis.posibleDescuento.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getRotationColor(analisis.rotacion)}>
                      {analisis.rotacion}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{analisis.recomendacion}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryAnalysis;
