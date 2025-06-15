
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ClientesModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewClient, setShowNewClient] = useState(false);

  const clientes = [
    {
      id: 1,
      nombre: "Empresa ABC S.R.L.",
      nit: "1234567890",
      email: "contacto@abc.com",
      telefono: "+591 2 123456",
      direccion: "Av. Arce #123, La Paz",
      tipo: "Empresa",
      estado: "Activo",
      ultima_factura: "2024-06-15"
    },
    {
      id: 2,
      nombre: "Juan Pérez García",
      nit: "9876543210",
      email: "juan.perez@email.com",
      telefono: "+591 7 987654",
      direccion: "Calle Sucre #456, Santa Cruz",
      tipo: "Persona",
      estado: "Activo",
      ultima_factura: "2024-06-10"
    },
    {
      id: 3,
      nombre: "Comercial XYZ Ltda.",
      nit: "5555666677",
      email: "ventas@xyz.com",
      telefono: "+591 4 555666",
      direccion: "Zona Central, Cochabamba",
      tipo: "Empresa",
      estado: "Inactivo",
      ultima_factura: "2024-05-20"
    }
  ];

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nit.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === "Activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "Empresa" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800";
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
                <Label htmlFor="nombre">Razón Social / Nombre Completo</Label>
                <Input id="nombre" placeholder="Nombre del cliente" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nit">NIT</Label>
                <Input id="nit" placeholder="Número de identificación" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="correo@cliente.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" placeholder="+591 X XXXXXXX" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" placeholder="Dirección completa" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewClient(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowNewClient(false)}>
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
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Última Factura</th>
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
                      <Badge className={getTipoColor(cliente.tipo)}>
                        {cliente.tipo}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(cliente.estado)}>
                        {cliente.estado}
                      </Badge>
                    </td>
                    <td className="p-3">{cliente.ultima_factura}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
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
                  {clientes.filter(c => c.estado === "Activo").length}
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
                  {clientes.filter(c => c.tipo === "Empresa").length}
                </p>
                <p className="text-sm text-gray-600">Empresas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientesModule;
