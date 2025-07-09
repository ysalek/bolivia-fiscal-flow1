
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { Plus, FileText, ArrowUpCircle, ArrowDownCircle, ArrowRightLeft, DollarSign, Eye } from "lucide-react";
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
}

const ComprobantesModule = () => {
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
  const [showComprobanteDialog, setShowComprobanteDialog] = useState<{
    open: boolean;
    tipo: 'ingreso' | 'egreso' | 'traspaso' | null;
  }>({ open: false, tipo: null });
  const [selectedComprobante, setSelectedComprobante] = useState<Comprobante | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const { toast } = useToast();
  const { guardarAsiento } = useContabilidadIntegration();

  useEffect(() => {
    cargarComprobantes();
    // Cargar datos de ejemplo si no existen
    const existingData = localStorage.getItem('comprobantes');
    if (!existingData) {
      cargarDatosEjemplo();
    }
  }, []);

  const cargarComprobantes = () => {
    const comprobantesGuardados = localStorage.getItem('comprobantes');
    if (comprobantesGuardados) {
      setComprobantes(JSON.parse(comprobantesGuardados));
    }
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
          { codigo: "4111", nombre: "Ventas", debe: 0, haber: 5750.00 }
        ]
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
        ]
      },
      {
        id: "3",
        tipo: "traspaso",
        numero: "TRA-0001",
        fecha: "2024-01-17",
        concepto: "Transferencia entre cuentas bancarias",
        beneficiario: "Banco Nacional de Bolivia",
        monto: 10000.00,
        metodoPago: "",
        referencia: "TRANSF-123456",
        observaciones: "Transferencia de fondos para mejor rentabilidad",
        estado: "autorizado",
        creadoPor: "Carlos López - Gerente",
        fechaCreacion: "2024-01-17T09:45:00Z",
        cuentas: [
          { codigo: "1113", nombre: "Banco Mercantil Santa Cruz", debe: 10000.00, haber: 0 },
          { codigo: "1112", nombre: "Banco Nacional de Bolivia", debe: 0, haber: 10000.00 }
        ]
      },
      {
        id: "4",
        tipo: "ingreso",
        numero: "ING-0002",
        fecha: "2024-01-18",
        concepto: "Cobro de cuenta pendiente - Cliente María Rodríguez",
        beneficiario: "María Rodríguez - Cliente",
        monto: 2100.00,
        metodoPago: "1113",
        referencia: "DEP-654321",
        observaciones: "Pago de factura pendiente del mes anterior",
        estado: "borrador",
        creadoPor: "Ana García - Contadora",
        fechaCreacion: "2024-01-18T11:20:00Z",
        cuentas: [
          { codigo: "1113", nombre: "Banco Mercantil Santa Cruz", debe: 2100.00, haber: 0 },
          { codigo: "1121", nombre: "Cuentas por Cobrar Comerciales", debe: 0, haber: 2100.00 }
        ]
      }
    ];

    setComprobantes(datosEjemplo);
    localStorage.setItem('comprobantes', JSON.stringify(datosEjemplo));
  };

  const guardarComprobante = (datos: any) => {
    const nuevoComprobante: Comprobante = {
      ...datos,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString(),
      creadoPor: 'Usuario Sistema',
      monto: datos.tipo === 'traspaso' ? 
        datos.cuentas.reduce((sum: number, cuenta: CuentaContable) => sum + cuenta.debe, 0) : 
        datos.monto
    };

    // Generar número automático
    const contadorTipo = comprobantes.filter(c => c.tipo === datos.tipo).length + 1;
    const prefijo = datos.tipo === 'ingreso' ? 'ING' : datos.tipo === 'egreso' ? 'EGR' : 'TRA';
    nuevoComprobante.numero = `${prefijo}-${contadorTipo.toString().padStart(4, '0')}`;

    // Generar asiento contable si está autorizado
    if (datos.estado === 'autorizado') {
      generarAsientoContable(nuevoComprobante);
    }

    const nuevosComprobantes = [nuevoComprobante, ...comprobantes];
    setComprobantes(nuevosComprobantes);
    localStorage.setItem('comprobantes', JSON.stringify(nuevosComprobantes));

    toast({
      title: "Comprobante creado",
      description: `${datos.tipo.charAt(0).toUpperCase() + datos.tipo.slice(1)} N° ${nuevoComprobante.numero} creado exitosamente`,
    });

    setShowComprobanteDialog({ open: false, tipo: null });
  };

  const generarAsientoContable = (comprobante: Comprobante) => {
    const asiento = {
      id: Date.now().toString(),
      numero: `COMP-${comprobante.numero}`,
      fecha: comprobante.fecha,
      concepto: `${comprobante.tipo.charAt(0).toUpperCase() + comprobante.tipo.slice(1)} - ${comprobante.concepto}`,
      referencia: comprobante.numero,
      debe: comprobante.monto,
      haber: comprobante.monto,
      estado: 'registrado' as const,
      cuentas: comprobante.cuentas
    };

    guardarAsiento(asiento);
  };

  const autorizarComprobante = (id: string) => {
    const comprobantesActualizados = comprobantes.map(c => {
      if (c.id === id) {
        const comprobanteAutorizado = { ...c, estado: 'autorizado' as const };
        generarAsientoContable(comprobanteAutorizado);
        return comprobanteAutorizado;
      }
      return c;
    });

    setComprobantes(comprobantesActualizados);
    localStorage.setItem('comprobantes', JSON.stringify(comprobantesActualizados));

    toast({
      title: "Comprobante autorizado",
      description: "El comprobante ha sido autorizado y el asiento contable generado",
    });
  };

  const anularComprobante = (id: string) => {
    const comprobantesActualizados = comprobantes.map(c => 
      c.id === id ? { ...c, estado: 'anulado' as const } : c
    );

    setComprobantes(comprobantesActualizados);
    localStorage.setItem('comprobantes', JSON.stringify(comprobantesActualizados));

    toast({
      title: "Comprobante anulado",
      description: "El comprobante ha sido anulado",
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
            <h2 className="text-2xl font-bold">Comprobantes Contables</h2>
            <p className="text-slate-600">
              Gestión de comprobantes de ingreso, egreso y traspasos con plan de cuentas
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

      {/* Métricas Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Bs. {totalIngresos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Comprobantes autorizados
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
              Comprobantes autorizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Neto</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Bs. {(totalIngresos - totalEgresos).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Diferencia ingresos - egresos
            </p>
          </CardContent>
        </Card>
      </div>

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
          <CardTitle>Lista de Comprobantes</CardTitle>
          <CardDescription>
            Historial de todos los comprobantes generados con detalle contable
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
                    <TableCell>{comprobante.concepto}</TableCell>
                    <TableCell>{comprobante.beneficiario}</TableCell>
                    <TableCell className="text-right font-semibold">
                      Bs. {comprobante.monto.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoColor(comprobante.estado)}>
                        {comprobante.estado}
                      </Badge>
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
                'Configure las cuentas contables manualmente para el asiento' :
                'Se generará automáticamente el asiento contable según el plan de cuentas'
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

      {/* Dialog para previsualizar comprobante */}
      <Dialog 
        open={!!selectedComprobante} 
        onOpenChange={(open) => !open && setSelectedComprobante(null)}
      >
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
          {selectedComprobante && (
            <ComprobantePreview
              comprobante={selectedComprobante}
              onClose={() => setSelectedComprobante(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComprobantesModule;
