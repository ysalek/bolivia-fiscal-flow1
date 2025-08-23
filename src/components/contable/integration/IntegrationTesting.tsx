import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  id: string;
  integration: string;
  test: string;
  status: 'success' | 'error' | 'warning' | 'running';
  message: string;
  timestamp: Date;
  duration?: number;
}

interface IntegrationTestingProps {
  integrationId?: string;
}

const IntegrationTesting: React.FC<IntegrationTestingProps> = ({ integrationId }) => {
  const { toast } = useToast();
  const [selectedIntegration, setSelectedIntegration] = useState(integrationId || '');
  const [selectedTest, setSelectedTest] = useState('');
  const [customPayload, setCustomPayload] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const integrations = [
    { id: 'sin', name: 'SIN/SIAT' },
    { id: 'bcp', name: 'Banco BCP' },
    { id: 'whatsapp', name: 'WhatsApp Business' },
    { id: 'general', name: 'Servicio Genérico' }
  ];

  const testTypes = {
    connection: 'Test de Conexión',
    authentication: 'Test de Autenticación',
    data_sync: 'Test de Sincronización',
    webhook: 'Test de Webhook',
    performance: 'Test de Rendimiento',
    custom: 'Test Personalizado'
  };

  const runTest = async (testType: string) => {
    if (!selectedIntegration) {
      toast({
        title: "Error",
        description: "Selecciona una integración primero",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    const startTime = Date.now();
    
    const newTest: TestResult = {
      id: Date.now().toString(),
      integration: selectedIntegration,
      test: testType,
      status: 'running',
      message: 'Ejecutando test...',
      timestamp: new Date()
    };

    setTestResults(prev => [newTest, ...prev]);

    try {
      // Simular test basado en el tipo y la integración
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      const duration = Date.now() - startTime;
      const success = Math.random() > 0.3; // 70% probabilidad de éxito
      
      const updatedTest: TestResult = {
        ...newTest,
        status: success ? 'success' : 'error',
        message: success 
          ? getSuccessMessage(testType, selectedIntegration)
          : getErrorMessage(testType, selectedIntegration),
        duration
      };

      setTestResults(prev => 
        prev.map(test => test.id === newTest.id ? updatedTest : test)
      );

      toast({
        title: success ? "Test exitoso" : "Test falló",
        description: updatedTest.message,
        variant: success ? "default" : "destructive"
      });

    } catch (error) {
      const updatedTest: TestResult = {
        ...newTest,
        status: 'error',
        message: 'Error inesperado en el test',
        duration: Date.now() - startTime
      };

      setTestResults(prev => 
        prev.map(test => test.id === newTest.id ? updatedTest : test)
      );
    }

    setIsRunning(false);
  };

  const getSuccessMessage = (testType: string, integration: string) => {
    const messages: Record<string, Record<string, string>> = {
      connection: {
        sin: 'Conexión exitosa con SIN/SIAT',
        bcp: 'Conexión establecida con BCP API',
        whatsapp: 'WhatsApp Business API respondiendo',
        general: 'Servicio disponible y respondiendo'
      },
      authentication: {
        sin: 'Credenciales SIN válidas',
        bcp: 'Token BCP autenticado correctamente',
        whatsapp: 'Token WhatsApp válido',
        general: 'Autenticación exitosa'
      },
      data_sync: {
        sin: 'Sincronización con SIAT completada',
        bcp: 'Datos bancarios sincronizados',
        whatsapp: 'Lista de contactos actualizada',
        general: 'Sincronización de datos exitosa'
      }
    };
    return messages[testType]?.[integration] || 'Test completado exitosamente';
  };

  const getErrorMessage = (testType: string, integration: string) => {
    const messages: Record<string, Record<string, string>> = {
      connection: {
        sin: 'No se pudo conectar con SIN/SIAT - Verificar URL y certificados',
        bcp: 'Error de conexión con BCP - API no disponible',
        whatsapp: 'WhatsApp API no responde - Verificar token',
        general: 'Servicio no disponible o timeout'
      },
      authentication: {
        sin: 'Credenciales SIN inválidas o expiradas',
        bcp: 'Token BCP inválido o expirado',
        whatsapp: 'Token WhatsApp inválido',
        general: 'Fallo en autenticación'
      }
    };
    return messages[testType]?.[integration] || 'Test falló';
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      running: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status]} className="text-xs">
        {status === 'success' && 'Exitoso'}
        {status === 'error' && 'Error'}
        {status === 'warning' && 'Advertencia'}
        {status === 'running' && 'Ejecutando'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Panel de Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Integración</label>
              <Select value={selectedIntegration} onValueChange={setSelectedIntegration}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar integración" />
                </SelectTrigger>
                <SelectContent>
                  {integrations.map(integration => (
                    <SelectItem key={integration.id} value={integration.id}>
                      {integration.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Test</label>
              <Select value={selectedTest} onValueChange={setSelectedTest}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar test" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(testTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedTest === 'custom' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Payload Personalizado (JSON)</label>
              <Textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                placeholder="Ingresa el payload JSON para el test personalizado"
                className="h-32"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {Object.entries(testTypes).map(([key, value]) => (
              <Button
                key={key}
                onClick={() => runTest(key)}
                disabled={!selectedIntegration || isRunning}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {value}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados de Tests</CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay tests ejecutados aún
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">
                        {testTypes[result.test as keyof typeof testTypes]} - {
                          integrations.find(i => i.id === result.integration)?.name
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.message}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {result.duration && (
                      <span className="text-xs text-muted-foreground">
                        {result.duration}ms
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                    {getStatusBadge(result.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationTesting;