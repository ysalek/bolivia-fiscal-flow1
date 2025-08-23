
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Zap,
  Database
} from 'lucide-react';

interface IntegrationMetricsProps {
  integrationId: string;
  integrationName: string;
}

const IntegrationMetrics: React.FC<IntegrationMetricsProps> = ({ 
  integrationId, 
  integrationName 
}) => {
  // Datos simulados - en producción vendrían de una API o localStorage
  const metrics = {
    totalRequests: 1547,
    successfulRequests: 1432,
    failedRequests: 115,
    avgResponseTime: 1.2,
    uptime: 99.2,
    lastSync: '2024-01-15 10:30:00',
    dataTransferred: '2.4 GB',
    webhooksExecuted: 234,
    errorsLastHour: 3,
    requestsLastHour: 47
  };

  const successRate = ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1);

  const getHealthStatus = () => {
    if (metrics.uptime >= 99) return { status: 'Excelente', color: 'text-green-600', icon: CheckCircle };
    if (metrics.uptime >= 95) return { status: 'Bueno', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'Crítico', color: 'text-red-600', icon: XCircle };
  };

  const health = getHealthStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Métricas de {integrationName}</h3>
        <Badge variant="outline" className={health.color}>
          <health.icon className="w-3 h-3 mr-1" />
          {health.status}
        </Badge>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo de Actividad</p>
                <p className="text-2xl font-bold">{metrics.uptime}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <Progress value={metrics.uptime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasa de Éxito</p>
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <Progress value={parseFloat(successRate)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo de Respuesta</p>
                <p className="text-2xl font-bold">{metrics.avgResponseTime}s</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Promedio última hora</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Datos Transferidos</p>
                <p className="text-2xl font-bold">{metrics.dataTransferred}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Database className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Solicitudes Totales</span>
              <Badge variant="outline">{metrics.totalRequests.toLocaleString()}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Solicitudes Exitosas</span>
              <Badge className="bg-green-100 text-green-800">
                {metrics.successfulRequests.toLocaleString()}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Solicitudes Fallidas</span>
              <Badge className="bg-red-100 text-red-800">
                {metrics.failedRequests.toLocaleString()}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Webhooks Ejecutados</span>
              <Badge variant="outline">{metrics.webhooksExecuted}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Estado Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Última Sincronización</span>
              <Badge variant="outline">{metrics.lastSync}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Solicitudes (Última Hora)</span>
              <Badge className="bg-blue-100 text-blue-800">
                {metrics.requestsLastHour}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Errores (Última Hora)</span>
              <Badge className={metrics.errorsLastHour > 5 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                {metrics.errorsLastHour}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Estado de Conexión</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Conectado
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Alertas y Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.errorsLastHour > 5 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Alto número de errores detectado
                  </p>
                  <p className="text-xs text-red-600">
                    Se han registrado {metrics.errorsLastHour} errores en la última hora. 
                    Revise la configuración de la integración.
                  </p>
                </div>
              </div>
            )}
            
            {metrics.avgResponseTime > 2 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Tiempo de respuesta elevado
                  </p>
                  <p className="text-xs text-yellow-600">
                    El tiempo de respuesta promedio es de {metrics.avgResponseTime}s. 
                    Considere optimizar la configuración.
                  </p>
                </div>
              </div>
            )}
            
            {metrics.uptime >= 99 && metrics.errorsLastHour <= 2 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Integración funcionando correctamente
                  </p>
                  <p className="text-xs text-green-600">
                    Todos los indicadores están dentro de los rangos óptimos.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationMetrics;
