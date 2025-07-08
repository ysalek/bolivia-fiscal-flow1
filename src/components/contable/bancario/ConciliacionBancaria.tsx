
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle, Upload, Download, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";

interface MovimientoBancario {
  id: string;
  fecha: string;
  descripcion: string;
  referencia: string;
  debito: number;
  credito: number;
  saldo: number;
  conciliado: boolean;
  tipo: 'deposito' | 'retiro' | 'transferencia' | 'interes' | 'comision' | 'otros';
}

interface MovimientoContable {
  id: string;
  fecha: string;
  concepto: string;
  referencia: string;
  debe: number;
  haber: number;
  conciliado: boolean;
}

const ConciliacionBancaria = () => {
  const { toast } = useToast();
  const { guardarAsiento } = useContabilidadIntegration();
  
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("");
  const [fechaConciliacion, setFechaConciliacion] = useState(new Date().toISOString().slice(0, 10));
  const [saldoInicialLibros, setSaldoInicialLibros] = useState(0);
  const [saldoFinalBanco, setSaldoFinalBanco] = useState(0);
  
  const [movimientosBanco, setMovimientosBanco] = useState<MovimientoBancario[]>([]);
  const [movimientosContables, setMovimientosContables] = useState<MovimientoContable[]>([]);
  const [diferencias, setDiferencias] = useState<any[]>([]);
  
  const [nuevoAjuste, setNuevoAjuste] = useState({
    concepto: "",
    monto: 0,
    tipo: "debe" as "debe" | "haber"
  });

  // Datos demo para movimientos bancarios
  useEffect(() => {
    const movimientosDemo: MovimientoBancario[] = [
      {
        id: "1",
        fecha: "2024-01-15",
        descripcion: "Deposito Cliente Juan Perez",
        referencia: "DEP001",
        debito: 0,
        credito: 15000,
        saldo: 85000,
        conciliado: false,
        tipo: "deposito"
      },
      {
        id: "2",
        fecha: "2024-01-16",
        descripcion: "Pago Proveedor ABC",
        referencia: "CHQ123",
        debito: 8500,
        credito: 0,
        saldo: 76500,
        conciliado: false,
        tipo: "retiro"
      },
      {
        id: "3",
        fecha: "2024-01-17",
        descripcion: "Comision Bancaria",
        referencia: "COM001",
        debito: 25,
        credito: 0,
        saldo: 76475,
        conciliado: false,
        tipo: "comision"
      }
    ];
    setMovimientosBanco(movimientosDemo);

    // Movimientos contables demo
    const contablesDemo: MovimientoContable[] = [
      {
        id: "1",
        fecha: "2024-01-15",
        concepto: "Cobro a cliente",
        referencia: "FAC001",
        debe: 15000,
        haber: 0,
        conciliado: false
      },
      {
        id: "2",
        fecha: "2024-01-16",
        concepto: "Pago a proveedor",
        referencia: "CMP001",
        debe: 0,
        haber: 8500,
        conciliado: false
      }
    ];
    setMovimientosContables(contablesDemo);
  }, []);

  const conciliarMovimiento = (movimientoBanco: MovimientoBancario, movimientoContable: MovimientoContable) => {
    // Marcar como conciliados
    setMovimientosBanco(prev => 
      prev.map(m => m.id === movimientoBanco.id ? { ...m, conciliado: true } : m)
    );
    setMovimientosContables(prev => 
      prev.map(m => m.id === movimientoContable.id ? { ...m, conciliado: true } : m)
    );
    
    toast({
      title: "Movimiento conciliado",
      description: "Los movimientos han sido conciliados correctamente"
    });
  };

  const agregarAjuste = () => {
    if (!nuevoAjuste.concepto || nuevoAjuste.monto <= 0) {
      toast({
        title: "Error",
        description: "Complete todos los campos del ajuste",
        variant: "destructive"
      });
      return;
    }

    // Generar asiento de ajuste
    const asientoAjuste = {
      id: Date.now().toString(),
      numero: `AJB-${Date.now().toString().slice(-6)}`,
      fecha: fechaConciliacion,
      concepto: `Ajuste bancario: ${nuevoAjuste.concepto}`,
      referencia: `CONC-${fechaConciliacion}`,
      debe: nuevoAjuste.tipo === "debe" ? nuevoAjuste.monto : 0,
      haber: nuevoAjuste.tipo === "haber" ? nuevoAjuste.monto : 0,
      estado: "registrado" as const,
      cuentas: [
        {
          codigo: "1111",
          nombre: "Bancos",
          debe: nuevoAjuste.tipo === "debe" ? nuevoAjuste.monto : 0,
          haber: nuevoAjuste.tipo === "haber" ? nuevoAjuste.monto : 0
        },
        {
          codigo: nuevoAjuste.tipo === "debe" ? "4999" : "5999",
          nombre: nuevoAjuste.tipo === "debe" ? "Otros Ingresos" : "Otros Gastos",
          debe: nuevoAjuste.tipo === "haber" ? nuevoAjuste.monto : 0,
          haber: nuevoAjuste.tipo === "debe" ? nuevoAjuste.monto : 0
        }
      ]
    };

    guardarAsiento(asientoAjuste);
    setNuevoAjuste({ concepto: "", monto: 0, tipo: "debe" });
    
    toast({
      title: "Asiento de ajuste creado",
      description: "El ajuste bancario ha sido registrado"
    });
  };

  const calcularEstadoConciliacion = () => {
    const movimientosBancoNoConciliados = movimientosBanco.filter(m => !m.conciliado);
    const movimientosContablesNoConciliados = movimientosContables.filter(m => !m.conciliado);
    
    const creditosBanco = movimientosBancoNoConciliados.reduce((sum, m) => sum + m.credito, 0);
    const debitosBanco = movimientosBancoNoConciliados.reduce((sum, m) => sum + m.debito, 0);
    const debeContable = movimientosContablesNoConciliados.reduce((sum, m) => sum + m.debe, 0);
    const haberContable = movimientosContablesNoConciliados.reduce((sum, m) => sum + m.haber, 0);

    return {
      saldoConciliado: saldoInicialLibros + creditosBanco - debitosBanco,
      diferencia: Math.abs((saldoInicialLibros + debeContable - haberContable) - saldoFinalBanco),
      movimientosPendientes: movimientosBancoNoConciliados.length + movimientosContablesNoConciliados.length
    };
  };

  const estadoConciliacion = calcularEstadoConciliacion();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Conciliación Bancaria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="cuenta">Cuenta Bancaria</Label>
              <Select value={cuentaSeleccionada} onValueChange={setCuentaSeleccionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bcp-corriente">BCP - Cuenta Corriente</SelectItem>
                  <SelectItem value="bnb-ahorro">BNB - Cuenta Ahorro</SelectItem>
                  <SelectItem value="mercantil-corriente">Mercantil - Corriente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fecha">Fecha Conciliación</Label>
              <Input
                type="date"
                value={fechaConciliacion}
                onChange={(e) => setFechaConciliacion(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="saldoLibros">Saldo Inicial Libros</Label>
              <Input
                type="number"
                value={saldoInicialLibros}
                onChange={(e) => setSaldoInicialLibros(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="saldoBanco">Saldo Final Banco</Label>
              <Input
                type="number"
                value={saldoFinalBanco}
                onChange={(e) => setSaldoFinalBanco(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Estado de la conciliación */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  Bs. {estadoConciliacion.saldoConciliado.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Saldo Conciliado</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${estadoConciliacion.diferencia === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Bs. {estadoConciliacion.diferencia.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Diferencia</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {estadoConciliacion.movimientosPendientes}
                </div>
                <div className="text-sm text-muted-foreground">Mov. Pendientes</div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="movimientos" className="space-y-4">
            <TabsList>
              <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
              <TabsTrigger value="ajustes">Asientos de Ajuste</TabsTrigger>
              <TabsTrigger value="reporte">Reporte Final</TabsTrigger>
            </TabsList>

            <TabsContent value="movimientos">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Movimientos Bancarios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estado de Cuenta Bancario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Débito</TableHead>
                          <TableHead>Crédito</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movimientosBanco.map((mov) => (
                          <TableRow key={mov.id} className={mov.conciliado ? "bg-green-50" : ""}>
                            <TableCell>{mov.fecha}</TableCell>
                            <TableCell>{mov.descripcion}</TableCell>
                            <TableCell>{mov.debito > 0 ? `Bs. ${mov.debito.toFixed(2)}` : ""}</TableCell>
                            <TableCell>{mov.credito > 0 ? `Bs. ${mov.credito.toFixed(2)}` : ""}</TableCell>
                            <TableCell>
                              <Badge variant={mov.conciliado ? "default" : "secondary"}>
                                {mov.conciliado ? "Conciliado" : "Pendiente"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Movimientos Contables */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Libro Mayor Contable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Concepto</TableHead>
                          <TableHead>Debe</TableHead>
                          <TableHead>Haber</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movimientosContables.map((mov) => (
                          <TableRow key={mov.id} className={mov.conciliado ? "bg-green-50" : ""}>
                            <TableCell>{mov.fecha}</TableCell>
                            <TableCell>{mov.concepto}</TableCell>
                            <TableCell>{mov.debe > 0 ? `Bs. ${mov.debe.toFixed(2)}` : ""}</TableCell>
                            <TableCell>{mov.haber > 0 ? `Bs. ${mov.haber.toFixed(2)}` : ""}</TableCell>
                            <TableCell>
                              <Badge variant={mov.conciliado ? "default" : "secondary"}>
                                {mov.conciliado ? "Conciliado" : "Pendiente"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ajustes">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Asiento de Ajuste</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="concepto">Concepto del Ajuste</Label>
                      <Input
                        placeholder="Ej: Comisión bancaria no registrada"
                        value={nuevoAjuste.concepto}
                        onChange={(e) => setNuevoAjuste(prev => ({ ...prev, concepto: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="monto">Monto</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={nuevoAjuste.monto}
                        onChange={(e) => setNuevoAjuste(prev => ({ ...prev, monto: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select 
                        value={nuevoAjuste.tipo} 
                        onValueChange={(value: "debe" | "haber") => setNuevoAjuste(prev => ({ ...prev, tipo: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debe">Cargo al Banco</SelectItem>
                          <SelectItem value="haber">Abono al Banco</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={agregarAjuste} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Asiento de Ajuste
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reporte">
              <Card>
                <CardHeader>
                  <CardTitle>Reporte de Conciliación Bancaria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded">
                      <span>Saldo según Libros:</span>
                      <span className="font-bold">Bs. {saldoInicialLibros.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded">
                      <span>Saldo según Banco:</span>
                      <span className="font-bold">Bs. {saldoFinalBanco.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between items-center p-4 rounded ${estadoConciliacion.diferencia === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <span>Diferencia:</span>
                      <span className="font-bold">Bs. {estadoConciliacion.diferencia.toFixed(2)}</span>
                    </div>
                    {estadoConciliacion.diferencia === 0 && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Conciliación Bancaria Completada</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConciliacionBancaria;
