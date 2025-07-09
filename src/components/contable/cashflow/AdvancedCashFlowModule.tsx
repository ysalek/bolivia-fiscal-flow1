import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  ArrowUpDown,
  Banknote,
  CreditCard,
  Building
} from "lucide-react";

interface MovimientoCaja {
  id: string;
  fecha: string;
  tipo: 'ingreso' | 'egreso';
  categoria: string;
  concepto: string;
  monto: number;
  metodoPago: 'efectivo' | 'transferencia' | 'cheque' | 'tarjeta';
  referencia?: string;
  responsable: string;
  estado: 'confirmado' | 'pendiente' | 'anulado';
}

interface ProyeccionCaja {
  fecha: string;
  ingresosProyectados: number;
  egresosProyectados: number;
  flujoNeto: number;
  saldoAcumulado: number;
}

const AdvancedCashFlowModule = () => {
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [proyecciones, setProyecciones] = useState<ProyeccionCaja[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroFecha, setFiltroFecha] = useState<string>('mes');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [nuevoMovimiento, setNuevoMovimiento] = useState<Partial<MovimientoCaja>>({
    tipo: 'ingreso',
    categoria: '',
    concepto: '',
    monto: 0,
    metodoPago: 'efectivo',
    fecha: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    cargarMovimientos();
    generarProyecciones();
  }, []);

  const cargarMovimientos = () => {
    // Cargar desde localStorage o generar datos de ejemplo
    const movimientosGuardados = localStorage.getItem('movimientosCaja');
    if (movimientosGuardados) {
      setMovimientos(JSON.parse(movimientosGuardados));
    } else {
      // Generar movimientos de ejemplo
      generarMovimientosEjemplo();
    }
  };

  const generarMovimientosEjemplo = () => {
    const ejemplos: MovimientoCaja[] = [];
    const hoy = new Date();
    
    // Generar movimientos de los últimos 30 días
    for (let i = 30; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().slice(0, 10);

      // Ingresos por ventas
      if (Math.random() > 0.3) {
        ejemplos.push({
          id: `ing-${i}-1`,
          fecha: fechaStr,
          tipo: 'ingreso',
          categoria: 'Ventas',
          concepto: 'Venta de productos',
          monto: Math.floor(Math.random() * 5000) + 1000,
          metodoPago: ['efectivo', 'tarjeta', 'transferencia'][Math.floor(Math.random() * 3)] as any,
          responsable: 'Sistema POS',
          estado: 'confirmado'
        });
      }

      // Egresos operativos
      if (Math.random() > 0.7) {
        ejemplos.push({
          id: `egr-${i}-1`,
          fecha: fechaStr,
          tipo: 'egreso',
          categoria: 'Gastos Operativos',
          concepto: 'Compra de insumos',
          monto: Math.floor(Math.random() * 2000) + 500,
          metodoPago: ['efectivo', 'transferencia', 'cheque'][Math.floor(Math.random() * 3)] as any,
          responsable: 'Gerencia',
          estado: 'confirmado'
        });
      }
    }

    setMovimientos(ejemplos);
    localStorage.setItem('movimientosCaja', JSON.stringify(ejemplos));
  };

  const generarProyecciones = () => {
    const proyecciones: ProyeccionCaja[] = [];
    const hoy = new Date();
    let saldoActual = calcularSaldoActual();

    // Proyectar próximos 30 días
    for (let i = 1; i <= 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + i);
      const fechaStr = fecha.toISOString().slice(0, 10);

      // Proyecciones basadas en promedios históricos
      const promedioIngresos = calcularPromedioIngresos();
      const promedioEgresos = calcularPromedioEgresos();

      const ingresosProyectados = promedioIngresos * (0.8 + Math.random() * 0.4);
      const egresosProyectados = promedioEgresos * (0.8 + Math.random() * 0.4);
      const flujoNeto = ingresosProyectados - egresosProyectados;
      
      saldoActual += flujoNeto;

      proyecciones.push({
        fecha: fechaStr,
        ingresosProyectados,
        egresosProyectados,
        flujoNeto,
        saldoAcumulado: saldoActual
      });
    }

    setProyecciones(proyecciones);
  };

  const calcularSaldoActual = () => {
    return movimientos.reduce((saldo, mov) => {
      if (mov.estado !== 'confirmado') return saldo;
      return mov.tipo === 'ingreso' ? saldo + mov.monto : saldo - mov.monto;
    }, 0);
  };

  const calcularPromedioIngresos = () => {
    const ingresos = movimientos.filter(m => m.tipo === 'ingreso' && m.estado === 'confirmado');
    const totalIngresos = ingresos.reduce((sum, ing) => sum + ing.monto, 0);
    return totalIngresos / Math.max(ingresos.length, 1);
  };

  const calcularPromedioEgresos = () => {
    const egresos = movimientos.filter(m => m.tipo === 'egreso' && m.estado === 'confirmado');
    const totalEgresos = egresos.reduce((sum, egr) => sum + egr.monto, 0);
    return totalEgresos / Math.max(egresos.length, 1);
  };

  const agregarMovimiento = () => {
    if (!nuevoMovimiento.concepto || !nuevoMovimiento.monto) return;

    const movimiento: MovimientoCaja = {
      id: Date.now().toString(),
      fecha: nuevoMovimiento.fecha || new Date().toISOString().slice(0, 10),
      tipo: nuevoMovimiento.tipo || 'ingreso',
      categoria: nuevoMovimiento.categoria || 'Otros',
      concepto: nuevoMovimiento.concepto,
      monto: nuevoMovimiento.monto,
      metodoPago: nuevoMovimiento.metodoPago || 'efectivo',
      responsable: 'Usuario Actual',
      estado: 'confirmado'
    };

    const nuevosMovimientos = [movimiento, ...movimientos];
    setMovimientos(nuevosMovimientos);
    localStorage.setItem('movimientosCaja', JSON.stringify(nuevosMovimientos));

    // Limpiar formulario
    setNuevoMovimiento({
      tipo: 'ingreso',
      categoria: '',
      concepto: '',
      monto: 0,
      metodoPago: 'efectivo',
      fecha: new Date().toISOString().slice(0, 10)
    });

    generarProyecciones();
  };

  const movimientosFiltrados = movimientos.filter(mov => {
    if (filtroTipo !== 'todos' && mov.tipo !== filtroTipo) return false;
    
    if (fechaInicio && mov.fecha < fechaInicio) return false;
    if (fechaFin && mov.fecha > fechaFin) return false;
    
    return true;
  });

  // Datos para gráficos
  const datosGrafico = movimientos
    .reduce((acc: any[], mov) => {
      const fecha = mov.fecha;
      const existing = acc.find(item => item.fecha === fecha);
      
      if (existing) {
        if (mov.tipo === 'ingreso') {
          existing.ingresos += mov.monto;
        } else {
          existing.egresos += mov.monto;
        }
      } else {
        acc.push({
          fecha,
          ingresos: mov.tipo === 'ingreso' ? mov.monto : 0,
          egresos: mov.tipo === 'egreso' ? mov.monto : 0
        });
      }
      
      return acc;
    }, [])
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-30); // Últimos 30 días

  const saldoActual = calcularSaldoActual();
  const ingresosMes = movimientos
    .filter(m => m.tipo === 'ingreso' && m.estado === 'confirmado' && 
             m.fecha >= new Date(new Date().setDate(1)).toISOString().slice(0, 10))
    .reduce((sum, m) => sum + m.monto, 0);
  
  const egresosMes = movimientos
    .filter(m => m.tipo === 'egreso' && m.estado === 'confirmado' && 
             m.fecha >= new Date(new Date().setDate(1)).toISOString().slice(0, 10))
    .reduce((sum, m) => sum + m.monto, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Flujo de Caja Avanzado</h2>
          <p className="text-muted-foreground">Gestión y proyección de flujo de efectivo</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Actual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Bs. {saldoActual.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Balance total de efectivo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Bs. {ingresosMes.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de entradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos del Mes</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              Bs. {egresosMes.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de salidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flujo Neto</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(ingresosMes - egresosMes) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Bs. {(ingresosMes - egresosMes).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Diferencia neta del mes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movimientos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="graficos">Análisis Gráfico</TabsTrigger>
          <TabsTrigger value="proyecciones">Proyecciones</TabsTrigger>
          <TabsTrigger value="nuevo">Nuevo Movimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="movimientos">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Movimientos de Caja</CardTitle>
                <div className="flex gap-2">
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ingreso">Ingresos</SelectItem>
                      <SelectItem value="egreso">Egresos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-40"
                  />
                  <Input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientosFiltrados.slice(0, 20).map((movimiento) => (
                    <TableRow key={movimiento.id}>
                      <TableCell>{new Date(movimiento.fecha).toLocaleDateString('es-BO')}</TableCell>
                      <TableCell>
                        <Badge variant={movimiento.tipo === 'ingreso' ? 'default' : 'destructive'}>
                          {movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{movimiento.concepto}</TableCell>
                      <TableCell>{movimiento.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {movimiento.metodoPago === 'efectivo' && <Banknote className="w-4 h-4" />}
                          {movimiento.metodoPago === 'tarjeta' && <CreditCard className="w-4 h-4" />}
                          {movimiento.metodoPago === 'transferencia' && <Building className="w-4 h-4" />}
                          <span className="capitalize">{movimiento.metodoPago}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-bold ${
                        movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movimiento.tipo === 'ingreso' ? '+' : '-'}Bs. {movimiento.monto.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={movimiento.estado === 'confirmado' ? 'default' : 'secondary'}>
                          {movimiento.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graficos">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Flujo de Caja Diario</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`Bs. ${value.toFixed(2)}`, ""]} />
                    <Line type="monotone" dataKey="ingresos" stroke="#22c55e" name="Ingresos" />
                    <Line type="monotone" dataKey="egresos" stroke="#ef4444" name="Egresos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparativo Ingresos vs Egresos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosGrafico.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`Bs. ${value.toFixed(2)}`, ""]} />
                    <Bar dataKey="ingresos" fill="#22c55e" name="Ingresos" />
                    <Bar dataKey="egresos" fill="#ef4444" name="Egresos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proyecciones">
          <Card>
            <CardHeader>
              <CardTitle>Proyecciones de Flujo de Caja (30 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={proyecciones}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`Bs. ${value.toFixed(2)}`, ""]} />
                    <Line type="monotone" dataKey="saldoAcumulado" stroke="#3b82f6" name="Saldo Proyectado" strokeWidth={2} />
                    <Line type="monotone" dataKey="flujoNeto" stroke="#8b5cf6" name="Flujo Neto Diario" />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Saldo Proyectado en 30 días</p>
                    <p className="text-xl font-bold text-blue-600">
                      Bs. {proyecciones[proyecciones.length - 1]?.saldoAcumulado.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Ingresos Proyectados</p>
                    <p className="text-xl font-bold text-green-600">
                      Bs. {proyecciones.reduce((sum, p) => sum + p.ingresosProyectados, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Egresos Proyectados</p>
                    <p className="text-xl font-bold text-red-600">
                      Bs. {proyecciones.reduce((sum, p) => sum + p.egresosProyectados, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nuevo">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nuevo Movimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select 
                    value={nuevoMovimiento.tipo} 
                    onValueChange={(value: 'ingreso' | 'egreso') => 
                      setNuevoMovimiento({...nuevoMovimiento, tipo: value})
                    }
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
                  <label className="text-sm font-medium">Fecha</label>
                  <Input
                    type="date"
                    value={nuevoMovimiento.fecha}
                    onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, fecha: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Categoría</label>
                  <Select 
                    value={nuevoMovimiento.categoria} 
                    onValueChange={(value) => setNuevoMovimiento({...nuevoMovimiento, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ventas">Ventas</SelectItem>
                      <SelectItem value="Servicios">Servicios</SelectItem>
                      <SelectItem value="Gastos Operativos">Gastos Operativos</SelectItem>
                      <SelectItem value="Sueldos">Sueldos</SelectItem>
                      <SelectItem value="Impuestos">Impuestos</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Método de Pago</label>
                  <Select 
                    value={nuevoMovimiento.metodoPago} 
                    onValueChange={(value: any) => setNuevoMovimiento({...nuevoMovimiento, metodoPago: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Concepto</label>
                  <Input
                    value={nuevoMovimiento.concepto}
                    onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, concepto: e.target.value})}
                    placeholder="Descripción del movimiento"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Monto</label>
                  <Input
                    type="number"
                    value={nuevoMovimiento.monto}
                    onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, monto: Number(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={agregarMovimiento} className="w-full">
                    Registrar Movimiento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedCashFlowModule;