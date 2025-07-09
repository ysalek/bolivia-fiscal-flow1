import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { Plus, FileText, ArrowUpCircle, ArrowDownCircle, ArrowRightLeft, DollarSign, Eye, CheckCircle, AlertTriangle } from "lucide-react";
import ComprobanteForm from "./ComprobanteForm";
import ComprobantePreview from "./ComprobantePreview";

interface CuentaContable {
  codigo: string;
  nombre: string;
  debe: number;
  haber: number;
}

interface Comprobante {
  id: string;
  tipo: 'ingreso' | 'egreso' | 'traspaso';
  numero: string;
  fecha: string;
  concepto: string;
  beneficiario: string;
  monto: number;
  metodoPago: string;
  referencia: string;
  observaciones: string;
  estado: 'borrador' | 'autorizado' | 'anulado';
  creadoPor: string;
  fechaCreacion: string;
  cuentas: CuentaContable[];
  asientoGenerado?: boolean;
  asientoId?: string;
}

const ComprobantesIntegrados = () => {
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
  const [showComprobanteDialog, setShowComprobanteDialog] = useState<{
    open: boolean;
    tipo: 'ingreso' | 'egreso' | 'traspaso' | null;
  }>({ open: false, tipo: null });
  const [selectedComprobante, setSelectedComprobante] = useState<Comprobante | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [estadisticasIntegracion, setEstadisticasIntegracion] = useState({
    comprobantesIntegrados: 0,
    impactoBalance: 0,
    impactoResultados: 0
  });

  const { toast } = useToast();
  const { guardarAsiento, getBalanceSheetData, getIncomeStatementData } = useContabilidadIntegration();

  useEffect(() => {
    cargarComprobantes();
    calcularEstadisticasIntegracion();
  }, []);

  const cargarComprobantes = () => {
    const comprobantesGuardados = localStorage.getItem('comprobantes_integrados');
    if (comprobantesGuardados) {
      setComprobantes(JSON.parse(comprobantesGuardados));
    } else {
      // Cargar datos de ejemplo si no existen
      cargarDatosEjemplo();
    }
  };

  const calcularEstadisticasIntegracion = () => {
    const comprobantesData = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
    const integrados = comprobantesData.filter((c: Comprobante) => c.asientoGenerado && c.estado === 'autorizado');
    
    const impactoBalance = integrados
      .filter((c: Comprobante) => c.tipo === 'traspaso')
      .reduce((sum: number, c: Comprobante) => sum + c.monto, 0);
    
    const impactoResultados = integrados
      .filter((c: Comprobante) => c.tipo === 'ingreso' || c.tipo === 'egreso')
      .reduce((sum: number, c: Comprobante) => {
        return c.tipo === 'ingreso' ? sum + c.monto : sum - c.monto;
      }, 0);

    setEstadisticasIntegracion({
      comprobantesIntegrados: integrados.length,
      impactoBalance,
      impactoResultados
    });
  };

  const cargarDatosEjemplo = () => {
    const datosEjemplo: Comprobante[] = [
      {
        id: "1",
        tipo: "ingreso",
        numero: "ING-0001",
        fecha: "2024-01-15",
        concepto: "Venta de mercadería según factura N° 001",
        beneficiario: "Juan Pérez - Cliente",
        monto: 5750.00,
        metodoPago: "1112",
        referencia: "FAC-001",
        observaciones: "Pago al contado en efectivo",
        estado: "autorizado",
        creadoPor: "Ana García - Contadora",
        fechaCreacion: "2024-01-15T10:30:00Z",
        cuentas: [
          { codigo: "1112", nombre: "Banco Nacional de Bolivia", debe: 5750.00, haber: 0 },
          { codigo: "4111", nombre: "Ventas de Productos", debe: 0, haber: 5000.00 },
          { codigo: "2113", nombre: "IVA por Pagar", debe: 0, haber: 750.00 }
        ],
        asientoGenerado: true,
        asientoId: "ASI-001"
      },
      {
        id: "2",
        tipo: "egreso",
        numero: "EGR-0001",
        fecha: "2024-01-16",
        concepto: "Pago de servicios básicos - Luz eléctrica",
        beneficiario: "DELAPAZ - Distribuidora de Electricidad",
        monto: 450.00,
        metodoPago: "1111",
        referencia: "RECIBO-789456",
        observaciones: "Pago correspondiente al mes de diciembre 2023",
        estado: "autorizado",
        creadoPor: "Ana García - Contadora",
        fechaCreacion: "2024-01-16T14:15:00Z",
        cuentas: [
          { codigo: "5231", nombre: "Servicios Básicos", debe: 450.00, haber: 0 },
          { codigo: "1111", nombre: "Caja General", debe: 0, haber: 450.00 }
        ],
        asientoGenerado: true,
        asientoId: "ASI-002"
      },
      {
        id: "3",
        tipo: "egreso",
        numero: "EGR-0002",
        fecha: "2024-01-17",
        concepto: "Compra de mercadería para reventa",
        beneficiario: "Proveedora ABC S.R.L.",
        monto: 8700.00,
        metodoPago: "1112",
        referencia: "FACT-PROV-456",
        observaciones: "Compra de inventario con factura",
        estado: "autorizado",
        creadoPor: "Carlos López - Gerente",
        fechaCreacion: "2024-01-17T09:45:00Z",
        cuentas: [
          { codigo: "1131", nombre: "Inventarios", debe: 7565.22, haber: 0 },
          { codigo: "1142", nombre: "IVA Crédito Fiscal", debe: 1134.78, haber: 0 },
          { codigo: "1112", nombre: "Banco Nacional de Bolivia", debe: 0, haber: 8700.00 }
        ],
        asientoGenerado: true,
        asientoId: "ASI-003"
      },
      {
        id: "4",
        tipo: "traspaso",
        numero: "TRA-0001",
        fecha: "2024-01-18",
        concepto: "Transferencia entre cuentas bancarias",
        beneficiario: "Banco Mercantil Santa Cruz",
        monto: 15000.00,
        metodoPago: "",
        referencia: "TRANSF-123456",
        observaciones: "Transferencia para mejor rentabilidad",
        estado: "autorizado",
        creadoPor: "Ana García - Contadora",
        fechaCreacion: "2024-01-18T11:20:00Z",
        cuentas: [
          { codigo: "1113", nombre: "Banco Mercantil Santa Cruz", debe: 15000.00, haber: 0 },
          { codigo: "1112", nombre: "Banco Nacional de Bolivia", debe: 0, haber: 15000.00 }
        ],
        asientoGenerado: true,
        asientoId: "ASI-004"
      }
    ];

    setComprobantes(datosEjemplo);
    localStorage.setItem('comprobantes_integrados', JSON.stringify(datosEjemplo));
  };

  const validarIntegridadContable = (comprobante: Comprobante): boolean => {
    const totalDebe = comprobante.cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0);
    const totalHaber = comprobante.cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0);
    
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      toast({
        title: "Error de integridad contable",
        description: "El comprobante no cumple con la partida doble. Debe = Haber",
        variant: "destructive"
      });
      return false;
    }

    // Validar que las cuentas existan en el plan de cuentas
    const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
    for (const cuenta of comprobante.cuentas) {
      const cuentaExiste = planCuentas.find((c: any) => c.codigo === cuenta.codigo);
      if (!cuentaExiste) {
        toast({
          title: "Error en el plan de cuentas",
          description: `La cuenta ${cuenta.codigo} no existe en el plan de cuentas`,
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const guardarComprobante = (datos: any) => {
    const nuevoComprobante: Comprobante = {
      ...datos,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString(),
      creadoPor: 'Usuario Sistema',
      monto: datos.tipo === 'traspaso' ? 
        datos.cuentas.reduce((sum: number, cuenta: CuentaContable) => sum + cuenta.debe, 0) : 
        datos.monto,
      asientoGenerado: false
    };

    // Generar número automático
    const contadorTipo = comprobantes.filter(c => c.tipo === datos.tipo).length + 1;
    const prefijo = datos.tipo === 'ingreso' ? 'ING' : datos.tipo === 'egreso' ? 'EGR' : 'TRA';
    nuevoComprobante.numero = `${prefijo}-${contadorTipo.toString().padStart(4, '0')}`;

    // Validar integridad contable
    if (!validarIntegridadContable(nuevoComprobante)) {
      return;
    }

    // Generar asiento contable automáticamente si está autorizado
    if (datos.estado === 'autorizado') {
      const asientoGenerado = generarAsientoContableIntegrado(nuevoComprobante);
      if (asientoGenerado) {
        nuevoComprobante.asientoGenerado = true;
        nuevoComprobante.asientoId = asientoGenerado.id;
      }
    }

    const nuevosComprobantes = [nuevoComprobante, ...comprobantes];
    setComprobantes(nuevosComprobantes);
    localStorage.setItem('comprobantes_integrados', JSON.stringify(nuevosComprobantes));

    // Actualizar estadísticas
    calcularEstadisticasIntegracion();

    toast({
      title: "Comprobante creado e integrado",
      description: `${datos.tipo.charAt(0).toUpperCase() + datos.tipo.slice(1)} N° ${nuevoComprobante.numero} creado y asiento contable generado`,
    });

    setShowComprobanteDialog({ open: false, tipo: null });
  };

  const generarAsientoContableIntegrado = (comprobante: Comprobante) => {
    const asiento = {
      id: `ASI-COMP-${Date.now()}`,
      numero: `COMP-${comprobante.numero}`,
      fecha: comprobante.fecha,
      concepto: `${comprobante.tipo.charAt(0).toUpperCase() + comprobante.tipo.slice(1)} - ${comprobante.concepto}`,
      referencia: comprobante.numero,
      debe: comprobante.cuentas.reduce((sum, c) => sum + c.debe, 0),
      haber: comprobante.cuentas.reduce((sum, c) => sum + c.haber, 0),
      estado: 'registrado' as const,
      cuentas: comprobante.cuentas.map(cuenta => ({
        ...cuenta,
        descripcion: cuenta.nombre
      })),
      origen: 'comprobante',
      comprobanteId: comprobante.id
    };

    const exito = guardarAsiento(asiento);
    if (exito) {
      // Actualizar los saldos en el plan de cuentas
      actualizarSaldosPlanCuentas(comprobante.cuentas);
      return asiento;
    }
    return null;
  };

  const actualizarSaldosPlanCuentas = (cuentas: CuentaContable[]) => {
    const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
    
    cuentas.forEach(cuentaMovimiento => {
      const cuentaIndex = planCuentas.findIndex((c: any) => c.codigo === cuentaMovimiento.codigo);
      if (cuentaIndex !== -1) {
        const cuenta = planCuentas[cuentaIndex];
        
        // Aplicar la naturaleza de la cuenta según su código
        const esCuentaDeudora = ['1', '5', '6'].includes(cuenta.codigo.charAt(0));
        
        if (esCuentaDeudora) {
          cuenta.saldo = (cuenta.saldo || 0) + cuentaMovimiento.debe - cuentaMovimiento.haber;
        } else {
          cuenta.saldo = (cuenta.saldo || 0) + cuentaMovimiento.haber - cuentaMovimiento.debe;
        }
        
        planCuentas[cuentaIndex] = cuenta;
      }
    });
    
    localStorage.setItem('planCuentas', JSON.stringify(planCuentas));
  };

  const autorizarComprobante = (id: string) => {
    const comprobantesActualizados = comprobantes.map(c => {
      if (c.id === id) {
        const comprobanteAutorizado = { ...c, estado: 'autorizado' as const };
        
        if (validarIntegridadContable(comprobanteAutorizado)) {
          const asientoGenerado = generarAsientoContableIntegrado(comprobanteAutorizado);
          if (asientoGenerado) {
            comprobanteAutorizado.asientoGenerado = true;
            comprobanteAutorizado.asientoId = asientoGenerado.id;
          }
        }
        
        return comprobanteAutorizado;
      }
      return c;
    });

    setComprobantes(comprobantesActualizados);
    localStorage.setItem('comprobantes_integrados', JSON.stringify(comprobantesActualizados));
    calcularEstadisticasIntegracion();

    toast({
      title: "Comprobante autorizado e integrado",
      description: "El comprobante ha sido autorizado y el asiento contable generado automáticamente",
    });
  };

  const anularComprobante = (id: string) => {
    const comprobante = comprobantes.find(c => c.id === id);
    if (!comprobante) return;

    // Si tiene asiento generado, crear asiento de reversión
    if (comprobante.asientoGenerado && comprobante.asientoId) {
      const asientoReversion = {
        id: `REV-${Date.now()}`,
        numero: `REV-${comprobante.numero}`,
        fecha: new Date().toISOString().split('T')[0],
        concepto: `Reversión de ${comprobante.concepto}`,
        referencia: `ANULACION-${comprobante.numero}`,
        debe: comprobante.cuentas.reduce((sum, c) => sum + c.haber, 0),
        haber: comprobante.cuentas.reduce((sum, c) => sum + c.debe, 0),
        estado: 'registrado' as const,
        cuentas: comprobante.cuentas.map(cuenta => ({
          codigo: cuenta.codigo,
          nombre: cuenta.nombre,
          debe: cuenta.haber, // Intercambiar debe y haber para reversión
          haber: cuenta.debe,
          descripcion: `Reversión - ${cuenta.nombre}`
        })),
        origen: 'anulacion_comprobante',
        comprobanteId: comprobante.id
      };

      guardarAsiento(asientoReversion);
      
      // Revertir los saldos
      const cuentasReversion = comprobante.cuentas.map(c => ({
        ...c,
        debe: c.haber,
        haber: c.debe
      }));
      actualizarSaldosPlanCuentas(cuentasReversion);
    }

    const comprobantesActualizados = comprobantes.map(c => 
      c.id === id ? { ...c, estado: 'anulado' as const } : c
    );

    setComprobantes(comprobantesActualizados);
    localStorage.setItem('comprobantes_integrados', JSON.stringify(comprobantesActualizados));
    calcularEstadisticasIntegracion();

    toast({
      title: "Comprobante anulado",
      description: "El comprobante ha sido anulado y se generó el asiento de reversión",
      variant: "destructive"
    });
  };

  const comprobantesFiltrados = comprobantes.filter(c => {
    const cumpleTipo = filtroTipo === 'todos' || c.tipo === filtroTipo;
    const cumpleEstado = filtroEstado === 'todos' || c.estado === filtroEstado;
    return cumpleTipo && cumpleEstado;
  });

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'ingreso': return ArrowUpCircle;
      case 'egreso': return ArrowDownCircle;
      case 'traspaso': return ArrowRightLeft;
      default: return FileText;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'autorizado': return 'bg-green-100 text-green-800';
      case 'anulado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const totalIngresos = comprobantes.filter(c => c.tipo === 'ingreso' && c.estado === 'autorizado').reduce((sum, c) => sum + c.monto, 0);
  const totalEgresos = comprobantes.filter(c => c.tipo === 'egreso' && c.estado === 'autorizado').reduce((sum, c) => sum + c.monto, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Comprobantes Integrados</h2>
            <p className="text-slate-600">
              Sistema integrado de comprobantes con generación automática de asientos contables
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowComprobanteDialog({ open: true, tipo: 'ingreso' })}
            className="bg-green-600 hover:bg-green-700"
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Ingreso
          </Button>
          <Button
            onClick={() => setShowComprobanteDialog({ open: true, tipo: 'egreso' })}
            className="bg-red-600 hover:bg-red-700"
          >
            <ArrowDownCircle className="w-4 h-4 mr-2" />
            Egreso
          </Button>
          <Button
            onClick={() => setShowComprobanteDialog({ open: true, tipo: 'traspaso' })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Traspaso
          </Button>
        </div>
      </div>

      {/* Métricas de Integración */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Bs. {totalIngresos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Impacta Estado de Resultados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Bs. {totalEgresos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Impacta Estado de Resultados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrados</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estadisticasIntegracion.comprobantesIntegrados}</div>
            <p className="text-xs text-muted-foreground">
              Asientos generados automáticamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impacto Neto</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              Bs. {(totalIngresos - totalEgresos).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Diferencia en resultados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de Integración */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Estado de Integración Contable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {comprobantes.filter(c => c.asientoGenerado).length}
              </div>
              <div className="text-sm text-green-700">Comprobantes con Asientos</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                Bs. {estadisticasIntegracion.impactoBalance.toFixed(0)}
              </div>
              <div className="text-sm text-blue-700">Impacto en Balance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                Bs. {estadisticasIntegracion.impactoResultados.toFixed(0)}
              </div>
              <div className="text-sm text-purple-700">Impacto en Resultados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex gap-4">
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="ingreso">Ingresos</SelectItem>
            <SelectItem value="egreso">Egresos</SelectItem>
            <SelectItem value="traspaso">Traspasos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="borrador">Borrador</SelectItem>
            <SelectItem value="autorizado">Autorizado</SelectItem>
            <SelectItem value="anulado">Anulado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Comprobantes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Comprobantes Integrados</CardTitle>
          <CardDescription>
            Comprobantes con integración automática al sistema contable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Beneficiario</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Integración</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comprobantesFiltrados.map(comprobante => {
                const IconComponent = getTipoIcon(comprobante.tipo);
                return (
                  <TableRow key={comprobante.id}>
                    <TableCell className="font-medium">{comprobante.numero}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {comprobante.tipo.charAt(0).toUpperCase() + comprobante.tipo.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(comprobante.fecha).toLocaleDateString('es-BO')}</TableCell>
                    <TableCell className="max-w-xs truncate">{comprobante.concepto}</TableCell>
                    <TableCell className="max-w-xs truncate">{comprobante.beneficiario}</TableCell>
                    <TableCell className="text-right font-semibold">
                      Bs. {comprobante.monto.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoColor(comprobante.estado)}>
                        {comprobante.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {comprobante.asientoGenerado ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Integrado
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {comprobante.estado === 'borrador' && (
                          <Button
                            size="sm"
                            onClick={() => autorizarComprobante(comprobante.id)}
                          >
                            Autorizar
                          </Button>
                        )}
                        {comprobante.estado === 'autorizado' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => anularComprobante(comprobante.id)}
                          >
                            Anular
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedComprobante(comprobante)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para crear comprobante */}
      <Dialog 
        open={showComprobanteDialog.open} 
        onOpenChange={(open) => !open && setShowComprobanteDialog({ open: false, tipo: null })}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Nuevo Comprobante de {showComprobanteDialog.tipo?.charAt(0).toUpperCase() + showComprobanteDialog.tipo?.slice(1)}
            </DialogTitle>
            <DialogDescription>
              {showComprobanteDialog.tipo === 'traspaso' ? 
                'Complete la información para el traspaso entre cuentas. Se generará automáticamente el asiento contable.' :
                `Complete la información para el ${showComprobanteDialog.tipo}. Se integrará automáticamente al balance y estado de resultados.`
              }
            </DialogDescription>
          </DialogHeader>
          
          {showComprobanteDialog.tipo && (
            <ComprobanteForm
              tipo={showComprobanteDialog.tipo}
              onSave={guardarComprobante}
              onCancel={() => setShowComprobanteDialog({ open: false, tipo: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para preview del comprobante */}
      {selectedComprobante && (
        <Dialog open={!!selectedComprobante} onOpenChange={(open) => !open && setSelectedComprobante(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Detalle del Comprobante {selectedComprobante.numero}
              </DialogTitle>
              <DialogDescription>
                Información completa del comprobante y su integración contable
              </DialogDescription>
            </DialogHeader>
            
            <ComprobantePreview 
              comprobante={selectedComprobante}
              onClose={() => setSelectedComprobante(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ComprobantesIntegrados;