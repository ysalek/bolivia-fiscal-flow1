import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  Database, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface HealthMetric {
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
  lastCheck: Date;
}

export const SystemHealth: React.FC = () => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [overallHealth, setOverallHealth] = useState<number>(100);
  const { toast } = useToast();

  const checkSystemHealth = async () => {
    const metrics: HealthMetric[] = [];

    // Database Health
    try {
      const dbData = localStorage.getItem('asientosContables');
      const entries = dbData ? JSON.parse(dbData).length : 0;
      metrics.push({
        name: 'Base de Datos',
        value: entries > 0 ? 100 : 50,
        status: entries > 0 ? 'good' : 'warning',
        description: `${entries} asientos contables registrados`,
        lastCheck: new Date()
      });
    } catch {
      metrics.push({
        name: 'Base de Datos',
        value: 0,
        status: 'critical',
        description: 'Error accediendo a datos locales',
        lastCheck: new Date()
      });
    }

    // Memory Usage
    const memoryUsage = (performance as any).memory ? 
      Math.round(((performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize) * 100) : 75;
    
    metrics.push({
      name: 'Memoria',
      value: 100 - memoryUsage,
      status: memoryUsage < 70 ? 'good' : memoryUsage < 85 ? 'warning' : 'critical',
      description: `${memoryUsage}% de memoria utilizada`,
      lastCheck: new Date()
    });

    // Security Status
    const hasSecureConfig = localStorage.getItem('configuracionTributaria') !== null;
    metrics.push({
      name: 'Seguridad',
      value: hasSecureConfig ? 85 : 70,
      status: hasSecureConfig ? 'good' : 'warning',
      description: hasSecureConfig ? 'Configuración segura' : 'Revisar configuración de seguridad',
      lastCheck: new Date()
    });

    // Performance
    const performanceScore = Math.max(0, 100 - (performance.now() / 100));
    metrics.push({
      name: 'Rendimiento',
      value: Math.min(100, performanceScore),
      status: performanceScore > 80 ? 'good' : performanceScore > 60 ? 'warning' : 'critical',
      description: `Tiempo de respuesta: ${Math.round(performance.now())}ms`,
      lastCheck: new Date()
    });

    // Data Integrity
    let integrityScore = 100;
    try {
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
      let unbalanced = 0;
      asientos.forEach((asiento: any) => {
        const debe = asiento.cuentas?.reduce((sum: number, cuenta: any) => sum + (cuenta.debe || 0), 0) || 0;
        const haber = asiento.cuentas?.reduce((sum: number, cuenta: any) => sum + (cuenta.haber || 0), 0) || 0;
        if (Math.abs(debe - haber) > 0.01) unbalanced++;
      });
      integrityScore = asientos.length > 0 ? Math.max(0, 100 - (unbalanced / asientos.length * 100)) : 100;
    } catch {
      integrityScore = 0;
    }

    metrics.push({
      name: 'Integridad de Datos',
      value: integrityScore,
      status: integrityScore > 95 ? 'good' : integrityScore > 80 ? 'warning' : 'critical',
      description: `${Math.round(integrityScore)}% de datos íntegros`,
      lastCheck: new Date()
    });

    setHealthMetrics(metrics);
    
    // Calculate overall health
    const avgHealth = metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
    setOverallHealth(Math.round(avgHealth));

    // Show toast if there are critical issues
    const criticalIssues = metrics.filter(m => m.status === 'critical').length;
    if (criticalIssues > 0) {
      toast({
        title: "Problemas Críticos Detectados",
        description: `${criticalIssues} métricas en estado crítico`,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getOverallStatus = () => {
    if (overallHealth >= 90) return { text: 'Excelente', color: 'text-success', icon: CheckCircle };
    if (overallHealth >= 75) return { text: 'Bueno', color: 'text-success', icon: CheckCircle };
    if (overallHealth >= 60) return { text: 'Regular', color: 'text-warning', icon: AlertTriangle };
    return { text: 'Crítico', color: 'text-destructive', icon: AlertTriangle };
  };

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const overallStatus = getOverallStatus();
  const StatusIcon = overallStatus.icon;

  return (
    <div className="space-y-6">
      {/* Overall Health Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Estado General del Sistema
            </span>
            <Badge variant="outline" className={overallStatus.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {overallStatus.text}
            </Badge>
          </CardTitle>
          <CardDescription>
            Monitoreo en tiempo real del rendimiento y salud del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Salud General</span>
              <span className={overallStatus.color}>{overallHealth}%</span>
            </div>
            <Progress value={overallHealth} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{metric.name}</span>
                {getStatusIcon(metric.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Estado</span>
                  <span className={getStatusColor(metric.status)}>
                    {Math.round(metric.value)}%
                  </span>
                </div>
                <Progress value={metric.value} className="h-1" />
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Última verificación: {metric.lastCheck.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Acciones de Optimización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-medium">Optimizar Base de Datos</h4>
                <p className="text-sm text-muted-foreground">
                  Limpiar datos obsoletos y optimizar índices
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Shield className="h-8 w-8 text-success" />
              <div>
                <h4 className="font-medium">Verificar Seguridad</h4>
                <p className="text-sm text-muted-foreground">
                  Revisar configuraciones de seguridad
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Activity className="h-8 w-8 text-warning" />
              <div>
                <h4 className="font-medium">Análisis de Rendimiento</h4>
                <p className="text-sm text-muted-foreground">
                  Identificar cuellos de botella
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealth;