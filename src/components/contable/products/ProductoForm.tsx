
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
    if (producto) {
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
    } else {
      const codigo = generarCodigoProducto();
      setFormData(prev => ({
        ...prev,
        codigo: codigo
      }));
    }
  }, [producto?.id]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.codigo.trim()) {
      newErrors.codigo = "El código es requerido";
    } else if (formData.codigo.length < 3) {
      newErrors.codigo = "El código debe tener al menos 3 caracteres";
    }
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }
    
    if (!formData.categoria_id.trim()) {
      newErrors.categoria_id = "La categoría es requerida";
    }
    
    if (formData.precio_venta <= 0) {
      newErrors.precio_venta = "El precio de venta debe ser mayor a 0";
    } else if (formData.precio_venta > 999999) {
      newErrors.precio_venta = "El precio no puede ser mayor a 999,999";
    }
    
    if (formData.stock_minimo < 0) {
      newErrors.stock_minimo = "El stock mínimo no puede ser negativo";
    }
    
    if (formData.stock_actual < 0) {
      newErrors.stock_actual = "El stock actual no puede ser negativo";
    }
    
    // Verificar código único (solo para nuevos productos)
    if (!producto) {
      const codigoExiste = productos.some(p => p.codigo.toLowerCase() === formData.codigo.toLowerCase().trim());
      if (codigoExiste) {
        newErrors.codigo = "Este código ya existe en otro producto";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
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
        precio_venta: Number(formData.precio_venta),
        precio_compra: Number(formData.precio_compra),
        costo_unitario: Number(formData.costo_unitario),
        stock_actual: Number(formData.stock_actual),
        stock_minimo: Number(formData.stock_minimo),
        codigo_sin: formData.codigo_sin.trim() || "00000000",
        imagen_url: formData.imagen_url || undefined,
        activo: formData.activo
      };

      console.log('📝 Form data being sent:', productoData);
      console.log('💰 Specifically cost_unitario:', productoData.costo_unitario, typeof productoData.costo_unitario);

      if (producto) {
        console.log('🔄 Updating product ID:', producto.id);
        await actualizarProducto(producto.id, productoData);
      } else {
        await crearProducto(productoData);
      }
      
      // Force refresh of data after successful update
      await onSave();
      
      
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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
                 <SelectValue placeholder="Seleccionar unidad" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="PZA">Pieza (PZA)</SelectItem>
                 <SelectItem value="KG">Kilogramo (KG)</SelectItem>
                 <SelectItem value="LT">Litro (LT)</SelectItem>
                 <SelectItem value="MT">Metro (MT)</SelectItem>
                 <SelectItem value="HR">Hora (HR)</SelectItem>
                 <SelectItem value="SRV">Servicio (SRV)</SelectItem>
               </SelectContent>
             </Select>
           </div>

          {/* Precio de Venta */}
           <div className="space-y-2">
             <Label htmlFor="precio_venta">Precio de Venta (Bs.) *</Label>
             <Input
               id="precio_venta"
               type="number"
               value={formData.precio_venta || ''}
               onChange={(e) => handleInputChange("precio_venta", parseFloat(e.target.value) || 0)}
               placeholder="0.00"
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
             <Label htmlFor="precio_compra">Precio de Compra (Bs.)</Label>
             <Input
               id="precio_compra"
               type="number"
               value={formData.precio_compra || ''}
               onChange={(e) => {
                 const value = parseFloat(e.target.value) || 0;
                 handleInputChange("precio_compra", value);
                 // Auto-sync costo_unitario with precio_compra
                 handleInputChange("costo_unitario", value);
               }}
               placeholder="0.00"
               min="0"
               step="0.01"
             />
             <p className="text-xs text-muted-foreground">
               Se sincroniza automáticamente con el costo unitario
             </p>
           </div>

           {/* Costo Unitario */}
           <div className="space-y-2">
             <Label htmlFor="costo_unitario">Costo Unitario (Bs.) *</Label>
             <Input
               id="costo_unitario"
               type="number"
               value={formData.costo_unitario || ''}
               onChange={(e) => {
                 const value = parseFloat(e.target.value) || 0;
                 handleInputChange("costo_unitario", value);
                 // Sync precio_compra with costo_unitario
                 handleInputChange("precio_compra", value);
               }}
               placeholder="0.00"
               min="0"
               step="0.01"
             />
             <p className="text-xs text-muted-foreground">
               Este es el costo que se mostrará en la tabla de productos
             </p>
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
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="min-w-32">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : (producto ? "Actualizar" : "Crear")} Producto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductoForm;
