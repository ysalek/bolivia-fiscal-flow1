
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CuentaContable {
  codigo: string;
  nombre: string;
  debe: number;
  haber: number;
}

interface ComprobanteFormData {
  tipo: 'ingreso' | 'egreso' | 'traspaso';
  numero: string;
  fecha: string;
  concepto: string;
  beneficiario: string;
  monto: number;
  metodoPago: string;
  cuentaGasto?: string;
  referencia: string;
  observaciones: string;
  estado: 'borrador' | 'autorizado';
  cuentas: CuentaContable[];
}

interface ComprobanteFormProps {
  tipo: 'ingreso' | 'egreso' | 'traspaso';
  onSave: (comprobante: ComprobanteFormData) => void;
  onCancel: () => void;
}

import { inicializarPlanCuentas } from "@/utils/planCuentasInicial";

// Función para obtener el plan de cuentas dinámico
const obtenerPlanCuentas = () => {
  const planCuentasData = inicializarPlanCuentas();
  console.log("Plan de cuentas cargado:", planCuentasData);
  return planCuentasData;
};

const ComprobanteForm = ({ tipo, onSave, onCancel }: ComprobanteFormProps) => {
  const { toast } = useToast();
  const [planCuentas, setPlanCuentas] = useState(() => {
    const plan = obtenerPlanCuentas();
    console.log("Inicializando plan de cuentas:", plan?.length || 0, "cuentas");
    return plan || [];
  });
  const [formData, setFormData] = useState<ComprobanteFormData>({
    tipo,
    numero: '',
    fecha: new Date().toISOString().slice(0, 10),
    concepto: '',
    beneficiario: '',
    monto: 0,
    metodoPago: '',
    referencia: '',
    observaciones: '',
    estado: 'borrador',
    cuentas: tipo === 'traspaso' ? [
      { codigo: '', nombre: '', debe: 0, haber: 0 },
      { codigo: '', nombre: '', debe: 0, haber: 0 }
    ] : []
  });

  const [conFactura, setConFactura] = useState(false);
  const [conFacturaIngreso, setConFacturaIngreso] = useState(false);

  const agregarCuenta = () => {
    setFormData(prev => ({
      ...prev,
      cuentas: [...prev.cuentas, { codigo: '', nombre: '', debe: 0, haber: 0 }]
    }));
  };

  const eliminarCuenta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cuentas: prev.cuentas.filter((_, i) => i !== index)
    }));
  };

  const actualizarCuenta = (index: number, campo: keyof CuentaContable, valor: string | number) => {
    setFormData(prev => ({
      ...prev,
      cuentas: prev.cuentas.map((cuenta, i) => {
        if (i === index) {
          if (campo === 'codigo') {
            const cuentaSeleccionada = planCuentas.find(c => c.codigo === valor);
            return {
              ...cuenta,
              codigo: valor as string,
              nombre: cuentaSeleccionada?.nombre || ''
            };
          }
          return { ...cuenta, [campo]: valor };
        }
        return cuenta;
      })
    }));
  };

  const validarBalance = () => {
    const totalDebe = formData.cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0);
    const totalHaber = formData.cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0);
    return Math.abs(totalDebe - totalHaber) < 0.01;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tipo === 'traspaso' && !validarBalance()) {
      toast({
        title: "Error de Balance",
        description: "El total del Debe debe ser igual al total del Haber",
        variant: "destructive"
      });
      return;
    }

    // Generar cuentas automáticamente para ingreso y egreso
    if (tipo !== 'traspaso') {
      // Verificar que tenemos plan de cuentas cargado
      if (!planCuentas || planCuentas.length === 0) {
        toast({
          title: "Error en Plan de Cuentas",
          description: "El plan de cuentas no está cargado. Recargue la página e intente nuevamente.",
          variant: "destructive"
        });
        return;
      }

      // Verificar que se seleccionó un método de pago
      if (!formData.metodoPago) {
        toast({
          title: "Error",
          description: "Debe seleccionar una cuenta de método de pago",
          variant: "destructive"
        });
        return;
      }

      // Verificar que la cuenta del método de pago existe
      const metodoPagoSeleccionado = planCuentas.find(m => m.codigo === formData.metodoPago);
      
      if (!metodoPagoSeleccionado) {
        console.error("Cuenta no encontrada:", formData.metodoPago);
        console.log("Plan de cuentas disponible:", planCuentas.map(c => `${c.codigo} - ${c.nombre}`));
        toast({
          title: "Error en Cuenta",
          description: `La cuenta ${formData.metodoPago} no existe en el plan de cuentas`,
          variant: "destructive"
        });
        return;
      }
      
      const cuentasGeneradas: CuentaContable[] = [];

      if (tipo === 'ingreso') {
        // Ingreso - determinar si es con factura o sin factura
        if (conFacturaIngreso) {
          // Con factura: incluir débito fiscal del 13% e IT del 3%
          const baseImponible = formData.monto / 1.16; // Monto sin IVA ni IT
          const debitoFiscal = baseImponible * 0.13; // 13% de IVA
          const impuestoTransacciones = baseImponible * 0.03; // 3% de IT
          
          // Débito a la cuenta de método de pago (total)
          cuentasGeneradas.push({
            codigo: formData.metodoPago,
            nombre: metodoPagoSeleccionado?.nombre || 'Cuenta no encontrada',
            debe: formData.monto,
            haber: 0
          });
          
          // Crédito a ventas (sin impuestos)
          cuentasGeneradas.push({
            codigo: "4111",
            nombre: "Ventas",
            debe: 0,
            haber: baseImponible
          });
          
          // Crédito a IVA Débito Fiscal
          cuentasGeneradas.push({
            codigo: "2131",
            nombre: "IVA Débito Fiscal",
            debe: 0,
            haber: debitoFiscal
          });
          
          // Crédito a IT por Pagar
          cuentasGeneradas.push({
            codigo: "2141",
            nombre: "IT por Pagar",
            debe: 0,
            haber: impuestoTransacciones
          });
        } else {
          // Sin factura: asiento simple
          // Débito a la cuenta de método de pago
          cuentasGeneradas.push({
            codigo: formData.metodoPago,
            nombre: metodoPagoSeleccionado?.nombre || 'Cuenta no encontrada',
            debe: formData.monto,
            haber: 0
          });
          // Crédito a ingresos
          cuentasGeneradas.push({
            codigo: "4191",
            nombre: "Otros Ingresos",
            debe: 0,
            haber: formData.monto
          });
        }
      } else {
        // Egreso - determinar si es con factura o sin factura
        if (conFactura) {
          // Con factura: incluir crédito fiscal del 13%
          // Para 2800: base = 2800/1.13 = 2477.88, IVA = 2477.88*0.13 = 322.12
          const baseImponible = formData.monto / 1.13; // Monto sin IVA (87%)
          const creditoFiscal = formData.monto - baseImponible; // 13% de IVA
          
          // Débito a gastos (sin IVA) - usar cuenta seleccionada o por defecto
          const codigoCuentaGasto = formData.cuentaGasto || "5191";
          const cuentaGasto = planCuentas.find(c => c.codigo === codigoCuentaGasto);
          cuentasGeneradas.push({
            codigo: codigoCuentaGasto,
            nombre: cuentaGasto?.nombre || "Gastos Varios",
            debe: baseImponible,
            haber: 0
          });
          
          // Débito a IVA Crédito Fiscal
          cuentasGeneradas.push({
            codigo: "1142",
            nombre: "IVA Crédito Fiscal",
            debe: creditoFiscal,
            haber: 0
          });
          
          // Crédito a la cuenta de método de pago (total)
          cuentasGeneradas.push({
            codigo: formData.metodoPago,
            nombre: metodoPagoSeleccionado?.nombre || 'Cuenta no encontrada',
            debe: 0,
            haber: formData.monto
          });
        } else {
          // Sin factura: asiento simple
          // Débito a gastos - usar cuenta seleccionada o por defecto
          const codigoCuentaGastoSinIva = formData.cuentaGasto || "5191";
          const cuentaGastoSinIva = planCuentas.find(c => c.codigo === codigoCuentaGastoSinIva);
          cuentasGeneradas.push({
            codigo: codigoCuentaGastoSinIva,
            nombre: cuentaGastoSinIva?.nombre || "Gastos Varios",
            debe: formData.monto,
            haber: 0
          });
          // Crédito a la cuenta de método de pago
          cuentasGeneradas.push({
            codigo: formData.metodoPago,
            nombre: metodoPagoSeleccionado?.nombre || 'Cuenta no encontrada',
            debe: 0,
            haber: formData.monto
          });
        }
      }

      formData.cuentas = cuentasGeneradas;
    }

    onSave(formData);
  };

  const totalDebe = formData.cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0);
  const totalHaber = formData.cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0);
  const diferencia = totalDebe - totalHaber;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="monto">Monto Total (Bs.)</Label>
          <Input
            id="monto"
            type="number"
            step="0.01"
            value={formData.monto}
            onChange={(e) => setFormData(prev => ({ ...prev, monto: parseFloat(e.target.value) || 0 }))}
            required={tipo !== 'traspaso'}
            disabled={tipo === 'traspaso'}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="beneficiario">Beneficiario/Pagador</Label>
          <Input
            id="beneficiario"
            value={formData.beneficiario}
            onChange={(e) => setFormData(prev => ({ ...prev, beneficiario: e.target.value }))}
            placeholder="Nombre del beneficiario o pagador"
            required
          />
        </div>
      </div>

      {tipo !== 'traspaso' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metodoPago">Método de Pago (Cuenta Contable)</Label>
              <Select value={formData.metodoPago} onValueChange={(value) => setFormData(prev => ({ ...prev, metodoPago: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {planCuentas
                    .filter(cuenta => cuenta.activa)
                    .filter((cuenta, index, arr) => arr.findIndex(c => c.codigo === cuenta.codigo) === index)
                    .map(cuenta => (
                    <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                      {cuenta.codigo} - {cuenta.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referencia">Referencia</Label>
              <Input
                id="referencia"
                value={formData.referencia}
                onChange={(e) => setFormData(prev => ({ ...prev, referencia: e.target.value }))}
                placeholder="Número de cheque, boleta, etc."
              />
            </div>

            {tipo === 'egreso' && (
              <div className="space-y-2">
                <Label htmlFor="cuentaGasto">Cuenta del Gasto</Label>
                <Select value={formData.cuentaGasto || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, cuentaGasto: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cuenta de gasto" />
                  </SelectTrigger>
                  <SelectContent>
                    {planCuentas
                      .filter(cuenta => cuenta.activa && (cuenta.tipo === 'gastos' || cuenta.codigo.startsWith('5')))
                      .filter((cuenta, index, arr) => arr.findIndex(c => c.codigo === cuenta.codigo) === index)
                      .map(cuenta => (
                      <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                        {cuenta.codigo} - {cuenta.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {tipo === 'ingreso' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="conFacturaIngreso"
                  checked={conFacturaIngreso}
                  onCheckedChange={(checked) => setConFacturaIngreso(checked === true)}
                />
                <Label htmlFor="conFacturaIngreso" className="text-sm font-medium">
                  El ingreso incluye factura con IVA (13% Débito Fiscal) e IT (3%)
                </Label>
              </div>
              {conFacturaIngreso && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Nota:</strong> El monto ingresado se considera que incluye el 13% de IVA y 3% de IT. 
                    Se generará automáticamente el asiento contable con:
                  </p>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Venta (sin impuestos): Bs. {(formData.monto / 1.16).toFixed(2)}</li>
                    <li>• IVA Débito Fiscal (13%): Bs. {((formData.monto / 1.16) * 0.13).toFixed(2)}</li>
                    <li>• IT por Pagar (3%): Bs. {((formData.monto / 1.16) * 0.03).toFixed(2)}</li>
                    <li>• Total a cobrar: Bs. {formData.monto.toFixed(2)}</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {tipo === 'egreso' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="conFactura"
                  checked={conFactura}
                  onCheckedChange={(checked) => setConFactura(checked === true)}
                />
                <Label htmlFor="conFactura" className="text-sm font-medium">
                  El gasto incluye factura con IVA (13% Crédito Fiscal)
                </Label>
              </div>
              {conFactura && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> El monto ingresado se considera que incluye el 13% de IVA. 
                    Se generará automáticamente el asiento contable con:
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Gasto (sin IVA): Bs. {(formData.monto / 1.13).toFixed(2)} (87%)</li>
                    <li>• IVA Crédito Fiscal (13%): Bs. {(formData.monto - (formData.monto / 1.13)).toFixed(2)}</li>
                    <li>• Total a pagar: Bs. {formData.monto.toFixed(2)}</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tipo === 'traspaso' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Asiento Contable</h3>
            <Button type="button" onClick={agregarCuenta} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Cuenta
            </Button>
          </div>

          <div className="space-y-3">
            {formData.cuentas.map((cuenta, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Label>Cuenta</Label>
                    <Select 
                      value={cuenta.codigo} 
                      onValueChange={(value) => actualizarCuenta(index, 'codigo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {planCuentas
                          .filter(cuenta => cuenta.activa)
                          .filter((cuenta, index, arr) => arr.findIndex(c => c.codigo === cuenta.codigo) === index)
                          .map(c => (
                          <SelectItem key={c.codigo} value={c.codigo}>
                            {c.codigo} - {c.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Label>Nombre de la Cuenta</Label>
                    <Input value={cuenta.nombre} disabled className="bg-gray-50" />
                  </div>
                  <div className="col-span-2">
                    <Label>Debe (Bs.)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={cuenta.debe}
                      onChange={(e) => actualizarCuenta(index, 'debe', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Haber (Bs.)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={cuenta.haber}
                      onChange={(e) => actualizarCuenta(index, 'haber', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => eliminarCuenta(index)}
                      disabled={formData.cuentas.length <= 2}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className={`p-4 ${diferencia === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium">Total Debe</p>
                <p className="text-lg font-bold">Bs. {totalDebe.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Haber</p>
                <p className="text-lg font-bold">Bs. {totalHaber.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Diferencia</p>
                <p className={`text-lg font-bold ${diferencia === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Bs. {Math.abs(diferencia).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="observaciones">Descripción de la Operación</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
          placeholder="Descripción detallada de la operación contable"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select value={formData.estado} onValueChange={(value: 'borrador' | 'autorizado') => setFormData(prev => ({ ...prev, estado: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="borrador">Borrador</SelectItem>
            <SelectItem value="autorizado">Autorizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar Comprobante
        </Button>
      </div>
    </form>
  );
};

export default ComprobanteForm;
