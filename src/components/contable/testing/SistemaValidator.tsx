import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, AlertTriangle, RefreshCw, Database, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationIssue {
  module: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  solution?: string;
}

const SistemaValidator = () => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [systemHealth, setSystemHealth] = useState<number>(0);
  const { toast } = useToast();

  const ejecutarValidacion = async () => {
    setIsValidating(true);
    const foundIssues: ValidationIssue[] = [];

    try {
      // 1. Validar Plan de Cuentas
      await validatePlanCuentas(foundIssues);
      
      // 2. Validar Asientos Contables
      await validateAsientosContables(foundIssues);
      
      // 3. Validar Balances
      await validateBalances(foundIssues);
      
      // 4. Validar Inventario
      await validateInventario(foundIssues);
      
      // 5. Validar Facturación
      await validateFacturacion(foundIssues);
      
      // 6. Validar Compras
      await validateCompras(foundIssues);
      
      // 7. Validar Integración
      await validateIntegracion(foundIssues);

      setIssues(foundIssues);
      
      // Calcular salud del sistema
      const errors = foundIssues.filter(i => i.type === 'error').length;
      const warnings = foundIssues.filter(i => i.type === 'warning').length;
      const health = Math.max(0, 100 - (errors * 20) - (warnings * 5));
      setSystemHealth(health);

      toast({
        title: "Validación Completada",
        description: `Encontrados: ${errors} errores, ${warnings} advertencias`,
        variant: errors > 0 ? "destructive" : "default"
      });

    } catch (error) {
      console.error("Error en validación:", error);
      toast({
        title: "Error en Validación",
        description: "Error crítico durante la validación del sistema",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const validatePlanCuentas = async (issues: ValidationIssue[]) => {
    const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
    
    if (planCuentas.length === 0) {
      issues.push({
        module: 'Plan de Cuentas',
        type: 'error',
        message: 'Plan de cuentas no inicializado',
        solution: 'Inicializar el sistema desde Configuración'
      });
      return;
    }

    // Verificar cuentas esenciales
    const cuentasEsenciales = ['1111', '1112', '1131', '2111', '3111', '4111', '5111'];
    const cuentasFaltantes = cuentasEsenciales.filter(codigo => 
      !planCuentas.find((c: any) => c.codigo === codigo)
    );

    if (cuentasFaltantes.length > 0) {
      issues.push({
        module: 'Plan de Cuentas',
        type: 'warning',
        message: `Faltan cuentas esenciales: ${cuentasFaltantes.join(', ')}`,
        solution: 'Agregar las cuentas faltantes en el módulo Plan de Cuentas'
      });
    }

    // Verificar cuentas duplicadas
    const codigos = planCuentas.map((c: any) => c.codigo);
    const duplicados = codigos.filter((codigo: string, index: number) => 
      codigos.indexOf(codigo) !== index
    );

    if (duplicados.length > 0) {
      issues.push({
        module: 'Plan de Cuentas',
        type: 'error',
        message: `Cuentas duplicadas: ${[...new Set(duplicados)].join(', ')}`,
        solution: 'Eliminar las cuentas duplicadas'
      });
    }

    issues.push({
      module: 'Plan de Cuentas',
      type: 'info',
      message: `Plan de cuentas configurado con ${planCuentas.length} cuentas`
    });
  };

  const validateAsientosContables = async (issues: ValidationIssue[]) => {
    const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
    
    if (asientos.length === 0) {
      issues.push({
        module: 'Asientos Contables',
        type: 'info',
        message: 'No hay asientos contables registrados'
      });
      return;
    }

    let asientosDesbalanceados = 0;
    let totalDebe = 0;
    let totalHaber = 0;

    asientos.forEach((asiento: any) => {
      const debe = asiento.cuentas.reduce((sum: number, c: any) => sum + (c.debe || 0), 0);
      const haber = asiento.cuentas.reduce((sum: number, c: any) => sum + (c.haber || 0), 0);
      
      totalDebe += debe;
      totalHaber += haber;
      
      if (Math.abs(debe - haber) > 0.01) {
        asientosDesbalanceados++;
      }
    });

    if (asientosDesbalanceados > 0) {
      issues.push({
        module: 'Asientos Contables',
        type: 'error',
        message: `${asientosDesbalanceados} asientos desbalanceados`,
        solution: 'Revisar y corregir los asientos con diferencias entre debe y haber'
      });
    }

    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      issues.push({
        module: 'Asientos Contables',
        type: 'error',
        message: `Balance general desbalanceado: Debe ${totalDebe.toFixed(2)} vs Haber ${totalHaber.toFixed(2)}`,
        solution: 'Revisar todos los asientos contables'
      });
    } else {
      issues.push({
        module: 'Asientos Contables',
        type: 'info',
        message: `${asientos.length} asientos contables balanceados correctamente`
      });
    }
  };

  const validateBalances = async (issues: ValidationIssue[]) => {
    try {
      const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');

      if (planCuentas.length === 0 || asientos.length === 0) {
        issues.push({
          module: 'Balances',
          type: 'warning',
          message: 'Datos insuficientes para validar balances'
        });
        return;
      }

      // Calcular saldos por cuenta
      const saldosPorCuenta = new Map();

      asientos.forEach((asiento: any) => {
        asiento.cuentas.forEach((cuenta: any) => {
          const saldoActual = saldosPorCuenta.get(cuenta.codigo) || 0;
          const cuentaInfo = planCuentas.find((c: any) => c.codigo === cuenta.codigo);
          
          if (cuentaInfo) {
            if (cuentaInfo.naturaleza === 'deudora') {
              saldosPorCuenta.set(cuenta.codigo, saldoActual + cuenta.debe - cuenta.haber);
            } else {
              saldosPorCuenta.set(cuenta.codigo, saldoActual + cuenta.haber - cuenta.debe);
            }
          }
        });
      });

      // Calcular totales por tipo
      let activos = 0;
      let pasivos = 0;
      let patrimonio = 0;
      let ingresos = 0;
      let gastos = 0;

      planCuentas.forEach((cuenta: any) => {
        const saldo = saldosPorCuenta.get(cuenta.codigo) || 0;
        
        switch (cuenta.tipo) {
          case 'activo':
            activos += saldo;
            break;
          case 'pasivo':
            pasivos += saldo;
            break;
          case 'patrimonio':
            patrimonio += saldo;
            break;
          case 'ingresos':
            ingresos += saldo;
            break;
          case 'gastos':
            gastos += saldo;
            break;
        }
      });

      const diferenciaBalance = Math.abs(activos - (pasivos + patrimonio));
      
      if (diferenciaBalance > 0.01) {
        issues.push({
          module: 'Balance General',
          type: 'error',
          message: `Balance desbalanceado: Activos ${activos.toFixed(2)} ≠ Pasivos+Patrimonio ${(pasivos + patrimonio).toFixed(2)}`,
          solution: 'Revisar asientos contables para corregir el desbalance'
        });
      } else {
        issues.push({
          module: 'Balance General',
          type: 'info',
          message: `Balance cuadrado: Activos Bs. ${activos.toFixed(2)}`
        });
      }

    } catch (error) {
      issues.push({
        module: 'Balances',
        type: 'error',
        message: `Error al validar balances: ${error}`,
        solution: 'Verificar integridad de los datos contables'
      });
    }
  };

  const validateInventario = async (issues: ValidationIssue[]) => {
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const movimientos = JSON.parse(localStorage.getItem('movimientosInventario') || '[]');

    if (productos.length === 0) {
      issues.push({
        module: 'Inventario',
        type: 'warning',
        message: 'No hay productos registrados'
      });
      return;
    }

    let productosStockNegativo = 0;
    let productosStockBajo = 0;

    productos.forEach((producto: any) => {
      if (producto.stockActual < 0) {
        productosStockNegativo++;
      } else if (producto.stockActual <= producto.stockMinimo) {
        productosStockBajo++;
      }
    });

    if (productosStockNegativo > 0) {
      issues.push({
        module: 'Inventario',
        type: 'error',
        message: `${productosStockNegativo} productos con stock negativo`,
        solution: 'Revisar movimientos de inventario y corregir stocks'
      });
    }

    if (productosStockBajo > 0) {
      issues.push({
        module: 'Inventario',
        type: 'warning',
        message: `${productosStockBajo} productos con stock bajo`,
        solution: 'Considerar realizar pedidos de reposición'
      });
    }

    issues.push({
      module: 'Inventario',
      type: 'info',
      message: `${productos.length} productos, ${movimientos.length} movimientos registrados`
    });
  };

  const validateFacturacion = async (issues: ValidationIssue[]) => {
    const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');

    if (facturas.length === 0) {
      issues.push({
        module: 'Facturación',
        type: 'info',
        message: 'No hay facturas registradas'
      });
      return;
    }

    let facturasConErrores = 0;
    let totalVentas = 0;

    facturas.forEach((factura: any) => {
      // Verificar cálculos
      const subtotalCalculado = factura.items?.reduce((sum: number, item: any) => 
        sum + (item.cantidad * item.precioUnitario), 0) || 0;
      
      if (Math.abs(subtotalCalculado - factura.subtotal) > 0.01) {
        facturasConErrores++;
      }

      totalVentas += factura.total || 0;
    });

    if (facturasConErrores > 0) {
      issues.push({
        module: 'Facturación',
        type: 'error',
        message: `${facturasConErrores} facturas con errores de cálculo`,
        solution: 'Revisar y recalcular las facturas afectadas'
      });
    }

    issues.push({
      module: 'Facturación',
      type: 'info',
      message: `${facturas.length} facturas por Bs. ${totalVentas.toFixed(2)}, ${clientes.length} clientes`
    });
  };

  const validateCompras = async (issues: ValidationIssue[]) => {
    const compras = JSON.parse(localStorage.getItem('compras') || '[]');
    const proveedores = JSON.parse(localStorage.getItem('proveedores') || '[]');

    if (compras.length === 0) {
      issues.push({
        module: 'Compras',
        type: 'info',
        message: 'No hay compras registradas'
      });
      return;
    }

    let comprasConErrores = 0;
    let totalCompras = 0;

    compras.forEach((compra: any) => {
      const subtotalCalculado = compra.items?.reduce((sum: number, item: any) => 
        sum + (item.cantidad * item.precioUnitario), 0) || 0;
      
      if (Math.abs(subtotalCalculado - compra.subtotal) > 0.01) {
        comprasConErrores++;
      }

      totalCompras += compra.total || 0;
    });

    if (comprasConErrores > 0) {
      issues.push({
        module: 'Compras',
        type: 'error',
        message: `${comprasConErrores} compras con errores de cálculo`,
        solution: 'Revisar y recalcular las compras afectadas'
      });
    }

    issues.push({
      module: 'Compras',
      type: 'info',
      message: `${compras.length} compras por Bs. ${totalCompras.toFixed(2)}, ${proveedores.length} proveedores`
    });
  };

  const validateIntegracion = async (issues: ValidationIssue[]) => {
    const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
    const compras = JSON.parse(localStorage.getItem('compras') || '[]');
    const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');

    // Verificar que las facturas tengan asientos
    const facturasConAsientos = facturas.filter((factura: any) => 
      asientos.some((asiento: any) => asiento.referencia === factura.numero)
    );

    if (facturasConAsientos.length < facturas.length) {
      issues.push({
        module: 'Integración Contable',
        type: 'warning',
        message: `${facturas.length - facturasConAsientos.length} facturas sin asientos contables`,
        solution: 'Regenerar asientos contables desde el módulo de facturación'
      });
    }

    // Verificar que las compras tengan asientos
    const comprasConAsientos = compras.filter((compra: any) => 
      asientos.some((asiento: any) => asiento.referencia === compra.numero)
    );

    if (comprasConAsientos.length < compras.length) {
      issues.push({
        module: 'Integración Contable',
        type: 'warning',
        message: `${compras.length - comprasConAsientos.length} compras sin asientos contables`,
        solution: 'Regenerar asientos contables desde el módulo de compras'
      });
    }

    issues.push({
      module: 'Integración Contable',
      type: 'info',
      message: `Integración: ${asientos.length} asientos, ${comprobantes.length} comprobantes`
    });
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (health: number) => {
    if (health >= 90) return 'Excelente';
    if (health >= 70) return 'Bueno';
    if (health >= 50) return 'Regular';
    return 'Crítico';
  };

  useEffect(() => {
    ejecutarValidacion();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Validador del Sistema Contable
          </CardTitle>
          <CardDescription>
            Diagnóstico completo del estado y salud del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getHealthColor(systemHealth)}`}>
                  {systemHealth}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Salud del Sistema
                </div>
                <Badge variant={systemHealth >= 70 ? "default" : "destructive"}>
                  {getHealthStatus(systemHealth)}
                </Badge>
              </div>
            </div>
            
            <Button 
              onClick={ejecutarValidacion}
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
              {isValidating ? 'Validando...' : 'Revalidar Sistema'}
            </Button>
          </div>

          {issues.length > 0 && (
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <Alert key={index} variant={issue.type === 'error' ? 'destructive' : 'default'}>
                  {issue.type === 'error' && <AlertCircle className="h-4 w-4" />}
                  {issue.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                  {issue.type === 'info' && <Info className="h-4 w-4" />}
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-medium">{issue.module}:</span> {issue.message}
                        {issue.solution && (
                          <div className="text-sm mt-1 text-muted-foreground">
                            <strong>Solución:</strong> {issue.solution}
                          </div>
                        )}
                      </div>
                      <Badge variant={
                        issue.type === 'error' ? 'destructive' : 
                        issue.type === 'warning' ? 'secondary' : 'outline'
                      }>
                        {issue.type.toUpperCase()}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Resumen de Validación:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {issues.filter(i => i.type === 'error').length}
                </div>
                <div className="text-muted-foreground">Errores</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {issues.filter(i => i.type === 'warning').length}
                </div>
                <div className="text-muted-foreground">Advertencias</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {issues.filter(i => i.type === 'info').length}
                </div>
                <div className="text-muted-foreground">Información</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SistemaValidator;