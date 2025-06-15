
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Package, BarChart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ProductosModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [filterCategory, setFilterCategory] = useState("todos");
  const { toast } = useToast();

  const productos = [
    {
      id: 1,
      codigo: "PROD001",
      nombre: "Servicio de Consultoría",
      descripcion: "Consultoría empresarial especializada",
      categoria: "Servicios",
      precio: 500.00,
      unidad: "Hora",
      stock: null,
      activo: true,
      codigo_sin: "83141"
    },
    {
      id: 2,
      codigo: "PROD002", 
      nombre: "Laptop Dell Inspiron",
      descripcion: "Laptop Dell Inspiron 15 3000 Intel Core i5",
      categoria: "Tecnología",
      precio: 4200.00,
      unidad: "Pieza",
      stock: 15,
      activo: true,
      codigo_sin: "84713"
    },
    {
      id: 3,
      codigo: "PROD003",
      nombre: "Software de Gestión",
      descripcion: "Licencia anual de software contable",
      categoria: "Software",
      precio: 1200.00,
      unidad: "Licencia",
      stock: null,
      activo: true,
      codigo_sin: "84719"
    },
    {
      id: 4,
      codigo: "PROD004",
      nombre: "Capacitación Empresarial",
      descripcion: "Curso de capacitación en administración",
      categoria: "Servicios",
      precio: 800.00,
      unidad: "Curso",
      stock: null,
      activo: false,
      codigo_sin: "83141"
    }
  ];

  const categorias = ["Servicios", "Tecnología", "Software", "Productos", "Consumibles"];

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.codigo.includes(searchTerm) ||
                         producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "todos" || producto.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveProduct = () => {
    toast({
      title: "Producto guardado",
      description: "El producto ha sido agregado correctamente al catálogo.",
    });
    setShowNewProduct(false);
  };

  const getStatusColor = (activo: boolean) => {
    return activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      "Servicios": "bg-blue-100 text-blue-800",
      "Tecnología": "bg-purple-100 text-purple-800",
      "Software": "bg-indigo-100 text-indigo-800",
      "Productos": "bg-orange-100 text-orange-800",
      "Consumibles": "bg-green-100 text-green-800"
    };
    return colors[categoria] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Productos y Servicios</h2>
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
                Ingrese los datos del producto o servicio para la facturación
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" placeholder="PROD001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Nombre del producto/servicio" />
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
                <Label htmlFor="precio">Precio Unitario (Bs.)</Label>
                <Input id="precio" type="number" placeholder="0.00" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidad">Unidad de Medida</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pieza">Pieza</SelectItem>
                    <SelectItem value="Hora">Hora</SelectItem>
                    <SelectItem value="Servicio">Servicio</SelectItem>
                    <SelectItem value="Licencia">Licencia</SelectItem>
                    <SelectItem value="Metro">Metro</SelectItem>
                    <SelectItem value="Kilogramo">Kilogramo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo_sin">Código SIN</Label>
                <Input id="codigo_sin" placeholder="Código de actividad SIN" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewProduct(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProduct}>
                Guardar Producto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
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
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las categorías</SelectItem>
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
        </CardContent>
      </Card>

      {/* Lista de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos y Servicios</CardTitle>
          <CardDescription>
            Productos y servicios disponibles para facturación
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
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => (
                  <tr key={producto.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono">{producto.codigo}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{producto.nombre}</div>
                        <div className="text-sm text-gray-500">{producto.descripcion}</div>
                        <div className="text-xs text-gray-400">SIN: {producto.codigo_sin}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getCategoryColor(producto.categoria)}>
                        {producto.categoria}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono">Bs. {producto.precio.toFixed(2)}</td>
                    <td className="p-3">{producto.unidad}</td>
                    <td className="p-3">
                      {producto.stock !== null ? (
                        <span className={producto.stock < 10 ? 'text-red-600' : ''}>
                          {producto.stock}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(producto.activo)}>
                        {producto.activo ? 'Activo' : 'Inactivo'}
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

      {/* Estadísticas */}
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
                <BarChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {productos.filter(p => p.categoria === "Servicios").length}
                </p>
                <p className="text-sm text-gray-600">Servicios</p>
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
                  {productos.filter(p => p.stock !== null && p.stock < 10).length}
                </p>
                <p className="text-sm text-gray-600">Stock Bajo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductosModule;
