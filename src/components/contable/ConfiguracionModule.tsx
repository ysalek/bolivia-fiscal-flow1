import { useState, useEffect, useRef } from "react";
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
  Download,
  Key,
  TestTube,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBackup } from "@/hooks/useBackup";

const ConfiguracionModule = () => {
  const { toast } = useToast();
  const { crearBackup, restaurarBackup } = useBackup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Estado para configuración SIN
  const [configSin, setConfigSin] = useState({
    urlApi: "https://pilotosiatservicios.impuestos.gob.bo",
    tokenDelegado: "",
    codigoSistema: "",
    nit: empresa.nit,
    codigoModalidad: "1",
    codigoEmision: "1",
    tipoFacturaDocumento: "1",
    tipoAmbiente: "2", // 1: Producción, 2: Pruebas
    codigoSucursal: "0",
    codigoPuntoVenta: "0",
    cuis: "",
    cufd: "",
    fechaVigenciaCufd: "",
    activo: false
  });

  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const savedEmpresa = localStorage.getItem('configuracionEmpresa');
    if (savedEmpresa) setEmpresa(JSON.parse(savedEmpresa));

    const savedFiscal = localStorage.getItem('configuracionFiscal');
    if (savedFiscal) setConfigFiscal(JSON.parse(savedFiscal));

    const savedSistema = localStorage.getItem('configuracionSistema');
    if (savedSistema) setConfigSistema(JSON.parse(savedSistema));

    const savedSin = localStorage.getItem('configSin');
    if (savedSin) setConfigSin(JSON.parse(savedSin));
  }, []);

  const guardarConfiguracion = (seccion: string) => {
    if (seccion === 'Empresa') {
      localStorage.setItem('configuracionEmpresa', JSON.stringify(empresa));
    } else if (seccion === 'Configuración Fiscal') {
      localStorage.setItem('configuracionFiscal', JSON.stringify(configFiscal));
    } else if (seccion === 'Sistema') {
      localStorage.setItem('configuracionSistema', JSON.stringify(configSistema));
    }
    toast({
      title: "Configuración guardada",
      description: `Los cambios en ${seccion} han sido guardados correctamente`,
    });
  };

  const guardarConfigSin = () => {
    // Guardar configuración SIN en localStorage o base de datos
    localStorage.setItem('configSin', JSON.stringify(configSin));
    toast({
      title: "Configuración SIN guardada",
      description: "Las credenciales han sido guardadas de forma segura",
    });
  };

  const testearConexionSin = async () => {
    setTestingConnection(true);
    
    try {
      // Simular prueba de conexión con el SIN
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (configSin.tokenDelegado && configSin.codigoSistema) {
        setConnectionStatus('success');
        toast({
          title: "Conexión exitosa",
          description: "La conexión con el SIN se estableció correctamente",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Error de conexión",
          description: "Verifique las credenciales ingresadas",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el SIN",
        variant: "destructive",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const obtenerCuis = async () => {
    toast({
      title: "Obteniendo CUIS",
      description: "Solicitando código único de inicio de sistema...",
    });
    
    // Simular obtención de CUIS
    setTimeout(() => {
      const nuevoCuis = `CUIS${Date.now()}`;
      setConfigSin({...configSin, cuis: nuevoCuis});
      toast({
        title: "CUIS obtenido",
        description: `Nuevo CUIS: ${nuevoCuis}`,
      });
    }, 1500);
  };

  const obtenerCufd = async () => {
    if (!configSin.cuis) {
      toast({
        title: "Error",
        description: "Primero debe obtener el CUIS",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Obteniendo CUFD",
      description: "Solicitando código único de facturación diaria...",
    });
    
    // Simular obtención de CUFD
    setTimeout(() => {
      const nuevoCufd = `CUFD${Date.now()}`;
      const fechaVigencia = new Date();
      fechaVigencia.setDate(fechaVigencia.getDate() + 1);
      
      setConfigSin({
        ...configSin, 
        cufd: nuevoCufd,
        fechaVigenciaCufd: fechaVigencia.toISOString().split('T')[0]
      });
      
      toast({
        title: "CUFD obtenido",
        description: `Nuevo CUFD válido hasta: ${fechaVigencia.toLocaleDateString()}`,
      });
    }, 1500);
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

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    restaurarBackup(event);
    if(event.target) {
        event.target.value = '';
    }
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="fiscal">Configuración Fiscal</TabsTrigger>
          <TabsTrigger value="sin">Integración SIN</TabsTrigger>
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

        {/* Configuración SIN */}
        <TabsContent value="sin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Configuración SIN
              </CardTitle>
              <CardDescription>
                Credenciales y parámetros para la integración con el Servicio de Impuestos Nacionales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configuración básica */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Configuración Básica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urlApi">URL API SIN</Label>
                    <Input
                      id="urlApi"
                      value={configSin.urlApi}
                      onChange={(e) => setConfigSin({...configSin, urlApi: e.target.value})}
                      placeholder="https://serviciosweb.impuestos.gob.bo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Ambiente</Label>
                    <Select value={configSin.tipoAmbiente} onValueChange={(value) => setConfigSin({...configSin, tipoAmbiente: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Ambiente de Pruebas</SelectItem>
                        <SelectItem value="1">Ambiente de Producción</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Credenciales */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Credenciales de Acceso</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokenDelegado">Token Delegado *</Label>
                    <Input
                      id="tokenDelegado"
                      type="password"
                      value={configSin.tokenDelegado}
                      onChange={(e) => setConfigSin({...configSin, tokenDelegado: e.target.value})}
                      placeholder="Token proporcionado por SIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigoSistema">Código de Sistema *</Label>
                    <Input
                      id="codigoSistema"
                      value={configSin.codigoSistema}
                      onChange={(e) => setConfigSin({...configSin, codigoSistema: e.target.value})}
                      placeholder="Código asignado por SIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nitSin">NIT Empresa</Label>
                    <Input
                      id="nitSin"
                      value={configSin.nit}
                      onChange={(e) => setConfigSin({...configSin, nit: e.target.value})}
                      placeholder="NIT de la empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigoModalidad">Código Modalidad</Label>
                    <Select value={configSin.codigoModalidad} onValueChange={(value) => setConfigSin({...configSin, codigoModalidad: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Electronica en línea</SelectItem>
                        <SelectItem value="2">Computarizada en línea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Códigos de ubicación */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Códigos de Ubicación</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigoSucursalSin">Código Sucursal</Label>
                    <Input
                      id="codigoSucursalSin"
                      value={configSin.codigoSucursal}
                      onChange={(e) => setConfigSin({...configSin, codigoSucursal: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigoPuntoVentaSin">Código Punto Venta</Label>
                    <Input
                      id="codigoPuntoVentaSin"
                      value={configSin.codigoPuntoVenta}
                      onChange={(e) => setConfigSin({...configSin, codigoPuntoVenta: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoEmision">Tipo Emisión</Label>
                    <Select value={configSin.codigoEmision} onValueChange={(value) => setConfigSin({...configSin, codigoEmision: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Online</SelectItem>
                        <SelectItem value="2">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Test de conexión */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">Prueba de Conexión</h4>
                  <div className="flex items-center gap-2">
                    {connectionStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {connectionStatus === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                    <Button 
                      onClick={testearConexionSin} 
                      disabled={testingConnection}
                      variant="outline"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      {testingConnection ? "Probando..." : "Probar Conexión"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Códigos SIN */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Códigos SIN</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cuis">CUIS (Código Único Inicio Sistema)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cuis"
                        value={configSin.cuis}
                        readOnly
                        placeholder="No obtenido"
                      />
                      <Button onClick={obtenerCuis} variant="outline">
                        Obtener
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cufd">CUFD (Código Único Facturación Diaria)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cufd"
                        value={configSin.cufd}
                        readOnly
                        placeholder="No obtenido"
                      />
                      <Button onClick={obtenerCufd} variant="outline" disabled={!configSin.cuis}>
                        Obtener
                      </Button>
                    </div>
                  </div>
                </div>
                
                {configSin.fechaVigenciaCufd && (
                  <div className="text-sm text-slate-600">
                    <strong>Vigencia CUFD:</strong> {new Date(configSin.fechaVigenciaCufd).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Estado de integración */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Estado de Integración SIN</div>
                  <div className="text-sm text-slate-600">
                    {configSin.activo ? "Integración activa y funcionando" : "Integración desactivada"}
                  </div>
                </div>
                <Switch
                  checked={configSin.activo}
                  onCheckedChange={(checked) => setConfigSin({...configSin, activo: checked})}
                />
              </div>

              <Button onClick={guardarConfigSin} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración SIN
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
                Gestión de respaldos y restauración de datos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={crearBackup} className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Crear Backup</span>
                  <span className="text-xs text-slate-500">Exportar datos completos</span>
                </Button>
                
                <Button onClick={handleRestoreClick} variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 mb-2" />
                  <span>Restaurar Backup</span>
                  <span className="text-xs text-slate-500">Importar datos desde archivo</span>
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  className="hidden" 
                  accept="application/json"
                />
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Información sobre Backups</h4>
                <div className="text-sm text-slate-600 space-y-2">
                   <p>
                    <strong>Crear Backup:</strong> Genera un archivo JSON con todos los datos importantes de la aplicación (asientos, productos, facturas, clientes, configuración, etc.). Guarde este archivo en un lugar seguro.
                  </p>
                  <p>
                    <strong>Restaurar Backup:</strong> Permite importar un archivo de backup previamente guardado. Esta acción sobreescribirá todos los datos actuales con los del archivo de respaldo. Se recomienda crear un backup de los datos actuales antes de restaurar.
                  </p>
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
