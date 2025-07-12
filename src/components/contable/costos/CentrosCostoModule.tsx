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
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Calculator,
  Factory,
  Store,
  Truck,
  Users,
  DollarSign,
  AlertTriangle,
  Target,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CentroCosto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipo: 'administracion' | 'operacional' | 'ventas' | 'financiero' | 'limpieza' | 'mantenimiento';
  responsable: string;
  presupuesto: number;
  presupuestoEjecutado: number;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  departamento: string;
  cuentasContables: string[]; // Códigos de cuentas del plan de cuentas asociadas
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
  cuentaContable: string;
}

interface AnalisisRentabilidad {
  ingresosTotales: number;
  gastosTotales: number;
  gastosOperacionales: number;
  gastosAdministrativos: number;
  gastosFinancieros: number;
  gastosLimpieza: number;
  gastosMantenimiento: number;
  gastosVentas: number;
  utilidadBruta: number;
  utilidadOperacional: number;
  utilidadNeta: number;
  margenBruto: number;
  margenOperacional: number;
  margenNeto: number;
  costoOperacion: number;
  eficienciaOperacional: number;
}

const COLORES_GRAFICOS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe', '#ff8c42'
];

const CentrosCostoModule = () => {
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionCosto[]>([]);
  const [analisisRentabilidad, setAnalisisRentabilidad] = useState<AnalisisRentabilidad | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingCentro, setEditingCentro] = useState<CentroCosto | null>(null);
  const [selectedTab, setSelectedTab] = useState("centros");
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    codigo: string;
    nombre: string;
    descripcion: string;
    tipo: 'administracion' | 'operacional' | 'ventas' | 'financiero' | 'limpieza' | 'mantenimiento';
    responsable: string;
    presupuesto: number;
    departamento: string;
    cuentasContables: string[];
  }>({
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: 'administracion',
    responsable: '',
    presupuesto: 0,
    departamento: '',
    cuentasContables: []
  });

  const [assignFormData, setAssignFormData] = useState<{
    centroCostoId: string;
    concepto: string;
    monto: number;
    tipo: 'directo' | 'indirecto';
    comprobante: string;
    cuentaContable: string;
  }>({
    centroCostoId: '',
    concepto: '',
    monto: 0,
    tipo: 'directo',
    comprobante: '',
    cuentaContable: ''
  });

  useEffect(() => {
    loadCentrosCosto();
    loadAsignaciones();
    inicializarCentrosPorDefecto();
    calcularAnalisisRentabilidad();
  }, []);

  useEffect(() => {
    calcularAnalisisRentabilidad();
  }, [asignaciones]);

  const inicializarCentrosPorDefecto = () => {
    const stored = localStorage.getItem('centrosCosto');
    if (!stored || JSON.parse(stored).length === 0) {
      const centrosPorDefecto: CentroCosto[] = [
        {
          id: '1',
          codigo: 'ADM001',
          nombre: 'Administración General',
          descripcion: 'Gastos administrativos generales de la empresa',
          tipo: 'administracion',
          responsable: 'Gerente General',
          presupuesto: 50000,
          presupuestoEjecutado: 0,
          estado: 'activo',
          fechaCreacion: new Date().toISOString().split('T')[0],
          departamento: 'Administración',
          cuentasContables: ['5211', '5212', '5231', '5191']
        },
        {
          id: '2',
          codigo: 'FIN001',
          nombre: 'Gastos Financieros',
          descripcion: 'Intereses bancarios, comisiones y gastos financieros',
          tipo: 'financiero',
          responsable: 'Contador',
          presupuesto: 15000,
          presupuestoEjecutado: 0,
          estado: 'activo',
          fechaCreacion: new Date().toISOString().split('T')[0],
          departamento: 'Finanzas',
          cuentasContables: ['5291']
        },
        {
          id: '3',
          codigo: 'LIM001',
          nombre: 'Limpieza y Aseo',
          descripcion: 'Productos de limpieza, servicios de aseo y mantenimiento básico',
          tipo: 'limpieza',
          responsable: 'Jefe de Servicios',
          presupuesto: 8000,
          presupuestoEjecutado: 0,
          estado: 'activo',
          fechaCreacion: new Date().toISOString().split('T')[0],
          departamento: 'Servicios',
          cuentasContables: ['5251']
        },
        {
          id: '4',
          codigo: 'MAN001',
          nombre: 'Mantenimiento y Reparaciones',
          descripcion: 'Mantenimiento de equipos, reparaciones y servicios técnicos',
          tipo: 'mantenimiento',
          responsable: 'Jefe de Mantenimiento',
          presupuesto: 12000,
          presupuestoEjecutado: 0,
          estado: 'activo',
          fechaCreacion: new Date().toISOString().split('T')[0],
          departamento: 'Mantenimiento',
          cuentasContables: ['5271']
        },
        {
          id: '5',
          codigo: 'VEN001',
          nombre: 'Gastos de Ventas',
          descripcion: 'Marketing, publicidad y gastos de ventas',
          tipo: 'ventas',
          responsable: 'Gerente de Ventas',
          presupuesto: 20000,
          presupuestoEjecutado: 0,
          estado: 'activo',
          fechaCreacion: new Date().toISOString().split('T')[0],
          departamento: 'Ventas',
          cuentasContables: ['522']
        },
        {
          id: '6',
          codigo: 'OPE001',
          nombre: 'Gastos Operacionales',
          descripcion: 'Costos operativos directos del negocio',
          tipo: 'operacional',
          responsable: 'Gerente de Operaciones',
          presupuesto: 35000,
          presupuestoEjecutado: 0,
          estado: 'activo',
          fechaCreacion: new Date().toISOString().split('T')[0],
          departamento: 'Operaciones',
          cuentasContables: ['5111', '511']
        }
      ];
      
      localStorage.setItem('centrosCosto', JSON.stringify(centrosPorDefecto));
      setCentrosCosto(centrosPorDefecto);
    }
  };

  const calcularAnalisisRentabilidad = () => {
    try {
      // Obtener datos reales del sistema contable
      const comprobantes = JSON.parse(localStorage.getItem('comprobantes') || '[]');
      const facturas = JSON.parse(localStorage.getItem('invoices') || '[]');
      
      // Calcular ingresos totales de facturas
      const ingresosTotales = facturas
        .filter((f: any) => f.status === 'paid')
        .reduce((total: number, f: any) => total + (f.total || 0), 0);

      // Calcular gastos por tipo de centro de costo
      const gastosAdministrativos = asignaciones
        .filter(a => {
          const centro = centrosCosto.find(c => c.id === a.centroCostoId);
          return centro?.tipo === 'administracion';
        })
        .reduce((total, a) => total + a.monto, 0);

      const gastosFinancieros = asignaciones
        .filter(a => {
          const centro = centrosCosto.find(c => c.id === a.centroCostoId);
          return centro?.tipo === 'financiero';
        })
        .reduce((total, a) => total + a.monto, 0);

      const gastosLimpieza = asignaciones
        .filter(a => {
          const centro = centrosCosto.find(c => c.id === a.centroCostoId);
          return centro?.tipo === 'limpieza';
        })
        .reduce((total, a) => total + a.monto, 0);

      const gastosMantenimiento = asignaciones
        .filter(a => {
          const centro = centrosCosto.find(c => c.id === a.centroCostoId);
          return centro?.tipo === 'mantenimiento';
        })
        .reduce((total, a) => total + a.monto, 0);

      const gastosVentas = asignaciones
        .filter(a => {
          const centro = centrosCosto.find(c => c.id === a.centroCostoId);
          return centro?.tipo === 'ventas';
        })
        .reduce((total, a) => total + a.monto, 0);

      const gastosOperacionales = asignaciones
        .filter(a => {
          const centro = centrosCosto.find(c => c.id === a.centroCostoId);
          return centro?.tipo === 'operacional';
        })
        .reduce((total, a) => total + a.monto, 0);

      const gastosTotales = gastosAdministrativos + gastosFinancieros + gastosLimpieza + 
                           gastosMantenimiento + gastosVentas + gastosOperacionales;

      const costoOperacion = gastosAdministrativos + gastosFinancieros + gastosLimpieza + gastosMantenimiento;
      const utilidadBruta = ingresosTotales - gastosOperacionales;
      const utilidadOperacional = utilidadBruta - costoOperacion - gastosVentas;
      const utilidadNeta = utilidadOperacional;

      const margenBruto = ingresosTotales > 0 ? (utilidadBruta / ingresosTotales) * 100 : 0;
      const margenOperacional = ingresosTotales > 0 ? (utilidadOperacional / ingresosTotales) * 100 : 0;
      const margenNeto = ingresosTotales > 0 ? (utilidadNeta / ingresosTotales) * 100 : 0;
      const eficienciaOperacional = ingresosTotales > 0 ? (costoOperacion / ingresosTotales) * 100 : 0;

      setAnalisisRentabilidad({
        ingresosTotales,
        gastosTotales,
        gastosOperacionales,
        gastosAdministrativos,
        gastosFinancieros,
        gastosLimpieza,
        gastosMantenimiento,
        gastosVentas,
        utilidadBruta,
        utilidadOperacional,
        utilidadNeta,
        margenBruto,
        margenOperacional,
        margenNeto,
        costoOperacion,
        eficienciaOperacional
      });
    } catch (error) {
      console.error('Error calculando análisis de rentabilidad:', error);
    }
  };

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
      departamento: formData.departamento,
      cuentasContables: formData.cuentasContables
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
      comprobante: assignFormData.comprobante,
      cuentaContable: assignFormData.cuentaContable
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
      comprobante: '',
      cuentaContable: ''
    });
    setIsAssignDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      tipo: 'administracion',
      responsable: '',
      presupuesto: 0,
      departamento: '',
      cuentasContables: []
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
      departamento: centro.departamento,
      cuentasContables: centro.cuentasContables || []
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
      case 'operacional': return <Factory className="w-4 h-4" />;
      case 'administracion': return <Building2 className="w-4 h-4" />;
      case 'ventas': return <Store className="w-4 h-4" />;
      case 'financiero': return <DollarSign className="w-4 h-4" />;
      case 'limpieza': return <Users className="w-4 h-4" />;
      case 'mantenimiento': return <Activity className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'operacional': return 'bg-blue-100 text-blue-800';
      case 'administracion': return 'bg-gray-100 text-gray-800';
      case 'ventas': return 'bg-green-100 text-green-800';
      case 'financiero': return 'bg-yellow-100 text-yellow-800';
      case 'limpieza': return 'bg-purple-100 text-purple-800';
      case 'mantenimiento': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calcularPorcentajeEjecucion = (centro: CentroCosto) => {
    if (centro.presupuesto === 0) return 0;
    return (centro.presupuestoEjecutado / centro.presupuesto) * 100;
  };

  const obtenerDatosGraficoPorcentajes = () => {
    if (!analisisRentabilidad) return [];
    
    const total = analisisRentabilidad.ingresosTotales;
    if (total === 0) return [];

    return [
      { 
        name: 'Gastos Administración', 
        value: (analisisRentabilidad.gastosAdministrativos / total) * 100,
        monto: analisisRentabilidad.gastosAdministrativos 
      },
      { 
        name: 'Gastos Financieros', 
        value: (analisisRentabilidad.gastosFinancieros / total) * 100,
        monto: analisisRentabilidad.gastosFinancieros 
      },
      { 
        name: 'Gastos Limpieza', 
        value: (analisisRentabilidad.gastosLimpieza / total) * 100,
        monto: analisisRentabilidad.gastosLimpieza 
      },
      { 
        name: 'Gastos Mantenimiento', 
        value: (analisisRentabilidad.gastosMantenimiento / total) * 100,
        monto: analisisRentabilidad.gastosMantenimiento 
      },
      { 
        name: 'Gastos Ventas', 
        value: (analisisRentabilidad.gastosVentas / total) * 100,
        monto: analisisRentabilidad.gastosVentas 
      },
      { 
        name: 'Gastos Operacionales', 
        value: (analisisRentabilidad.gastosOperacionales / total) * 100,
        monto: analisisRentabilidad.gastosOperacionales 
      }
    ].filter(item => item.value > 0);
  };

  const obtenerDatosCentrosCosto = () => {
    return centrosCosto.map(centro => ({
      nombre: centro.nombre,
      presupuesto: centro.presupuesto,
      ejecutado: centro.presupuestoEjecutado,
      porcentaje: calcularPorcentajeEjecucion(centro)
    }));
  };

  const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Centros de Costo</h2>
          <p className="text-muted-foreground">Control y análisis de costos operacionales empresariales</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover-scale">
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
                    <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg z-50">
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
                  <Label htmlFor="cuentaContable">Cuenta Contable</Label>
                  <Select value={assignFormData.cuentaContable} onValueChange={(value) => 
                    setAssignFormData({...assignFormData, cuentaContable: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cuenta" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg z-50">
                      {planCuentas
                        .filter((cuenta: any) => cuenta.tipo === 'gastos')
                        .map((cuenta: any) => (
                        <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                          {cuenta.codigo} - {cuenta.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Costo</Label>
                  <Select value={assignFormData.tipo} onValueChange={(value: 'directo' | 'indirecto') => 
                    setAssignFormData({...assignFormData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg z-50">
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
              <Button onClick={resetForm} className="hover-scale">
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
                      <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg z-50">
                        <SelectItem value="administracion">Administración</SelectItem>
                        <SelectItem value="operacional">Operacional</SelectItem>
                        <SelectItem value="ventas">Ventas</SelectItem>
                        <SelectItem value="financiero">Financiero</SelectItem>
                        <SelectItem value="limpieza">Limpieza</SelectItem>
                        <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
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
                    <Label htmlFor="presupuesto">Presupuesto Anual (Bs.)</Label>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="centros">Centros de Costo</TabsTrigger>
          <TabsTrigger value="asignaciones">Asignaciones</TabsTrigger>
          <TabsTrigger value="analisis">Análisis Financiero</TabsTrigger>
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
                      <TableRow key={centro.id} className="hover:bg-muted/50 transition-colors">
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
                            <Progress value={Math.min(porcentaje, 100)} className="w-16" />
                            <span className={`text-sm ${porcentaje > 100 ? 'text-red-600' : porcentaje > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
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
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(centro)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(centro.id)}>
                              <Trash2 className="w-4 h-4" />
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
                    <TableHead>Cuenta Contable</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Comprobante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asignaciones.map((asignacion) => (
                    <TableRow key={asignacion.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>{asignacion.fecha}</TableCell>
                      <TableCell>{asignacion.centroCostoNombre}</TableCell>
                      <TableCell>{asignacion.concepto}</TableCell>
                      <TableCell>{asignacion.cuentaContable}</TableCell>
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

        <TabsContent value="analisis" className="space-y-4">
          {analisisRentabilidad && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover-scale">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">Bs. {analisisRentabilidad.ingresosTotales.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card className="hover-scale">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">Bs. {analisisRentabilidad.gastosTotales.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card className="hover-scale">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
                    <Target className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${analisisRentabilidad.utilidadNeta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Bs. {analisisRentabilidad.utilidadNeta.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-scale">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Margen Neto</CardTitle>
                    <PieChart className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${analisisRentabilidad.margenNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analisisRentabilidad.margenNeto.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Gastos por Centro de Costo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {obtenerDatosGraficoPorcentajes().map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: COLORES_GRAFICOS[index % COLORES_GRAFICOS.length] }}
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">Bs. {item.monto.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{item.value.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Análisis de Eficiencia Operacional</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Costo de Operación:</span>
                      <span className="font-bold">Bs. {analisisRentabilidad.costoOperacion.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Eficiencia Operacional:</span>
                      <span className={`font-bold ${analisisRentabilidad.eficienciaOperacional <= 30 ? 'text-green-600' : analisisRentabilidad.eficienciaOperacional <= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {analisisRentabilidad.eficienciaOperacional.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-4">
                      <Progress 
                        value={analisisRentabilidad.eficienciaOperacional} 
                        className="w-full" 
                      />
                    </div>
                    
                    {analisisRentabilidad.eficienciaOperacional > 50 && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600">
                          Alto costo operacional. Considere optimizar gastos administrativos.
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Desglose Detallado de Gastos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gastos Administrativos</span>
                        <Building2 className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="text-xl font-bold">Bs. {analisisRentabilidad.gastosAdministrativos.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {analisisRentabilidad.ingresosTotales > 0 ? ((analisisRentabilidad.gastosAdministrativos / analisisRentabilidad.ingresosTotales) * 100).toFixed(1) : 0}% de ingresos
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gastos Financieros</span>
                        <DollarSign className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div className="text-xl font-bold">Bs. {analisisRentabilidad.gastosFinancieros.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {analisisRentabilidad.ingresosTotales > 0 ? ((analisisRentabilidad.gastosFinancieros / analisisRentabilidad.ingresosTotales) * 100).toFixed(1) : 0}% de ingresos
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gastos de Limpieza</span>
                        <Users className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-xl font-bold">Bs. {analisisRentabilidad.gastosLimpieza.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {analisisRentabilidad.ingresosTotales > 0 ? ((analisisRentabilidad.gastosLimpieza / analisisRentabilidad.ingresosTotales) * 100).toFixed(1) : 0}% de ingresos
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gastos de Mantenimiento</span>
                        <Activity className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="text-xl font-bold">Bs. {analisisRentabilidad.gastosMantenimiento.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {analisisRentabilidad.ingresosTotales > 0 ? ((analisisRentabilidad.gastosMantenimiento / analisisRentabilidad.ingresosTotales) * 100).toFixed(1) : 0}% de ingresos
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gastos de Ventas</span>
                        <Store className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-xl font-bold">Bs. {analisisRentabilidad.gastosVentas.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {analisisRentabilidad.ingresosTotales > 0 ? ((analisisRentabilidad.gastosVentas / analisisRentabilidad.ingresosTotales) * 100).toFixed(1) : 0}% de ingresos
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gastos Operacionales</span>
                        <Factory className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="text-xl font-bold">Bs. {analisisRentabilidad.gastosOperacionales.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {analisisRentabilidad.ingresosTotales > 0 ? ((analisisRentabilidad.gastosOperacionales / analisisRentabilidad.ingresosTotales) * 100).toFixed(1) : 0}% de ingresos
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="reportes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Centros</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{centrosCosto.length}</div>
              </CardContent>
            </Card>

            <Card className="hover-scale">
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

            <Card className="hover-scale">
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

            <Card className="hover-scale">
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
              <CardTitle>Presupuesto vs Ejecutado por Centro</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={obtenerDatosCentrosCosto()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="nombre" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: any) => [`Bs. ${value.toLocaleString()}`, name]}
                  />
                  <Bar dataKey="presupuesto" fill="#8884d8" name="Presupuesto" />
                  <Bar dataKey="ejecutado" fill="#82ca9d" name="Ejecutado" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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
                      <Progress 
                        value={Math.min(porcentaje, 100)} 
                        className={`w-full ${porcentaje > 100 ? 'bg-red-200' : porcentaje > 80 ? 'bg-yellow-200' : 'bg-green-200'}`}
                      />
                      <div className="text-right text-sm text-muted-foreground">
                        {porcentaje.toFixed(1)}%
                        {porcentaje > 100 && <span className="text-red-600 ml-2">⚠️ Sobre presupuesto</span>}
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