import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Plus, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseClientes } from '@/hooks/useSupabaseClientes';
import { useSupabaseProductos } from '@/hooks/useSupabaseProductos';
import ProductSearchCombobox from './ProductSearchCombobox';

interface ItemNotaEntrega {
  id: string;
  productoId: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
}

export const NotasEntregaModule = () => {
  const { toast } = useToast();
  const { clientes } = useSupabaseClientes();
  const { productos } = useSupabaseProductos();
  
  const [loading, setLoading] = useState(false);
  const [numero, setNumero] = useState(`NE-${Date.now().toString().slice(-6)}`);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [clienteId, setClienteId] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<ItemNotaEntrega[]>([]);

  const agregarItem = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    const nuevoItem: ItemNotaEntrega = {
      id: Date.now().toString(),
      productoId: producto.id,
      codigo: producto.codigo,
      descripcion: producto.nombre,
      cantidad: 1,
      costoUnitario: producto.costo_unitario || 0,
      costoTotal: producto.costo_unitario || 0
    };

    setItems([...items, nuevoItem]);
  };

  const actualizarCantidad = (itemId: string, cantidad: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const costoTotal = cantidad * item.costoUnitario;
        return { ...item, cantidad, costoTotal };
      }
      return item;
    }));
  };

  const eliminarItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const totalCosto = items.reduce((sum, item) => sum + item.costoTotal, 0);

  const generarAsientosContables = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const cliente = clientes.find(c => c.id === clienteId);
      if (!cliente) throw new Error('Cliente no encontrado');

      // Precio de venta estimado (30% margen)
      const precioVenta = totalCosto * 1.3;
      
      const numeroAsiento = `ASI-NE-${Date.now().toString().slice(-8)}`;

      // Crear asiento contable
      const asiento = {
        numero: numeroAsiento,
        fecha,
        concepto: `Nota de Entrega ${numero} - Cliente: ${cliente.nombre}`,
        referencia: numero,
        estado: 'registrado',
        user_id: user.id,
        debe: precioVenta + totalCosto,
        haber: precioVenta + totalCosto
      };

      const { data: asientoCreado, error: errorAsiento } = await supabase
        .from('asientos_contables')
        .insert([asiento])
        .select()
        .single();

      if (errorAsiento) throw errorAsiento;

      // Cuentas del asiento
      const cuentas = [
        {
          asiento_id: asientoCreado.id,
          codigo_cuenta: '1131',
          nombre_cuenta: 'Cuentas por Cobrar Clientes',
          debe: precioVenta,
          haber: 0
        },
        {
          asiento_id: asientoCreado.id,
          codigo_cuenta: '4111',
          nombre_cuenta: 'Ventas',
          debe: 0,
          haber: precioVenta
        },
        {
          asiento_id: asientoCreado.id,
          codigo_cuenta: '5111',
          nombre_cuenta: 'Costo de Mercadería Vendida',
          debe: totalCosto,
          haber: 0
        },
        {
          asiento_id: asientoCreado.id,
          codigo_cuenta: '1141',
          nombre_cuenta: 'Inventarios',
          debe: 0,
          haber: totalCosto
        }
      ];

      const { error: errorCuentas } = await supabase
        .from('cuentas_asientos')
        .insert(cuentas);

      if (errorCuentas) throw errorCuentas;

      // Actualizar stock y crear movimientos
      for (const item of items) {
        const producto = productos.find(p => p.id === item.productoId);
        if (producto) {
          const nuevoStock = (producto.stock_actual || 0) - item.cantidad;
          
          await supabase
            .from('productos')
            .update({ stock_actual: nuevoStock })
            .eq('id', item.productoId);

          await supabase
            .from('movimientos_inventario')
            .insert({
              user_id: user.id,
              producto_id: item.productoId,
              fecha,
              tipo: 'salida',
              cantidad: item.cantidad,
              stock_anterior: producto.stock_actual || 0,
              stock_actual: nuevoStock,
              costo_unitario: item.costoUnitario,
              observaciones: `Nota de Entrega ${numero}`
            });
        }
      }

      return true;
    } catch (error: any) {
      console.error('Error generando asientos:', error);
      throw error;
    }
  };

  const guardarNota = async () => {
    if (!clienteId) {
      toast({
        title: "Cliente requerido",
        description: "Debe seleccionar un cliente",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Sin productos",
        description: "Debe agregar al menos un producto",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await generarAsientosContables();
      
      // Resetear formulario
      setNumero(`NE-${Date.now().toString().slice(-6)}`);
      setFecha(new Date().toISOString().split('T')[0]);
      setClienteId('');
      setObservaciones('');
      setItems([]);

      toast({
        title: "✅ Nota de Entrega Guardada",
        description: "Se generaron automáticamente: Asientos contables y salida de inventario",
      });
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Nueva Nota de Entrega (Venta sin Factura)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Para ventas menores a Bs. 5 o cuando el cliente no requiere factura. El sistema genera automáticamente el registro contable.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Número</Label>
              <Input value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
            <div>
              <Label>Fecha</Label>
              <Input 
                type="date" 
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div>
              <Label>Cliente</Label>
              <select 
                className="w-full border rounded-md p-2"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} - {c.nit}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Agregar Producto</Label>
            <select 
              className="w-full border rounded-md p-2"
              onChange={(e) => {
                if (e.target.value) {
                  agregarItem(e.target.value);
                  e.target.value = '';
                }
              }}
            >
              <option value="">Seleccionar producto...</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.codigo} - {p.nombre} (Stock: {p.stock_actual || 0})
                </option>
              ))}
            </select>
          </div>

          {items.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="w-32">Cantidad</TableHead>
                    <TableHead className="text-right">Costo Unit.</TableHead>
                    <TableHead className="text-right">Costo Total</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.codigo}</TableCell>
                      <TableCell>{item.descripcion}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value) || 1)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        Bs. {item.costoUnitario.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        Bs. {item.costoTotal.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => eliminarItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div>
            <Label>Observaciones</Label>
            <Textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Observaciones adicionales..."
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold">
              Total Costo: Bs. {totalCosto.toFixed(2)}
            </div>
            <Button onClick={guardarNota} disabled={loading || items.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Nota de Entrega
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
