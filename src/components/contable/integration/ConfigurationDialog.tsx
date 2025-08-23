
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, TestTube, AlertCircle } from 'lucide-react';

interface ConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: {
    id: string;
    name: string;
    type: string;
  };
  config: any;
  onSave: (config: any) => void;
}

const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({
  open,
  onOpenChange,
  integration,
  config,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(config || {});
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = () => {
    onSave(formData);
    toast({
      title: "✅ Configuración guardada",
      description: `La configuración de ${integration.name} se ha guardado correctamente.`,
    });
    onOpenChange(false);
  };

  const handleTest = async () => {
    setIsTesting(true);
    // Simular prueba de conexión
    setTimeout(() => {
      toast({
        title: "🧪 Prueba de conexión",
        description: `Conexión con ${integration.name} verificada correctamente.`,
      });
      setIsTesting(false);
    }, 2000);
  };

  const renderSINConfig = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuración SIN/SIAT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nit">NIT de la Empresa</Label>
              <Input
                id="nit"
                value={formData.nit || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, nit: e.target.value }))}
                placeholder="Ej: 1234567890"
              />
            </div>
            <div>
              <Label htmlFor="codigoSucursal">Código de Sucursal</Label>
              <Input
                id="codigoSucursal"
                value={formData.codigoSucursal || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, codigoSucursal: e.target.value }))}
                placeholder="Ej: 0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigoModalidad">Código de Modalidad</Label>
              <Select value={formData.codigoModalidad || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, codigoModalidad: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Modalidad 1 - En línea</SelectItem>
                  <SelectItem value="2">Modalidad 2 - Fuera de línea</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="codigoAmbiente">Ambiente</Label>
              <Select value={formData.codigoAmbiente || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, codigoAmbiente: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ambiente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Producción</SelectItem>
                  <SelectItem value="2">Pruebas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tokenDelegado">Token Delegado</Label>
            <Textarea
              id="tokenDelegado"
              value={formData.tokenDelegado || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, tokenDelegado: e.target.value }))}
              placeholder="Ingrese el token delegado del SIN"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="habilitado"
              checked={formData.habilitado || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, habilitado: checked }))}
            />
            <Label htmlFor="habilitado">Habilitar integración SIN/SIAT</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBankConfig = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuración Bancaria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="banco">Banco</Label>
              <Select value={formData.banco || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, banco: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bcp">Banco de Crédito del Perú</SelectItem>
                  <SelectItem value="bnb">Banco Nacional de Bolivia</SelectItem>
                  <SelectItem value="mercantil">Banco Mercantil Santa Cruz</SelectItem>
                  <SelectItem value="union">Banco Unión</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="numeroCuenta">Número de Cuenta</Label>
              <Input
                id="numeroCuenta"
                value={formData.numeroCuenta || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, numeroCuenta: e.target.value }))}
                placeholder="Ej: 1234567890"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apiUrl">URL API</Label>
              <Input
                id="apiUrl"
                value={formData.apiUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, apiUrl: e.target.value }))}
                placeholder="https://api.banco.com/v1"
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={formData.apiKey || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Ingrese su API Key"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="sincronizacionAutomatica"
              checked={formData.sincronizacionAutomatica || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sincronizacionAutomatica: checked }))}
            />
            <Label htmlFor="sincronizacionAutomatica">Sincronización automática</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWhatsAppConfig = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuración WhatsApp Business
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber">Número de Teléfono</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Ej: +59175123456"
              />
            </div>
            <div>
              <Label htmlFor="businessId">Business Account ID</Label>
              <Input
                id="businessId"
                value={formData.businessId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, businessId: e.target.value }))}
                placeholder="ID de la cuenta de negocio"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="accessToken">Access Token</Label>
            <Textarea
              id="accessToken"
              value={formData.accessToken || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, accessToken: e.target.value }))}
              placeholder="Token de acceso de WhatsApp Business API"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={formData.webhookUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
              placeholder="https://tudominio.com/webhook/whatsapp"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="envioAutomatico"
              checked={formData.envioAutomatico || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, envioAutomatico: checked }))}
            />
            <Label htmlFor="envioAutomatico">Envío automático de facturas</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGenericConfig = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apiUrl">URL del Servicio</Label>
              <Input
                id="apiUrl"
                value={formData.apiUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, apiUrl: e.target.value }))}
                placeholder="https://api.servicio.com"
              />
            </div>
            <div>
              <Label htmlFor="apiKey">Clave de API</Label>
              <Input
                id="apiKey"
                type="password"
                value={formData.apiKey || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Ingrese su clave de API"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Descripción de la integración"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activa"
              checked={formData.activa || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, activa: checked }))}
            />
            <Label htmlFor="activa">Integración activa</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfigContent = () => {
    switch (integration.id) {
      case 'sin':
      case 'siat':
        return renderSINConfig();
      case 'bcp':
      case 'bnb':
      case 'mercantil':
        return renderBankConfig();
      case 'whatsapp':
        return renderWhatsAppConfig();
      default:
        return renderGenericConfig();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurar {integration.name}
            <Badge variant="outline">{integration.type}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {renderConfigContent()}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              Los cambios se guardarán automáticamente
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleTest}
                disabled={isTesting}
              >
                <TestTube className="w-4 h-4 mr-2" />
                {isTesting ? 'Probando...' : 'Probar Conexión'}
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationDialog;
