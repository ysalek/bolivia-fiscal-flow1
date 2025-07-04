
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Database, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BackupModule = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const { toast } = useToast();

  const getAllLocalStorageData = () => {
    const data: { [key: string]: any } = {};
    const keys = [
      'facturas',
      'clientes',
      'productos',
      'asientosContables',
      'movimientosInventario',
      'proveedores',
      'compras'
    ];

    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch (error) {
          data[key] = value;
        }
      }
    });

    return data;
  };

  const getBackupInfo = () => {
    const data = getAllLocalStorageData();
    return {
      facturas: data.facturas?.length || 0,
      clientes: data.clientes?.length || 0,
      productos: data.productos?.length || 0,
      asientos: data.asientosContables?.length || 0,
      movimientos: data.movimientosInventario?.length || 0,
      proveedores: data.proveedores?.length || 0,
      compras: data.compras?.length || 0
    };
  };

  const exportBackup = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simular progreso
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const data = getAllLocalStorageData();
      const backup = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        sistema: "Sistema Contable Boliviano",
        data: data
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
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

      toast({
        title: "Backup exportado",
        description: "El respaldo se ha descargado exitosamente.",
      });

    } catch (error) {
      toast({
        title: "Error en exportación",
        description: "No se pudo crear el backup. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const importBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content);

        if (!backup.data || !backup.version) {
          throw new Error("Formato de backup inválido");
        }

        // Simular progreso
        for (let i = 0; i <= 100; i += 20) {
          setImportProgress(i);
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Restaurar datos
        Object.keys(backup.data).forEach(key => {
          localStorage.setItem(key, JSON.stringify(backup.data[key]));
        });

        toast({
          title: "Backup restaurado",
          description: "Los datos se han restaurado exitosamente. Recargue la página.",
        });

      } catch (error) {
        toast({
          title: "Error en importación",
          description: "El archivo de backup es inválido o está corrupto.",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
        setImportProgress(0);
        if (event.target) {
          event.target.value = '';
        }
      }
    };

    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm("¿Está seguro de eliminar TODOS los datos? Esta acción no se puede deshacer.")) {
      const keys = [
        'facturas',
        'clientes', 
        'productos',
        'asientosContables',
        'movimientosInventario',
        'proveedores',
        'compras'
      ];

      keys.forEach(key => localStorage.removeItem(key));

      toast({
        title: "Datos eliminados",
        description: "Todos los datos han sido eliminados. Recargue la página.",
        variant: "destructive"
      });
    }
  };

  const backupInfo = getBackupInfo();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Backup y Restauración
          </CardTitle>
          <CardDescription>
            Respalde y restaure todos los datos del sistema contable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Es recomendable realizar backups periódicos para proteger su información contable.
              Los backups incluyen facturas, clientes, productos, asientos contables y movimientos de inventario.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado Actual del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Facturas:</span>
                  <Badge variant="outline">{backupInfo.facturas}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Clientes:</span>
                  <Badge variant="outline">{backupInfo.clientes}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Productos:</span>
                  <Badge variant="outline">{backupInfo.productos}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Asientos Contables:</span>
                  <Badge variant="outline">{backupInfo.asientos}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Movimientos Inventario:</span>
                  <Badge variant="outline">{backupInfo.movimientos}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Proveedores:</span>
                  <Badge variant="outline">{backupInfo.proveedores}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Compras:</span>
                  <Badge variant="outline">{backupInfo.compras}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Panel de Acciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones de Respaldo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Exportar Backup */}
                <div className="space-y-2">
                  <Label>Exportar Backup</Label>
                  <Button 
                    onClick={exportBackup} 
                    disabled={isExporting}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? 'Exportando...' : 'Descargar Backup'}
                  </Button>
                  {isExporting && (
                    <Progress value={exportProgress} className="w-full" />
                  )}
                </div>

                {/* Importar Backup */}
                <div className="space-y-2">
                  <Label htmlFor="backup-file">Restaurar Backup</Label>
                  <Input
                    id="backup-file"
                    type="file"
                    accept=".json"
                    onChange={importBackup}
                    disabled={isImporting}
                  />
                  {isImporting && (
                    <Progress value={importProgress} className="w-full" />
                  )}
                </div>

                {/* Limpiar Datos */}
                <div className="pt-4 border-t">
                  <Button 
                    onClick={clearAllData}
                    variant="destructive"
                    className="w-full"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Eliminar Todos los Datos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instrucciones */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Instrucciones de Uso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Crear Backup:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Haga clic en "Descargar Backup"</li>
                    <li>• Se descargará un archivo JSON</li>
                    <li>• Guarde el archivo en un lugar seguro</li>
                    <li>• El backup incluye todos sus datos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Restaurar Backup:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Seleccione el archivo de backup (.json)</li>
                    <li>• Los datos se restaurarán automáticamente</li>
                    <li>• Recargue la página después de restaurar</li>
                    <li>• Los datos actuales serán reemplazados</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupModule;
