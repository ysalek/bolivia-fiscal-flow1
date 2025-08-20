import { useState, useEffect } from 'react';
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
  Building,
  DollarSign,
  BarChart3,
  AlertCircle,
  Award,
  Activity,
  Zap,
  Target,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

const ComplianceModule = () => {
  const [complianceScore, setComplianceScore] = useState(92);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

  const regulations = [
    {
      id: 'sin-facturacion',
      name: 'Facturación Electrónica SIN',
      description: 'Sistema de Facturación en Línea - Normativa RND 10-0028-07',
      status: 'compliant',
      progress: 100,
      nextAction: 'Renovar certificado digital',
      deadline: '2024-12-31',
      risk: 'low',
      amount: 0,
      lastUpdate: '2024-01-12',
      complianceItems: ['Certificado digital vigente', 'Conexión API activa', 'Numeración correlativa']
    },
    {
      id: 'iva-declaration',
      name: 'Declaración IVA Mensual',
      description: 'Impuesto al Valor Agregado - Ley 843',
      status: 'pending',
      progress: 75,
      nextAction: 'Declaración Enero 2024',
      deadline: '2024-01-15',
      risk: 'high',
      amount: 15420.50,
      lastUpdate: '2024-01-10',
      complianceItems: ['Libro de Ventas actualizado', 'Conciliación crédito fiscal', 'Formulario 200 pendiente']
    },
    {
      id: 'it-declaration',
      name: 'Impuesto a las Transacciones',
      description: 'IT sobre ingresos brutos - Art. 75 Ley 843',
      status: 'compliant',
      progress: 100,
      nextAction: 'Declaración Febrero 2024',
      deadline: '2024-02-15',
      risk: 'low',
      amount: 4520.30,
      lastUpdate: '2024-01-12',
      complianceItems: ['Formulario 400 presentado', 'Pago realizado', 'Comprobante archivado']
    },
    {
      id: 'iue-annual',
      name: 'IUE Anual 2023',
      description: 'Impuesto a las Utilidades de las Empresas',
      status: 'warning',
      progress: 60,
      nextAction: 'Completar Balance Fiscal',
      deadline: '2024-03-31',
      risk: 'high',
      amount: 125000.00,
      lastUpdate: '2024-01-08',
      complianceItems: ['Balance general auditado', 'Declaración jurada DD-1', 'Conciliación tributaria pendiente']
    },
    {
      id: 'rc-iva',
      name: 'Retención IVA por Compras',
      description: 'RC-IVA según DS 27310',
      status: 'compliant',
      progress: 100,
      nextAction: 'Presentar planillas enero',
      deadline: '2024-01-20',
      risk: 'low',
      amount: 2850.75,
      lastUpdate: '2024-01-12',
      complianceItems: ['Planillas generadas', 'Comprobantes emitidos', 'Libros actualizados']
    },
    {
      id: 'planillas-sueldos',
      name: 'Planillas de Sueldos AFP',
      description: 'Aportes laborales DS 24469',
      status: 'pending',
      progress: 80,
      nextAction: 'Enviar planilla diciembre',
      deadline: '2024-01-10',
      risk: 'medium',
      amount: 8750.00,
      lastUpdate: '2024-01-09',
      complianceItems: ['Planilla generada', 'Aportes calculados', 'Envío pendiente']
    }
  ];

  const bolivianTaxCalendar = [
    { obligation: 'IVA Mensual', deadline: '15 de cada mes', nextDate: '2024-01-15', status: 'pending' },
    { obligation: 'IT Mensual', deadline: '15 de cada mes', nextDate: '2024-02-15', status: 'ok' },
    { obligation: 'RC-IVA', deadline: '20 de cada mes', nextDate: '2024-01-20', status: 'ok' },
    { obligation: 'Planillas AFP', deadline: '10 de cada mes', nextDate: '2024-01-10', status: 'urgent' },
    { obligation: 'IUE Anual', deadline: '31 de marzo', nextDate: '2024-03-31', status: 'warning' },
    { obligation: 'Papeles de Trabajo', deadline: '31 de marzo', nextDate: '2024-03-31', status: 'warning' }
  ];

  const auditTrail = [
    {
      id: 1,
      action: 'Actualización Plan de Cuentas NIF 2025',
      user: 'Sistema',
      timestamp: '2024-01-12 10:30',
      status: 'success',
      module: 'Plan de Cuentas',
      details: 'Implementación automática según Resolución SIN'
    },
    {
      id: 2,
      action: 'Generación Backup Automático',
      user: 'Sistema',
      timestamp: '2024-01-12 02:00',
      status: 'success',
      module: 'Sistema',
      details: 'Backup completo de base de datos'
    },
    {
      id: 3,
      action: 'Validación Declaración IVA Dic 2023',
      user: 'María García - Contador',
      timestamp: '2024-01-11 16:45',
      status: 'pending',
      module: 'Declaraciones',
      details: 'Revisión de conciliación crédito fiscal'
    },
    {
      id: 4,
      action: 'Certificado Digital SIN Renovado',
      user: 'Admin',
      timestamp: '2024-01-10 14:20',
      status: 'success',
      module: 'Facturación',
      details: 'Certificado válido hasta diciembre 2024'
    },
    {
      id: 5,
      action: 'Análisis Riesgo Tributario',
      user: 'Sistema IA',
      timestamp: '2024-01-10 08:00',
      status: 'warning',
      module: 'Cumplimiento',
      details: 'Detectadas 3 observaciones menores'
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

  useEffect(() => {
    // Simulación de carga de datos
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  const handleRefreshCompliance = () => {
    setIsLoading(true);
    setTimeout(() => {
      setComplianceScore(Math.floor(Math.random() * 20) + 80); // 80-100%
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header mejorado con gradiente boliviano */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">
              Cumplimiento Normativo Bolivia
            </h2>
            <p className="text-green-100 text-lg">
              Sistema Integral de Monitoreo Tributario - SIN, Ministerio de Trabajo y Regulaciones NIF
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Building className="w-4 h-4 mr-2" />
                Bolivia - Normativa 2024
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Activity className="w-4 h-4 mr-2" />
                Tiempo Real
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8 text-yellow-300" />
              <span className="text-4xl font-bold">{complianceScore}%</span>
            </div>
            <p className="text-green-100">Score de Cumplimiento</p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={handleRefreshCompliance}
              disabled={isLoading}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard de métricas bolivianas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Obligaciones al Día</p>
                <p className="text-3xl font-bold text-green-600">
                  {regulations.filter(r => r.status === 'compliant').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">de {regulations.length} totales</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes Críticas</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {regulations.filter(r => r.risk === 'high').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">requieren atención</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monto Total Obligaciones</p>
                <p className="text-3xl font-bold text-blue-600">
                  Bs. {regulations.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">enero 2024</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Próximos Vencimientos</p>
                <p className="text-3xl font-bold text-purple-600">
                  {bolivianTaxCalendar.filter(t => t.status === 'pending' || t.status === 'urgent').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">en 15 días</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="regulations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="regulations">Obligaciones</TabsTrigger>
          <TabsTrigger value="calendar">Calendario Fiscal</TabsTrigger>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
          <TabsTrigger value="reports">Reportes SIN</TabsTrigger>
          <TabsTrigger value="alerts">Alertas IA</TabsTrigger>
        </TabsList>

        <TabsContent value="regulations">
          <div className="grid gap-4">
            {regulations.map((reg, index) => (
              <Card key={reg.id} className={`hover:shadow-lg transition-all duration-300 animate-fade-in`} 
                    style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        reg.status === 'compliant' ? 'bg-green-100 text-green-600' :
                        reg.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {getStatusIcon(reg.status)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{reg.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">{reg.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getStatusColor(reg.status)}>
                            {reg.status === 'compliant' ? 'Cumplida' :
                             reg.status === 'warning' ? 'Atención' : 'Pendiente'}
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            Vence: {reg.deadline}
                          </Badge>
                          {reg.amount > 0 && (
                            <Badge variant="outline">
                              <DollarSign className="w-3 h-3 mr-1" />
                              Bs. {reg.amount.toLocaleString()}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            Riesgo: {reg.risk === 'high' ? 'Alto' : reg.risk === 'medium' ? 'Medio' : 'Bajo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" disabled={reg.status === 'compliant'}>
                        <Target className="w-3 h-3 mr-1" />
                        Procesar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progreso de Cumplimiento:</span>
                      <span className="font-medium">{reg.progress}%</span>
                    </div>
                    <Progress value={reg.progress} className="h-2" />
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-2">Items de Cumplimiento:</p>
                      <div className="space-y-1">
                        {reg.complianceItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <div className={`w-2 h-2 rounded-full ${
                              idx < Math.floor(reg.progress / 33) ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                            <span className={idx < Math.floor(reg.progress / 33) ? 'text-green-700' : 'text-gray-600'}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Próxima acción:</span>
                      <span className="font-medium text-blue-600">{reg.nextAction}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Última actualización:</span>
                      <span>{reg.lastUpdate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Calendario Fiscal Boliviano 2024
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {bolivianTaxCalendar.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    item.status === 'urgent' ? 'border-red-200 bg-red-50' :
                    item.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                    item.status === 'warning' ? 'border-orange-200 bg-orange-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'urgent' ? 'bg-red-500 animate-pulse' :
                        item.status === 'pending' ? 'bg-yellow-500' :
                        item.status === 'warning' ? 'bg-orange-500' :
                        'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium">{item.obligation}</p>
                        <p className="text-sm text-muted-foreground">{item.deadline}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.nextDate}</p>
                      <Badge variant={
                        item.status === 'urgent' ? 'destructive' :
                        item.status === 'pending' ? 'default' :
                        item.status === 'warning' ? 'secondary' :
                        'outline'
                      } className="text-xs">
                        {item.status === 'urgent' ? 'URGENTE' :
                         item.status === 'pending' ? 'PENDIENTE' :
                         item.status === 'warning' ? 'PRÓXIMO' : 'AL DÍA'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Registro de Auditoría del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrail.map((entry, index) => (
                  <div key={entry.id} className={`flex items-start justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md animate-fade-in`}
                       style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        entry.status === 'success' ? 'bg-green-100 text-green-600' : 
                        entry.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                        entry.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {entry.status === 'success' ? <CheckCircle className="w-5 h-5" /> :
                         entry.status === 'pending' ? <Clock className="w-5 h-5" /> :
                         entry.status === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                         <AlertCircle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-lg">{entry.action}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {entry.details}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {entry.user}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {entry.timestamp}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {entry.module}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge variant={
                      entry.status === 'success' ? 'default' : 
                      entry.status === 'warning' ? 'secondary' : 
                      'outline'
                    }>
                      {entry.status === 'success' ? 'Completado' :
                       entry.status === 'pending' ? 'Pendiente' :
                       entry.status === 'warning' ? 'Advertencia' : 'Error'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Reportes Oficiales SIN
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 transition-colors">
                  <Download className="w-4 h-4 mr-2 text-blue-600" />
                  Libro de Ventas IVA - Enero 2024
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-green-50 transition-colors">
                  <BarChart3 className="w-4 h-4 mr-2 text-green-600" />
                  Declaración IT Mensual
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-purple-50 transition-colors">
                  <Building className="w-4 h-4 mr-2 text-purple-600" />
                  Estado Tributario Empresarial
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-orange-50 transition-colors">
                  <Shield className="w-4 h-4 mr-2 text-orange-600" />
                  Análisis de Riesgos Tributarios
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-red-50 transition-colors">
                  <FileCheck className="w-4 h-4 mr-2 text-red-600" />
                  Reporte Papeles de Trabajo
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Alertas Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert className="border-red-200 bg-red-50 animate-pulse">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>URGENTE:</strong> Declaración IVA Enero vence en 3 días (15/01/2024)
                      <br />
                      <span className="text-sm">Monto estimado: Bs. 15,420.50</span>
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Próximo:</strong> Planillas AFP vencen el 10/01/2024
                      <br />
                      <span className="text-sm">Aportes pendientes: Bs. 8,750.00</span>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-blue-200 bg-blue-50">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Recordatorio:</strong> Certificado digital SIN se renueva en diciembre 2024
                      <br />
                      <span className="text-sm">Sistema funcionando correctamente</span>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-purple-200 bg-purple-50">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-800">
                      <strong>Análisis IA:</strong> Cumplimiento del 92% - Excelente gestión tributaria
                      <br />
                      <span className="text-sm">Sugerencia: Automatizar recordatorios de vencimientos</span>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Sistema de Inteligencia Artificial Tributaria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">15</div>
                    <div className="text-sm text-green-700">Alertas Resueltas</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <div className="text-sm text-yellow-700">Alertas Activas</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">98%</div>
                    <div className="text-sm text-blue-700">Precisión IA</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50 animate-fade-in">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="flex items-start justify-between">
                        <div>
                          <strong>🚨 CRÍTICO:</strong> Inconsistencia detectada en conciliación crédito fiscal IVA
                          <br />
                          <span className="text-sm mt-1 block">
                            IA detectó diferencia de Bs. 1,245.30 entre libro de compras y formulario 200.
                            <br />
                            <strong>Recomendación:</strong> Revisar facturas del 08-12/01/2024
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="ml-4">
                          <Eye className="w-3 h-3 mr-1" />
                          Revisar
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-yellow-200 bg-yellow-50 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <div className="flex items-start justify-between">
                        <div>
                          <strong>⚠️ ATENCIÓN:</strong> Patrón inusual en retenciones RC-IVA detectado
                          <br />
                          <span className="text-sm mt-1 block">
                            Incremento del 35% en retenciones vs. mes anterior. Verificar aplicación de tasas.
                            <br />
                            <strong>Sugerencia:</strong> Validar proveedores con retención del 13%
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="ml-4">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Analizar
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-blue-200 bg-blue-50 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <div className="flex items-start justify-between">
                        <div>
                          <strong>✅ OPTIMIZACIÓN:</strong> IA sugiere mejora en proceso de facturación
                          <br />
                          <span className="text-sm mt-1 block">
                            Automatizar numeración correlativa y validación NIT podría reducir errores en 40%.
                            <br />
                            <strong>Beneficio estimado:</strong> Ahorro de 2 horas semanales
                          </span>
                        </div>
                        <Button size="sm" className="ml-4">
                          <Zap className="w-3 h-3 mr-1" />
                          Implementar
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-purple-200 bg-purple-50 animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-800">
                      <div className="flex items-start justify-between">
                        <div>
                          <strong>📊 TENDENCIA:</strong> Análisis predictivo de obligaciones tributarias
                          <br />
                          <span className="text-sm mt-1 block">
                            Basado en histórico, se estima una carga tributaria de Bs. 185,450 para Q1 2024.
                            <br />
                            <strong>Recomendación:</strong> Planificar flujo de caja con 15 días de anticipación
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="ml-4">
                          <Target className="w-3 h-3 mr-1" />
                          Planificar
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Sistema de Aprendizaje Continuo</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    La IA del sistema aprende continuamente de las regulaciones bolivianas y patrones de tu empresa 
                    para brindarte alertas más precisas y recomendaciones personalizadas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceModule;