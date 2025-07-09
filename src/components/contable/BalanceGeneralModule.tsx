
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale, Download, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import * as XLSX from 'xlsx';

const BalanceGeneralModule = () => {
  const [fechaCorte, setFechaCorte] = useState(new Date().toISOString().slice(0, 10));
  const { getBalanceSheetData } = useContabilidadIntegration();

  const balanceData = getBalanceSheetData();
  const { activos, pasivos, patrimonio, totalPasivoPatrimonio, ecuacionCuadrada } = balanceData;

  const exportarExcel = () => {
    const datos = [
      ['BALANCE GENERAL'],
      [`Al ${fechaCorte}`],
      [''],
      ['ACTIVOS', '', 'Bs.'],
      ...activos.cuentas.map(cuenta => [cuenta.codigo, cuenta.nombre, cuenta.saldo.toFixed(2)]),
      ['', 'TOTAL ACTIVOS', activos.total.toFixed(2)],
      [''],
      ['PASIVOS', '', 'Bs.'],
      ...pasivos.cuentas.map(cuenta => [cuenta.codigo, cuenta.nombre, cuenta.saldo.toFixed(2)]),
      ['', 'TOTAL PASIVOS', pasivos.total.toFixed(2)],
      [''],
      ['PATRIMONIO', '', 'Bs.'],
      ...patrimonio.cuentas.map(cuenta => [cuenta.codigo, cuenta.nombre, cuenta.saldo.toFixed(2)]),
      ['', 'TOTAL PATRIMONIO', patrimonio.total.toFixed(2)],
      [''],
      ['', 'TOTAL PASIVO + PATRIMONIO', totalPasivoPatrimonio.toFixed(2)],
      [''],
      ['Ecuación Contable:', ecuacionCuadrada ? 'BALANCEADA' : 'DESBALANCEADA']
    ];

    const ws = XLSX.utils.aoa_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Balance General');
    XLSX.writeFile(wb, `Balance_General_${fechaCorte}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-6 h-6" />
            Balance General
          </CardTitle>
          <CardDescription>
            Estado de situación financiera a una fecha determinada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <Label htmlFor="fecha-corte">Fecha de Corte:</Label>
              <Input
                id="fecha-corte"
                type="date"
                value={fechaCorte}
                onChange={(e) => setFechaCorte(e.target.value)}
                className="w-auto"
              />
            </div>
            <Button onClick={exportarExcel} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Excel
            </Button>
          </div>

          <div className="mb-6">
            <Badge 
              variant={ecuacionCuadrada ? "default" : "destructive"}
              className="flex items-center gap-2"
            >
              {ecuacionCuadrada ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Balance Cuadrado
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Balance Descuadrado
                </>
              )}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ACTIVOS */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ACTIVOS</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Cuenta</TableHead>
                      <TableHead className="text-right">Saldo (Bs.)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activos.cuentas.map((cuenta) => (
                      <TableRow key={cuenta.codigo}>
                        <TableCell className="font-mono text-sm">{cuenta.codigo}</TableCell>
                        <TableCell>{cuenta.nombre}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {cuenta.saldo.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-blue-50">
                      <TableCell colSpan={2} className="font-bold">TOTAL ACTIVOS</TableCell>
                      <TableCell className="text-right font-bold text-blue-600">
                        Bs. {activos.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>

            {/* PASIVOS Y PATRIMONIO */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">PASIVOS Y PATRIMONIO</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* PASIVOS */}
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">PASIVOS</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Cuenta</TableHead>
                          <TableHead className="text-right">Saldo (Bs.)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pasivos.cuentas.map((cuenta) => (
                          <TableRow key={cuenta.codigo}>
                            <TableCell className="font-mono text-sm">{cuenta.codigo}</TableCell>
                            <TableCell>{cuenta.nombre}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {cuenta.saldo.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow className="bg-red-50">
                          <TableCell colSpan={2} className="font-bold">TOTAL PASIVOS</TableCell>
                          <TableCell className="text-right font-bold text-red-600">
                            Bs. {pasivos.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  {/* PATRIMONIO */}
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">PATRIMONIO</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Cuenta</TableHead>
                          <TableHead className="text-right">Saldo (Bs.)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patrimonio.cuentas.map((cuenta) => (
                          <TableRow key={cuenta.codigo}>
                            <TableCell className="font-mono text-sm">{cuenta.codigo}</TableCell>
                            <TableCell>{cuenta.nombre}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {cuenta.saldo.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow className="bg-green-50">
                          <TableCell colSpan={2} className="font-bold">TOTAL PATRIMONIO</TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            Bs. {patrimonio.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  {/* TOTAL PASIVO + PATRIMONIO */}
                  <div className="border-t-2 pt-4">
                    <Table>
                      <TableFooter>
                        <TableRow className={`${ecuacionCuadrada ? 'bg-green-100' : 'bg-red-100'}`}>
                          <TableCell colSpan={2} className="font-bold text-lg">
                            TOTAL PASIVO + PATRIMONIO
                          </TableCell>
                          <TableCell className={`text-right font-bold text-lg ${ecuacionCuadrada ? 'text-green-600' : 'text-red-600'}`}>
                            Bs. {totalPasivoPatrimonio.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Verificación de la Ecuación Contable</h3>
            <div className="text-sm space-y-1">
              <p>Activos: Bs. {activos.total.toFixed(2)}</p>
              <p>Pasivos + Patrimonio: Bs. {totalPasivoPatrimonio.toFixed(2)}</p>
              <p className={`font-semibold ${ecuacionCuadrada ? 'text-green-600' : 'text-red-600'}`}>
                Diferencia: Bs. {Math.abs(activos.total - totalPasivoPatrimonio).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceGeneralModule;
