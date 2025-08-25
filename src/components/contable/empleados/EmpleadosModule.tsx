import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  UserPlus, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  FileText,
  Award,
  Clock
} from 'lucide-react';
import { 
  Empleado, 
  empleadosIniciales, 
  cargosPorDepartamento, 
  beneficiosDisponibles,
  calcularAntiguedad,
  calcularEdad,
  generarNumeroEmpleado,
  validarCI,
  validarEmail
} from './EmpleadosData';

const EmpleadosModule: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [empleadoForm, setEmpleadoForm] = useState<Partial<Empleado>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('lista');
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const { toast } = useToast();

  // Cargar empleados del localStorage
  useEffect(() => {
    const data = localStorage.getItem('empleados');
    if (data) {
      setEmpleados(JSON.parse(data));
    } else {
      // Usar datos iniciales importados
      setEmpleados(empleadosIniciales);
      localStorage.setItem('empleados', JSON.stringify(empleadosIniciales));
    }
  }, []);

  const saveEmpleados = (newEmpleados: Empleado[]) => {
    setEmpleados(newEmpleados);
    localStorage.setItem('empleados', JSON.stringify(newEmpleados));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empleadoForm.nombres || !empleadoForm.apellidos || !empleadoForm.ci || !empleadoForm.cargo) {
      toast({
        title: "Error",
        description: "Complete los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    
    if (editingId) {
      // Actualizar empleado
      const updatedEmpleados = empleados.map(emp => 
        emp.id === editingId 
          ? { ...emp, ...empleadoForm, updatedAt: now } as Empleado
          : emp
      );
      saveEmpleados(updatedEmpleados);
      toast({
        title: "Empleado actualizado",
        description: "Los datos del empleado han sido actualizados exitosamente"
      });
    } else {
      // Crear nuevo empleado usando utilidades importadas
      const numeroEmpleado = generarNumeroEmpleado(empleados);
      const newEmpleado: Empleado = {
        id: Date.now().toString(),
        numeroEmpleado,
        ci: empleadoForm.ci || '',
        nombres: empleadoForm.nombres || '',
        apellidos: empleadoForm.apellidos || '',
        fechaNacimiento: empleadoForm.fechaNacimiento || '',
        telefono: empleadoForm.telefono || '',
        email: empleadoForm.email || '',
        direccion: empleadoForm.direccion || '',
        cargo: empleadoForm.cargo || '',
        departamento: empleadoForm.departamento || '',
        fechaIngreso: empleadoForm.fechaIngreso || new Date().toISOString().split('T')[0],
        salarioBase: empleadoForm.salarioBase || 0,
        estado: empleadoForm.estado || 'activo',
        tipoContrato: empleadoForm.tipoContrato || 'indefinido',
        cuentaBancaria: empleadoForm.cuentaBancaria,
        contactoEmergencia: empleadoForm.contactoEmergencia,
        beneficios: empleadoForm.beneficios || [],
        createdAt: now,
        updatedAt: now
      };
      
      saveEmpleados([...empleados, newEmpleado]);
      toast({
        title: "Empleado registrado",
        description: `Empleado ${newEmpleado.nombres} ${newEmpleado.apellidos} registrado exitosamente`
      });
    }

    setEmpleadoForm({});
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (empleado: Empleado) => {
    setEmpleadoForm(empleado);
    setEditingId(empleado.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const empleado = empleados.find(emp => emp.id === id);
    if (empleado && window.confirm(`¿Está seguro de eliminar a ${empleado.nombres} ${empleado.apellidos}?`)) {
      const updatedEmpleados = empleados.filter(emp => emp.id !== id);
      saveEmpleados(updatedEmpleados);
      toast({
        title: "Empleado eliminado",
        description: "El empleado ha sido eliminado del sistema"
      });
    }
  };

  const handleView = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setSelectedTab('detalle');
  };

  const filteredEmpleados = empleados.filter(empleado =>
    empleado.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.numeroEmpleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.ci.includes(searchTerm) ||
    empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-success text-success-foreground">Activo</Badge>;
      case 'inactivo':
        return <Badge variant="secondary">Inactivo</Badge>;
      case 'vacaciones':
        return <Badge className="bg-warning text-warning-foreground">Vacaciones</Badge>;
      case 'licencia':
        return <Badge variant="outline">Licencia</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const estadisticas = {
    total: empleados.length,
    activos: empleados.filter(emp => emp.estado === 'activo').length,
    inactivos: empleados.filter(emp => emp.estado === 'inactivo').length,
    enVacaciones: empleados.filter(emp => emp.estado === 'vacaciones').length,
    totalNomina: empleados.reduce((sum, emp) => sum + emp.salarioBase, 0)
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestión de Empleados
          </CardTitle>
          <CardDescription>
            Administre la información del personal de la empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Empleados</span>
              </div>
              <p className="text-2xl font-bold text-primary">{estadisticas.total}</p>
            </div>
            <div className="bg-success/10 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Activos</span>
              </div>
              <p className="text-2xl font-bold text-success">{estadisticas.activos}</p>
            </div>
            <div className="bg-warning/10 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">En Vacaciones</span>
              </div>
              <p className="text-2xl font-bold text-warning">{estadisticas.enVacaciones}</p>
            </div>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Nómina Total</span>
              </div>
              <p className="text-2xl font-bold">Bs. {estadisticas.totalNomina.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lista">Lista de Empleados</TabsTrigger>
          <TabsTrigger value="detalle" disabled={!selectedEmpleado}>Detalle Empleado</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="lista">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar empleados..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEmpleadoForm({});
                      setEditingId(null);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Empleado
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingId ? 'Editar Empleado' : 'Nuevo Empleado'}
                      </DialogTitle>
                      <DialogDescription>
                        Complete la información del empleado
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ci">Cédula de Identidad *</Label>
                          <Input
                            id="ci"
                            value={empleadoForm.ci || ''}
                            onChange={(e) => setEmpleadoForm({...empleadoForm, ci: e.target.value})}
                            placeholder="12345678"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nombres">Nombres *</Label>
                          <Input
                            id="nombres"
                            value={empleadoForm.nombres || ''}
                            onChange={(e) => setEmpleadoForm({...empleadoForm, nombres: e.target.value})}
                            placeholder="Juan Carlos"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellidos">Apellidos *</Label>
                          <Input
                            id="apellidos"
                            value={empleadoForm.apellidos || ''}
                            onChange={(e) => setEmpleadoForm({...empleadoForm, apellidos: e.target.value})}
                            placeholder="Mamani Quispe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                          <Input
                            id="fechaNacimiento"
                            type="date"
                            value={empleadoForm.fechaNacimiento || ''}
                            onChange={(e) => setEmpleadoForm({...empleadoForm, fechaNacimiento: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            value={empleadoForm.telefono || ''}
                            onChange={(e) => setEmpleadoForm({...empleadoForm, telefono: e.target.value})}
                            placeholder="76543210"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={empleadoForm.email || ''}
                            onChange={(e) => setEmpleadoForm({...empleadoForm, email: e.target.value})}
                            placeholder="empleado@empresa.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          value={empleadoForm.direccion || ''}
                          onChange={(e) => setEmpleadoForm({...empleadoForm, direccion: e.target.value})}
                          placeholder="Av. 6 de Agosto #123, La Paz"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cargo">Cargo *</Label>
                          <Select
                            value={empleadoForm.cargo || ''}
                            onValueChange={(value) => setEmpleadoForm({...empleadoForm, cargo: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              {empleadoForm.departamento && cargosPorDepartamento[empleadoForm.departamento] ? 
                                cargosPorDepartamento[empleadoForm.departamento].map(cargo => (
                                  <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                                )) :
                                Object.values(cargosPorDepartamento).flat().map(cargo => (
                                  <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="departamento">Departamento</Label>
                          <Select
                            value={empleadoForm.departamento || ''}
                            onValueChange={(value) => setEmpleadoForm({...empleadoForm, departamento: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar departamento" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(cargosPorDepartamento).map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                          <Input
                            id="fechaIngreso"
                            type="date"
                            value={empleadoForm.fechaIngreso || ''}
                            onChange={(e) => setEmpleadoForm({...empleadoForm, fechaIngreso: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salarioBase">Salario Base (Bs.)</Label>
                          <Input
                            id="salarioBase"
                            type="number"
                            step="0.01"
                            value={empleadoForm.salarioBase || ''}
                            onChange={(e) => setEmpleadoForm({...empleadoForm, salarioBase: parseFloat(e.target.value) || 0})}
                            placeholder="4500.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estado">Estado</Label>
                          <Select
                            value={empleadoForm.estado || 'activo'}
                            onValueChange={(value: any) => setEmpleadoForm({...empleadoForm, estado: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="activo">Activo</SelectItem>
                              <SelectItem value="inactivo">Inactivo</SelectItem>
                              <SelectItem value="vacaciones">Vacaciones</SelectItem>
                              <SelectItem value="licencia">Licencia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                          <Select
                            value={empleadoForm.tipoContrato || 'indefinido'}
                            onValueChange={(value: any) => setEmpleadoForm({...empleadoForm, tipoContrato: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="indefinido">Indefinido</SelectItem>
                              <SelectItem value="temporal">Temporal</SelectItem>
                              <SelectItem value="consultor">Consultor</SelectItem>
                              <SelectItem value="practicante">Practicante</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cuentaBancaria">Cuenta Bancaria</Label>
                        <Input
                          id="cuentaBancaria"
                          value={empleadoForm.cuentaBancaria || ''}
                          onChange={(e) => setEmpleadoForm({...empleadoForm, cuentaBancaria: e.target.value})}
                          placeholder="1234567890"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingId ? 'Actualizar' : 'Registrar'} Empleado
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Empleado</TableHead>
                      <TableHead>Nombre Completo</TableHead>
                      <TableHead>CI</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Salario</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmpleados.map((empleado) => (
                      <TableRow key={empleado.id}>
                        <TableCell className="font-medium">{empleado.numeroEmpleado}</TableCell>
                        <TableCell>{empleado.nombres} {empleado.apellidos}</TableCell>
                        <TableCell>{empleado.ci}</TableCell>
                        <TableCell>{empleado.cargo}</TableCell>
                        <TableCell>{empleado.departamento}</TableCell>
                        <TableCell>Bs. {empleado.salarioBase.toLocaleString()}</TableCell>
                        <TableCell>{getEstadoBadge(empleado.estado)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(empleado)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(empleado)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(empleado.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detalle">
          {selectedEmpleado && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Detalle del Empleado: {selectedEmpleado.nombres} {selectedEmpleado.apellidos}
                </CardTitle>
                <CardDescription>
                  Información completa del empleado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Información Personal
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CI:</span>
                        <span>{selectedEmpleado.ci}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha Nacimiento:</span>
                        <span>{selectedEmpleado.fechaNacimiento || 'No especificada'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teléfono:</span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedEmpleado.telefono}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {selectedEmpleado.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dirección:</span>
                        <span className="flex items-center gap-1 text-right">
                          <MapPin className="h-3 w-3" />
                          <span className="max-w-40 truncate">{selectedEmpleado.direccion}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Información Laboral
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">N° Empleado:</span>
                        <span>{selectedEmpleado.numeroEmpleado}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cargo:</span>
                        <span>{selectedEmpleado.cargo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Departamento:</span>
                        <span>{selectedEmpleado.departamento}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha Ingreso:</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {selectedEmpleado.fechaIngreso}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo Contrato:</span>
                        <span>{selectedEmpleado.tipoContrato}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado:</span>
                        {getEstadoBadge(selectedEmpleado.estado)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Información Financiera
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salario Base:</span>
                        <span className="font-semibold">Bs. {selectedEmpleado.salarioBase.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cuenta Bancaria:</span>
                        <span>{selectedEmpleado.cuentaBancaria || 'No especificada'}</span>
                      </div>
                    </div>

                    {selectedEmpleado.contactoEmergencia && (
                      <>
                        <h4 className="font-semibold mt-4 mb-2 text-sm">Contacto de Emergencia:</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nombre:</span>
                            <span>{selectedEmpleado.contactoEmergencia.nombre}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Teléfono:</span>
                            <span>{selectedEmpleado.contactoEmergencia.telefono}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Relación:</span>
                            <span>{selectedEmpleado.contactoEmergencia.relacion}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {selectedEmpleado.beneficios && selectedEmpleado.beneficios.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Beneficios
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmpleado.beneficios.map((beneficio, index) => (
                        <Badge key={index} variant="outline">{beneficio}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Registrado: {new Date(selectedEmpleado.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Actualizado: {new Date(selectedEmpleado.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleEdit(selectedEmpleado)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button onClick={() => setSelectedTab('lista')}>
                    Volver a Lista
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reportes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    empleados.reduce((acc, emp) => {
                      acc[emp.departamento] = (acc[emp.departamento] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([dept, count]) => (
                    <div key={dept} className="flex justify-between items-center">
                      <span>{dept}</span>
                      <Badge variant="outline">{count} empleado{count !== 1 ? 's' : ''}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Contrato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    empleados.reduce((acc, emp) => {
                      acc[emp.tipoContrato] = (acc[emp.tipoContrato] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([tipo, count]) => (
                    <div key={tipo} className="flex justify-between items-center">
                      <span className="capitalize">{tipo}</span>
                      <Badge variant="outline">{count} empleado{count !== 1 ? 's' : ''}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Antigüedad Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {empleados.map(emp => {
                    const antiguedad = Math.floor((Date.now() - new Date(emp.fechaIngreso).getTime()) / (1000 * 60 * 60 * 24 * 365));
                    return (
                      <div key={emp.id} className="flex justify-between items-center">
                        <span className="text-sm">{emp.nombres} {emp.apellidos}</span>
                        <Badge variant="outline">{antiguedad} año{antiguedad !== 1 ? 's' : ''}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis Salarial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Salario Promedio:</span>
                    <span className="font-semibold">
                      Bs. {Math.round(estadisticas.totalNomina / estadisticas.total).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salario Máximo:</span>
                    <span className="font-semibold">
                      Bs. {Math.max(...empleados.map(e => e.salarioBase)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salario Mínimo:</span>
                    <span className="font-semibold">
                      Bs. {Math.min(...empleados.map(e => e.salarioBase)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmpleadosModule;