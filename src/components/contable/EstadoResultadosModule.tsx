import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Download, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useReportesContables } from '@/hooks/useReportesContables';
import * as XLSX from 'xlsx';

const EstadoResultadosModule = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().slice(0, 10));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const { getIncomeStatementData, getTrialBalanceData } = useReportesContables();

  // Obtener datos reales del sistema contable integrado con comprobantes
  const datosReales = getIncomeStatementData();
  
  // Obtener datos del balance de comprobación para el IT
  const { details } = getTrialBalanceData();
  
  // Estructura de datos completa para el Estado de Resultados
  const estadoResultados = {
    ingresos: {
      total: datosReales.ingresos.total,
      cuentas: datosReales.ingresos.cuentas.filter(c => c.codigo.startsWith('41'))
    },
    costosVentas: {
      total: datosReales.gastos.cuentas.filter(c => c.codigo.startsWith('51')).reduce((sum, c) => sum + c.saldo, 0),
      cuentas: datosReales.gastos.cuentas.filter(c => c.codigo.startsWith('51'))
    },
    gastosOperativos: {
      total: datosReales.gastos.cuentas.filter(c => c.codigo.startsWith('52') || c.codigo.startsWith('53')).reduce((sum, c) => sum + c.saldo, 0),
      cuentas: datosReales.gastos.cuentas.filter(c => c.codigo.startsWith('52') || c.codigo.startsWith('53'))
    },
    otrosIngresos: {
      total: datosReales.ingresos.cuentas.filter(c => c.codigo.startsWith('42')).reduce((sum, c) => sum + c.saldo, 0),
      cuentas: datosReales.ingresos.cuentas.filter(c => c.codigo.startsWith('42'))
    },
    otrosGastos: {
      total: datosReales.gastos.cuentas.filter(c => c.codigo.startsWith('62')).reduce((sum, c) => sum + c.saldo, 0),
      cuentas: datosReales.gastos.cuentas.filter(c => c.codigo.startsWith('62'))
    },
    impuestoTransacciones: {
      total: datosReales.gastos.cuentas.filter(c => c.codigo === '5211').reduce((sum, c) => sum + c.saldo, 0),
      cuentas: datosReales.gastos.cuentas.filter(c => c.codigo === '5211')
    },
    impuestos: {
      total: datosReales.gastos.cuentas.filter(c => c.codigo.startsWith('63')).reduce((sum, c) => sum + c.saldo, 0),
      cuentas: datosReales.gastos.cuentas.filter(c => c.codigo.startsWith('63'))
    }
  };

  const utilidadBruta = estadoResultados.ingresos.total - estadoResultados.costosVentas.total;
  const utilidadOperativa = utilidadBruta - estadoResultados.gastosOperativos.total - estadoResultados.impuestoTransacciones.total;
  const utilidadAntesImpuestos = utilidadOperativa + estadoResultados.otrosIngresos.total - estadoResultados.otrosGastos.total;
  const utilidadNeta = utilidadAntesImpuestos - estadoResultados.impuestos.total;

  const margenBruto = estadoResultados.ingresos.total > 0 ? (utilidadBruta / estadoResultados.ingresos.total) * 100 : 0;
  const margenOperativo = estadoResultados.ingresos.total > 0 ? (utilidadOperativa / estadoResultados.ingresos.total) * 100 : 0;
  const margenNeto = estadoResultados.ingresos.total > 0 ? (utilidadNeta / estadoResultados.ingresos.total) * 100 : 0;

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const renderExpandableSection = (
    sectionKey: string, 
    title: string, 
    total: number, 
    cuentas: { codigo: string; nombre: string; saldo: number }[],
    percentage: string,
    isNegative: boolean = false
  ) => {
    const isExpanded = expandedSections[sectionKey];
    const hasDetails = cuentas && cuentas.length > 0;

    return (
      <>
        <Collapsible open={isExpanded} onOpenChange={() => toggleSection(sectionKey)}>
          <TableRow className="font-medium bg-muted/50">
            <TableCell className="flex items-center gap-2">
              {hasDetails && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
              {!hasDetails && <div className="w-4" />}
              {title}
            </TableCell>
            <TableCell className="text-right">
              {isNegative ? `(${total.toFixed(2)})` : total.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">{percentage}</TableCell>
          </TableRow>
          
          {hasDetails && (
            <CollapsibleContent asChild>
              <>
                {cuentas.map((cuenta, index) => (
                  <TableRow key={cuenta.codigo} className="bg-muted/20">
                    <TableCell className="pl-8 text-sm text-muted-foreground">
                      {cuenta.codigo} - {cuenta.nombre}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {isNegative ? `(${cuenta.saldo.toFixed(2)})` : cuenta.saldo.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {estadoResultados.ingresos.total > 0 ? 
                        `${((cuenta.saldo / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : 
                        '0.0%'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </>
            </CollapsibleContent>
          )}
        </Collapsible>
      </>
    );
  };

  const exportarExcel = () => {
    const datos = [
      ['ESTADO DE RESULTADOS'],
      [`Período: ${fechaInicio} al ${fechaFin}`],
      [''],
      ['Concepto', 'Importe (Bs.)', '% de Ventas'],
      ['INGRESOS', estadoResultados.ingresos.total.toFixed(2), '100.0%'],
      ['(-) COSTO DE VENTAS', `(${estadoResultados.costosVentas.total.toFixed(2)})`, 
       estadoResultados.ingresos.total > 0 ? `${((estadoResultados.costosVentas.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%'],
      ['UTILIDAD BRUTA', utilidadBruta.toFixed(2), `${margenBruto.toFixed(1)}%`],
       ['(-) GASTOS OPERATIVOS', `(${estadoResultados.gastosOperativos.total.toFixed(2)})`,
        estadoResultados.ingresos.total > 0 ? `${((estadoResultados.gastosOperativos.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%'],
       ['(-) IMPUESTO A LAS TRANSACCIONES', `(${estadoResultados.impuestoTransacciones.total.toFixed(2)})`,
        estadoResultados.ingresos.total > 0 ? `${((estadoResultados.impuestoTransacciones.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%'],
       ['UTILIDAD OPERATIVA', utilidadOperativa.toFixed(2), `${margenOperativo.toFixed(1)}%`],
      ['(+) OTROS INGRESOS', estadoResultados.otrosIngresos.total.toFixed(2),
       estadoResultados.ingresos.total > 0 ? `${((estadoResultados.otrosIngresos.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%'],
      ['(-) OTROS GASTOS', `(${estadoResultados.otrosGastos.total.toFixed(2)})`,
       estadoResultados.ingresos.total > 0 ? `${((estadoResultados.otrosGastos.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%'],
      ['UTILIDAD ANTES DE IMPUESTOS', utilidadAntesImpuestos.toFixed(2),
       estadoResultados.ingresos.total > 0 ? `${((utilidadAntesImpuestos / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%'],
      ['(-) IMPUESTOS', `(${estadoResultados.impuestos.total.toFixed(2)})`,
       estadoResultados.ingresos.total > 0 ? `${((estadoResultados.impuestos.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%'],
      ['UTILIDAD NETA', utilidadNeta.toFixed(2), `${margenNeto.toFixed(1)}%`]
    ];

    const ws = XLSX.utils.aoa_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Estado de Resultados');
    XLSX.writeFile(wb, `Estado_Resultados_${fechaInicio}_${fechaFin}.xlsx`);
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
                <div className="text-2xl font-bold text-green-600">
                  {margenBruto.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Margen Bruto</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {margenOperativo.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Margen Operativo</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${utilidadNeta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
              {renderExpandableSection(
                'ingresos',
                'INGRESOS',
                estadoResultados.ingresos.total,
                estadoResultados.ingresos.cuentas,
                '100.0%'
              )}

              {renderExpandableSection(
                'costosVentas',
                '(-) COSTO DE VENTAS',
                estadoResultados.costosVentas.total,
                estadoResultados.costosVentas.cuentas,
                estadoResultados.ingresos.total > 0 ? `${((estadoResultados.costosVentas.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%',
                true
              )}

              <TableRow className="font-bold text-green-600 border-t-2">
                <TableCell>UTILIDAD BRUTA</TableCell>
                <TableCell className="text-right">{utilidadBruta.toFixed(2)}</TableCell>
                <TableCell className="text-right">{margenBruto.toFixed(1)}%</TableCell>
              </TableRow>

              {renderExpandableSection(
                'gastosOperativos',
                '(-) GASTOS OPERATIVOS',
                estadoResultados.gastosOperativos.total,
                estadoResultados.gastosOperativos.cuentas,
                estadoResultados.ingresos.total > 0 ? `${((estadoResultados.gastosOperativos.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%',
                true
              )}

              {renderExpandableSection(
                'impuestoTransacciones',
                '(-) IMPUESTO A LAS TRANSACCIONES',
                estadoResultados.impuestoTransacciones.total,
                estadoResultados.impuestoTransacciones.cuentas,
                estadoResultados.ingresos.total > 0 ? `${((estadoResultados.impuestoTransacciones.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%',
                true
              )}

              <TableRow className="font-bold text-blue-600 border-t-2">
                <TableCell>UTILIDAD OPERATIVA</TableCell>
                <TableCell className="text-right">{utilidadOperativa.toFixed(2)}</TableCell>
                <TableCell className="text-right">{margenOperativo.toFixed(1)}%</TableCell>
              </TableRow>

              {renderExpandableSection(
                'otrosIngresos',
                '(+) OTROS INGRESOS',
                estadoResultados.otrosIngresos.total,
                estadoResultados.otrosIngresos.cuentas,
                estadoResultados.ingresos.total > 0 ? `${((estadoResultados.otrosIngresos.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%'
              )}

              {renderExpandableSection(
                'otrosGastos',
                '(-) OTROS GASTOS',
                estadoResultados.otrosGastos.total,
                estadoResultados.otrosGastos.cuentas,
                estadoResultados.ingresos.total > 0 ? `${((estadoResultados.otrosGastos.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%',
                true
              )}

              <TableRow className="font-bold text-orange-600 border-t-2">
                <TableCell>UTILIDAD ANTES DE IMPUESTOS</TableCell>
                <TableCell className="text-right">{utilidadAntesImpuestos.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {estadoResultados.ingresos.total > 0 ? ((utilidadAntesImpuestos / estadoResultados.ingresos.total) * 100).toFixed(1) : '0.0'}%
                </TableCell>
              </TableRow>

              {renderExpandableSection(
                'impuestos',
                '(-) IMPUESTOS',
                estadoResultados.impuestos.total,
                estadoResultados.impuestos.cuentas,
                estadoResultados.ingresos.total > 0 ? `${((estadoResultados.impuestos.total / estadoResultados.ingresos.total) * 100).toFixed(1)}%` : '0.0%',
                true
              )}
            </TableBody>
            <TableFooter>
              <TableRow className={`font-bold text-lg border-t-4 ${utilidadNeta >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
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
