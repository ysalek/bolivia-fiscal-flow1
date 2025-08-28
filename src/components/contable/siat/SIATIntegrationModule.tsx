import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  FileText,
  Calendar,
  Clock,
  Shield,
  Key
} from "lucide-react";

interface CUFDStatus {
  cufd: string;
  fechaVigencia: string;
  estado: 'vigente' | 'vencido' | 'pendiente';
}

interface ConfiguracionSIAT {
  ambiente: 'produccion' | 'pruebas';
  nit: string;
  sucursal: number;
  puntoVenta: number;
  actividadEconomica: string;
  ultimaConexion?: string;
  estadoConexion: 'conectado' | 'desconectado' | 'error';
}

const SIATIntegrationModule = () => {
  const [conexionSIAT, setConexionSIAT] = useState(false);
  const [cufdActual, setCufdActual] = useState<CUFDStatus | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionSIAT>({
    ambiente: 'pruebas',
    nit: '',
    sucursal: 0,
    puntoVenta: 0,
    actividadEconomica: '',
    estadoConexion: 'desconectado'
  });
  const [cargando, setCargando] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    verificarConexionSIAT();
    cargarConfiguracion();
  }, []);

  const verificarConexionSIAT = async () => {
    setCargando(true);
    try {
      // Simulación de verificación de conexión SIAT
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const conexionExitosa = Math.random() > 0.3; // 70% éxito simulado
      setConexionSIAT(conexionExitosa);
      
      if (conexionExitosa) {
        setConfiguracion(prev => ({
          ...prev,
          estadoConexion: 'conectado',
          ultimaConexion: new Date().toISOString()
        }));
        
        // Simular CUFD vigente
        setCufdActual({
          cufd: `CUFD-${Date.now().toString().slice(-8)}`,
          fechaVigencia: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          estado: 'vigente'
        });
        
        toast({
          title: "Conexión SIAT establecida",
          description: "Conectado exitosamente al Sistema Integrado de Administración Tributaria",
        });
      } else {
        setConfiguracion(prev => ({
          ...prev,
          estadoConexion: 'error'
        }));
        
        toast({
          title: "Error de conexión SIAT",
          description: "No se pudo establecer conexión con el servidor SIAT",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al verificar conexión SIAT",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const cargarConfiguracion = () => {
    // Cargar configuración desde localStorage o base de datos
    const configGuardada = localStorage.getItem('siat-config');
    if (configGuardada) {
      setConfiguracion(prev => ({
        ...prev,
        ...JSON.parse(configGuardada)
      }));
    }
  };

  const renovarCUFD = async () => {
    setCargando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nuevoCUFD: CUFDStatus = {
        cufd: `CUFD-${Date.now().toString().slice(-8)}`,
        fechaVigencia: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        estado: 'vigente'
      };
      
      setCufdActual(nuevoCUFD);
      
      toast({
        title: "CUFD renovado",
        description: "Código Único de Facturación Diario renovado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo renovar el CUFD",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const serviciosSIAT = [
    {
      nombre: "Facturación Electrónica",
      estado: conexionSIAT ? 'activo' : 'inactivo',
      descripcion: "Emisión de facturas electrónicas a través de SIAT"
    },
    {
      nombre: "Consulta NIT",
      estado: conexionSIAT ? 'activo' : 'inactivo',
      descripcion: "Verificación de validez de NIT de contribuyentes"
    },
    {
      nombre: "Declaraciones en Línea",
      estado: conexionSIAT ? 'activo' : 'inactivo',
      descripcion: "Presentación de declaraciones tributarias online"
    },
    {
      nombre: "Facilidades de Pago",
      estado: conexionSIAT ? 'activo' : 'inactivo',
      descripcion: "Gestión de facilidades de pago tributario"
    },
    {
      nombre: "Control ICE",
      estado: conexionSIAT ? 'activo' : 'inactivo',
      descripcion: "Control de existencias y producción ICE"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Integración SIAT</h2>
            <p className="text-muted-foreground">
              Sistema Integrado de Administración Tributaria
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={verificarConexionSIAT} 
            disabled={cargando}
            variant={conexionSIAT ? "default" : "destructive"}
          >
            {cargando ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : conexionSIAT ? (
              <Wifi className="w-4 h-4 mr-2" />
            ) : (
              <WifiOff className="w-4 h-4 mr-2" />
            )}
            {cargando ? 'Conectando...' : conexionSIAT ? 'Conectado' : 'Reconectar'}
          </Button>
        </div>
      </div>

      {/* Estado de conexión */}
      {configuracion.estadoConexion === 'error' && (
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de Conexión SIAT</AlertTitle>
          <AlertDescription>
            No se pudo establecer conexión con el servidor SIAT. Verifique su conexión a internet y configuración.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="estado" className="w-full">
        <TabsList>
          <TabsTrigger value="estado">Estado de Conexión</TabsTrigger>
          <TabsTrigger value="cufd">Gestión CUFD</TabsTrigger>
          <TabsTrigger value="servicios">Servicios SIAT</TabsTrigger>
        </TabsList>

        <TabsContent value="estado">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Estado de Conexión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Ambiente:</span>
                  <Badge variant={configuracion.ambiente === 'produccion' ? 'default' : 'secondary'}>
                    {configuracion.ambiente === 'produccion' ? 'Producción' : 'Pruebas'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Estado:</span>
                  <Badge variant={conexionSIAT ? 'default' : 'destructive'}>
                    {conexionSIAT ? 'Conectado' : 'Desconectado'}
                  </Badge>
                </div>
                
                {configuracion.ultimaConexion && (
                  <div className="flex items-center justify-between">
                    <span>Última conexión:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(configuracion.ultimaConexion).toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">NIT:</label>
                    <p className="text-sm text-muted-foreground">
                      {configuracion.nit || 'No configurado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sucursal:</label>
                    <p className="text-sm text-muted-foreground">
                      {configuracion.sucursal || 'No configurado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Punto de Venta:</label>
                    <p className="text-sm text-muted-foreground">
                      {configuracion.puntoVenta || 'No configurado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Actividad:</label>
                    <p className="text-sm text-muted-foreground">
                      {configuracion.actividadEconomica || 'No configurado'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cufd">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Gestión CUFD (Código Único Facturación Diaria)
              </CardTitle>
              <CardDescription>
                El CUFD debe renovarse diariamente para la facturación electrónica
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cufdActual ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium">CUFD Vigente</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Código: {cufdActual.cufd}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Vigente hasta: {new Date(cufdActual.fechaVigencia).toLocaleString()}
                      </div>
                    </div>
                    <Button onClick={renovarCUFD} disabled={cargando}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${cargando ? 'animate-spin' : ''}`} />
                      Renovar CUFD
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No hay CUFD vigente</p>
                  <Button onClick={renovarCUFD} disabled={cargando || !conexionSIAT}>
                    <Key className="w-4 h-4 mr-2" />
                    Obtener CUFD
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicios">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviciosSIAT.map((servicio, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{servicio.nombre}</CardTitle>
                  <CardDescription>{servicio.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={servicio.estado === 'activo' ? 'default' : 'secondary'}>
                      {servicio.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {servicio.estado === 'activo' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SIATIntegrationModule;