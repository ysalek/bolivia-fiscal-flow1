
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
import { useBackup } from "@/hooks/useBackup";

const BackupModule = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const { toast } = useToast();
  const { crearBackup, restaurarBackup } = useBackup();

  const getAllLocalStorageData = () => {
    const data: { [key: string]: any } = {};
    const keys = [
      'facturas',
      'clientes',
      'productos',
      'asientosContables',
      'movimientosInventario',
      'proveedores',
      'compras',
      'comprobantes_integrados'
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
      compras: data.compras?.length || 0,
      comprobantes: data.comprobantes_integrados?.length || 0
    };
  };

  const exportBackup = async () => {
    crearBackup();
  };

  const importBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    restaurarBackup(event);
  };

  const resetSystemToVirginState = () => {
    if (confirm("¿Está COMPLETAMENTE SEGURO de reiniciar el sistema? Esta acción eliminará TODOS los datos operativos (facturas, clientes, productos, asientos, etc.) pero mantendrá el Plan de Cuentas. Esta acción NO se puede deshacer.")) {
      if (confirm("CONFIRMACIÓN FINAL: Se eliminarán todos los datos operativos. ¿Continuar?")) {
        // Lista completa de datos operativos a eliminar
        const keysToDelete = [
          'facturas',
          'clientes', 
          'productos',
          'asientosContables',
          'movimientosInventario',
          'proveedores',
          'compras',
          'comprobantes_integrados',
          'cuentasPorCobrar',
          'cuentasPorPagar',
          'movimientosBanco',
          'activosFijos',
          'depreciaciones',
          'nomina',
          'empleados',
          'centrosCosto',
          'presupuestos',
          'kardex',
          'ventasDelDia',
          'comprasDelDia',
          'ultimaFactura',
          'ultimaCompra',
          'ultimoAsiento',
          'saldosCuentas',
          'movimientosCuentas',
          'balanceComprobacion',
          'estadoResultados',
          'flujoEfectivo',
          'conciliacionBancaria',
          'auditoria',
          'notificaciones',
          'alertas',
          'configuracionVentas',
          'configuracionCompras',
          'configuracionInventario',
          'configuracionContable'
        ];

        // Eliminar todos los datos operativos
        keysToDelete.forEach(key => {
          localStorage.removeItem(key);
        });

        // Reinicializar con arrays vacíos los datos básicos
        localStorage.setItem('facturas', JSON.stringify([]));
        localStorage.setItem('clientes', JSON.stringify([]));
        localStorage.setItem('productos', JSON.stringify([]));
        localStorage.setItem('asientosContables', JSON.stringify([]));
        localStorage.setItem('movimientosInventario', JSON.stringify([]));
        localStorage.setItem('proveedores', JSON.stringify([]));
        localStorage.setItem('compras', JSON.stringify([]));
        localStorage.setItem('comprobantes_integrados', JSON.stringify([]));

        // Reinicializar contadores
        localStorage.setItem('ultimaFactura', '0');
        localStorage.setItem('ultimaCompra', '0');
        localStorage.setItem('ultimoAsiento', '0');

        // Resetear saldos de cuentas en el Plan de Cuentas (mantener estructura pero limpiar saldos)
        const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
        const planCuentasReset = planCuentas.map((cuenta: any) => ({
          ...cuenta,
          saldo: cuenta.codigo === "3111" ? 100000 : 0, // Mantener solo el capital inicial
          movimientos: []
        }));
        localStorage.setItem('planCuentas', JSON.stringify(planCuentasReset));

        // Actualizar fecha de último backup
        localStorage.setItem('ultimo-backup', new Date().toISOString());

        toast({
          title: "Sistema reiniciado exitosamente",
          description: "Todos los datos operativos han sido eliminados. El sistema está listo para empezar desde cero. La página se recargará en 3 segundos.",
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
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
                <div className="flex justify-between items-center">
                  <span>Comprobantes:</span>
                  <Badge variant="outline">{backupInfo.comprobantes}</Badge>
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
                    Descargar Backup
                  </Button>
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
                </div>

                {/* Reiniciar Sistema */}
                <div className="pt-4 border-t">
                  <Button 
                    onClick={resetSystemToVirginState}
                    variant="destructive"
                    className="w-full"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reiniciar Sistema (Borrar Datos Operativos)
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Elimina todos los datos operativos pero mantiene el Plan de Cuentas
                  </p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div>
                  <h4 className="font-semibold mb-2">Reiniciar Sistema:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Elimina TODOS los datos operativos</li>
                    <li>• Mantiene el Plan de Cuentas intacto</li>
                    <li>• El sistema queda como recién instalado</li>
                    <li>• PRECAUCIÓN: No se puede deshacer</li>
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
