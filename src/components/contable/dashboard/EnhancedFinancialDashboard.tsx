import { DollarSign, Users, Package, FileText, TrendingUp, BarChart3, Target, Zap } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { Factura } from "../billing/BillingData";
import { AsientoContable } from "../diary/DiaryData";
import { Producto } from "../products/ProductsData";
import { EnhancedMetricCard, MetricGrid, ChartContainer, Section } from "./EnhancedLayout";
import SalesChart from "./SalesChart";
import InvoiceStatusChart from "./InvoiceStatusChart";
import TopProductsChart from "./TopProductsChart";
import SystemAlerts from "./SystemAlerts";

interface EnhancedFinancialDashboardProps {
  facturas: Factura[];
  asientos: AsientoContable[];
  productos: Producto[];
}

const EnhancedFinancialDashboard = ({ facturas, asientos, productos }: EnhancedFinancialDashboardProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = new Date().toISOString().slice(0, 7);

  // Cálculos de métricas mejorados
  const ventasHoy = facturas.filter(f => f.fecha === today && f.estado !== 'anulada')
    .reduce((sum, f) => sum + f.total, 0);

  const ventasMes = facturas.filter(f => f.fecha.startsWith(thisMonth) && f.estado !== 'anulada')
    .reduce((sum, f) => sum + f.total, 0);

  const ventasMesAnterior = (() => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7);
    return facturas.filter(f => f.fecha.startsWith(lastMonthStr) && f.estado !== 'anulada')
      .reduce((sum, f) => sum + f.total, 0);
  })();

  const crecimientoVentas = ventasMesAnterior > 0 ? 
    ((ventasMes - ventasMesAnterior) / ventasMesAnterior * 100) : 0;

  const facturasPendientes = facturas.filter(f => f.estado === 'enviada').length;
  const facturasVencidas = facturas.filter(f => {
    if (f.estado !== 'enviada') return false;
    const vencimiento = new Date(f.fecha);
    vencimiento.setDate(vencimiento.getDate() + 30);
    return vencimiento < new Date();
  }).length;

  const clientesActivos = new Set(
    facturas.filter(f => f.fecha.startsWith(thisMonth)).map(f => f.cliente.id)
  ).size;

  const clientesTotales = new Set(facturas.map(f => f.cliente.id)).size;

  const productosStock = productos.filter(p => p.stockActual > 0).length;
  const productosStockBajo = productos.filter(p => p.stockActual <= p.stockMinimo && p.stockActual > 0).length;
  const productosAgotados = productos.filter(p => p.stockActual === 0).length;

  const asientosHoy = asientos.filter(a => a.fecha === today && a.estado === 'registrado').length;
  const asientosMes = asientos.filter(a => a.fecha.startsWith(thisMonth) && a.estado === 'registrado').length;

  const valorInventario = productos.reduce((sum, p) => sum + (p.stockActual * p.costoUnitario), 0);
  const rotacionInventario = ventasMes > 0 ? (ventasMes / valorInventario * 12).toFixed(1) : '0';

  const ticketPromedio = facturas.length > 0 ? ventasMes / facturas.filter(f => f.fecha.startsWith(thisMonth) && f.estado !== 'anulada').length : 0;

  // --- Data for Charts ---
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
      color: "hsl(var(--success))",
    },
  } satisfies ChartConfig;

  // Invoice status pie chart data
  const statusChartConfig = {
    pagada: { label: 'Pagada', color: 'hsl(var(--success))' },
    enviada: { label: 'Enviada', color: 'hsl(var(--primary))' },
    borrador: { label: 'Borrador', color: 'hsl(var(--muted-foreground))' },
    anulada: { label: 'Anulada', color: 'hsl(var(--destructive))' },
  } satisfies ChartConfig;

  const statusCounts = facturas.reduce((acc, f) => {
    acc[f.estado] = (acc[f.estado] || 0) + 1;
    return acc;
  }, {} as Record<Factura['estado'], number>)

  const pieChartData = Object.entries(statusCounts)
    .map(([name, value]) => ({
      name: name as Factura['estado'],
      value,
      fill: `var(--color-${name})`,
    }));

  // Top products data
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
    "hsl(var(--primary))",
    "hsl(var(--success))", 
    "hsl(var(--warning))",
    "hsl(var(--destructive))",
    "hsl(var(--muted-foreground))",
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
    <div className="space-y-8">
      {/* Métricas principales */}
      <Section
        title="Métricas de Rendimiento"
        subtitle="Indicadores clave de desempeño empresarial"
      >
        <MetricGrid columns={3}>
          <EnhancedMetricCard
            title="Ventas Hoy"
            value={`Bs. ${ventasHoy.toLocaleString()}`}
            subtitle={`Ticket promedio: Bs. ${ticketPromedio.toFixed(0)}`}
            icon={DollarSign}
            variant="success"
            trend={ventasHoy > 0 ? "up" : "neutral"}
            trendValue={ventasHoy > 0 ? "+100%" : "Sin ventas"}
          />
          <EnhancedMetricCard
            title="Ventas del Mes"
            value={`Bs. ${ventasMes.toLocaleString()}`}
            subtitle={`${asientosMes} asientos registrados`}
            icon={TrendingUp}
            variant={crecimientoVentas > 0 ? "success" : crecimientoVentas < 0 ? "destructive" : "default"}
            trend={crecimientoVentas > 0 ? "up" : crecimientoVentas < 0 ? "down" : "neutral"}
            trendValue={`${crecimientoVentas > 0 ? '+' : ''}${crecimientoVentas.toFixed(1)}%`}
          />
          <EnhancedMetricCard
            title="Cuentas por Cobrar"
            value={facturasPendientes}
            subtitle={`${facturasVencidas} vencidas`}
            icon={FileText}
            variant={facturasVencidas > 0 ? "destructive" : facturasPendientes > 0 ? "warning" : "success"}
            trend={facturasPendientes > 0 ? "down" : "neutral"}
            trendValue={facturasPendientes > 0 ? "Pendientes" : "Al día"}
          />
        </MetricGrid>
      </Section>

      {/* Métricas operacionales */}
      <Section
        title="Operaciones"
        subtitle="Control de inventario y gestión comercial"
      >
        <MetricGrid columns={4}>
          <EnhancedMetricCard
            title="Clientes Activos"
            value={`${clientesActivos}/${clientesTotales}`}
            subtitle="Este mes / Total"
            icon={Users}
            variant="default"
            trend="up"
            trendValue={`${((clientesActivos / clientesTotales) * 100).toFixed(0)}%`}
          />
          <EnhancedMetricCard
            title="Productos en Stock"
            value={`${productosStock}/${productos.length}`}
            subtitle={`${productosStockBajo} stock bajo`}
            icon={Package}
            variant={productosStockBajo > 0 ? "warning" : "success"}
            trend={productosStockBajo > 0 ? "down" : "up"}
            trendValue={productosAgotados > 0 ? `${productosAgotados} agotados` : "Óptimo"}
          />
          <EnhancedMetricCard
            title="Valor Inventario"
            value={`Bs. ${valorInventario.toLocaleString()}`}
            subtitle={`Rotación: ${rotacionInventario}x/año`}
            icon={BarChart3}
            variant="default"
            trend="up"
            trendValue="Estable"
          />
          <EnhancedMetricCard
            title="Asientos Contables"
            value={asientosHoy}
            subtitle={`${asientosMes} este mes`}
            icon={Target}
            variant="default"
            trend="up"
            trendValue="Activo"
          />
        </MetricGrid>
      </Section>

      {/* Gráficos */}
      <Section
        title="Análisis Visual"
        subtitle="Tendencias y distribución de datos"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartContainer
            title="Tendencia de Ventas"
            subtitle="Últimos 30 días"
          >
            <SalesChart salesChartData={salesChartData} salesChartConfig={salesChartConfig} />
          </ChartContainer>
          
          <div className="space-y-6">
            <ChartContainer
              title="Estado de Facturas"
              subtitle="Distribución actual"
            >
              <InvoiceStatusChart pieChartData={pieChartData} statusChartConfig={statusChartConfig} />
            </ChartContainer>
            
            <ChartContainer
              title="Top Productos"
              subtitle="Más vendidos"
            >
              <TopProductsChart topProductsChartData={topProductsChartData} topProductsChartConfig={topProductsChartConfig} />
            </ChartContainer>
          </div>
        </div>
      </Section>

      {/* Alertas del sistema */}
      <Section
        title="Alertas y Notificaciones"
        subtitle="Seguimiento de elementos críticos"
      >
        <SystemAlerts
          productosStockBajo={productosStockBajo}
          facturasPendientes={facturasPendientes}
          asientosHoy={asientosHoy}
          ventasHoy={ventasHoy}
        />
      </Section>
    </div>
  );
};

export default EnhancedFinancialDashboard;