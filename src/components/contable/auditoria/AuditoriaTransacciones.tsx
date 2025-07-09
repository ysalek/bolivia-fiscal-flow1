
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertTriangle, CheckCircle, Search, Download, Eye, Filter, RefreshCw, TrendingUp, Users, FileText } from "lucide-react";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { useToast } from "@/hooks/use-toast";

interface TransaccionAuditoria {
  id: string;
  fecha: string;
  tipo: 'asiento' | 'factura' | 'compra' | 'pago' | 'ajuste' | 'comprobante';
  numero: string;
  descripcion: string;
  monto: number;
  usuario: string;
  estado: 'normal' | 'sospechosa' | 'bloqueada';
  riesgo: 'bajo' | 'medio' | 'alto';
  observaciones: string;
  fechaCreacion: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}

interface ControlInterno {
  id: string;
  nombre: string;
  tipo: 'segregacion' | 'autorizacion' | 'documentacion' | 'conciliacion' | 'supervision';
  descripcion: string;
  estado: 'cumple' | 'no_cumple' | 'parcial';
  ultimaRevision: string;
  responsable: string;
  hallazgos: string[];
  recomendaciones: string[];
  prioridad: 'alta' | 'media' | 'baja';
}

interface PistaAuditoria {
  id: string;
  transaccionId: string;
  accion: 'creacion' | 'modificacion' | 'eliminacion' | 'consulta' | 'aprobacion';
  usuario: string;
  fecha: string;
  ip: string;
  detalles: string;
  valorAnterior?: string;
  valorNuevo?: string;
}

