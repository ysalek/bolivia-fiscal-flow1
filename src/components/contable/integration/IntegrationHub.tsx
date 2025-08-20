import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Zap, 
  Building2, 
  CreditCard, 
  Globe, 
  Database, 
  Cloud,
  Settings,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Key,
  Webhook,
  FileJson,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IntegrationHub = () => {
  const { toast } = useToast();
  const [activeIntegrations, setActiveIntegrations] = useState({
    sin: true,
    bcp: false,
    mercantil: false,
    stripe: false,
    quickbooks: false,
    excel: true
  });

  const integrations = [
    {
      id: 'sin',
      name: 'SIN Bolivia',
      description: 'Facturación electrónica y declaraciones tributarias',
      icon: Building2,
      category: 'Tributario',
      status: 'connected',
      lastSync: '2024-01-12 10:30',
      features: ['Facturación electrónica', 'Declaraciones IVA', 'Verificación NIT']
    },
    {
      id: 'bcp',
      name: 'Banco de Crédito BCP',
      description: 'Conciliación bancaria automática',
      icon: CreditCard,
      category: 'Bancario',
      status: 'available',
      lastSync: null,
      features: ['Estados de cuenta', 'Transferencias', 'Conciliación automática']
    },
    {
      id: 'mercantil',
      name: 'Banco Mercantil',
      description: 'Integración con servicios bancarios',
      icon: CreditCard,
      category: 'Bancario',
      status: 'available',
      lastSync: null,
      features: ['Consulta saldos', 'Movimientos', 'Pagos empresariales']
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Procesamiento de pagos internacionales',
      icon: Globe,
      category: 'Pagos',
      status: 'available',
      lastSync: null,
      features: ['Pagos online', 'Suscripciones', 'Reportes de ventas']
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Sincronización con QuickBooks Online',
      icon: Database,
      category: 'Contabilidad',
      status: 'available',
      lastSync: null,
      features: ['Sincronización de cuentas', 'Clientes', 'Facturas']
    },
    {
      id: 'excel',
      name: 'Microsoft Excel',
      description: 'Importación/exportación de datos',
      icon: FileJson,
      category: 'Datos',
      status: 'connected',
      lastSync: '2024-01-12 08:15',
      features: ['Importar datos', 'Exportar reportes', 'Plantillas personalizadas']
    }
  ];

  const webhooks = [
    {
      id: 1,
      name: 'Notificaciones de Facturación',
      url: 'https://api.contabolivia.com/webhooks/invoices',
      events: ['invoice.created', 'invoice.paid'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Alertas de Compliance',
      url: 'https://api.contabolivia.com/webhooks/compliance',
      events: ['tax.deadline', 'audit.required'],
      status: 'active'
    }
  ];

  const handleToggleIntegration = (integrationId: string) => {
    setActiveIntegrations(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId as keyof typeof prev]
    }));

    const integration = integrations.find(i => i.id === integrationId);
    toast({
      title: activeIntegrations[integrationId as keyof typeof activeIntegrations] 
        ? "Integración desactivada" 
        : "Integración activada",
      description: `${integration?.name} ${activeIntegrations[integrationId as keyof typeof activeIntegrations] ? 'desconectado' : 'conectado'} correctamente`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-50 text-green-700 border-green-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Centro de Integraciones</h2>
          <p className="text-muted-foreground">
            Conecta tu sistema con servicios externos y automatiza procesos
          </p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Configurar Nuevas
        </Button>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <div className="grid gap-6">
            {['Tributario', 'Bancario', 'Pagos', 'Contabilidad', 'Datos'].map(category => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {integrations
                    .filter(integration => integration.category === category)
                    .map((integration) => (
                      <Card key={integration.id} className="relative">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <integration.icon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{integration.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {integration.description}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={activeIntegrations[integration.id as keyof typeof activeIntegrations]}
                              onCheckedChange={() => handleToggleIntegration(integration.id)}
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(integration.status)}
                              <Badge className={getStatusColor(integration.status)}>
                                {integration.status === 'connected' ? 'Conectado' : 'Disponible'}
                              </Badge>
                              {integration.lastSync && (
                                <span className="text-xs text-muted-foreground">
                                  Sync: {integration.lastSync}
                                </span>
                              )}
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-2">Características:</p>
                              <div className="flex flex-wrap gap-1">
                                {integration.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                disabled={integration.status !== 'connected'}
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Sincronizar
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="w-3 h-3 mr-1" />
                                Config
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Configuración de Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{webhook.name}</h4>
                      <p className="text-sm text-muted-foreground">{webhook.url}</p>
                      <div className="flex gap-1 mt-2">
                        {webhook.events.map((event, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                        {webhook.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  <Webhook className="w-4 h-4 mr-2" />
                  Agregar Webhook
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Gestión de API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="sin-api-key">SIN API Key</Label>
                  <Input 
                    id="sin-api-key"
                    type="password" 
                    placeholder="•••••••••••••••••••••••••••••••••••••••"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="bcp-api-key">BCP API Key</Label>
                  <Input 
                    id="bcp-api-key"
                    type="password" 
                    placeholder="No configurado"
                    className="font-mono"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Shield className="w-5 h-5 text-blue-600" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Seguridad de API Keys</p>
                  <p>Todas las claves API se almacenan de forma cifrada y segura.</p>
                </div>
              </div>

              <Button>
                <Key className="w-4 h-4 mr-2" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Actividad de Integraciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    timestamp: '2024-01-12 10:30:15',
                    integration: 'SIN Bolivia',
                    action: 'Sincronización de facturas',
                    status: 'success',
                    details: '15 facturas procesadas'
                  },
                  {
                    timestamp: '2024-01-12 08:15:22',
                    integration: 'Microsoft Excel',
                    action: 'Exportación de reportes',
                    status: 'success',
                    details: 'Balance general exportado'
                  },
                  {
                    timestamp: '2024-01-11 16:45:10',
                    integration: 'BCP',
                    action: 'Intento de conexión',
                    status: 'error',
                    details: 'API Key inválida'
                  }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {log.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{log.integration} - {log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.timestamp} • {log.details}
                        </p>
                      </div>
                    </div>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
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

export default IntegrationHub;