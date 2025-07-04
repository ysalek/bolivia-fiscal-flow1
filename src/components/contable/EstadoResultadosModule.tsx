
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Download, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EstadoResultadosModule = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().slice(0, 10));

  // Datos de ejemplo para el Estado de Resultados
  const estadoResultados = {
    ingresos: {
      total: 150000,
      cuentas: [
        { codigo: '4111', nombre: 'Ventas de Mercaderías', saldo: 120000 },
        { codigo: '4112', nombre: 'Ventas de Servicios', saldo: 30000 }
      ]
    },
    costosVentas: {
      total: 75000,
      cuentas: [
        { codigo: '5111', nombre: 'Costo de Ventas', saldo: 75000 }
      ]
    },
    gastosOperativos: {
      total: 45000,
      cuentas: [
        { codigo: '6111', nombre: 'Sueldos y Salarios', saldo: 25000 },
        { codigo: '6112', nombre: 'Alquileres', saldo: 12000 },
        { codigo: '6113', nombre: 'Servicios Básicos', saldo: 8000 }
      ]
    },
    otrosIngresos: {
      total: 5000,
      cuentas: [
        { codigo: '4211', nombre: 'Ingresos Financieros', saldo: 5000 }
      ]
    },
    otrosGastos: {
      total: 3000,
      cuentas: [
        { codigo: '6211', nombre: 'Gastos Financieros', saldo: 3000 }
      ]
    },
    impuestos: {
      total: 8000,
      cuentas: [
        { codigo: '6311', nombre: 'Impuesto a las Utilidades', saldo: 8000 }
      ]
    }
  };

  const utilidadBruta = estadoResultados.ingresos.total - estadoResultados.costosVentas.total;
  const utilidadOperativa = utilidadBruta - estadoResultados.gastosOperativos.total;
  const utilidadAntesImpuestos = utilidadOperativa + estadoResultados.otrosIngresos.total - estadoResultados.otrosGastos.total;
  const utilidadNeta = utilidadAntesImpuestos - estadoResultados.impuestos.total;

  const margenBruto = estadoResultados.ingresos.total > 0 ? (utilidadBruta / estadoResultados.ingresos.total) * 100 : 0;
  const margenOperativo = estadoResultados.ingresos.total > 0 ? (utilidadOperativa / estadoResultados.ingresos.total) * 100 : 0;
  const margenNeto = estadoResultados.ingresos.total > 0 ? (utilidadNeta / estadoResultados.ingresos.total) * 100 : 0;

  const exportarExcel = () => {
    console.log('Exportando Estado de Resultados a Excel...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Estado de Resultados
          </CardTitle>
          <CardDescription>
            Estado de ganancias y pérdidas del período seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <Label htmlFor="fecha-inicio">Desde:</Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="fecha-fin">Hasta:</Label>
              <Input
                id="fecha-fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-auto"
              />
            </div>
            <Button onClick={exportarExcel} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Excel
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">
                  {margenBruto.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Margen Bruto</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {margenOperativo.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Margen Operativo</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${utilidadNeta >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {margenNeto.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Margen Neto</div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Concepto</TableHead>
                <TableHead className="text-right">Importe (Bs.)</TableHead>
                <TableHead className="text-right">% de Ventas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-medium bg-muted/50">
                <TableCell>INGRESOS</TableCell>
                <TableCell className="text-right">{estadoResultados.ingresos.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">100.0%</TableCell>
              </TableRow>

              <TableRow className="font-medium bg-muted/50">
                <TableCell>(-) COSTO DE VENTAS</TableCell>
                <TableCell className="text-right">({estadoResultados.costosVentas.total.toFixed(2)})</TableCell>
                <TableCell className="text-right">
                  {estadoResultados.ingresos.total > 0 ? ((estadoResultados.costosVentas.total / estadoResultados.ingresos.total) * 100).toFixed(1) : '0.0'}%
                </TableCell>
              </TableRow>

              <TableRow className="font-bold text-success border-t-2">
                <TableCell>UTILIDAD BRUTA</TableCell>
                <TableCell className="text-right">{utilidadBruta.toFixed(2)}</TableCell>
                <TableCell className="text-right">{margenBruto.toFixed(1)}%</TableCell>
              </TableRow>

              <TableRow className="font-medium bg-muted/50">
                <TableCell>(-) GASTOS OPERATIVOS</TableCell>
                <TableCell className="text-right">({estadoResultados.gastosOperativos.total.toFixed(2)})</TableCell>
                <TableCell className="text-right">
                  {estadoResultados.ingresos.total > 0 ? ((estadoResultados.gastosOperativos.total / estadoResultados.ingresos.total) * 100).toFixed(1) : '0.0'}%
                </TableCell>
              </TableRow>

              <TableRow className="font-bold text-primary border-t-2">
                <TableCell>UTILIDAD OPERATIVA</TableCell>
                <TableCell className="text-right">{utilidadOperativa.toFixed(2)}</TableCell>
                <TableCell className="text-right">{margenOperativo.toFixed(1)}%</TableCell>
              </TableRow>

              <TableRow className="font-medium bg-muted/50">
                <TableCell>(+) OTROS INGRESOS</TableCell>
                <TableCell className="text-right">{estadoResultados.otrosIngresos.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {estadoResultados.ingresos.total > 0 ? ((estadoResultados.otrosIngresos.total / estadoResultados.ingresos.total) * 100).toFixed(1) : '0.0'}%
                </TableCell>
              </TableRow>

              <TableRow className="font-medium bg-muted/50">
                <TableCell>(-) OTROS GASTOS</TableCell>
                <TableCell className="text-right">({estadoResultados.otrosGastos.total.toFixed(2)})</TableCell>
                <TableCell className="text-right">
                  {estadoResultados.ingresos.total > 0 ? ((estadoResultados.otrosGastos.total / estadoResultados.ingresos.total) * 100).toFixed(1) : '0.0'}%
                </TableCell>
              </TableRow>

              <TableRow className="font-bold text-warning border-t-2">
                <TableCell>UTILIDAD ANTES DE IMPUESTOS</TableCell>
                <TableCell className="text-right">{utilidadAntesImpuestos.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {estadoResultados.ingresos.total > 0 ? ((utilidadAntesImpuestos / estadoResultados.ingresos.total) * 100).toFixed(1) : '0.0'}%
                </TableCell>
              </TableRow>

              <TableRow className="font-medium bg-muted/50">
                <TableCell>(-) IMPUESTOS</TableCell>
                <TableCell className="text-right">({estadoResultados.impuestos.total.toFixed(2)})</TableCell>
                <TableCell className="text-right">
                  {estadoResultados.ingresos.total > 0 ? ((estadoResultados.impuestos.total / estadoResultados.ingresos.total) * 100).toFixed(1) : '0.0'}%
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow className={`font-bold text-lg border-t-4 ${utilidadNeta >= 0 ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'}`}>
                <TableCell>UTILIDAD NETA</TableCell>
                <TableCell className="text-right">{utilidadNeta.toFixed(2)}</TableCell>
                <TableCell className="text-right">{margenNeto.toFixed(1)}%</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="mt-6 flex justify-between items-center">
            <Badge variant={utilidadNeta >= 0 ? "default" : "destructive"}>
              {utilidadNeta >= 0 ? 'Utilidad' : 'Pérdida'}: Bs. {Math.abs(utilidadNeta).toFixed(2)}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Período: {fechaInicio} al {fechaFin}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadoResultadosModule;
