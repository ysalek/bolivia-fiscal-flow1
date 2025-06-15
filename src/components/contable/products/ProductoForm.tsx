
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Producto, generarCodigoProducto, categoriasIniciales } from "./ProductsData";

interface ProductoFormProps {
  producto?: Producto | null;
  productos: Producto[];
  onSave: (producto: Producto) => void;
  onCancel: () => void;
}

const ProductoForm = ({ producto, productos, onSave, onCancel }: ProductoFormProps) => {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    unidadMedida: "PZA",
    precioVenta: 0,
    precioCompra: 0,
    costoUnitario: 0,
    stockActual: 0,
    stockMinimo: 0,
    codigoSIN: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        unidadMedida: producto.unidadMedida,
        precioVenta: producto.precioVenta,
        precioCompra: producto.precioCompra,
        costoUnitario: producto.costoUnitario,
        stockActual: producto.stockActual,
        stockMinimo: producto.stockMinimo,
        codigoSIN: producto.codigoSIN
      });
    } else {
      // Generar código automático para nuevo producto
      const codigosExistentes = productos.map(p => p.codigo);
      const ultimoCodigo = codigosExistentes
        .filter(c => c.startsWith('PROD'))
        .sort()
        .pop() || 'PROD000';
      
      setFormData(prev => ({
        ...prev,
        codigo: generarCodigoProducto(ultimoCodigo)
      }));
    }
  }, [producto, productos]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.codigo.trim()) newErrors.codigo = "El código es requerido";
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.categoria.trim()) newErrors.categoria = "La categoría es requerida";
    if (formData.precioVenta <= 0) newErrors.precioVenta = "El precio de venta debe ser mayor a 0";
    if (formData.stockMinimo < 0) newErrors.stockMinimo = "El stock mínimo no puede ser negativo";
    
    // Verificar código único
    const codigoExiste = productos.some(p => 
      p.codigo === formData.codigo && p.id !== producto?.id
    );
    if (codigoExiste) {
      newErrors.codigo = "Este código ya existe";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Error en la validación",
        description: "Por favor corrija los errores en el formulario.",
        variant: "destructive"
      });
      return;
    }

    const nuevoProducto: Producto = {
      id: producto?.id || Date.now().toString(),
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria,
      unidadMedida: formData.unidadMedida,
      precioVenta: formData.precioVenta,
      precioCompra: formData.precioCompra,
      costoUnitario: formData.costoUnitario || formData.precioCompra,
      stockActual: formData.stockActual,
      stockMinimo: formData.stockMinimo,
      codigoSIN: formData.codigoSIN.trim(),
      activo: producto?.activo ?? true,
      fechaCreacion: producto?.fechaCreacion || new Date().toISOString().slice(0, 10),
      fechaActualizacion: new Date().toISOString().slice(0, 10)
    };

    onSave(nuevoProducto);
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
              className={errors.codigo ? "border-red-500" : ""}
            />
            {errors.codigo && (
              <p className="text-sm text-red-500 flex items-center gap-1">
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
              className={errors.nombre ? "border-red-500" : ""}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label>Categoría *</Label>
            <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
              <SelectTrigger className={errors.categoria ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categoriasIniciales.map(cat => (
                  <SelectItem key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.categoria}
              </p>
            )}
          </div>

          {/* Unidad de Medida */}
          <div className="space-y-2">
            <Label>Unidad de Medida</Label>
            <Select value={formData.unidadMedida} onValueChange={(value) => handleInputChange("unidadMedida", value)}>
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
            <Label htmlFor="precioVenta">Precio de Venta *</Label>
            <Input
              id="precioVenta"
              type="number"
              value={formData.precioVenta}
              onChange={(e) => handleInputChange("precioVenta", parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.precioVenta ? "border-red-500" : ""}
            />
            {errors.precioVenta && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.precioVenta}
              </p>
            )}
          </div>

          {/* Precio de Compra */}
          <div className="space-y-2">
            <Label htmlFor="precioCompra">Precio de Compra</Label>
            <Input
              id="precioCompra"
              type="number"
              value={formData.precioCompra}
              onChange={(e) => handleInputChange("precioCompra", parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Stock Actual */}
          <div className="space-y-2">
            <Label htmlFor="stockActual">Stock Actual</Label>
            <Input
              id="stockActual"
              type="number"
              value={formData.stockActual}
              onChange={(e) => handleInputChange("stockActual", parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>

          {/* Stock Mínimo */}
          <div className="space-y-2">
            <Label htmlFor="stockMinimo">Stock Mínimo</Label>
            <Input
              id="stockMinimo"
              type="number"
              value={formData.stockMinimo}
              onChange={(e) => handleInputChange("stockMinimo", parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              className={errors.stockMinimo ? "border-red-500" : ""}
            />
            {errors.stockMinimo && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.stockMinimo}
              </p>
            )}
          </div>

          {/* Código SIN */}
          <div className="space-y-2">
            <Label htmlFor="codigoSIN">Código SIN</Label>
            <Input
              id="codigoSIN"
              value={formData.codigoSIN}
              onChange={(e) => handleInputChange("codigoSIN", e.target.value)}
              placeholder="Código del SIN"
            />
          </div>
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
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            {producto ? "Actualizar" : "Guardar"} Producto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductoForm;
