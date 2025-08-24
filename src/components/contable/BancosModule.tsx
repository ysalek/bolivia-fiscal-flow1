import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { Building2, Plus, Upload, Download, ArrowUpDown, CheckCircle, AlertCircle, CreditCard, Banknote, TrendingUp, Activity } from "lucide-react";
import { EnhancedHeader, MetricGrid, EnhancedMetricCard, Section } from "./dashboard/EnhancedLayout";

interface CuentaBancaria {
  id: string;
  banco: string;
  numeroCuenta: string;
  tipoCuenta: 'corriente' | 'ahorro';
  moneda: 'BOB' | 'USD';
  saldoLibros: number;
  saldoEstado: number;
  fechaUltimaConciliacion: string;
  estado: 'activa' | 'inactiva';
}

interface MovimientoBancario {
  id: string;
  cuentaId: string;
  fecha: string;
  concepto: string;
  referencia: string;
  tipo: 'deposito' | 'retiro' | 'transferencia' | 'comision' | 'interes';
  monto: number;
  saldo: number;
  conciliado: boolean;
  asientoId?: string;
}

const bancosBolivianos = [
  'Banco Nacional de Bolivia',
  'Banco Mercantil Santa Cruz',
  'Banco de Crédito de Bolivia',
  'Banco Bisa',
  'Banco Ganadero',
  'Banco Económico',
  'Banco Fortaleza',
  'Banco Solidario',
  'Banco Pyme Ecofuturo',
  // Cooperativas de Ahorro y Crédito
  'Cooperativa de Ahorro y Crédito Jesús Nazareno',
  'Cooperativa de Ahorro y Crédito San Martín de Porres',
  'Cooperativa de Ahorro y Crédito Fatima',
  'Cooperativa de Ahorro y Crédito La Merced',
  'Cooperativa de Ahorro y Crédito Potosí',
  'Cooperativa de Ahorro y Crédito Univida',
  'Cooperativa de Ahorro y Crédito Coopnor',
  'Cooperativa de Ahorro y Crédito Mujeres en Desarrollo',
  'Cooperativa de Ahorro y Crédito Inti Raymi',
  'Cooperativa de Ahorro y Crédito Camiri'
];

