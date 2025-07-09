
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Calendar, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useAsientos } from '@/hooks/useAsientos';
import { AsientoContable } from './diary/DiaryData';
import { useToast } from '@/hooks/use-toast';

const LibroDiario = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().slice(0, 10));
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [asientoEditando, setAsientoEditando] = useState<AsientoContable | null>(null);
  const { getAsientos, guardarAsiento } = useAsientos();
  const { toast } = useToast();

  const [asientos, setAsientos] = useState<AsientoContable[]>([]);

  useEffect(() => {
    cargarAsientos();
  }, []);

  const cargarAsientos = () => {
    const asientosData = getAsientos();
    setAsientos(asientosData);
  };

  const filtrarAsientos = () => {
    return asientos.filter(asiento => {
      const fechaAsiento = new Date(asiento.fecha);
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);
      
      const cumpleFecha = fechaAsiento >= fechaInicioObj && fechaAsiento <= fechaFinObj;
      const cumpleEstado = filtroEstado === 'todos' || asiento.estado === filtroEstado;
      
      return cumpleFecha && cumpleEstado;
    });
  };

  const editarAsiento = (asiento: AsientoContable) => {
    setAsientoEditando({ ...asiento });
    setShowEditDialog(true);
  };

  const eliminarAsiento = (asientoId: string) => {
    if (confirm('¿Está seguro de eliminar este asiento? Esta acción no se puede deshacer.')) {
      const asientosActualizados = asientos.filter(a => a.id !== asientoId);
      setAsientos(asientosActualizados);
      localStorage.setItem('asientosContables', JSON.stringify(asientosActualizados));
      
      toast({
        title: "Asiento eliminado",
        description: "El asiento contable ha sido eliminado exitosamente",
        variant: "destructive"
      });
    }
  };

  const cambiarEstadoAsiento = (asientoId: string, nuevoEstado: 'borrador' | 'registrado' | 'anulado') => {
    const asientosActualizados = asientos.map(a => 
      a.id === asientoId ? { ...a, estado: nuevoEstado } : a
    );
    setAsientos(asientosActualizados);
    localStorage.setItem('asientosContables', JSON.stringify(asientosActualizados));
    
    toast({
      title: "Estado actualizado",
      description: `El asiento ha sido ${nuevoEstado === 'anulado' ? 'anulado' : nuevoEstado}`,
    });
  };

  const guardarEdicion = () => {
    if (!asientoEditando) return;

    const asientosActualizados = asientos.map(a => 
      a.id === asientoEditando.id ? asientoEditando : a
    );
    setAsientos(asientosActualizados);
    localStorage.setItem('asientosContables', JSON.stringify(asientosActualizados));
    
    toast({
      title: "Asiento actualizado",
      description: "Los cambios han sido guardados exitosamente",
    });
    
    setShowEditDialog(false);
    setAsientoEditando(null);
  };

  const asientosFiltrados = filtrarAsientos();
  const totalDebe = asientosFiltrados.reduce((sum, asiento) => sum + asiento.debe, 0);
  const totalHaber = asientosFiltrados.reduce((sum, asiento) => sum + asiento.haber, 0);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'registrado': return 'bg-green-100 text-green-800';
      case 'anulado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Libro Diario - Modo Administrador
          </CardTitle>
          <CardDescription>
            Registro cronológico de transacciones contables con capacidad de edición
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <Label htmlFor="fecha-inicio">Desde:</Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="fecha-fin">Hasta:</Label>
              <Input
                id="fecha-fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label>Estado:</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="registrado">Registrado</SelectItem>
                  <SelectItem value="anulado">Anulado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  Bs. {totalDebe.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Debe</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  Bs. {totalHaber.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Haber</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${Math.abs(totalDebe - totalHaber) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  Bs. {Math.abs(totalDebe - totalHaber).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Diferencia</div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>N° Asiento</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead className="text-right">Debe (Bs.)</TableHead>
                <TableHead className="text-right">Haber (Bs.)</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asientosFiltrados.map((asiento) => (
                <TableRow key={asiento.id}>
                  <TableCell>{new Date(asiento.fecha).toLocaleDateString('es-BO')}</TableCell>
                  <TableCell className="font-mono">{asiento.numero}</TableCell>
                  <TableCell>{asiento.concepto}</TableCell>
                  <TableCell>{asiento.referencia}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {asiento.debe.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-red-600">
                    {asiento.haber.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(asiento.estado)}>
                      {asiento.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editarAsiento(asiento)}
                        disabled={asiento.estado === 'anulado'}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      {asiento.estado === 'borrador' && (
                        <Button
                          size="sm"
                          onClick={() => cambiarEstadoAsiento(asiento.id, 'registrado')}
                        >
                          Registrar
                        </Button>
                      )}
                      
                      {asiento.estado === 'registrado' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cambiarEstadoAsiento(asiento.id, 'anulado')}
                        >
                          Anular
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => eliminarAsiento(asiento.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Asiento Contable</DialogTitle>
            <DialogDescription>
              Modifique los datos del asiento contable
            </DialogDescription>
          </DialogHeader>
          
          {asientoEditando && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={asientoEditando.fecha}
                    onChange={(e) => setAsientoEditando({
                      ...asientoEditando,
                      fecha: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Número</Label>
                  <Input
                    value={asientoEditando.numero}
                    onChange={(e) => setAsientoEditando({
                      ...asientoEditando,
                      numero: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label>Concepto</Label>
                <Input
                  value={asientoEditando.concepto}
                  onChange={(e) => setAsientoEditando({
                    ...asientoEditando,
                    concepto: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label>Referencia</Label>
                <Input
                  value={asientoEditando.referencia}
                  onChange={(e) => setAsientoEditando({
                    ...asientoEditando,
                    referencia: e.target.value
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Debe (Bs.)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={asientoEditando.debe}
                    onChange={(e) => setAsientoEditando({
                      ...asientoEditando,
                      debe: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label>Haber (Bs.)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={asientoEditando.haber}
                    onChange={(e) => setAsientoEditando({
                      ...asientoEditando,
                      haber: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={guardarEdicion}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibroDiario;
