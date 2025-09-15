import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Clock, 
  XCircle, 
  Bell,
  Calendar,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ComplianceAlert {
  id: string;
  type: 'vencimiento' | 'normativa' | 'configuracion' | 'critico';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  deadline?: string;
  actions: string[];
  resolved: boolean;
  created_at: string;
}

const ComplianceAlerts = () => {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    generateComplianceAlerts();
  }, []);

  const generateComplianceAlerts = async () => {
    try {
      setLoading(true);
      
      const alertsData: ComplianceAlert[] = [];
      const today = new Date();

      // Verificar configuración tributaria
      const { data: config } = await supabase
        .from('configuracion_tributaria')
        .select('*')
        .limit(1)
        .single();

      if (!config) {
        alertsData.push({
          id: 'config-missing',
          type: 'configuracion',
          priority: 'critical',
          title: 'Configuración Tributaria Faltante',
          description: 'No se ha configurado la información tributaria básica de la empresa',
          actions: [
            'Configurar NIT de la empresa',
            'Establecer código de actividad económica',
            'Definir régimen tributario aplicable'
          ],
          resolved: false,
          created_at: today.toISOString()
        });
      }

      // Verificar normativas recientes
      const { data: normativas } = await supabase
        .from('normativas_2025')
        .select('*')
        .eq('estado', 'vigente')
        .gte('fecha_emision', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (normativas && normativas.length > 0) {
        alertsData.push({
          id: 'new-normativas',
          type: 'normativa',
          priority: 'high',
          title: `${normativas.length} Nueva(s) Normativa(s) Emitida(s)`,
          description: 'Se han emitido nuevas normativas tributarias en los últimos 30 días que requieren revisión',
          actions: [
            'Revisar nuevas normativas en el módulo de Cumplimiento',
            'Evaluar impacto en operaciones actuales',
            'Actualizar procedimientos si es necesario'
          ],
          resolved: false,
          created_at: today.toISOString()
        });
      }

      // Verificar vencimientos próximos (ejemplo: declaraciones)
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(20); // Fecha límite típica

      alertsData.push({
        id: 'monthly-declarations',
        type: 'vencimiento',
        priority: 'high',
        title: 'Declaraciones Tributarias Próximas a Vencer',
        description: `Las declaraciones de IVA e IT del mes ${today.toLocaleDateString('es-BO', { month: 'long' })} vencen el 20 del próximo mes`,
        deadline: nextMonth.toISOString(),
        actions: [
          'Preparar Formulario 200 (IVA)',
          'Preparar Formulario 401 (IT)',
          'Verificar retenciones RC-IVA y RC-IT',
          'Realizar pago antes del vencimiento'
        ],
        resolved: false,
        created_at: today.toISOString()
      });

      // Verificar compliance records vencidos
      const { data: overdue } = await supabase
        .from('cumplimiento_normativo_2025')
        .select('*')
        .eq('estado', 'pendiente')
        .lt('fecha_vigencia', today.toISOString());

      if (overdue && overdue.length > 0) {
        alertsData.push({
          id: 'overdue-compliance',
          type: 'critico',
          priority: 'critical',
          title: `${overdue.length} Normativa(s) Vencida(s) Sin Cumplir`,
          description: 'Hay normativas vencidas que no han sido marcadas como cumplidas, lo que puede resultar en sanciones',
          actions: [
            'Revisar estado de cumplimiento en el módulo de Seguimiento',
            'Actualizar estado de implementación',
            'Documentar acciones tomadas para cumplimiento',
            'Considerar facilidades de pago si corresponde'
          ],
          resolved: false,
          created_at: today.toISOString()
        });
      }

      setAlerts(alertsData);
    } catch (error: any) {
      console.error('Error generating compliance alerts:', error);
      toast({
        title: "Error al generar alertas",
        description: "No se pudieron generar las alertas de cumplimiento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    
    toast({
      title: "Alerta resuelta",
      description: "La alerta ha sido marcada como resuelta",
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'critical': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[priority] || colors['medium'];
  };

  const getPriorityIcon = (priority: string) => {
    const icons: Record<string, any> = {
      'low': CheckCircle,
      'medium': Clock,
      'high': AlertTriangle,
      'critical': XCircle
    };
    const Icon = icons[priority] || AlertTriangle;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'vencimiento': 'Vencimiento',
      'normativa': 'Nueva Normativa',
      'configuracion': 'Configuración',
      'critico': 'Crítico'
    };
    return labels[type] || type;
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.priority === 'critical');

  if (loading) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
        <p className="text-muted-foreground">Generando alertas de cumplimiento...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-red-800">Alertas Críticas</p>
              <p className="text-2xl font-bold text-red-900">{criticalAlerts.length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-orange-800">Alertas Activas</p>
              <p className="text-2xl font-bold text-orange-900">{activeAlerts.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-green-800">Resueltas</p>
              <p className="text-2xl font-bold text-green-900">{alerts.filter(a => a.resolved).length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alertas Activas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Alertas de Cumplimiento Normativo
              </CardTitle>
              <CardDescription>
                Manténgase informado sobre vencimientos y cambios normativos importantes
              </CardDescription>
            </div>
            <Button variant="outline" onClick={generateComplianceAlerts}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Actualizar Alertas
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">¡Todo al día!</h3>
              <p className="text-green-600">No hay alertas de cumplimiento pendientes</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <Alert key={alert.id} className={`${getPriorityColor(alert.priority)} border-l-4`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityIcon(alert.priority)}
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(alert.type)}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(alert.priority)}`}
                      >
                        {alert.priority.toUpperCase()}
                      </Badge>
                      {alert.deadline && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          Vence: {new Date(alert.deadline).toLocaleDateString('es-BO')}
                        </div>
                      )}
                    </div>
                    
                    <AlertTitle className="text-base font-semibold">
                      {alert.title}
                    </AlertTitle>
                    
                    <AlertDescription className="mt-2">
                      {alert.description}
                    </AlertDescription>

                    <div className="mt-4">
                      <p className="font-medium text-sm mb-2">Acciones recomendadas:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {alert.actions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolver
                    </Button>
                    {alert.type === 'normativa' && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href="/?view=cumplimiento-normativo" className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Ver Normativas
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceAlerts;