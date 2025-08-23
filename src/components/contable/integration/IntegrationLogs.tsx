import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, Filter, RefreshCw, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  integration: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: Record<string, any>;
  source: string;
}

const IntegrationLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const integrations = [
    { id: 'all', name: 'Todas las Integraciones' },
    { id: 'sin', name: 'SIN/SIAT' },
    { id: 'bcp', name: 'Banco BCP' },
    { id: 'whatsapp', name: 'WhatsApp Business' },
    { id: 'general', name: 'Servicio Genérico' }
  ];

  const logLevels = [
    { id: 'all', name: 'Todos los Niveles' },
    { id: 'info', name: 'Información' },
    { id: 'success', name: 'Éxito' },
    { id: 'warning', name: 'Advertencia' },
    { id: 'error', name: 'Error' }
  ];

  // Generar logs de ejemplo
  useEffect(() => {
    const generateSampleLogs = () => {
      const sampleLogs: LogEntry[] = [];
      const integrationIds = ['sin', 'bcp', 'whatsapp', 'general'];
      const levels: LogEntry['level'][] = ['info', 'warning', 'error', 'success'];
      const sources = ['API', 'Webhook', 'Scheduler', 'Manual'];
      
      const messages = {
        sin: {
          info: ['Conexión establecida con SIN', 'Consultando estado del servicio'],
          success: ['Factura enviada correctamente', 'Datos sincronizados'],
          warning: ['Timeout en respuesta', 'Certificado próximo a vencer'],
          error: ['Error de autenticación', 'Servicio no disponible']
        },
        bcp: {
          info: ['Iniciando consulta de saldo', 'Procesando transacción'],
          success: ['Transferencia completada', 'Saldo actualizado'],
          warning: ['Límite diario alcanzado', 'Conexión lenta'],
          error: ['Token expirado', 'Error en la transacción']
        },
        whatsapp: {
          info: ['Enviando mensaje', 'Validando número'],
          success: ['Mensaje entregado', 'Estado actualizado'],
          warning: ['Mensaje pendiente', 'Número no válido'],
          error: ['Fallo en envío', 'API key inválida']
        },
        general: {
          info: ['Procesando solicitud', 'Validando datos'],
          success: ['Operación completada', 'Datos procesados'],
          warning: ['Respuesta lenta', 'Parámetros opcionales faltantes'],
          error: ['Error de conexión', 'Timeout']
        }
      };

      for (let i = 0; i < 50; i++) {
        const integration = integrationIds[Math.floor(Math.random() * integrationIds.length)];
        const level = levels[Math.floor(Math.random() * levels.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const messageArray = messages[integration as keyof typeof messages][level];
        const message = messageArray[Math.floor(Math.random() * messageArray.length)];

        sampleLogs.push({
          id: `log-${i}`,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          integration,
          level,
          message,
          source,
          details: {
            requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
            duration: Math.floor(Math.random() * 5000),
            ...(level === 'error' && { 
              errorCode: `ERR_${Math.floor(Math.random() * 999)}`,
              stackTrace: 'Error at line 42...'
            })
          }
        });
      }

      return sampleLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setLogs(generateSampleLogs());
  }, []);

  // Filtrar logs
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.integration.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIntegration !== 'all') {
      filtered = filtered.filter(log => log.integration === selectedIntegration);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedIntegration, selectedLevel]);

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    const variants = {
      info: 'secondary',
      success: 'default',
      warning: 'secondary',
      error: 'destructive'
    } as const;

    const labels = {
      info: 'Info',
      success: 'Éxito',
      warning: 'Alerta',
      error: 'Error'
    };
    
    return (
      <Badge variant={variants[level]} className="text-xs">
        {labels[level]}
      </Badge>
    );
  };

  const refreshLogs = () => {
    // En un caso real, esto recargaría los logs del servidor
    console.log('Recargando logs...');
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `integration-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Logs del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedIntegration} onValueChange={setSelectedIntegration}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por integración" />
              </SelectTrigger>
              <SelectContent>
                {integrations.map(integration => (
                  <SelectItem key={integration.id} value={integration.id}>
                    {integration.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por nivel" />
              </SelectTrigger>
              <SelectContent>
                {logLevels.map(level => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={refreshLogs} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button onClick={exportLogs} variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Total: {filteredLogs.length} registros</span>
            <span>Errores: {filteredLogs.filter(l => l.level === 'error').length}</span>
            <span>Advertencias: {filteredLogs.filter(l => l.level === 'warning').length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron logs con los filtros aplicados
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getLevelIcon(log.level)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {integrations.find(i => i.id === log.integration)?.name}
                        </span>
                        {getLevelBadge(log.level)}
                        <Badge variant="outline" className="text-xs">
                          {log.source}
                        </Badge>
                      </div>
                      
                      <div className="text-sm mb-1">
                        {log.message}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{log.timestamp.toLocaleString()}</span>
                        {log.details?.requestId && (
                          <span>ID: {log.details.requestId}</span>
                        )}
                        {log.details?.duration && (
                          <span>{log.details.duration}ms</span>
                        )}
                      </div>
                      
                      {log.details?.errorCode && (
                        <div className="mt-2 text-xs text-red-600">
                          Error: {log.details.errorCode}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationLogs;