
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import NotificationsIcon from './dashboard/NotificationsIcon';

const Dashboard = () => {
  const [fechaActual] = useState(new Date().toLocaleDateString('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const { obtenerBalanceGeneral } = useContabilidadIntegration();
  const balance = obtenerBalanceGeneral();

  return (
    <div className="space-y-6">
      {/* Header con notificaciones */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Contable</h1>
          <p className="text-muted-foreground">{fechaActual}</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationsIcon />
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {balance.activos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total de activos empresariales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pasivos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {balance.pasivos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total de obligaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimonio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {balance.patrimonio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Capital y utilidades acumuladas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Índice de Solvencia</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.pasivos > 0 ? (balance.activos / balance.pasivos).toFixed(2) : '∞'}
            </div>
            <p className="text-xs text-muted-foreground">
              Activos / Pasivos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de actividades recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas transacciones del sistema contable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ingreso registrado</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                </div>
                <Badge variant="secondary">Bs. 1,500.00</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Egreso registrado</p>
                    <p className="text-xs text-muted-foreground">Hace 4 horas</p>
                  </div>
                </div>
                <Badge variant="secondary">Bs. 800.00</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Factura emitida</p>
                    <p className="text-xs text-muted-foreground">Ayer</p>
                  </div>
                </div>
                <Badge variant="secondary">Bs. 2,300.00</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>
              Información general del sistema contable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ecuación Contable</span>
                <Badge variant={Math.abs(balance.activos - (balance.pasivos + balance.patrimonio)) < 0.01 ? "default" : "destructive"}>
                  {Math.abs(balance.activos - (balance.pasivos + balance.patrimonio)) < 0.01 ? "Balanceada" : "Desbalanceada"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Último Respaldo</span>
                <Badge variant="outline">
                  {localStorage.getItem('ultimo-backup') ? 
                    new Date(localStorage.getItem('ultimo-backup')!).toLocaleDateString('es-BO') : 
                    'Nunca'
                  }
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Asientos Registrados</span>
                <Badge variant="outline">
                  {JSON.parse(localStorage.getItem('asientosContables') || '[]').length}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Productos en Stock</span>
                <Badge variant="outline">
                  {JSON.parse(localStorage.getItem('productos') || '[]').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
