
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
    if (confirm("¿Está COMPLETAMENTE SEGURO de reiniciar el sistema? Esta acción eliminará TODOS los datos operativos (facturas, clientes, productos, asientos, inventario, etc.) pero mantendrá el Plan de Cuentas con saldos en CERO. Esta acción NO se puede deshacer.")) {
      if (confirm("CONFIRMACIÓN FINAL: Se eliminarán todos los datos operativos incluyendo TODO EL INVENTARIO y se resetearán los saldos a CERO. ¿Continuar?")) {
        console.log("🧹 Iniciando limpieza completa del sistema...");
        
        // Lista COMPLETA de datos operativos a eliminar (incluyendo TODOS los datos de inventario)
        const keysToDelete = [
          // Datos principales
          'facturas',
          'clientes', 
          'productos',
          'asientosContables',
          'proveedores',
          'compras',
          'comprobantes_integrados',
          
          // INVENTARIO - TODOS los datos relacionados
          'movimientosInventario',
          'inventarioProductos',
          'productosInventario',
          'stockActual',
          'costoPromedioPonderado',
          'valorInventario',
          'alertasInventario',
          'ubicacionesProductos',
          'categoriasProductos',
          'unidadesMedida',
          'registrosInventario',
          'historialInventario',
          'ajustesInventario',
          'entradaInventario',
          'salidaInventario',
          'inventarioFisico',
          'conteoInventario',
          'diferenciasInventario',
          'valoracionInventario',
          'inventarioMinimo',
          'inventarioMaximo',
          'puntosReorden',
          'proveedoresProductos',
          'costosProductos',
          'preciosProductos',
          'inventarioValuado',
          'resumenInventario',
          'totalInventario',
          'inventarioActual',
          'existenciasProductos',
          'movimientosProductos',
          'transaccionesInventario',
          'operacionesInventario',
          
          // Cuentas por cobrar/pagar
          'cuentasPorCobrar',
          'cuentasPorPagar',
          'pagosFacturas',
          'pagosCompras',
          'anticiposClientes',
          'anticiposProveedores',
          'cobranzas',
          'pagosRealizados',
          'documentosPorCobrar',
          'documentosPorPagar',
          
          // Movimientos bancarios
          'movimientosBanco',
          'conciliacionBancaria',
          'cuentasBancarias',
          'cheques',
          'transferencias',
          'depositosBancarios',
          'retirosBancarios',
          'estadosCuenta',
          
          // Activos fijos
          'activosFijos',
          'depreciaciones',
          'mantenimientosActivos',
          'bajaActivos',
          'revaluacionActivos',
          
          // Nómina
          'nomina',
          'empleados',
          'planillas',
          'descuentos',
          'bonificaciones',
          'aguinaldos',
          'liquidaciones',
          'sueldos',
          'salarios',
          
          // Centros de costo
          'centrosCosto',
          'asignacionesCosto',
          'distribucionCostos',
          
          // Presupuestos
          'presupuestos',
          'ejecucionPresupuestal',
          'variacionesPresupuestales',
          
          // Kardex y movimientos
          'kardex',
          'movimientosKardex',
          'ventasDelDia',
          'comprasDelDia',
          'movimientosDiarios',
          
          // Contadores y numeración
          'ultimaFactura',
          'ultimaCompra',
          'ultimoAsiento',
          'ultimoComprobante',
          'ultimoMovimiento',
          'numeracionDocumentos',
          'correlativos',
          
          // Saldos y movimientos contables
          'saldosCuentas',
          'movimientosCuentas',
          'balanceComprobacion',
          'estadoResultados',
          'balanceGeneral',
          'flujoEfectivo',
          'libroMayor',
          'libroDiario',
          
          // Auditoría y logs
          'auditoria',
          'logsTransacciones',
          'historialCambios',
          'registrosAuditoria',
          'logsSistema',
          
          // Notificaciones y alertas
          'notificaciones',
          'alertas',
          'alertasStock',
          'alertasVencimientos',
          'alertasSistema',
          'avisos',
          'recordatorios',
          
          // Configuraciones operativas (mantener solo las básicas del sistema)
          'configuracionVentas',
          'configuracionCompras',
          'configuracionInventario',
          'configuracionContable',
          'configuracionReportes',
          'configuracionFacturacion',
          'configuracionPOS',
          
          // Reportes generados
          'reportesGenerados',
          'exportacionesDatos',
          'informesContables',
          'estadisticas',
          
          // Datos temporales y de sesión
          'sesionActual',
          'carritoVentas',
          'facturaEnProceso',
          'compraEnProceso',
          'asientoEnProceso',
          'datosTemporales',
          'cache',
          
          // POS y punto de venta
          'ventasPOS',
          'cajaDiaria',
          'arqueosCaja',
          'ventasContado',
          'ventasCredito',
          
          // Impuestos y declaraciones
          'declaracionesIVA',
          'librosIVA',
          'impuestosPagados',
          'retencionesIVA',
          'retencionesIT',
          
          // Backups y versiones
          'ultimo-backup',
          'fechaUltimoBackup',
          'versionSistema',
          'versionDatos',
          
          // Datos adicionales que puedan existir
          'transacciones',
          'operaciones',
          'registros',
          'historiales',
          'logs',
          'eventos',
          'procesos'
        ];

        console.log(`🗑️ Eliminando ${keysToDelete.length} tipos de datos...`);

        // ELIMINAR TODOS los datos operativos
        keysToDelete.forEach(key => {
          const existe = localStorage.getItem(key);
          if (existe) {
            console.log(`🗑️ Eliminando: ${key}`);
            localStorage.removeItem(key);
          }
        });

        // VERIFICAR que NO queden datos residuales - Limpieza exhaustiva
        console.log("🔍 Verificando datos residuales...");
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && 
              !key.includes('planCuentas') && 
              !key.includes('configSin') && 
              !key.includes('configuracionEmpresa') && 
              !key.includes('configuracionFiscal') && 
              !key.includes('configuracionSistema')) {
            console.warn(`⚠️ Eliminando dato residual: ${key}`);
            localStorage.removeItem(key);
            i--; // Ajustar índice porque se removió un elemento
          }
        }

        console.log("🏭 Reinicializando datos básicos VACÍOS...");

        // Reinicializar con arrays COMPLETAMENTE VACÍOS
        const datosBasicosVacios = {
          'facturas': [],
          'clientes': [],
          'productos': [],
          'asientosContables': [],
          'movimientosInventario': [],
          'inventarioProductos': [],
          'productosInventario': [],
          'proveedores': [],
          'compras': [],
          'comprobantes_integrados': [],
          'notificaciones': [],
          'alertas': [],
          'kardex': [],
          'registrosInventario': [],
          'historialInventario': []
        };

        Object.entries(datosBasicosVacios).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
          console.log(`✅ Inicializado VACÍO: ${key} = []`);
        });

        // Reinicializar contadores a CERO
        const contadoresEnCero = {
          'ultimaFactura': '0',
          'ultimaCompra': '0',
          'ultimoAsiento': '0',
          'ultimoComprobante': '0',
          'ultimoMovimiento': '0',
          'numeroFactura': '0',
          'numeroCompra': '0',
          'numeroAsiento': '0'
        };

        Object.entries(contadoresEnCero).forEach(([key, value]) => {
          localStorage.setItem(key, value);
          console.log(`🔢 Contador en CERO: ${key} = ${value}`);
        });

        // RESETEAR Plan de Cuentas - MANTENER estructura pero SALDOS EN CERO
        console.log("📊 Reseteando saldos del Plan de Cuentas a CERO...");
        const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
        const planCuentasReset = planCuentas.map((cuenta: any) => ({
          ...cuenta,
          saldo: 0, // TODOS los saldos en CERO
          movimientos: [],
          totalDebe: 0,
          totalHaber: 0,
          fechaUltimoMovimiento: null,
          saldoAnterior: 0,
          saldoActual: 0
        }));
        localStorage.setItem('planCuentas', JSON.stringify(planCuentasReset));
        console.log("📊 Plan de Cuentas reseteado - TODOS los saldos en CERO");

        // Marcar fecha de reinicio y estado del sistema
        const fechaReinicio = new Date().toISOString();
        localStorage.setItem('fechaUltimaLimpieza', fechaReinicio);
        localStorage.setItem('sistemaReinicializado', 'true');
        localStorage.setItem('estadoSistema', 'virgen');
        localStorage.setItem('datosEliminados', 'completo');

        console.log("✅ LIMPIEZA COMPLETA FINALIZADA - Sistema completamente virgen");
        console.log("📊 Plan de Cuentas mantenido con saldos en CERO");
        console.log("🗂️ Todos los datos operativos eliminados");
        console.log("📦 Todo el inventario eliminado");

        toast({
          title: "Sistema Completamente Reiniciado",
          description: "TODOS los datos operativos han sido eliminados incluyendo inventario completo. Plan de Cuentas mantenido con saldos en CERO. El sistema está completamente virgen.",
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
                    Reiniciar Sistema Completamente (ELIMINAR TODO)
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Elimina TODOS los datos operativos incluido el inventario completo. Plan de Cuentas mantenido con saldos en CERO.
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
                    <li>• Incluye inventario y movimientos</li>
                    <li>• Plan de Cuentas con saldos en CERO</li>
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
