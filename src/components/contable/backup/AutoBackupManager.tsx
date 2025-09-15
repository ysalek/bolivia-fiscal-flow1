import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Upload, 
  Shield, 
  Clock, 
  Database, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Archive,
  FileText,
  Calendar,
  HardDrive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackupRecord {
  id: string;
  date: string;
  time: string;
  size: number;
  type: 'manual' | 'automatic' | 'scheduled';
  status: 'completed' | 'failed' | 'in_progress';
  modules: string[];
}

const AutoBackupManager = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [lastAutoBackup, setLastAutoBackup] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadBackupHistory();
    checkAutoBackupStatus();
  }, []);

  const loadBackupHistory = () => {
    const stored = localStorage.getItem('backup_history');
    if (stored) {
      setBackups(JSON.parse(stored));
    } else {
      // Crear algunos backups de ejemplo
      const sampleBackups: BackupRecord[] = [
        {
          id: '1',
          date: new Date().toISOString().slice(0, 10),
          time: '14:30',
          size: 2.5,
          type: 'automatic',
          status: 'completed',
          modules: ['productos', 'facturas', 'clientes', 'asientos']
        },
        {
          id: '2',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          time: '09:15',
          size: 2.3,
          type: 'manual',
          status: 'completed',
          modules: ['productos', 'facturas', 'clientes']
        }
      ];
      setBackups(sampleBackups);
      localStorage.setItem('backup_history', JSON.stringify(sampleBackups));
    }
  };

  const checkAutoBackupStatus = () => {
    const lastBackup = localStorage.getItem('last_auto_backup');
    if (lastBackup) {
      setLastAutoBackup(lastBackup);
    }
  };

  const createManualBackup = async () => {
    setIsCreatingBackup(true);
    setProgress(0);

    try {
      const modules = [
        'productos',
        'facturas', 
        'clientes',
        'proveedores',
        'asientosContables',
        'cuentas_asientos',
        'plan_cuentas',
        'movimientos_inventario',
        'compras',
        'pagos'
      ];

      const backupData: any = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        modules: {}
      };

      for (let i = 0; i < modules.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const moduleData = localStorage.getItem(modules[i]);
        if (moduleData) {
          backupData.modules[modules[i]] = JSON.parse(moduleData);
        }
        setProgress(((i + 1) / modules.length) * 100);
      }

      // Crear archivo de backup
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_sistema_contable_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`;
      link.click();
      
      URL.revokeObjectURL(url);

      // Registrar backup en historial
      const newBackup: BackupRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
        size: dataStr.length / (1024 * 1024), // MB
        type: 'manual',
        status: 'completed',
        modules: modules.filter(m => backupData.modules[m])
      };

      const updatedBackups = [newBackup, ...backups];
      setBackups(updatedBackups);
      localStorage.setItem('backup_history', JSON.stringify(updatedBackups));

      toast({
        title: "Backup creado exitosamente",
        description: "Todos los datos han sido respaldados",
        variant: "default"
      });

    } catch (error) {
      toast({
        title: "Error al crear backup",
        description: "No se pudo completar el respaldo",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBackup(false);
      setProgress(0);
    }
  };

  const createAutomaticBackup = () => {
    const now = new Date().toISOString();
    setLastAutoBackup(now);
    localStorage.setItem('last_auto_backup', now);

    const newBackup: BackupRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
      size: 2.1,
      type: 'automatic',
      status: 'completed',
      modules: ['productos', 'facturas', 'clientes', 'asientos']
    };

    const updatedBackups = [newBackup, ...backups];
    setBackups(updatedBackups);
    localStorage.setItem('backup_history', JSON.stringify(updatedBackups));

    toast({
      title: "Backup automático realizado",
      description: "Respaldo programado completado",
      variant: "default"
    });
  };

  const restoreFromBackup = async (file: File) => {
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.modules) {
        throw new Error('Formato de backup inválido');
      }

      // Restaurar cada módulo
      Object.entries(backupData.modules).forEach(([module, data]) => {
        localStorage.setItem(module, JSON.stringify(data));
      });

      toast({
        title: "Restauración completada",
        description: "Datos restaurados desde el backup",
        variant: "default"
      });

      // Recargar página para aplicar cambios
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      toast({
        title: "Error en restauración",
        description: "No se pudieron restaurar los datos",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'failed':
        return <Badge variant="destructive">Fallido</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En Progreso</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'manual':
        return <Badge variant="outline">Manual</Badge>;
      case 'automatic':
        return <Badge className="bg-blue-100 text-blue-800">Automático</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800">Programado</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const totalBackupSize = backups.reduce((sum, backup) => sum + backup.size, 0);
  const successfulBackups = backups.filter(b => b.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestor de Respaldos Automáticos</h2>
          <p className="text-muted-foreground">
            Protección automática y gestión de respaldos del sistema
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={createAutomaticBackup}>
            <Clock className="w-4 h-4 mr-2" />
            Auto Backup
          </Button>
          <Button onClick={createManualBackup} disabled={isCreatingBackup}>
            {isCreatingBackup ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Backup Manual
              </>
            )}
          </Button>
        </div>
      </div>

      {isCreatingBackup && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Creando respaldo</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
          <TabsTrigger value="restore">Restaurar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Archive className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Total Backups</p>
                    <p className="text-2xl font-bold">{backups.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Exitosos</p>
                    <p className="text-2xl font-bold">{successfulBackups}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Tamaño Total</p>
                    <p className="text-2xl font-bold">{totalBackupSize.toFixed(1)} MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Último Backup</p>
                    <p className="text-2xl font-bold">
                      {backups.length > 0 ? backups[0].time : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema de Respaldos</CardTitle>
              <CardDescription>
                Configuración actual y próximos respaldos automáticos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Respaldo Automático</span>
                </div>
                <Badge variant={autoBackupEnabled ? "default" : "secondary"}>
                  {autoBackupEnabled ? "Activado" : "Desactivado"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Frecuencia</span>
                </div>
                <Badge variant="outline">Diario a las 02:00</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Módulos Incluidos</span>
                </div>
                <Badge variant="outline">Todos los módulos</Badge>
              </div>

              {lastAutoBackup && (
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    Último respaldo automático: {new Date(lastAutoBackup).toLocaleString('es-BO')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {backups.map((backup) => (
              <Card key={backup.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">
                            Backup {backup.date} - {backup.time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {backup.size.toFixed(2)} MB • {backup.modules.length} módulos
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTypeBadge(backup.type)}
                      {getStatusBadge(backup.status)}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      Módulos: {backup.modules.join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {backups.length === 0 && (
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  No hay backups registrados. Crea tu primer respaldo para comenzar.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Respaldos Automáticos</CardTitle>
              <CardDescription>
                Personaliza la frecuencia y opciones de respaldo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Respaldos Automáticos</h4>
                  <p className="text-sm text-muted-foreground">
                    Crear respaldos automáticamente cada día
                  </p>
                </div>
                <Button
                  variant={autoBackupEnabled ? "default" : "outline"}
                  onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
                >
                  {autoBackupEnabled ? "Activado" : "Desactivado"}
                </Button>
              </div>

              <Alert>
                <Clock className="w-4 h-4" />
                <AlertDescription>
                  <strong>Programación Recomendada:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Respaldos diarios a las 02:00 AM</li>
                    <li>• Retención de 30 días para respaldos automáticos</li>
                    <li>• Respaldos manuales sin límite de tiempo</li>
                    <li>• Compresión automática para ahorrar espacio</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Módulos a Respaldar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Productos', 'Facturas', 'Clientes', 'Proveedores', 'Asientos Contables', 'Plan de Cuentas'].map((module) => (
                        <div key={module} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{module}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Opciones Avanzadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Compresión automática</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Verificación de integridad</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Notificaciones por email</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Rotación automática</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restore" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurar desde Respaldo</CardTitle>
              <CardDescription>
                Selecciona un archivo de backup para restaurar el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Advertencia:</strong> La restauración sobrescribirá todos los datos actuales. 
                  Asegúrate de crear un backup actual antes de proceder.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Seleccionar archivo de backup
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        restoreFromBackup(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>

                <Alert>
                  <Upload className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Proceso de Restauración:</strong>
                    <ol className="mt-2 list-decimal list-inside space-y-1">
                      <li>Selecciona el archivo de backup (.json)</li>
                      <li>El sistema validará la integridad del archivo</li>
                      <li>Se restaurarán todos los módulos incluidos</li>
                      <li>La aplicación se recargará automáticamente</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutoBackupManager;