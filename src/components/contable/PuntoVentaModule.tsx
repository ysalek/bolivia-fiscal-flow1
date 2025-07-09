import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Receipt, 
  Search,
  Calculator,
  Users
} from "lucide-react";
import { Producto } from "./products/ProductsData";

interface ItemVenta {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

interface Cliente {
  id: string;
  nombre: string;
  nit: string;
  telefono: string;
}

const PuntoVentaModule = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemVenta[]>([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [metodoPago, setMetodoPago] = useState<string>("efectivo");
  const [montoRecibido, setMontoRecibido] = useState<number>(0);
  const [showTicket, setShowTicket] = useState(false);
  const [ultimaVenta, setUltimaVenta] = useState<any>(null);
  const { toast } = useToast();

  // Cargar productos al inicio
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    }
  }, []);

  const clientesPredefinidos: Cliente[] = [
    { id: "1", nombre: "Cliente General", nit: "0", telefono: "" },
    { id: "2", nombre: "María González", nit: "1234567020", telefono: "70123456" },
    { id: "3", nombre: "Carlos Mendoza", nit: "9876543021", telefono: "71987654" },
  ];

  const productosFiltrados = productos.filter(p => 
    p.activo && 
    (p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
     p.codigo.toLowerCase().includes(busquedaProducto.toLowerCase()))
  );

  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + 1;
      if (nuevaCantidad > producto.stockActual) {
        toast({
          title: "Stock insuficiente",
          description: `Solo hay ${producto.stockActual} unidades disponibles`,
          variant: "destructive"
        });
        return;
      }
      
      setCarrito(carrito.map(item => 
        item.producto.id === producto.id 
          ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.precioUnitario }
          : item
      ));
    } else {
      if (producto.stockActual < 1) {
        toast({
          title: "Sin stock",
          description: "Este producto no tiene stock disponible",
          variant: "destructive"
        });
        return;
      }
      
      const nuevoItem: ItemVenta = {
        producto,
        cantidad: 1,
        precioUnitario: producto.precioVenta,
        descuento: 0,
        subtotal: producto.precioVenta
      };
      setCarrito([...carrito, nuevoItem]);
    }
  };

  const actualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad === 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    const producto = productos.find(p => p.id === productoId);
    if (producto && nuevaCantidad > producto.stockActual) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${producto.stockActual} unidades disponibles`,
        variant: "destructive"
      });
      return;
    }

    setCarrito(carrito.map(item => 
      item.producto.id === productoId 
        ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.precioUnitario - item.descuento }
        : item
    ));
  };

  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
  };

  const procesarVenta = () => {
    if (carrito.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agregue productos al carrito antes de procesar la venta",
        variant: "destructive"
      });
      return;
    }

    const total = calcularTotal();
    
    if (metodoPago === "efectivo" && montoRecibido < total) {
      toast({
        title: "Monto insuficiente",
        description: "El monto recibido es menor al total de la venta",
        variant: "destructive"
      });
      return;
    }

    // Actualizar stock de productos
    const productosActualizados = productos.map(producto => {
      const itemCarrito = carrito.find(item => item.producto.id === producto.id);
      if (itemCarrito) {
        return {
          ...producto,
          stockActual: producto.stockActual - itemCarrito.cantidad,
          fechaActualizacion: new Date().toISOString().slice(0, 10)
        };
      }
      return producto;
    });

    localStorage.setItem('productos', JSON.stringify(productosActualizados));
    setProductos(productosActualizados);

    // Generar datos de la venta
    const venta = {
      id: Date.now().toString(),
      numero: `PV-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toLocaleTimeString(),
      cliente: cliente || clientesPredefinidos[0],
      items: carrito,
      subtotal: total,
      descuento: 0,
      total: total,
      metodoPago,
      montoRecibido: metodoPago === "efectivo" ? montoRecibido : total,
      cambio: metodoPago === "efectivo" ? montoRecibido - total : 0
    };

    // Guardar venta en localStorage
    const ventasGuardadas = JSON.parse(localStorage.getItem('ventas') || '[]');
    localStorage.setItem('ventas', JSON.stringify([venta, ...ventasGuardadas]));

    setUltimaVenta(venta);
    setShowTicket(true);
    limpiarVenta();

    toast({
      title: "Venta procesada",
      description: `Venta ${venta.numero} procesada exitosamente`,
    });
  };

  const limpiarVenta = () => {
    setCarrito([]);
    setCliente(null);
    setMontoRecibido(0);
    setBusquedaProducto("");
  };

  const imprimirTicket = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Punto de Venta</h2>
          <p className="text-muted-foreground">Sistema POS integrado con control de inventario</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={limpiarVenta}>
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Productos */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Seleccionar Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Buscar productos por nombre o código..."
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {productosFiltrados.map((producto) => (
                  <div
                    key={producto.id}
                    className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{producto.nombre}</h4>
                        <p className="text-sm text-muted-foreground">{producto.codigo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-primary">
                            Bs. {producto.precioVenta.toFixed(2)}
                          </span>
                          <Badge variant={producto.stockActual > producto.stockMinimo ? "secondary" : "destructive"}>
                            Stock: {producto.stockActual}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" className="ml-2">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Venta */}
        <div className="space-y-4">
          {/* Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={cliente?.id || ""} onValueChange={(value) => {
                const clienteSeleccionado = clientesPredefinidos.find(c => c.id === value);
                setCliente(clienteSeleccionado || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientesPredefinidos.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre} - {c.nit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Carrito */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Carrito ({carrito.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {carrito.map((item) => (
                  <div key={item.producto.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.producto.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        Bs. {item.precioUnitario.toFixed(2)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.cantidad}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => eliminarDelCarrito(item.producto.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {carrito.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Carrito vacío</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumen y Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Resumen de Venta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Bs. {calcularTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>Bs. {calcularTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Método de Pago</label>
                  <Select value={metodoPago} onValueChange={setMetodoPago}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4" />
                          Efectivo
                        </div>
                      </SelectItem>
                      <SelectItem value="tarjeta">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Tarjeta
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {metodoPago === "efectivo" && (
                  <div>
                    <label className="text-sm font-medium">Monto Recibido</label>
                    <Input
                      type="number"
                      value={montoRecibido}
                      onChange={(e) => setMontoRecibido(Number(e.target.value))}
                      placeholder="0.00"
                    />
                    {montoRecibido > calcularTotal() && (
                      <p className="text-sm text-green-600 mt-1">
                        Cambio: Bs. {(montoRecibido - calcularTotal()).toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Button 
                onClick={procesarVenta} 
                className="w-full" 
                size="lg"
                disabled={carrito.length === 0}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Procesar Venta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal del Ticket */}
      <Dialog open={showTicket} onOpenChange={setShowTicket}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ticket de Venta</DialogTitle>
          </DialogHeader>
          
          {ultimaVenta && (
            <div className="space-y-4 text-sm">
              <div className="text-center border-b pb-2">
                <h3 className="font-bold">SISTEMA CONTABLE</h3>
                <p>Ticket: {ultimaVenta.numero}</p>
                <p>{ultimaVenta.fecha} - {ultimaVenta.hora}</p>
              </div>

              <div>
                <p><strong>Cliente:</strong> {ultimaVenta.cliente.nombre}</p>
                <p><strong>NIT:</strong> {ultimaVenta.cliente.nit}</p>
              </div>

              <div className="space-y-1">
                {ultimaVenta.items.map((item: ItemVenta, index: number) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p>{item.producto.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.cantidad} x Bs. {item.precioUnitario.toFixed(2)}
                      </p>
                    </div>
                    <p>Bs. {item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>TOTAL:</span>
                  <span>Bs. {ultimaVenta.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recibido:</span>
                  <span>Bs. {ultimaVenta.montoRecibido.toFixed(2)}</span>
                </div>
                {ultimaVenta.cambio > 0 && (
                  <div className="flex justify-between">
                    <span>Cambio:</span>
                    <span>Bs. {ultimaVenta.cambio.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-muted-foreground border-t pt-2">
                <p>¡Gracias por su compra!</p>
              </div>

              <Button onClick={imprimirTicket} className="w-full">
                <Receipt className="w-4 h-4 mr-2" />
                Imprimir Ticket
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PuntoVentaModule;