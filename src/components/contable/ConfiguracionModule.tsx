
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  FileText, 
  Shield, 
  Database,
  Save,
  Upload,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ConfiguracionModule = () => {
  const { toast } = useToast();
  
  // Estado para datos de la empresa
  const [empresa, setEmpresa] = useState({
    razonSocial: "Empresa Demo S.R.L.",
    nit: "1234567890",
    telefono: "+591 2 2345678",
    email: "contacto@empresa.com",
    direccion: "Av. Principal #123, La Paz, Bolivia",
    actividadEconomica: "Servicios de consultoría",
    codigoSin: "001234567"
  });

  // Estado para configuración fiscal
  const [configFiscal, setConfigFiscal] = useState({
    ivaGeneral: 13,
    regimen: "general",
    modalidadFacturacion: "computarizada",
    ambienteSin: "test",
    sucursal: "0",
    puntoVenta: "0"
  });

  // Estado para configuración del sistema
  const [configSistema, setConfigSistema] = useState({
    monedaBase: "BOB",
    formatoFecha: "dd/mm/yyyy",
    decimalesMontos: 2,
    numeracionAutomatica: true,
    backupAutomatico: true,
    notificacionesEmail: true
  });

  const guardarConfiguracion = (seccion: string) => {
    toast({
      title: "Configuración guardada",
      description: `Los cambios en ${seccion} han sido guardados correctamente`,
    });
  };

  const exportarConfiguracion = () => {
    toast({
      title: "Configuración exportada",
      description: "El archivo de configuración ha sido descargado",
    });
  };

  const importarConfiguracion = () => {
    toast({
      title: "Configuración importada",
      description: "La configuración ha sido cargada correctamente",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
          <p className="text-slate-600">Gestión de parámetros y configuraciones generales</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={importarConfiguracion} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button onClick={exportarConfiguracion} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="empresa" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="fiscal">Configuración Fiscal</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* Datos de la Empresa */}
        <TabsContent value="empresa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Datos de la Empresa
              </CardTitle>
              <CardDescription>
                Información básica de la empresa para documentos oficiales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social</Label>
                  <Input
                    id="razonSocial"
                    value={empresa.razonSocial}
                    onChange={(e) => setEmpresa({...empresa, razonSocial: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nit">NIT</Label>
                  <Input
                    id="nit"
                    value={empresa.nit}
                    onChange={(e) => setEmpresa({...empresa, nit: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={empresa.telefono}
                    onChange={(e) => setEmpresa({...empresa, telefono: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={empresa.email}
                    onChange={(e) => setEmpresa({...empresa, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={empresa.direccion}
                  onChange={(e) => setEmpresa({...empresa, direccion: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="actividad">Actividad Económica</Label>
                  <Input
                    id="actividad"
                    value={empresa.actividadEconomica}
                    onChange={(e) => setEmpresa({...empresa, actividadEconomica: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigoSin">Código SIN</Label>
                  <Input
                    id="codigoSin"
                    value={empresa.codigoSin}
                    onChange={(e) => setEmpresa({...empresa, codigoSin: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={() => guardarConfiguracion("Empresa")} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Guardar Datos de Empresa
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración Fiscal */}
        <TabsContent value="fiscal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Configuración Fiscal
              </CardTitle>
              <CardDescription>
                Parámetros fiscales y de facturación electrónica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ivaGeneral">IVA General (%)</Label>
                  <Input
                    id="ivaGeneral"
                    type="number"
                    value={configFiscal.ivaGeneral}
                    onChange={(e) => setConfigFiscal({...configFiscal, ivaGeneral: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Régimen Tributario</Label>
                  <Select value={configFiscal.regimen} onValueChange={(value) => setConfigFiscal({...configFiscal, regimen: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Régimen General</SelectItem>
                      <SelectItem value="simplificado">Régimen Simplificado</SelectItem>
                      <SelectItem value="integrado">Régimen Integrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Modalidad de Facturación</Label>
                  <Select value={configFiscal.modalidadFacturacion} onValueChange={(value) => setConfigFiscal({...configFiscal, modalidadFacturacion: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computarizada">Computarizada</SelectItem>
                      <SelectItem value="preimpresa">Preimpresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ambiente SIN</Label>
                  <Select value={configFiscal.ambienteSin} onValueChange={(value) => setConfigFiscal({...configFiscal, ambienteSin: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Ambiente de Pruebas</SelectItem>
                      <SelectItem value="production">Ambiente de Producción</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sucursal">Código Sucursal</Label>
                  <Input
                    id="sucursal"
                    value={configFiscal.sucursal}
                    onChange={(e) => setConfigFiscal({...configFiscal, sucursal: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="puntoVenta">Punto de Venta</Label>
                  <Input
                    id="puntoVenta"
                    value={configFiscal.puntoVenta}
                    onChange={(e) => setConfigFiscal({...configFiscal, puntoVenta: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={() => guardarConfiguracion("Configuración Fiscal")} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración Fiscal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración del Sistema */}
        <TabsContent value="sistema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>
                Parámetros generales del sistema contable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Moneda Base</Label>
                  <Select value={configSistema.monedaBase} onValueChange={(value) => setConfigSistema({...configSistema, monedaBase: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOB">Boliviano (BOB)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Formato de Fecha</Label>
                  <Select value={configSistema.formatoFecha} onValueChange={(value) => setConfigSistema({...configSistema, formatoFecha: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decimales">Decimales en Montos</Label>
                  <Input
                    id="decimales"
                    type="number"
                    min="0"
                    max="4"
                    value={configSistema.decimalesMontos}
                    onChange={(e) => setConfigSistema({...configSistema, decimalesMontos: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Numeración Automática</Label>
                    <p className="text-sm text-slate-500">Generar números de documento automáticamente</p>
                  </div>
                  <Switch
                    checked={configSistema.numeracionAutomatica}
                    onCheckedChange={(checked) => setConfigSistema({...configSistema, numeracionAutomatica: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-slate-500">Realizar respaldos automáticos diarios</p>
                  </div>
                  <Switch
                    checked={configSistema.backupAutomatico}
                    onCheckedChange={(checked) => setConfigSistema({...configSistema, backupAutomatico: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-slate-500">Enviar notificaciones importantes por correo</p>
                  </div>
                  <Switch
                    checked={configSistema.notificacionesEmail}
                    onCheckedChange={(checked) => setConfigSistema({...configSistema, notificacionesEmail: checked})}
                  />
                </div>
              </div>

              <Button onClick={() => guardarConfiguracion("Sistema")} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración del Sistema
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup y Restauración */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Backup y Restauración
              </CardTitle>
              <CardDescription>
                Gestión de respaldos y restauración de datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Crear Backup</span>
                  <span className="text-xs text-slate-500">Exportar datos completos</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 mb-2" />
                  <span>Restaurar Backup</span>
                  <span className="text-xs text-slate-500">Importar datos desde archivo</span>
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Backups Recientes</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>backup_2024-06-15_08-00.zip</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Descargar</Button>
                      <Button size="sm" variant="outline">Restaurar</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>backup_2024-06-14_08-00.zip</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Descargar</Button>
                      <Button size="sm" variant="outline">Restaurar</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>backup_2024-06-13_08-00.zip</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Descargar</Button>
                      <Button size="sm" variant="outline">Restaurar</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracionModule;
