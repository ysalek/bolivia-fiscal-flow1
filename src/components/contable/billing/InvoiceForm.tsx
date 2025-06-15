
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send, Eye, X, AlertCircle, Trash2, ChevronsUpDown, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Cliente, ItemFactura, Factura, calcularIVA, calcularTotal, generarNumeroFactura } from "./BillingData";
import { Producto } from "../products/ProductsData";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClienteForm from "../clients/ClienteForm";

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
      id: "1",
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
  const [openCombobox, setOpenCombobox] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [openProductCombobox, setOpenProductCombobox] = useState<number | null>(null);

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

  const handleSaveNewClient = (cliente: Cliente) => {
    onAddNewClient(cliente);
    setSelectedCliente(cliente);
    setShowNewClientDialog(false);
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
        {/* Datos del cliente */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <div className="flex items-center gap-2">
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className={`w-full justify-between ${errors.cliente ? "border-red-500" : ""}`}
                  >
                    {selectedCliente
                      ? `${selectedCliente.nombre} - ${selectedCliente.nit}`
                      : "Seleccionar cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar cliente por nombre o NIT..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                      <CommandGroup>
                        {clientes.map((cliente) => (
                          <CommandItem
                            key={cliente.id}
                            value={`${cliente.nombre} ${cliente.nit}`}
                            onSelect={() => {
                              setSelectedCliente(cliente);
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCliente?.id === cliente.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {cliente.nombre} - {cliente.nit}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="sm" onClick={() => setShowNewClientDialog(true)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {errors.cliente && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.cliente}
              </p>
            )}
          </div>

          <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
              <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                      <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                  </DialogHeader>
                  <ClienteForm 
                      onSave={handleSaveNewClient} 
                      onCancel={() => setShowNewClientDialog(false)} 
                  />
              </DialogContent>
          </Dialog>

          {selectedCliente && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Email: {selectedCliente.email}</p>
                <p className="text-sm font-medium">Teléfono: {selectedCliente.telefono}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Dirección: {selectedCliente.direccion}</p>
              </div>
            </div>
          )}
        </div>

        {/* Items de la factura */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Items de la Factura</h3>
            <Button onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Item
            </Button>
          </div>

          {errors.items && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.items}
            </p>
          )}

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-7 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Producto</Label>
                  <Popover open={openProductCombobox === index} onOpenChange={(isOpen) => setOpenProductCombobox(isOpen ? index : null)}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {item.productoId
                          ? productos.find((p) => p.id === item.productoId)?.nombre
                          : "Seleccionar"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar producto..." />
                        <CommandList>
                          <CommandEmpty>No se encontraron productos.</CommandEmpty>
                          <CommandGroup>
                            {productos.map((producto) => (
                              <CommandItem
                                key={producto.id}
                                value={`${producto.nombre} ${producto.codigo}`}
                                onSelect={() => {
                                  updateItem(index, 'productoId', producto.id);
                                  setOpenProductCombobox(null);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    item.productoId === producto.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {producto.nombre}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    value={item.descripcion}
                    onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                    placeholder="Descripción del item"
                    className="min-h-[60px]"
                  />
                </div>
                <div>
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
                <div>
                  <Label>Precio Unit.</Label>
                  <Input
                    type="number"
                    value={item.precioUnitario}
                    onChange={(e) => updateItem(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>Descuento</Label>
                  <Input
                    type="number"
                    value={item.descuento}
                    onChange={(e) => updateItem(index, 'descuento', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>Subtotal</Label>
                  <Input
                    value={`Bs. ${item.subtotal.toFixed(2)}`}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="flex items-end">
                  {items.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones adicionales"
          />
        </div>

        {/* Totales */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Bs. {calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuento:</span>
              <span>Bs. {calculateDiscountTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (13%):</span>
              <span>Bs. {calcularIVA(calculateSubtotal()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>Bs. {calcularTotal(calculateSubtotal()).toFixed(2)}</span>
            </div>
            {errors.total && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.total}
              </p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" />
            Crear Factura
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
