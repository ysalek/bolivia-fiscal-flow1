import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import MetricCard from './MetricCard';
import EnhancedMetricCard from './EnhancedMetricCard';
import { 
  Database, 
  Activity, 
  Users, 
  ShoppingCart, 
  AlertTriangle,
  Info
} from 'lucide-react';

const AlertsDemo: React.FC = () => {
  // Datos de ejemplo para demostrar las alertas
  const demoMetrics = [
    {
      title: "Uso de Base de Datos",
      value: "85%",
      description: "Capacidad utilizada",
      icon: Database,
      trend: "up" as const,
      color: "text-primary",
      percentage: 85
    },
    {
      title: "Memoria del Sistema",
      value: "92%",
      description: "En uso",
      icon: Activity,
      trend: "up" as const,
      color: "text-destructive",
      percentage: 92
    },
    {
      title: "Usuarios Activos",
      value: "70%",
      description: "Conectados",
      icon: Users,
      trend: "neutral" as const,
      color: "text-success",
      percentage: 70
    },
    {
      title: "Procesamiento de Órdenes",
      value: "98%",
      description: "Capacidad",
      icon: ShoppingCart,
      trend: "up" as const,
      color: "text-destructive",
      percentage: 98
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Sistema de Alertas de Métricas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Sistema de Alertas Configurado:</strong>
              <br />
              • <Badge variant="outline" className="text-warning border-warning">Alerta Leve</Badge> cuando las métricas superan el <strong>80%</strong>
              <br />
              • <Badge variant="outline" className="text-destructive border-destructive">Estado Crítico</Badge> cuando las métricas superan el <strong>95%</strong>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            trend={metric.trend}
            color={metric.color}
            percentage={metric.percentage}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas Mejoradas con Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoMetrics.slice(0, 2).map((metric, index) => (
              <EnhancedMetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                description={metric.description}
                icon={metric.icon}
                trend={metric.trend}
                color={metric.color}
                percentage={metric.percentage}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Explicación del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg bg-success/5 border-success/20">
              <div className="text-success text-2xl font-bold">0% - 79%</div>
              <div className="text-sm text-muted-foreground">Funcionamiento Normal</div>
              <Badge variant="outline" className="mt-2 text-success border-success">
                Óptimo
              </Badge>
            </div>
            
            <div className="text-center p-4 border rounded-lg bg-warning/5 border-warning/20">
              <div className="text-warning text-2xl font-bold">80% - 94%</div>
              <div className="text-sm text-muted-foreground">Alerta Leve</div>
              <Badge variant="outline" className="mt-2 text-warning border-warning">
                Revisar
              </Badge>
            </div>
            
            <div className="text-center p-4 border rounded-lg bg-destructive/5 border-destructive/20">
              <div className="text-destructive text-2xl font-bold">95% - 100%</div>
              <div className="text-sm text-muted-foreground">Estado Crítico</div>
              <Badge variant="outline" className="mt-2 text-destructive border-destructive">
                Acción Inmediata
              </Badge>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-semibold mb-2">Características del Sistema:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Monitoreo automático cada 30 segundos</li>
              <li>• Notificaciones toast para alertas leves y críticas</li>
              <li>• Indicadores visuales en tiempo real</li>
              <li>• Colores y bordes adaptativos según el nivel de alerta</li>
              <li>• Mensajes descriptivos para cada tipo de alerta</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsDemo;