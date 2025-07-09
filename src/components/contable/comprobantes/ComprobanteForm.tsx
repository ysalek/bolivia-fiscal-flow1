
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

// Plan de cuentas completo para Bolivia
const PLAN_CUENTAS = [
  { codigo: "1111", nombre: "Caja General" },
  { codigo: "1112", nombre: "Banco Nacional de Bolivia" },
  { codigo: "1113", nombre: "Banco Mercantil Santa Cruz" },
  { codigo: "1114", nombre: "Banco Sol" },
  { codigo: "1115", nombre: "Banco Unión" },
  { codigo: "1121", nombre: "Cuentas por Cobrar Comerciales" },
  { codigo: "1131", nombre: "Inventarios - Mercaderías" },
  { codigo: "1141", nombre: "Gastos Pagados por Anticipado" },
  { codigo: "1142", nombre: "IVA Crédito Fiscal" },
  { codigo: "1211", nombre: "Muebles y Enseres" },
  { codigo: "1212", nombre: "Equipos de Computación" },
  { codigo: "1213", nombre: "Vehículos" },
  { codigo: "2111", nombre: "Cuentas por Pagar Comerciales" },
  { codigo: "2121", nombre: "Sueldos y Salarios por Pagar" },
  { codigo: "2131", nombre: "IVA Débito Fiscal" },
  { codigo: "2132", nombre: "IVA Crédito Fiscal" },
  { codigo: "2141", nombre: "IT por Pagar" },
  { codigo: "2151", nombre: "Previsiones Sociales por Pagar" },
  { codigo: "3111", nombre: "Capital Social" },
  { codigo: "3211", nombre: "Utilidades Acumuladas" },
  { codigo: "4111", nombre: "Ventas" },
  { codigo: "4121", nombre: "Descuentos Obtenidos" },
  { codigo: "4191", nombre: "Otros Ingresos" },
  { codigo: "5111", nombre: "Costo de Ventas" },
  { codigo: "5211", nombre: "Sueldos y Salarios" },
  { codigo: "5221", nombre: "Cargas Sociales" },
  { codigo: "5231", nombre: "Servicios Básicos" },
  { codigo: "5241", nombre: "Alquileres" },
  { codigo: "5251", nombre: "Materiales y Suministros" },
  { codigo: "5261", nombre: "Combustibles y Lubricantes" },
  { codigo: "5271", nombre: "Mantenimiento y Reparaciones" },
  { codigo: "5281", nombre: "Gastos de Viaje" },
  { codigo: "5291", nombre: "Gastos Financieros" },
  { codigo: "5191", nombre: "Gastos Varios" }
];

const ComprobanteForm = ({ tipo, onSave, onCancel }: ComprobanteFormProps) => {
  const { toast } = useToast();
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
            const cuentaSeleccionada = PLAN_CUENTAS.find(c => c.codigo === valor);
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
      const metodoPagoSeleccionado = PLAN_CUENTAS.find(m => m.codigo === formData.metodoPago);
      const cuentasGeneradas: CuentaContable[] = [];

      if (tipo === 'ingreso') {
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
      } else {
        // Débito a gastos
        cuentasGeneradas.push({
          codigo: "5191",
          nombre: "Gastos Varios",
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="metodoPago">Método de Pago (Cuenta Contable)</Label>
            <Select value={formData.metodoPago} onValueChange={(value) => setFormData(prev => ({ ...prev, metodoPago: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cuenta" />
              </SelectTrigger>
              <SelectContent>
                {PLAN_CUENTAS.map(cuenta => (
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
                        {PLAN_CUENTAS.map(c => (
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
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
          placeholder="Observaciones adicionales"
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
