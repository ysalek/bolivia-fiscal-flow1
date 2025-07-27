import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Shield, Eye, User, Lock, Activity, CheckCircle2, XCircle, Clock, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'contador' | 'auxiliar' | 'viewer';
  estado: 'activo' | 'inactivo' | 'bloqueado';
  fechaCreacion: string;
  ultimoAcceso: string;
  permisos: string[];
}

interface LogAuditoria {
  id: string;
  usuarioId: string;
  usuario: string;
  accion: string;
  modulo: string;
  descripcion: string;
  ip: string;
  fecha: string;
  nivel: 'info' | 'warning' | 'error' | 'critical';
}

const SecurityModule = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [logsAuditoria, setLogsAuditoria] = useState<LogAuditoria[]>([]);
  const [filtroLog, setFiltroLog] = useState({ modulo: '', nivel: '', usuario: '' });
  const { toast } = useToast();

  useEffect(() => {
    cargarDatos();
    inicializarUsuarios();
  }, []);

  const cargarDatos = () => {
    const usuariosGuardados = localStorage.getItem('usuarios_sistema');
    const logsGuardados = localStorage.getItem('logs_auditoria');
    
    if (usuariosGuardados) {
      setUsuarios(JSON.parse(usuariosGuardados));
    }
    
    if (logsGuardados) {
      setLogsAuditoria(JSON.parse(logsGuardados));
    }
  };

  const inicializarUsuarios = () => {
    const usuariosExistentes = localStorage.getItem('usuarios_sistema');
    if (!usuariosExistentes) {
      const usuariosIniciales: Usuario[] = [
        {
          id: 'admin-001',
          nombre: 'Administrador del Sistema',
          email: 'admin@empresa.com',
          rol: 'admin',
          estado: 'activo',
          fechaCreacion: new Date().toISOString(),
          ultimoAcceso: new Date().toISOString(),
          permisos: ['todos']
        },
        {
          id: 'contador-001',
          nombre: 'Contador Principal',
          email: 'contador@empresa.com',
          rol: 'contador',
          estado: 'activo',
          fechaCreacion: new Date().toISOString(),
          ultimoAcceso: new Date().toISOString(),
          permisos: ['contabilidad', 'reportes', 'facturas', 'compras']
        }
      ];
      
      localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosIniciales));
      setUsuarios(usuariosIniciales);
      
      // Agregar log inicial
      registrarAccion('sistema', 'Inicialización', 'Usuarios iniciales creados', 'info');
    }
  };

  const registrarAccion = (usuario: string, accion: string, descripcion: string, nivel: 'info' | 'warning' | 'error' | 'critical') => {
    const nuevoLog: LogAuditoria = {
      id: Date.now().toString(),
      usuarioId: 'sistema',
      usuario,
      accion,
      modulo: 'Seguridad',
      descripcion,
      ip: '127.0.0.1',
      fecha: new Date().toISOString(),
      nivel
    };

    const logsActuales = JSON.parse(localStorage.getItem('logs_auditoria') || '[]');
    const logsActualizados = [nuevoLog, ...logsActuales].slice(0, 1000); // Mantener últimos 1000 logs
    
    localStorage.setItem('logs_auditoria', JSON.stringify(logsActualizados));
    setLogsAuditoria(logsActualizados);
  };

  const cambiarEstadoUsuario = (usuarioId: string, nuevoEstado: 'activo' | 'inactivo' | 'bloqueado') => {
    const usuariosActualizados = usuarios.map(u => 
      u.id === usuarioId ? { ...u, estado: nuevoEstado } : u
    );
    
    setUsuarios(usuariosActualizados);
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosActualizados));
    
    const usuario = usuarios.find(u => u.id === usuarioId);
    registrarAccion(usuario?.nombre || 'Desconocido', 'Cambio de estado', `Estado cambiado a: ${nuevoEstado}`, 'warning');
    
    toast({
      title: "Estado actualizado",
      description: `Usuario ${nuevoEstado === 'activo' ? 'activado' : nuevoEstado === 'inactivo' ? 'desactivado' : 'bloqueado'} exitosamente.`
    });
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-yellow-100 text-yellow-800';
      case 'bloqueado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorNivel = (nivel: string) => {
    switch (nivel) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case 'activo': return <CheckCircle2 className="w-4 h-4" />;
      case 'inactivo': return <Clock className="w-4 h-4" />;
      case 'bloqueado': return <XCircle className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const logsFiltrados = logsAuditoria.filter(log => {
    return (!filtroLog.modulo || log.modulo.toLowerCase().includes(filtroLog.modulo.toLowerCase())) &&
           (!filtroLog.nivel || log.nivel === filtroLog.nivel) &&
           (!filtroLog.usuario || log.usuario.toLowerCase().includes(filtroLog.usuario.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Seguridad y Auditoría</h2>
          <p className="text-muted-foreground">Administración de usuarios y logs de auditoría del sistema</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Shield className="w-4 h-4 mr-1" />
          {usuarios.filter(u => u.estado === 'activo').length} usuarios activos
        </Badge>
      </div>

      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Gestión de Usuarios
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Logs de Auditoría
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Configuración de Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Usuarios del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Input placeholder="Buscar usuario..." className="w-64" />
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="activo">Activos</SelectItem>
                        <SelectItem value="inactivo">Inactivos</SelectItem>
                        <SelectItem value="bloqueado">Bloqueados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Nuevo Usuario
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getIconoEstado(usuario.estado)}
                            {usuario.nombre}
                          </div>
                        </TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{usuario.rol}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getColorEstado(usuario.estado)}>
                            {usuario.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(usuario.ultimoAcceso).toLocaleDateString('es-BO')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Detalles del Usuario</DialogTitle>
                                  <DialogDescription>
                                    Información completa del usuario
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <strong>Nombre:</strong> {usuario.nombre}
                                  </div>
                                  <div>
                                    <strong>Email:</strong> {usuario.email}
                                  </div>
                                  <div>
                                    <strong>Rol:</strong> {usuario.rol}
                                  </div>
                                  <div>
                                    <strong>Estado:</strong> {usuario.estado}
                                  </div>
                                  <div>
                                    <strong>Permisos:</strong> {usuario.permisos.join(', ')}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {usuario.estado === 'activo' ? (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => cambiarEstadoUsuario(usuario.id, 'inactivo')}
                              >
                                <Clock className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => cambiarEstadoUsuario(usuario.id, 'activo')}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            )}
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

        <TabsContent value="auditoria">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Logs de Auditoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Filtrar por módulo..." 
                    className="w-48"
                    value={filtroLog.modulo}
                    onChange={(e) => setFiltroLog(prev => ({ ...prev, modulo: e.target.value }))}
                  />
                  <Select value={filtroLog.nivel} onValueChange={(value) => setFiltroLog(prev => ({ ...prev, nivel: value }))}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    placeholder="Filtrar por usuario..." 
                    className="w-48"
                    value={filtroLog.usuario}
                    onChange={(e) => setFiltroLog(prev => ({ ...prev, usuario: e.target.value }))}
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Descripción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logsFiltrados.slice(0, 50).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(log.fecha).toLocaleString('es-BO')}
                        </TableCell>
                        <TableCell>{log.usuario}</TableCell>
                        <TableCell>{log.modulo}</TableCell>
                        <TableCell>{log.accion}</TableCell>
                        <TableCell>
                          <Badge className={getColorNivel(log.nivel)}>
                            {log.nivel}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.descripcion}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Configuración de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Autenticación de dos factores</h4>
                      <p className="text-sm text-muted-foreground">Requiere verificación adicional para acceder</p>
                    </div>
                    <Badge variant="destructive">Deshabilitado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Expiración de sesión</h4>
                      <p className="text-sm text-muted-foreground">Tiempo límite de inactividad: 8 horas</p>
                    </div>
                    <Badge variant="secondary">Configurado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Auditoría completa</h4>
                      <p className="text-sm text-muted-foreground">Registro de todas las acciones del sistema</p>
                    </div>
                    <Badge variant="default">Habilitado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alertas de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Acceso desde IP desconocida</p>
                      <p className="text-sm text-yellow-700">Hace 2 horas - Usuario: contador@empresa.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Sistema funcionando normalmente</p>
                      <p className="text-sm text-blue-700">Todos los servicios operativos</p>
                    </div>
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

export default SecurityModule;