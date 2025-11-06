import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw, Link, Database, Calculator } from 'lucide-react';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import { useToast } from '@/hooks/use-toast';

interface IntegrationIssue {
  module: string;
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  suggestion: string;
}

const ModuleIntegrationValidator = () => {
  const [issues, setIssues] = useState<IntegrationIssue[]>([]);
  const [validationStatus, setValidationStatus] = useState<'checking' | 'completed'>('checking');
  const { toast } = useToast();
  
  const {
    getAsientos,
    getBalanceSheetData,
    obtenerProductos,
    getTrialBalanceData
  } = useContabilidadIntegration();

  useEffect(() => {
    validateIntegration();
  }, []);

  const validateIntegration = () => {
    setValidationStatus('checking');
    const foundIssues: IntegrationIssue[] = [];
    
    // 1. Validar Balance General
    const balanceData = getBalanceSheetData();
    if (!balanceData.ecuacionCuadrada) {
      foundIssues.push({
        module: 'Balance General',
        issue: `Balance descuadrado: A=${balanceData.activos.total.toFixed(2)} ≠ P+E=${balanceData.totalPasivoPatrimonio.toFixed(2)}`,
        severity: 'critical',
        suggestion: 'Revisar asientos contables y verificar que estén balanceados'
      });
    }

    // 2. Validar inventario
    const productos = obtenerProductos();
    const inventarioCuenta = balanceData.activos.cuentas.find(c => c.codigo === '1131');
    
    if (productos.length > 0) {
      const valorInventarioFisico = productos.reduce((sum, p) => sum + (p.stockActual || 0) * (p.costoUnitario || 0), 0);
      
      if (!inventarioCuenta && valorInventarioFisico > 0) {
        foundIssues.push({
          module: 'Inventario',
          issue: 'Inventario físico existe pero no aparece en Balance General',
          severity: 'warning',
          suggestion: 'La cuenta 1131 (Inventarios - Mercaderías) debe reflejar el valor del inventario físico'
        });
      }
      
      if (inventarioCuenta && Math.abs(inventarioCuenta.saldo - valorInventarioFisico) > 0.01) {
        foundIssues.push({
          module: 'Inventario',
          issue: `Discrepancia inventario: Contable=${inventarioCuenta.saldo.toFixed(2)} vs Físico=${valorInventarioFisico.toFixed(2)}`,
          severity: 'warning',
          suggestion: 'Sincronizar inventario físico con contable'
        });
      }
    }

    // 3. Validar asientos contables
    const asientos = getAsientos();
    const asientosDesbalanceados = asientos.filter(a => {
      const totalDebe = a.cuentas.reduce((sum, c) => sum + c.debe, 0);
      const totalHaber = a.cuentas.reduce((sum, c) => sum + c.haber, 0);
      return Math.abs(totalDebe - totalHaber) > 0.01;
    });

    if (asientosDesbalanceados.length > 0) {
      foundIssues.push({
        module: 'Libro Diario',
        issue: `${asientosDesbalanceados.length} asientos desbalanceados`,
        severity: 'critical',
        suggestion: 'Corregir asientos donde Debe ≠ Haber'
      });
    }

    // 4. Validar Balance de Comprobación
    const { totals } = getTrialBalanceData();
    if (Math.abs(totals.sumaDebe - totals.sumaHaber) > 0.01) {
      foundIssues.push({
        module: 'Balance de Comprobación',
        issue: 'Sumas de Debe y Haber no coinciden',
        severity: 'critical',
        suggestion: 'Revisar todos los asientos contables'
      });
    }

    // 5. Validar conectividad entre módulos
    const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
    const compras = JSON.parse(localStorage.getItem('compras') || '[]');
    
    const facturasConAsientos = facturas.filter((f: any) => 
      asientos.some(a => a.referencia === f.numero)
    );
    
    if (facturas.length > 0 && facturasConAsientos.length < facturas.length) {
      foundIssues.push({
        module: 'Facturación',
        issue: `${facturas.length - facturasConAsientos.length} facturas sin asientos contables`,
        severity: 'warning',
        suggestion: 'Verificar generación automática de asientos'
      });
    }

    setIssues(foundIssues);
    setValidationStatus('completed');
    
    if (foundIssues.length === 0) {
      toast({
        title: "✅ Sistema Integrado Correctamente",
        description: "Todos los módulos están conectados y funcionando bien",
      });
    } else {
      toast({
        title: `⚠️ ${foundIssues.length} problemas de integración detectados`,
        description: "Revisar los detalles para corregir",
        variant: "destructive"
      });
    }
  };

  const criticalIssues = issues.filter(i => i.severity === 'critical').length;
  const warningIssues = issues.filter(i => i.severity === 'warning').length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Validador de Integración de Módulos
        </CardTitle>
        <CardDescription>
          Verificación de conectividad y consistencia entre todos los módulos contables
        </CardDescription>
        <div className="flex gap-2">
          <Badge variant={criticalIssues > 0 ? "destructive" : "secondary"}>
            {criticalIssues} críticos
          </Badge>
          <Badge variant={warningIssues > 0 ? "default" : "secondary"}>
            {warningIssues} advertencias
          </Badge>
          <Badge variant={issues.length === 0 ? "default" : "secondary"}>
            {validationStatus === 'checking' ? 'Validando...' : 'Completado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {validationStatus === 'checking' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : issues.length === 0 ? (
              <CheckCircle className="w-4 h-4 text-success" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-warning" />
            )}
            <span className="font-medium">
              {validationStatus === 'checking' 
                ? 'Validando integración...' 
                : issues.length === 0 
                  ? 'Sistema completamente integrado'
                  : `${issues.length} problemas detectados`
              }
            </span>
          </div>
          <Button 
            onClick={validateIntegration} 
            size="sm" 
            variant="outline"
            disabled={validationStatus === 'checking'}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-validar
          </Button>
        </div>

        {issues.length > 0 && (
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <Card key={index} className={`border-l-4 ${
                issue.severity === 'critical' 
                  ? 'border-l-destructive bg-destructive/5' 
                  : issue.severity === 'warning'
                    ? 'border-l-warning bg-warning/5'
                    : 'border-l-info bg-info/5'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {issue.severity === 'critical' ? (
                      <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    ) : issue.severity === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                    ) : (
                      <Database className="w-5 h-5 text-info mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {issue.module}
                        </Badge>
                        <Badge variant={
                          issue.severity === 'critical' ? 'destructive' : 
                          issue.severity === 'warning' ? 'default' : 'secondary'
                        } className="text-xs">
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm mb-1">{issue.issue}</p>
                      <p className="text-xs text-muted-foreground">
                        💡 {issue.suggestion}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {issues.length === 0 && validationStatus === 'completed' && (
          <Card className="border-l-4 border-l-success bg-success/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-success">Sistema perfectamente integrado</p>
                  <p className="text-sm text-success/80">
                    ✅ Balance cuadrado • ✅ Inventario sincronizado • ✅ Asientos balanceados • ✅ Módulos conectados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default ModuleIntegrationValidator;