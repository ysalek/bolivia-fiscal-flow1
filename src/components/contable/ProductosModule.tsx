
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Package, AlertTriangle } from "lucide-react";
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

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productosActivos = productos.filter(p => p.activo).length;
  const productosStockBajo = productos.filter(p => p.stockActual <= p.stockMinimo && p.activo).length;
  const valorInventario = productos.reduce((sum, p) => sum + (p.stockActual * p.costoUnitario), 0);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Productos</h2>
          <p className="text-slate-600">Administra tu catálogo de productos y servicios</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{productosActivos}</div>
                <div className="text-sm text-gray-600">Productos Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{productosStockBajo}</div>
                <div className="text-sm text-gray-600">Stock Bajo</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">Bs. {valorInventario.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Valor Inventario</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{productos.length}</div>
                <div className="text-sm text-gray-600">Total Productos</div>
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
              placeholder="Buscar por nombre, código o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
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
          <div className="space-y-4">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{producto.nombre}</h3>
                      <Badge variant="outline">{producto.codigo}</Badge>
                      <Badge variant={producto.activo ? "default" : "secondary"}>
                        {producto.activo ? "Activo" : "Inactivo"}
                      </Badge>
                      {producto.stockActual <= producto.stockMinimo && producto.activo && (
                        <Badge variant="destructive">Stock Bajo</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600">{producto.descripcion}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Categoría:</span>
                        <p>{producto.categoria}</p>
                      </div>
                      <div>
                        <span className="font-medium">Stock Actual:</span>
                        <p className={producto.stockActual <= producto.stockMinimo ? "text-red-600" : ""}>
                          {producto.stockActual} {producto.unidadMedida}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Precio Venta:</span>
                        <p>Bs. {producto.precioVenta.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Costo:</span>
                        <p>Bs. {producto.costoUnitario.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
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
                    {producto.activo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProducto(producto.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {productosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron productos</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductosModule;
