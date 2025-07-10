import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Eye, AlertTriangle, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PresupuestoItem {
  id: string;
  concepto: string;
  categoria: string;
  presupuestado: number;
  ejecutado: number;
  variacion: number;
  porcentajeEjecucion: number;
}

interface Presupuesto {
  id: string;
  nombre: string;
  descripcion: string;
  periodo: string;
  estado: 'borrador' | 'aprobado' | 'en_ejecucion' | 'cerrado';
  totalPresupuestado: number;
  totalEjecutado: number;
  fechaInicio: string;
  fechaFin: string;
  responsable: string;
}

const PresupuestosEmpresariales = () => {
  const { toast } = useToast();
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<string>('');
  const [showDialog, setShowDialog] = useState(false);

  const [presupuestos] = useState<Presupuesto[]>(() => {
    const saved = localStorage.getItem('presupuestos');
    return saved ? JSON.parse(saved) : [];
  });

  const [itemsPresupuesto] = useState<PresupuestoItem[]>(() => {
    const saved = localStorage.getItem('itemsPresupuesto');
    return saved ? JSON.parse(saved) : [];
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'borrador': return 'bg-gray-100 text-gray-800';
      case 'aprobado': return 'bg-blue-100 text-blue-800';
      case 'en_ejecucion': return 'bg-green-100 text-green-800';
      case 'cerrado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVariacionIcon = (variacion: number) => {
    if (variacion > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (variacion < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Target className="w-4 h-4 text-blue-500" />;
  };

  const crearPresupuesto = () => {
    toast({
      title: "Presupuesto creado",
      description: "El nuevo presupuesto ha sido creado exitosamente",
    });
    setShowDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Presupuestos Empresariales</h2>
          <p className="text-muted-foreground">
            Gestión y control de presupuestos por departamentos y proyectos
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Presupuesto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Presupuesto</DialogTitle>
              <DialogDescription>
                Configure los parámetros para el nuevo presupuesto empresarial
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Presupuesto</Label>
                <Input id="nombre" placeholder="Ej. Presupuesto Anual 2024" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="periodo">Período</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anual">Anual</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fecha-inicio">Fecha de Inicio</Label>
                <Input id="fecha-inicio" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fecha-fin">Fecha de Fin</Label>
                <Input id="fecha-fin" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsable">Responsable</Label>
                <Input id="responsable" placeholder="Nombre del responsable" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monto-total">Monto Total Presupuestado</Label>
                <Input id="monto-total" type="number" placeholder="0.00" />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea id="descripcion" placeholder="Descripción del presupuesto" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={crearPresupuesto}>
                Crear Presupuesto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Presupuestado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Bs. 500,000</div>
            <p className="text-xs text-muted-foreground">Presupuesto actual</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ejecutado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Bs. 325,000</div>
            <p className="text-xs text-muted-foreground">65% ejecutado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Variación Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Bs. 175,000</div>
            <p className="text-xs text-muted-foreground">Pendiente de ejecutar</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Presupuestos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-xs text-muted-foreground">En ejecución</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista-presupuestos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista-presupuestos">Lista de Presupuestos</TabsTrigger>
          <TabsTrigger value="ejecucion-presupuestal">Ejecución Presupuestal</TabsTrigger>
          <TabsTrigger value="variaciones">Análisis de Variaciones</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="lista-presupuestos">
          <Card>
            <CardHeader>
              <CardTitle>Presupuestos Registrados</CardTitle>
              <CardDescription>
                Lista de todos los presupuestos empresariales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead className="text-right">Presupuestado</TableHead>
                    <TableHead className="text-right">Ejecutado</TableHead>
                    <TableHead>% Ejecución</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presupuestos.map((presupuesto) => (
                    <TableRow key={presupuesto.id}>
                      <TableCell className="font-medium">
                        {presupuesto.nombre}
                      </TableCell>
                      <TableCell>{presupuesto.periodo}</TableCell>
                      <TableCell>{presupuesto.responsable}</TableCell>
                      <TableCell className="text-right">
                        Bs. {presupuesto.totalPresupuestado.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        Bs. {presupuesto.totalEjecutado.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {((presupuesto.totalEjecutado / presupuesto.totalPresupuestado) * 100).toFixed(1)}%
                          </div>
                          <Progress 
                            value={(presupuesto.totalEjecutado / presupuesto.totalPresupuestado) * 100} 
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoColor(presupuesto.estado)}>
                          {presupuesto.estado.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ejecucion-presupuestal">
          <Card>
            <CardHeader>
              <CardTitle>Ejecución Presupuestal por Conceptos</CardTitle>
              <CardDescription>
                Seguimiento detallado de la ejecución presupuestal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Presupuestado</TableHead>
                    <TableHead className="text-right">Ejecutado</TableHead>
                    <TableHead className="text-right">Variación</TableHead>
                    <TableHead>% Ejecución</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsPresupuesto.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.concepto}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell className="text-right">
                        Bs. {item.presupuestado.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        Bs. {item.ejecutado.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          {getVariacionIcon(item.variacion)}
                          <span className={item.variacion > 0 ? 'text-red-600' : 'text-green-600'}>
                            Bs. {Math.abs(item.variacion).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{item.porcentajeEjecucion.toFixed(1)}%</div>
                          <Progress 
                            value={Math.min(item.porcentajeEjecucion, 100)} 
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.porcentajeEjecucion > 100 ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Sobrepasado
                          </Badge>
                        ) : item.porcentajeEjecucion > 90 ? (
                          <Badge variant="secondary">
                            Próximo al límite
                          </Badge>
                        ) : (
                          <Badge variant="default">
                            En rango
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variaciones">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Variaciones Favorables</CardTitle>
                <CardDescription>
                  Conceptos con menor gasto al presupuestado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">Gastos de Personal</div>
                    <div className="text-sm text-muted-foreground">Recursos Humanos</div>
                  </div>
                  <div className="text-green-600 font-bold">-Bs. 50,000</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">Gastos Operativos</div>
                    <div className="text-sm text-muted-foreground">Operaciones</div>
                  </div>
                  <div className="text-green-600 font-bold">-Bs. 40,000</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Variaciones Desfavorables</CardTitle>
                <CardDescription>
                  Conceptos que exceden el presupuesto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium">Gastos de Marketing</div>
                    <div className="text-sm text-muted-foreground">Ventas y Marketing</div>
                  </div>
                  <div className="text-red-600 font-bold">+Bs. 15,000</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reportes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes Disponibles</CardTitle>
                <CardDescription>
                  Genere reportes detallados de ejecución presupuestal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Reporte de Ejecución Presupuestal
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Análisis de Variaciones
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Proyección de Gastos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Comparativo Presupuestal
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Alertas</CardTitle>
                <CardDescription>
                  Configure alertas automáticas para el control presupuestal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Alerta por sobrepaso de presupuesto (%)</Label>
                  <Input type="number" placeholder="90" />
                </div>
                <div className="space-y-2">
                  <Label>Frecuencia de reportes</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="quincenal">Quincenal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Guardar Configuración</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PresupuestosEmpresariales;