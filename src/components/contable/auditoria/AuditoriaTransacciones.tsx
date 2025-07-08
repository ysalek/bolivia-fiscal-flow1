
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertTriangle, CheckCircle, Search, Calendar as CalendarIcon, Download, Eye, Filter, RefreshCw, TrendingUp, Users, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { useToast } from "@/hooks/use-toast";

interface TransaccionAuditoria {
  id: string;
  fecha: string;
  tipo: 'asiento' | 'factura' | 'compra' | 'pago' | 'ajuste';
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
    fechaInicio: new Date(),
    fechaFin: new Date(),
    usuario: "",
    tipo: "",
    riesgo: "",
    estado: ""
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState<'inicio' | 'fin'>('inicio');
  
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
    // Simular carga de datos reales
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Obtener asientos contables reales del sistema
    const asientos = getAsientos();
    
    // Convertir asientos a formato de auditoría con datos más realistas
    const transaccionesReales: TransaccionAuditoria[] = asientos.map(asiento => ({
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

    // Datos demo más realistas y variados
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
      },
      {
        id: "TXN-2024-003",
        fecha: "2024-01-17",
        tipo: "ajuste",
        numero: "AJU-000123",
        descripcion: "Ajuste por diferencia en inventario físico",
        monto: 3200,
        usuario: "Ana Vargas",
        estado: "normal",
        riesgo: "medio",
        observaciones: "Ajuste autorizado por Gerencia tras auditoria de inventario.",
        fechaCreacion: "2024-01-17 14:20:00",
      },
      {
        id: "TXN-2024-004",
        fecha: "2024-01-18",
        tipo: "compra",
        numero: "COM-002456",
        descripcion: "Adquisición de equipos de oficina sin orden previa",
        monto: 45000,
        usuario: "Roberto Silva",
        estado: "sospechosa",
        riesgo: "medio",
        observaciones: "⚠️ Compra realizada sin orden de compra previa. Falta documentación de respaldo.",
        fechaCreacion: "2024-01-18 16:45:12",
      }
    ];

    setTransacciones([...transaccionesReales, ...transaccionesDemo]);
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
        nombre: "Autorización Dual para Pagos",
        tipo: "autorizacion",
        descripcion: "Todos los pagos superiores a Bs. 10,000 requieren doble autorización",
        estado: "no_cumple",
        ultimaRevision: "2024-01-10",
        responsable: "Gerente Financiero - Lic. Jorge Ramírez",
        hallazgos: [
          "❌ Se encontraron 3 pagos por encima del límite sin doble autorización en los últimos 7 días",
          "❌ Falta documentación de aprobación en 2 casos específicos",
          "❌ El sistema no bloquea automáticamente pagos sin segunda firma"
        ],
        recomendaciones: [
          "🔧 Implementar flujo de aprobación digital obligatorio",
          "📚 Capacitar urgentemente al personal sobre procedimientos",
          "⚙️ Configurar bloqueos automáticos en el sistema"
        ],
        prioridad: "alta"
      },
      {
        id: "CTRL-003",
        nombre: "Conciliaciones Bancarias Mensuales",
        tipo: "conciliacion",
        descripcion: "Conciliaciones obligatorias y oportunas de todas las cuentas bancarias",
        estado: "parcial",
        ultimaRevision: "2024-01-01",
        responsable: "Contador Principal - C.P. Luis Morales",
        hallazgos: [
          "⏰ Conciliación de diciembre 2023 pendiente para Banco Sol",
          "📊 Diferencias no investigadas por Bs. 2,850 en Banco Unión"
        ],
        recomendaciones: [
          "✅ Completar conciliaciones pendientes antes del 25/01/2024",
          "📅 Establecer calendario automático de recordatorios",
          "🔍 Investigar y documentar todas las diferencias encontradas"
        ],
        prioridad: "media"
      },
      {
        id: "CTRL-004",
        nombre: "Backup de Información Contable",
        tipo: "supervision",
        descripcion: "Respaldos diarios y verificación de integridad de datos",
        estado: "cumple",
        ultimaRevision: "2024-01-18",
        responsable: "IT Manager - Ing. Sandra Choque",
        hallazgos: [],
        recomendaciones: [
          "✅ El sistema funciona correctamente",
          "🔄 Probar restauración mensualmente"
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
        detalles: "Modificación de observaciones tras revisión gerencial",
        valorAnterior: "Pago a proveedor crítico",
        valorNuevo: "Pago urgente a proveedor crítico - Autorizado por Gerencia"
      },
      {
        id: "AUDIT-002",
        transaccionId: "TXN-2024-001",
        accion: "consulta",
        usuario: "Auditor Externo",
        fecha: "2024-01-18 10:30:15",
        ip: "192.168.1.105",
        detalles: "Consulta de detalles durante auditoría externa trimestral"
      },
      {
        id: "AUDIT-003",
        transaccionId: "TXN-2024-004",
        accion: "aprobacion",
        usuario: "Gerente General",
        fecha: "2024-01-18 17:00:00",
        ip: "192.168.1.101",
        detalles: "Aprobación excepcional de compra sin orden previa - Justificación: Urgencia operativa"
      },
      {
        id: "AUDIT-004",
        transaccionId: "TXN-2024-002",
        accion: "consulta",
        usuario: "María González",
        fecha: "2024-01-19 09:15:22",
        ip: "192.168.1.115",
        detalles: "Verificación del estado de procesamiento del pago"
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
      'normal': { color: 'bg-green-100 text-green-800 border-green-200', text: '✅ Normal', icon: CheckCircle },
      'sospechosa': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: '⚠️ Sospechosa', icon: AlertTriangle },
      'bloqueada': { color: 'bg-red-100 text-red-800 border-red-200', text: '🚫 Bloqueada', icon: AlertTriangle }
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

  const getPrioridadBadge = (prioridad: string) => {
    const badges = {
      'alta': { color: 'bg-red-100 text-red-800', text: '🚨 Alta' },
      'media': { color: 'bg-yellow-100 text-yellow-800', text: '⚠️ Media' },
      'baja': { color: 'bg-blue-100 text-blue-800', text: 'ℹ️ Baja' }
    };
    return badges[prioridad as keyof typeof badges] || badges.baja;
  };

  const estadisticas = {
    totalTransacciones: transacciones.length,
    transaccionesSospechosas: transacciones.filter(t => t.estado === 'sospechosa').length,
    riesgoAlto: transacciones.filter(t => t.riesgo === 'alto').length,
    controlesCumplidos: controles.filter(c => c.estado === 'cumple').length,
    controlesAltoRiesgo: controles.filter(c => c.prioridad === 'alta').length
  };

  const exportarReporte = () => {
    toast({
      title: "Generando reporte...",
      description: "El reporte de auditoría se descargará en breve",
    });
    // Simular exportación
    setTimeout(() => {
      toast({
        title: "Reporte generado",
        description: "audit-report-2024.xlsx descargado exitosamente",
      });
    }, 2000);
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
      {/* Panel de Control Mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transacciones</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.totalTransacciones}</p>
                <p className="text-xs text-green-600">📈 +12% vs mes anterior</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sospechosas</p>
                <p className="text-2xl font-bold text-yellow-600">{estadisticas.transaccionesSospechosas}</p>
                <p className="text-xs text-yellow-600">⚠️ Requieren revisión</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Riesgo Alto</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.riesgoAlto}</p>
                <p className="text-xs text-red-600">🚨 Atención inmediata</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Controles OK</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.controlesCumplidos}</p>
                <p className="text-xs text-green-600">✅ Funcionando bien</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prioridad Alta</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.controlesAltoRiesgo}</p>
                <p className="text-xs text-red-600">🚨 Acción requerida</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Sistema */}
      {estadisticas.transaccionesSospechosas > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Atención:</strong> Se detectaron {estadisticas.transaccionesSospechosas} transacciones sospechosas que requieren revisión inmediata.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="transacciones" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transacciones" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Transacciones
          </TabsTrigger>
          <TabsTrigger value="controles" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Controles Internos
          </TabsTrigger>
          <TabsTrigger value="pistas" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Pistas de Auditoría
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transacciones">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Monitoreo de Transacciones
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sistema de detección automática de anomalías
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={inicializarDatos}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar
                  </Button>
                  <Button variant="outline" onClick={exportarReporte}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros Mejorados */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Usuario</Label>
                  <Input
                    placeholder="Buscar usuario..."
                    value={filtros.usuario}
                    onChange={(e) => setFiltros(prev => ({ ...prev, usuario: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <Select value={filtros.tipo} onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="asiento">📊 Asiento</SelectItem>
                      <SelectItem value="factura">🧾 Factura</SelectItem>
                      <SelectItem value="compra">🛒 Compra</SelectItem>
                      <SelectItem value="pago">💳 Pago</SelectItem>
                      <SelectItem value="ajuste">⚙️ Ajuste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nivel de Riesgo</Label>
                  <Select value={filtros.riesgo} onValueChange={(value) => setFiltros(prev => ({ ...prev, riesgo: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Todos los riesgos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="bajo">🟢 Bajo</SelectItem>
                      <SelectItem value="medio">🟡 Medio</SelectItem>
                      <SelectItem value="alto">🔴 Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <Select value={filtros.estado} onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="normal">✅ Normal</SelectItem>
                      <SelectItem value="sospechosa">⚠️ Sospechosa</SelectItem>
                      <SelectItem value="bloqueada">🚫 Bloqueada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 flex items-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFiltros({ fechaInicio: new Date(), fechaFin: new Date(), usuario: "", tipo: "", riesgo: "", estado: "" })}
                    className="flex-1"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Limpiar Filtros
                  </Button>
                  <Button variant="default">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>

              {/* Tabla de Transacciones */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">Fecha</TableHead>
                      <TableHead className="font-semibold">Tipo</TableHead>
                      <TableHead className="font-semibold">Número</TableHead>
                      <TableHead className="font-semibold">Descripción</TableHead>
                      <TableHead className="font-semibold text-right">Monto (Bs.)</TableHead>
                      <TableHead className="font-semibold">Usuario</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableHead className="font-semibold">Riesgo</TableHead>
                      <TableHead className="font-semibold text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transaccionesFiltradas.map(transaccion => (
                      <TableRow key={transaccion.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{transaccion.fecha}</TableCell>
                        <TableCell>
                          <span className="capitalize flex items-center gap-1">
                            {transaccion.tipo === 'factura' && '🧾'}
                            {transaccion.tipo === 'pago' && '💳'}
                            {transaccion.tipo === 'compra' && '🛒'}
                            {transaccion.tipo === 'asiento' && '📊'}
                            {transaccion.tipo === 'ajuste' && '⚙️'}
                            {transaccion.tipo}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono font-medium text-blue-600">{transaccion.numero}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={transaccion.descripcion}>
                            {transaccion.descripcion}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {transaccion.monto.toLocaleString('es-BO')}
                        </TableCell>
                        <TableCell>{transaccion.usuario}</TableCell>
                        <TableCell>
                          <Badge className={`${getEstadoBadge(transaccion.estado).color} border`}>
                            {getEstadoBadge(transaccion.estado).text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getRiesgoBadge(transaccion.riesgo).color} border`}>
                            {getRiesgoBadge(transaccion.riesgo).text}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="outline" size="sm" className="hover:bg-blue-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {transaccionesFiltradas.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No se encontraron transacciones</p>
                  <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controles">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Evaluación de Controles Internos
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Marco de control y cumplimiento normativo
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Reporte de Controles
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {controles.map(control => (
                  <Card key={control.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{control.nombre}</h3>
                            <Badge className={getPrioridadBadge(control.prioridad).color}>
                              {getPrioridadBadge(control.prioridad).text}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{control.descripcion}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Responsable:</span><br />
                              <span className="text-blue-600">{control.responsable}</span>
                            </div>
                            <div>
                              <span className="font-medium">Última revisión:</span><br />
                              <span>{control.ultimaRevision}</span>
                            </div>
                            <div>
                              <span className="font-medium">Tipo de control:</span><br />
                              <span className="capitalize">{control.tipo}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getControlBadge(control.estado).color} border ml-4`}>
                          {getControlBadge(control.estado).text}
                        </Badge>
                      </div>

                      {control.hallazgos.length > 0 && (
                        <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                          <h4 className="font-semibold mb-3 text-red-800 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Hallazgos Identificados:
                          </h4>
                          <ul className="space-y-2">
                            {control.hallazgos.map((hallazgo, index) => (
                              <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                {hallazgo}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {control.recomendaciones.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold mb-3 text-blue-800 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Recomendaciones de Mejora:
                          </h4>
                          <ul className="space-y-2">
                            {control.recomendaciones.map((recomendacion, index) => (
                              <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                {recomendacion}
                              </li>
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Pistas de Auditoría
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Registro detallado de todas las actividades del sistema
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">Fecha/Hora</TableHead>
                      <TableHead className="font-semibold">Usuario</TableHead>
                      <TableHead className="font-semibold">Acción</TableHead>
                      <TableHead className="font-semibold">Transacción</TableHead>
                      <TableHead className="font-semibold">IP</TableHead>
                      <TableHead className="font-semibold">Detalles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pistasAuditoria.map(pista => (
                      <TableRow key={pista.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">{pista.fecha}</TableCell>
                        <TableCell className="font-medium">{pista.usuario}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {pista.accion === 'creacion' && '➕'}
                            {pista.accion === 'modificacion' && '✏️'}
                            {pista.accion === 'eliminacion' && '🗑️'}
                            {pista.accion === 'consulta' && '👁️'}
                            {pista.accion === 'aprobacion' && '✅'}
                            {' '}{pista.accion}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-blue-600">{pista.transaccionId}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{pista.ip}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm">{pista.detalles}</p>
                            {pista.valorAnterior && pista.valorNuevo && (
                              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                                <div className="p-2 bg-red-50 rounded border-l-2 border-red-300">
                                  <strong>Anterior:</strong> {pista.valorAnterior}
                                </div>
                                <div className="p-2 bg-green-50 rounded border-l-2 border-green-300">
                                  <strong>Nuevo:</strong> {pista.valorNuevo}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditoriaTransacciones;
