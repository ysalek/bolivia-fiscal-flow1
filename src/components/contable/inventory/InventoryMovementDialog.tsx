
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProductoInventario, MovimientoInventario, calcularPromedioPonderado } from "./InventoryData";
import { useToast } from "@/hooks/use-toast";

interface InventoryMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: 'entrada' | 'salida';
  productos: ProductoInventario[];
  onMovimiento: (movimiento: MovimientoInventario, productoActualizado: ProductoInventario) => void;
}

const InventoryMovementDialog = ({ open, onOpenChange, tipo, productos, onMovimiento }: InventoryMovementDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productoId: "",
    cantidad: 0,
    costoUnitario: 0,
    motivo: "",
    documento: ""
  });

  const handleSubmit = () => {
    if (!formData.productoId || formData.cantidad <= 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar un producto y cantidad válida",
        variant: "destructive"
      });
      return;
    }

    const producto = productos.find(p => p.id === formData.productoId);
    if (!producto) return;

    if (tipo === 'salida' && formData.cantidad > producto.stockActual) {
      toast({
        title: "Error",
        description: "No hay suficiente stock disponible",
        variant: "destructive"
      });
      return;
    }

    const stockAnterior = producto.stockActual;
    const cantidadMovimiento = tipo === 'entrada' ? formData.cantidad : -formData.cantidad;
    const stockNuevo = stockAnterior + cantidadMovimiento;

    let nuevoCostoPromedio = producto.costoPromedioPonderado;
    if (tipo === 'entrada') {
      nuevoCostoPromedio = calcularPromedioPonderado(
        stockAnterior,
        producto.costoPromedioPonderado,
        formData.cantidad,
        formData.costoUnitario
      );
    }

    const nuevoMovimiento: MovimientoInventario = {
      id: Date.now().toString(),
      fecha: new Date().toISOString().slice(0, 10),
      tipo,
      productoId: producto.id,
      producto: producto.nombre,
      cantidad: formData.cantidad,
      costoUnitario: tipo === 'entrada' ? formData.costoUnitario : producto.costoPromedioPonderado,
      costoPromedioPonderado: nuevoCostoPromedio,
      motivo: formData.motivo,
      documento: formData.documento,
      usuario: "Usuario",
      stockAnterior,
      stockNuevo,
      valorMovimiento: tipo === 'entrada' 
        ? formData.cantidad * formData.costoUnitario 
        : formData.cantidad * producto.costoPromedioPonderado
    };

    const productoActualizado: ProductoInventario = {
      ...producto,
      stockActual: stockNuevo,
      costoPromedioPonderado: nuevoCostoPromedio,
      costoUnitario: tipo === 'entrada' ? formData.costoUnitario : producto.costoUnitario,
      fechaUltimoMovimiento: new Date().toISOString().slice(0, 10),
      valorTotalInventario: stockNuevo * nuevoCostoPromedio
    };

    onMovimiento(nuevoMovimiento, productoActualizado);
    
    toast({
      title: "Movimiento registrado",
      description: `${tipo === 'entrada' ? 'Entrada' : 'Salida'} de inventario registrada correctamente`,
    });

    setFormData({
      productoId: "",
      cantidad: 0,
      costoUnitario: 0,
      motivo: "",
      documento: ""
    });
    
    onOpenChange(false);
  };

  const selectedProduct = productos.find(p => p.id === formData.productoId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Registrar {tipo === 'entrada' ? 'Entrada' : 'Salida'} de Inventario
          </DialogTitle>
          <DialogDescription>
            Complete los datos del movimiento de inventario
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Producto</Label>
            <Select value={formData.productoId} onValueChange={(value) => setFormData(prev => ({ ...prev, productoId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {productos.filter(p => p.categoria !== "Servicios").map(producto => (
                  <SelectItem key={producto.id} value={producto.id}>
                    {producto.codigo} - {producto.nombre} (Stock: {producto.stockActual})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm">
                <strong>Stock actual:</strong> {selectedProduct.stockActual} unidades<br/>
                <strong>Costo promedio:</strong> Bs. {selectedProduct.costoPromedioPonderado.toFixed(2)}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cantidad</Label>
              <Input
                type="number"
                value={formData.cantidad}
                onChange={(e) => setFormData(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 0 }))}
                placeholder="Cantidad"
              />
            </div>

            {tipo === 'entrada' && (
              <div className="space-y-2">
                <Label>Costo Unitario</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.costoUnitario}
                  onChange={(e) => setFormData(prev => ({ ...prev, costoUnitario: parseFloat(e.target.value) || 0 }))}
                  placeholder="Costo unitario"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Motivo</Label>
            <Input
              value={formData.motivo}
              onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
              placeholder="Motivo del movimiento"
            />
          </div>

          <div className="space-y-2">
            <Label>Documento</Label>
            <Input
              value={formData.documento}
              onChange={(e) => setFormData(prev => ({ ...prev, documento: e.target.value }))}
              placeholder="Número de documento"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Registrar {tipo === 'entrada' ? 'Entrada' : 'Salida'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryMovementDialog;
