import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { useProductosValidated } from '@/hooks/useProductosValidated';
import { useAsientos } from '@/hooks/useAsientos';

interface ValidationResult {
  category: string;
  item: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

const SystemValidator = () => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { productos } = useProductosValidated();
  const { getAsientos } = useAsientos();

  const runFullValidation = async () => {
    setIsValidating(true);
    const results: ValidationResult[] = [];

    try {
      // 1. Validar productos
      console.log('🔍 Validando productos...');
      if (productos.length === 0) {
        results.push({
          category: 'Productos',
          item: 'Datos básicos',
          status: 'error',
          message: 'No se encontraron productos en el sistema',
          details: { count: 0 }
        });
      } else {
        const productosConCosto = productos.filter(p => (p.costo_unitario || 0) > 0);
        const productosConStock = productos.filter(p => (p.stock_actual || 0) > 0);
        
        results.push({
          category: 'Productos',
          item: 'Productos totales',
          status: 'success',
          message: `${productos.length} productos encontrados`,
          details: { count: productos.length }
        });

        if (productosConCosto.length === 0) {
          results.push({
            category: 'Productos',
            item: 'Costos unitarios',
            status: 'error',
            message: 'Ningún producto tiene costo unitario configurado',
            details: { withCost: 0, total: productos.length }
          });
        } else {
          results.push({
            category: 'Productos',
            item: 'Costos unitarios',
            status: productosConCosto.length === productos.length ? 'success' : 'warning',
            message: `${productosConCosto.length}/${productos.length} productos con costo unitario`,
            details: { withCost: productosConCosto.length, total: productos.length }
          });
        }

        results.push({
          category: 'Productos',
          item: 'Stock disponible',
          status: productosConStock.length > 0 ? 'success' : 'warning',
          message: `${productosConStock.length}/${productos.length} productos con stock`,
          details: { withStock: productosConStock.length, total: productos.length }
        });
      }

      // 2. Validar asientos contables
      console.log('🔍 Validando asientos contables...');
      const asientos = getAsientos();
      if (asientos.length === 0) {
        results.push({
          category: 'Contabilidad',
          item: 'Asientos contables',
          status: 'warning',
          message: 'No se encontraron asientos contables',
          details: { count: 0 }
        });
      } else {
        const asientosVenta = asientos.filter(a => a.concepto?.toLowerCase().includes('venta'));
        const asientosInventario = asientos.filter(a => a.concepto?.toLowerCase().includes('inventario'));
        const asientosCosto = asientos.filter(a => 
          a.cuentas?.some(c => c.codigo === '5111' || c.nombre?.toLowerCase().includes('costo'))
        );

        results.push({
          category: 'Contabilidad',
          item: 'Asientos totales',
          status: 'success',
          message: `${asientos.length} asientos contables encontrados`,
          details: { count: asientos.length }
        });

        results.push({
          category: 'Contabilidad',
          item: 'Asientos de venta',
          status: asientosVenta.length > 0 ? 'success' : 'warning',
          message: `${asientosVenta.length} asientos de venta`,
          details: { count: asientosVenta.length }
        });

        results.push({
          category: 'Contabilidad',
          item: 'Asientos de inventario',
          status: asientosInventario.length > 0 ? 'success' : 'warning',
          message: `${asientosInventario.length} asientos de inventario`,
          details: { count: asientosInventario.length }
        });

        results.push({
          category: 'Contabilidad',
          item: 'Asientos de costo de venta',
          status: asientosCosto.length > 0 ? 'success' : 'error',
          message: `${asientosCosto.length} asientos con costo de venta`,
          details: { count: asientosCosto.length }
        });
      }

      // 3. Validar facturas
      console.log('🔍 Validando facturas...');
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      if (facturas.length === 0) {
        results.push({
          category: 'Facturas',
          item: 'Facturas totales',
          status: 'warning',
          message: 'No se encontraron facturas',
          details: { count: 0 }
        });
      } else {
        const facturasAceptadas = facturas.filter((f: any) => f.estadoSIN === 'aceptado');
        
        results.push({
          category: 'Facturas',
          item: 'Facturas totales',
          status: 'success',
          message: `${facturas.length} facturas encontradas`,
          details: { count: facturas.length }
        });

        results.push({
          category: 'Facturas',
          item: 'Facturas aceptadas por SIN',
          status: facturasAceptadas.length > 0 ? 'success' : 'warning',
          message: `${facturasAceptadas.length}/${facturas.length} facturas aceptadas`,
          details: { accepted: facturasAceptadas.length, total: facturas.length }
        });
      }

      // 4. Validar saldos contables críticos
      console.log('🔍 Validando saldos contables...');
      const saldosInventario = asientos
        .flatMap(a => a.cuentas || [])
        .filter(c => c.codigo === '1141')
        .reduce((total, cuenta) => total + (cuenta.debe || 0) - (cuenta.haber || 0), 0);

      const saldosCostoVenta = asientos
        .flatMap(a => a.cuentas || [])
        .filter(c => c.codigo === '5111')
        .reduce((total, cuenta) => total + (cuenta.debe || 0) - (cuenta.haber || 0), 0);

      results.push({
        category: 'Saldos Contables',
        item: 'Saldo Inventarios (1141)',
        status: saldosInventario > 0 ? 'success' : 'error',
        message: `Bs. ${saldosInventario.toFixed(2)}`,
        details: { balance: saldosInventario }
      });

      results.push({
        category: 'Saldos Contables',
        item: 'Costo de Productos Vendidos (5111)',
        status: saldosCostoVenta > 0 ? 'success' : 'error',
        message: `Bs. ${saldosCostoVenta.toFixed(2)}`,
        details: { balance: saldosCostoVenta }
      });

      console.log('✅ Validación completa:', results);
      
    } catch (error) {
      console.error('❌ Error en validación:', error);
      results.push({
        category: 'Sistema',
        item: 'Error de validación',
        status: 'error',
        message: 'Error al ejecutar la validación del sistema',
        details: { error: error?.toString() }
      });
    }

    setValidationResults(results);
    setIsValidating(false);
  };

  useEffect(() => {
    runFullValidation();
  }, []);

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">OK</Badge>;
      case 'warning':
        return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">ADVERTENCIA</Badge>;
      case 'error':
        return <Badge variant="destructive">ERROR</Badge>;
    }
  };

  const groupedResults = validationResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, ValidationResult[]>);

  const errorCount = validationResults.filter(r => r.status === 'error').length;
  const warningCount = validationResults.filter(r => r.status === 'warning').length;
  const successCount = validationResults.filter(r => r.status === 'success').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Validador de Integridad del Sistema</span>
            <Button 
              onClick={runFullValidation} 
              disabled={isValidating}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
              {isValidating ? 'Validando...' : 'Revalidar'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Badge variant="default" className="bg-green-100 text-green-800">
              ✅ {successCount} Correctos
            </Badge>
            <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">
              ⚠️ {warningCount} Advertencias
            </Badge>
            <Badge variant="destructive">
              ❌ {errorCount} Errores
            </Badge>
          </div>

          {errorCount > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                <strong>Se encontraron {errorCount} errores críticos</strong> que pueden causar que los estados financieros no reflejen correctamente las transacciones. 
                Es necesario corregir estos problemas para garantizar la integridad contable.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {Object.entries(groupedResults).map(([category, results]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <div className="font-medium">{result.item}</div>
                            <div className="text-sm text-muted-foreground">{result.message}</div>
                            {result.details && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {JSON.stringify(result.details)}
                              </div>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemValidator;