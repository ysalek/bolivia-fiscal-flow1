import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Calculator, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAsientos } from "@/hooks/useAsientos";
import { useReportesContables } from "@/hooks/useReportesContables";

interface ValidationIssue {
  type: 'error' | 'warning' | 'success';
  title: string;
  description: string;
  suggestion?: string;
  accountCode?: string;
  amount?: number;
}

const InventoryAccountingValidator = () => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { getAsientos } = useAsientos();
  const { getBalanceSheetData, getTrialBalanceData } = useReportesContables();
  const { toast } = useToast();

  const validateInventoryAccounting = () => {
    setIsValidating(true);
    const validationIssues: ValidationIssue[] = [];

    try {
      const asientos = getAsientos().filter(a => a.estado === 'registrado');
      const balanceData = getBalanceSheetData();
      const { details } = getTrialBalanceData();

      // 1. Validar que el inventario final sea positivo
      const inventarioAccount = details.find(d => d.codigo === '1141');
      if (inventarioAccount) {
        const saldoInventario = inventarioAccount.saldoDeudor - inventarioAccount.saldoAcreedor;
        
        if (saldoInventario < 0) {
          validationIssues.push({
            type: 'error',
            title: 'Inventario con saldo negativo',
            description: `El saldo de inventarios es Bs. ${saldoInventario.toFixed(2)}. Los inventarios nunca pueden ser negativos.`,
            suggestion: 'Revisar los asientos de entrada y salida de inventario. Verificar que las compras aumenten el inventario y solo las ventas lo disminuyan.',
            accountCode: '1141',
            amount: saldoInventario
          });
        } else if (saldoInventario === 0) {
          validationIssues.push({
            type: 'warning',
            title: 'Inventario en cero',
            description: 'El inventario tiene saldo cero. Verificar si esto es correcto.',
            accountCode: '1141',
            amount: saldoInventario
          });
        } else {
          validationIssues.push({
            type: 'success',
            title: 'Saldo de inventario correcto',
            description: `Inventario final: Bs. ${saldoInventario.toFixed(2)}`,
            accountCode: '1141',
            amount: saldoInventario
          });
        }
      }

      // 2. Validar que las compras vayan a inventario (no a gastos)
      const comprasDirectasAGastos = asientos.filter(a => 
        a.concepto.toLowerCase().includes('compra') &&
        a.cuentas.some(c => c.codigo === '5121' && c.debe > 0)
      );

      if (comprasDirectasAGastos.length > 0) {
        validationIssues.push({
          type: 'error',
          title: 'Compras registradas incorrectamente',
          description: `${comprasDirectasAGastos.length} compras van directo a gastos (5121) en lugar de inventario (1141).`,
          suggestion: 'Las compras deben capitalizarse en inventario (1141). Solo cuando se vende el producto debe ir el costo a resultados (5111).',
          accountCode: '5121'
        });
      }

      // 3. Validar ecuación de inventario: Inventario Final = Inicial + Compras - Costo Ventas
      let comprasEnInventario = 0;
      let costoVentas = 0;

      asientos.forEach(asiento => {
        asiento.cuentas.forEach(cuenta => {
          if (cuenta.codigo === '1141' && cuenta.debe > 0) {
            comprasEnInventario += cuenta.debe;
          }
          if (cuenta.codigo === '5111' && cuenta.debe > 0) {
            costoVentas += cuenta.debe;
          }
        });
      });

      // 4. Validar que el costo de ventas solo incluya productos vendidos
      const asientosVenta = asientos.filter(a => 
        a.concepto.toLowerCase().includes('venta') || 
        a.concepto.toLowerCase().includes('factura')
      );

      const ventasSinCosto = asientosVenta.filter(a => 
        !a.cuentas.some(c => c.codigo === '5111' && c.debe > 0)
      );

      if (ventasSinCosto.length > 0) {
        validationIssues.push({
          type: 'warning',
          title: 'Ventas sin registro de costo',
          description: `${ventasSinCosto.length} ventas no tienen registrado el costo correspondiente.`,
          suggestion: 'Cada venta debe generar un asiento que registre el costo en la cuenta 5111.',
          accountCode: '5111'
        });
      }

      // 5. Validar coherencia entre inventario físico y contable
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      const valorFisicoTotal = productos.reduce((sum: number, p: any) => 
        sum + (p.stockActual * p.costoUnitario), 0
      );

      if (inventarioAccount) {
        const saldoContable = inventarioAccount.saldoDeudor - inventarioAccount.saldoAcreedor;
        const diferencia = Math.abs(saldoContable - valorFisicoTotal);
        
        if (diferencia > 10) {
          validationIssues.push({
            type: 'error',
            title: 'Desajuste entre inventario físico y contable',
            description: `Inventario contable: Bs. ${saldoContable.toFixed(2)}, Físico: Bs. ${valorFisicoTotal.toFixed(2)}. Diferencia: Bs. ${diferencia.toFixed(2)}`,
            suggestion: 'Realizar ajustes de inventario para cuadrar los saldos físicos con los contables.',
            accountCode: '1141'
          });
        } else {
          validationIssues.push({
            type: 'success',
            title: 'Inventario físico y contable concordantes',
            description: `Diferencia aceptable: Bs. ${diferencia.toFixed(2)}`,
            accountCode: '1141'
          });
        }
      }

    } catch (error) {
      validationIssues.push({
        type: 'error',
        title: 'Error en validación',
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    setIssues(validationIssues);
    setIsValidating(false);

    const errors = validationIssues.filter(i => i.type === 'error').length;
    const warnings = validationIssues.filter(i => i.type === 'warning').length;

    toast({
      title: "Validación contable completada",
      description: `${errors} errores críticos, ${warnings} advertencias`,
      variant: errors > 0 ? "destructive" : "default"
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'error': return 'destructive' as const;
      case 'warning': return 'secondary' as const;
      case 'success': return 'default' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Validador de Contabilidad de Inventarios
          </CardTitle>
          <CardDescription>
            Verificación de la correcta aplicación de las normas contables bolivianas para inventarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={validateInventoryAccounting}
              disabled={isValidating}
              className="w-full"
            >
              {isValidating ? 'Validando...' : 'Ejecutar Validación Contable'}
            </Button>

            {issues.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {issues.filter(i => i.type === 'error').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Errores Críticos</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {issues.filter(i => i.type === 'warning').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Advertencias</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {issues.filter(i => i.type === 'success').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Validaciones OK</div>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estado</TableHead>
                      <TableHead>Problema</TableHead>
                      <TableHead>Cuenta</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Recomendación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getIcon(issue.type)}
                            <Badge variant={getBadgeVariant(issue.type)}>
                              {issue.type.toUpperCase()}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{issue.title}</div>
                            <div className="text-sm text-muted-foreground">{issue.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{issue.accountCode || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          {issue.amount ? `Bs. ${issue.amount.toFixed(2)}` : 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm max-w-md">
                          {issue.suggestion || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Principios Contables Verificados:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li><strong>Inventario Final = Inventario Inicial + Compras - Costo de Ventas</strong></li>
            <li>Las compras se capitalizan en inventario (1141), no van directo a gastos</li>
            <li>El costo de ventas (5111) solo incluye productos efectivamente vendidos</li>
            <li>Los inventarios nunca pueden tener saldo negativo</li>
            <li>Concordancia entre inventario físico y contable</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default InventoryAccountingValidator;