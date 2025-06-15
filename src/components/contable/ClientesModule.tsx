
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Cliente, clientesIniciales } from "./billing/BillingData";

const ClientesModule = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewClient, setShowNewClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [newClient, setNewClient] = useState({
    nombre: "",
    nit: "",
    email: "",
    telefono: "",
    direccion: ""
  });
  const { toast } = useToast();

  const handleSaveClient = () => {
    if (!newClient.nombre.trim() || !newClient.nit.trim()) {
      toast({
        title: "Error",
        description: "Nombre y NIT son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Verificar si el NIT ya existe
    if (clientes.some(c => c.nit === newClient.nit)) {
      toast({
        title: "Error",
        description: "Ya existe un cliente con este NIT",
        variant: "destructive"
      });
      return;
    }

    const cliente: Cliente = {
      id: Date.now().toString(),
      ...newClient,
      activo: true,
      fechaCreacion: new Date().toISOString().slice(0, 10)
    };

    setClientes(prev => [...prev, cliente]);
    
    toast({
      title: "Cliente creado",
      description: `Cliente ${cliente.nombre} creado correctamente`,
    });

    setNewClient({
      nombre: "",
      nit: "",
      email: "",
      telefono: "",
      direccion: ""
    });
    setShowNewClient(false);
  };

  const handleUpdateClient = () => {
    if (!editingClient) return;

    setClientes(prev => prev.map(c => 
      c.id === editingClient.id ? editingClient : c
    ));

    toast({
      title: "Cliente actualizado",
      description: `Cliente ${editingClient.nombre} actualizado correctamente`,
    });

    setEditingClient(null);
  };

  const handleDeleteClient = (id: string) => {
    const cliente = clientes.find(c => c.id === id);
    setClientes(prev => prev.filter(c => c.id !== id));
    
    toast({
      title: "Cliente eliminado",
      description: `Cliente ${cliente?.nombre} eliminado correctamente`,
    });
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nit.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (activo: boolean) => {
    return activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
          <p className="text-slate-600">Administración de la base de datos de clientes</p>
        </div>
        
        <Dialog open={showNewClient} onOpenChange={setShowNewClient}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Ingrese los datos del cliente para la facturación
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Razón Social / Nombre Completo *</Label>
                <Input 
                  id="nombre" 
                  placeholder="Nombre del cliente"
                  value={newClient.nombre}
                  onChange={(e) => setNewClient(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nit">NIT *</Label>
                <Input 
                  id="nit" 
                  placeholder="Número de identificación"
                  value={newClient.nit}
                  onChange={(e) => setNewClient(prev => ({ ...prev, nit: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="correo@cliente.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono" 
                  placeholder="+591 X XXXXXXX"
                  value={newClient.telefono}
                  onChange={(e) => setNewClient(prev => ({ ...prev, telefono: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input 
                  id="direccion" 
                  placeholder="Dirección completa"
                  value={newClient.direccion}
                  onChange={(e) => setNewClient(prev => ({ ...prev, direccion: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewClient(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveClient}>
                Guardar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, NIT o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredClientes.length} cliente(s)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Base de datos de clientes para facturación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Cliente</th>
                  <th className="text-left p-3">NIT</th>
                  <th className="text-left p-3">Contacto</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Fecha Creación</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{cliente.nombre}</div>
                        <div className="text-sm text-gray-500">{cliente.direccion}</div>
                      </div>
                    </td>
                    <td className="p-3 font-mono">{cliente.nit}</td>
                    <td className="p-3">
                      <div>
                        <div className="text-sm">{cliente.email}</div>
                        <div className="text-sm text-gray-500">{cliente.telefono}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(cliente.activo)}>
                        {cliente.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="p-3">{cliente.fechaCreacion}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingClient(cliente)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteClient(cliente.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{clientes.length}</p>
                <p className="text-sm text-gray-600">Total Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {clientes.filter(c => c.activo).length}
                </p>
                <p className="text-sm text-gray-600">Clientes Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {clientes.filter(c => c.email && c.email.includes('@')).length}
                </p>
                <p className="text-sm text-gray-600">Con Email</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para editar cliente */}
      {editingClient && (
        <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>Modificar información del cliente</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Razón Social / Nombre Completo</Label>
                <Input 
                  value={editingClient.nombre}
                  onChange={(e) => setEditingClient(prev => prev ? { ...prev, nombre: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>NIT</Label>
                <Input 
                  value={editingClient.nit}
                  onChange={(e) => setEditingClient(prev => prev ? { ...prev, nit: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={editingClient.email}
                  onChange={(e) => setEditingClient(prev => prev ? { ...prev, email: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input 
                  value={editingClient.telefono}
                  onChange={(e) => setEditingClient(prev => prev ? { ...prev, telefono: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Dirección</Label>
                <Input 
                  value={editingClient.direccion}
                  onChange={(e) => setEditingClient(prev => prev ? { ...prev, direccion: e.target.value } : null)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingClient(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateClient}>
                Actualizar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientesModule;
