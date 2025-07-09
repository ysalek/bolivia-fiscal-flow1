import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  PieChart,
  TrendingUp,
  Calculator,
  Factory,
  Store,
  Truck,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CentroCosto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipo: 'produccion' | 'administracion' | 'ventas' | 'distribucion';
  responsable: string;
  presupuesto: number;
  presupuestoEjecutado: number;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  departamento: string;
}

interface AsignacionCosto {
  id: string;
  centroCostoId: string;
  centroCostoNombre: string;
  concepto: string;
  monto: number;
  fecha: string;
  tipo: 'directo' | 'indirecto';
  comprobante: string;
}

const CentrosCostoModule = () => {
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionCosto[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingCentro, setEditingCentro] = useState<CentroCosto | null>(null);
  const [selectedTab, setSelectedTab] = useState("centros");
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    codigo: string;
    nombre: string;
    descripcion: string;
    tipo: 'produccion' | 'administracion' | 'ventas' | 'distribucion';
    responsable: string;
    presupuesto: number;
    departamento: string;
  }>({
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: 'produccion',
    responsable: '',
    presupuesto: 0,
    departamento: ''
  });

  const [assignFormData, setAssignFormData] = useState<{
    centroCostoId: string;
    concepto: string;
    monto: number;
    tipo: 'directo' | 'indirecto';
    comprobante: string;
  }>({
    centroCostoId: '',
    concepto: '',
    monto: 0,
    tipo: 'directo',
    comprobante: ''
  });

  useEffect(() => {
    loadCentrosCosto();
    loadAsignaciones();
  }, []);

  const loadCentrosCosto = () => {
    const stored = localStorage.getItem('centrosCosto');
    if (stored) {
      setCentrosCosto(JSON.parse(stored));
    }
  };

  const loadAsignaciones = () => {
    const stored = localStorage.getItem('asignacionesCosto');
    if (stored) {
      setAsignaciones(JSON.parse(stored));
    }
  };

  const saveCentrosCosto = (centros: CentroCosto[]) => {
    localStorage.setItem('centrosCosto', JSON.stringify(centros));
    setCentrosCosto(centros);
  };

  const saveAsignaciones = (assigns: AsignacionCosto[]) => {
    localStorage.setItem('asignacionesCosto', JSON.stringify(assigns));
    setAsignaciones(assigns);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const centro: CentroCosto = {
      id: editingCentro?.id || Date.now().toString(),
      codigo: formData.codigo,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      tipo: formData.tipo,
      responsable: formData.responsable,
      presupuesto: formData.presupuesto,
      presupuestoEjecutado: editingCentro?.presupuestoEjecutado || 0,
      estado: 'activo',
      fechaCreacion: editingCentro?.fechaCreacion || new Date().toISOString().split('T')[0],
      departamento: formData.departamento
    };

    if (editingCentro) {
      const updated = centrosCosto.map(c => c.id === editingCentro.id ? centro : c);
      saveCentrosCosto(updated);
      toast({ title: "Centro de costo actualizado correctamente" });
    } else {
      saveCentrosCosto([...centrosCosto, centro]);
      toast({ title: "Centro de costo creado correctamente" });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleAssignCost = (e: React.FormEvent) => {
    e.preventDefault();

    const centro = centrosCosto.find(c => c.id === assignFormData.centroCostoId);
    if (!centro) return;

    const asignacion: AsignacionCosto = {
      id: Date.now().toString(),
      centroCostoId: assignFormData.centroCostoId,
      centroCostoNombre: centro.nombre,
      concepto: assignFormData.concepto,
      monto: assignFormData.monto,
      fecha: new Date().toISOString().split('T')[0],
      tipo: assignFormData.tipo,
      comprobante: assignFormData.comprobante
    };

    saveAsignaciones([...asignaciones, asignacion]);

    // Actualizar presupuesto ejecutado
    const updatedCentros = centrosCosto.map(c => 
      c.id === assignFormData.centroCostoId 
        ? { ...c, presupuestoEjecutado: c.presupuestoEjecutado + assignFormData.monto }
        : c
    );
    saveCentrosCosto(updatedCentros);

    toast({ title: "Costo asignado correctamente" });
    setAssignFormData({
      centroCostoId: '',
      concepto: '',
      monto: 0,
      tipo: 'directo',
      comprobante: ''
    });
    setIsAssignDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      tipo: 'produccion',
      responsable: '',
      presupuesto: 0,
      departamento: ''
    });
    setEditingCentro(null);
  };

  const handleEdit = (centro: CentroCosto) => {
    setFormData({
      codigo: centro.codigo,
      nombre: centro.nombre,
      descripcion: centro.descripcion,
      tipo: centro.tipo,
      responsable: centro.responsable,
      presupuesto: centro.presupuesto,
      departamento: centro.departamento
    });
    setEditingCentro(centro);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = centrosCosto.filter(c => c.id !== id);
    saveCentrosCosto(updated);
    toast({ title: "Centro de costo eliminado" });
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'produccion': return <Factory className="w-4 h-4" />;
      case 'administracion': return <Building2 className="w-4 h-4" />;
      case 'ventas': return <Store className="w-4 h-4" />;
      case 'distribucion': return <Truck className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'produccion': return 'bg-blue-100 text-blue-800';
      case 'administracion': return 'bg-gray-100 text-gray-800';
      case 'ventas': return 'bg-green-100 text-green-800';
      case 'distribucion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calcularTotalAsignado = (centroCostoId: string) => {
    return asignaciones
      .filter(a => a.centroCostoId === centroCostoId)
      .reduce((total, a) => total + a.monto, 0);
  };

  const calcularPorcentajeEjecucion = (centro: CentroCosto) => {
    if (centro.presupuesto === 0) return 0;
    return (centro.presupuestoEjecutado / centro.presupuesto) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Centros de Costo</h2>
          <p className="text-muted-foreground">Gestión y control de centros de costo empresariales</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="w-4 h-4 mr-2" />
                Asignar Costo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Asignar Costo a Centro</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAssignCost} className="space-y-4">
                <div>
                  <Label htmlFor="centroCostoId">Centro de Costo</Label>
                  <Select value={assignFormData.centroCostoId} onValueChange={(value) => 
                    setAssignFormData({...assignFormData, centroCostoId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar centro" />
                    </SelectTrigger>
                    <SelectContent>
                      {centrosCosto.map((centro) => (
                        <SelectItem key={centro.id} value={centro.id}>
                          {centro.codigo} - {centro.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="concepto">Concepto</Label>
                  <Input
                    id="concepto"
                    value={assignFormData.concepto}
                    onChange={(e) => setAssignFormData({...assignFormData, concepto: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="monto">Monto (Bs.)</Label>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    value={assignFormData.monto}
                    onChange={(e) => setAssignFormData({...assignFormData, monto: parseFloat(e.target.value)})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Costo</Label>
                  <Select value={assignFormData.tipo} onValueChange={(value: 'directo' | 'indirecto') => 
                    setAssignFormData({...assignFormData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="directo">Directo</SelectItem>
                      <SelectItem value="indirecto">Indirecto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="comprobante">No. Comprobante</Label>
                  <Input
                    id="comprobante"
                    value={assignFormData.comprobante}
                    onChange={(e) => setAssignFormData({...assignFormData, comprobante: e.target.value})}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">Asignar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Centro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCentro ? 'Editar Centro de Costo' : 'Nuevo Centro de Costo'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={formData.tipo} onValueChange={(value: any) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="produccion">Producción</SelectItem>
                        <SelectItem value="administracion">Administración</SelectItem>
                        <SelectItem value="ventas">Ventas</SelectItem>
                        <SelectItem value="distribucion">Distribución</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="departamento">Departamento</Label>
                    <Input
                      id="departamento"
                      value={formData.departamento}
                      onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsable">Responsable</Label>
                    <Input
                      id="responsable"
                      value={formData.responsable}
                      onChange={(e) => setFormData({...formData, responsable: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="presupuesto">Presupuesto (Bs.)</Label>
                    <Input
                      id="presupuesto"
                      type="number"
                      step="0.01"
                      value={formData.presupuesto}
                      onChange={(e) => setFormData({...formData, presupuesto: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingCentro ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="centros">Centros de Costo</TabsTrigger>
          <TabsTrigger value="asignaciones">Asignaciones</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="centros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Centros de Costo</CardTitle>
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
                    <TableHead>% Ejecución</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centrosCosto.map((centro) => {
                    const porcentaje = calcularPorcentajeEjecucion(centro);
                    return (
                      <TableRow key={centro.id}>
                        <TableCell className="font-medium">{centro.codigo}</TableCell>
                        <TableCell>{centro.nombre}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoIcon(centro.tipo)}
                            <Badge className={getTipoBadgeColor(centro.tipo)}>
                              {centro.tipo}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{centro.responsable}</TableCell>
                        <TableCell>Bs. {centro.presupuesto.toLocaleString()}</TableCell>
                        <TableCell>Bs. {centro.presupuestoEjecutado.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${porcentaje > 100 ? 'bg-red-500' : porcentaje > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(porcentaje, 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm ${porcentaje > 100 ? 'text-red-600' : ''}`}>
                              {porcentaje.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={centro.estado === 'activo' ? 'default' : 'secondary'}>
                            {centro.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(centro)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(centro.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asignaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asignaciones de Costos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Centro de Costo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Comprobante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asignaciones.map((asignacion) => (
                    <TableRow key={asignacion.id}>
                      <TableCell>{asignacion.fecha}</TableCell>
                      <TableCell>{asignacion.centroCostoNombre}</TableCell>
                      <TableCell>{asignacion.concepto}</TableCell>
                      <TableCell>
                        <Badge variant={asignacion.tipo === 'directo' ? 'default' : 'secondary'}>
                          {asignacion.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>Bs. {asignacion.monto.toLocaleString()}</TableCell>
                      <TableCell>{asignacion.comprobante}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Centros</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{centrosCosto.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Bs. {centrosCosto.reduce((total, c) => total + c.presupuesto, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ejecutado</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Bs. {centrosCosto.reduce((total, c) => total + c.presupuestoEjecutado, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">% Ejecución Global</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {centrosCosto.reduce((total, c) => total + c.presupuesto, 0) > 0 
                    ? ((centrosCosto.reduce((total, c) => total + c.presupuestoEjecutado, 0) / 
                        centrosCosto.reduce((total, c) => total + c.presupuesto, 0)) * 100).toFixed(1)
                    : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ejecución por Centro de Costo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {centrosCosto.map((centro) => {
                  const porcentaje = calcularPorcentajeEjecucion(centro);
                  return (
                    <div key={centro.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{centro.nombre}</span>
                        <span className="text-sm text-muted-foreground">
                          Bs. {centro.presupuestoEjecutado.toLocaleString()} / Bs. {centro.presupuesto.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${porcentaje > 100 ? 'bg-red-500' : porcentaje > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(porcentaje, 100)}%` }}
                        />
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {porcentaje.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CentrosCostoModule;