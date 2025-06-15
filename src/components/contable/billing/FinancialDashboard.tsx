import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, FileText, PieChart as PieChartIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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

  // --- Data for Charts ---

  // Sales chart data (last 30 days)
  const salesData = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return { date: d.toISOString().slice(0, 10), total: 0 };
  });

  facturas.forEach(f => {
    if (f.estado !== 'anulada') {
      const saleDate = salesData.find(d => d.date === f.fecha);
      if (saleDate) {
        saleDate.total += f.total;
      }
    }
  });
  
  const salesChartData = salesData.map(d => ({
    date: new Date(d.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    ventas: d.total,
  }));

  const salesChartConfig = {
    ventas: {
      label: "Ventas",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Invoice status pie chart data
  const statusChartConfig = {
    pagada: { label: 'Pagada', color: 'hsl(var(--chart-1))' },
    enviada: { label: 'Enviada', color: 'hsl(var(--chart-2))' },
    borrador: { label: 'Borrador', color: 'hsl(var(--chart-4))' },
    anulada: { label: 'Anulada', color: 'hsl(var(--chart-5))' },
  } satisfies ChartConfig;

  const statusCounts = facturas.reduce((acc, f) => {
    acc[f.estado] = (acc[f.estado] || 0) + 1;
    return acc;
  }, {} as Record<Factura['estado'], number>)

  const pieChartData = Object.entries(statusCounts)
    .map(([name, value]) => ({
      name: name as Factura['estado'],
      value,
      fill: statusChartConfig[name as Factura['estado']]?.color || 'hsl(var(--chart-3))',
    }));

  // --- Data for Top Selling Products Chart ---
  const productSales = facturas
    .filter(f => f.estado === 'pagada' || f.estado === 'enviada')
    .flatMap(f => f.detalles)
    .reduce((acc, detalle) => {
      acc[detalle.productoId] = (acc[detalle.productoId] || 0) + detalle.subtotal;
      return acc;
    }, {} as Record<string, number>);

  const topProductsData = Object.entries(productSales)
    .map(([productoId, totalVentas]) => {
      const producto = productos.find(p => p.id === productoId);
      return {
        name: producto ? producto.nombre : 'Producto Desconocido',
        value: totalVentas,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const topProductsColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const topProductsChartData = topProductsData.map((entry, index) => ({
    ...entry,
    fill: topProductsColors[index % topProductsColors.length],
  }));

  const topProductsChartConfig = topProductsData.reduce((acc, cur) => {
    acc[cur.name] = { label: cur.name };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Escritorio Financiero</h2>
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
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas de los Últimos 30 Días</CardTitle>
            <CardDescription>Análisis de ingresos diarios (Bs.)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={salesChartData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} tickFormatter={(value) => `Bs ${value / 1000}k`} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="ventas" fill="var(--color-ventas)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Estado de Facturas</CardTitle>
                <CardDescription>Distribución del total de facturas</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-4">
                <ChartContainer config={statusChartConfig} className="h-[250px] w-full aspect-square">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideIndicator />} />
                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                          const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                          if ((percent * 100) < 5) return null;
                          return (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium">
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}>
                          {pieChartData.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" /> Top 5 Productos Vendidos
                </CardTitle>
                <CardDescription>Productos con mayores ingresos por ventas (Bs.)</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-4">
                <ChartContainer config={topProductsChartConfig} className="h-[250px] w-full aspect-square">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" formatter={(value) => `Bs. ${Number(value).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />} />
                        <Pie data={topProductsChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ percent }) => {
                              if (percent * 100 < 5) return null;
                              return `${(percent * 100).toFixed(0)}%`;
                          }}>
                          {topProductsChartData.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
          </Card>
        </div>
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
