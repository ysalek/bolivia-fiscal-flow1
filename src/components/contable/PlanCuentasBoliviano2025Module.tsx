import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  TreePine, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Eye
} from "lucide-react";
import { 
  planCuentasBoliviano2025, 
  CuentaContable, 
  obtenerCuentasPorTipo,
  obtenerCuentasActivas,
  obtenerCuentaPorCodigo,
  obtenerCuentasHijas,
  estructuraJerarquica
} from "@/utils/planCuentasBoliviano2025";

const PlanCuentasBoliviano2025Module = () => {
  const [cuentas, setCuentas] = useState<CuentaContable[]>(planCuentasBoliviano2025);
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [filtroBusqueda, setFiltroBusqueda] = useState<string>('');
  const [modoVista, setModoVista] = useState<'tabla' | 'arbol'>('tabla');
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaContable | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    cargarPlanCuentas();
  }, []);

  const cargarPlanCuentas = () => {
    const planGuardado = localStorage.getItem('planCuentasBoliviano2025');
    if (planGuardado) {
      const planParseado = JSON.parse(planGuardado);
      setCuentas(planParseado);
    } else {
      setCuentas(planCuentasBoliviano2025);
      guardarPlanCuentas(planCuentasBoliviano2025);
    }
  };

  const guardarPlanCuentas = (plan: CuentaContable[]) => {
    localStorage.setItem('planCuentasBoliviano2025', JSON.stringify(plan));
    setCuentas(plan);
  };

  const cuentasFiltradas = cuentas.filter(cuenta => {
    const pasaTipo = !filtroTipo || cuenta.tipo === filtroTipo;
    const pasaBusqueda = !filtroBusqueda || 
      cuenta.codigo.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      cuenta.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase());
    return pasaTipo && pasaBusqueda;
  });

  const exportarPlanCuentas = () => {
    const dataExport = {
      fecha: new Date().toISOString(),
      version: '2025.1',
      normativa: 'CAMC 2024 - SIN Bolivia',
      plan: cuentas
    };
    
    const blob = new Blob([JSON.stringify(dataExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan_cuentas_bolivia_2025_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    
    toast({
      title: "Plan de cuentas exportado",
      description: "El plan de cuentas se ha exportado correctamente."
    });
  };

  const importarPlanCuentas = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.plan && Array.isArray(data.plan)) {
            guardarPlanCuentas(data.plan);
            toast({
              title: "Plan de cuentas importado",
              description: "El plan de cuentas se ha importado correctamente."
            });
          } else {
            throw new Error('Formato de archivo inválido');
          }
        } catch (error) {
          toast({
            title: "Error al importar",
            description: "El archivo no tiene el formato correcto.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const restaurarPlanOriginal = () => {
    guardarPlanCuentas(planCuentasBoliviano2025);
    toast({
      title: "Plan restaurado",
      description: "Se ha restaurado el plan de cuentas original boliviano 2025."
    });
  };

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'activo': return 'default';
      case 'pasivo': return 'destructive';
      case 'patrimonio': return 'secondary';
      case 'ingreso': return 'outline';
      case 'gasto': return 'outline';
      default: return 'outline';
    }
  };

  const getNivelIndentacion = (nivel: number) => {
    return `${(nivel - 1) * 20}px`;
  };

  const renderArbolCuentas = (cuentas: any[], nivel: number = 1): React.ReactNode => {
    return cuentas.map((cuenta) => (
      <div key={cuenta.codigo} className="space-y-1">
        <div 
          className={`flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer ${
            cuentaSeleccionada?.codigo === cuenta.codigo ? 'bg-primary/10' : ''
          }`}
          style={{ paddingLeft: getNivelIndentacion(nivel) }}
          onClick={() => setCuentaSeleccionada(cuenta)}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{cuenta.codigo}</span>
            <span className={cuenta.activa ? 'font-medium' : 'text-muted-foreground'}>
              {cuenta.nombre}
            </span>
            {cuenta.requiereDetalle && (
              <Badge variant="outline" className="text-xs">Detalle</Badge>
            )}
            {cuenta.validacionesSIN && (
              <Badge variant="secondary" className="text-xs">SIN</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant(cuenta.tipo)}>
              {cuenta.tipo}
            </Badge>
            {cuenta.activa ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            )}
          </div>
        </div>
        {cuenta.hijas && cuenta.hijas.length > 0 && renderArbolCuentas(cuenta.hijas, nivel + 1)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Plan de Cuentas Bolivia 2025</h1>
            <p className="text-muted-foreground">
              Plan de cuentas actualizado según normativas CAMC 2024 y requerimientos SIN
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportarPlanCuentas} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importarPlanCuentas}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            </div>
            <Button onClick={restaurarPlanOriginal} variant="outline">
              Restaurar Original
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cuentas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cuentas.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {obtenerCuentasPorTipo('activo').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pasivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {obtenerCuentasPorTipo('pasivo').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {obtenerCuentasPorTipo('ingreso').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {obtenerCuentasPorTipo('gasto').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Vista */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros y Vista</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por código o nombre..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="min-w-[150px]">
                <select 
                  value={filtroTipo} 
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Todos los tipos</option>
                  <option value="activo">Activos</option>
                  <option value="pasivo">Pasivos</option>
                  <option value="patrimonio">Patrimonio</option>
                  <option value="ingreso">Ingresos</option>
                  <option value="gasto">Gastos</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={modoVista === 'tabla' ? 'default' : 'outline'}
                  onClick={() => setModoVista('tabla')}
                  size="sm"
                >
                  Tabla
                </Button>
                <Button 
                  variant={modoVista === 'arbol' ? 'default' : 'outline'}
                  onClick={() => setModoVista('arbol')}
                  size="sm"
                >
                  <TreePine className="h-4 w-4 mr-2" />
                  Árbol
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Cuentas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {modoVista === 'tabla' ? 'Plan de Cuentas' : 'Estructura Jerárquica'}
                </CardTitle>
                <CardDescription>
                  {cuentasFiltradas.length} cuenta(s) mostrada(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {modoVista === 'tabla' ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Validaciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cuentasFiltradas.map((cuenta) => (
                        <TableRow 
                          key={cuenta.codigo}
                          className={`cursor-pointer ${
                            cuentaSeleccionada?.codigo === cuenta.codigo ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => setCuentaSeleccionada(cuenta)}
                        >
                          <TableCell className="font-mono">{cuenta.codigo}</TableCell>
                          <TableCell className={cuenta.activa ? 'font-medium' : 'text-muted-foreground'}>
                            {cuenta.nombre}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(cuenta.tipo)}>
                              {cuenta.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell>{cuenta.nivel}</TableCell>
                          <TableCell>
                            {cuenta.activa ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {cuenta.requiereDetalle && (
                                <Badge variant="outline" className="text-xs">Detalle</Badge>
                              )}
                              {cuenta.validacionesSIN && (
                                <Badge variant="secondary" className="text-xs">SIN</Badge>
                              )}
                              {cuenta.categoriaTributaria && (
                                <Badge variant="outline" className="text-xs">
                                  {cuenta.categoriaTributaria}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {renderArbolCuentas(estructuraJerarquica())}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de Detalles */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Detalles de Cuenta</CardTitle>
                <CardDescription>
                  {cuentaSeleccionada ? 
                    `Información detallada de ${cuentaSeleccionada.codigo}` :
                    'Selecciona una cuenta para ver sus detalles'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cuentaSeleccionada ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Código</label>
                      <p className="font-mono">{cuentaSeleccionada.codigo}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Nombre</label>
                      <p>{cuentaSeleccionada.nombre}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Tipo</label>
                        <p>
                          <Badge variant={getBadgeVariant(cuentaSeleccionada.tipo)}>
                            {cuentaSeleccionada.tipo}
                          </Badge>
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Naturaleza</label>
                        <p>{cuentaSeleccionada.naturaleza}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nivel</label>
                        <p>{cuentaSeleccionada.nivel}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Estado</label>
                        <p>
                          {cuentaSeleccionada.activa ? (
                            <Badge variant="default">Activa</Badge>
                          ) : (
                            <Badge variant="secondary">Inactiva</Badge>
                          )}
                        </p>
                      </div>
                    </div>

                    {cuentaSeleccionada.padre && (
                      <div>
                        <label className="text-sm font-medium">Cuenta Padre</label>
                        <p className="font-mono">{cuentaSeleccionada.padre}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Características</label>
                      <div className="flex flex-wrap gap-2">
                        {cuentaSeleccionada.requiereDetalle && (
                          <Badge variant="outline">Requiere Detalle</Badge>
                        )}
                        {cuentaSeleccionada.centrosCosto && (
                          <Badge variant="outline">Centros de Costo</Badge>
                        )}
                      </div>
                    </div>

                    {cuentaSeleccionada.validacionesSIN && cuentaSeleccionada.validacionesSIN.length > 0 && (
                      <div>
                        <label className="text-sm font-medium">Validaciones SIN</label>
                        <div className="space-y-1">
                          {cuentaSeleccionada.validacionesSIN.map((validacion, index) => (
                            <Badge key={index} variant="secondary" className="mr-1">
                              {validacion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cuentaSeleccionada.categoriaTributaria && (
                      <div>
                        <label className="text-sm font-medium">Categoría Tributaria</label>
                        <p>
                          <Badge variant="outline">{cuentaSeleccionada.categoriaTributaria}</Badge>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona una cuenta de la lista para ver sus detalles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCuentasBoliviano2025Module;