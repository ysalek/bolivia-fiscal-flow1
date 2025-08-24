import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, XCircle, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAsientos } from "@/hooks/useAsientos";
import { ProductoInventario } from "../inventory/InventoryData";

interface ValidationResult {
  type: 'error' | 'warning' | 'success';
  message: string;
  details?: string;
  accountCode?: string;
  amount?: number;
}

const InventoryValidator = () => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { getAsientos } = useAsientos();
  const { toast } = useToast();

  const validateInventoryAccounting = () => {
    setIsValidating(true);
    const results: ValidationResult[] = [];

    try {
      // Obtener datos
      const asientos = getAsientos().filter(a => a.estado === 'registrado');
      const productos = JSON.parse(localStorage.getItem('productos') || '[]') as ProductoInventario[];
      const movimientos = JSON.parse(localStorage.getItem('movimientosInventario') || '[]');

      // 1. Validar saldos de inventario no negativos
      const inventoryAccounts = asientos.flatMap(a => a.cuentas.filter(c => c.codigo === '1141'));
      let inventoryBalance = 0;
      
      inventoryAccounts.forEach(cuenta => {
        inventoryBalance += cuenta.debe - cuenta.haber;
      });

      if (inventoryBalance < 0) {
        results.push({
          type: 'error',
          message: 'Saldo negativo en cuenta de Inventarios (1141)',
          details: `El saldo contable de inventarios es negativo: Bs. ${inventoryBalance.toFixed(2)}. Esto viola principios contables básicos.`,
          accountCode: '1141',
          amount: inventoryBalance
        });
      } else {
        results.push({
          type: 'success',
          message: 'Saldo de inventarios positivo',
          details: `Saldo contable correcto: Bs. ${inventoryBalance.toFixed(2)}`,
          accountCode: '1141',
          amount: inventoryBalance
        });
      }

      // 2. Validar que costo de ventas solo incluya ventas reales
      const costoVentasAccounts = asientos.flatMap(a => a.cuentas.filter(c => c.codigo === '5111'));
      let costoVentasBalance = 0;
      let ventasRealesBalance = 0;

      costoVentasAccounts.forEach(cuenta => {
        costoVentasBalance += cuenta.debe - cuenta.haber;
      });

      // Calcular ventas reales (cuenta 4111)
      const ventasAccounts = asientos.flatMap(a => a.cuentas.filter(c => c.codigo === '4111'));
      ventasAccounts.forEach(cuenta => {
        ventasRealesBalance += cuenta.haber - cuenta.debe;
      });

      // Verificar proporcionalidad razonable (costo no debe exceder ventas)
      if (costoVentasBalance > ventasRealesBalance * 0.9) {
        results.push({
          type: 'warning',
          message: 'Costo de ventas muy alto respecto a ventas',
          details: `Costo: Bs. ${costoVentasBalance.toFixed(2)}, Ventas: Bs. ${ventasRealesBalance.toFixed(2)}. Revisar si incluye movimientos no relacionados con ventas.`,
          accountCode: '5111',
          amount: costoVentasBalance
        });
      }

      // 3. Validar coherencia entre movimientos físicos y contables
      const totalValorFisico = productos.reduce((sum, p) => sum + (p.stockActual * p.costoUnitario), 0);
      
      if (Math.abs(inventoryBalance - totalValorFisico) > 10) {
        results.push({
          type: 'error',
          message: 'Desajuste entre inventario físico y contable',
          details: `Inventario físico: Bs. ${totalValorFisico.toFixed(2)}, Contable: Bs. ${inventoryBalance.toFixed(2)}. Diferencia: Bs. ${(inventoryBalance - totalValorFisico).toFixed(2)}`,
          accountCode: '1141'
        });
      } else {
        results.push({
          type: 'success',
          message: 'Inventario físico y contable concordantes',
          details: `Diferencia aceptable: Bs. ${Math.abs(inventoryBalance - totalValorFisico).toFixed(2)}`
        });
      }

      // 4. Validar asientos de salida por ventas
      const asientosVenta = asientos.filter(a => 
        a.concepto.toLowerCase().includes('venta') || 
        a.concepto.toLowerCase().includes('factura')
      );

      const ventasSinCosto = asientosVenta.filter(a => 
        !a.cuentas.some(c => c.codigo === '5111' && c.debe > 0)
      );

      if (ventasSinCosto.length > 0) {
        results.push({
          type: 'warning',
          message: `${ventasSinCosto.length} ventas sin registro de costo`,
          details: 'Hay ventas que no registraron el costo correspondiente en inventarios.'
        });
      }

    } catch (error) {
      results.push({
        type: 'error',
        message: 'Error durante la validación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    setValidationResults(results);
    setIsValidating(false);

    const errors = results.filter(r => r.type === 'error').length;
    const warnings = results.filter(r => r.type === 'warning').length;

    toast({
      title: "Validación completada",
      description: `${errors} errores, ${warnings} advertencias encontradas`,
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
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Validador de Integridad Contable - Inventarios
          </CardTitle>
          <CardDescription>
            Verificación automática de la correcta contabilización de inventarios según principios contables bolivianos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={validateInventoryAccounting}
              disabled={isValidating}
              className="w-full"
            >
              {isValidating ? 'Validando...' : 'Ejecutar Validación Integral'}
            </Button>

            {validationResults.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {validationResults.filter(r => r.type === 'error').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Errores Críticos</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {validationResults.filter(r => r.type === 'warning').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Advertencias</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {validationResults.filter(r => r.type === 'success').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Validaciones OK</div>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Cuenta</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Detalles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getIcon(result.type)}
                            <Badge variant={getBadgeVariant(result.type)}>
                              {result.type.toUpperCase()}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{result.message}</TableCell>
                        <TableCell>{result.accountCode || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          {result.amount ? `Bs. ${result.amount.toFixed(2)}` : 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-md">
                          {result.details}
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
          <strong>Importante:</strong> Esta validación verifica que:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>El saldo de inventarios (1141) nunca sea negativo</li>
            <li>El costo de ventas (5111) incluya SOLO productos vendidos</li>
            <li>Los inventarios físicos concuerden con los contables</li>
            <li>Todas las ventas tengan su costo correspondiente registrado</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default InventoryValidator;