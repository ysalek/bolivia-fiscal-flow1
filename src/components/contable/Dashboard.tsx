
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, CheckCircle, AlertTriangle, Sparkles, Zap, Activity, Target, BarChart3, PieChart, Globe, Star, Award, Briefcase } from 'lucide-react';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import NotificationsIcon from './dashboard/NotificationsIcon';
import SystemValidation from './dashboard/SystemValidation';
import EnhancedFinancialDashboard from './dashboard/EnhancedFinancialDashboard';
import { EnhancedHeader, MetricGrid, EnhancedMetricCard, Section } from './dashboard/EnhancedLayout';
import { inicializarSistemaCompleto } from '../../utils/inicializarSistema';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [fechaActual] = useState(new Date().toLocaleDateString('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const [sistemaInicializado, setSistemaInicializado] = useState(false);
  const { toast } = useToast();

  const { obtenerBalanceGeneral } = useContabilidadIntegration();
  const balance = obtenerBalanceGeneral();

  // Obtener datos para el dashboard mejorado
  const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
  const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
  const productos = JSON.parse(localStorage.getItem('productos') || '[]');
  const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const proveedores = JSON.parse(localStorage.getItem('proveedores') || '[]');

  useEffect(() => {
    // Sistema ya inicializado en producción - no agregar datos de ejemplo
    setSistemaInicializado(true);
  }, []);

  // Cálculos avanzados para métricas empresariales
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().slice(0, 7);

  // Estadísticas de integración mejoradas
  const comprobantesAutorizados = comprobantes.filter((c: any) => c.estado === 'autorizado');
  const comprobantesConAsientos = comprobantes.filter((c: any) => c.asientoGenerado);
  const totalIngresos = comprobantes.filter((c: any) => c.tipo === 'ingreso' && c.estado === 'autorizado').reduce((sum: number, c: any) => sum + c.monto, 0);
  const totalGastos = comprobantes.filter((c: any) => c.tipo === 'egreso' && c.estado === 'autorizado').reduce((sum: number, c: any) => sum + c.monto, 0);

  // Métricas financieras avanzadas
  const ventasHoy = facturas.filter(f => f.fecha === today && f.estado !== 'anulada').reduce((sum, f) => sum + f.total, 0);
  const ventasMes = facturas.filter(f => f.fecha.startsWith(thisMonth) && f.estado !== 'anulada').reduce((sum, f) => sum + f.total, 0);
  const ventasMesAnterior = facturas.filter(f => f.fecha.startsWith(lastMonthStr) && f.estado !== 'anulada').reduce((sum, f) => sum + f.total, 0);
  const crecimientoVentas = ventasMesAnterior > 0 ? ((ventasMes - ventasMesAnterior) / ventasMesAnterior * 100) : 0;

  // ROI y rentabilidad
  const margenBruto = ventasMes > 0 ? ((ventasMes - totalGastos) / ventasMes * 100) : 0;
  const ebitda = totalIngresos - totalGastos;
  const roiMensual = totalGastos > 0 ? (ebitda / totalGastos * 100) : 0;

  // Análisis de clientes
  const clientesActivosMes = new Set(facturas.filter(f => f.fecha.startsWith(thisMonth)).map(f => f.cliente.id)).size;
  const clientesNuevosMes = clientes.filter(c => c.fechaRegistro && c.fechaRegistro.startsWith(thisMonth)).length;
  const ticketPromedio = facturas.length > 0 ? ventasMes / facturas.filter(f => f.fecha.startsWith(thisMonth) && f.estado !== 'anulada').length : 0;

  // Análisis de inventario
  const valorInventario = productos.reduce((sum, p) => sum + (p.stockActual * p.costoUnitario), 0);
  const productosStockBajo = productos.filter(p => p.stockActual <= p.stockMinimo && p.stockActual > 0).length;
  const rotacionInventario = ventasMes > 0 && valorInventario > 0 ? (ventasMes / valorInventario * 12) : 0;

  // Eficiencia operacional
  const facturasPendientes = facturas.filter(f => f.estado === 'enviada').length;
  const tiempoCobranza = 30; // días promedio
  const eficienciaCobranza = facturasPendientes > 0 ? ((facturas.length - facturasPendientes) / facturas.length * 100) : 100;

  return (
    <div className="space-y-8">
      {/* Header mejorado con gradiente */}
      <EnhancedHeader
        title="Centro de Comando Empresarial"
        subtitle={`Inteligencia contable avanzada - ${fechaActual}`}
        badge={{
          text: "Sistema Activo",
          variant: "default"
        }}
        actions={<NotificationsIcon />}
      />

      {/* KPIs Ejecutivos de Alto Nivel */}
      <Section 
        title="Métricas Ejecutivas" 
        subtitle="Indicadores clave de rendimiento empresarial"
      >
        <Card className="glass-effect border-l-4 border-l-success nav-gradient">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl text-white font-bold">Performance Empresarial</span>
                <Badge variant="outline" className="ml-3 animate-float bg-white/20 text-white border-white/30">
                  <Star className="w-3 h-3 mr-1" />
                  Tiempo Real
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              {comprobantesAutorizados.length} transacciones procesadas • {asientos.length} asientos contables • ROI {roiMensual.toFixed(1)}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MetricGrid columns={4}>
              <EnhancedMetricCard
                title="Ingresos del Mes"
                value={`Bs. ${ventasMes.toLocaleString()}`}
                subtitle={`Crecimiento vs mes anterior`}
                icon={DollarSign}
                variant={crecimientoVentas > 0 ? "success" : crecimientoVentas < 0 ? "destructive" : "default"}
                trend={crecimientoVentas > 0 ? "up" : crecimientoVentas < 0 ? "down" : "neutral"}
                trendValue={`${crecimientoVentas > 0 ? '+' : ''}${crecimientoVentas.toFixed(1)}%`}
              />
              <EnhancedMetricCard
                title="EBITDA"
                value={`Bs. ${ebitda.toLocaleString()}`}
                subtitle={`Margen bruto: ${margenBruto.toFixed(1)}%`}
                icon={BarChart3}
                variant={ebitda > 0 ? "success" : "destructive"}
                trend={ebitda > 0 ? "up" : "down"}
                trendValue={`${((ebitda / ventasMes) * 100).toFixed(1)}% del revenue`}
              />
              <EnhancedMetricCard
                title="ROI Mensual"
                value={`${roiMensual.toFixed(1)}%`}
                subtitle="Retorno sobre inversión"
                icon={Target}
                variant={roiMensual > 15 ? "success" : roiMensual > 5 ? "warning" : "destructive"}
                trend={roiMensual > 10 ? "up" : "down"}
                trendValue={roiMensual > 15 ? "Excelente" : roiMensual > 5 ? "Bueno" : "Mejorar"}
              />
              <EnhancedMetricCard
                title="Eficiencia de Cobranza"
                value={`${eficienciaCobranza.toFixed(0)}%`}
                subtitle={`${facturasPendientes} facturas pendientes`}
                icon={CheckCircle}
                variant={eficienciaCobranza > 90 ? "success" : eficienciaCobranza > 70 ? "warning" : "destructive"}
                trend={eficienciaCobranza > 85 ? "up" : "down"}
                trendValue={`${tiempoCobranza} días promedio`}
              />
            </MetricGrid>
          </CardContent>
        </Card>
      </Section>

      {/* Análisis de Clientes y Ventas */}
      <Section
        title="Inteligencia Comercial"
        subtitle="Análisis avanzado del comportamiento de clientes y ventas"
      >
        <MetricGrid columns={3}>
          <EnhancedMetricCard
            title="Clientes Activos"
            value={clientesActivosMes}
            subtitle={`+${clientesNuevosMes} nuevos este mes`}
            icon={Users}
            variant="default"
            trend={clientesNuevosMes > 0 ? "up" : "neutral"}
            trendValue={`${((clientesActivosMes / Math.max(clientes.length, 1)) * 100).toFixed(0)}% del total`}
          />
          <EnhancedMetricCard
            title="Ticket Promedio"
            value={`Bs. ${ticketPromedio.toFixed(0)}`}
            subtitle="Valor promedio por venta"
            icon={ShoppingCart}
            variant="default"
            trend="up"
            trendValue="Optimizando"
          />
          <EnhancedMetricCard
            title="Ventas Hoy"
            value={`Bs. ${ventasHoy.toLocaleString()}`}
            subtitle="Ingresos del día actual"
            icon={Zap}
            variant={ventasHoy > 0 ? "success" : "warning"}
            trend={ventasHoy > 0 ? "up" : "neutral"}
            trendValue={ventasHoy > 0 ? "Activo" : "Esperando"}
          />
        </MetricGrid>
      </Section>

      {/* Análisis de Inventario y Operaciones */}
      <Section
        title="Operaciones e Inventario"
        subtitle="Control inteligente de stock y eficiencia operacional"
      >
        <MetricGrid columns={4}>
          <EnhancedMetricCard
            title="Valor de Inventario"
            value={`Bs. ${valorInventario.toLocaleString()}`}
            subtitle="Activo circulante"
            icon={Package}
            variant="default"
            trend="up"
            trendValue="Estable"
          />
          <EnhancedMetricCard
            title="Rotación de Inventario"
            value={`${rotacionInventario.toFixed(1)}x`}
            subtitle="Veces por año"
            icon={Globe}
            variant={rotacionInventario > 6 ? "success" : rotacionInventario > 3 ? "warning" : "destructive"}
            trend={rotacionInventario > 4 ? "up" : "down"}
            trendValue={rotacionInventario > 6 ? "Excelente" : rotacionInventario > 3 ? "Bueno" : "Lento"}
          />
          <EnhancedMetricCard
            title="Productos Stock Bajo"
            value={productosStockBajo}
            subtitle="Requieren reposición"
            icon={AlertTriangle}
            variant={productosStockBajo > 0 ? "warning" : "success"}
            trend={productosStockBajo > 0 ? "down" : "up"}
            trendValue={productosStockBajo > 0 ? "Atención" : "Óptimo"}
          />
          <EnhancedMetricCard
            title="Productos Activos"
            value={`${productos.filter(p => p.stockActual > 0).length}/${productos.length}`}
            subtitle="En stock / Total"
            icon={Briefcase}
            variant="default"
            trend="up"
            trendValue={`${((productos.filter(p => p.stockActual > 0).length / Math.max(productos.length, 1)) * 100).toFixed(0)}%`}
          />
        </MetricGrid>
      </Section>

      {/* Dashboard financiero mejorado */}
      <Section
        title="Análisis Financiero Avanzado"
        subtitle="Visualización detallada de métricas empresariales y tendencias predictivas"
      >
        <EnhancedFinancialDashboard 
          facturas={facturas}
          asientos={asientos}
          productos={productos}
        />
      </Section>

      {/* Panel de alertas inteligentes */}
      <Section
        title="Centro de Alertas Inteligentes"
        subtitle="Monitoreo automático de eventos críticos del negocio"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosStockBajo > 0 && (
            <Card className="border-l-4 border-l-warning bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  Stock Bajo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{productosStockBajo} productos necesitan reposición urgente</p>
              </CardContent>
            </Card>
          )}
          
          {facturasPendientes > 0 && (
            <Card className="border-l-4 border-l-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Package className="w-5 h-5" />
                  Cuentas por Cobrar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{facturasPendientes} facturas pendientes de cobro</p>
              </CardContent>
            </Card>
          )}
          
          {roiMensual > 20 && (
            <Card className="border-l-4 border-l-success bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <TrendingUp className="w-5 h-5" />
                  Performance Excepcional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>ROI del {roiMensual.toFixed(1)}% - ¡Excelente gestión!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>
    </div>
  );
};

export default Dashboard;
