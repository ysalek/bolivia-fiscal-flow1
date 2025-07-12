import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Plus, Edit, Trash2, Shield, UserPlus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

interface Usuario {
  id: number;
  usuario: string;
  email: string;
  password: string;
  nombre: string;
  rol: string;
  empresa: string;
  permisos: string[];
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

const UserProductionManager = () => {
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [changePassword, setChangePassword] = useState('');
  const [newUser, setNewUser] = useState({
    usuario: '',
    email: '',
    password: '',
    nombre: '',
    rol: 'usuario',
    activo: true
  });

  const rolesDisponibles = [
    { value: 'admin', label: 'Administrador', permisos: ['*'] },
    { value: 'contador', label: 'Contador', permisos: ['dashboard', 'facturacion', 'clientes', 'productos', 'inventario', 'plan_cuentas', 'libro_diario', 'balance', 'reportes', 'configuracion'] },
    { value: 'ventas', label: 'Vendedor', permisos: ['dashboard', 'facturacion', 'clientes', 'productos', 'inventario'] },
    { value: 'usuario', label: 'Usuario General', permisos: ['dashboard'] }
  ];

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    const usuariosGuardados = localStorage.getItem('usuarios_sistema');
    if (usuariosGuardados) {
      setUsuarios(JSON.parse(usuariosGuardados));
    }
  };

  const guardarUsuarios = (usuariosActualizados: Usuario[]) => {
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosActualizados));
    setUsuarios(usuariosActualizados);
  };

  const crearUsuario = () => {
    if (!newUser.usuario || !newUser.email || !newUser.password || !newUser.nombre) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Verificar si el usuario ya existe
    if (usuarios.some(u => u.usuario === newUser.usuario || u.email === newUser.email)) {
      toast({
        title: "Error",
        description: "Ya existe un usuario con ese nombre de usuario o email",
        variant: "destructive"
      });
      return;
    }

    const rolData = rolesDisponibles.find(r => r.value === newUser.rol);
    const nuevoUsuario: Usuario = {
      id: Math.max(...usuarios.map(u => u.id), 0) + 1,
      usuario: newUser.usuario,
      email: newUser.email,
      password: newUser.password,
      nombre: newUser.nombre,
      rol: newUser.rol,
      empresa: user?.empresa || 'Sistema Contable',
      permisos: rolData?.permisos || ['dashboard'],
      activo: newUser.activo,
      fechaCreacion: new Date().toISOString()
    };

    const usuariosActualizados = [...usuarios, nuevoUsuario];
    guardarUsuarios(usuariosActualizados);

    toast({
      title: "Usuario creado",
      description: `Usuario ${newUser.usuario} creado exitosamente`
    });

    setNewUser({ usuario: '', email: '', password: '', nombre: '', rol: 'usuario', activo: true });
    setShowCreateDialog(false);
  };

  const editarUsuario = (usuario: Usuario) => {
    setEditingUser(usuario);
  };

  const actualizarUsuario = () => {
    if (!editingUser) return;

    const usuarioActualizado = {
      ...editingUser,
      fechaModificacion: new Date().toISOString()
    };

    // Si se especificó una nueva contraseña, actualizarla
    if (changePassword.trim()) {
      usuarioActualizado.password = changePassword;
    }

    const usuariosActualizados = usuarios.map(u => 
      u.id === editingUser.id ? usuarioActualizado : u
    );
    guardarUsuarios(usuariosActualizados);

    toast({
      title: "Usuario actualizado",
      description: `Usuario ${editingUser.usuario} actualizado exitosamente`
    });

    setEditingUser(null);
    setChangePassword('');
  };

  const eliminarUsuario = (userId: number) => {
    // No permitir eliminar al administrador principal
    const usuarioAEliminar = usuarios.find(u => u.id === userId);
    if (usuarioAEliminar?.usuario === 'admin') {
      toast({
        title: "Error",
        description: "No se puede eliminar al administrador principal",
        variant: "destructive"
      });
      return;
    }

    const usuariosActualizados = usuarios.filter(u => u.id !== userId);
    guardarUsuarios(usuariosActualizados);

    toast({
      title: "Usuario eliminado",
      description: "Usuario eliminado exitosamente"
    });
  };

  const toggleUsuarioActivo = (userId: number) => {
    const usuariosActualizados = usuarios.map(u => 
      u.id === userId 
        ? { ...u, activo: !u.activo, fechaModificacion: new Date().toISOString() }
        : u
    );
    guardarUsuarios(usuariosActualizados);

    toast({
      title: "Estado actualizado",
      description: "Estado del usuario actualizado exitosamente"
    });
  };

  if (!hasPermission('*')) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No tienes permisos para gestionar usuarios del sistema.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
          <p className="text-slate-600">Administración de usuarios del sistema</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Complete los datos del nuevo usuario del sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuario</Label>
                  <Input
                    id="usuario"
                    value={newUser.usuario}
                    onChange={(e) => setNewUser({...newUser, usuario: e.target.value})}
                    placeholder="usuario123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="usuario@empresa.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={newUser.nombre}
                  onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
                  placeholder="Juan Pérez"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Rol del Usuario</Label>
                <Select value={newUser.rol} onValueChange={(value) => setNewUser({...newUser, rol: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesDisponibles.map((rol) => (
                      <SelectItem key={rol.value} value={rol.value}>
                        {rol.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="activo"
                  checked={newUser.activo}
                  onCheckedChange={(checked) => setNewUser({...newUser, activo: checked})}
                />
                <Label htmlFor="activo">Usuario Activo</Label>
              </div>
              
              <Button onClick={crearUsuario} className="w-full">
                Crear Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {usuarios.map((usuario) => (
          <Card key={usuario.id} className={!usuario.activo ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{usuario.nombre}</CardTitle>
                    <CardDescription>@{usuario.usuario} • {usuario.email}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={usuario.activo ? "default" : "secondary"}>
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </Badge>
                  <Badge variant="outline">
                    {rolesDisponibles.find(r => r.value === usuario.rol)?.label || usuario.rol}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>Empresa: {usuario.empresa}</p>
                  <p>Creado: {new Date(usuario.fechaCreacion).toLocaleDateString()}</p>
                  {usuario.fechaModificacion && (
                    <p>Modificado: {new Date(usuario.fechaModificacion).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleUsuarioActivo(usuario.id)}
                    disabled={usuario.usuario === 'admin'}
                  >
                    {usuario.activo ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editarUsuario(usuario)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => eliminarUsuario(usuario.id)}
                    disabled={usuario.usuario === 'admin'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modificar datos del usuario {editingUser.usuario}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre Completo</Label>
                <Input
                  id="edit-nombre"
                  value={editingUser.nombre}
                  onChange={(e) => setEditingUser({...editingUser, nombre: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-password">Nueva Contraseña (opcional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={changePassword}
                  onChange={(e) => setChangePassword(e.target.value)}
                  placeholder="Dejar vacío para mantener la actual"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Rol del Usuario</Label>
                <Select 
                  value={editingUser.rol} 
                  onValueChange={(value) => {
                    const rolData = rolesDisponibles.find(r => r.value === value);
                    setEditingUser({
                      ...editingUser, 
                      rol: value,
                      permisos: rolData?.permisos || ['dashboard']
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesDisponibles.map((rol) => (
                      <SelectItem key={rol.value} value={rol.value}>
                        {rol.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={actualizarUsuario} className="w-full">
                Actualizar Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserProductionManager;