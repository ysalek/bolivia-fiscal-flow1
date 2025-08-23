import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Wifi, WifiOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ConfigurationDialog from './ConfigurationDialog';
import WebhookManager from './WebhookManager';
import IntegrationMetrics from './IntegrationMetrics';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: React.ComponentType<any>;
  connected: boolean;
}

const IntegrationHub = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'sin',
      name: 'SIN/SIAT',
      description: 'Integración con el Sistema de Impuestos Nacionales',
      type: 'Gobierno',
      icon: Settings,
      connected: false,
    },
    {
      id: 'bcp',
      name: 'Banco BCP',
      description: 'Conexión con la API del Banco de Crédito del Perú',
      type: 'Bancaria',
      icon: Settings,
      connected: false,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Envío de notificaciones y facturas por WhatsApp',
      type: 'Comunicación',
      icon: Settings,
      connected: false,
    },
    {
      id: 'general',
      name: 'Servicio Genérico',
      description: 'Integración con cualquier servicio mediante API',
      type: 'API',
      icon: Settings,
      connected: false,
    },
  ]);
  
  const [selectedConfigIntegration, setSelectedConfigIntegration] = useState<any>(null);
  const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, any>>({});

  useEffect(() => {
    const storedConfigs = localStorage.getItem('integrationConfigs');
    if (storedConfigs) {
      setIntegrationConfigs(JSON.parse(storedConfigs));
    }

    // Cargar estados de conexión desde localStorage
    const storedConnections = localStorage.getItem('integrationConnections');
    if (storedConnections) {
      const connectedIds = JSON.parse(storedConnections);
      setIntegrations(prevIntegrations =>
        prevIntegrations.map(integration => ({
          ...integration,
          connected: connectedIds.includes(integration.id)
        }))
      );
    }
  }, []);

  const saveConnectedIntegrations = (connectedIds: string[]) => {
    localStorage.setItem('integrationConnections', JSON.stringify(connectedIds));
  };

  const handleConfigureIntegration = (integration: any) => {
    setSelectedConfigIntegration(integration);
  };

  const handleSaveConfig = (config: any) => {
    const updatedConfigs = {
      ...integrationConfigs,
      [selectedConfigIntegration.id]: config
    };
    setIntegrationConfigs(updatedConfigs);
    localStorage.setItem('integrationConfigs', JSON.stringify(updatedConfigs));
    
    // Si la integración se configuró como activa, actualizar su estado
    if (config.activa || config.habilitado) {
      handleConnect(selectedConfigIntegration.id);
    }
  };

  const handleConnect = (id: string) => {
    setIntegrations(prevIntegrations => {
      const updatedIntegrations = prevIntegrations.map(integration =>
        integration.id === id ? { ...integration, connected: true } : integration
      );
      
      // Guardar en localStorage
      const connectedIds = updatedIntegrations.filter(i => i.connected).map(i => i.id);
      saveConnectedIntegrations(connectedIds);
      
      return updatedIntegrations;
    });
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prevIntegrations => {
      const updatedIntegrations = prevIntegrations.map(integration =>
        integration.id === id ? { ...integration, connected: false } : integration
      );

      // Guardar en localStorage
      const connectedIds = updatedIntegrations.filter(i => i.connected).map(i => i.id);
      saveConnectedIntegrations(connectedIds);

      return updatedIntegrations;
    });
  };

  const validateConnection = (id: string) => {
    // Aquí iría la lógica real para validar la conexión
    console.log(`Validando conexión con ${id}`);
    return true;
  };

  const renderIntegrationCard = (integration: any) => (
    <Card key={integration.id} className="border-2 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${integration.connected ? 'bg-green-100' : 'bg-gray-100'}`}>
              <integration.icon className={`w-6 h-6 ${integration.connected ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <CardDescription className="text-sm">{integration.description}</CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={integration.connected ? "default" : "secondary"} className="text-xs">
              {integration.connected ? "Conectado" : "Desconectado"}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConfigureIntegration(integration)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            {integration.connected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDisconnect(integration.id)}
                className="text-red-600 hover:text-red-700"
              >
                <WifiOff className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConnect(integration.id)}
                className="text-green-600 hover:text-green-700"
              >
                <Wifi className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tipo:</span>
            <Badge variant="outline">{integration.type}</Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estado:</span>
            <div className="flex items-center space-x-2">
              {integration.connected ? (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Activo
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  Inactivo
                </div>
              )}
            </div>
          </div>
          
          {integration.connected && (
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConfigureIntegration(integration)}
                  className="text-xs"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Config
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Hub de Integraciones
          </h2>
          <p className="text-muted-foreground">
            Gestiona las conexiones con otros servicios y plataformas
          </p>
        </div>
        {/* <Button>Agregar Integración</Button> */}
      </div>

      <Tabs defaultValue="integraciones" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="metricas">Métricas</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="integraciones" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map(renderIntegrationCard)}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <WebhookManager integrationId="general" />
        </TabsContent>

        <TabsContent value="metricas" className="space-y-6">
          {integrations.filter(i => i.connected).length > 0 ? (
            <div className="space-y-6">
              {integrations.filter(i => i.connected).map(integration => (
                <IntegrationMetrics
                  key={integration.id}
                  integrationId={integration.id}
                  integrationName={integration.name}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Sin integraciones activas</h3>
                <p className="text-muted-foreground">
                  Conecte al menos una integración para ver las métricas de rendimiento
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>
                Ajustes generales para el funcionamiento del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí irían los componentes de configuración general */}
              <p>No hay opciones de configuración disponibles.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      {selectedConfigIntegration && (
        <ConfigurationDialog
          open={!!selectedConfigIntegration}
          onOpenChange={(open) => !open && setSelectedConfigIntegration(null)}
          integration={selectedConfigIntegration}
          config={integrationConfigs[selectedConfigIntegration.id] || {}}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
};

export default IntegrationHub;
