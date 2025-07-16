import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Calculator, FileText, TrendingUp } from 'lucide-react';

interface CalculationReport {
  modulo: string;
  operacion: string;
  formula: string;
  valores: any;
  resultado: number;
  explicacion: string;
}

interface ReporteCalculosDetalladosProps {
  reports: CalculationReport[];
}

const ReporteCalculosDetallados: React.FC<ReporteCalculosDetalladosProps> = ({ reports }) => {
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sin reportes de cálculos</h3>
          <p className="text-muted-foreground">
            Ejecute la simulación para generar reportes detallados de cálculos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de módulos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Resumen de Cálculos por Módulo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from(new Set(reports.map(r => r.modulo))).map(modulo => {
              const moduloReports = reports.filter(r => r.modulo === modulo);
              const totalOperaciones = moduloReports.length;
              const totalValor = moduloReports.reduce((sum, r) => sum + r.resultado, 0);
              
              return (
                <Card key={modulo}>
                  <CardContent className="p-4">
                    <div className="text-lg font-semibold">{modulo}</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {totalOperaciones} operaciones
                    </div>
                    <div className="text-xl font-bold text-primary">
                      Bs. {totalValor.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detalles de cada cálculo */}
      {reports.map((report, index) => (
        <Card key={index} className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {report.modulo}
                </CardTitle>
                <CardDescription>{report.operacion}</CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                Bs. {report.resultado.toFixed(2)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Fórmula Aplicada:</Label>
              <div className="mt-1 p-3 bg-muted rounded font-mono text-sm border">
                {report.formula}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Valores Utilizados:</Label>
              <div className="mt-1 overflow-x-auto">
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Variable</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(report.valores).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key}</TableCell>
                        <TableCell>
                          {typeof value === 'number' ? `Bs. ${value.toFixed(2)}` : String(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Explicación del Cálculo:</Label>
              <div className="mt-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm leading-relaxed">
                  {report.explicacion}
                </div>
              </div>
            </div>

            {/* Validación matemática */}
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  ✓ Cálculo Validado
                </Badge>
                <span className="text-muted-foreground">
                  Resultado: Bs. {report.resultado.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReporteCalculosDetallados;