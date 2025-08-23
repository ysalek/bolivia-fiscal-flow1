
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  TestTube, 
  Activity, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'PUT' | 'GET';
  events: string[];
  active: boolean;
  description: string;
  headers: Record<string, string>;
  retryConfig: {
    enabled: boolean;
    maxRetries: number;
    backoffMultiplier: number;
  };
  createdAt: string;
  lastExecuted?: string;
  status: 'active' | 'inactive' | 'error';
  successCount: number;
  errorCount: number;
}

interface WebhookManagerProps {
  integrationId: string;
}

const WebhookManager: React.FC<WebhookManagerProps> = ({ integrationId }) => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  const availableEvents = [
    'invoice.created',
    'invoice.updated',
    'invoice.paid',
    'invoice.cancelled',
    'payment.received',
    'payment.failed',
    'product.created',
    'product.updated',
    'inventory.changed',
    'user.login',
    'system.error'
  ];

  useEffect(() => {
    loadWebhooks();
  }, [integrationId]);

  const loadWebhooks = () => {
    const stored = localStorage.getItem(`webhooks_${integrationId}`);
    if (stored) {
      setWebhooks(JSON.parse(stored));
    }
  };

  const saveWebhooks = (webhooks: WebhookConfig[]) => {
    localStorage.setItem(`webhooks_${integrationId}`, JSON.stringify(webhooks));
    setWebhooks(webhooks);
  };

  const createWebhook = (webhookData: Omit<WebhookConfig, 'id' | 'createdAt' | 'successCount' | 'errorCount'>) => {
    const newWebhook: WebhookConfig = {
      ...webhookData,
      id: `webhook_${Date.now()}`,
      createdAt: new Date().toISOString(),
      successCount: 0,
      errorCount: 0
    };

    const updatedWebhooks = [...webhooks, newWebhook];
    saveWebhooks(updatedWebhooks);
    
    toast({
      title: "✅ Webhook creado",
      description: `El webhook "${newWebhook.name}" se ha creado correctamente.`,
    });
  };

  const updateWebhook = (id: string, updates: Partial<WebhookConfig>) => {
    const updatedWebhooks = webhooks.map(webhook =>
      webhook.id === id ? { ...webhook, ...updates } : webhook
    );
    saveWebhooks(updatedWebhooks);
    
    toast({
      title: "✅ Webhook actualizado",
      description: "Los cambios se han guardado correctamente.",
    });
  };

  const deleteWebhook = (id: string) => {
    const updatedWebhooks = webhooks.filter(webhook => webhook.id !== id);
    saveWebhooks(updatedWebhooks);
    
    toast({
      title: "🗑️ Webhook eliminado",
      description: "El webhook se ha eliminado correctamente.",
    });
  };

  const testWebhook = async (webhook: WebhookConfig) => {
    setTestingWebhook(webhook.id);
    
    try {
      // Simular llamada al webhook
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar estadísticas
      updateWebhook(webhook.id, {
        lastExecuted: new Date().toISOString(),
        successCount: webhook.successCount + 1,
        status: 'active'
      });
      
      toast({
        title: "✅ Webhook probado",
        description: `El webhook "${webhook.name}" respondió correctamente.`,
      });
    } catch (error) {
      updateWebhook(webhook.id, {
        errorCount: webhook.errorCount + 1,
        status: 'error'
      });
      
      toast({
        title: "❌ Error en webhook",
        description: `El webhook "${webhook.name}" falló en la prueba.`,
        variant: "destructive"
      });
    }
    
    setTestingWebhook(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Gestión de Webhooks
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure endpoints para recibir notificaciones de eventos
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Webhook</DialogTitle>
            </DialogHeader>
            <WebhookForm
              onSave={(data) => {
                createWebhook(data);
                setIsCreateDialogOpen(false);
              }}
              availableEvents={availableEvents}
            />
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Webhook className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Sin webhooks configurados</h3>
            <p className="text-muted-foreground mb-4">
              Cree su primer webhook para recibir notificaciones automáticas
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Webhook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Webhooks Configurados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Eventos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Estadísticas</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(webhook.status)}
                        <div>
                          <div className="font-medium">{webhook.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {webhook.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        <Badge variant="outline" className="mr-1">
                          {webhook.method}
                        </Badge>
                        {webhook.url}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.slice(0, 2).map((event) => (
                          <Badge key={event} variant="secondary" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                        {webhook.events.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{webhook.events.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(webhook.status)}>
                        {webhook.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-green-600">✓ {webhook.successCount}</div>
                        <div className="text-red-600">✗ {webhook.errorCount}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testWebhook(webhook)}
                          disabled={testingWebhook === webhook.id}
                        >
                          <TestTube className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingWebhook(webhook)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteWebhook(webhook.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {editingWebhook && (
        <Dialog open={!!editingWebhook} onOpenChange={() => setEditingWebhook(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Webhook</DialogTitle>
            </DialogHeader>
            <WebhookForm
              initialData={editingWebhook}
              onSave={(data) => {
                updateWebhook(editingWebhook.id, data);
                setEditingWebhook(null);
              }}
              availableEvents={availableEvents}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface WebhookFormProps {
  initialData?: Partial<WebhookConfig>;
  onSave: (data: Omit<WebhookConfig, 'id' | 'createdAt' | 'successCount' | 'errorCount'>) => void;
  availableEvents: string[];
}

const WebhookForm: React.FC<WebhookFormProps> = ({ initialData, onSave, availableEvents }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    url: initialData?.url || '',
    method: initialData?.method || 'POST' as const,
    events: initialData?.events || [],
    active: initialData?.active !== false,
    description: initialData?.description || '',
    headers: initialData?.headers || {},
    retryConfig: initialData?.retryConfig || {
      enabled: true,
      maxRetries: 3,
      backoffMultiplier: 2
    },
    status: initialData?.status || 'inactive' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del Webhook</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej: Notificaciones de facturación"
            required
          />
        </div>
        <div>
          <Label htmlFor="method">Método HTTP</Label>
          <Select value={formData.method} onValueChange={(value: 'POST' | 'PUT' | 'GET') => setFormData(prev => ({ ...prev, method: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="GET">GET</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="url">URL del Endpoint</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://tudominio.com/webhook"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descripción del propósito del webhook"
        />
      </div>

      <div>
        <Label>Eventos a Escuchar</Label>
        <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-3">
          {availableEvents.map((event) => (
            <div key={event} className="flex items-center space-x-2">
              <Switch
                id={event}
                checked={formData.events.includes(event)}
                onCheckedChange={() => toggleEvent(event)}
              />
              <Label htmlFor={event} className="text-sm">{event}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
        />
        <Label htmlFor="active">Webhook activo</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">
          Guardar Webhook
        </Button>
      </div>
    </form>
  );
};

export default WebhookManager;
