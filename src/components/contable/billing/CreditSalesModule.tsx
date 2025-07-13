import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import { CreditCard, Plus, Eye, DollarSign } from 'lucide-react';

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
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

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
        <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Venta a Crédito
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Registrar Venta a Crédito</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente: any) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fecha de Vencimiento</Label>
                  <Input type="date" />
                </div>
              </div>
              {/* Aquí iría el formulario completo para productos */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowNewForm(false)}>
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
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
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
    </div>
  );
};

export default CreditSalesModule;