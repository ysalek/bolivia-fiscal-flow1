import { useState } from "react";
import { DollarSign, Users, Package, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factura } from "../billing/BillingData";
import { AsientoContable } from "../diary/DiaryData";
import { Producto } from "../products/ProductsData";
import EnhancedMetricCard from "./EnhancedMetricCard";
import EnhancedSalesChart from "./EnhancedSalesChart";
import InvoiceStatusChart from "./InvoiceStatusChart";
import TopProductsChart from "./TopProductsChart";
import SystemAlerts from "./SystemAlerts";

interface EnhancedFinancialDashboardProps {
  facturas: Factura[];
  asientos: AsientoContable[];
  productos: Producto[];
}

const EnhancedFinancialDashboard = ({ facturas, asientos, productos }: EnhancedFinancialDashboardProps) => {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [cardOrder, setCardOrder] = useState([
    "ventas-hoy", "ventas-mes", "facturas-pendientes", 
    "clientes-activos", "productos-stock", "valor-inventario"
  ]);

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

  const formatBoliviano = (amount: number) => {
    return `Bs. ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const metrics = {
    "ventas-hoy": {
      title: "Ventas Hoy",
      value: formatBoliviano(ventasHoy),
      description: "Ingresos del día actual",
      icon: DollarSign,
      trend: ventasHoy > 0 ? "up" : "neutral",
      color: "text-primary"
    },
    "ventas-mes": {
      title: "Ventas del Mes",
      value: formatBoliviano(ventasMes),
      description: "Ingresos acumulados",
      icon: TrendingUp,
      trend: "up",
      color: "text-success"
    },
    "facturas-pendientes": {
      title: "Facturas Pendientes",
      value: facturasPendientes.toString(),
      description: "Por cobrar",
      icon: FileText,
      trend: facturasPendientes > 0 ? "down" : "neutral",
      color: "text-warning"
    },
    "clientes-activos": {
      title: "Clientes Activos",
      value: clientesActivos.toString(),
      description: "Este mes",
      icon: Users,
      trend: "up",
      color: "text-primary"
    },
    "productos-stock": {
      title: "Productos en Stock",
      value: `${productosStock}/${productos.length}`,
      description: `${productosStockBajo} con stock bajo`,
      icon: Package,
      trend: productosStockBajo > 0 ? "down" : "up",
      color: "text-success"
    },
    "valor-inventario": {
      title: "Valor Inventario",
      value: formatBoliviano(valorInventario),
      description: `${asientosHoy} asientos hoy`,
      icon: TrendingUp,
      trend: "up",
      color: "text-primary"
    }
  };

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
      color: "hsl(var(--primary))",
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
    "hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))", 
    "hsl(var(--destructive))", "hsl(var(--muted-foreground))"
  ];

  const topProductsChartData = topProductsData.map((entry, index) => ({
    ...entry,
    fill: topProductsColors[index % topProductsColors.length],
  }));

  const topProductsChartConfig = topProductsData.reduce((acc, cur) => {
    acc[cur.name] = { label: cur.name };
    return acc;
  }, {} as ChartConfig);

  const handleDragStart = (cardId: string) => {
    setDraggedCard(cardId);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Escritorio Financiero</h2>
          <p className="text-muted-foreground mt-1">
            Sistema contable boliviano - Resumen ejecutivo
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <AlertTriangle className="w-4 h-4 mr-2" />
          SIAT Conectado
        </Button>
      </div>

      {/* KPI Cards Grid - Draggable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardOrder.map((cardId) => {
          const metric = metrics[cardId as keyof typeof metrics];
          return (
            <EnhancedMetricCard
              key={cardId}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              icon={metric.icon}
              trend={metric.trend as "up" | "down" | "neutral"}
              color={metric.color}
              isDragging={draggedCard === cardId}
              onDragStart={() => handleDragStart(cardId)}
              onDragEnd={handleDragEnd}
            />
          );
        })}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnhancedSalesChart salesChartData={salesChartData} salesChartConfig={salesChartConfig} />
        </div>
        
        <div className="space-y-6">
          <InvoiceStatusChart pieChartData={pieChartData} statusChartConfig={statusChartConfig} />
          <TopProductsChart topProductsChartData={topProductsChartData} topProductsChartConfig={topProductsChartConfig} />
        </div>
      </div>

      {/* System Alerts */}
      <SystemAlerts
        productosStockBajo={productosStockBajo}
        facturasPendientes={facturasPendientes}
        asientosHoy={asientosHoy}
        ventasHoy={ventasHoy}
      />
    </div>
  );
};

export default EnhancedFinancialDashboard;