
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, FileText } from "lucide-react";
import { Factura } from "./BillingData";
import { AsientoContable } from "../diary/DiaryData";
import { Producto } from "../products/ProductsData";

interface FinancialDashboardProps {
  facturas: Factura[];
  asientos: AsientoContable[];
  productos: Producto[];
}

const FinancialDashboard = ({ facturas, asientos, productos }: FinancialDashboardProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = new Date().toISOString().slice(0, 7);

  // Cálculos de métricas
  const ventasHoy = facturas.filter(f => f.fecha === today && f.estado !== 'anulada')
    .reduce((sum, f) => sum + f.total, 0);

  const ventasMes = facturas.filter(f => f.fecha.startsWith(thisMonth) && f.estado !== 'anulada')
    .reduce((sum, f) => sum + f.total, 0);

  const facturasPendientes = facturas.filter(f => f.estado === 'enviada').length;

  const clientesActivos = new Set(
    facturas.filter(f => f.fecha.startsWith(thisMonth)).map(f => f.cliente.id)
  ).size;

  const productosStock = productos.filter(p => p.stockActual > 0).length;
  const productosStockBajo = productos.filter(p => p.stockActual <= p.stockMinimo && p.stockActual > 0).length;

  const asientosHoy = asientos.filter(a => a.fecha === today && a.estado === 'registrado').length;

  const valorInventario = productos.reduce((sum, p) => sum + (p.stockActual * p.costoUnitario), 0);

  const metrics = [
    {
      title: "Ventas Hoy",
      value: `Bs. ${ventasHoy.toFixed(2)}`,
      description: "Ingresos del día actual",
      icon: DollarSign,
      trend: ventasHoy > 0 ? "up" : "neutral",
      color: "text-green-600"
    },
    {
      title: "Ventas del Mes",
      value: `Bs. ${ventasMes.toFixed(2)}`,
      description: "Ingresos acumulados",
      icon: TrendingUp,
      trend: "up",
      color: "text-blue-600"
    },
    {
      title: "Facturas Pendientes",
      value: facturasPendientes.toString(),
      description: "Por cobrar",
      icon: FileText,
      trend: facturasPendientes > 0 ? "down" : "neutral",
      color: "text-orange-600"
    },
    {
      title: "Clientes Activos",
      value: clientesActivos.toString(),
      description: "Este mes",
      icon: Users,
      trend: "up",
      color: "text-purple-600"
    },
    {
      title: "Productos en Stock",
      value: `${productosStock}/${productos.length}`,
      description: `${productosStockBajo} con stock bajo`,
      icon: Package,
      trend: productosStockBajo > 0 ? "down" : "up",
      color: "text-indigo-600"
    },
    {
      title: "Valor Inventario",
      value: `Bs. ${valorInventario.toFixed(2)}`,
      description: `${asientosHoy} asientos hoy`,
      icon: TrendingUp,
      trend: "up",
      color: "text-emerald-600"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Financiero</h2>
        <p className="text-gray-600">Resumen de métricas clave del negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <p className="text-xs text-gray-600">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Alertas del Sistema</h3>
        <div className="grid gap-4">
          {productosStockBajo > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">
                      Stock Bajo Detectado
                    </p>
                    <p className="text-sm text-orange-600">
                      {productosStockBajo} producto(s) con stock por debajo del mínimo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {facturasPendientes > 5 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">
                      Muchas Facturas Pendientes
                    </p>
                    <p className="text-sm text-red-600">
                      {facturasPendientes} facturas pendientes de cobro
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {asientosHoy === 0 && ventasHoy > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Verificar Registro Contable
                    </p>
                    <p className="text-sm text-yellow-600">
                      Hay ventas registradas pero sin asientos contables hoy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
