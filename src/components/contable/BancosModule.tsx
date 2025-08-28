import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { useSupabaseBancos } from "@/hooks/useSupabaseBancos";
import { Building2, Plus, CreditCard, TrendingUp, DollarSign, ArrowUpDown } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type CuentaBancaria = Database['public']['Tables']['cuentas_bancarias']['Row'];
type MovimientoBancario = Database['public']['Tables']['movimientos_bancarios']['Row'];

const BancosModule = () => {
  const [selectedCuenta, setSelectedCuenta] = useState<CuentaBancaria | null>(null);
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [showNewMovement, setShowNewMovement] = useState(false);
  const { toast } = useToast();
  const { guardarAsiento } = useContabilidadIntegration();
  const {
    cuentasBancarias: cuentas,
    movimientosBancarios: movimientos,
    loading,
    createCuentaBancaria,
    updateCuentaBancaria,
    createMovimientoBancario,
    refetch
  } = useSupabaseBancos();

  const guardarCuenta = async (nuevaCuenta: any) => {
    try {
      const cuentaData = {
        banco: nuevaCuenta.banco,
        numero_cuenta: nuevaCuenta.numeroCuenta,
        tipo_cuenta: nuevaCuenta.tipoCuenta,
        nombre: nuevaCuenta.nombre,
        moneda: nuevaCuenta.moneda,
        saldo: nuevaCuenta.saldo || 0,
        activa: true
      };
      
      const cuenta = await createCuentaBancaria(cuentaData);
      
      toast({
        title: "Cuenta bancaria agregada",
        description: `${cuenta.banco} - ${cuenta.numero_cuenta}`,
      });
      
      setShowNewAccount(false);
    } catch (error) {
      toast({
        title: "Error al crear cuenta",
        description: "No se pudo crear la cuenta bancaria",
        variant: "destructive"
      });
    }
  };

  const guardarMovimiento = async (nuevoMovimiento: any) => {
    try {
      const movimientoData = {
        cuenta_bancaria_id: nuevoMovimiento.cuentaId,
        tipo: nuevoMovimiento.tipo,
        fecha: nuevoMovimiento.fecha,
        descripcion: nuevoMovimiento.descripcion,
        monto: nuevoMovimiento.monto,
        beneficiario: nuevoMovimiento.beneficiario,
        numero_comprobante: nuevoMovimiento.numeroComprobante,
        saldo_anterior: selectedCuenta?.saldo || 0,
        saldo_actual: (selectedCuenta?.saldo || 0) + (nuevoMovimiento.tipo === 'ingreso' ? nuevoMovimiento.monto : -nuevoMovimiento.monto)
      };
      
      await createMovimientoBancario(movimientoData);
      
      // Actualizar saldo de la cuenta
      if (selectedCuenta) {
        await updateCuentaBancaria(selectedCuenta.id, {
          saldo: movimientoData.saldo_actual
        });
      }
      
      // Generar asiento contable
      const asiento = {
        id: Date.now().toString(),
        numero: `BCO-${Date.now().toString().slice(-6)}`,
        fecha: nuevoMovimiento.fecha,
        concepto: `${nuevoMovimiento.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} bancario - ${nuevoMovimiento.descripcion}`,
        referencia: `${selectedCuenta?.banco} - ${nuevoMovimiento.numeroComprobante}`,
        debe: nuevoMovimiento.monto,
        haber: nuevoMovimiento.monto,
        estado: 'registrado' as const,
        cuentas: nuevoMovimiento.tipo === 'ingreso' ? [
          {
            codigo: "1112",
            nombre: "Bancos",
            debe: nuevoMovimiento.monto,
            haber: 0
          },
          {
            codigo: "4111",
            nombre: "Ingresos por Ventas",
            debe: 0,
            haber: nuevoMovimiento.monto
          }
        ] : [
          {
            codigo: "5111",
            nombre: "Gastos Operativos",
            debe: nuevoMovimiento.monto,
            haber: 0
          },
          {
            codigo: "1112",
            nombre: "Bancos",
            debe: 0,
            haber: nuevoMovimiento.monto
          }
        ]
      };

      guardarAsiento(asiento);
      
      toast({
        title: "Movimiento registrado",
        description: `${nuevoMovimiento.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} por Bs. ${nuevoMovimiento.monto}`,
      });
      
      setShowNewMovement(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error al registrar movimiento",
        description: "No se pudo registrar el movimiento bancario",
        variant: "destructive"
      });
    }
  };

  const totalSaldos = cuentas.reduce((sum, c) => sum + (c.saldo || 0), 0);
  const cuentasActivas = cuentas.filter(c => c.activa).length;
  const movimientosHoy = movimientos.filter(m => 
    new Date(m.fecha).toDateString() === new Date().toDateString()
  ).length;

  if (loading) {
    return <div className="flex items-center justify-center p-8">Cargando información bancaria...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Bancos</h2>
            <p className="text-slate-600">
              Gestión de cuentas bancarias y movimientos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewAccount} onOpenChange={setShowNewAccount}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cuenta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Cuenta Bancaria</DialogTitle>
                <DialogDescription>
                  Registre una nueva cuenta bancaria
                </DialogDescription>
              </DialogHeader>
              <NewAccountForm onSave={guardarCuenta} onCancel={() => setShowNewAccount(false)} />
            </DialogContent>
          </Dialog>
          
          {selectedCuenta && (
            <Dialog open={showNewMovement} onOpenChange={setShowNewMovement}>
              <DialogTrigger asChild>
                <Button>
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Nuevo Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Movimiento</DialogTitle>
                  <DialogDescription>
                    Registrar movimiento en {selectedCuenta.banco}
                  </DialogDescription>
                </DialogHeader>
                <NewMovementForm 
                  cuenta={selectedCuenta} 
                  onSave={guardarMovimiento} 
                  onCancel={() => setShowNewMovement(false)} 
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Saldo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {totalSaldos.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">En todas las cuentas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Cuentas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cuentasActivas}</div>
            <p className="text-sm text-muted-foreground">Cuentas disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Movimientos Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movimientosHoy}</div>
            <p className="text-sm text-muted-foreground">Transacciones registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              Total Movimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movimientos.length}</div>
            <p className="text-sm text-muted-foreground">Historial completo</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cuentas" className="w-full">
        <TabsList>
          <TabsTrigger value="cuentas">Cuentas Bancarias</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="cuentas">
          <Card>
            <CardHeader>
              <CardTitle>Cuentas Bancarias</CardTitle>
              <CardDescription>
                Gestión de cuentas bancarias de la empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banco</TableHead>
                    <TableHead>Número de Cuenta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Moneda</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cuentas.map(cuenta => (
                    <TableRow 
                      key={cuenta.id} 
                      className={selectedCuenta?.id === cuenta.id ? "bg-blue-50" : ""}
                    >
                      <TableCell className="font-medium">{cuenta.banco}</TableCell>
                      <TableCell>{cuenta.numero_cuenta}</TableCell>
                      <TableCell>{cuenta.tipo_cuenta}</TableCell>
                      <TableCell>{cuenta.moneda}</TableCell>
                      <TableCell className="text-right">
                        Bs. {cuenta.saldo?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={cuenta.activa ? 'default' : 'secondary'}>
                          {cuenta.activa ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={selectedCuenta?.id === cuenta.id ? "default" : "outline"}
                          onClick={() => setSelectedCuenta(cuenta as any)}
                        >
                          {selectedCuenta?.id === cuenta.id ? "Seleccionada" : "Seleccionar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimientos">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Bancarios</CardTitle>
              <CardDescription>
                Historial de transacciones bancarias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cuenta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientos
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .map(movimiento => {
                      const cuenta = cuentas.find(c => c.id === movimiento.cuenta_bancaria_id);
                      return (
                        <TableRow key={movimiento.id}>
                          <TableCell>{new Date(movimiento.fecha).toLocaleDateString('es-BO')}</TableCell>
                          <TableCell>{cuenta?.banco || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={movimiento.tipo === 'ingreso' ? 'default' : 'destructive'}>
                              {movimiento.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell>{movimiento.descripcion}</TableCell>
                          <TableCell className="text-right">
                            <span className={movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                              {movimiento.tipo === 'ingreso' ? '+' : '-'}Bs. {Math.abs(movimiento.monto).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            Bs. {movimiento.saldo_actual?.toFixed(2) || '0.00'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Componente para formulario de nueva cuenta
const NewAccountForm = ({ onSave, onCancel }: { 
  onSave: (cuenta: any) => void, 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState({
    banco: '',
    numeroCuenta: '',
    tipoCuenta: 'corriente',
    nombre: '',
    moneda: 'BOB',
    saldo: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="banco">Banco</Label>
        <Input
          id="banco"
          value={formData.banco}
          onChange={(e) => setFormData(prev => ({ ...prev, banco: e.target.value }))}
          placeholder="Nombre del banco"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeroCuenta">Número de Cuenta</Label>
        <Input
          id="numeroCuenta"
          value={formData.numeroCuenta}
          onChange={(e) => setFormData(prev => ({ ...prev, numeroCuenta: e.target.value }))}
          placeholder="Número de cuenta bancaria"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de Cuenta</Label>
          <Select value={formData.tipoCuenta} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoCuenta: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corriente">Corriente</SelectItem>
              <SelectItem value="ahorro">Ahorro</SelectItem>
              <SelectItem value="dolar">Dólares</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Moneda</Label>
          <Select value={formData.moneda} onValueChange={(value) => setFormData(prev => ({ ...prev, moneda: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BOB">Bolivianos</SelectItem>
              <SelectItem value="USD">Dólares</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la Cuenta</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          placeholder="Nombre descriptivo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="saldo">Saldo Inicial</Label>
        <Input
          id="saldo"
          type="number"
          step="0.01"
          value={formData.saldo}
          onChange={(e) => setFormData(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Crear Cuenta
        </Button>
      </div>
    </form>
  );
};

// Componente para formulario de nuevo movimiento
const NewMovementForm = ({ cuenta, onSave, onCancel }: { 
  cuenta: CuentaBancaria,
  onSave: (movimiento: any) => void, 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState({
    cuentaId: cuenta.id,
    tipo: 'ingreso',
    fecha: new Date().toISOString().slice(0, 10),
    descripcion: '',
    monto: 0,
    beneficiario: '',
    numeroComprobante: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo de Movimiento</Label>
        <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="egreso">Egreso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha</Label>
          <Input
            id="fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monto">Monto</Label>
          <Input
            id="monto"
            type="number"
            step="0.01"
            value={formData.monto}
            onChange={(e) => setFormData(prev => ({ ...prev, monto: parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Input
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
          placeholder="Concepto del movimiento"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="beneficiario">Beneficiario</Label>
        <Input
          id="beneficiario"
          value={formData.beneficiario}
          onChange={(e) => setFormData(prev => ({ ...prev, beneficiario: e.target.value }))}
          placeholder="Nombre del beneficiario"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeroComprobante">Número de Comprobante</Label>
        <Input
          id="numeroComprobante"
          value={formData.numeroComprobante}
          onChange={(e) => setFormData(prev => ({ ...prev, numeroComprobante: e.target.value }))}
          placeholder="Número de referencia"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Registrar Movimiento
        </Button>
      </div>
    </form>
  );
};

export default BancosModule;