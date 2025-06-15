
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Users, Phone, Mail, MapPin, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Cliente, clientesIniciales } from "./billing/BillingData";
import ClienteForm from "./clients/ClienteForm";

const ClientesModule = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Cargar datos desde localStorage
  useEffect(() => {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      setClientes(JSON.parse(clientesGuardados));
    }
  }, []);

  const handleSaveCliente = (cliente: Cliente) => {
    let nuevosClientes;
    
    if (editingCliente) {
      // Editar cliente existente
      nuevosClientes = clientes.map(c => c.id === cliente.id ? cliente : c);
      toast({
        title: "Cliente actualizado",
        description: `${cliente.nombre} ha sido actualizado exitosamente.`,
      });
    } else {
      // Crear nuevo cliente
      nuevosClientes = [cliente, ...clientes];
      toast({
        title: "Cliente creado",
        description: `${cliente.nombre} ha sido agregado exitosamente.`,
      });
    }
    
    setClientes(nuevosClientes);
    localStorage.setItem('clientes', JSON.stringify(nuevosClientes));
    setShowForm(false);
    setEditingCliente(null);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleDeleteCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    if (confirm(`¿Está seguro de eliminar el cliente ${cliente.nombre}?`)) {
      const nuevosClientes = clientes.map(c => 
        c.id === clienteId ? { ...c, activo: false } : c
      );
      setClientes(nuevosClientes);
      localStorage.setItem('clientes', JSON.stringify(nuevosClientes));
      
      toast({
        title: "Cliente desactivado",
        description: `${cliente.nombre} ha sido desactivado.`,
      });
    }
  };

  const handleReactivateCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    if (confirm(`¿Está seguro de reactivar el cliente ${cliente.nombre}?`)) {
      const nuevosClientes = clientes.map(c => 
        c.id === clienteId ? { ...c, activo: true } : c
      );
      setClientes(nuevosClientes);
      localStorage.setItem('clientes', JSON.stringify(nuevosClientes));
      
      toast({
        title: "Cliente reactivado",
        description: `${cliente.nombre} ha sido reactivado exitosamente.`,
      });
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nit.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clientesActivos = clientes.filter(c => c.activo).length;
  const clientesInactivos = clientes.filter(c => !c.activo).length;

  if (showForm) {
    return (
      <ClienteForm
        cliente={editingCliente}
        onSave={handleSaveCliente}
        onCancel={() => {
          setShowForm(false);
          setEditingCliente(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
          <p className="text-muted-foreground">Administra la información de tus clientes de forma centralizada.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-slate-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{clientesActivos}</div>
              <div className="text-sm text-muted-foreground">Clientes Activos</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900 border-slate-200 dark:border-slate-700">
           <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-slate-200 dark:bg-slate-800">
                <Users className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{clientesInactivos}</div>
              <div className="text-sm text-muted-foreground">Clientes Inactivos</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-green-50 to-green-100 dark:from-green-900/50 dark:to-slate-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{clientes.length}</div>
              <div className="text-sm text-muted-foreground">Total Clientes</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de clientes */}
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Clientes Registrados</CardTitle>
                    <CardDescription>
                    Busca y gestiona tus clientes.
                    </CardDescription>
                </div>
                <div className="w-full max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, NIT o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <div className="divide-y divide-border">
                {clientesFiltrados.map((cliente) => (
                <div key={cliente.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{cliente.nombre}</h3>
                        <Badge variant={cliente.activo ? "default" : "secondary"}>
                            {cliente.activo ? "Activo" : "Inactivo"}
                        </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">NIT:</span>
                            <span>{cliente.nit}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{cliente.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{cliente.telefono}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{cliente.direccion}</span>
                        </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground pt-2">
                        Registrado el: {cliente.fechaCreacion}
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCliente(cliente)}
                        >
                        <Edit className="w-4 h-4" />
                        </Button>
                        {cliente.activo ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCliente(cliente.id)}
                            aria-label="Desactivar cliente"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReactivateCliente(cliente.id)}
                            aria-label="Reactivar cliente"
                        >
                            <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        )}
                    </div>
                    </div>
                </div>
                ))}
                
                {clientesFiltrados.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-semibold">No se encontraron clientes</p>
                    <p className="text-sm">Intenta con otro término de búsqueda.</p>
                </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientesModule;
