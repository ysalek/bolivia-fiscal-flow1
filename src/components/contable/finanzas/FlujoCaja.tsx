
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface MovimientoFlujo {
  id: string;
  fecha: string;
  concepto: string;
  categoria: string;
  tipo: 'ingreso' | 'egreso';
  montoReal?: number;
  montoProyectado: number;
  estado: 'confirmado' | 'estimado' | 'vencido';
}

interface ProyeccionPeriodo {
  periodo: string;
  ingresoReal: number;
  egresoReal: number;
  ingresoProyectado: number;
  egresoProyectado: number;
  saldoReal: number;
  saldoProyectado: number;
}

const FlujoCaja = () => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mensual");
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [saldoInicial, setSaldoInicial] = useState(50000);
  
  const [movimientos, setMovimientos] = useState<MovimientoFlujo[]>([]);
  const [proyecciones, setProyecciones] = useState<ProyeccionPeriodo[]>([]);
  
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    concepto: "",
    categoria: "",
    tipo: "ingreso" as "ingreso" | "egreso",
    monto: 0,
    fecha: new Date().toISOString().slice(0, 10),
    estado: "estimado" as "confirmado" | "estimado"
  });

  // Datos demo
  useEffect(() => {
    const movimientosDemo: MovimientoFlujo[] = [
      {
        id: "1",
        fecha: "2024-01-15",
        concepto: "Ventas de productos",
        categoria: "Ventas",
        tipo: "ingreso",
        montoReal: 45000,
        montoProyectado: 50000,
        estado: "confirmado"
      },
      {
        id: "2",
        fecha: "2024-01-20",
        concepto: "Pago de sueldos",
        categoria: "Personal",
        tipo: "egreso",
        montoReal: 18000,
        montoProyectado: 18000,
        estado: "confirmado"
      },
      {
        id: "3",
        fecha: "2024-01-25",
        concepto: "Compra de inventario",
        categoria: "Inventario",
        tipo: "egreso",
        montoProyectado: 25000,
        estado: "estimado"
      },
      {
        id: "4",
        fecha: "2024-02-01",
        concepto: "Cobro factura pendiente",
        categoria: "Cuentas por Cobrar",
        tipo: "ingreso",
        montoProyectado: 15000,
        estado: "estimado"
      },
      {
        id: "5",
        fecha: "2024-02-05",
        concepto: "Pago alquiler",
        categoria: "Gastos Operativos",
        tipo: "egreso",
        montoProyectado: 8000,
        estado: "estimado"
      }
    ];
    setMovimientos(movimientosDemo);

    // Generar proyecciones
    const proyeccionesDemo: ProyeccionPeriodo[] = [
      {
        periodo: "Ene 2024",
        ingresoReal: 45000,
        egresoReal: 18000,
        ingresoProyectado: 50000,
        egresoProyectado: 43000,
        saldoReal: 77000,
        saldoProyectado: 57000
      },
      {
        periodo: "Feb 2024",
        ingresoReal: 0,
        egresoReal: 0,
        ingresoProyectado: 65000,
        egresoProyectado: 33000,
        saldoReal: 77000,
        saldoProyectado: 89000
      },
      {
        periodo: "Mar 2024",
        ingresoReal: 0,
        egresoReal: 0,
        ingresoProyectado: 58000,
        egresoProyectado: 35000,
        saldoReal: 77000,
        saldoProyectado: 112000
      }
    ];
    setProyecciones(proyeccionesDemo);
  }, []);

  const agregarMovimiento = () => {
    if (!nuevoMovimiento.concepto || nuevoMovimiento.monto <= 0) {
      return;
    }

    const movimiento: MovimientoFlujo = {
      id: Date.now().toString(),
      ...nuevoMovimiento,
      montoProyectado: nuevoMovimiento.monto,
      montoReal: nuevoMovimiento.estado === "confirmado" ? nuevoMovimiento.monto : undefined
    };

    setMovimientos(prev => [...prev, movimiento]);
    setNuevoMovimiento({
      concepto: "",
      categoria: "",
      tipo: "ingreso",
      monto: 0,
      fecha: new Date().toISOString().slice(0, 10),
      estado: "estimado"
    });
  };

  const calcularResumen = () => {
    const ingresoReal = movimientos
      .filter(m => m.tipo === 'ingreso' && m.montoReal)
      .reduce((sum, m) => sum + (m.montoReal || 0), 0);
    
    const egresoReal = movimientos
      .filter(m => m.tipo === 'egreso' && m.montoReal)
      .reduce((sum, m) => sum + (m.montoReal || 0), 0);
    
    const ingresoProyectado = movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + m.montoProyectado, 0);
    
    const egresoProyectado = movimientos
      .filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + m.montoProyectado, 0);

    return {
      ingresoReal,
      egresoReal,
      ingresoProyectado,
      egresoProyectado,
      flujoReal: ingresoReal - egresoReal,
      flujoProyectado: ingresoProyectado - egresoProyectado,
      saldoActual: saldoInicial + ingresoReal - egresoReal,
      saldoProyectado: saldoInicial + ingresoProyectado - egresoProyectado
    };
  };

  const resumen = calcularResumen();

  return (
    <div className="space-y-6">
      {/* Resumen ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Actual</p>
                <p className="text-2xl font-bold text-green-600">
                  Bs. {resumen.saldoActual.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Proyectado</p>
                <p className={`text-2xl font-bold ${resumen.saldoProyectado >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  Bs. {resumen.saldoProyectado.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Mes</p>
                <p className="text-2xl font-bold text-green-600">
                  Bs. {resumen.ingresoProyectado.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Egresos Mes</p>
                <p className="text-2xl font-bold text-red-600">
                  Bs. {resumen.egresoProyectado.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proyeccion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proyeccion">Proyección</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="analisis">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="proyeccion">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Flujo de Caja Proyectado</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={proyecciones}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`Bs. ${value.toLocaleString()}`, ""]} />
                    <Line 
                      type="monotone" 
                      dataKey="saldoProyectado" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      name="Saldo Proyectado"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="saldoReal" 
                      stroke="#16a34a" 
                      strokeWidth={2}
                      name="Saldo Real"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingresos vs Egresos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={proyecciones}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`Bs. ${value.toLocaleString()}`, ""]} />
                    <Bar dataKey="ingresoProyectado" fill="#16a34a" name="Ingresos" />
                    <Bar dataKey="egresoProyectado" fill="#dc2626" name="Egresos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movimientos">
          <div className="space-y-4">
            {/* Formulario para nuevo movimiento */}
            <Card>
              <CardHeader>
                <CardTitle>Agregar Movimiento de Flujo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <Label>Concepto</Label>
                    <Input
                      placeholder="Descripción del movimiento"
                      value={nuevoMovimiento.concepto}
                      onChange={(e) => setNuevoMovimiento(prev => ({ ...prev, concepto: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Categoría</Label>
                    <Select 
                      value={nuevoMovimiento.categoria} 
                      onValueChange={(value) => setNuevoMovimiento(prev => ({ ...prev, categoria: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ventas">Ventas</SelectItem>
                        <SelectItem value="Cuentas por Cobrar">Cuentas por Cobrar</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Inventario">Inventario</SelectItem>
                        <SelectItem value="Gastos Operativos">Gastos Operativos</SelectItem>
                        <SelectItem value="Impuestos">Impuestos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select 
                      value={nuevoMovimiento.tipo} 
                      onValueChange={(value: "ingreso" | "egreso") => setNuevoMovimiento(prev => ({ ...prev, tipo: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingreso">Ingreso</SelectItem>
                        <SelectItem value="egreso">Egreso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Monto</Label>
                    <Input
                      type="number"
                      value={nuevoMovimiento.monto}
                      onChange={(e) => setNuevoMovimiento(prev => ({ ...prev, monto: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Fecha</Label>
                    <Input
                      type="date"
                      value={nuevoMovimiento.fecha}
                      onChange={(e) => setNuevoMovimiento(prev => ({ ...prev, fecha: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={agregarMovimiento} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Movimiento
                </Button>
              </CardContent>
            </Card>

            {/* Lista de movimientos */}
            <Card>
              <CardHeader>
                <CardTitle>Movimientos de Flujo de Caja</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Proyectado</TableHead>
                      <TableHead>Real</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimientos.map((mov) => (
                      <TableRow key={mov.id}>
                        <TableCell>{mov.fecha}</TableCell>
                        <TableCell>{mov.concepto}</TableCell>
                        <TableCell>{mov.categoria}</TableCell>
                        <TableCell>
                          <Badge variant={mov.tipo === 'ingreso' ? 'default' : 'destructive'}>
                            {mov.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className={mov.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                          {mov.tipo === 'ingreso' ? '+' : '-'}Bs. {mov.montoProyectado.toLocaleString()}
                        </TableCell>
                        <TableCell className={mov.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                          {mov.montoReal ? 
                            `${mov.tipo === 'ingreso' ? '+' : '-'}Bs. ${mov.montoReal.toLocaleString()}` : 
                            'Pendiente'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            mov.estado === 'confirmado' ? 'default' : 
                            mov.estado === 'estimado' ? 'secondary' : 'destructive'
                          }>
                            {mov.estado === 'confirmado' ? 'Confirmado' : 
                             mov.estado === 'estimado' ? 'Estimado' : 'Vencido'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analisis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Liquidez</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Razón de Liquidez Inmediata:</span>
                    <span className="font-bold">
                      {(resumen.saldoActual / (resumen.egresoProyectado / 30)).toFixed(1)} días
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Flujo Neto del Período:</span>
                    <span className={`font-bold ${resumen.flujoProyectado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Bs. {resumen.flujoProyectado.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Variación vs Proyectado:</span>
                    <span className={`font-bold ${resumen.flujoReal >= resumen.flujoProyectado ? 'text-green-600' : 'text-red-600'}`}>
                      {((resumen.flujoReal / resumen.flujoProyectado - 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas y Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resumen.saldoProyectado < 10000 && (
                    <div className="p-3 bg-red-100 border border-red-300 rounded text-red-800">
                      <strong>⚠️ Alerta de Liquidez:</strong> El saldo proyectado es muy bajo
                    </div>
                  )}
                  {resumen.flujoProyectado < 0 && (
                    <div className="p-3 bg-orange-100 border border-orange-300 rounded text-orange-800">
                      <strong>📉 Flujo Negativo:</strong> Se proyecta un flujo de caja negativo
                    </div>
                  )}
                  {resumen.ingresoProyectado > resumen.egresoProyectado * 1.5 && (
                    <div className="p-3 bg-green-100 border border-green-300 rounded text-green-800">
                      <strong>✅ Buena Posición:</strong> Los ingresos superan significativamente los egresos
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlujoCaja;
