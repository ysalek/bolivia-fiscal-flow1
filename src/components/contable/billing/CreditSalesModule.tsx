import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import { CreditCard, Plus, Eye, DollarSign, Trash2 } from 'lucide-react';
import ProductSearchCombobox from '@/components/contable/billing/ProductSearchCombobox';

interface VentaCredito {
  id: string;
  clienteId: string;
  clienteNombre: string;
  productos: {
    id: string;
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
  }[];
  total: number;
  fecha: string;
  fechaVencimiento: string;
  estado: 'pendiente' | 'pagado' | 'vencido';
  montoAbonado: number;
  saldoPendiente: number;
  observaciones: string;
}

const CreditSalesModule = () => {
  const { toast } = useToast();
  const { guardarAsiento } = useContabilidadIntegration();
  const [ventasCredito, setVentasCredito] = useState<VentaCredito[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  
  // Formulario nueva venta
  const [formClienteId, setFormClienteId] = useState<string>("");
  const [fechaVenc, setFechaVenc] = useState<string>("");
  const [itemProductoId, setItemProductoId] = useState<string>("");
  const [itemCantidad, setItemCantidad] = useState<number>(1);
  const [itemPrecio, setItemPrecio] = useState<number>(0);
  const [items, setItems] = useState<Array<{ id: string; nombre: string; cantidad: number; precio: number; subtotal: number }>>([]);
  const [observaciones, setObservaciones] = useState<string>("");
  
  // Dialogos auxiliares
  const [ventaDetalle, setVentaDetalle] = useState<VentaCredito | null>(null);
  const [pagoVenta, setPagoVenta] = useState<VentaCredito | null>(null);
  const [montoPago, setMontoPago] = useState<number>(0);

  useEffect(() => {
    // Cargar datos del localStorage
    const ventasCreditoGuardadas = localStorage.getItem('ventasCredito');
    if (ventasCreditoGuardadas) setVentasCredito(JSON.parse(ventasCreditoGuardadas));

    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) setClientes(JSON.parse(clientesGuardados));

    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) setProductos(JSON.parse(productosGuardados));
  }, []);

  const crearVentaCredito = (ventaData: any) => {
    const nuevaVenta: VentaCredito = {
      id: `vc-${Date.now()}`,
      ...ventaData,
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'pendiente',
      montoAbonado: 0,
      saldoPendiente: ventaData.total
    };

    // Generar asiento contable para venta a crédito
    const asientoVenta = {
      id: `asiento-${Date.now()}`,
      numero: `VC-${Date.now()}`,
      fecha: nuevaVenta.fecha,
      concepto: `Venta a crédito - ${nuevaVenta.clienteNombre}`,
      referencia: `Venta Crédito ${nuevaVenta.id}`,
      estado: 'registrado' as const,
      debe: nuevaVenta.total,
      haber: nuevaVenta.total,
      cuentas: [
        {
          codigo: '1131',
          nombre: 'Cuentas por Cobrar',
          debe: nuevaVenta.total,
          haber: 0
        },
        {
          codigo: '4111',
          nombre: 'Ventas',
          debe: 0,
          haber: nuevaVenta.total
        }
      ]
    };

    guardarAsiento(asientoVenta);

    const nuevasVentas = [nuevaVenta, ...ventasCredito];
    setVentasCredito(nuevasVentas);
    localStorage.setItem('ventasCredito', JSON.stringify(nuevasVentas));

    toast({
      title: "Venta a Crédito Registrada",
      description: `Venta por Bs. ${nuevaVenta.total.toFixed(2)} registrada correctamente`,
    });

    setShowNewForm(false);
  };

  const ventasPendientes = ventasCredito.filter(v => v.estado === 'pendiente');
  const totalCuentasPorCobrar = ventasPendientes.reduce((sum, v) => sum + v.saldoPendiente, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ventas a Crédito</h2>
          <p className="text-muted-foreground">Gestión de ventas al crédito y cuentas por cobrar</p>
        </div>
        <Dialog open={showNewForm} onOpenChange={(open) => {
          setShowNewForm(open);
          if (!open) {
            setFormClienteId("");
            setFechaVenc("");
            setItemProductoId("");
            setItemCantidad(1);
            setItemPrecio(0);
            setItems([]);
            setObservaciones("");
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Venta a Crédito
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Registrar Venta a Crédito</DialogTitle>
              <DialogDescription>Seleccione cliente, agregue productos y registre la venta al crédito.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <Select value={formClienteId} onValueChange={(v) => setFormClienteId(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fecha de Vencimiento</Label>
                  <Input type="date" value={fechaVenc} onChange={(e) => setFechaVenc(e.target.value)} />
                </div>
                <div>
                  <Label>Observaciones</Label>
                  <Input value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Opcional" />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                  <div className="md:col-span-3">
                    <Label>Producto</Label>
                    <ProductSearchCombobox productos={productos} value={itemProductoId} onChange={(id) => {
                      setItemProductoId(id);
                      const p = productos.find((x: any) => x.id === id);
                      setItemPrecio(p?.precioVenta || 0);
                    }} />
                  </div>
                  <div>
                    <Label>Cantidad</Label>
                    <Input type="number" min={1} value={itemCantidad} onChange={(e) => setItemCantidad(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Precio</Label>
                    <Input type="number" min={0} value={itemPrecio} onChange={(e) => setItemPrecio(Number(e.target.value))} />
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        const p = productos.find((x: any) => x.id === itemProductoId);
                        if (!p) return;
                        const nuevo = {
                          id: p.id,
                          nombre: p.nombre,
                          cantidad: itemCantidad,
                          precio: itemPrecio,
                          subtotal: itemCantidad * itemPrecio
                        };
                        setItems((prev) => [nuevo, ...prev]);
                        setItemProductoId("");
                        setItemCantidad(1);
                        setItemPrecio(0);
                      }}
                      disabled={!itemProductoId || itemCantidad <= 0 || itemPrecio <= 0}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{it.nombre}</TableCell>
                        <TableCell className="text-right">{it.cantidad}</TableCell>
                        <TableCell className="text-right">Bs. {it.precio.toFixed(2)}</TableCell>
                        <TableCell className="text-right">Bs. {it.subtotal.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">Sin productos</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="flex justify-end gap-8 pt-2">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-2xl font-bold">Bs. {items.reduce((s, i) => s + i.subtotal, 0).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 justify-end">
                <Button
                  onClick={() => {
                    if (!formClienteId || !fechaVenc || items.length === 0) {
                      toast({ title: 'Datos incompletos', description: 'Complete cliente, vencimiento y al menos un producto', variant: 'destructive' });
                      return;
                    }
                    const clienteSel = clientes.find((c: any) => c.id === formClienteId);
                    const ventaData = {
                      clienteId: formClienteId,
                      clienteNombre: clienteSel?.nombre || 'Cliente',
                      productos: items,
                      total: items.reduce((s, i) => s + i.subtotal, 0),
                      fechaVencimiento: fechaVenc,
                      observaciones
                    };
                    crearVentaCredito(ventaData);
                  }}
                >
                  Registrar Venta
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total por Cobrar</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {totalCuentasPorCobrar.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{ventasPendientes.length} ventas pendientes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ventas a Crédito</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Saldo Pendiente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventasCredito.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell className="font-medium">{venta.clienteNombre}</TableCell>
                  <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(venta.fechaVencimiento).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">Bs. {venta.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">Bs. {venta.saldoPendiente.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={venta.estado === 'pendiente' ? 'secondary' : venta.estado === 'pagado' ? 'default' : 'destructive'}>
                      {venta.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setVentaDetalle(venta)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setPagoVenta(venta); setMontoPago(venta.saldoPendiente); }}>
                        <DollarSign className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {ventasCredito.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay ventas a crédito registradas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogo Detalle Venta */}
      <Dialog open={!!ventaDetalle} onOpenChange={(o) => !o && setVentaDetalle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Venta a Crédito</DialogTitle>
            <DialogDescription>Revise los productos y el estado de la cuenta por cobrar.</DialogDescription>
          </DialogHeader>
          {ventaDetalle && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Cliente:</strong> {ventaDetalle.clienteNombre}</div>
                <div><strong>Fecha:</strong> {new Date(ventaDetalle.fecha).toLocaleDateString()}</div>
                <div><strong>Vence:</strong> {new Date(ventaDetalle.fechaVencimiento).toLocaleDateString()}</div>
                <div><strong>Estado:</strong> {ventaDetalle.estado}</div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cant.</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ventaDetalle.productos.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{p.nombre}</TableCell>
                      <TableCell className="text-right">{p.cantidad}</TableCell>
                      <TableCell className="text-right">Bs. {p.precio.toFixed(2)}</TableCell>
                      <TableCell className="text-right">Bs. {p.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right pt-2">
                <div><strong>Total:</strong> Bs. {ventaDetalle.total.toFixed(2)}</div>
                <div><strong>Abonado:</strong> Bs. {ventaDetalle.montoAbonado.toFixed(2)}</div>
                <div><strong>Saldo:</strong> Bs. {ventaDetalle.saldoPendiente.toFixed(2)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialogo Registrar Pago */}
      <Dialog open={!!pagoVenta} onOpenChange={(o) => !o && setPagoVenta(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Cobro</DialogTitle>
            <DialogDescription>Registre el cobro para la venta a crédito seleccionada.</DialogDescription>
          </DialogHeader>
          {pagoVenta && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Saldo actual: Bs. {pagoVenta.saldoPendiente.toFixed(2)}</div>
              <div>
                <Label>Monto a cobrar</Label>
                <Input type="number" min={0} max={pagoVenta.saldoPendiente} value={montoPago} onChange={(e) => setMontoPago(Number(e.target.value))} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setPagoVenta(null)}>Cancelar</Button>
                <Button onClick={() => {
                  const monto = Math.min(montoPago, pagoVenta.saldoPendiente);
                  const actualizadas = ventasCredito.map(v => {
                    if (v.id !== pagoVenta.id) return v;
                    const nuevoAbono = v.montoAbonado + monto;
                    const nuevoSaldo = v.saldoPendiente - monto;
                    const nuevoEstado: VentaCredito['estado'] = nuevoSaldo <= 0 ? 'pagado' : (new Date(v.fechaVencimiento) < new Date() ? 'vencido' : 'pendiente');
                    return { ...v, montoAbonado: nuevoAbono, saldoPendiente: nuevoSaldo, estado: nuevoEstado };
                  });
                  setVentasCredito(actualizadas);
                  localStorage.setItem('ventasCredito', JSON.stringify(actualizadas));

                  // Asiento contable del cobro: Caja (1111) a Cuentas por Cobrar (1131)
                  const asientoCobro = {
                    id: `asiento-${Date.now()}`,
                    numero: `COBRO-${Date.now()}`,
                    fecha: new Date().toISOString().slice(0,10),
                    concepto: `Cobro venta crédito - ${pagoVenta.clienteNombre}`,
                    referencia: `Cobro ${pagoVenta.id}`,
                    estado: 'registrado' as const,
                    debe: monto,
                    haber: monto,
                    cuentas: [
                      { codigo: '1111', nombre: 'Caja', debe: monto, haber: 0 },
                      { codigo: '1131', nombre: 'Cuentas por Cobrar', debe: 0, haber: monto }
                    ]
                  };
                  guardarAsiento(asientoCobro);

                  setPagoVenta(null);
                  toast({ title: 'Cobro registrado', description: `Se registró un cobro de Bs. ${monto.toFixed(2)}` });
                }}>Registrar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fin módulo */}
    </div>
  );
};

export default CreditSalesModule;
