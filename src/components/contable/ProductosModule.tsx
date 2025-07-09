
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Package, AlertTriangle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Producto, productosIniciales } from "./products/ProductsData";
import ProductoForm from "./products/ProductoForm";

const ProductosModule = () => {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Cargar datos desde localStorage
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    }
  }, []);

  const handleSaveProducto = (producto: Producto) => {
    let nuevosProductos;
    
    if (editingProducto) {
      // Editar producto existente
      nuevosProductos = productos.map(p => p.id === producto.id ? producto : p);
      toast({
        title: "Producto actualizado",
        description: `${producto.nombre} ha sido actualizado exitosamente.`,
      });
    } else {
      // Crear nuevo producto
      nuevosProductos = [producto, ...productos];
      toast({
        title: "Producto creado",
        description: `${producto.nombre} ha sido agregado exitosamente.`,
      });
    }
    
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    setShowForm(false);
    setEditingProducto(null);
  };

  const handleEditProducto = (producto: Producto) => {
    setEditingProducto(producto);
    setShowForm(true);
  };

  const handleDeleteProducto = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    if (confirm(`¿Está seguro de eliminar el producto ${producto.nombre}?`)) {
      const nuevosProductos = productos.map(p => 
        p.id === productoId ? { ...p, activo: false } : p
      );
      setProductos(nuevosProductos);
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
      
      toast({
        title: "Producto desactivado",
        description: `${producto.nombre} ha sido desactivado.`,
      });
    }
  };

  const handleReactivateProducto = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    if (confirm(`¿Está seguro de reactivar el producto ${producto.nombre}?`)) {
      const nuevosProductos = productos.map(p => 
        p.id === productoId ? { ...p, activo: true } : p
      );
      setProductos(nuevosProductos);
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
      
      toast({
        title: "Producto reactivado",
        description: `${producto.nombre} ha sido reactivado exitosamente.`,
      });
    }
  };

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productosActivos = productos.filter(p => p.activo).length;
  const productosStockBajo = productos.filter(p => p.stockActual <= p.stockMinimo && p.activo).length;
  const valorInventario = productos.reduce((sum, p) => sum + ((p.stockActual || 0) * (p.costoUnitario || 0)), 0);

  if (showForm) {
    return (
      <ProductoForm
        producto={editingProducto}
        productos={productos}
        onSave={handleSaveProducto}
        onCancel={() => {
          setShowForm(false);
          setEditingProducto(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Productos</h2>
          <p className="text-muted-foreground">Administra tu catálogo de productos y servicios.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-slate-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{productosActivos}</div>
              <div className="text-sm text-muted-foreground">Productos Activos</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-slate-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{productosStockBajo}</div>
              <div className="text-sm text-muted-foreground">Stock Bajo</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-green-50 to-green-100 dark:from-green-900/50 dark:to-slate-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">Bs. {valorInventario.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Valor Inventario</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-slate-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{productos.length}</div>
              <div className="text-sm text-muted-foreground">Total Productos</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de productos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Catálogo de Productos</CardTitle>
                <CardDescription>
                Busca y gestiona tus productos.
                </CardDescription>
            </div>
            <div className="w-full max-w-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                    placeholder="Buscar por nombre, código o categoría..."
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
                {productosFiltrados.map((producto) => (
                <div key={producto.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{producto.nombre}</h3>
                        <Badge variant="outline">{producto.codigo}</Badge>
                        <Badge variant={producto.activo ? "default" : "secondary"}>
                            {producto.activo ? "Activo" : "Inactivo"}
                        </Badge>
                        {(producto.stockActual || 0) <= (producto.stockMinimo || 0) && producto.activo && (
                            <Badge variant="destructive">Stock Bajo</Badge>
                        )}
                        </div>
                        
                        <p className="text-muted-foreground">{producto.descripcion}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-foreground">Categoría:</span>
                            <p className="text-muted-foreground">{producto.categoria}</p>
                        </div>
                        <div>
                            <span className="font-medium text-foreground">Stock Actual:</span>
                            <p className={(producto.stockActual || 0) <= (producto.stockMinimo || 0) ? "text-red-600" : "text-muted-foreground"}>
                            {producto.stockActual || 0} {producto.unidadMedida || 'PZA'}
                            </p>
                        </div>
                        <div>
                            <span className="font-medium text-foreground">Precio Venta:</span>
                            <p className="text-muted-foreground">Bs. {(producto.precioVenta || 0).toFixed(2)}</p>
                        </div>
                        <div>
                            <span className="font-medium text-foreground">Costo:</span>
                            <p className="text-muted-foreground">Bs. {(producto.costoUnitario || 0).toFixed(2)}</p>
                        </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground pt-2">
                        Actualizado el: {producto.fechaActualizacion}
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProducto(producto)}
                        >
                        <Edit className="w-4 h-4" />
                        </Button>
                        {producto.activo ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProducto(producto.id)}
                            aria-label="Desactivar producto"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReactivateProducto(producto.id)}
                            aria-label="Reactivar producto"
                        >
                            <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        )}
                    </div>
                    </div>
                </div>
                ))}
                
                {productosFiltrados.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-semibold">No se encontraron productos</p>
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

export default ProductosModule;