const AuditoriaTransacciones = () => {
  const [transacciones, setTransacciones] = useState<TransaccionAuditoria[]>([]);
  const [controles, setControles] = useState<ControlInterno[]>([]);
  const [pistasAuditoria, setPistasAuditoria] = useState<PistaAuditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    usuario: "",
    tipo: "",
    riesgo: "",
    estado: ""
  });
  
  const { getAsientos } = useContabilidadIntegration();
  const { toast } = useToast();

  useEffect(() => {
    inicializarDatos();
  }, []);

  const inicializarDatos = async () => {
    setLoading(true);
    try {
      await Promise.all([
        cargarDatosAuditoria(),
        cargarControlesInternos(),
        generarPistasAuditoria()
      ]);
      toast({
        title: "Datos cargados exitosamente",
        description: "La auditoría está lista para su revisión",
      });
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "Algunos datos podrían no estar disponibles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosAuditoria = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Obtener asientos contables reales del sistema
    const asientos = getAsientos();
    
    // Obtener comprobantes del localStorage
    const comprobantesData = localStorage.getItem('comprobantes');
    const comprobantes = comprobantesData ? JSON.parse(comprobantesData) : [];
    
    // Convertir asientos a formato de auditoría
    const transaccionesAsientos: TransaccionAuditoria[] = asientos.map(asiento => ({
      id: asiento.id,
      fecha: asiento.fecha,
      tipo: 'asiento',
      numero: asiento.numero,
      descripcion: asiento.concepto,
      monto: asiento.debe,
      usuario: 'Sistema Contable',
      estado: evaluarEstadoTransaccion(asiento),
      riesgo: evaluarRiesgoTransaccion(asiento),
      observaciones: asiento.referencia || 'Registro automático del sistema',
      fechaCreacion: asiento.fecha,
    }));

    // Convertir comprobantes a formato de auditoría
    const transaccionesComprobantes: TransaccionAuditoria[] = comprobantes.map((comp: any) => ({
      id: comp.id,
      fecha: comp.fecha,
      tipo: 'comprobante',
      numero: comp.numero,
      descripcion: `${comp.tipo.charAt(0).toUpperCase() + comp.tipo.slice(1)} - ${comp.concepto}`,
      monto: comp.monto,
      usuario: comp.creadoPor,
      estado: comp.estado === 'autorizado' ? 'normal' : comp.estado === 'anulado' ? 'bloqueada' : 'sospechosa',
      riesgo: comp.monto > 50000 ? 'alto' : comp.monto > 10000 ? 'medio' : 'bajo',
      observaciones: comp.observaciones || `Comprobante de ${comp.tipo}`,
      fechaCreacion: comp.fechaCreacion,
    }));

    // Datos demo adicionales
    const transaccionesDemo: TransaccionAuditoria[] = [
      {
        id: "TXN-2024-001",
        fecha: "2024-01-15",
        tipo: "factura",
        numero: "FAC-001234",
        descripcion: "Venta de productos de ferretería - Cliente Premium S.A.",
        monto: 18750,
        usuario: "María González",
        estado: "normal",
        riesgo: "bajo",
        observaciones: "Transacción procesada normalmente. Cliente con historial excelente.",
        fechaCreacion: "2024-01-15 09:30:15",
      },
      {
        id: "TXN-2024-002",
        fecha: "2024-01-16",
        tipo: "pago",
        numero: "PAG-000567",
        descripcion: "Pago urgente a proveedor crítico - Materiales Ltda.",
        monto: 125000,
        usuario: "Carlos Mendoza",
        estado: "sospechosa",
        riesgo: "alto",
        observaciones: "⚠️ ALERTA: Pago procesado fuera del horario laboral (22:30 hrs). Requiere verificación del supervisor.",
        fechaCreacion: "2024-01-16 22:30:45",
        fechaModificacion: "2024-01-17 08:15:30",
        usuarioModificacion: "Admin Sistema"
      }
    ];

    setTransacciones([...transaccionesAsientos, ...transaccionesComprobantes, ...transaccionesDemo]);
  };

  const evaluarEstadoTransaccion = (asiento: any): 'normal' | 'sospechosa' | 'bloqueada' => {
    if (asiento.debe > 100000) return 'sospechosa';
    if (asiento.concepto.toLowerCase().includes('ajuste')) return 'sospechosa';
    if (asiento.concepto.toLowerCase().includes('error')) return 'bloqueada';
    return 'normal';
  };

  const evaluarRiesgoTransaccion = (asiento: any): 'bajo' | 'medio' | 'alto' => {
    if (asiento.debe > 50000) return 'alto';
    if (asiento.debe > 10000) return 'medio';
    return 'bajo';
  };

  const cargarControlesInternos = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const controlesDemo: ControlInterno[] = [
      {
        id: "CTRL-001",
        nombre: "Segregación de Funciones Financieras",
        tipo: "segregacion",
        descripcion: "Separación entre quien autoriza, registra y custodia operaciones financieras",
        estado: "cumple",
        ultimaRevision: "2024-01-15",
        responsable: "Auditor Interno - Ing. Patricia López",
        hallazgos: [],
        recomendaciones: ["Mantener la separación actual de funciones", "Documentar excepciones cuando sea necesario"],
        prioridad: "baja"
      },
      {
        id: "CTRL-002",
        nombre: "Autorización de Comprobantes",
        tipo: "autorizacion",
        descripcion: "Todos los comprobantes deben ser autorizados antes de generar asientos contables",
        estado: "cumple",
        ultimaRevision: "2024-01-18",
        responsable: "Gerente Financiero - Lic. Jorge Ramírez",
        hallazgos: [],
        recomendaciones: [
          "✅ El sistema funciona correctamente bloqueando comprobantes no autorizados",
          "📊 Se están generando correctamente los asientos contables"
        ],
        prioridad: "baja"
      }
    ];
    setControles(controlesDemo);
  };

  const generarPistasAuditoria = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pistasDemo: PistaAuditoria[] = [
      {
        id: "AUDIT-001",
        transaccionId: "TXN-2024-002",
        accion: "modificacion",
        usuario: "Admin Sistema",
        fecha: "2024-01-17 08:15:30",
        ip: "192.168.1.100",
        detalles: "Modificación de observaciones tras revisión gerencial"
      }
    ];
    setPistasAuditoria(pistasDemo);
  };

  const transaccionesFiltradas = transacciones.filter(t => {
    if (filtros.usuario && !t.usuario.toLowerCase().includes(filtros.usuario.toLowerCase())) return false;
    if (filtros.tipo && t.tipo !== filtros.tipo) return false;
    if (filtros.riesgo && t.riesgo !== filtros.riesgo) return false;
    if (filtros.estado && t.estado !== filtros.estado) return false;
    return true;
  });

  const getEstadoBadge = (estado: string) => {
    const badges = {
      'normal': { color: 'bg-green-100 text-green-800 border-green-200', text: '✅ Normal' },
      'sospechosa': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: '⚠️ Sospechosa' },
      'bloqueada': { color: 'bg-red-100 text-red-800 border-red-200', text: '🚫 Bloqueada' }
    };
    return badges[estado as keyof typeof badges] || badges.normal;
  };

  const getRiesgoBadge = (riesgo: string) => {
    const badges = {
      'bajo': { color: 'bg-green-100 text-green-800 border-green-200', text: '🟢 Bajo' },
      'medio': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: '🟡 Medio' },
      'alto': { color: 'bg-red-100 text-red-800 border-red-200', text: '🔴 Alto' }
    };
    return badges[riesgo as keyof typeof badges] || badges.bajo;
  };

  const getControlBadge = (estado: string) => {
    const badges = {
      'cumple': { color: 'bg-green-100 text-green-800 border-green-200', text: '✅ Cumple' },
      'parcial': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: '⚠️ Parcial' },
      'no_cumple': { color: 'bg-red-100 text-red-800 border-red-200', text: '❌ No Cumple' }
    };
    return badges[estado as keyof typeof badges] || badges.cumple;
  };

  const estadisticas = {
    totalTransacciones: transacciones.length,
    transaccionesSospechosas: transacciones.filter(t => t.estado === 'sospechosa').length,
    riesgoAlto: transacciones.filter(t => t.riesgo === 'alto').length,
    controlesCumplidos: controles.filter(c => c.estado === 'cumple').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel de Control */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transacciones</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.totalTransacciones}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sospechosas</p>
                <p className="text-2xl font-bold text-yellow-600">{estadisticas.transaccionesSospechosas}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Riesgo Alto</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.riesgoAlto}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Controles OK</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.controlesCumplidos}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transacciones" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
          <TabsTrigger value="controles">Controles Internos</TabsTrigger>
          <TabsTrigger value="pistas">Pistas de Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="transacciones">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Monitoreo de Transacciones</CardTitle>
                <Button variant="outline" onClick={inicializarDatos}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label>Usuario</Label>
                  <Input
                    placeholder="Buscar usuario..."
                    value={filtros.usuario}
                    onChange={(e) => setFiltros(prev => ({ ...prev, usuario: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={filtros.tipo} onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="asiento">Asiento</SelectItem>
                      <SelectItem value="comprobante">Comprobante</SelectItem>
                      <SelectItem value="factura">Factura</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Riesgo</Label>
                  <Select value={filtros.riesgo} onValueChange={(value) => setFiltros(prev => ({ ...prev, riesgo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="bajo">Bajo</SelectItem>
                      <SelectItem value="medio">Medio</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select value={filtros.estado} onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="sospechosa">Sospechosa</SelectItem>
                      <SelectItem value="bloqueada">Bloqueada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tabla de Transacciones */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Monto (Bs.)</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Riesgo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaccionesFiltradas.map(transaccion => (
                    <TableRow key={transaccion.id}>
                      <TableCell>{transaccion.fecha}</TableCell>
                      <TableCell className="capitalize">{transaccion.tipo}</TableCell>
                      <TableCell className="font-mono">{transaccion.numero}</TableCell>
                      <TableCell className="max-w-xs truncate">{transaccion.descripcion}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {transaccion.monto.toLocaleString('es-BO')}
                      </TableCell>
                      <TableCell>{transaccion.usuario}</TableCell>
                      <TableCell>
                        <Badge className={getEstadoBadge(transaccion.estado).color}>
                          {getEstadoBadge(transaccion.estado).text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiesgoBadge(transaccion.riesgo).color}>
                          {getRiesgoBadge(transaccion.riesgo).text}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controles">
          <Card>
            <CardHeader>
              <CardTitle>Evaluación de Controles Internos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {controles.map(control => (
                  <Card key={control.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{control.nombre}</h3>
                          <p className="text-muted-foreground">{control.descripcion}</p>
                        </div>
                        <Badge className={getControlBadge(control.estado).color}>
                          {getControlBadge(control.estado).text}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Responsable:</span><br />
                          <span>{control.responsable}</span>
                        </div>
                        <div>
                          <span className="font-medium">Última revisión:</span><br />
                          <span>{control.ultimaRevision}</span>
                        </div>
                        <div>
                          <span className="font-medium">Tipo:</span><br />
                          <span className="capitalize">{control.tipo}</span>
                        </div>
                      </div>
                      {control.recomendaciones.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Recomendaciones:</h4>
                          <ul className="space-y-1">
                            {control.recomendaciones.map((rec, index) => (
                              <li key={index} className="text-sm">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pistas">
          <Card>
            <CardHeader>
              <CardTitle>Pistas de Auditoría</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Transacción</TableHead>
                    <TableHead>Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pistasAuditoria.map(pista => (
                    <TableRow key={pista.id}>
                      <TableCell className="font-mono text-sm">{pista.fecha}</TableCell>
                      <TableCell>{pista.usuario}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {pista.accion}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{pista.transaccionId}</TableCell>
                      <TableCell className="max-w-xs">{pista.detalles}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditoriaTransacciones;
