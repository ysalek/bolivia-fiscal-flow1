
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ProductosModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  const productos = [
    {
      id: 1,
      codigo: "PROD001",
      nombre: "Servicio de Consultoría",
      descripcion: "Consultoría especializada en sistemas",
      categoria: "Servicios",
      precio: 1500.00,
      unidad: "Hora",
      activo: true,
      sin_codigo: "83111"
    },
    {
      id: 2,
      codigo: "PROD002",
      nombre: "Licencia Software",
      descripcion: "Licencia anual de software contable",
      categoria: "Software",
      precio: 2500.00,
      unidad: "Unidad",
      activo: true,
      sin_codigo: "62010"
    },
    {
      id: 3,
      codigo: "PROD003",
      nombre: "Capacitación",
      descripcion: "Curso de capacitación en facturación electrónica",
      categoria: "Servicios",
      precio: 800.00,
      unidad: "Curso",
      activo: true,
      sin_codigo: "85320"
    },
    {
      id: 4,
      codigo: "PROD004",
      nombre: "Mantenimiento",
      descripcion: "Servicio de mantenimiento mensual",
      categoria: "Servicios",
      precio: 500.00,
      unidad: "Mes",
      activo: false,
      sin_codigo: "43210"
    }
  ];

  const categorias = ["Servicios", "Software", "Hardware", "Productos"];

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || producto.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (activo: boolean) => {
    return activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      "Servicios": "bg-blue-100 text-blue-800",
      "Software": "bg-purple-100 text-purple-800",
      "Hardware": "bg-orange-100 text-orange-800",
      "Productos": "bg-green-100 text-green-800"
    };
    return colors[categoria] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Productos y Servicios</h2>
          <p className="text-slate-600">Catálogo de productos y servicios para facturación</p>
        </div>
        
        <Dialog open={showNewProduct} onOpenChange={setShowNewProduct}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto/Servicio</DialogTitle>
              <DialogDescription>
                Ingrese los datos del producto o servicio
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" placeholder="PROD005" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Nombre del producto" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input id="descripcion" placeholder="Descripción detallada" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio Unitario</Label>
                <Input id="precio" type="number" placeholder="0.00" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidad">Unidad de Medida</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unidad">Unidad</SelectItem>
                    <SelectItem value="Hora">Hora</SelectItem>
                    <SelectItem value="Mes">Mes</SelectItem>
                    <SelectItem value="Curso">Curso</SelectItem>
                    <SelectItem value="Kg">Kilogramo</SelectItem>
                    <SelectItem value="Litro">Litro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sin_codigo">Código SIN</Label>
                <Input id="sin_codigo" placeholder="Código de actividad económica" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewProduct(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowNewProduct(false)}>
                Guardar Producto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {filteredProductos.length} producto(s)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos</CardTitle>
          <CardDescription>
            Lista de productos y servicios disponibles para facturación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Código</th>
                  <th className="text-left p-3">Producto/Servicio</th>
                  <th className="text-left p-3">Categoría</th>
                  <th className="text-left p-3">Precio</th>
                  <th className="text-left p-3">Unidad</th>
                  <th className="text-left p-3">Código SIN</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => (
                  <tr key={producto.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">{producto.codigo}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{producto.nombre}</div>
                        <div className="text-sm text-gray-500">{producto.descripcion}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getCategoryColor(producto.categoria)}>
                        {producto.categoria}
                      </Badge>
                    </td>
                    <td className="p-3">Bs. {producto.precio.toFixed(2)}</td>
                    <td className="p-3">{producto.unidad}</td>
                    <td className="p-3 font-mono text-sm">{producto.sin_codigo}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(producto.activo)}>
                        {producto.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{productos.length}</p>
                <p className="text-sm text-gray-600">Total Productos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {productos.filter(p => p.activo).length}
                </p>
                <p className="text-sm text-gray-600">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categorias.length}</p>
                <p className="text-sm text-gray-600">Categorías</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  Bs. {(productos.reduce((acc, p) => acc + p.precio, 0)).toFixed(0)}
                </p>
                <p className="text-sm text-gray-600">Valor Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductosModule;
