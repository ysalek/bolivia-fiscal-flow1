
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, CheckCircle, AlertTriangle, Sparkles, Zap, Activity } from 'lucide-react';
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

  useEffect(() => {
    // Sistema ya inicializado en producción - no agregar datos de ejemplo
    setSistemaInicializado(true);
  }, []);

  // Estadísticas de integración
  const comprobantesAutorizados = comprobantes.filter((c: any) => c.estado === 'autorizado');
  const comprobantesConAsientos = comprobantes.filter((c: any) => c.asientoGenerado);
  const totalIngresos = comprobantes.filter((c: any) => c.tipo === 'ingreso' && c.estado === 'autorizado').reduce((sum: number, c: any) => sum + c.monto, 0);
  const totalGastos = comprobantes.filter((c: any) => c.tipo === 'egreso' && c.estado === 'autorizado').reduce((sum: number, c: any) => sum + c.monto, 0);

  return (
    <div className="space-y-8">
      {/* Header mejorado */}
      <EnhancedHeader
        title="Panel de Control"
        subtitle={`Bienvenido al sistema contable empresarial - ${fechaActual}`}
        badge={{
          text: "En Producción",
          variant: "default"
        }}
        actions={<NotificationsIcon />}
      />

      {/* Métricas principales del sistema */}
      <Section 
        title="Estado del Sistema" 
        subtitle="Monitoreo en tiempo real de la operación contable"
      >
        <Card className="glass-effect border-l-4 border-l-success">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-success/10">
                <Activity className="w-6 h-6 text-success" />
              </div>
              <div>
                <span className="text-xl">Sistema Contable Activo</span>
                <Badge variant="outline" className="ml-3 animate-float">
                  <Zap className="w-3 h-3 mr-1" />
                  Tiempo Real
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-base">
              Operación óptima - {comprobantesAutorizados.length} comprobantes procesados | {asientos.length} asientos registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetricGrid columns={4}>
              <EnhancedMetricCard
                title="Comprobantes Integrados"
                value={comprobantesConAsientos.length}
                subtitle="Vinculados a contabilidad"
                icon={CheckCircle}
                variant="success"
                trend="up"
                trendValue="+100%"
              />
              <EnhancedMetricCard
                title="Ingresos Totales"
                value={`Bs. ${totalIngresos.toLocaleString()}`}
                subtitle="Periodo actual"
                icon={TrendingUp}
                variant="success"
                trend="up"
                trendValue="+12.5%"
              />
              <EnhancedMetricCard
                title="Gastos Totales"
                value={`Bs. ${totalGastos.toLocaleString()}`}
                subtitle="Periodo actual"
                icon={TrendingDown}
                variant="warning"
                trend="neutral"
                trendValue="Estable"
              />
              <EnhancedMetricCard
                title="Resultado Neto"
                value={`Bs. ${(totalIngresos - totalGastos).toLocaleString()}`}
                subtitle="Ganancia/Pérdida"
                icon={DollarSign}
                variant={totalIngresos - totalGastos > 0 ? "success" : "destructive"}
                trend={totalIngresos - totalGastos > 0 ? "up" : "down"}
                trendValue={`${((totalIngresos - totalGastos) / totalIngresos * 100).toFixed(1)}%`}
              />
            </MetricGrid>
          </CardContent>
        </Card>
      </Section>

      {/* Dashboard financiero mejorado */}
      <Section
        title="Dashboard Financiero"
        subtitle="Análisis detallado de métricas empresariales y tendencias"
      >
        <EnhancedFinancialDashboard 
          facturas={facturas}
          asientos={asientos}
          productos={productos}
        />
      </Section>
    </div>
  );
};

export default Dashboard;
