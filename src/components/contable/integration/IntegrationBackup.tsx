import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Upload, 
  Archive, 
  RotateCcw, 
  Calendar,
  HardDrive,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'configuration';
  size: number;
  createdAt: Date;
  status: 'completed' | 'failed' | 'in_progress';
  integrations: string[];
  description: string;
  encrypted: boolean;
}

interface RestorePoint {
  id: string;
  backupId: string;
  name: string;
  timestamp: Date;
  changes: string[];
  canRollback: boolean;
}

const IntegrationBackup: React.FC = () => {
  const { toast } = useToast();
  
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: '1',
      name: 'Backup Automático Diario',
      type: 'full',
      size: 15.7,
      createdAt: new Date(),
      status: 'completed',
      integrations: ['sin', 'bcp', 'whatsapp'],
      description: 'Backup completo automatizado',
      encrypted: true
    },
    {
      id: '2',
      name: 'Configuración SIN - Pre-actualización',
      type: 'configuration',
      size: 2.3,
      createdAt: new Date(Date.now() - 86400000),
      status: 'completed',
      integrations: ['sin'],
      description: 'Backup antes de actualizar configuración SIN',
      encrypted: true
    },
    {
      id: '3',
      name: 'Backup Incremental',
      type: 'incremental',
      size: 5.1,
      createdAt: new Date(Date.now() - 3600000),
      status: 'in_progress',
      integrations: ['bcp', 'whatsapp'],
      description: 'Backup incremental en progreso',
      encrypted: true
    }
  ]);

  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([
    {
      id: '1',
      backupId: '1',
      name: 'Estado Inicial SIN',
      timestamp: new Date(Date.now() - 7200000),
      changes: ['Configuración API', 'Tokens actualizados', 'Webhooks configurados'],
      canRollback: true
    },
    {
      id: '2',
      backupId: '2',
      name: 'Configuración BCP v2.1',
      timestamp: new Date(Date.now() - 14400000),
      changes: ['Nuevos endpoints', 'Certificados renovados'],
      canRollback: true
    }
  ]);

  const [backupProgress, setBackupProgress] = useState(0);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);

  const integrations = [
    { id: 'sin', name: 'SIN/SIAT' },
    { id: 'bcp', name: 'Banco BCP' },
    { id: 'whatsapp', name: 'WhatsApp Business' },
    { id: 'general', name: 'Configuración General' }
  ];

  const createBackup = async (type: 'full' | 'incremental' | 'configuration') => {
    if (selectedIntegrations.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos una integración",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingBackup(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCreatingBackup(false);
          
          // Add new backup
          const newBackup: Backup = {
            id: Date.now().toString(),
            name: `Backup ${type} - ${new Date().toLocaleString()}`,
            type,
            size: Math.random() * 20 + 5,
            createdAt: new Date(),
            status: 'completed',
            integrations: selectedIntegrations,
            description: `Backup ${type} creado manualmente`,
            encrypted: true
          };

          setBackups(prev => [newBackup, ...prev]);
          setSelectedIntegrations([]);
          
          toast({
            title: "Backup creado",
            description: `Backup ${type} completado exitosamente`
          });
          
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 800);
  };

  const restoreBackup = async (backupId: string) => {
    setIsRestoring(true);
    
    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(false);
      toast({
        title: "Restauración completada",
        description: "Las configuraciones han sido restauradas exitosamente"
      });
    }, 3000);
  };

  const downloadBackup = (backup: Backup) => {
    // Simulate download
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${backup.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Descarga iniciada",
      description: `Descargando ${backup.name}`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'bg-blue-100 text-blue-800';
      case 'incremental':
        return 'bg-green-100 text-green-800';
      case 'configuration':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Backup y Restauración</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona copias de seguridad de configuraciones de integraciones
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Archive className="w-4 h-4 mr-2" />
              Crear Backup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Backup</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Integraciones a incluir</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {integrations.map(integration => (
                    <div key={integration.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={integration.id}
                        checked={selectedIntegrations.includes(integration.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIntegrations([...selectedIntegrations, integration.id]);
                          } else {
                            setSelectedIntegrations(selectedIntegrations.filter(id => id !== integration.id));
                          }
                        }}
                      />
                      <label htmlFor={integration.id} className="text-sm">
                        {integration.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {isCreatingBackup && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso del backup</span>
                    <span>{backupProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={backupProgress} className="h-2" />
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => createBackup('full')} 
                  disabled={isCreatingBackup}
                  className="flex-1"
                >
                  Backup Completo
                </Button>
                <Button 
                  onClick={() => createBackup('incremental')} 
                  disabled={isCreatingBackup}
                  variant="outline"
                  className="flex-1"
                >
                  Incremental
                </Button>
                <Button 
                  onClick={() => createBackup('configuration')} 
                  disabled={isCreatingBackup}
                  variant="outline"
                  className="flex-1"
                >
                  Solo Config
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="backups" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="restore">Restaurar</TabsTrigger>
          <TabsTrigger value="schedule">Programar</TabsTrigger>
          <TabsTrigger value="storage">Almacenamiento</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-4">
          {/* Backup Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Archive className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{backups.length}</div>
                    <div className="text-xs text-muted-foreground">Total Backups</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {backups.reduce((acc, b) => acc + b.size, 0).toFixed(1)}MB
                    </div>
                    <div className="text-xs text-muted-foreground">Espacio Usado</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {backups.filter(b => b.encrypted).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Encriptados</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {backups.filter(b => b.status === 'completed').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Exitosos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backups List */}
          <div className="space-y-3">
            {backups.map((backup) => (
              <Card key={backup.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(backup.status)}
                        <h4 className="font-medium">{backup.name}</h4>
                        <Badge className={getTypeColor(backup.type)}>
                          {backup.type}
                        </Badge>
                        {backup.encrypted && (
                          <Shield className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {backup.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>{backup.size.toFixed(1)} MB</span>
                        <span>{backup.createdAt.toLocaleString()}</span>
                        <span>{backup.integrations.length} integraciones</span>
                      </div>
                      
                      <div className="flex space-x-1 mt-2">
                        {backup.integrations.map(int => (
                          <Badge key={int} variant="outline" className="text-xs">
                            {integrations.find(i => i.id === int)?.name || int}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadBackup(backup)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => restoreBackup(backup.id)}
                        disabled={backup.status !== 'completed' || isRestoring}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restore" className="space-y-4">
          {isRestoring && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Restauración en progreso. No modifiques las configuraciones durante este proceso.
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Restore Points */}
          <Card>
            <CardHeader>
              <CardTitle>Puntos de Restauración Rápida</CardTitle>
              <CardDescription>
                Restaura configuraciones a estados específicos conocidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {restorePoints.map((point) => (
                  <div key={point.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{point.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {point.timestamp.toLocaleString()}
                      </p>
                      <div className="flex space-x-1 mt-1">
                        {point.changes.map((change, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {change}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      disabled={!point.canRollback || isRestoring}
                      onClick={() => restoreBackup(point.backupId)}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restaurar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Backup */}
          <Card>
            <CardHeader>
              <CardTitle>Cargar Backup Externo</CardTitle>
              <CardDescription>
                Restaura desde un archivo de backup previamente descargado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra un archivo de backup aquí o haz clic para seleccionar
                  </p>
                  <Button variant="outline" className="mt-2">
                    Seleccionar Archivo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backups Automáticos</CardTitle>
              <CardDescription>
                Configura backups automáticos programados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Backup Diario', frequency: 'Diario a las 02:00', enabled: true, type: 'incremental' },
                  { name: 'Backup Semanal', frequency: 'Domingo a las 01:00', enabled: true, type: 'full' },
                  { name: 'Backup de Configuración', frequency: 'Antes de cada cambio', enabled: true, type: 'configuration' }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{schedule.name}</div>
                        <div className="text-sm text-muted-foreground">{schedule.frequency}</div>
                      </div>
                      <Badge className={getTypeColor(schedule.type)}>
                        {schedule.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={schedule.enabled ? 'default' : 'secondary'}>
                        {schedule.enabled ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Uso de Almacenamiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Usado</span>
                    <span>23.1 MB de 1 GB</span>
                  </div>
                  <Progress value={2.31} className="h-2" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Backups completos</span>
                      <span>15.7 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Backups incrementales</span>
                      <span>5.1 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Configuraciones</span>
                      <span>2.3 MB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Retención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Mantener backups completos</Label>
                    <Input value="30 días" className="mt-1" />
                  </div>
                  <div>
                    <Label>Mantener backups incrementales</Label>
                    <Input value="7 días" className="mt-1" />
                  </div>
                  <div>
                    <Label>Máximo tamaño de backup</Label>
                    <Input value="100 MB" className="mt-1" />
                  </div>
                  
                  <Button className="w-full">
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationBackup;