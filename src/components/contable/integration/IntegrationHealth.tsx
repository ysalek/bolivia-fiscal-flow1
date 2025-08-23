import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastCheck: Date;
}

interface IntegrationHealth {
  id: string;
  name: string;
  overallStatus: 'healthy' | 'warning' | 'critical' | 'offline';
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastHealthCheck: Date;
  metrics: HealthMetric[];
}

const IntegrationHealthMonitor: React.FC = () => {
  const [healthData, setHealthData] = useState<IntegrationHealth[]>([
    {
      id: 'sin',
      name: 'SIN/SIAT',
      overallStatus: 'healthy',
      uptime: 99.2,
      responseTime: 850,
      errorRate: 0.5,
      lastHealthCheck: new Date(),
      metrics: [
        {
          id: 'response_time',
          name: 'Tiempo de Respuesta',
          value: 850,
          threshold: 1000,
          status: 'healthy',
          trend: 'stable',
          lastCheck: new Date()
        },
        {
          id: 'success_rate',
          name: 'Tasa de Éxito',
          value: 99.5,
          threshold: 95,
          status: 'healthy',
          trend: 'up',
          lastCheck: new Date()
        },
        {
          id: 'cpu_usage',
          name: 'Uso de CPU',
          value: 45,
          threshold: 80,
          status: 'healthy',
          trend: 'stable',
          lastCheck: new Date()
        }
      ]
    },
    {
      id: 'bcp',
      name: 'Banco BCP',
      overallStatus: 'warning',
      uptime: 98.5,
      responseTime: 1200,
      errorRate: 2.1,
      lastHealthCheck: new Date(),
      metrics: [
        {
          id: 'response_time',
          name: 'Tiempo de Respuesta',
          value: 1200,
          threshold: 1000,
          status: 'warning',
          trend: 'up',
          lastCheck: new Date()
        },
        {
          id: 'success_rate',
          name: 'Tasa de Éxito',
          value: 97.9,
          threshold: 95,
          status: 'healthy',
          trend: 'down',
          lastCheck: new Date()
        }
      ]
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      overallStatus: 'critical',
      uptime: 85.2,
      responseTime: 2500,
      errorRate: 8.3,
      lastHealthCheck: new Date(),
      metrics: [
        {
          id: 'response_time',
          name: 'Tiempo de Respuesta',
          value: 2500,
          threshold: 1000,
          status: 'critical',
          trend: 'up',
          lastCheck: new Date()
        },
        {
          id: 'success_rate',
          name: 'Tasa de Éxito',
          value: 91.7,
          threshold: 95,
          status: 'critical',
          trend: 'down',
          lastCheck: new Date()
        }
      ]
    }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      level: 'warning',
      message: 'BCP API response time above threshold (1200ms > 1000ms)',
      timestamp: new Date(),
      integration: 'bcp'
    },
    {
      id: '2',
      level: 'critical',
      message: 'WhatsApp API error rate too high (8.3% > 5%)',
      timestamp: new Date(),
      integration: 'whatsapp'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshHealthData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setHealthData(prev => prev.map(integration => ({
        ...integration,
        lastHealthCheck: new Date(),
        responseTime: Math.random() * 2000 + 500,
        errorRate: Math.random() * 10
      })));
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'offline':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <Heart className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Monitoreo de Salud</h3>
          <p className="text-sm text-muted-foreground">
            Estado en tiempo real de todas las integraciones
          </p>
        </div>
        
        <Button 
          onClick={refreshHealthData}
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Alertas Activas</h4>
          {alerts.map((alert) => (
            <Alert key={alert.id} className={alert.level === 'critical' ? 'border-red-500' : 'border-yellow-500'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <span>{alert.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Health Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthData.map((integration) => (
          <Card key={integration.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(integration.overallStatus)}`}></div>
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.overallStatus)}
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                </div>
                <Badge 
                  variant={integration.overallStatus === 'healthy' ? 'default' : 
                          integration.overallStatus === 'warning' ? 'secondary' : 'destructive'}
                >
                  {integration.overallStatus}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Última verificación: {integration.lastHealthCheck.toLocaleTimeString()}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Uptime */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-sm">{integration.uptime.toFixed(1)}%</span>
                </div>
                <Progress value={integration.uptime} className="h-2" />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Resp. Time</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{integration.responseTime}ms</span>
                    {getTrendIcon('stable')}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Error Rate</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{integration.errorRate.toFixed(1)}%</span>
                    {getTrendIcon(integration.errorRate > 5 ? 'up' : 'stable')}
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Métricas Detalladas</h5>
                {integration.metrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(metric.status)}`}></div>
                      <span className="text-sm">{metric.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono">
                        {metric.name.includes('Tiempo') ? `${metric.value}ms` : 
                         metric.name.includes('Tasa') || metric.name.includes('CPU') ? `${metric.value}%` : 
                         metric.value}
                      </span>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Zap className="w-3 h-3 mr-1" />
                  Diagnóstico
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Heart className="w-3 h-3 mr-1" />
                  Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {healthData.filter(i => i.overallStatus === 'healthy').length}
              </div>
              <div className="text-sm text-muted-foreground">Saludables</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {healthData.filter(i => i.overallStatus === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Advertencias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {healthData.filter(i => i.overallStatus === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Críticas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(healthData.reduce((acc, i) => acc + i.uptime, 0) / healthData.length).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Uptime Promedio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationHealthMonitor;