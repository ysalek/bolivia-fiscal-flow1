import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Users, UserPlus, Edit, Trash2, Shield, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  cargo: string;
  nivelAcceso: 'admin' | 'contador' | 'vendedor' | 'consulta';
  modulos: string[];
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso: string;
}

const nivelesAcceso = {
  admin: {
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    permisos: ["todos"],
    color: "destructive"
  },
  contador: {
    nombre: "Contador",
    descripcion: "Acceso a contabilidad y reportes",
    permisos: ["contabilidad", "reportes", "configuracion"],
    color: "default"
  },
  vendedor: {
    nombre: "Vendedor",
    descripcion: "Acceso a ventas y clientes",
    permisos: ["ventas", "clientes", "productos", "pos"],
    color: "secondary"
  },
  consulta: {
    nombre: "Solo Consulta",
    descripcion: "Solo visualización de reportes",
    permisos: ["reportes"],
    color: "outline"
  }
};

const UserManagement = () => {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioModal, setUsuarioModal] = useState<Usuario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroNivel, setFiltroNivel] = useState<string>("todos");

  useEffect(() => {
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
      setUsuarios(JSON.parse(usuariosGuardados));
    } else {
      // Datos iniciales de ejemplo
      const usuariosIniciales: Usuario[] = [
        {
          id: "1",
          nombre: "Administrador Sistema",
          email: "admin@empresa.com",
          telefono: "+591 2 2345678",
          cargo: "Administrador General",
          nivelAcceso: "admin",
          modulos: ["todos"],
          activo: true,
          fechaCreacion: "2024-01-01",
          ultimoAcceso: "2024-06-15 10:30"
        },
        {
          id: "2",
          nombre: "María García",
          email: "contador@empresa.com",
          telefono: "+591 2 2345679",
          cargo: "Contadora General",
          nivelAcceso: "contador",
          modulos: ["contabilidad", "reportes", "configuracion"],
          activo: true,
          fechaCreacion: "2024-01-15",
          ultimoAcceso: "2024-06-15 09:15"
        },
        {
          id: "3",
          nombre: "Carlos López",
          email: "vendedor@empresa.com",
          telefono: "+591 2 2345680",
          cargo: "Ejecutivo de Ventas",
          nivelAcceso: "vendedor",
          modulos: ["ventas", "clientes", "productos", "pos"],
          activo: true,
          fechaCreacion: "2024-02-01",
          ultimoAcceso: "2024-06-15 11:45"
        }
      ];
      setUsuarios(usuariosIniciales);
      localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    }
  }, []);

  const guardarUsuarios = (nuevosUsuarios: Usuario[]) => {
    setUsuarios(nuevosUsuarios);
    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
  };

  const crearUsuario = () => {
    const nuevoUsuario: Usuario = {
      id: Date.now().toString(),
      nombre: "",
      email: "",
      telefono: "",
      cargo: "",
      nivelAcceso: "consulta",
      modulos: ["reportes"],
      activo: true,
      fechaCreacion: new Date().toISOString().split('T')[0],
      ultimoAcceso: "Nunca"
    };
    setUsuarioModal(nuevoUsuario);
    setIsModalOpen(true);
  };

  const editarUsuario = (usuario: Usuario) => {
    setUsuarioModal({ ...usuario });
    setIsModalOpen(true);
  };

  const eliminarUsuario = (id: string) => {
    const nuevosUsuarios = usuarios.filter(u => u.id !== id);
    guardarUsuarios(nuevosUsuarios);
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado del sistema",
    });
  };

  const guardarUsuario = () => {
    if (!usuarioModal) return;

    if (!usuarioModal.nombre || !usuarioModal.email) {
      toast({
        title: "Error",
        description: "Nombre y email son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const existeUsuario = usuarios.find(u => u.id !== usuarioModal.id);
    if (existeUsuario) {
      const nuevosUsuarios = usuarios.map(u => 
        u.id === usuarioModal.id ? usuarioModal : u
      );
      guardarUsuarios(nuevosUsuarios);
    } else {
      guardarUsuarios([...usuarios, usuarioModal]);
    }

    toast({
      title: existeUsuario ? "Usuario actualizado" : "Usuario creado",
      description: "Los cambios han sido guardados correctamente",
    });

    setIsModalOpen(false);
    setUsuarioModal(null);
  };

  const toggleUsuarioActivo = (id: string) => {
    const nuevosUsuarios = usuarios.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    );
    guardarUsuarios(nuevosUsuarios);
    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido cambiado",
    });
  };

  const actualizarNivelAcceso = (nivel: string) => {
    if (!usuarioModal) return;

    const permisos = nivelesAcceso[nivel as keyof typeof nivelesAcceso]?.permisos || [];
    setUsuarioModal({
      ...usuarioModal,
      nivelAcceso: nivel as Usuario['nivelAcceso'],
      modulos: permisos
    });
  };

  const usuariosFiltrados = usuarios.filter(usuario => 
    filtroNivel === "todos" || usuario.nivelAcceso === filtroNivel
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">Administrar usuarios y niveles de acceso</p>
        </div>
        <Button onClick={crearUsuario}>
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="w-64">
          <Select value={filtroNivel} onValueChange={setFiltroNivel}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los niveles</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
              <SelectItem value="contador">Contadores</SelectItem>
              <SelectItem value="vendedor">Vendedores</SelectItem>
              <SelectItem value="consulta">Solo Consulta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lista de Usuarios
          </CardTitle>
          <CardDescription>
            {usuariosFiltrados.length} usuario(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Nivel de Acceso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{usuario.nombre}</div>
                      <div className="text-sm text-muted-foreground">{usuario.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{usuario.cargo}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={nivelesAcceso[usuario.nivelAcceso].color as any}
                    >
                      {nivelesAcceso[usuario.nivelAcceso].nombre}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={usuario.activo}
                        onCheckedChange={() => toggleUsuarioActivo(usuario.id)}
                      />
                      <span className="text-sm">
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{usuario.ultimoAcceso}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editarUsuario(usuario)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => eliminarUsuario(usuario.id)}
                        disabled={usuario.nivelAcceso === 'admin'}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {usuarioModal?.id && usuarios.find(u => u.id === usuarioModal.id) 
                ? "Editar Usuario" 
                : "Nuevo Usuario"
              }
            </DialogTitle>
            <DialogDescription>
              Configure los datos y permisos del usuario
            </DialogDescription>
          </DialogHeader>
          
          {usuarioModal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    value={usuarioModal.nombre}
                    onChange={(e) => setUsuarioModal({...usuarioModal, nombre: e.target.value})}
                    placeholder="Ingrese el nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={usuarioModal.email}
                    onChange={(e) => setUsuarioModal({...usuarioModal, email: e.target.value})}
                    placeholder="usuario@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={usuarioModal.telefono}
                    onChange={(e) => setUsuarioModal({...usuarioModal, telefono: e.target.value})}
                    placeholder="+591 2 2345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={usuarioModal.cargo}
                    onChange={(e) => setUsuarioModal({...usuarioModal, cargo: e.target.value})}
                    placeholder="Ejecutivo de Ventas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nivel de Acceso</Label>
                <Select value={usuarioModal.nivelAcceso} onValueChange={actualizarNivelAcceso}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(nivelesAcceso).map(([key, nivel]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex flex-col">
                          <span className="font-medium">{nivel.nombre}</span>
                          <span className="text-xs text-muted-foreground">{nivel.descripcion}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Módulos Permitidos</Label>
                <div className="flex flex-wrap gap-2">
                  {usuarioModal.modulos.map((modulo) => (
                    <Badge key={modulo} variant="secondary">
                      {modulo}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={guardarUsuario}>
                  {usuarioModal.id && usuarios.find(u => u.id === usuarioModal.id) 
                    ? "Actualizar" 
                    : "Crear"
                  } Usuario
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;