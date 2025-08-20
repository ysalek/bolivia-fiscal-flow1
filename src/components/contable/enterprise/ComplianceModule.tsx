import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Scale,
  FileText,
  Calendar,
  TrendingUp,
  Building
} from 'lucide-react';

const ComplianceModule = () => {
  const [complianceScore, setComplianceScore] = useState(92);

  const regulations = [
    {
      id: 'sin-facturacion',
      name: 'Facturación Electrónica SIN',
      status: 'compliant',
      progress: 100,
      nextAction: 'Renovar certificado',
      deadline: '2024-12-31',
      risk: 'low'
    },
    {
      id: 'iva-declaration',
      name: 'Declaraciones IVA',
      status: 'pending',
      progress: 75,
      nextAction: 'Declaración mensual pendiente',
      deadline: '2024-01-15',
      risk: 'medium'
    },
    {
      id: 'it-declaration',
      name: 'Impuesto a las Transacciones',
      status: 'compliant',
      progress: 100,
      nextAction: 'Próxima declaración',
      deadline: '2024-02-15',
      risk: 'low'
    },
    {
      id: 'iue-annual',
      name: 'IUE Anual',
      status: 'warning',
      progress: 60,
      nextAction: 'Preparar documentación',
      deadline: '2024-03-31',
      risk: 'high'
    }
  ];

  const auditTrail = [
    {
      id: 1,
      action: 'Actualización Plan de Cuentas 2025',
      user: 'Sistema',
      timestamp: '2024-01-12 10:30',
      status: 'success'
    },
    {
      id: 2,
      action: 'Generación Backup Automático',
      user: 'Sistema',
      timestamp: '2024-01-12 02:00',
      status: 'success'
    },
    {
      id: 3,
      action: 'Revisión Declaración IVA',
      user: 'Admin',
      timestamp: '2024-01-11 16:45',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'warning': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cumplimiento Normativo</h2>
          <p className="text-muted-foreground">
            Monitoreo integral de obligaciones tributarias y regulatorias
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Shield className="w-4 h-4 mr-2" />
          Score: {complianceScore}%
        </Badge>
      </div>

      {/* Score Overview */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Estado General de Cumplimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Puntuación Global</span>
              <span className="text-2xl font-bold text-primary">{complianceScore}%</span>
            </div>
            <Progress value={complianceScore} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Crítico</span>
              <span>Excelente</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="regulations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="regulations">Regulaciones</TabsTrigger>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="regulations">
          <div className="grid gap-4">
            {regulations.map((reg) => (
              <Card key={reg.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(reg.status)}
                      <div>
                        <CardTitle className="text-lg">{reg.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(reg.status)}>
                            {reg.status}
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            {reg.deadline}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progreso:</span>
                      <span className="font-medium">{reg.progress}%</span>
                    </div>
                    <Progress value={reg.progress} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Próxima acción:</span>
                      <span className="font-medium">{reg.nextAction}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Registro de Auditoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrail.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        entry.status === 'success' ? 'bg-green-500' : 
                        entry.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{entry.action}</p>
                        <p className="text-sm text-muted-foreground">
                          Por {entry.user} • {entry.timestamp}
                        </p>
                      </div>
                    </div>
                    <Badge variant={entry.status === 'success' ? 'default' : 'secondary'}>
                      {entry.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Reportes Regulatorios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Reporte de Cumplimiento Mensual
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="w-4 h-4 mr-2" />
                  Estado Tributario Empresarial
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Análisis de Riesgos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Vencimientos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Declaración IVA vence en 3 días
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Renovación certificado SIN en 30 días
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Alertas Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Atención:</strong> Se detectaron inconsistencias en la declaración IVA del mes anterior. 
                    Se recomienda revisión antes del próximo vencimiento.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-blue-200 bg-blue-50">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Actualización:</strong> Nuevas regulaciones SIN implementadas correctamente. 
                    Sistema actualizado a la versión más reciente.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceModule;