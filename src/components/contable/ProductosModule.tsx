
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Package, AlertTriangle, Check, DollarSign, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseProductos } from "@/hooks/useSupabaseProductos";
import ProductoForm from "./products/ProductoForm";
import { EnhancedHeader, MetricGrid, EnhancedMetricCard, Section } from "./dashboard/EnhancedLayout";

const ProductosModule = () => {
  const { productos: productosSupabase, categorias, loading, refetch } = useSupabaseProductos();
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Obtener el nombre de la categoría por ID
  const obtenerNombreCategoria = (categoriaId: string | null) => {
    if (!categoriaId) return 'General';
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria?.nombre || 'General';
  };

  // Convertir productos de Supabase al formato esperado
  const productos = productosSupabase.map(p => ({
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion || '',
    categoria: obtenerNombreCategoria(p.categoria_id),
    unidadMedida: p.unidad_medida,
    precioVenta: p.precio_venta,
    precioCompra: p.precio_compra,
    costoUnitario: p.costo_unitario,
    stockActual: p.stock_actual,
    stockMinimo: p.stock_minimo,
    codigoSIN: p.codigo_sin || '00000000',
    activo: p.activo,
    fechaCreacion: p.created_at?.split('T')[0] || new Date().toISOString().slice(0, 10),
    fechaActualizacion: p.updated_at?.split('T')[0] || new Date().toISOString().slice(0, 10),
    imagenUrl: p.imagen_url
  }));

  const handleSaveProducto = async () => {
    // Después de guardar, recargar los datos
    await refetch();
    setShowForm(false);
    setEditingProducto(null);
  };

  const handleEditProducto = (producto: any) => {
    // Convertir producto al formato de Supabase para edición
    const productoSupabase = productosSupabase.find(p => p.id === producto.id);
    setEditingProducto(productoSupabase);
    setShowForm(true);
  };

  const handleDeleteProducto = async (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    if (confirm(`¿Está seguro de desactivar el producto ${producto.nombre}?`)) {
      // Aquí deberíamos actualizar en Supabase, pero por ahora mostraremos mensaje
      toast({
        title: "Funcionalidad en desarrollo",
        description: "La activación/desactivación de productos se implementará pronto",
        variant: "destructive"
      });
    }
  };

  const handleReactivateProducto = async (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    if (confirm(`¿Está seguro de reactivar el producto ${producto.nombre}?`)) {
      // Aquí deberíamos actualizar en Supabase, pero por ahora mostraremos mensaje
      toast({
        title: "Funcionalidad en desarrollo", 
        description: "La activación/desactivación de productos se implementará pronto",
        variant: "destructive"
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

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center py-8">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <ProductoForm
        producto={editingProducto}
        productos={productos}
        categorias={categorias}
        onSave={handleSaveProducto}
        onCancel={() => {
          setShowForm(false);
          setEditingProducto(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <EnhancedHeader
        title="Catálogo de Productos Avanzado"
        subtitle="Administra tu inventario de productos y servicios con control integral de precios y stock"
        badge={{
          text: `${productosActivos} Productos Activos`,
          variant: "default"
        }}
        actions={
          <Button 
            className="bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        }
      />

      {/* Enhanced Metrics Section */}
      <Section 
        title="Métricas de Productos" 
        subtitle="Indicadores clave del catálogo y rendimiento comercial"
      >
        <MetricGrid columns={4}>
          <EnhancedMetricCard
            title="Productos Activos"
            value={productosActivos}
            subtitle="En catálogo"
            icon={Package}
            variant="success"
            trend="up"
            trendValue="Disponibles"
          />
          <EnhancedMetricCard
            title="Alertas de Stock"
            value={productosStockBajo}
            subtitle="Stock bajo"
            icon={AlertTriangle}
            variant={productosStockBajo > 0 ? "warning" : "success"}
            trend={productosStockBajo > 0 ? "down" : "up"}
            trendValue={productosStockBajo > 0 ? "Requieren reposición" : "Stock óptimo"}
          />
          <EnhancedMetricCard
            title="Valor de Inventario"
            value={`Bs. ${valorInventario.toLocaleString()}`}
            subtitle="Valor total en stock"
            icon={DollarSign}
            variant="success"
            trend="up"
            trendValue="Activo circulante"
          />
          <EnhancedMetricCard
            title="Total Productos"
            value={productos.length}
            subtitle="Incluye inactivos"
            icon={BarChart3}
            variant="default"
            trend="up"
            trendValue="Catálogo completo"
          />
        </MetricGrid>
      </Section>

      {/* Enhanced Products List */}
      <Section 
        title="Catálogo Completo de Productos"
        subtitle="Gestión avanzada con búsqueda inteligente y controles rápidos"
      >
        <Card className="card-gradient">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  Productos Registrados
                </CardTitle>
                <CardDescription>
                  Busca y gestiona tus productos con filtros avanzados
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
                        {producto.imagenUrl && (
                          <img src={producto.imagenUrl} alt={`Imagen ${producto.nombre}`} className="h-10 w-10 rounded object-cover border" />
                        )}
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
                            <p className="text-muted-foreground">Bs. {(producto.precioVenta || 0).toFixed(2)} <span className="text-xs">(IVA incl.)</span></p>
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
      </Section>
    </div>
  );
};

export default ProductosModule;
