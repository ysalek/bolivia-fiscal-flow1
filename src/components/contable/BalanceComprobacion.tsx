
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Calculator, TrendingUp } from "lucide-react";

const BalanceComprobacion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("2024-06");

  const cuentas = [
    {
      codigo: "1.1.01",
      nombre: "Caja",
      saldo_inicial: 5000.00,
      debe: 15412.50,
      haber: 12960.50,
      saldo_final: 7452.00,
      tipo: "Activo"
    },
    {
      codigo: "1.1.02",
      nombre: "Bancos",
      saldo_inicial: 25000.00,
      debe: 8500.00,
      haber: 5200.00,
      saldo_final: 28300.00,
      tipo: "Activo"
    },
    {
      codigo: "1.2.01",
      nombre: "Cuentas por Cobrar",
      saldo_inicial: 8000.00,
      debe: 12500.00,
      haber: 7800.00,
      saldo_final: 12700.00,
      tipo: "Activo"
    },
    {
      codigo: "1.1.06",
      nombre: "IVA Crédito Fiscal",
      saldo_inicial: 1200.00,
      debe: 650.00,
      haber: 0.00,
      saldo_final: 1850.00,
      tipo: "Activo"
    },
    {
      codigo: "2.1.01",
      nombre: "Retenciones por Pagar",
      saldo_inicial: 2500.00,
      debe: 1000.00,
      haber: 3000.00,
      saldo_final: 4500.00,
      tipo: "Pasivo"
    },
    {
      codigo: "2.1.05",
      nombre: "IVA por Pagar",
      saldo_inicial: 1800.00,
      debe: 500.00,
      haber: 2162.50,
      saldo_final: 3462.50,
      tipo: "Pasivo"
    },
    {
      codigo: "3.1.01",
      nombre: "Capital Social",
      saldo_inicial: 50000.00,
      debe: 0.00,
      haber: 0.00,
      saldo_final: 50000.00,
      tipo: "Patrimonio"
    },
    {
      codigo: "4.1.01",
      nombre: "Ventas",
      saldo_inicial: 0.00,
      debe: 0.00,
      haber: 35750.00,
      saldo_final: 35750.00,
      tipo: "Ingresos"
    },
    {
      codigo: "5.1.01",
      nombre: "Sueldos y Salarios",
      saldo_inicial: 0.00,
      debe: 15000.00,
      haber: 0.00,
      saldo_final: 15000.00,
      tipo: "Gastos"
    },
    {
      codigo: "5.2.01",
      nombre: "Gastos de Oficina",
      saldo_inicial: 0.00,
      debe: 850.00,
      haber: 0.00,
      saldo_final: 850.00,
      tipo: "Gastos"
    }
  ];

  const filteredCuentas = cuentas.filter(cuenta =>
    cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cuenta.codigo.includes(searchTerm)
  );

  const getTipoColor = (tipo: string) => {
    const colors: { [key: string]: string } = {
      "Activo": "bg-blue-100 text-blue-800",
      "Pasivo": "bg-red-100 text-red-800",
      "Patrimonio": "bg-green-100 text-green-800",
      "Ingresos": "bg-purple-100 text-purple-800",
      "Gastos": "bg-orange-100 text-orange-800"
    };
    return colors[tipo] || "bg-gray-100 text-gray-800";
  };

  const calcularTotales = () => {
    return filteredCuentas.reduce(
      (acc, cuenta) => ({
        saldo_inicial: acc.saldo_inicial + cuenta.saldo_inicial,
        debe: acc.debe + cuenta.debe,
        haber: acc.haber + cuenta.haber,
        saldo_final: acc.saldo_final + Math.abs(cuenta.saldo_final)
      }),
      { saldo_inicial: 0, debe: 0, haber: 0, saldo_final: 0 }
    );
  };

  const totales = calcularTotales();

  const calcularTotalesPorTipo = () => {
    const tipos = ["Activo", "Pasivo", "Patrimonio", "Ingresos", "Gastos"];
    return tipos.map(tipo => {
      const cuentasTipo = filteredCuentas.filter(c => c.tipo === tipo);
      const total = cuentasTipo.reduce((sum, c) => sum + Math.abs(c.saldo_final), 0);
      return { tipo, total, cantidad: cuentasTipo.length };
    });
  };

  const resumenTipos = calcularTotalesPorTipo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Balance de Comprobación</h2>
          <p className="text-slate-600">Verificación de saldos contables por período</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Recalcular
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cuenta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-06">Junio 2024</SelectItem>
                  <SelectItem value="2024-05">Mayo 2024</SelectItem>
                  <SelectItem value="2024-04">Abril 2024</SelectItem>
                  <SelectItem value="2024-q2">Q2 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen por tipos de cuenta */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {resumenTipos.map((resumen) => (
          <Card key={resumen.tipo}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={getTipoColor(resumen.tipo)}>
                    {resumen.tipo}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {resumen.cantidad} cuenta(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    Bs. {resumen.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Balance de comprobación */}
      <Card>
        <CardHeader>
          <CardTitle>Balance de Comprobación - {filterPeriod}</CardTitle>
          <CardDescription>
            Resumen de saldos de todas las cuentas contables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3">Código</th>
                  <th className="text-left p-3">Cuenta</th>
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-right p-3">Saldo Inicial</th>
                  <th className="text-right p-3">Debe</th>
                  <th className="text-right p-3">Haber</th>
                  <th className="text-right p-3">Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {filteredCuentas.map((cuenta, index) => (
                  <tr key={cuenta.codigo} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-25' : ''}`}>
                    <td className="p-3 font-mono text-sm">{cuenta.codigo}</td>
                    <td className="p-3 font-medium">{cuenta.nombre}</td>
                    <td className="p-3">
                      <Badge className={getTipoColor(cuenta.tipo)} variant="outline">
                        {cuenta.tipo}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-mono">
                      Bs. {cuenta.saldo_inicial.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-mono text-red-600">
                      {cuenta.debe > 0 ? `Bs. ${cuenta.debe.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-3 text-right font-mono text-green-600">
                      {cuenta.haber > 0 ? `Bs. ${cuenta.haber.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      <span className={cuenta.saldo_final >= 0 ? 'text-blue-600' : 'text-red-600'}>
                        Bs. {cuenta.saldo_final.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {/* Fila de totales */}
                <tr className="border-t-2 border-gray-400 bg-gray-100 font-bold">
                  <td className="p-3" colSpan={3}>TOTALES</td>
                  <td className="p-3 text-right font-mono">
                    Bs. {totales.saldo_inicial.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono text-red-600">
                    Bs. {totales.debe.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono text-green-600">
                    Bs. {totales.haber.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono text-blue-600">
                    Bs. {totales.saldo_final.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Verificación de balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Verificación de Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-800">Total Debe</h3>
              <p className="text-2xl font-bold text-red-600">
                Bs. {totales.debe.toFixed(2)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">Total Haber</h3>
              <p className="text-2xl font-bold text-green-600">
                Bs. {totales.haber.toFixed(2)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">Diferencia</h3>
              <p className={`text-2xl font-bold ${
                Math.abs(totales.debe - totales.haber) < 0.01 ? 'text-green-600' : 'text-red-600'
              }`}>
                Bs. {Math.abs(totales.debe - totales.haber).toFixed(2)}
              </p>
              {Math.abs(totales.debe - totales.haber) < 0.01 && (
                <Badge className="mt-2 bg-green-100 text-green-800">
                  ✓ Balance Cuadrado
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceComprobacion;
