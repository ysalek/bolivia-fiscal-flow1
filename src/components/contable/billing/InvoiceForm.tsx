import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Cliente, ItemFactura, Factura, calcularIVA, calcularTotal, generarNumeroFactura } from "./BillingData";
import { Producto } from "../products/ProductsData";
import InvoiceClientSelector from "./InvoiceClientSelector";
import InvoiceItems from "./InvoiceItems";
import InvoiceTotals from "./InvoiceTotals";
import InvoiceActions from "./InvoiceActions";

interface InvoiceFormProps {
  clientes: Cliente[];
  productos: Producto[];
  facturas: Factura[];
  onSave: (factura: Factura) => void;
  onCancel: () => void;
  onAddNewClient: (cliente: Cliente) => void;
}

const InvoiceForm = ({ clientes, productos, facturas, onSave, onCancel, onAddNewClient }: InvoiceFormProps) => {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [items, setItems] = useState<ItemFactura[]>([
    {
      id: Date.now().toString(),
      productoId: "",
      codigo: "",
      descripcion: "",
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0,
      subtotal: 0,
      codigoSIN: ""
    }
  ]);
  const [observaciones, setObservaciones] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!selectedCliente) newErrors.cliente = "Debe seleccionar un cliente";
    if (items.some(item => !item.descripcion.trim())) {
      newErrors.items = "Todos los items deben tener descripción";
    }
    if (calculateSubtotal() <= 0) {
      newErrors.total = "El total debe ser mayor a 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    const newItem: ItemFactura = {
      id: Date.now().toString(),
      productoId: "",
      codigo: "",
      descripcion: "",
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0,
      subtotal: 0,
      codigoSIN: ""
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    setItems(prev => {
      const newItems = [...prev];
      
      if (field === 'productoId' && value) {
        const producto = productos.find(p => p.id === value);
        if (producto) {
          newItems[index] = {
            ...newItems[index],
            productoId: value,
            codigo: producto.codigo,
            descripcion: producto.nombre,
            precioUnitario: producto.precioVenta,
            codigoSIN: producto.codigoSIN,
            subtotal: newItems[index].cantidad * producto.precioVenta - newItems[index].descuento
          };
        }
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
        
        if (field === 'cantidad' || field === 'precioUnitario' || field === 'descuento') {
          const cantidad = field === 'cantidad' ? value : newItems[index].cantidad;
          const precio = field === 'precioUnitario' ? value : newItems[index].precioUnitario;
          const descuento = field === 'descuento' ? value : newItems[index].descuento;
          newItems[index].subtotal = (cantidad * precio) - descuento;
        }
      }
      
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  const calculateDiscountTotal = () => {
    return items.reduce((total, item) => total + item.descuento, 0);
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

    try {
      const subtotal = calculateSubtotal();
      const descuentoTotal = calculateDiscountTotal();
      const iva = calcularIVA(subtotal);
      const total = calcularTotal(subtotal);

      const numeros = facturas.map(f => parseInt(f.numero)).filter(n => !isNaN(n));
      const ultimoNumero = numeros.length > 0 ? Math.max(...numeros) : 0;

      const nuevaFactura: Factura = {
        id: Date.now().toString(),
        numero: generarNumeroFactura(ultimoNumero.toString()),
        cliente: selectedCliente!,
        fecha: new Date().toISOString().slice(0, 10),
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        items: items.filter(item => item.descripcion.trim()),
        subtotal,
        descuentoTotal,
        iva,
        total,
        estado: 'enviada',
        estadoSIN: 'pendiente',
        cuf: `CUF${Date.now()}`,
        codigoControl: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 90) + 10}`,
        observaciones,
        fechaCreacion: new Date().toISOString().slice(0, 10)
      };

      onSave(nuevaFactura);

      toast({
        title: "Factura guardada",
        description: `La Factura N° ${nuevaFactura.numero} ha sido guardada y está lista para ser procesada.`,
      });
    } catch (error) {
      console.error("Error al crear la factura:", error);
      toast({
        title: "Error al crear la factura",
        description: "Ocurrió un error inesperado. Por favor intente nuevamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Nueva Factura</CardTitle>
            <CardDescription>
              Crear factura electrónica para envío al SIN
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <InvoiceClientSelector
          clientes={clientes}
          selectedCliente={selectedCliente}
          onSelectCliente={setSelectedCliente}
          onAddNewClient={onAddNewClient}
          error={errors.cliente}
        />

        <InvoiceItems
          items={items}
          productos={productos}
          updateItem={updateItem}
          addItem={addItem}
          removeItem={removeItem}
          error={errors.items}
        />

        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones adicionales"
          />
        </div>

        <InvoiceTotals
          subtotal={calculateSubtotal()}
          discountTotal={calculateDiscountTotal()}
          error={errors.total}
        />

        <InvoiceActions
          onPreview={() => toast({ title: "Vista Previa", description: "Esta función aún no está implementada." })}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
