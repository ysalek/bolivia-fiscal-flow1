
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Receipt, Send, Eye, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FacturacionModule = () => {
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    cliente: "",
    nit: "",
    email: "",
    direccion: "",
    productos: [{ descripcion: "", cantidad: 1, precio: 0, subtotal: 0, codigo: "" }]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // Productos disponibles (simulando una base de datos)
  const productosDisponibles = [
    { codigo: "PROD001", nombre: "Servicio de Consultoría", precio: 500.00 },
    { codigo: "PROD002", nombre: "Laptop Dell Inspiron", precio: 4200.00 },
    { codigo: "PROD003", nombre: "Software de Gestión", precio: 1200.00 },
    { codigo: "PROD004", nombre: "Capacitación Empresarial", precio: 800.00 }
  ];

  const facturas = [
    {
      id: "001234",
      cliente: "Empresa ABC S.R.L.",
      nit: "1234567890",
      fecha: "2024-06-15",
      monto: 1250.00,
      estado: "enviado",
      cuf: "ABC123DEF456",
      sin_status: "aceptado"
    },
    {
      id: "001235",
      cliente: "Comercial XYZ Ltda.",
      nit: "0987654321",
      fecha: "2024-06-14",
      monto: 2500.00,
      estado: "pendiente",
      cuf: "DEF789GHI012",
      sin_status: "pendiente"
    },
    {
      id: "001236",
      cliente: "Servicios 123",
      nit: "5555666677",
      fecha: "2024-06-13",
      monto: 850.00,
      estado: "enviado",
      cuf: "GHI345JKL678",
      sin_status: "aceptado"
    }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!invoiceData.cliente.trim()) newErrors.cliente = "La razón social es obligatoria";
    if (!invoiceData.nit.trim()) newErrors.nit = "El NIT es obligatorio";
    if (!invoiceData.email.trim()) newErrors.email = "El email es obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invoiceData.email)) {
      newErrors.email = "El email no tiene un formato válido";
    }
    
    if (invoiceData.productos.some(p => !p.descripcion.trim())) {
      newErrors.productos = "Todos los productos deben tener descripción";
    }
    
    if (calculateTotal() <= 0) {
      newErrors.total = "El total debe ser mayor a 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addProduct = () => {
    setInvoiceData(prev => ({
      ...prev,
      productos: [...prev.productos, { descripcion: "", cantidad: 1, precio: 0, subtotal: 0, codigo: "" }]
    }));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    setInvoiceData(prev => {
      const newProducts = [...prev.productos];
      
      if (field === 'codigo' && value) {
        const producto = productosDisponibles.find(p => p.codigo === value);
        if (producto) {
          newProducts[index] = {
            ...newProducts[index],
            codigo: value,
            descripcion: producto.nombre,
            precio: producto.precio,
            subtotal: newProducts[index].cantidad * producto.precio
          };
        }
      } else {
        newProducts[index] = { ...newProducts[index], [field]: value };
        
        if (field === 'cantidad' || field === 'precio') {
          newProducts[index].subtotal = newProducts[index].cantidad * newProducts[index].precio;
        }
      }
      
      return { ...prev, productos: newProducts };
    });
  };

  const removeProduct = (index: number) => {
    setInvoiceData(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotal = () => {
    return invoiceData.productos.reduce((total, producto) => total + producto.subtotal, 0);
  };

  const calculateIVA = () => {
    return calculateSubtotal() * 0.13;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateIVA();
  };

  const generateInvoiceNumber = () => {
    const lastInvoice = Math.max(...facturas.map(f => parseInt(f.id)));
    return String(lastInvoice + 1).padStart(6, '0');
  };

  const handleSubmitInvoice = () => {
    if (!validateForm()) {
      toast({
        title: "Error en la validación",
        description: "Por favor corrija los errores en el formulario.",
        variant: "destructive"
      });
      return;
    }

    const numeroFactura = generateInvoiceNumber();
    toast({
      title: "Factura creada exitosamente",
      description: `Factura N° ${numeroFactura} ha sido generada y enviada al SIN correctamente.`,
    });
    
    setShowNewInvoice(false);
    setInvoiceData({
      cliente: "",
      nit: "",
      email: "",
      direccion: "",
      productos: [{ descripcion: "", cantidad: 1, precio: 0, subtotal: 0, codigo: "" }]
    });
    setErrors({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aceptado": return "bg-green-100 text-green-800";
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      case "rechazado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (showNewInvoice) {
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
            <Button 
              variant="outline" 
              onClick={() => {
                setShowNewInvoice(false);
                setErrors({});
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Datos del cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Razón Social / Nombre *</Label>
              <Input
                id="cliente"
                value={invoiceData.cliente}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, cliente: e.target.value }))}
                placeholder="Nombre del cliente"
                className={errors.cliente ? "border-red-500" : ""}
              />
              {errors.cliente && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cliente}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nit">NIT *</Label>
              <Input
                id="nit"
                value={invoiceData.nit}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, nit: e.target.value }))}
                placeholder="Número de identificación tributaria"
                className={errors.nit ? "border-red-500" : ""}
              />
              {errors.nit && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nit}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={invoiceData.email}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="correo@cliente.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={invoiceData.direccion}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, direccion: e.target.value }))}
                placeholder="Dirección del cliente"
              />
            </div>
          </div>

          {/* Productos/Servicios */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Productos/Servicios</h3>
              <Button onClick={addProduct} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>

            {errors.productos && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.productos}
              </p>
            )}

            {invoiceData.productos.map((producto, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Código</Label>
                  <Select 
                    value={producto.codigo} 
                    onValueChange={(value) => updateProduct(index, 'codigo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {productosDisponibles.map(p => (
                        <SelectItem key={p.codigo} value={p.codigo}>
                          {p.codigo} - {p.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    value={producto.descripcion}
                    onChange={(e) => updateProduct(index, 'descripcion', e.target.value)}
                    placeholder="Descripción del producto/servicio"
                    className="min-h-[60px]"
                  />
                </div>
                <div>
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => updateProduct(index, 'cantidad', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
                <div>
                  <Label>Precio Unitario</Label>
                  <Input
                    type="number"
                    value={producto.precio}
                    onChange={(e) => updateProduct(index, 'precio', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>Subtotal</Label>
                  <Input
                    value={`Bs. ${producto.subtotal.toFixed(2)}`}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="flex items-end">
                  {invoiceData.productos.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(index)}
                      className="mb-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Bs. {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (13%):</span>
                <span>Bs. {calculateIVA().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>Bs. {calculateTotal().toFixed(2)}</span>
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
            <Button onClick={handleSubmitInvoice}>
              <Send className="w-4 h-4 mr-2" />
              Emitir y Enviar al SIN
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón nueva factura */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Facturación Electrónica</h2>
          <p className="text-slate-600">Gestión de facturas y documentos fiscales</p>
        </div>
        <Button onClick={() => setShowNewInvoice(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {facturas.filter(f => f.sin_status === 'aceptado').length}
              </div>
              <div className="text-sm text-gray-600">Facturas Aceptadas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {facturas.filter(f => f.sin_status === 'pendiente').length}
              </div>
              <div className="text-sm text-gray-600">Pendientes SIN</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Bs. {facturas.reduce((sum, f) => sum + f.monto, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Facturado</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{facturas.length}</div>
              <div className="text-sm text-gray-600">Total Facturas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de facturas */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas Emitidas</CardTitle>
          <CardDescription>
            Historial de facturas electrónicas enviadas al SIN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">N° Factura</th>
                  <th className="text-left p-2">Cliente</th>
                  <th className="text-left p-2">NIT</th>
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Monto</th>
                  <th className="text-left p-2">Estado SIN</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono">{factura.id}</td>
                    <td className="p-2">{factura.cliente}</td>
                    <td className="p-2">{factura.nit}</td>
                    <td className="p-2">{factura.fecha}</td>
                    <td className="p-2">Bs. {factura.monto.toFixed(2)}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(factura.sin_status)}>
                        {factura.sin_status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Receipt className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacturacionModule;
