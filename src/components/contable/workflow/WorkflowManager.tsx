import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Calendar,
  Building2,
  Calculator,
  Receipt,
  Shield,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Send,
  Award,
  Activity,
  Zap,
  Target,
  BarChart3,
  Archive,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Timer,
  Flag,
  MapPin
} from 'lucide-react';

const WorkflowManager = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [workflows] = useState([
    // Workflows específicos bolivianos
    {
      id: 1,
      name: 'Declaración IVA Mensual SIN',
      description: 'Flujo completo para declaración IVA según normativa boliviana',
      category: 'Tributario',
      status: 'active',
      steps: 6,
      completedSteps: 4,
      trigger: 'monthly.day_10',
      triggerDescription: 'Cada 10 de mes para declarar el mes anterior',
      lastRun: '2024-01-12 14:30',
      nextRun: '2024-02-10 08:00',
      instances: 2,
      avgTime: '2.5 horas',
      successRate: 96,
      bolivianSpecific: true,
      priority: 'critical',
      responsable: 'Contador Principal',
      estimatedAmount: 15420.50
    },
    {
      id: 2,
      name: 'Aprobación Facturas Alto Valor',
      description: 'Proceso de autorización para facturas mayores a Bs. 10,000',
      category: 'Financiero',
      status: 'active',
      steps: 4,
      completedSteps: 2,
      trigger: 'invoice.amount > 10000',
      triggerDescription: 'Cuando se emite factura mayor a Bs. 10,000',
      lastRun: '2024-01-12 11:15',
      nextRun: 'Automático',
      instances: 5,
      avgTime: '45 minutos',
      successRate: 98,
      bolivianSpecific: false,
      priority: 'high',
      responsable: 'Gerente Financiero',
      estimatedAmount: 125000.00
    },
    {
      id: 3,
      name: 'Conciliación Bancaria BCP',
      description: 'Proceso automático de conciliación con Banco BCP Bolivia',
      category: 'Bancario',
      status: 'active',
      steps: 5,
      completedSteps: 5,
      trigger: 'daily.morning',
      triggerDescription: 'Todos los días a las 8:00 AM',
      lastRun: '2024-01-13 08:00',
      nextRun: '2024-01-14 08:00',
      instances: 1,
      avgTime: '15 minutos',
      successRate: 94,
      bolivianSpecific: true,
      priority: 'high',
      responsable: 'Auxiliar Contable',
      estimatedAmount: 0
    },
    {
      id: 4,
      name: 'Validación RC-IVA Proveedores',
      description: 'Verificación y aplicación de retenciones según DS 27310',
      category: 'Tributario',
      status: 'paused',
      steps: 3,
      completedSteps: 1,
      trigger: 'purchase.created',
      triggerDescription: 'Al registrar nueva compra con proveedor',
      lastRun: '2024-01-10 09:15',
      nextRun: 'Pausado',
      instances: 12,
      avgTime: '20 minutos',
      successRate: 91,
      bolivianSpecific: true,
      priority: 'medium',
      responsable: 'Asistente Contable',
      estimatedAmount: 8750.25
    },
    {
      id: 5,
      name: 'Planillas AFP - Envío Automático',
      description: 'Generación y envío de planillas AFP según DS 24469',
      category: 'RRHH',
      status: 'active',
      steps: 4,
      completedSteps: 3,
      trigger: 'monthly.day_8',
      triggerDescription: 'Cada 8 de mes para el mes anterior',
      lastRun: '2024-01-08 10:00',
      nextRun: '2024-02-08 10:00',
      instances: 1,
      avgTime: '1 hora',
      successRate: 99,
      bolivianSpecific: true,
      priority: 'critical',
      responsable: 'Jefe RRHH',
      estimatedAmount: 22450.00
    },
    {
      id: 6,
      name: 'Backup Contable Normativo',
      description: 'Respaldo según Art. 40 Código de Comercio Bolivia',
      category: 'Sistema',
      status: 'active',
      steps: 3,
      completedSteps: 3,
      trigger: 'daily.midnight',
      triggerDescription: 'Todos los días a medianoche',
      lastRun: '2024-01-13 00:00',
      nextRun: '2024-01-14 00:00',
      instances: 1,
      avgTime: '30 minutos',
      successRate: 100,
      bolivianSpecific: true,
      priority: 'high',
      responsable: 'Administrador Sistema',
      estimatedAmount: 0
    }
  ]);

  const [activeInstances] = useState([
    // Instancias específicas bolivianas
    {
      id: 'wf-sin-001',
      workflowName: 'Declaración IVA Mensual SIN',
      documentId: 'IVA-DIC-2023',
      documentType: 'Declaración IVA',
      amount: 15420.50,
      currentStep: 'Validación Crédito Fiscal',
      assignedTo: 'María García - Contador',
      assignedCI: '1234567 LP',
      status: 'pending',
      startedAt: '2024-01-10 08:00',
      deadline: '2024-01-15 23:59',
      priority: 'critical',
      comments: 3,
      bolivianContext: {
        nit: '1234567890',
        formNumber: 'F-200',
        taxPeriod: '12/2023',
        sinReference: 'SIN-REF-2024-001'
      },
      progress: 67
    },
    {
      id: 'wf-fact-002',
      workflowName: 'Aprobación Facturas Alto Valor',
      documentId: 'FACT-2024-0156',
      documentType: 'Factura Venta',
      amount: 25000.00,
      currentStep: 'Aprobación Gerencial',
      assignedTo: 'Carlos Mendez - Gerente',
      assignedCI: '9876543 SC',
      status: 'pending',
      startedAt: '2024-01-12 14:20',
      deadline: '2024-01-15 17:00',
      priority: 'high',
      comments: 1,
      bolivianContext: {
        nit: '9876543210',
        clientName: 'Empresa Industrial S.A.',
        taxAmount: 3250.00,
        sinStatus: 'Autorizada'
      },
      progress: 50
    },
    {
      id: 'wf-bcp-003',
      workflowName: 'Conciliación Bancaria BCP',
      documentId: 'CONC-BCP-ENE24',
      documentType: 'Conciliación',
      amount: 0,
      currentStep: 'Validación Automática',
      assignedTo: 'Sistema Automático',
      assignedCI: 'N/A',
      status: 'processing',
      startedAt: '2024-01-13 08:00',
      deadline: '2024-01-13 09:00',
      priority: 'high',
      comments: 0,
      bolivianContext: {
        bankAccount: '10000012345',
        bankName: 'Banco BCP Bolivia',
        transactions: 47,
        differences: 2
      },
      progress: 85
    },
    {
      id: 'wf-afp-004',
      workflowName: 'Planillas AFP - Envío Automático',
      documentId: 'AFP-PLAN-DIC23',
      documentType: 'Planilla AFP',
      amount: 22450.00,
      currentStep: 'Preparando Envío',
      assignedTo: 'Ana Rodríguez - RRHH',
      assignedCI: '5555666 LP',
      status: 'approved',
      startedAt: '2024-01-08 09:00',
      deadline: '2024-01-10 12:00',
      priority: 'critical',
      comments: 2,
      bolivianContext: {
        afpCode: 'FUTURO',
        employees: 15,
        totalAporte: 22450.00,
        reference: 'AFP-2024-001'
      },
      progress: 90
    },
    {
      id: 'wf-rciva-005',
      workflowName: 'Validación RC-IVA Proveedores',
      documentId: 'RC-COMP-789',
      documentType: 'Compra con RC-IVA',
      amount: 8750.25,
      currentStep: 'Cálculo Retención',
      assignedTo: 'Pedro López - Auxiliar',
      assignedCI: '7777888 SC',
      status: 'warning',
      startedAt: '2024-01-11 10:30',
      deadline: '2024-01-12 18:00',
      priority: 'medium',
      comments: 1,
      bolivianContext: {
        providerNIT: '1111222333',
        providerName: 'Distribuidora Tech S.A.',
        retentionRate: 13,
        retentionAmount: 1137.53
      },
      progress: 33
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

  const bolivianWorkflowStats = {
    tributarios: workflows.filter(w => w.category === 'Tributario').length,
    activos: workflows.filter(w => w.status === 'active').length,
    bolivianos: workflows.filter(w => w.bolivianSpecific).length,
    criticos: workflows.filter(w => w.priority === 'critical').length,
    avgSuccessRate: Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length),
    totalInstances: activeInstances.length,
    pendingCritical: activeInstances.filter(i => i.priority === 'critical' && i.status === 'pending').length
  };

  const handleProcessInstance = async (instanceId: string) => {
    setIsProcessing(instanceId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tributario': return Building2;
      case 'Financiero': return DollarSign;
      case 'Bancario': return Receipt;
      case 'RRHH': return Users;
      case 'Sistema': return Shield;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-700';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-gray-500 bg-gray-50 text-gray-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header mejorado con colores bolivianos */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">
              Gestión de Workflows Bolivia
            </h2>
            <p className="text-green-100 text-lg">
              Automatización de procesos contables y tributarios según normativa boliviana
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">{bolivianWorkflowStats.tributarios} Tributarios</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Flag className="w-4 h-4" />
                <span className="text-sm">{bolivianWorkflowStats.bolivianos} Específicos BO</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Activity className="w-4 h-4" />
                <span className="text-sm">{bolivianWorkflowStats.avgSuccessRate}% Éxito</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{bolivianWorkflowStats.activos}</div>
                <div className="text-xs text-green-100">Workflows Activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{bolivianWorkflowStats.totalInstances}</div>
                <div className="text-xs text-green-100">Instancias</div>
              </div>
            </div>
            {bolivianWorkflowStats.pendingCritical > 0 && (
              <Alert className="mt-4 bg-red-100 border-red-300">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  {bolivianWorkflowStats.pendingCritical} proceso(s) crítico(s) pendiente(s)
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      {/* Dashboard de métricas bolivianas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Workflows Tributarios</p>
                <p className="text-3xl font-bold text-green-600">{bolivianWorkflowStats.tributarios}</p>
                <p className="text-xs text-muted-foreground mt-1">SIN, AFP, RC-IVA</p>
              </div>
              <Building2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Instancias Activas</p>
                <p className="text-3xl font-bold text-blue-600">{bolivianWorkflowStats.totalInstances}</p>
                <p className="text-xs text-muted-foreground mt-1">en proceso</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Procesos Críticos</p>
                <p className="text-3xl font-bold text-red-600">{bolivianWorkflowStats.criticos}</p>
                <p className="text-xs text-muted-foreground mt-1">alta prioridad</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasa de Éxito</p>
                <p className="text-3xl font-bold text-purple-600">{bolivianWorkflowStats.avgSuccessRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">promedio</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Específicos BO</p>
                <p className="text-3xl font-bold text-yellow-600">{bolivianWorkflowStats.bolivianos}</p>
                <p className="text-xs text-muted-foreground mt-1">normativa local</p>
              </div>
              <Flag className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="instances" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="instances">Instancias Activas</TabsTrigger>
          <TabsTrigger value="workflows">Workflows Bolivia</TabsTrigger>
          <TabsTrigger value="tributarios">Procesos Tributarios</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="instances">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Instancias en Proceso - Bolivia</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-3 h-3 mr-1" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Actualizar
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {activeInstances.map((instance, index) => {
                const CategoryIcon = getCategoryIcon(workflows.find(w => w.name === instance.workflowName)?.category || '');
                
                return (
                  <Card key={instance.id} className={`relative transition-all duration-300 hover:shadow-xl animate-fade-in ${getPriorityColor(instance.priority)} border-l-4`}
                        style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            instance.status === 'approved' ? 'bg-green-100 text-green-600' :
                            instance.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                            instance.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            <CategoryIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {instance.documentId}
                              {instance.priority === 'critical' && (
                                <Badge variant="destructive" className="text-xs animate-pulse">
                                  🚨 CRÍTICO
                                </Badge>
                              )}
                              {workflows.find(w => w.name === instance.workflowName)?.bolivianSpecific && (
                                <span className="text-xs bg-gradient-to-r from-green-500 to-red-500 text-white px-2 py-1 rounded-full">
                                  🇧🇴 BO
                                </span>
                              )}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mb-2">
                              {instance.workflowName}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={
                                instance.status === 'approved' ? 'bg-green-100 text-green-700' :
                                instance.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                instance.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-orange-100 text-orange-700'
                              }>
                                {getStatusIcon(instance.status)}
                                <span className="ml-1 capitalize">{
                                  instance.status === 'approved' ? 'Aprobado' :
                                  instance.status === 'processing' ? 'Procesando' :
                                  instance.status === 'warning' ? 'Advertencia' : 'Pendiente'
                                }</span>
                              </Badge>
                              <Badge variant="outline">
                                <Calendar className="w-3 h-3 mr-1" />
                                Vence: {new Date(instance.deadline).toLocaleDateString('es-BO')}
                              </Badge>
                              {instance.amount > 0 && (
                                <Badge variant="outline">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Bs. {instance.amount.toLocaleString()}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          {instance.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handleProcessInstance(instance.id)}
                              disabled={isProcessing !== null}
                            >
                              {isProcessing === instance.id ? (
                                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <Send className="w-3 h-3 mr-1" />
                              )}
                              {isProcessing === instance.id ? 'Procesando...' : 'Procesar'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{instance.assignedTo}</span>
                            </div>
                            {instance.assignedCI !== 'N/A' && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">CI: {instance.assignedCI}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <GitBranch className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{instance.currentStep}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progreso:</span>
                              <span className="font-medium">{instance.progress}%</span>
                            </div>
                            <Progress value={instance.progress} className="h-2" />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Timer className="w-3 h-3" />
                              <span>Iniciado: {new Date(instance.startedAt).toLocaleDateString('es-BO')}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {instance.comments > 0 && (
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                <Badge variant="outline" className="text-xs">
                                  {instance.comments} comentario{instance.comments > 1 ? 's' : ''}
                                </Badge>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              <strong>Contexto BO:</strong>
                              {instance.bolivianContext && (
                                <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                                  {Object.entries(instance.bolivianContext).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="capitalize">{key}:</span>
                                      <span className="font-mono">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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

        <TabsContent value="tributarios">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                🇧🇴 Procesos Tributarios Específicos de Bolivia
              </h3>
              <p className="text-muted-foreground mb-4">
                Workflows diseñados según normativa tributaria boliviana: SIN, AFP, Ministerio de Trabajo
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{workflows.filter(w => w.category === 'Tributario' && w.status === 'active').length}</div>
                  <div className="text-sm text-green-700">Activos</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{workflows.filter(w => w.category === 'Tributario' && w.priority === 'critical').length}</div>
                  <div className="text-sm text-red-700">Críticos</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    Bs. {workflows.filter(w => w.category === 'Tributario').reduce((sum, w) => sum + w.estimatedAmount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700">Monto Estimado</div>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4">
              {workflows.filter(w => w.category === 'Tributario').map((workflow, index) => {
                const CategoryIcon = getCategoryIcon(workflow.category);
                
                return (
                  <Card key={workflow.id} className={`animate-fade-in hover:shadow-lg transition-all duration-300 ${
                    workflow.priority === 'critical' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500'
                  }`} style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-xl ${
                            workflow.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            <CategoryIcon className="w-8 h-8" />
                          </div>
                          <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                              {workflow.name}
                              {workflow.priority === 'critical' && (
                                <Badge variant="destructive" className="animate-pulse">
                                  🚨 CRÍTICO
                                </Badge>
                              )}
                              <span className="text-xs bg-gradient-to-r from-green-500 to-red-500 text-white px-2 py-1 rounded-full">
                                🇧🇴 Bolivia
                              </span>
                            </CardTitle>
                            <p className="text-muted-foreground mb-2">{workflow.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline">
                                <Calculator className="w-3 h-3 mr-1" />
                                {workflow.triggerDescription}
                              </Badge>
                              <Badge className={workflow.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                {workflow.status === 'active' ? 'Activo' : 'Pausado'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="text-lg font-bold text-blue-600">{workflow.successRate}%</div>
                              <div className="text-xs text-blue-700">Éxito</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className="text-lg font-bold text-purple-600">{workflow.instances}</div>
                              <div className="text-xs text-purple-700">Instancias</div>
                            </div>
                          </div>
                          <Button size="sm" variant={workflow.status === 'active' ? 'default' : 'outline'}>
                            {workflow.status === 'active' ? (
                              <Pause className="w-3 h-3 mr-1" />
                            ) : (
                              <Play className="w-3 h-3 mr-1" />
                            )}
                            {workflow.status === 'active' ? 'Pausar' : 'Activar'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Progreso Actual</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>{workflow.completedSteps}/{workflow.steps} pasos</span>
                              <span className="font-medium">{Math.round((workflow.completedSteps / workflow.steps) * 100)}%</span>
                            </div>
                            <Progress value={(workflow.completedSteps / workflow.steps) * 100} className="h-1.5" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Responsable</p>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{workflow.responsable}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio</p>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{workflow.avgTime}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Próxima Ejecución</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{workflow.nextRun}</span>
                          </div>
                        </div>
                      </div>
                      
                      {workflow.estimatedAmount > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">
                              Monto estimado mensual: Bs. {workflow.estimatedAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Workflows Activos</p>
                      <p className="text-2xl font-bold text-green-600">{bolivianWorkflowStats.activos}</p>
                      <p className="text-xs text-green-700 mt-1">de {workflows.length} totales</p>
                    </div>
                    <GitBranch className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Instancias Pendientes</p>
                      <p className="text-2xl font-bold text-orange-600">{activeInstances.filter(i => i.status === 'pending').length}</p>
                      <p className="text-xs text-orange-700 mt-1">requieren atención</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio</p>
                      <p className="text-2xl font-bold text-blue-600">1.2h</p>
                      <p className="text-xs text-blue-700 mt-1">por workflow</p>
                    </div>
                    <Timer className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tasa de Éxito</p>
                      <p className="text-2xl font-bold text-purple-600">{bolivianWorkflowStats.avgSuccessRate}%</p>
                      <p className="text-xs text-purple-700 mt-1">promedio sistema</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default WorkflowManager;