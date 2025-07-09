import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';

interface ValidationResult {
  module: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  count?: number;
}

const SystemValidation = () => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { getAsientos, obtenerProductos, getBalanceSheetData } = useContabilidadIntegration();

  const validateSystem = () => {
    setIsValidating(true);
    const results: ValidationResult[] = [];

    try {
      // Validar asientos contables
      const asientos = getAsientos();
      if (asientos.length > 0) {
        results.push({
          module: 'Libro Diario',
          status: 'success',
          message: `${asientos.length} asientos registrados`,
          count: asientos.length
        });
      } else {
        results.push({
          module: 'Libro Diario',
          status: 'warning',
          message: 'No hay asientos registrados'
        });
      }

      // Validar productos
      const productos = obtenerProductos();
      if (productos.length > 0) {
        const productosActivos = productos.filter(p => p.activo);
        results.push({
          module: 'Productos',
          status: 'success',
          message: `${productosActivos.length} productos activos`,
          count: productosActivos.length
        });
      } else {
        results.push({
          module: 'Productos',
          status: 'warning',
          message: 'No hay productos registrados'
        });
      }

      // Validar clientes
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      if (clientes.length > 0) {
        results.push({
          module: 'Clientes',
          status: 'success',
          message: `${clientes.length} clientes registrados`,
          count: clientes.length
        });
      } else {
        results.push({
          module: 'Clientes',
          status: 'warning',
          message: 'No hay clientes registrados'
        });
      }

      // Validar facturas
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      if (facturas.length > 0) {
        const facturasVigentes = facturas.filter((f: any) => f.estado !== 'anulada');
        results.push({
          module: 'Facturación',
          status: 'success',
          message: `${facturasVigentes.length} facturas vigentes`,
          count: facturasVigentes.length
        });
      } else {
        results.push({
          module: 'Facturación',
          status: 'warning',
          message: 'No hay facturas registradas'
        });
      }

      // Validar compras
      const compras = JSON.parse(localStorage.getItem('compras') || '[]');
      if (compras.length > 0) {
        results.push({
          module: 'Compras',
          status: 'success',
          message: `${compras.length} compras registradas`,
          count: compras.length
        });
      } else {
        results.push({
          module: 'Compras',
          status: 'warning',
          message: 'No hay compras registradas'
        });
      }

      // Validar comprobantes
      const comprobantes = JSON.parse(localStorage.getItem('comprobantes') || '[]');
      if (comprobantes.length > 0) {
        const comprobantesAutorizados = comprobantes.filter((c: any) => c.estado === 'autorizado');
        results.push({
          module: 'Comprobantes',
          status: 'success',
          message: `${comprobantesAutorizados.length} comprobantes autorizados`,
          count: comprobantesAutorizados.length
        });
      } else {
        results.push({
          module: 'Comprobantes',
          status: 'warning',
          message: 'No hay comprobantes registrados'
        });
      }

      // Validar balance contable
      try {
        const balance = getBalanceSheetData();
        const ecuacionBalanceada = Math.abs(balance.activos.total - (balance.pasivos.total + balance.patrimonio.total)) < 0.01;
        
        if (ecuacionBalanceada) {
          results.push({
            module: 'Balance General',
            status: 'success',
            message: 'Ecuación contable balanceada'
          });
        } else {
          results.push({
            module: 'Balance General',
            status: 'error',
            message: 'Ecuación contable desbalanceada'
          });
        }
      } catch (error) {
        results.push({
          module: 'Balance General',
          status: 'error',
          message: 'Error al calcular balance'
        });
      }

      // Validar respaldos
      const ultimoBackup = localStorage.getItem('ultimo-backup');
      if (ultimoBackup) {
        const fechaBackup = new Date(ultimoBackup);
        const diasSinBackup = Math.floor((Date.now() - fechaBackup.getTime()) / (24 * 60 * 60 * 1000));
        
        if (diasSinBackup <= 7) {
          results.push({
            module: 'Respaldos',
            status: 'success',
            message: `Último respaldo hace ${diasSinBackup} días`
          });
        } else {
          results.push({
            module: 'Respaldos',
            status: 'warning',
            message: `Último respaldo hace ${diasSinBackup} días`
          });
        }
      } else {
        results.push({
          module: 'Respaldos',
          status: 'error',
          message: 'No se ha realizado ningún respaldo'
        });
      }

      setValidationResults(results);
    } catch (error) {
      console.error('Error en validación del sistema:', error);
      results.push({
        module: 'Sistema',
        status: 'error',
        message: 'Error general en la validación'
      });
      setValidationResults(results);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateSystem();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const successCount = validationResults.filter(r => r.status === 'success').length;
  const warningCount = validationResults.filter(r => r.status === 'warning').length;
  const errorCount = validationResults.filter(r => r.status === 'error').length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Estado del Sistema</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={validateSystem}
          disabled={isValidating}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
          {isValidating ? 'Validando...' : 'Revalidar'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-muted-foreground">Correctos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-muted-foreground">Advertencias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-muted-foreground">Errores</div>
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-2">
          {validationResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <div className="font-medium text-sm">{result.module}</div>
                  <div className="text-xs text-muted-foreground">{result.message}</div>
                </div>
              </div>
              <Badge className={getStatusColor(result.status)}>
                {result.status === 'success' ? 'OK' : 
                 result.status === 'warning' ? 'ADVERTENCIA' : 'ERROR'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemValidation;