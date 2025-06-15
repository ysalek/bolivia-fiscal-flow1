
import { DollarSign, Users, Package, FileText, TrendingUp } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { Factura } from "./BillingData";
import { AsientoContable } from "../diary/DiaryData";
import { Producto } from "../products/ProductsData";
import MetricCard from "../dashboard/MetricCard";
import SalesChart from "../dashboard/SalesChart";
import InvoiceStatusChart from "../dashboard/InvoiceStatusChart";
import TopProductsChart from "../dashboard/TopProductsChart";
import SystemAlerts from "../dashboard/SystemAlerts";

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
    .flatMap(f => f.items)
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
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            trend={metric.trend as "up" | "down" | "neutral"}
            color={metric.color}
          />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart salesChartData={salesChartData} salesChartConfig={salesChartConfig} />
        
        <div className="space-y-6">
          <InvoiceStatusChart pieChartData={pieChartData} statusChartConfig={statusChartConfig} />
          <TopProductsChart topProductsChartData={topProductsChartData} topProductsChartConfig={topProductsChartConfig} />
        </div>
      </div>

      {/* Alertas */}
      <SystemAlerts
        productosStockBajo={productosStockBajo}
        facturasPendientes={facturasPendientes}
        asientosHoy={asientosHoy}
        ventasHoy={ventasHoy}
      />
    </div>
  );
};

export default FinancialDashboard;
