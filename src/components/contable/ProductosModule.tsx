import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Package, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Producto, productosIniciales } from "./products/ProductsData";

const ProductosModule = () => {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [filterCategory, setFilterCategory] = useState("todos");
  const [newProduct, setNewProduct] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    unidadMedida: "unidad",
    precioCompra: 0,
    precioVenta: 0,
    costoUnitario: 0,
    stockMinimo: 0,
    stockActual: 0,
    codigoSIN: "",
    activo: true
  });
  const { toast } = useToast();

  // Cargar productos desde localStorage
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    }
  }, []);

  // Guardar productos en localStorage
  useEffect(() => {
    localStorage.setItem('productos', JSON.stringify(productos));
  }, [productos]);

  const categorias = ["Electrónicos", "Ropa", "Hogar", "Deportes", "Libros", "Alimentación", "Otros"];
  const unidadesMedida = ["unidad", "kg", "litro", "metro", "caja", "docena"];

  const handleSaveProduct = () => {
    if (!newProduct.codigo.trim() || !newProduct.nombre.trim()) {
      toast({
        title: "Error",
        description: "Código y nombre son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Verificar si el código ya existe
    if (productos.some(p => p.codigo === newProduct.codigo)) {
      toast({
        title: "Error",
        description: "Ya existe un producto con este código",
        variant: "destructive"
      });
      return;
    }

    const producto: Producto = {
      id: Date.now().toString(),
      ...newProduct,
      costoUnitario: newProduct.precioCompra, // Usar precio de compra como costo unitario
      fechaCreacion: new Date().toISOString().slice(0, 10),
      fechaActualizacion: new Date().toISOString().slice(0, 10)
    };

    setProductos(prev => [...prev, producto]);
    
    toast({
      title: "Producto creado",
      description: `Producto ${producto.nombre} creado correctamente`,
    });

    setNewProduct({
      codigo: "",
      nombre: "",
      descripcion: "",
      categoria: "",
      unidadMedida: "unidad",
      precioCompra: 0,
      precioVenta: 0,
      costoUnitario: 0,
      stockMinimo: 0,
      stockActual: 0,
      codigoSIN: "",
      activo: true
    });
    setShowNewProduct(false);
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
    const producto = productos.find(p => p.id === id);
    setProductos(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Producto eliminado",
      description: `Producto ${producto?.nombre} eliminado correctamente`,
    });
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "todos" || producto.categoria === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStockStatusColor = (stockActual: number, stockMinimo: number) => {
    if (stockActual <= 0) return "bg-red-100 text-red-800";
    if (stockActual <= stockMinimo) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStockStatus = (stockActual: number, stockMinimo: number) => {
    if (stockActual <= 0) return "Sin stock";
    if (stockActual <= stockMinimo) return "Stock bajo";
    return "Disponible";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Productos</h2>
          <p className="text-slate-600">Administración del catálogo de productos y control de inventario</p>
        </div>
        
        <Dialog open={showNewProduct} onOpenChange={setShowNewProduct}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>
                Ingrese los datos del producto para el catálogo
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input 
                  id="codigo" 
                  placeholder="Código único del producto"
                  value={newProduct.codigo}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, codigo: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input 
                  id="nombre" 
                  placeholder="Nombre del producto"
                  value={newProduct.nombre}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select value={newProduct.categoria} onValueChange={(value) => setNewProduct(prev => ({ ...prev, categoria: value }))}>
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
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input 
                  id="descripcion" 
                  placeholder="Descripción detallada del producto"
                  value={newProduct.descripcion}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, descripcion: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidadMedida">Unidad de Medida</Label>
                <Select value={newProduct.unidadMedida} onValueChange={(value) => setNewProduct(prev => ({ ...prev, unidadMedida: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unidadesMedida.map(unidad => (
                      <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="precioCompra">Precio de Compra</Label>
                <Input 
                  id="precioCompra" 
                  type="number"
                  placeholder="0.00"
                  value={newProduct.precioCompra}
                  onChange={(e) => setNewProduct(prev => ({ 
                    ...prev, 
                    precioCompra: parseFloat(e.target.value) || 0,
                    costoUnitario: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precioVenta">Precio de Venta</Label>
                <Input 
                  id="precioVenta" 
                  type="number"
                  placeholder="0.00"
                  value={newProduct.precioVenta}
                  onChange={(e) => setNewProduct(prev => ({ 
                    ...prev, 
                    precioVenta: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                <Input 
                  id="stockMinimo" 
                  type="number"
                  placeholder="0"
                  value={newProduct.stockMinimo}
                  onChange={(e) => setNewProduct(prev => ({ 
                    ...prev, 
                    stockMinimo: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockActual">Stock Actual</Label>
                <Input 
                  id="stockActual" 
                  type="number"
                  placeholder="0"
                  value={newProduct.stockActual}
                  onChange={(e) => setNewProduct(prev => ({ 
                    ...prev, 
                    stockActual: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoSIN">Código SIN</Label>
                <Input 
                  id="codigoSIN" 
                  placeholder="Código para el SIN"
                  value={newProduct.codigoSIN}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, codigoSIN: e.target.value }))}
                />
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

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoría" />
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
          <CardTitle>Catálogo de Productos</CardTitle>
          <CardDescription>
            Lista completa de productos con información de stock y precios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Producto</th>
                  <th className="text-left p-3">Código</th>
                  <th className="text-left p-3">Categoría</th>
                  <th className="text-left p-3">Precios</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => (
                  <tr key={producto.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{producto.nombre}</div>
                        <div className="text-sm text-gray-500">{producto.descripcion}</div>
                        <div className="text-xs text-gray-400">UM: {producto.unidadMedida}</div>
                      </div>
                    </td>
                    <td className="p-3 font-mono">{producto.codigo}</td>
                    <td className="p-3">
                      <Badge variant="outline">{producto.categoria || "Sin categoría"}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="text-sm">Compra: Bs. {producto.precioCompra.toFixed(2)}</div>
                        <div className="text-sm font-medium">Venta: Bs. {producto.precioVenta.toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="font-medium">{producto.stockActual} / {producto.stockMinimo}</div>
                        <Badge className={getStockStatusColor(producto.stockActual, producto.stockMinimo)}>
                          {getStockStatus(producto.stockActual, producto.stockMinimo)}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={producto.activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {producto.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
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
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {productos.filter(p => p.stockActual <= p.stockMinimo).length}
                </p>
                <p className="text-sm text-gray-600">Stock Bajo</p>
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
                <p className="text-sm text-gray-600">Productos Activos</p>
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
                <p className="text-2xl font-bold">
                  Bs. {productos.reduce((sum, p) => sum + (p.stockActual * p.precioVenta), 0).toFixed(0)}
                </p>
                <p className="text-sm text-gray-600">Valor Inventario</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para editar producto */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogDescription>Modificar información del producto</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              <div className="space-y-2">
                <Label>Código</Label>
                <Input 
                  value={editingProduct.codigo}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, codigo: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input 
                  value={editingProduct.nombre}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, nombre: e.target.value } : null)}
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
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label>Descripción</Label>
                <Input 
                  value={editingProduct.descripcion}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, descripcion: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Precio de Compra</Label>
                <Input 
                  type="number"
                  value={editingProduct.precioCompra}
                  onChange={(e) => setEditingProduct(prev => prev ? { 
                    ...prev, 
                    precioCompra: parseFloat(e.target.value) || 0,
                    costoUnitario: parseFloat(e.target.value) || 0
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Precio de Venta</Label>
                <Input 
                  type="number"
                  value={editingProduct.precioVenta}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, precioVenta: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Mínimo</Label>
                <Input 
                  type="number"
                  value={editingProduct.stockMinimo}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stockMinimo: parseInt(e.target.value) || 0 } : null)}
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductosModule;
