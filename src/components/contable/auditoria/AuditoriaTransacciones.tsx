
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
import { Shield, AlertTriangle, CheckCircle, Search, Calendar as CalendarIcon, Download, Eye, Filter } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";

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

  useEffect(() => {
    cargarDatosAuditoria();
    cargarControlesInternos();
    generarPistasAuditoria();
  }, []);

  const cargarDatosAuditoria = () => {
    // Obtener asientos contables reales del sistema
    const asientos = getAsientos();
    
    // Convertir asientos a formato de auditoría
    const transaccionesAuditoria: TransaccionAuditoria[] = asientos.map(asiento => ({
      id: asiento.id,
      fecha: asiento.fecha,
      tipo: 'asiento',
      numero: asiento.numero,
      descripcion: asiento.concepto,
      monto: asiento.debe,
      usuario: 'Sistema',
      estado: evaluarEstadoTransaccion(asiento),
      riesgo: evaluarRiesgoTransaccion(asiento),
      observaciones: asiento.referencia || '',
      fechaCreacion: asiento.fecha,
    }));

    // Agregar algunas transacciones demo adicionales
    const transaccionesDemo: TransaccionAuditoria[] = [
      {
        id: "demo-1",
        fecha: "2024-01-15",
        tipo: "factura",
        numero: "FV-001234",
        descripcion: "Venta de productos varios",
        monto: 15000,
        usuario: "Juan Pérez",
        estado: "normal",
        riesgo: "bajo",
        observaciones: "Transacción regular",
        fechaCreacion: "2024-01-15",
      },
      {
        id: "demo-2",
        fecha: "2024-01-16",
        tipo: "pago",
        numero: "PAG-000123",
        descripcion: "Pago a proveedor fuera de horario",
        monto: 50000,
        usuario: "María González",
        estado: "sospechosa",
        riesgo: "alto",
        observaciones: "Pago realizado fuera del horario laboral - Requiere verificación",
        fechaCreacion: "2024-01-16",
        fechaModificacion: "2024-01-17",
        usuarioModificacion: "Admin"
      }
    ];

    setTransacciones([...transaccionesAuditoria, ...transaccionesDemo]);
  };

  const evaluarEstadoTransaccion = (asiento: any): 'normal' | 'sospechosa' | 'bloqueada' => {
    // Lógica simple para evaluar el estado
    if (asiento.debe > 100000) return 'sospechosa';
    if (asiento.concepto.toLowerCase().includes('ajuste')) return 'sospechosa';
    return 'normal';
  };

  const evaluarRiesgoTransaccion = (asiento: any): 'bajo' | 'medio' | 'alto' => {
    // Lógica simple para evaluar el riesgo
    if (asiento.debe > 50000) return 'alto';
    if (asiento.debe > 10000) return 'medio';
    return 'bajo';
  };

  const cargarControlesInternos = () => {
    const controlesDemo: ControlInterno[] = [
      {
        id: "1",
        nombre: "Segregación de Funciones",
        tipo: "segregacion",
        descripcion: "Separación entre quien autoriza, registra y custodia",
        estado: "cumple",
        ultimaRevision: "2024-01-15",
        responsable: "Auditor Interno",
        hallazgos: [],
        recomendaciones: ["Mantener la separación actual de funciones"]
      },
      {
        id: "2",
        nombre: "Autorización de Pagos",
        tipo: "autorizacion",
        descripcion: "Todos los pagos > Bs. 10,000 requieren doble autorización",
        estado: "no_cumple",
        ultimaRevision: "2024-01-10",
        responsable: "Gerente Financiero",
        hallazgos: [
          "Se encontraron 3 pagos por encima del límite sin doble autorización",
          "Falta documentación de aprobación en 2 casos"
        ],
        recomendaciones: [
          "Implementar flujo de aprobación digital",
          "Capacitar al personal sobre procedimientos"
        ]
      },
      {
        id: "3",
        nombre: "Conciliaciones Bancarias",
        tipo: "conciliacion",
        descripcion: "Conciliaciones mensuales de todas las cuentas bancarias",
        estado: "parcial",
        ultimaRevision: "2024-01-01",
        responsable: "Contador",
        hallazgos: [
          "Conciliación de diciembre pendiente para cuenta corriente"
        ],
        recomendaciones: [
          "Completar conciliaciones pendientes",
          "Establecer calendario de conciliaciones"
        ]
      }
    ];
    setControles(controlesDemo);
  };

  const generarPistasAuditoria = () => {
    const pistasDemo: PistaAuditoria[] = [
      {
        id: "1",
        transaccionId: "demo-2",
        accion: "modificacion",
        usuario: "Admin",
        fecha: "2024-01-17 18:30:00",
        ip: "192.168.1.100",
        detalles: "Modificación de observaciones de la transacción",
        valorAnterior: "Pago a proveedor",
        valorNuevo: "Pago a proveedor fuera de horario"
      },
      {
        id: "2",
        transaccionId: "demo-1",
        accion: "consulta",
        usuario: "Auditor",
        fecha: "2024-01-18 09:15:00",
        ip: "192.168.1.105",
        detalles: "Consulta de detalles de la transacción para auditoría"
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
      'normal': { color: 'bg-green-100 text-green-800', text: 'Normal' },
      'sospechosa': { color: 'bg-yellow-100 text-yellow-800', text: 'Sospechosa' },
      'bloqueada': { color: 'bg-red-100 text-red-800', text: 'Bloqueada' }
    };
    return badges[estado as keyof typeof badges] || badges.normal;
  };

  const getRiesgoBadge = (riesgo: string) => {
    const badges = {
      'bajo': { color: 'bg-green-100 text-green-800', text: 'Bajo' },
      'medio': { color: 'bg-yellow-100 text-yellow-800', text: 'Medio' },
      'alto': { color: 'bg-red-100 text-red-800', text: 'Alto' }
    };
    return badges[riesgo as keyof typeof badges] || badges.bajo;
  };

  const getControlBadge = (estado: string) => {
    const badges = {
      'cumple': { color: 'bg-green-100 text-green-800', text: 'Cumple' },
      'parcial': { color: 'bg-yellow-100 text-yellow-800', text: 'Parcial' },
      'no_cumple': { color: 'bg-red-100 text-red-800', text: 'No Cumple' }
    };
    return badges[estado as keyof typeof badges] || badges.cumple;
  };

  const estadisticas = {
    totalTransacciones: transacciones.length,
    transaccionesSospechosas: transacciones.filter(t => t.estado === 'sospechosa').length,
    riesgoAlto: transacciones.filter(t => t.riesgo === 'alto').length,
    controlesCumplidos: controles.filter(c => c.estado === 'cumple').length
  };

  return (
    <div className="space-y-6">
      {/* Panel de Control */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transacciones</p>
                <p className="text-2xl font-bold">{estadisticas.totalTransacciones}</p>
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
              <AlertTriangle className="w-8 h-8 text-red-600" />
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
        <TabsList>
          <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
          <TabsTrigger value="controles">Controles Internos</TabsTrigger>
          <TabsTrigger value="pistas">Pistas de Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="transacciones">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Monitoreo de Transacciones</CardTitle>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div>
                  <Label>Usuario</Label>
                  <Input
                    placeholder="Filtrar por usuario"
                    value={filtros.usuario}
                    onChange={(e) => setFiltros(prev => ({ ...prev, usuario: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={filtros.tipo} onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="asiento">Asiento</SelectItem>
                      <SelectItem value="factura">Factura</SelectItem>
                      <SelectItem value="compra">Compra</SelectItem>
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
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => setFiltros({ fechaInicio: new Date(), fechaFin: new Date(), usuario: "", tipo: "", riesgo: "", estado: "" })}>
                    <Filter className="w-4 h-4 mr-2" />
                    Limpiar
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Riesgo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaccionesFiltradas.map(transaccion => (
                    <TableRow key={transaccion.id}>
                      <TableCell>{transaccion.fecha}</TableCell>
                      <TableCell className="capitalize">{transaccion.tipo}</TableCell>
                      <TableCell className="font-medium">{transaccion.numero}</TableCell>
                      <TableCell>{transaccion.descripcion}</TableCell>
                      <TableCell>Bs. {transaccion.monto.toLocaleString()}</TableCell>
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
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
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
              <div className="space-y-6">
                {controles.map(control => (
                  <Card key={control.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg mb-1">{control.nombre}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{control.descripcion}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Responsable: {control.responsable}</span>
                            <span>Última revisión: {control.ultimaRevision}</span>
                          </div>
                        </div>
                        <Badge className={getControlBadge(control.estado).color}>
                          {getControlBadge(control.estado).text}
                        </Badge>
                      </div>

                      {control.hallazgos.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Hallazgos:</h4>
                          <ul className="space-y-1">
                            {control.hallazgos.map((hallazgo, index) => (
                              <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {hallazgo}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {control.recomendaciones.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Recomendaciones:</h4>
                          <ul className="space-y-1">
                            {control.recomendaciones.map((recomendacion, index) => (
                              <li key={index} className="text-sm text-blue-600 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
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
                    <TableHead>IP</TableHead>
                    <TableHead>Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pistasAuditoria.map(pista => (
                    <TableRow key={pista.id}>
                      <TableCell>{pista.fecha}</TableCell>
                      <TableCell>{pista.usuario}</TableCell>
                      <TableCell className="capitalize">{pista.accion}</TableCell>
                      <TableCell>{pista.transaccionId}</TableCell>
                      <TableCell>{pista.ip}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm">{pista.detalles}</p>
                          {pista.valorAnterior && pista.valorNuevo && (
                            <div className="text-xs text-muted-foreground mt-1">
                              <div>Anterior: {pista.valorAnterior}</div>
                              <div>Nuevo: {pista.valorNuevo}</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
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
