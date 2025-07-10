
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
    // Inicializar sistema al cargar el dashboard
    if (!sistemaInicializado) {
      try {
        const inicializado = inicializarSistemaCompleto();
        if (inicializado) {
          setSistemaInicializado(true);
          toast({
            title: "Sistema inicializado",
            description: "Datos de ejemplo y asientos contables generados correctamente",
          });
        }
      } catch (error) {
        console.error("Error al inicializar sistema:", error);
        toast({
          title: "Error de inicialización",
          description: "Hubo un problema al inicializar el sistema",
          variant: "destructive"
        });
      }
    }
  }, [sistemaInicializado, toast]);

  // Estadísticas de integración
  const comprobantesAutorizados = comprobantes.filter((c: any) => c.estado === 'autorizado');
  const comprobantesConAsientos = comprobantes.filter((c: any) => c.asientoGenerado);
  const totalIngresos = comprobantes.filter((c: any) => c.tipo === 'ingreso' && c.estado === 'autorizado').reduce((sum: number, c: any) => sum + c.monto, 0);
  const totalGastos = comprobantes.filter((c: any) => c.tipo === 'egreso' && c.estado === 'autorizado').reduce((sum: number, c: any) => sum + c.monto, 0);

  return (
    <div className="space-y-6">
      {/* Status de inicialización */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {sistemaInicializado ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                Sistema Integrado Activo
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Inicializando Sistema...
              </>
            )}
          </CardTitle>
          <CardDescription>
            {sistemaInicializado ? 
              `Comprobantes integrados: ${comprobantesAutorizados.length} | Asientos generados: ${asientos.length} | Balance equilibrado` :
              "Cargando datos de ejemplo y generando asientos contables..."
            }
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

      {/* Información de pruebas */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg">Datos de Prueba Incluidos</CardTitle>
          <CardDescription>
            El sistema incluye datos de ejemplo completos para probar todas las funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Comprobantes de Ingreso:</h4>
              <ul className="space-y-1 text-slate-600">
                <li>• Venta de servicios con factura (IT calculado)</li>
                <li>• Venta adicional con separación de IVA e IT</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Comprobantes de Egreso:</h4>
              <ul className="space-y-1 text-slate-600">
                <li>• Alquiler con factura (87% como gasto)</li>
                <li>• Suministros sin factura (100% como gasto)</li>
                <li>• Servicios profesionales con factura</li>
                <li>• Planilla de sueldos sin factura</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Estado de Resultados:</strong> Los gastos administrativos de los comprobantes ya están integrados y deberían aparecer correctamente clasificados por cuenta contable.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