const BancosModule = () => {
  const [cuentas, setCuentas] = useState<CuentaBancaria[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoBancario[]>([]);
  const [selectedCuenta, setSelectedCuenta] = useState<string>('');
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [showNewMovement, setShowNewMovement] = useState(false);
  const { toast } = useToast();
  const { guardarAsiento } = useContabilidadIntegration();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const cuentasGuardadas = localStorage.getItem('cuentasBancarias');
    if (cuentasGuardadas) {
      setCuentas(JSON.parse(cuentasGuardadas));
    } else {
      // Crear cuenta de ejemplo
      const cuentasIniciales: CuentaBancaria[] = [
        {
          id: '1',
          banco: 'Banco Nacional de Bolivia',
          numeroCuenta: '10000012345',
          tipoCuenta: 'corriente',
          moneda: 'BOB',
          saldoLibros: 25000.00,
          saldoEstado: 24850.00,
          fechaUltimaConciliacion: new Date().toISOString().slice(0, 10),
          estado: 'activa'
        }
      ];
      setCuentas(cuentasIniciales);
      localStorage.setItem('cuentasBancarias', JSON.stringify(cuentasIniciales));
    }

    const movimientosGuardados = localStorage.getItem('movimientosBancarios');
    if (movimientosGuardados) {
      setMovimientos(JSON.parse(movimientosGuardados));
    }
  };

  const guardarCuenta = (nuevaCuenta: Omit<CuentaBancaria, 'id'>) => {
    const cuenta: CuentaBancaria = {
      ...nuevaCuenta,
      id: Date.now().toString()
    };
    
    const nuevasCuentas = [...cuentas, cuenta];
    setCuentas(nuevasCuentas);
    localStorage.setItem('cuentasBancarias', JSON.stringify(nuevasCuentas));
    
    toast({
      title: "Cuenta bancaria agregada",
      description: `${cuenta.banco} - ${cuenta.numeroCuenta}`,
    });
    
    setShowNewAccount(false);
  };

  const registrarMovimiento = (movimiento: Omit<MovimientoBancario, 'id'>) => {
    const nuevoMovimiento: MovimientoBancario = {
      ...movimiento,
      id: Date.now().toString()
    };

    const nuevosMovimientos = [nuevoMovimiento, ...movimientos];
    setMovimientos(nuevosMovimientos);
    localStorage.setItem('movimientosBancarios', JSON.stringify(nuevosMovimientos));

    // Generar asiento contable automático
    const asiento = {
      id: Date.now().toString(),
      numero: `BCO-${Date.now().toString().slice(-6)}`,
      fecha: movimiento.fecha,
      concepto: `${movimiento.tipo} bancario - ${movimiento.concepto}`,
      referencia: movimiento.referencia,
      debe: movimiento.tipo === 'deposito' ? movimiento.monto : 0,
      haber: movimiento.tipo === 'retiro' ? movimiento.monto : 0,
      estado: 'registrado' as const,
      cuentas: [
        {
          codigo: "1111",
          nombre: "Caja y Bancos",
          debe: movimiento.tipo === 'deposito' ? movimiento.monto : 0,
          haber: movimiento.tipo === 'retiro' ? movimiento.monto : 0
        },
        {
          codigo: movimiento.tipo === 'deposito' ? "1131" : "5211",
          nombre: movimiento.tipo === 'deposito' ? "Cuentas por Cobrar" : "Gastos Bancarios",
          debe: movimiento.tipo === 'retiro' ? movimiento.monto : 0,
          haber: movimiento.tipo === 'deposito' ? movimiento.monto : 0
        }
      ]
    };

    guardarAsiento(asiento);

    toast({
      title: "Movimiento registrado",
      description: "El movimiento bancario y su asiento contable han sido registrados",
    });

    setShowNewMovement(false);
  };

  const conciliarMovimiento = (movimientoId: string) => {
    const movimientosActualizados = movimientos.map(m => 
      m.id === movimientoId ? { ...m, conciliado: true } : m
    );
    setMovimientos(movimientosActualizados);
    localStorage.setItem('movimientosBancarios', JSON.stringify(movimientosActualizados));
    
    toast({
      title: "Movimiento conciliado",
      description: "El movimiento ha sido marcado como conciliado",
    });
  };

  const cuentaSeleccionada = cuentas.find(c => c.id === selectedCuenta);
  const movimientosCuenta = movimientos.filter(m => m.cuentaId === selectedCuenta);
  const movimientosPendientes = movimientosCuenta.filter(m => !m.conciliado);
  
  const totalSaldoLibros = cuentas.reduce((sum, c) => sum + c.saldoLibros, 0);
  const totalSaldoEstados = cuentas.reduce((sum, c) => sum + c.saldoEstado, 0);
  const diferenciasTotal = Math.abs(totalSaldoLibros - totalSaldoEstados);
  const cuentasActivas = cuentas.filter(c => c.estado === 'activa').length;

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <EnhancedHeader
        title="Control Bancario Avanzado"
        subtitle="Conciliación bancaria automática y gestión integral de cuentas financieras"
        badge={{
          text: `${cuentas.length} Cuentas Registradas`,
          variant: "default"
        }}
        actions={
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
                <DialogTitle>Agregar Cuenta Bancaria</DialogTitle>
                <DialogDescription>
                  Registre una nueva cuenta bancaria para conciliación
                </DialogDescription>
              </DialogHeader>
              <NewAccountForm onSave={guardarCuenta} onCancel={() => setShowNewAccount(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewMovement} onOpenChange={setShowNewMovement}>
            <DialogTrigger asChild>
              <Button disabled={!selectedCuenta}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Movimiento Bancario</DialogTitle>
                <DialogDescription>
                  Registre un nuevo movimiento bancario
                </DialogDescription>
              </DialogHeader>
              {selectedCuenta && (
                <NewMovementForm 
                  cuentaId={selectedCuenta} 
                  onSave={registrarMovimiento} 
                  onCancel={() => setShowNewMovement(false)} 
                />
              )}
            </DialogContent>
          </Dialog>
          </div>
        }
      />

      {/* Enhanced Metrics Section */}
      <Section 
        title="Métricas Bancarias" 
        subtitle="Indicadores financieros y estado de conciliación"
      >
        <MetricGrid columns={4}>
          <EnhancedMetricCard
            title="Cuentas Activas"
            value={cuentasActivas}
            subtitle={`${cuentas.length} total registradas`}
            icon={Building2}
            variant="default"
            trend="up"
            trendValue="Sistema bancario"
          />
          <EnhancedMetricCard
            title="Saldo Total Libros"
            value={`Bs. ${totalSaldoLibros.toLocaleString()}`}
            subtitle="Balance contable"
            icon={Banknote}
            variant="success"
            trend="up"
            trendValue="Posición financiera"
          />
          <EnhancedMetricCard
            title="Diferencias Pendientes"
            value={`Bs. ${diferenciasTotal.toFixed(2)}`}
            subtitle="Por conciliar"
            icon={AlertCircle}
            variant={diferenciasTotal > 0 ? "warning" : "success"}
            trend={diferenciasTotal > 0 ? "down" : "up"}
            trendValue={movimientosPendientes.length > 0 ? `${movimientosPendientes.length} mov.` : "Conciliado"}
          />
          <EnhancedMetricCard
            title="Movimientos Pendientes"
            value={movimientos.filter(m => !m.conciliado).length}
            subtitle="Requieren conciliación"
            icon={Activity}
            variant={movimientos.filter(m => !m.conciliado).length > 0 ? "warning" : "success"}
            trend={movimientos.filter(m => !m.conciliado).length > 0 ? "down" : "up"}
            trendValue="Control automático"
          />
        </MetricGrid>
      </Section>

      {/* Enhanced Bank Accounts Grid */}
      <Section 
        title="Cuentas Bancarias"
        subtitle="Selecciona una cuenta para ver sus movimientos y realizar conciliaciones"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cuentas.map(cuenta => (
            <Card 
              key={cuenta.id} 
              className={`cursor-pointer transition-all hover:shadow-lg glass-effect ${
                selectedCuenta === cuenta.id 
                  ? 'ring-2 ring-primary shadow-lg nav-gradient text-white' 
                  : 'hover:scale-105 hover:shadow-md'
              }`}
              onClick={() => setSelectedCuenta(cuenta.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-lg ${selectedCuenta === cuenta.id ? 'text-white' : ''}`}>
                      {cuenta.banco}
                    </CardTitle>
                    <CardDescription className={selectedCuenta === cuenta.id ? 'text-white/80' : ''}>
                      {cuenta.numeroCuenta}
                    </CardDescription>
                  </div>
                  <div className={`p-2 rounded-full ${selectedCuenta === cuenta.id ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <CreditCard className={`w-5 h-5 ${selectedCuenta === cuenta.id ? 'text-white' : 'text-primary'}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${selectedCuenta === cuenta.id ? 'text-white/90' : 'text-muted-foreground'}`}>
                      Saldo Libros:
                    </span>
                    <span className={`font-bold ${selectedCuenta === cuenta.id ? 'text-white' : 'text-foreground'}`}>
                      Bs. {cuenta.saldoLibros.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${selectedCuenta === cuenta.id ? 'text-white/90' : 'text-muted-foreground'}`}>
                      Saldo Estado:
                    </span>
                    <span className={`font-bold ${selectedCuenta === cuenta.id ? 'text-white' : 'text-foreground'}`}>
                      Bs. {cuenta.saldoEstado.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-opacity-20">
                    <span className={`text-sm font-medium ${selectedCuenta === cuenta.id ? 'text-white' : 'text-foreground'}`}>
                      Diferencia:
                    </span>
                    <Badge 
                      variant={Math.abs(cuenta.saldoLibros - cuenta.saldoEstado) < 0.01 ? "default" : "destructive"}
                      className="font-bold"
                    >
                      Bs. {Math.abs(cuenta.saldoLibros - cuenta.saldoEstado).toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center pt-2">
                    <Badge variant="outline" className={selectedCuenta === cuenta.id ? 'border-white/50 text-white' : ''}>
                      {cuenta.tipoCuenta.toUpperCase()} • {cuenta.moneda}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {cuentaSeleccionada && (
        <Section 
          title={`Movimientos Bancarios - ${cuentaSeleccionada.banco}`}
          subtitle={`${movimientosCuenta.length} movimientos registrados • ${movimientosPendientes.length} pendientes de conciliación`}
        >
          <Card className="card-gradient">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    Control de Movimientos
                  </CardTitle>
                  <CardDescription>
                    Cuenta: {cuentaSeleccionada.numeroCuenta} • Saldo actual: Bs. {cuentaSeleccionada.saldoLibros.toLocaleString()}
                  </CardDescription>
                </div>
                <Badge 
                  variant={movimientosPendientes.length === 0 ? "default" : "destructive"}
                  className="px-3 py-1"
                >
                  {movimientosPendientes.length === 0 ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Conciliado
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {movimientosPendientes.length} Pendientes
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimientosCuenta.map(movimiento => (
                  <TableRow key={movimiento.id}>
                    <TableCell>{new Date(movimiento.fecha).toLocaleDateString('es-BO')}</TableCell>
                    <TableCell>{movimiento.concepto}</TableCell>
                    <TableCell>{movimiento.referencia}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {movimiento.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={movimiento.tipo === 'deposito' ? 'text-green-600' : 'text-red-600'}>
                        {movimiento.tipo === 'deposito' ? '+' : '-'}Bs. {movimiento.monto.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">Bs. {movimiento.saldo.toFixed(2)}</TableCell>
                    <TableCell>
                      {movimiento.conciliado ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Conciliado
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!movimiento.conciliado && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => conciliarMovimiento(movimiento.id)}
                        >
                          Conciliar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </CardContent>
          </Card>
        </Section>
      )}
    </div>
  );
};

// Componente para formulario de nueva cuenta
const NewAccountForm = ({ onSave, onCancel }: { onSave: (cuenta: Omit<CuentaBancaria, 'id'>) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<Omit<CuentaBancaria, 'id'>>({
    banco: '',
    numeroCuenta: '',
    tipoCuenta: 'corriente',
    moneda: 'BOB',
    saldoLibros: 0,
    saldoEstado: 0,
    fechaUltimaConciliacion: new Date().toISOString().slice(0, 10),
    estado: 'activa'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="banco">Banco</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, banco: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un banco" />
          </SelectTrigger>
          <SelectContent>
            {bancosBolivianos.map(banco => (
              <SelectItem key={banco} value={banco}>{banco}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeroCuenta">Número de Cuenta</Label>
        <Input
          id="numeroCuenta"
          value={formData.numeroCuenta}
          onChange={(e) => setFormData(prev => ({ ...prev, numeroCuenta: e.target.value }))}
          placeholder="10000012345"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipoCuenta">Tipo de Cuenta</Label>
          <Select onValueChange={(value: 'corriente' | 'ahorro') => setFormData(prev => ({ ...prev, tipoCuenta: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corriente">Corriente</SelectItem>
              <SelectItem value="ahorro">Ahorro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="moneda">Moneda</Label>
          <Select onValueChange={(value: 'BOB' | 'USD') => setFormData(prev => ({ ...prev, moneda: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Moneda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BOB">Bolivianos</SelectItem>
              <SelectItem value="USD">Dólares</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="saldoLibros">Saldo en Libros</Label>
          <Input
            id="saldoLibros"
            type="number"
            step="0.01"
            value={formData.saldoLibros}
            onChange={(e) => setFormData(prev => ({ ...prev, saldoLibros: parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="saldoEstado">Saldo Estado Bancario</Label>
          <Input
            id="saldoEstado"
            type="number"
            step="0.01"
            value={formData.saldoEstado}
            onChange={(e) => setFormData(prev => ({ ...prev, saldoEstado: parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar Cuenta
        </Button>
      </div>
    </form>
  );
};

// Componente para formulario de nuevo movimiento
const NewMovementForm = ({ cuentaId, onSave, onCancel }: { 
  cuentaId: string, 
  onSave: (movimiento: Omit<MovimientoBancario, 'id'>) => void, 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState<Omit<MovimientoBancario, 'id'>>({
    cuentaId,
    fecha: new Date().toISOString().slice(0, 10),
    concepto: '',
    referencia: '',
    tipo: 'deposito',
    monto: 0,
    saldo: 0,
    conciliado: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <Label htmlFor="tipo">Tipo de Movimiento</Label>
          <Select onValueChange={(value: 'deposito' | 'retiro' | 'transferencia' | 'comision' | 'interes') => setFormData(prev => ({ ...prev, tipo: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deposito">Depósito</SelectItem>
              <SelectItem value="retiro">Retiro</SelectItem>
              <SelectItem value="transferencia">Transferencia</SelectItem>
              <SelectItem value="comision">Comisión</SelectItem>
              <SelectItem value="interes">Interés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="concepto">Concepto</Label>
        <Input
          id="concepto"
          value={formData.concepto}
          onChange={(e) => setFormData(prev => ({ ...prev, concepto: e.target.value }))}
          placeholder="Descripción del movimiento"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="referencia">Referencia</Label>
        <Input
          id="referencia"
          value={formData.referencia}
          onChange={(e) => setFormData(prev => ({ ...prev, referencia: e.target.value }))}
          placeholder="Número de cheque, transferencia, etc."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="saldo">Saldo Posterior</Label>
          <Input
            id="saldo"
            type="number"
            step="0.01"
            value={formData.saldo}
            onChange={(e) => setFormData(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>
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
