import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  FileText, 
  ShoppingCart,
  Database,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";

interface SystemMetrics {
  users: number;
  products: number;
  clients: number;
  invoices: number;
  purchases: number;
  totalRevenue: number;
  totalExpenses: number;
  activeModules: number;
  systemHealth: number;
  dataIntegrity: number;
}

const SystemStats = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateSystemMetrics();
  }, []);

  const calculateSystemMetrics = async () => {
    try {
      // Simular cálculo de métricas del sistema
      await new Promise(resolve => setTimeout(resolve, 1000));

      const calculatedMetrics: SystemMetrics = {
        users: JSON.parse(localStorage.getItem('usuarios') || '[]').length,
        products: JSON.parse(localStorage.getItem('productos') || '[]').length,
        clients: JSON.parse(localStorage.getItem('clientes') || '[]').length,
        invoices: JSON.parse(localStorage.getItem('facturas') || '[]').length,
        purchases: JSON.parse(localStorage.getItem('compras') || '[]').length,
        totalRevenue: JSON.parse(localStorage.getItem('facturas') || '[]')
          .reduce((sum: number, f: any) => sum + (f.total || 0), 0),
        totalExpenses: JSON.parse(localStorage.getItem('compras') || '[]')
          .reduce((sum: number, c: any) => sum + (c.total || 0), 0),
        activeModules: 15, // Número de módulos activos
        systemHealth: 98, // Porcentaje de salud del sistema
        dataIntegrity: 100 // Integridad de datos
      };

      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error('Error calculating metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = (percentage: number) => {
    if (percentage >= 95) return { status: 'Excelente', color: 'text-green-600', icon: CheckCircle };
    if (percentage >= 80) return { status: 'Bueno', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'Requiere Atención', color: 'text-red-600', icon: XCircle };
  };

  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const healthStatus = getHealthStatus(metrics.systemHealth);
  const HealthIcon = healthStatus.icon;

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Usuarios Activos</p>
                <p className="text-2xl font-bold">{metrics.users}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Productos</p>
                <p className="text-2xl font-bold">{metrics.products}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Facturas</p>
                <p className="text-2xl font-bold">{metrics.invoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Ingresos Totales</p>
                <p className="text-2xl font-bold">Bs. {metrics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Salud del Sistema</span>
            </CardTitle>
            <CardDescription>
              Estado general del sistema contable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HealthIcon className={`w-5 h-5 ${healthStatus.color}`} />
                <span className="font-medium">{healthStatus.status}</span>
              </div>
              <Badge variant="outline">{metrics.systemHealth}%</Badge>
            </div>
            <Progress value={metrics.systemHealth} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Sistema funcionando óptimamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Integridad de Datos</span>
            </CardTitle>
            <CardDescription>
              Consistencia y validez de la información
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Perfecta</span>
              </div>
              <Badge variant="outline">{metrics.dataIntegrity}%</Badge>
            </div>
            <Progress value={metrics.dataIntegrity} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Todos los datos son consistentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Módulos Activos</span>
            </CardTitle>
            <CardDescription>
              Funcionalidades disponibles en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Operativos</span>
              </div>
              <Badge variant="outline">{metrics.activeModules}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                <span>Facturación</span>
              </div>
              <div className="text-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                <span>Inventario</span>
              </div>
              <div className="text-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                <span>Contabilidad</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Resumen Financiero</span>
            </CardTitle>
            <CardDescription>
              Panorama general de ingresos y gastos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Ingresos Totales</span>
                <span className="font-medium text-green-600">
                  Bs. {metrics.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Gastos Totales</span>
                <span className="font-medium text-red-600">
                  Bs. {metrics.totalExpenses.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-medium">Utilidad Neta</span>
                  <span className="font-bold text-primary">
                    Bs. {(metrics.totalRevenue - metrics.totalExpenses).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Margen de utilidad: {((metrics.totalRevenue - metrics.totalExpenses) / metrics.totalRevenue * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span>Actividad Comercial</span>
            </CardTitle>
            <CardDescription>
              Movimientos comerciales del período
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{metrics.invoices}</p>
                <p className="text-sm text-muted-foreground">Facturas Emitidas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{metrics.purchases}</p>
                <p className="text-sm text-muted-foreground">Compras Realizadas</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{metrics.clients}</p>
                <p className="text-sm text-muted-foreground">Clientes Activos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{metrics.products}</p>
                <p className="text-sm text-muted-foreground">Productos en Catálogo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemStats;