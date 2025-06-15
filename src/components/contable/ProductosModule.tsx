
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Producto, CategoriaProducto, productosIniciales, categoriasIniciales, generarCodigoProducto } from "./products/ProductsData";

const ProductosModule = () => {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>(categoriasIniciales);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  const [newProduct, setNewProduct] = useState<Omit<Producto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>>({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    unidadMedida: "PZA",
    precioVenta: 0,
    costoUnitario: 0,
    codigoSIN: "",
    activo: true
  });

  const [newCategory, setNewCategory] = useState<Omit<CategoriaProducto, 'id'>>({
    nombre: "",
    descripcion: "",
    activo: true
  });

  const { toast } = useToast();

  const handleSaveProduct = () => {
    if (!newProduct.nombre.trim() || !newProduct.categoria) {
      toast({
        title: "Error",
        description: "Nombre y categoría son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const ultimoCodigo = productos.length > 0 ? productos[productos.length - 1].codigo : "PROD000";
    const nuevoCodigo = newProduct.codigo || generarCodigoProducto(ultimoCodigo);

    const nuevoProducto: Producto = {
      ...newProduct,
      id: Date.now().toString(),
      codigo: nuevoCodigo,
      fechaCreacion: new Date().toISOString().slice(0, 10),
      fechaActualizacion: new Date().toISOString().slice(0, 10)
    };

    setProductos(prev => [...prev, nuevoProducto]);

    toast({
      title: "Producto creado",
      description: `Producto ${nuevoProducto.nombre} creado correctamente`,
    });

    setNewProduct({
      codigo: "",
      nombre: "",
      descripcion: "",
      categoria: "",
      unidadMedida: "PZA",
      precioVenta: 0,
      costoUnitario: 0,
      codigoSIN: "",
      activo: true
    });
    setShowNewProduct(false);
  };

  const handleSaveCategory = () => {
    if (!newCategory.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es obligatorio",
        variant: "destructive"
      });
      return;
    }

    const nuevaCategoria: CategoriaProducto = {
      ...newCategory,
      id: Date.now().toString()
    };

    setCategorias(prev => [...prev, nuevaCategoria]);

    toast({
      title: "Categoría creada",
      description: `Categoría ${nuevaCategoria.nombre} creada correctamente`,
    });

    setNewCategory({
      nombre: "",
      descripcion: "",
      activo: true
    });
    setShowNewCategory(false);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setProductos(prev => prev.map(p => 
      p.id === editingProduct.id 
        ? { ...editingProduct, fechaActualizacion: new Date().toISOString().slice(0, 10) }
        : p
    ));

    toast({
      title: "Producto actualizado",
      description: `Producto ${editingProduct.nombre} actualizado correctamente`,
    });

    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProductos(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Producto eliminado",
      description: "Producto eliminado correctamente",
    });
  };

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !filtroCategoria || producto.categoria === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Productos</h2>
          <p className="text-slate-600">Administración del catálogo de productos y servicios</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewCategory} onOpenChange={setShowNewCategory}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Categoría</DialogTitle>
                <DialogDescription>Crear una nueva categoría de productos</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={newCategory.nombre}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre de la categoría"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={newCategory.descripcion}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción de la categoría"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewCategory(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveCategory}>
                    Guardar Categoría
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showNewProduct} onOpenChange={setShowNewProduct}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nuevo Producto</DialogTitle>
                <DialogDescription>Registrar un nuevo producto en el catálogo</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Código</Label>
                    <Input
                      value={newProduct.codigo}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, codigo: e.target.value }))}
                      placeholder="Auto-generado si está vacío"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select value={newProduct.categoria} onValueChange={(value) => setNewProduct(prev => ({ ...prev, categoria: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.filter(c => c.activo).map(categoria => (
                          <SelectItem key={categoria.id} value={categoria.nombre}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={newProduct.nombre}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre del producto"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={newProduct.descripcion}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción del producto"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Unidad de Medida</Label>
                    <Select value={newProduct.unidadMedida} onValueChange={(value) => setNewProduct(prev => ({ ...prev, unidadMedida: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PZA">Pieza</SelectItem>
                        <SelectItem value="KG">Kilogramo</SelectItem>
                        <SelectItem value="M">Metro</SelectItem>
                        <SelectItem value="M2">Metro cuadrado</SelectItem>
                        <SelectItem value="LT">Litro</SelectItem>
                        <SelectItem value="HR">Hora</SelectItem>
                        <SelectItem value="SV">Servicio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Costo Unitario</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.costoUnitario}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, costoUnitario: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio de Venta</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.precioVenta}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, precioVenta: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Código SIN</Label>
                  <Input
                    value={newProduct.codigoSIN}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, codigoSIN: e.target.value }))}
                    placeholder="Código del Servicio de Impuestos Nacionales"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewProduct(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProduct}>
                    Guardar Producto
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Productos</p>
                <p className="text-2xl font-bold">{productos.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Productos Activos</p>
                <p className="text-2xl font-bold">{productos.filter(p => p.activo).length}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Categorías</p>
                <p className="text-2xl font-bold">{categorias.length}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Valor Promedio</p>
                <p className="text-2xl font-bold">
                  Bs. {productos.length > 0 ? (productos.reduce((sum, p) => sum + p.precioVenta, 0) / productos.length).toFixed(0) : '0'}
                </p>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="productos" className="w-full">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
        </TabsList>

        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Catálogo de Productos</CardTitle>
              <CardDescription>Lista completa de productos y servicios</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar productos..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria.id} value={categoria.nombre}>
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tabla de productos */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Código</th>
                      <th className="text-left p-2">Producto</th>
                      <th className="text-left p-2">Categoría</th>
                      <th className="text-left p-2">UM</th>
                      <th className="text-right p-2">Costo</th>
                      <th className="text-right p-2">Precio Venta</th>
                      <th className="text-center p-2">Estado</th>
                      <th className="text-center p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((producto) => (
                      <tr key={producto.id} className="border-b hover:bg-slate-50">
                        <td className="p-2 font-mono">{producto.codigo}</td>
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{producto.nombre}</div>
                            <div className="text-xs text-gray-500">{producto.descripcion}</div>
                          </div>
                        </td>
                        <td className="p-2">{producto.categoria}</td>
                        <td className="p-2">{producto.unidadMedida}</td>
                        <td className="p-2 text-right">Bs. {producto.costoUnitario.toFixed(2)}</td>
                        <td className="p-2 text-right">Bs. {producto.precioVenta.toFixed(2)}</td>
                        <td className="p-2 text-center">
                          <Badge className={producto.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {producto.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="outline" onClick={() => setSelectedProduct(producto)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingProduct(producto)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(producto.id)}>
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
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categorías de Productos</CardTitle>
              <CardDescription>Gestión de categorías para organizar el catálogo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorias.map((categoria) => (
                  <div key={categoria.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{categoria.nombre}</h4>
                      <p className="text-sm text-gray-600">{categoria.descripcion}</p>
                      <p className="text-xs text-gray-400">
                        {productos.filter(p => p.categoria === categoria.nombre).length} productos
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={categoria.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {categoria.activo ? "Activa" : "Inactiva"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para ver detalles del producto */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Producto</DialogTitle>
              <DialogDescription>Información completa del producto</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Código</Label>
                  <p className="font-mono">{selectedProduct.codigo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Categoría</Label>
                  <p>{selectedProduct.categoria}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Nombre</Label>
                <p>{selectedProduct.nombre}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Descripción</Label>
                <p>{selectedProduct.descripcion}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Unidad</Label>
                  <p>{selectedProduct.unidadMedida}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Costo</Label>
                  <p>Bs. {selectedProduct.costoUnitario.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Precio</Label>
                  <p>Bs. {selectedProduct.precioVenta.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Código SIN</Label>
                <p className="font-mono">{selectedProduct.codigoSIN}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para editar producto */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogDescription>Modificar información del producto</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input
                    value={editingProduct.codigo}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, codigo: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select 
                    value={editingProduct.categoria} 
                    onValueChange={(value) => setEditingProduct(prev => prev ? { ...prev, categoria: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.filter(c => c.activo).map(categoria => (
                        <SelectItem key={categoria.id} value={categoria.nombre}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={editingProduct.nombre}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, nombre: e.target.value } : null)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Costo Unitario</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.costoUnitario}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, costoUnitario: parseFloat(e.target.value) || 0 } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio de Venta</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.precioVenta}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, precioVenta: parseFloat(e.target.value) || 0 } : null)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateProduct}>
                  Actualizar Producto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductosModule;
