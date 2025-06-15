
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Filter, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BalanceItem {
  codigo: string;
  cuenta: string;
  debeAnterior: number;
  haberAnterior: number;
  debePeriodo: number;
  haberPeriodo: number;
  debeAcumulado: number;
  haberAcumulado: number;
  saldoDeudor: number;
  saldoAcreedor: number;
}

const BalanceComprobacion = () => {
  const [fechaInicio, setFechaInicio] = useState("2024-06-01");
  const [fechaFin, setFechaFin] = useState("2024-06-30");
  const [tipoBalance, setTipoBalance] = useState("comprobacion");
  const [balanceData, setBalanceData] = useState<BalanceItem[]>([]);
  const { toast } = useToast();

  // Datos de ejemplo para el balance
  const balanceEjemplo: BalanceItem[] = [
    {
      codigo: "1100",
      cuenta: "CAJA Y BANCOS",
      debeAnterior: 50000,
      haberAnterior: 0,
      debePeriodo: 25000,
      haberPeriodo: 15000,
      debeAcumulado: 75000,
      haberAcumulado: 15000,
      saldoDeudor: 60000,
      saldoAcreedor: 0
    },
    {
      codigo: "1200",
      cuenta: "CUENTAS POR COBRAR",
      debeAnterior: 30000,
      haberAnterior: 0,
      debePeriodo: 45000,
      haberPeriodo: 20000,
      debeAcumulado: 75000,
      haberAcumulado: 20000,
      saldoDeudor: 55000,
      saldoAcreedor: 0
    },
    {
      codigo: "1300",
      cuenta: "INVENTARIOS",
      debeAnterior: 80000,
      haberAnterior: 0,
      debePeriodo: 120000,
      haberPeriodo: 95000,
      debeAcumulado: 200000,
      haberAcumulado: 95000,
      saldoDeudor: 105000,
      saldoAcreedor: 0
    },
    {
      codigo: "2100",
      cuenta: "CUENTAS POR PAGAR",
      debeAnterior: 0,
      haberAnterior: 25000,
      debePeriodo: 15000,
      haberPeriodo: 35000,
      debeAcumulado: 15000,
      haberAcumulado: 60000,
      saldoDeudor: 0,
      saldoAcreedor: 45000
    },
    {
      codigo: "3100",
      cuenta: "CAPITAL SOCIAL",
      debeAnterior: 0,
      haberAnterior: 100000,
      debePeriodo: 0,
      haberPeriodo: 0,
      debeAcumulado: 0,
      haberAcumulado: 100000,
      saldoDeudor: 0,
      saldoAcreedor: 100000
    },
    {
      codigo: "4100",
      cuenta: "VENTAS",
      debeAnterior: 0,
      haberAnterior: 0,
      debePeriodo: 0,
      haberPeriodo: 180000,
      debeAcumulado: 0,
      haberAcumulado: 180000,
      saldoDeudor: 0,
      saldoAcreedor: 180000
    },
    {
      codigo: "5100",
      cuenta: "COSTO DE VENTAS",
      debeAnterior: 0,
      haberAnterior: 0,
      debePeriodo: 95000,
      haberPeriodo: 0,
      debeAcumulado: 95000,
      haberAcumulado: 0,
      saldoDeudor: 95000,
      saldoAcreedor: 0
    }
  ];

  useEffect(() => {
    setBalanceData(balanceEjemplo);
  }, []);

  const generarBalance = () => {
    // Simular generación del balance
    toast({
      title: "Balance generado",
      description: `Balance de ${tipoBalance} generado para el período ${fechaInicio} - ${fechaFin}`,
    });
    setBalanceData(balanceEjemplo);
  };

  const exportarBalance = () => {
    toast({
      title: "Balance exportado",
      description: "El balance ha sido exportado a Excel correctamente",
    });
  };

  const calcularTotales = () => {
    return balanceData.reduce((acc, item) => ({
      debeAnterior: acc.debeAnterior + item.debeAnterior,
      haberAnterior: acc.haberAnterior + item.haberAnterior,
      debePeriodo: acc.debePeriodo + item.debePeriodo,
      haberPeriodo: acc.haberPeriodo + item.haberPeriodo,
      debeAcumulado: acc.debeAcumulado + item.debeAcumulado,
      haberAcumulado: acc.haberAcumulado + item.haberAcumulado,
      saldoDeudor: acc.saldoDeudor + item.saldoDeudor,
      saldoAcreedor: acc.saldoAcreedor + item.saldoAcreedor
    }), {
      debeAnterior: 0,
      haberAnterior: 0,
      debePeriodo: 0,
      haberPeriodo: 0,
      debeAcumulado: 0,
      haberAcumulado: 0,
      saldoDeudor: 0,
      saldoAcreedor: 0
    });
  };

  const totales = calcularTotales();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Balance de Comprobación</h2>
          <p className="text-slate-600">Resumen de saldos de todas las cuentas contables</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportarBalance} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={generarBalance}>
            <FileText className="w-4 h-4 mr-2" />
            Generar Balance
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Balance</Label>
              <Select value={tipoBalance} onValueChange={setTipoBalance}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprobacion">Balance de Comprobación</SelectItem>
                  <SelectItem value="general">Balance General</SelectItem>
                  <SelectItem value="resultados">Estado de Resultados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={generarBalance} className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Consultar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Balance de Comprobación</CardTitle>
          <CardDescription>
            Período: {fechaInicio} al {fechaFin}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left p-2 font-semibold">Código</th>
                  <th className="text-left p-2 font-semibold">Cuenta</th>
                  <th className="text-right p-2 font-semibold">Debe Anterior</th>
                  <th className="text-right p-2 font-semibold">Haber Anterior</th>
                  <th className="text-right p-2 font-semibold">Debe Período</th>
                  <th className="text-right p-2 font-semibold">Haber Período</th>
                  <th className="text-right p-2 font-semibold">Debe Acumulado</th>
                  <th className="text-right p-2 font-semibold">Haber Acumulado</th>
                  <th className="text-right p-2 font-semibold">Saldo Deudor</th>
                  <th className="text-right p-2 font-semibold">Saldo Acreedor</th>
                </tr>
              </thead>
              <tbody>
                {balanceData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="p-2 font-mono">{item.codigo}</td>
                    <td className="p-2 font-medium">{item.cuenta}</td>
                    <td className="p-2 text-right">{item.debeAnterior.toFixed(2)}</td>
                    <td className="p-2 text-right">{item.haberAnterior.toFixed(2)}</td>
                    <td className="p-2 text-right">{item.debePeriodo.toFixed(2)}</td>
                    <td className="p-2 text-right">{item.haberPeriodo.toFixed(2)}</td>
                    <td className="p-2 text-right">{item.debeAcumulado.toFixed(2)}</td>
                    <td className="p-2 text-right">{item.haberAcumulado.toFixed(2)}</td>
                    <td className="p-2 text-right font-semibold text-blue-600">
                      {item.saldoDeudor > 0 ? item.saldoDeudor.toFixed(2) : '0.00'}
                    </td>
                    <td className="p-2 text-right font-semibold text-red-600">
                      {item.saldoAcreedor > 0 ? item.saldoAcreedor.toFixed(2) : '0.00'}
                    </td>
                  </tr>
                ))}
                {/* Totales */}
                <tr className="border-t-2 border-slate-400 bg-slate-100 font-bold">
                  <td className="p-2" colSpan={2}>TOTALES</td>
                  <td className="p-2 text-right">{totales.debeAnterior.toFixed(2)}</td>
                  <td className="p-2 text-right">{totales.haberAnterior.toFixed(2)}</td>
                  <td className="p-2 text-right">{totales.debePeriodo.toFixed(2)}</td>
                  <td className="p-2 text-right">{totales.haberPeriodo.toFixed(2)}</td>
                  <td className="p-2 text-right">{totales.debeAcumulado.toFixed(2)}</td>
                  <td className="p-2 text-right">{totales.haberAcumulado.toFixed(2)}</td>
                  <td className="p-2 text-right text-blue-600">{totales.saldoDeudor.toFixed(2)}</td>
                  <td className="p-2 text-right text-red-600">{totales.saldoAcreedor.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verificación de cuadre */}
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Verificación de Cuadre:</span>
              <div className="flex items-center gap-4">
                <span>Total Debe: Bs. {totales.debeAcumulado.toFixed(2)}</span>
                <span>Total Haber: Bs. {totales.haberAcumulado.toFixed(2)}</span>
                <Badge 
                  variant={totales.debeAcumulado === totales.haberAcumulado ? "default" : "destructive"}
                >
                  {totales.debeAcumulado === totales.haberAcumulado ? "Cuadrado" : "Descuadrado"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceComprobacion;
