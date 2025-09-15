import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Database, 
  Users, 
  FileText,
  DollarSign,
  ShoppingCart,
  Package,
  Calculator,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  module: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
  icon: any;
}

interface SystemHealth {
  overall: number;
  modules: ValidationResult[];
  criticalIssues: number;
  warnings: number;
}

const SystemValidator = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const { toast } = useToast();

  const validateSystemIntegrity = async (): Promise<SystemHealth> => {
    const results: ValidationResult[] = [];
    
    // Validar Base de Datos
    try {
      const response = await fetch('/api/health/database');
      results.push({
        module: 'Base de Datos',
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Conexión exitosa' : 'Error de conexión',
        details: response.ok ? 'Todas las tablas funcionando correctamente' : 'Verificar configuración de Supabase',
        icon: Database
      });
    } catch (error) {
      results.push({
        module: 'Base de Datos',
        status: 'error',
        message: 'Error de conectividad',
        details: 'No se pudo conectar con Supabase',
        icon: Database
      });
    }

    // Validar Módulo de Usuarios
    try {
      const users = JSON.parse(localStorage.getItem('usuarios') || '[]');
      results.push({
        module: 'Gestión de Usuarios',
        status: users.length > 0 ? 'success' : 'warning',
        message: `${users.length} usuarios registrados`,
        details: users.length === 0 ? 'Considere crear usuarios adicionales' : 'Sistema de usuarios operativo',
        icon: Users
      });
    } catch (error) {
      results.push({
        module: 'Gestión de Usuarios',
        status: 'error',
        message: 'Error al cargar usuarios',
        icon: Users
      });
    }

    // Validar Plan de Cuentas
    try {
      const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
      results.push({
        module: 'Plan de Cuentas',
        status: planCuentas.length >= 50 ? 'success' : 'warning',
        message: `${planCuentas.length} cuentas configuradas`,
        details: planCuentas.length < 50 ? 'Plan de cuentas incompleto' : 'Plan de cuentas boliviano actualizado',
        icon: FileText
      });
    } catch (error) {
      results.push({
        module: 'Plan de Cuentas',
        status: 'error',
        message: 'Error al cargar plan de cuentas',
        icon: FileText
      });
    }

    // Validar Productos
    try {
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      const productosActivos = productos.filter((p: any) => p.activo);
      results.push({
        module: 'Catálogo de Productos',
        status: productosActivos.length > 0 ? 'success' : 'warning',
        message: `${productosActivos.length} productos activos`,
        details: productos.length === 0 ? 'No hay productos registrados' : `${productos.length} productos totales`,
        icon: Package
      });
    } catch (error) {
      results.push({
        module: 'Catálogo de Productos',
        status: 'error',
        message: 'Error al cargar productos',
        icon: Package
      });
    }

    // Validar Clientes
    try {
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      results.push({
        module: 'Gestión de Clientes',
        status: clientes.length > 0 ? 'success' : 'warning',
        message: `${clientes.length} clientes registrados`,
        details: clientes.length === 0 ? 'Registre clientes para facturación' : 'Base de clientes establecida',
        icon: Users
      });
    } catch (error) {
      results.push({
        module: 'Gestión de Clientes',
        status: 'error',
        message: 'Error al cargar clientes',
        icon: Users
      });
    }

    // Validar Facturas
    try {
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      const facturasPendientes = facturas.filter((f: any) => f.estado === 'pendiente');
      results.push({
        module: 'Facturación',
        status: facturas.length > 0 ? 'success' : 'warning',
        message: `${facturas.length} facturas emitidas`,
        details: facturasPendientes.length > 0 ? `${facturasPendientes.length} pendientes de cobro` : 'Facturación actualizada',
        icon: FileText
      });
    } catch (error) {
      results.push({
        module: 'Facturación',
        status: 'error',
        message: 'Error al cargar facturas',
        icon: FileText
      });
    }

    // Validar Inventario
    try {
      const movimientos = JSON.parse(localStorage.getItem('movimientosInventario') || '[]');
      results.push({
        module: 'Control de Inventario',
        status: movimientos.length > 0 ? 'success' : 'warning',
        message: `${movimientos.length} movimientos registrados`,
        details: movimientos.length === 0 ? 'No hay movimientos de inventario' : 'Sistema de inventario activo',
        icon: Package
      });
    } catch (error) {
      results.push({
        module: 'Control de Inventario',
        status: 'error',
        message: 'Error al cargar inventario',
        icon: Package
      });
    }

    // Validar Contabilidad
    try {
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
      results.push({
        module: 'Registros Contables',
        status: asientos.length > 0 ? 'success' : 'warning',
        message: `${asientos.length} asientos contables`,
        details: asientos.length === 0 ? 'No hay registros contables' : 'Contabilidad operativa',
        icon: Calculator
      });
    } catch (error) {
      results.push({
        module: 'Registros Contables',
        status: 'error',
        message: 'Error al cargar contabilidad',
        icon: Calculator
      });
    }

    // Validar Compras
    try {
      const compras = JSON.parse(localStorage.getItem('compras') || '[]');
      results.push({
        module: 'Gestión de Compras',
        status: compras.length > 0 ? 'success' : 'warning',
        message: `${compras.length} compras registradas`,
        details: compras.length === 0 ? 'No hay compras registradas' : 'Módulo de compras operativo',
        icon: ShoppingCart
      });
    } catch (error) {
      results.push({
        module: 'Gestión de Compras',
        status: 'error',
        message: 'Error al cargar compras',
        icon: ShoppingCart
      });
    }

    // Calcular salud general del sistema
    const criticalIssues = results.filter(r => r.status === 'error').length;
    const warnings = results.filter(r => r.status === 'warning').length;
    const successful = results.filter(r => r.status === 'success').length;
    
    const overall = Math.round((successful / results.length) * 100);

    return {
      overall,
      modules: results,
      criticalIssues,
      warnings
    };
  };

  const runValidation = async () => {
    setIsValidating(true);
    try {
      const health = await validateSystemIntegrity();
      setSystemHealth(health);
      
      if (health.criticalIssues === 0) {
        toast({
          title: "Validación completada",
          description: `Sistema funcionando al ${health.overall}%`,
          variant: "default"
        });
      } else {
        toast({
          title: "Problemas detectados",
          description: `${health.criticalIssues} errores críticos encontrados`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error en validación",
        description: "No se pudo completar la validación del sistema",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    runValidation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Validador del Sistema</h2>
          <p className="text-muted-foreground">
            Verificación integral de la salud y funcionamiento del sistema contable
          </p>
        </div>
        <Button onClick={runValidation} disabled={isValidating}>
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validando...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Ejecutar Validación
            </>
          )}
        </Button>
      </div>

      {/* Health Summary */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Salud General</p>
                  <p className="text-2xl font-bold">{systemHealth.overall}%</p>
                </div>
              </div>
              <Progress value={systemHealth.overall} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium">Errores Críticos</p>
                  <p className="text-2xl font-bold">{systemHealth.criticalIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Advertencias</p>
                  <p className="text-2xl font-bold">{systemHealth.warnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Módulos OK</p>
                  <p className="text-2xl font-bold">
                    {systemHealth.modules.filter(m => m.status === 'success').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Results */}
      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados Detallados</CardTitle>
            <CardDescription>
              Estado individual de cada módulo del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.modules.map((result, index) => {
                const IconComponent = result.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <IconComponent className={`w-5 h-5 mt-0.5 ${
                      result.status === 'success' ? 'text-green-500' :
                      result.status === 'warning' ? 'text-yellow-500' :
                      'text-red-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{result.module}</h4>
                        <Badge variant={
                          result.status === 'success' ? 'default' :
                          result.status === 'warning' ? 'secondary' :
                          'destructive'
                        }>
                          {result.status === 'success' ? 'OK' :
                           result.status === 'warning' ? 'Advertencia' :
                           'Error'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.message}
                      </p>
                      {result.details && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.details}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {systemHealth && systemHealth.criticalIssues > 0 && (
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <strong>Acción requerida:</strong> Se detectaron {systemHealth.criticalIssues} errores críticos 
            que requieren atención inmediata para el correcto funcionamiento del sistema.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SystemValidator;