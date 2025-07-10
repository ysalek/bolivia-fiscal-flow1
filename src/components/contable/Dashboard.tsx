
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import NotificationsIcon from './dashboard/NotificationsIcon';
import SystemValidation from './dashboard/SystemValidation';
import EnhancedFinancialDashboard from './dashboard/EnhancedFinancialDashboard';
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
    <div className="space-y-6">
      {/* Header con notificaciones */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido al sistema contable - {fechaActual}</p>
        </div>
        <NotificationsIcon />
      </div>

      {/* Status de inicialización */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Sistema Contable en Producción
          </CardTitle>
          <CardDescription>
            Sistema listo para usar - Comprobantes: {comprobantesAutorizados.length} | Asientos: {asientos.length} | Estado: Activo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{comprobantesConAsientos.length}</div>
              <div className="text-xs text-green-700">Comprobantes Integrados</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">Bs. {totalIngresos.toFixed(0)}</div>
              <div className="text-xs text-blue-700">Total Ingresos</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">Bs. {totalGastos.toFixed(0)}</div>
              <div className="text-xs text-red-700">Total Gastos</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">Bs. {(totalIngresos - totalGastos).toFixed(0)}</div>
              <div className="text-xs text-purple-700">Resultado Neto</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard financiero mejorado */}
      <EnhancedFinancialDashboard 
        facturas={facturas}
        asientos={asientos}
        productos={productos}
      />
    </div>
  );
};

export default Dashboard;
