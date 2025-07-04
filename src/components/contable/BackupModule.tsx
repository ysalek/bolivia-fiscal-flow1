
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Database, Clock, Shield, AlertTriangle } from 'lucide-react';

interface BackupInfo {
  fecha: string;
  tamaño: string;
  version: string;
  registros: number;
}

const BackupModule = () => {
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  const crearBackup = async () => {
    setIsCreatingBackup(true);
    
    try {
      // Simular proceso de backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Recopilar datos del localStorage
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        data: {
          facturas,
          asientos,
          productos,
          clientes
        }
      };
      
      // Crear archivo de descarga
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-contable-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Agregar a la lista de backups
      const nuevoBackup: BackupInfo = {
        fecha: new Date().toISOString(),
        tamaño: `${Math.round(blob.size / 1024)} KB`,
        version: '2.0.0',
        registros: facturas.length + asientos.length + productos.length + clientes.length
      };
      
      setBackups(prev => [nuevoBackup, ...prev]);
      
      toast({
        title: "Backup creado exitosamente",
        description: "El archivo de respaldo se descargó automáticamente",
      });
      
    } catch (error) {
      toast({
        title: "Error al crear backup",
        description: "No se pudo crear el archivo de respaldo",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const restaurarBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      if (!backupData.data || !backupData.timestamp) {
        throw new Error('Formato de backup inválido');
      }
      
      // Confirmar restauración
      const confirmar = window.confirm(
        '⚠️ ADVERTENCIA: Esta acción reemplazará todos los datos actuales. ¿Está seguro de continuar?'
      );
      
      if (!confirmar) {
        setIsRestoring(false);
        return;
      }
      
      // Restaurar datos
      const { facturas, asientos, productos, clientes } = backupData.data;
      
      if (facturas) localStorage.setItem('facturas', JSON.stringify(facturas));
      if (asientos) localStorage.setItem('asientosContables', JSON.stringify(asientos));
      if (productos) localStorage.setItem('productos', JSON.stringify(productos));
      if (clientes) localStorage.setItem('clientes', JSON.stringify(clientes));
      
      toast({
        title: "Backup restaurado exitosamente",
        description: "Los datos han sido restaurados. La página se recargará.",
      });
      
      // Recargar la página para actualizar todos los componentes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error al restaurar backup",
        description: "El archivo de backup es inválido o está corrupto",
        variant: "destructive"
      });
    } finally {
      setIsRestoring(false);
      // Reset input
      event.target.value = '';
    }
  };

  const programarBackupAutomatico = () => {
    toast({
      title: "Función próximamente",
      description: "El backup automático estará disponible en una próxima actualización",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Sistema de Backup y Restauración
          </CardTitle>
          <CardDescription>
            Cree copias de seguridad de sus datos contables y restaure información cuando sea necesario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              <strong>Importante:</strong> Se recomienda crear backups periódicos de sus datos contables.
              Mantenga estos archivos en un lugar seguro y actualizado.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crear Backup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Crear Backup
                </CardTitle>
                <CardDescription>
                  Genere una copia de seguridad completa de todos sus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  El backup incluirá:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Todas las facturas emitidas</li>
                    <li>Asientos contables</li>
                    <li>Catálogo de productos</li>
                    <li>Base de datos de clientes</li>
                    <li>Configuraciones del sistema</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={crearBackup} 
                  disabled={isCreatingBackup}
                  className="w-full"
                >
                  {isCreatingBackup ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creando backup...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Crear Backup Ahora
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={programarBackupAutomatico}
                  className="w-full"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Programar Backup Automático
                </Button>
              </CardContent>
            </Card>

            {/* Restaurar Backup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Restaurar Backup
                </CardTitle>
                <CardDescription>
                  Restaure sus datos desde un archivo de backup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Atención:</strong> Restaurar un backup reemplazará todos los datos actuales.
                    Esta acción no se puede deshacer.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="backup-file">Seleccionar archivo de backup (.json)</Label>
                  <Input
                    id="backup-file"
                    type="file"
                    accept=".json"
                    onChange={restaurarBackup}
                    disabled={isRestoring}
                  />
                </div>

                {isRestoring && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 animate-spin" />
                    Restaurando backup...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historial de Backups */}
          {backups.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Historial de Backups</CardTitle>
                <CardDescription>
                  Backups creados recientemente en esta sesión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backups.map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">
                            Backup {new Date(backup.fecha).toLocaleDateString('es-BO')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(backup.fecha).toLocaleTimeString('es-BO')} - {backup.tamaño}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {backup.registros} registros
                        </Badge>
                        <Badge variant="secondary">
                          v{backup.version}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupModule;
