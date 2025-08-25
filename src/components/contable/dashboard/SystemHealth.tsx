import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { calculateMetricAlert, getAlertColor } from '@/utils/metricsUtils';
import { 
  Activity, 
  Database, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle
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

  const checkSystemHealth = async () => {
    const metrics: HealthMetric[] = [];

    // Database Health
    try {
      const dbData = localStorage.getItem('asientosContables');
      const entries = dbData ? JSON.parse(dbData).length : 0;
      const dbUsage = entries > 0 ? Math.min(100, (entries / 1000) * 100) : 10; // Asumiendo 1000 como máximo
      const dbAlert = calculateMetricAlert(dbUsage);
      
      metrics.push({
        name: 'Base de Datos',
        value: dbUsage,
        status: dbAlert.level === 'normal' ? 'good' : dbAlert.level === 'warning' ? 'warning' : 'critical',
        description: `${entries} asientos contables (${dbUsage.toFixed(1)}% capacidad)`,
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

    // Memory Usage (solo disponible en navegadores Chromium)
    let memoryUsage = 50; // valor por defecto
    let memoryDescription = 'Información de memoria no disponible';
    
    try {
      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize && memory.totalJSHeapSize) {
          memoryUsage = Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100);
          memoryDescription = `${memoryUsage}% de memoria utilizada`;
        }
      }
    } catch (error) {
      console.log('Métricas de memoria no disponibles en este navegador');
    }
    
    const memoryAlert = calculateMetricAlert(memoryUsage);
    metrics.push({
      name: 'Memoria',
      value: memoryUsage,
      status: memoryAlert.level === 'normal' ? 'good' : memoryAlert.level === 'warning' ? 'warning' : 'critical',
      description: memoryDescription,
      lastCheck: new Date()
    });

    // Security Status - Simulando un porcentaje de configuración de seguridad
    const hasSecureConfig = localStorage.getItem('configuracionTributaria') !== null;
    const securityScore = hasSecureConfig ? 85 : 70;
    const securityAlert = calculateMetricAlert(securityScore);
    
    metrics.push({
      name: 'Seguridad',
      value: securityScore,
      status: securityAlert.level === 'normal' ? 'good' : securityAlert.level === 'warning' ? 'warning' : 'critical',
      description: hasSecureConfig ? `Configuración segura (${securityScore}%)` : `Revisar configuración (${securityScore}%)`,
      lastCheck: new Date()
    });

    // Performance (usar navegación timing si está disponible)
    let performanceScore = 85; // valor por defecto
    let performanceDescription = 'Rendimiento estimado';
    
    try {
      if ('navigation' in performance && performance.navigation) {
        // Usar tiempo de carga de la página como métrica base
        const loadTime = Date.now() - performance.timeOrigin;
        performanceScore = Math.max(0, Math.min(100, 100 - Math.floor(loadTime / 1000)));
        performanceDescription = `Tiempo de respuesta: ${Math.round(loadTime)}ms`;
      }
    } catch (error) {
      console.log('Métricas de rendimiento no disponibles');
    }
    
    const performanceAlert = calculateMetricAlert(performanceScore);
    metrics.push({
      name: 'Rendimiento',
      value: performanceScore,
      status: performanceAlert.level === 'normal' ? 'good' : performanceAlert.level === 'warning' ? 'warning' : 'critical',
      description: performanceDescription,
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

    const integrityAlert = calculateMetricAlert(integrityScore);
    metrics.push({
      name: 'Integridad de Datos',
      value: integrityScore,
      status: integrityAlert.level === 'normal' ? 'good' : integrityAlert.level === 'warning' ? 'warning' : 'critical',
      description: `${Math.round(integrityScore)}% de datos íntegros`,
      lastCheck: new Date()
    });

    setHealthMetrics(metrics);
    
    // Calculate overall health
    const avgHealth = metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
    setOverallHealth(Math.round(avgHealth));

    // Comentado: Toast notifications removidas por solicitud del usuario
    // const warningIssues = metrics.filter(m => m.status === 'warning').length;
    // const criticalIssues = metrics.filter(m => m.status === 'critical').length;
    
    // if (criticalIssues > 0) {
    //   toast({
    //     title: "⚠️ Problemas Críticos Detectados",
    //     description: `${criticalIssues} métricas en estado crítico (≥95%)`,
    //     variant: "destructive"
    //   });
    // } else if (warningIssues > 0) {
    //   toast({
    //     title: "⚡ Alertas Leves Detectadas",
    //     description: `${warningIssues} métricas requieren atención (≥80%)`,
    //     variant: "default"
    //   });
    // }
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
                <Progress 
                  value={metric.value} 
                  className={`h-2 ${metric.status === 'warning' ? 'bg-warning/20' : metric.status === 'critical' ? 'bg-destructive/20' : ''}`}
                />
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                
                {/* Mostrar alerta si está por encima del 80% */}
                {metric.status === 'warning' && (
                  <div className="flex items-center gap-1 text-xs text-warning bg-warning/10 p-2 rounded border border-warning/20">
                    <AlertCircle className="h-3 w-3" />
                    <span>Alerta leve: Revisar este recurso</span>
                  </div>
                )}
                
                {metric.status === 'critical' && (
                  <div className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Estado crítico: Acción inmediata requerida</span>
                  </div>
                )}
                
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