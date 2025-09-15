
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseProductos, ProductoSupabase, CategoriaProductoSupabase } from "@/hooks/useSupabaseProductos";

interface ProductoFormProps {
  producto?: ProductoSupabase | null;
  productos: ProductoSupabase[];
  categorias: CategoriaProductoSupabase[];
  onSave: () => Promise<void>;
  onCancel: () => void;
}

const ProductoForm = ({ producto, productos, categorias, onSave, onCancel }: ProductoFormProps) => {
  const { crearProducto, actualizarProducto, generarCodigoProducto } = useSupabaseProductos();
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria_id: "",
    unidad_medida: "PZA",
    precio_venta: 0,
    precio_compra: 0,
    costo_unitario: 0,
    stock_actual: 0,
    stock_minimo: 0,
    codigo_sin: "",
    imagen_url: "",
    activo: true
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔧 ProductoForm - useEffect ejecutado:', { producto: !!producto, categorias: categorias.length });
    
    if (producto) {
      console.log('🔧 ProductoForm - Cargando producto para editar:', producto);
      setFormData({
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion || "",
        categoria_id: producto.categoria_id || "",
        unidad_medida: producto.unidad_medida,
        precio_venta: producto.precio_venta,
        precio_compra: producto.precio_compra,
        costo_unitario: producto.costo_unitario,
        stock_actual: producto.stock_actual,
        stock_minimo: producto.stock_minimo,
        codigo_sin: producto.codigo_sin || "",
        imagen_url: producto.imagen_url || "",
        activo: producto.activo
      });
      console.log('🔧 ProductoForm - FormData configurado para edición');
    } else {
      console.log('🔧 ProductoForm - Configurando para nuevo producto');
      const codigo = generarCodigoProducto();
      setFormData(prev => ({
        ...prev,
        codigo: codigo
      }));
      console.log('🔧 ProductoForm - Código generado:', codigo);
    }
  }, [producto?.id]); // Solo cuando cambie el ID del producto, no las categorías

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.codigo.trim()) newErrors.codigo = "El código es requerido";
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.categoria_id.trim()) newErrors.categoria_id = "La categoría es requerida";
    if (formData.precio_venta <= 0) newErrors.precio_venta = "El precio de venta debe ser mayor a 0";
    if (formData.stock_minimo < 0) newErrors.stock_minimo = "El stock mínimo no puede ser negativo";
    
    // Verificar código único (solo para nuevos productos)
    if (!producto) {
      const codigoExiste = productos.some(p => p.codigo === formData.codigo);
      if (codigoExiste) {
        newErrors.codigo = "Este código ya existe";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('🔧 ProductoForm - Iniciando handleSubmit', { producto: !!producto, formData });
    
    if (!validateForm()) {
      console.log('❌ ProductoForm - Error en validación', errors);
      toast({
        title: "Error en la validación",
        description: "Por favor corrija los errores en el formulario.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    
    try {
      const productoData = {
        codigo: formData.codigo.trim(),
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        categoria_id: formData.categoria_id || null,
        unidad_medida: formData.unidad_medida,
        precio_venta: formData.precio_venta,
        precio_compra: formData.precio_compra,
        costo_unitario: formData.costo_unitario || formData.precio_compra,
        stock_actual: formData.stock_actual,
        stock_minimo: formData.stock_minimo,
        codigo_sin: formData.codigo_sin.trim() || "00000000",
        imagen_url: formData.imagen_url || undefined,
        activo: formData.activo
      };

      console.log('📊 ProductoForm - Datos a enviar:', productoData);

      if (producto) {
        console.log('✏️ ProductoForm - Actualizando producto:', producto.id);
        await actualizarProducto(producto.id, productoData);
        console.log('✅ ProductoForm - Producto actualizado exitosamente');
      } else {
        console.log('➕ ProductoForm - Creando producto nuevo');
        await crearProducto(productoData);
        console.log('✅ ProductoForm - Producto creado exitosamente');
      }
      
      console.log('🔄 ProductoForm - Llamando onSave...');
      await onSave();
      console.log('✅ ProductoForm - onSave completado');
      
    } catch (error: any) {
      console.error('❌ ProductoForm - Error al guardar:', error);
      toast({
        title: "Error al guardar",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
      console.log('🏁 ProductoForm - handleSubmit finalizado');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {producto ? "Editar Producto" : "Nuevo Producto"}
            </CardTitle>
            <CardDescription>
              {producto ? "Modifica la información del producto" : "Registra un nuevo producto en el catálogo"}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="codigo">Código *</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => handleInputChange("codigo", e.target.value)}
              placeholder="Código del producto"
              className={errors.codigo ? "border-destructive" : ""}
            />
            {errors.codigo && (
               <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.codigo}
              </p>
            )}
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              placeholder="Nombre del producto"
              className={errors.nombre ? "border-destructive" : ""}
            />
            {errors.nombre && (
               <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label>Categoría *</Label>
            <Select value={formData.categoria_id} onValueChange={(value) => handleInputChange("categoria_id", value)}>
              <SelectTrigger className={errors.categoria_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria_id && (
               <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.categoria_id}
              </p>
            )}
          </div>

          {/* Unidad de Medida */}
          <div className="space-y-2">
            <Label>Unidad de Medida</Label>
            <Select value={formData.unidad_medida} onValueChange={(value) => handleInputChange("unidad_medida", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PZA">Pieza</SelectItem>
                <SelectItem value="KG">Kilogramo</SelectItem>
                <SelectItem value="LT">Litro</SelectItem>
                <SelectItem value="HR">Hora</SelectItem>
                <SelectItem value="SRV">Servicio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Precio de Venta */}
          <div className="space-y-2">
            <Label htmlFor="precio_venta">Precio de Venta *</Label>
            <Input
              id="precio_venta"
              type="number"
              value={formData.precio_venta || ''}
              onChange={(e) => handleInputChange("precio_venta", parseFloat(e.target.value) || '')}
              placeholder="Precio de venta"
              min="0"
              step="0.01"
              className={errors.precio_venta ? "border-destructive" : ""}
            />
            {errors.precio_venta && (
               <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.precio_venta}
              </p>
            )}
          </div>

          {/* Precio de Compra */}
          <div className="space-y-2">
            <Label htmlFor="precio_compra">Precio de Compra</Label>
            <Input
              id="precio_compra"
              type="number"
              value={formData.precio_compra || ''}
              onChange={(e) => handleInputChange("precio_compra", parseFloat(e.target.value) || '')}
              placeholder="Precio de compra"
              min="0"
              step="0.01"
            />
          </div>

          {/* Stock Actual */}
          <div className="space-y-2">
            <Label htmlFor="stock_actual">Stock Actual</Label>
            <Input
              id="stock_actual"
              type="number"
              value={formData.stock_actual || ''}
              onChange={(e) => handleInputChange("stock_actual", parseInt(e.target.value) || '')}
              placeholder="Stock inicial"
              min="0"
            />
          </div>

          {/* Stock Mínimo */}
          <div className="space-y-2">
            <Label htmlFor="stock_minimo">Stock Mínimo</Label>
            <Input
              id="stock_minimo"
              type="number"
              value={formData.stock_minimo || ''}
              onChange={(e) => handleInputChange("stock_minimo", parseInt(e.target.value) || '')}
              placeholder="Stock mínimo"
              min="0"
              className={errors.stock_minimo ? "border-destructive" : ""}
            />
            {errors.stock_minimo && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.stock_minimo}
              </p>
            )}
          </div>

          {/* Código SIN */}
          <div className="space-y-2">
            <Label htmlFor="codigo_sin">Código SIN</Label>
            <Input
              id="codigo_sin"
              value={formData.codigo_sin}
              onChange={(e) => handleInputChange("codigo_sin", e.target.value)}
              placeholder="Código del SIN"
            />
          </div>

          {/* URL de Imagen */}
          <div className="space-y-2">
            <Label htmlFor="imagen_url">URL de imagen (opcional)</Label>
            <Input
              id="imagen_url"
              value={formData.imagen_url}
              onChange={(e) => handleInputChange("imagen_url", e.target.value)}
              placeholder="https://.../imagen.jpg"
            />
            {formData.imagen_url && (
              <div className="mt-2">
                <img src={formData.imagen_url} alt="Vista previa" className="h-24 w-24 rounded object-cover border" />
              </div>
            )}
          </div>

          {/* Estado del producto (solo para edición) */}
          {producto && (
            <div className="space-y-2">
              <Label>Estado del Producto</Label>
              <Select value={formData.activo ? 'true' : 'false'} onValueChange={(value) => handleInputChange("activo", value === 'true')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => handleInputChange("descripcion", e.target.value)}
            placeholder="Descripción detallada del producto"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : (producto ? "Actualizar" : "Guardar")} Producto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductoForm;
