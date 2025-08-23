import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Globe, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  method: 'POST' | 'PUT' | 'PATCH';
  headers: Record<string, string>;
  active: boolean;
  lastTriggered?: Date;
  status: 'active' | 'inactive' | 'error';
  retryCount: number;
}

interface WebhookManagerProps {
  integrationId: string;
}

const WebhookManager: React.FC<WebhookManagerProps> = ({ integrationId }) => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    method: 'POST' as 'POST' | 'PUT' | 'PATCH',
    headers: {} as Record<string, string>,
    active: true
  });

  const availableEvents = [
    'invoice.created',
    'invoice.updated',
    'invoice.paid',
    'customer.created',
    'payment.received',
    'integration.connected',
    'integration.disconnected',
    'error.occurred'
  ];

  const sampleWebhooks: Webhook[] = [
    {
      id: '1',
      name: 'Notificaciones de Facturación',
      url: 'https://api.empresa.com/webhooks/invoices',
      events: ['invoice.created', 'invoice.paid'],
      method: 'POST',
      headers: { 'Authorization': 'Bearer ***', 'Content-Type': 'application/json' },
      active: true,
      lastTriggered: new Date(Date.now() - 1000 * 60 * 30),
      status: 'active',
      retryCount: 0
    },
    {
      id: '2',
      name: 'Sincronización de Clientes',
      url: 'https://crm.empresa.com/api/customers',
      events: ['customer.created'],
      method: 'POST',
      headers: { 'X-API-Key': '***' },
      active: true,
      lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'active',
      retryCount: 0
    },
    {
      id: '3',
      name: 'Alertas de Errores',
      url: 'https://monitoring.empresa.com/alerts',
      events: ['error.occurred'],
      method: 'POST',
      headers: {},
      active: false,
      status: 'inactive',
      retryCount: 3
    }
  ];

  useEffect(() => {
    setWebhooks(sampleWebhooks);
  }, [integrationId]);

  const handleSaveWebhook = () => {
    if (selectedWebhook) {
      setWebhooks(prev => prev.map(w => 
        w.id === selectedWebhook.id 
          ? { ...selectedWebhook, ...formData }
          : w
      ));
    } else {
      const newWebhook: Webhook = {
        id: Date.now().toString(),
        ...formData,
        lastTriggered: undefined,
        status: formData.active ? 'active' : 'inactive',
        retryCount: 0
      };
      setWebhooks(prev => [...prev, newWebhook]);
    }
    
    setIsDialogOpen(false);
    setSelectedWebhook(null);
    setFormData({
      name: '',
      url: '',
      events: [],
      method: 'POST' as 'POST' | 'PUT' | 'PATCH',
      headers: {},
      active: true
    });
  };

  const handleEditWebhook = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      method: webhook.method,
      headers: webhook.headers,
      active: webhook.active
    });
    setIsDialogOpen(true);
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => 
      w.id === id 
        ? { ...w, active: !w.active, status: !w.active ? 'active' : 'inactive' }
        : w
    ));
  };

  const testWebhook = async (webhook: Webhook) => {
    console.log('Testing webhook:', webhook.name);
    setWebhooks(prev => prev.map(w => 
      w.id === webhook.id 
        ? { ...w, lastTriggered: new Date(), status: 'active' }
        : w
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Webhooks</h3>
          <p className="text-muted-foreground text-sm">
            Configura notificaciones automáticas para eventos del sistema
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedWebhook(null);
              setFormData({
                name: '',
                url: '',
                events: [],
                method: 'POST' as 'POST' | 'PUT' | 'PATCH',
                headers: {},
                active: true
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Webhook
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedWebhook ? 'Editar Webhook' : 'Nuevo Webhook'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre descriptivo del webhook"
                />
              </div>
              
              <div>
                <Label htmlFor="url">URL del Endpoint</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://api.ejemplo.com/webhook"
                />
              </div>
              
              <div>
                <Label htmlFor="method">Método HTTP</Label>
                <Select 
                  value={formData.method} 
                  onValueChange={(value: 'POST' | 'PUT' | 'PATCH') => 
                    setFormData(prev => ({ ...prev, method: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Eventos</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableEvents.map(event => (
                    <label key={event} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ 
                              ...prev, 
                              events: [...prev.events, event] 
                            }));
                          } else {
                            setFormData(prev => ({ 
                              ...prev, 
                              events: prev.events.filter(e => e !== event) 
                            }));
                          }
                        }}
                      />
                      <span>{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveWebhook}>
                  {selectedWebhook ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Lista de Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs de Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {webhooks.map(webhook => (
            <Card key={webhook.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(webhook.status)}
                    <div>
                      <CardTitle className="text-base">{webhook.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        {webhook.url}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={webhook.active ? "default" : "secondary"}>
                      {webhook.active ? "Activo" : "Inactivo"}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWebhook(webhook)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleWebhook(webhook.id)}
                    >
                      {webhook.active ? "Desactivar" : "Activar"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testWebhook(webhook)}
                    >
                      Test
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Método:</span>
                    <p className="font-medium">{webhook.method}</p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Eventos:</span>
                    <p className="font-medium">{webhook.events.length}</p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Último disparo:</span>
                    <p className="font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {webhook.lastTriggered 
                        ? webhook.lastTriggered.toLocaleDateString()
                        : 'Nunca'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Reintentos:</span>
                    <p className="font-medium">{webhook.retryCount}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-muted-foreground text-xs">Eventos suscritos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {webhook.events.map(event => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {webhooks.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Sin webhooks configurados</h3>
                <p className="text-muted-foreground">
                  Crea tu primer webhook para recibir notificaciones automáticas
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Logs de Webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { time: '2025-01-23 18:15:32', webhook: 'Notificaciones de Facturación', event: 'invoice.created', status: 'success' },
                  { time: '2025-01-23 17:45:12', webhook: 'Sincronización de Clientes', event: 'customer.created', status: 'success' },
                  { time: '2025-01-23 16:30:45', webhook: 'Alertas de Errores', event: 'error.occurred', status: 'failed' },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                    <div className="flex items-center space-x-3">
                      {log.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="font-medium">{log.webhook}</span>
                      <Badge variant="outline">{log.event}</Badge>
                    </div>
                    <span className="text-muted-foreground">{log.time}</span>
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

export default WebhookManager;