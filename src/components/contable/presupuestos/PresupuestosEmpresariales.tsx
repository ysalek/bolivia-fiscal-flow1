import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Calendar, Plus, TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface PresupuestoMaestro {
  id: string;
  nombre: string;
  año: number;
  estado: 'borrador' | 'aprobado' | 'ejecutandose' | 'cerrado';
  fechaCreacion: string;
  fechaAprobacion?: string;
  totalPresupuestado: number;
  totalEjecutado: number;
  descripcion: string;
}

interface PresupuestoDetalle {
  id: string;
  presupuestoId: string;
  categoria: 'ingresos' | 'gastos_operativos' | 'gastos_administrativos' | 'inversiones';
  subcategoria: string;
  cuenta: string;
  enero: number;
  febrero: number;
  marzo: number;
  abril: number;
  mayo: number;
  junio: number;
  julio: number;
  agosto: number;
  septiembre: number;
  octubre: number;
  noviembre: number;
  diciembre: number;
  total: number;
  ejecutado: number;
  observaciones: string;
}

interface VariacionPresupuestaria {
  mes: string;
  presupuestado: number;
  ejecutado: number;
  variacion: number;
  variacionPorcentual: number;
}

const PresupuestosEmpresariales = () => {
  const [presupuestos, setPresupuestos] = useState<PresupuestoMaestro[]>([]);
  const [detalles, setDetalles] = useState<PresupuestoDetalle[]>([]);
  const [variaciones, setVariaciones] = useState<VariacionPresupuestaria[]>([]);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState<string>("");
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState({
    nombre: "",
    año: new Date().getFullYear(),
    descripcion: ""
  });

  const [nuevoDetalle, setNuevoDetalle] = useState({
    categoria: "ingresos" as "ingresos" | "gastos_operativos" | "gastos_administrativos" | "inversiones",
    subcategoria: "",
    cuenta: "",
    enero: 0,
    febrero: 0,
    marzo: 0,
    abril: 0,
    mayo: 0,
    junio: 0,
    julio: 0,
    agosto: 0,
    septiembre: 0,
    octubre: 0,
    noviembre: 0,
    diciembre: 0,
    observaciones: ""
  });

  useEffect(() => {
    cargarDatosDemo();
  }, []);

  useEffect(() => {
    if (presupuestoSeleccionado) {
      cargarDetallesPresupuesto();
      calcularVariaciones();
    }
  }, [presupuestoSeleccionado]);

  const cargarDatosDemo = () => {
    const presupuestosDemo: PresupuestoMaestro[] = [
      {
        id: "1",
        nombre: "Presupuesto Anual 2024",
        año: 2024,
        estado: "ejecutandose",
        fechaCreacion: "2023-12-01",
        fechaAprobacion: "2023-12-15",
        totalPresupuestado: 1200000,
        totalEjecutado: 600000,
        descripcion: "Presupuesto maestro para el ejercicio fiscal 2024"
      },
      {
        id: "2",
        nombre: "Presupuesto 2025 - Borrador",
        año: 2025,
        estado: "borrador",
        fechaCreacion: "2024-10-01",
        totalPresupuestado: 1350000,
        totalEjecutado: 0,
        descripcion: "Presupuesto preliminar para 2025"
      }
    ];
    setPresupuestos(presupuestosDemo);
    setPresupuestoSeleccionado("1");
  };

  const cargarDetallesPresupuesto = () => {
    const detallesDemo: PresupuestoDetalle[] = [
      {
        id: "1",
        presupuestoId: presupuestoSeleccionado,
        categoria: "ingresos",
        subcategoria: "Ventas",
        cuenta: "4111 - Ventas de Productos",
        enero: 80000,
        febrero: 82000,
        marzo: 85000,
        abril: 87000,
        mayo: 90000,
        junio: 92000,
        julio: 95000,
        agosto: 97000,
        septiembre: 100000,
        octubre: 102000,
        noviembre: 105000,
        diciembre: 110000,
        total: 1125000,
        ejecutado: 562500,
        observaciones: "Crecimiento proyectado del 8% anual"
      },
      {
        id: "2",
        presupuestoId: presupuestoSeleccionado,
        categoria: "gastos_operativos",
        subcategoria: "Personal",
        cuenta: "5111 - Sueldos y Salarios",
        enero: 35000,
        febrero: 35000,
        marzo: 35000,
        abril: 35000,
        mayo: 35000,
        junio: 35000,
        julio: 35000,
        agosto: 35000,
        septiembre: 35000,
        octubre: 35000,
        noviembre: 35000,
        diciembre: 50000,
        total: 435000,
        ejecutado: 210000,
        observaciones: "Incluye aguinaldo en diciembre"
      },
      {
        id: "3",
        presupuestoId: presupuestoSeleccionado,
        categoria: "gastos_administrativos",
        subcategoria: "Servicios Básicos",
        cuenta: "5131 - Servicios Básicos",
        enero: 2500,
        febrero: 2500,
        marzo: 2500,
        abril: 2500,
        mayo: 2500,
        junio: 2500,
        julio: 2500,
        agosto: 2500,
        septiembre: 2500,
        octubre: 2500,
        noviembre: 2500,
        diciembre: 2500,
        total: 30000,
        ejecutado: 15000,
        observaciones: "Gastos fijos mensuales"
      }
    ];
    setDetalles(detallesDemo);
  };

  const calcularVariaciones = () => {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    const variacionesData: VariacionPresupuestaria[] = meses.map((mes, index) => {
      const presupuestadoMes = detalles.reduce((sum, detalle) => {
        const monthKey = mes.toLowerCase() as keyof PresupuestoDetalle;
        const monthValue = detalle[monthKey];
        // Ensure we only add numbers to the sum
        return sum + (typeof monthValue === 'number' ? monthValue : 0);
      }, 0);
      
      const ejecutadoMes = presupuestadoMes * (0.8 + Math.random() * 0.4); // Simulación
      const variacion = ejecutadoMes - presupuestadoMes;
      const variacionPorcentual = presupuestadoMes > 0 ? (variacion / presupuestadoMes) * 100 : 0;

      return {
        mes,
        presupuestado: presupuestadoMes,
        ejecutado: ejecutadoMes,
        variacion,
        variacionPorcentual
      };
    });
    
    setVariaciones(variacionesData);
  };

  const crearPresupuesto = () => {
    if (!nuevoPresupuesto.nombre) return;

    const presupuesto: PresupuestoMaestro = {
      id: Date.now().toString(),
      ...nuevoPresupuesto,
      estado: "borrador",
      fechaCreacion: new Date().toISOString().slice(0, 10),
      totalPresupuestado: 0,
      totalEjecutado: 0
    };

    setPresupuestos(prev => [presupuesto, ...prev]);
    setDialogAbierto(false);
    setNuevoPresupuesto({ nombre: "", año: new Date().getFullYear(), descripcion: "" });
  };

  const agregarDetalle = () => {
    if (!presupuestoSeleccionado || !nuevoDetalle.subcategoria) return;

    const total = nuevoDetalle.enero + nuevoDetalle.febrero + nuevoDetalle.marzo + 
                 nuevoDetalle.abril + nuevoDetalle.mayo + nuevoDetalle.junio +
                 nuevoDetalle.julio + nuevoDetalle.agosto + nuevoDetalle.septiembre +
                 nuevoDetalle.octubre + nuevoDetalle.noviembre + nuevoDetalle.diciembre;

    const detalle: PresupuestoDetalle = {
      id: Date.now().toString(),
      presupuestoId: presupuestoSeleccionado,
      ...nuevoDetalle,
      total,
      ejecutado: 0
    };

    setDetalles(prev => [...prev, detalle]);
    setNuevoDetalle({
      categoria: "ingresos",
      subcategoria: "",
      cuenta: "",
      enero: 0, febrero: 0, marzo: 0, abril: 0, mayo: 0, junio: 0,
      julio: 0, agosto: 0, septiembre: 0, octubre: 0, noviembre: 0, diciembre: 0,
      observaciones: ""
    });
  };

  const calcularTotalCategoria = (categoria: string) => {
    return detalles
      .filter(d => d.categoria === categoria)
      .reduce((sum, d) => sum + d.total, 0);
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      'borrador': { color: 'bg-gray-100 text-gray-800', text: 'Borrador' },
      'aprobado': { color: 'bg-blue-100 text-blue-800', text: 'Aprobado' },
      'ejecutandose': { color: 'bg-green-100 text-green-800', text: 'En Ejecución' },
      'cerrado': { color: 'bg-red-100 text-red-800', text: 'Cerrado' }
    };
    return badges[estado as keyof typeof badges] || badges.borrador;
  };

  const presupuestoActual = presupuestos.find(p => p.id === presupuestoSeleccionado);
  const porcentajeEjecucion = presupuestoActual && presupuestoActual.totalPresupuestado > 0 
    ? (presupuestoActual.totalEjecutado / presupuestoActual.totalPresupuestado) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Resumen del Presupuesto Seleccionado */}
      {presupuestoActual && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Presupuestado</p>
                  <p className="text-2xl font-bold">Bs. {presupuestoActual.totalPresupuestado.toLocaleString()}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ejecutado</p>
                  <p className="text-2xl font-bold">Bs. {presupuestoActual.totalEjecutado.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">% Ejecución</p>
                  <p className="text-2xl font-bold">{porcentajeEjecucion.toFixed(1)}%</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge className={getEstadoBadge(presupuestoActual.estado).color}>
                    {getEstadoBadge(presupuestoActual.estado).text}
                  </Badge>
                </div>
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="presupuestos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="presupuestos">Presupuestos</TabsTrigger>
          <TabsTrigger value="detalles">Detalles y Seguimiento</TabsTrigger>
          <TabsTrigger value="variaciones">Análisis de Variaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="presupuestos">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestión de Presupuestos</CardTitle>
                <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Presupuesto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Presupuesto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nombre del Presupuesto</Label>
                        <Input
                          value={nuevoPresupuesto.nombre}
                          onChange={(e) => setNuevoPresupuesto(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Año</Label>
                        <Input
                          type="number"
                          value={nuevoPresupuesto.año}
                          onChange={(e) => setNuevoPresupuesto(prev => ({ ...prev, año: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Textarea
                          value={nuevoPresupuesto.descripcion}
                          onChange={(e) => setNuevoPresupuesto(prev => ({ ...prev, descripcion: e.target.value }))}
                        />
                      </div>
                      <Button onClick={crearPresupuesto} className="w-full">
                        Crear Presupuesto
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Seleccionar Presupuesto</Label>
                  <Select value={presupuestoSeleccionado} onValueChange={setPresupuestoSeleccionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar presupuesto" />
                    </SelectTrigger>
                    <SelectContent>
                      {presupuestos.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nombre} - {p.año}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Año</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Presupuestado</TableHead>
                      <TableHead>Ejecutado</TableHead>
                      <TableHead>% Ejecución</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {presupuestos.map(presupuesto => {
                      const porcentaje = presupuesto.totalPresupuestado > 0 
                        ? (presupuesto.totalEjecutado / presupuesto.totalPresupuestado) * 100 
                        : 0;
                      return (
                        <TableRow key={presupuesto.id}>
                          <TableCell className="font-medium">{presupuesto.nombre}</TableCell>
                          <TableCell>{presupuesto.año}</TableCell>
                          <TableCell>
                            <Badge className={getEstadoBadge(presupuesto.estado).color}>
                              {getEstadoBadge(presupuesto.estado).text}
                            </Badge>
                          </TableCell>
                          <TableCell>Bs. {presupuesto.totalPresupuestado.toLocaleString()}</TableCell>
                          <TableCell>Bs. {presupuesto.totalEjecutado.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={porcentaje} className="flex-1 h-2" />
                              <span className="text-sm">{porcentaje.toFixed(1)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detalles">
          {presupuestoSeleccionado && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Línea Presupuestaria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Categoría</Label>
                      <Select 
                        value={nuevoDetalle.categoria} 
                        onValueChange={(value: any) => setNuevoDetalle(prev => ({ ...prev, categoria: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ingresos">Ingresos</SelectItem>
                          <SelectItem value="gastos_operativos">Gastos Operativos</SelectItem>
                          <SelectItem value="gastos_administrativos">Gastos Administrativos</SelectItem>
                          <SelectItem value="inversiones">Inversiones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Subcategoría</Label>
                      <Input
                        value={nuevoDetalle.subcategoria}
                        onChange={(e) => setNuevoDetalle(prev => ({ ...prev, subcategoria: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Cuenta Contable</Label>
                      <Input
                        value={nuevoDetalle.cuenta}
                        onChange={(e) => setNuevoDetalle(prev => ({ ...prev, cuenta: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={agregarDetalle}>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                    {['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'].map(mes => (
                      <div key={mes}>
                        <Label className="capitalize text-xs">{mes}</Label>
                        <Input
                          type="number"
                          value={nuevoDetalle[mes as keyof typeof nuevoDetalle] as number}
                          onChange={(e) => setNuevoDetalle(prev => ({ 
                            ...prev, 
                            [mes]: Number(e.target.value) 
                          }))}
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalle Presupuestario</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Subcategoría</TableHead>
                        <TableHead>Cuenta</TableHead>
                        <TableHead>Presupuestado</TableHead>
                        <TableHead>Ejecutado</TableHead>
                        <TableHead>% Ejecución</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detalles.map(detalle => {
                        const porcentaje = detalle.total > 0 ? (detalle.ejecutado / detalle.total) * 100 : 0;
                        return (
                          <TableRow key={detalle.id}>
                            <TableCell className="capitalize">{detalle.categoria.replace('_', ' ')}</TableCell>
                            <TableCell>{detalle.subcategoria}</TableCell>
                            <TableCell>{detalle.cuenta}</TableCell>
                            <TableCell>Bs. {detalle.total.toLocaleString()}</TableCell>
                            <TableCell>Bs. {detalle.ejecutado.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={porcentaje} className="flex-1 h-2" />
                                <span className="text-sm">{porcentaje.toFixed(1)}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="variaciones">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Variaciones Presupuestarias</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={variaciones}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`Bs. ${value.toLocaleString()}`, ""]} />
                    <Bar dataKey="presupuestado" fill="#8884d8" name="Presupuestado" />
                    <Bar dataKey="ejecutado" fill="#82ca9d" name="Ejecutado" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen por Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['ingresos', 'gastos_operativos', 'gastos_administrativos', 'inversiones'].map(categoria => (
                    <Card key={categoria}>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-medium capitalize mb-2">
                            {categoria.replace('_', ' ')}
                          </h3>
                          <p className="text-2xl font-bold">
                            Bs. {calcularTotalCategoria(categoria).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Presupuestado</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PresupuestosEmpresariales;
