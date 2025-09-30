
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2, AlertCircle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Proveedor, ItemCompra, Compra } from "./PurchasesData";
import { Producto } from "../products/ProductsData";
import ProductSearchCombobox from "../billing/ProductSearchCombobox";
import ProveedorSearchCombobox from "./ProveedorSearchCombobox";
import ProveedorForm from "./ProveedorForm";
import { CostosAdicionalesDialog } from './CostosAdicionalesDialog';

interface CompraFormProps {
  proveedores: Proveedor[];
  productos: Producto[];
  compras: Compra[];
  onSave: (compra: Compra) => void;
  onCancel: () => void;
  onAddProveedor: (proveedor: Proveedor) => void;
}

const CompraForm = ({ proveedores, productos, compras, onSave, onCancel, onAddProveedor }: CompraFormProps) => {
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [items, setItems] = useState<ItemCompra[]>([
    {
      id: Date.now().toString(),
      productoId: "",
      descripcion: "",
      cantidad: 1,
      costoUnitario: 0,
      subtotal: 0,
    },
  ]);
  const [observaciones, setObservaciones] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [costosAdicionales, setCostosAdicionales] = useState<any[]>([]);
  const [showCostosDialog, setShowCostosDialog] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedProveedor) newErrors.proveedor = "Debe seleccionar un proveedor";
    if (items.some(item => !item.productoId || item.cantidad <= 0 || item.costoUnitario <= 0)) {
      newErrors.items = "Todos los items deben tener producto, cantidad y costo válidos.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        productoId: "",
        descripcion: "",
        cantidad: 1,
        costoUnitario: 0,
        subtotal: 0,
      },
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    setItems(prev => {
      const newItems = [...prev];
      const currentItem = { ...newItems[index] };

      if (field === 'productoId') {
        const producto = productos.find(p => p.id === value);
        if (producto) {
          currentItem.productoId = value;
          currentItem.descripcion = producto.nombre;
          currentItem.costoUnitario = producto.costoUnitario;
        }
      } else {
        (currentItem as any)[field] = value;
      }
      
      currentItem.subtotal = currentItem.cantidad * currentItem.costoUnitario;
      newItems[index] = currentItem;
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => items.reduce((total, item) => total + item.subtotal, 0);
  const subtotal = calculateSubtotal();
  const totalCostosAdicionales = costosAdicionales.reduce((sum, c) => sum + (c.monto || 0), 0);
  const iva = subtotal * 0.13; // IVA crédito fiscal - se registra en contabilidad
  const total = subtotal + totalCostosAdicionales; // El total incluye costos adicionales

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({ title: "Error en el formulario", description: "Por favor, corrija los errores.", variant: "destructive" });
      return;
    }

    const numero = (Math.max(...compras.map(c => parseInt(c.numero.replace('OC-', ''))), 0) + 1).toString().padStart(4, '0');

    const nuevaCompra: Compra = {
      id: Date.now().toString(),
      numero: `OC-${numero}`,
      proveedor: selectedProveedor!,
      fecha: new Date().toISOString().slice(0, 10),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      items: items.filter(item => item.productoId),
      subtotal,
      descuentoTotal: 0,
      iva,
      total: subtotal, // Total de la factura sin IVA (el IVA va en contabilidad)
      estado: 'recibida',
      observaciones: observaciones,
      fechaCreacion: new Date().toISOString().slice(0, 10),
    };

    onSave(nuevaCompra);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Nueva Orden de Compra</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button>
        </div>
        <CardDescription>Registre una nueva compra de productos o servicios.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Proveedor</Label>
          <div className="flex gap-2">
            <div className={`flex-1 ${errors.proveedor ? "border border-red-500 rounded-md" : ""}`}>
              <ProveedorSearchCombobox 
                proveedores={proveedores} 
                value={selectedProveedor?.id || ""} 
                onValueChange={(id) => setSelectedProveedor(proveedores.find(p => p.id === id) || null)}
                placeholder="Buscar proveedor..."
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowProveedorForm(true)}
              title="Agregar nuevo proveedor"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.proveedor && <p className="text-sm text-red-500 mt-1">{errors.proveedor}</p>}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Items de la Compra</h3>
          {errors.items && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.items}</p>}
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end p-4 border rounded-lg bg-slate-50/50">
              <div className="md:col-span-2">
                <Label>Producto</Label>
                <ProductSearchCombobox productos={productos} value={item.productoId} onChange={(id) => updateItem(index, 'productoId', id)} />
              </div>
              <div>
                <Label>Cantidad</Label>
                <Input type="number" value={item.cantidad} onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 1)} min="1" />
              </div>
              <div>
                <Label>Costo Unitario</Label>
                <Input type="number" value={item.costoUnitario} onChange={(e) => updateItem(index, 'costoUnitario', parseFloat(e.target.value) || 0)} min="0" step="0.01" />
              </div>
              <div>
                <Label>Subtotal</Label>
                <Input value={`Bs. ${item.subtotal.toFixed(2)}`} readOnly className="bg-gray-100" />
              </div>
              {items.length > 1 && (
                <div className="md:self-end">
                  <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Button onClick={addItem} size="sm"><Plus className="w-4 h-4 mr-2" />Agregar Item</Button>
        </div>

        <div className="border rounded-lg p-4 bg-amber-50/50">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="font-semibold">Costos Adicionales</h4>
              <p className="text-xs text-muted-foreground">Fletes, almacenaje, nacionalización, etc.</p>
            </div>
            <Button 
              type="button"
              size="sm" 
              variant="outline"
              onClick={() => setShowCostosDialog(true)}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              {costosAdicionales.length > 0 ? 'Editar Costos' : 'Agregar Costos'}
            </Button>
          </div>
          {costosAdicionales.length > 0 && (
            <div className="space-y-1 text-sm">
              {costosAdicionales.map(c => (
                <div key={c.id} className="flex justify-between">
                  <span>{c.concepto}:</span>
                  <span className="font-semibold">Bs. {c.monto.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t font-bold">
                <span>Total Costos Adicionales:</span>
                <span className="text-amber-600">Bs. {totalCostosAdicionales.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones adicionales sobre la compra..."
          />
        </div>

        <div className="flex justify-end pt-6">
            <div className="w-full max-w-sm space-y-2 p-4 bg-slate-50 rounded-lg border">
                <div className="flex justify-between text-slate-600">
                    <span>Subtotal (Costo de Productos)</span>
                    <span>Bs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total de la Factura</span>
                    <span className="text-blue-600">Bs. {subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * El IVA crédito fiscal (Bs. {iva.toFixed(2)}) se registra automáticamente en contabilidad
                </p>
            </div>
        </div>

        <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar Compra</Button>
        </div>
      </CardContent>
      
      <ProveedorForm
        open={showProveedorForm}
        onOpenChange={setShowProveedorForm}
        onSave={onAddProveedor}
      />
      
      <CostosAdicionalesDialog
        open={showCostosDialog}
        onOpenChange={setShowCostosDialog}
        onSave={(costos) => setCostosAdicionales(costos)}
        costosIniciales={costosAdicionales}
      />
    </Card>
  );
};

export default CompraForm;
