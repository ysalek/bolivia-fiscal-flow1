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
import { Building2, Plus, PieChart, BarChart3, TrendingUp } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface CentroCosto {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'productivo' | 'administrativo' | 'ventas' | 'servicio';
  responsable: string;
  presupuesto: number;
  gastoReal: number;
  estado: 'activo' | 'inactivo';
  descripcion: string;
}

interface AsignacionCosto {
  id: string;
  centroCostoId: string;
  cuenta: string;
  concepto: string;
  monto: number;
  fecha: string;
  tipo: 'directo' | 'indirecto';
  metodoDistribucion?: string;
}

const COLORES_PIE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CentrosCosto = () => {
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionCosto[]>([]);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [centroSeleccionado, setCentroSeleccionado] = useState<CentroCosto | null>(null);
  
  const [nuevoCentro, setNuevoCentro] = useState({
    codigo: "",
    nombre: "",
    tipo: "productivo" as "productivo" | "administrativo" | "ventas" | "servicio",
    responsable: "",
    presupuesto: 0,
    descripcion: ""
  });

  const [nuevaAsignacion, setNuevaAsignacion] = useState({
    centroCostoId: "",
    cuenta: "",
    concepto: "",
    monto: 0,
    tipo: "directo" as "directo" | "indirecto",
    metodoDistribucion: ""
  });

  // Datos demo
  useEffect(() => {
    const centrosDemo: CentroCosto[] = [
      {
        id: "1",
        codigo: "PROD-001",
        nombre: "Producción Principal",
        tipo: "productivo",
        responsable: "Juan Pérez",
        presupuesto: 150000,
        gastoReal: 135000,
        estado: "activo",
        descripcion: "Centro de costo principal de producción"
      },
      {
        id: "2",
        codigo: "ADM-001",
        nombre: "Administración General",
        tipo: "administrativo",
        responsable: "María González",
        presupuesto: 80000,
        gastoReal: 75000,
        estado: "activo",
        descripcion: "Gastos administrativos generales"
      },
      {
        id: "3",
        codigo: "VTA-001",
        nombre: "Ventas y Marketing",
        tipo: "ventas",
        responsable: "Carlos López",
        presupuesto: 60000,
        gastoReal: 58000,
        estado: "activo",
        descripcion: "Actividades de ventas y marketing"
      }
    ];
    setCentrosCosto(centrosDemo);

    const asignacionesDemo: AsignacionCosto[] = [
      {
        id: "1",
        centroCostoId: "1",
        cuenta: "5111 - Sueldos y Salarios",
        concepto: "Sueldos personal producción",
        monto: 45000,
        fecha: "2024-01-15",
        tipo: "directo"
      },
      {
        id: "2",
        centroCostoId: "1",
        cuenta: "5121 - Materiales Directos",
        concepto: "Materia prima",
        monto: 35000,
        fecha: "2024-01-15",
        tipo: "directo"
      },
      {
        id: "3",
        centroCostoId: "2",
        cuenta: "5131 - Servicios Básicos",
        concepto: "Luz, agua, teléfono",
        monto: 8000,
        fecha: "2024-01-15",
        tipo: "indirecto",
        metodoDistribucion: "Prorrateo por superficie"
      }
    ];
    setAsignaciones(asignacionesDemo);
  }, []);

  const abrirDialogo = (centro?: CentroCosto) => {
    if (centro) {
      setModoEdicion(true);
      setCentroSeleccionado(centro);
      setNuevoCentro({
        codigo: centro.codigo,
        nombre: centro.nombre,
        tipo: centro.tipo,
        responsable: centro.responsable,
        presupuesto: centro.presupuesto,
        descripcion: centro.descripcion
      });
    } else {
      setModoEdicion(false);
      setCentroSeleccionado(null);
      setNuevoCentro({
        codigo: "",
        nombre: "",
        tipo: "productivo",
        responsable: "",
        presupuesto: 0,
        descripcion: ""
      });
    }
    setDialogAbierto(true);
  };

  const guardarCentro = () => {
    if (!nuevoCentro.codigo || !nuevoCentro.nombre) return;

    if (modoEdicion && centroSeleccionado) {
      setCentrosCosto(prev => prev.map(c => 
        c.id === centroSeleccionado.id 
          ? { ...c, ...nuevoCentro, gastoReal: c.gastoReal }
          : c
      ));
    } else {
      const centro: CentroCosto = {
        id: Date.now().toString(),
        ...nuevoCentro,
        gastoReal: 0,
        estado: "activo"
      };
      setCentrosCosto(prev => [...prev, centro]);
    }
    
    setDialogAbierto(false);
  };

  const agregarAsignacion = () => {
    if (!nuevaAsignacion.centroCostoId || !nuevaAsignacion.concepto || nuevaAsignacion.monto <= 0) return;

    const asignacion: AsignacionCosto = {
      id: Date.now().toString(),
      ...nuevaAsignacion,
      fecha: new Date().toISOString().slice(0, 10)
    };

    setAsignaciones(prev => [...prev, asignacion]);
    
    // Actualizar gasto real del centro de costo
    setCentrosCosto(prev => prev.map(c => 
      c.id === nuevaAsignacion.centroCostoId 
        ? { ...c, gastoReal: c.gastoReal + nuevaAsignacion.monto }
        : c
    ));

    setNuevaAsignacion({
      centroCostoId: "",
      cuenta: "",
      concepto: "",
      monto: 0,
      tipo: "directo",
      metodoDistribucion: ""
    });
  };

  const calcularDatosPie = () => {
    return centrosCosto.map((centro, index) => ({
      name: centro.nombre,
      value: centro.gastoReal,
      color: COLORES_PIE[index % COLORES_PIE.length]
    }));
  };

  const calcularDatosBarras = () => {
    return centrosCosto.map(centro => ({
      nombre: centro.codigo,
      presupuesto: centro.presupuesto,
      real: centro.gastoReal,
      variacion: ((centro.gastoReal / centro.presupuesto - 1) * 100).toFixed(1)
    }));
  };

  const totalPresupuesto = centrosCosto.reduce((sum, c) => sum + c.presupuesto, 0);
  const totalReal = centrosCosto.reduce((sum, c) => sum + c.gastoReal, 0);
  const variacionTotal = totalPresupuesto > 0 ? ((totalReal / totalPresupuesto - 1) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Resumen ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Presupuestado</p>
                <p className="text-2xl font-bold">Bs. {totalPresupuesto.toLocaleString()}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Ejecutado</p>
                <p className="text-2xl font-bold">Bs. {totalReal.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Variación</p>
                <p className={`text-2xl font-bold ${variacionTotal >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {variacionTotal.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Centros Activos</p>
                <p className="text-2xl font-bold">{centrosCosto.filter(c => c.estado === 'activo').length}</p>
              </div>
              <PieChart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="centros" className="space-y-4">
        <TabsList>
          <TabsTrigger value="centros">Centros de Costo</TabsTrigger>
          <TabsTrigger value="asignaciones">Asignaciones</TabsTrigger>
          <TabsTrigger value="analisis">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="centros">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestión de Centros de Costo</CardTitle>
                <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
                  <DialogTrigger asChild>
                    <Button onClick={() => abrirDialogo()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Centro de Costo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {modoEdicion ? 'Editar Centro de Costo' : 'Nuevo Centro de Costo'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Código</Label>
                          <Input
                            value={nuevoCentro.codigo}
                            onChange={(e) => setNuevoCentro(prev => ({ ...prev, codigo: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Tipo</Label>
                          <Select 
                            value={nuevoCentro.tipo} 
                            onValueChange={(value: any) => setNuevoCentro(prev => ({ ...prev, tipo: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="productivo">Productivo</SelectItem>
                              <SelectItem value="administrativo">Administrativo</SelectItem>
                              <SelectItem value="ventas">Ventas</SelectItem>
                              <SelectItem value="servicio">Servicio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Nombre</Label>
                        <Input
                          value={nuevoCentro.nombre}
                          onChange={(e) => setNuevoCentro(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Responsable</Label>
                          <Input
                            value={nuevoCentro.responsable}
                            onChange={(e) => setNuevoCentro(prev => ({ ...prev, responsable: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Presupuesto</Label>
                          <Input
                            type="number"
                            value={nuevoCentro.presupuesto}
                            onChange={(e) => setNuevoCentro(prev => ({ ...prev, presupuesto: Number(e.target.value) }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Textarea
                          value={nuevoCentro.descripcion}
                          onChange={(e) => setNuevoCentro(prev => ({ ...prev, descripcion: e.target.value }))}
                        />
                      </div>
                      <Button onClick={guardarCentro} className="w-full">
                        {modoEdicion ? 'Actualizar' : 'Crear'} Centro de Costo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Presupuesto</TableHead>
                    <TableHead>Ejecutado</TableHead>
                    <TableHead>Variación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centrosCosto.map((centro) => {
                    const variacion = centro.presupuesto > 0 ? ((centro.gastoReal / centro.presupuesto - 1) * 100) : 0;
                    return (
                      <TableRow key={centro.id}>
                        <TableCell className="font-medium">{centro.codigo}</TableCell>
                        <TableCell>{centro.nombre}</TableCell>
                        <TableCell>
                          <Badge variant={
                            centro.tipo === 'productivo' ? 'default' :
                            centro.tipo === 'administrativo' ? 'secondary' :
                            centro.tipo === 'ventas' ? 'destructive' : 'outline'
                          }>
                            {centro.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>{centro.responsable}</TableCell>
                        <TableCell>Bs. {centro.presupuesto.toLocaleString()}</TableCell>
                        <TableCell>Bs. {centro.gastoReal.toLocaleString()}</TableCell>
                        <TableCell className={variacion >= 0 ? 'text-red-600' : 'text-green-600'}>
                          {variacion.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <Badge variant={centro.estado === 'activo' ? 'default' : 'secondary'}>
                            {centro.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => abrirDialogo(centro)}>
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asignaciones">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nueva Asignación de Costo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label>Centro de Costo</Label>
                    <Select 
                      value={nuevaAsignacion.centroCostoId} 
                      onValueChange={(value) => setNuevaAsignacion(prev => ({ ...prev, centroCostoId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {centrosCosto.map(centro => (
                          <SelectItem key={centro.id} value={centro.id}>
                            {centro.codigo} - {centro.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cuenta Contable</Label>
                    <Select 
                      value={nuevaAsignacion.cuenta} 
                      onValueChange={(value) => setNuevaAsignacion(prev => ({ ...prev, cuenta: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5111 - Sueldos y Salarios">5111 - Sueldos y Salarios</SelectItem>
                        <SelectItem value="5121 - Materiales Directos">5121 - Materiales Directos</SelectItem>
                        <SelectItem value="5131 - Servicios Básicos">5131 - Servicios Básicos</SelectItem>
                        <SelectItem value="5141 - Depreciación">5141 - Depreciación</SelectItem>
                        <SelectItem value="5151 - Mantenimiento">5151 - Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Concepto</Label>
                    <Input
                      placeholder="Descripción del gasto"
                      value={nuevaAsignacion.concepto}
                      onChange={(e) => setNuevaAsignacion(prev => ({ ...prev, concepto: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Monto</Label>
                    <Input
                      type="number"
                      value={nuevaAsignacion.monto}
                      onChange={(e) => setNuevaAsignacion(prev => ({ ...prev, monto: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select 
                      value={nuevaAsignacion.tipo} 
                      onValueChange={(value: any) => setNuevaAsignacion(prev => ({ ...prev, tipo: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="directo">Directo</SelectItem>
                        <SelectItem value="indirecto">Indirecto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={agregarAsignacion} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Asignar Costo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registro de Asignaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Centro de Costo</TableHead>
                      <TableHead>Cuenta</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asignaciones.map((asignacion) => {
                      const centro = centrosCosto.find(c => c.id === asignacion.centroCostoId);
                      return (
                        <TableRow key={asignacion.id}>
                          <TableCell>{asignacion.fecha}</TableCell>
                          <TableCell>{centro?.codigo} - {centro?.nombre}</TableCell>
                          <TableCell>{asignacion.cuenta}</TableCell>
                          <TableCell>{asignacion.concepto}</TableCell>
                          <TableCell>Bs. {asignacion.monto.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={asignacion.tipo === 'directo' ? 'default' : 'secondary'}>
                              {asignacion.tipo}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                <CardTitle>Distribución de Costos por Centro</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={calcularDatosPie()}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {calcularDatosPie().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`Bs. ${value.toLocaleString()}`, "Gasto"]} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Presupuesto vs Real</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={calcularDatosBarras()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`Bs. ${value.toLocaleString()}`, ""]} />
                    <Bar dataKey="presupuesto" fill="#8884d8" name="Presupuesto" />
                    <Bar dataKey="real" fill="#82ca9d" name="Real" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CentrosCosto;
