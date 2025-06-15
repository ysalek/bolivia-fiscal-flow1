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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
          <p className="text-slate-600">Administra la información de tus clientes</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{clientesActivos}</div>
                <div className="text-sm text-gray-600">Clientes Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-600">{clientesInactivos}</div>
                <div className="text-sm text-gray-600">Clientes Inactivos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{clientes.length}</div>
                <div className="text-sm text-gray-600">Total Clientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, NIT o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes Registrados</CardTitle>
          <CardDescription>
            Lista completa de clientes con opciones de gestión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{cliente.nombre}</h3>
                      <Badge variant={cliente.activo ? "default" : "secondary"}>
                        {cliente.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">NIT:</span>
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
                    
                    <div className="text-xs text-gray-500">
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
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron clientes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientesModule;
