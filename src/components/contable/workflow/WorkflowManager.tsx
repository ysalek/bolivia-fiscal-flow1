import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  GitBranch, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  FileText,
  DollarSign,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Calendar
} from 'lucide-react';

const WorkflowManager = () => {
  const [workflows] = useState([
    {
      id: 1,
      name: 'Aprobación de Facturas > $10,000',
      description: 'Flujo para aprobar facturas de alto valor',
      status: 'active',
      steps: 4,
      completedSteps: 2,
      trigger: 'invoice.amount > 10000',
      lastRun: '2024-01-12 14:30',
      instances: 3
    },
    {
      id: 2,
      name: 'Conciliación Bancaria Mensual',
      description: 'Proceso automático de conciliación',
      status: 'active',
      steps: 6,
      completedSteps: 6,
      trigger: 'monthly.first_day',
      lastRun: '2024-01-01 00:00',
      instances: 1
    },
    {
      id: 3,
      name: 'Validación de Gastos',
      description: 'Aprobación de gastos operativos',
      status: 'paused',
      steps: 3,
      completedSteps: 1,
      trigger: 'expense.created',
      lastRun: '2024-01-10 09:15',
      instances: 7
    }
  ]);

  const [activeInstances] = useState([
    {
      id: 'wf-001',
      workflowName: 'Aprobación de Facturas > $10,000',
      documentId: 'FAC-2024-001',
      documentType: 'Factura',
      amount: 15000,
      currentStep: 'Revisión Gerencial',
      assignedTo: 'María García',
      status: 'pending',
      startedAt: '2024-01-12 10:00',
      deadline: '2024-01-15 17:00',
      comments: 2
    },
    {
      id: 'wf-002',
      workflowName: 'Validación de Gastos',
      documentId: 'GAS-2024-045',
      documentType: 'Gasto',
      amount: 2500,
      currentStep: 'Validación Contable',
      assignedTo: 'Carlos Mendez',
      status: 'pending',
      startedAt: '2024-01-12 08:30',
      deadline: '2024-01-13 12:00',
      comments: 1
    },
    {
      id: 'wf-003',
      workflowName: 'Aprobación de Facturas > $10,000',
      documentId: 'FAC-2024-002',
      documentType: 'Factura',
      amount: 25000,
      currentStep: 'Aprobación Final',
      assignedTo: 'Ana Rodríguez',
      status: 'approved',
      startedAt: '2024-01-11 14:00',
      deadline: '2024-01-14 17:00',
      comments: 0
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Workflows</h2>
          <p className="text-muted-foreground">
            Automatiza y controla los procesos de aprobación empresarial
          </p>
        </div>
        <Button>
          <GitBranch className="w-4 h-4 mr-2" />
          Crear Workflow
        </Button>
      </div>

      <Tabs defaultValue="instances" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="instances">Instancias Activas</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="instances">
          <div className="space-y-4">
            <div className="grid gap-4">
              {activeInstances.map((instance) => (
                <Card key={instance.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{instance.documentId}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {instance.workflowName}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(instance.status)}>
                        {getStatusIcon(instance.status)}
                        <span className="ml-1 capitalize">{instance.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Bs. {instance.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Vence: {new Date(instance.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{instance.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{instance.currentStep}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {instance.comments > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {instance.comments}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Ver Detalles
                          </Button>
                          {instance.status === 'pending' && (
                            <Button size="sm">
                              Procesar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GitBranch className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {workflow.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(workflow.status)}>
                        {getStatusIcon(workflow.status)}
                        <span className="ml-1 capitalize">{workflow.status}</span>
                      </Badge>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Ejecutar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progreso:</span>
                        <span className="font-medium">
                          {workflow.completedSteps}/{workflow.steps} pasos
                        </span>
                      </div>
                      <Progress 
                        value={(workflow.completedSteps / workflow.steps) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Trigger:</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {workflow.trigger}
                      </code>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Instancias activas:</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{workflow.instances}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Última ejecución: {workflow.lastRun}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Workflows Activos</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <GitBranch className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Instancias Pendientes</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio</p>
                    <p className="text-2xl font-bold">2.5h</p>
                  </div>
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tasa de Aprobación</p>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    timestamp: '2024-01-12 14:30',
                    action: 'Workflow ejecutado',
                    workflow: 'Aprobación de Facturas > $10,000',
                    user: 'Sistema',
                    status: 'success'
                  },
                  {
                    timestamp: '2024-01-12 12:15',
                    action: 'Instancia aprobada',
                    workflow: 'Validación de Gastos',
                    user: 'Carlos Mendez',
                    status: 'success'
                  },
                  {
                    timestamp: '2024-01-12 10:00',
                    action: 'Nueva instancia creada',
                    workflow: 'Aprobación de Facturas > $10,000',
                    user: 'Sistema',
                    status: 'info'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.workflow} • Por {activity.user}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowManager;